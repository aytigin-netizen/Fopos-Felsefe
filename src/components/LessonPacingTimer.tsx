import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LessonPlanStage } from '../types/philosophy';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Clock,
  CheckCircle2,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface LessonPacingTimerProps {
  planTitle: string;
  stages: LessonPlanStage[];
}

interface AllocatedStage extends LessonPlanStage {
  minutes: number;
  startMinute: number;
  endMinute: number;
}

const TOTAL_LESSON_MINUTES = 40;

function parseMinutesFromPhase(phase: string): number | null {
  const match = phase.match(/(\d{1,3})\s*(?:dk|dakika)\b/i);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  return Number.isFinite(num) && num > 0 ? num : null;
}

function allocateStagesTo40Minutes(stages: LessonPlanStage[]): AllocatedStage[] {
  if (!stages || stages.length === 0) return [];

  const parsed = stages.map((s) => parseMinutesFromPhase(s.phase));
  const hasAnyParsed = parsed.some((v) => v !== null);

  let rawWeights: number[];
  if (hasAnyParsed) {
    const knownVals = parsed.filter((v): v is number => v !== null);
    const avg = knownVals.reduce((a, b) => a + b, 0) / knownVals.length;
    rawWeights = parsed.map((v) => (v !== null ? v : Math.max(4, Math.round(avg))));
  } else if (stages.length === 3) {
    // Default P4C 40-minute rhythm: 20% warmup, 55% main inquiry, 25% reflection
    rawWeights = [8, 22, 10];
  } else {
    rawWeights = stages.map(() => 1);
  }

  const weightSum = rawWeights.reduce((acc, w) => acc + w, 0) || stages.length;

  // Compute integer minutes >= 1 whose exact sum equals TOTAL_LESSON_MINUTES
  const allocated = rawWeights.map((w) =>
    Math.max(1, Math.round((w / weightSum) * TOTAL_LESSON_MINUTES))
  );

  let diff = TOTAL_LESSON_MINUTES - allocated.reduce((acc, m) => acc + m, 0);
  if (diff !== 0) {
    // Adjust the largest stage (or distribute +/-1 across stages) to hit 40 cleanly
    let guard = 0;
    while (diff !== 0 && guard < 100) {
      let targetIdx = 0;
      for (let i = 1; i < allocated.length; i++) {
        if (diff > 0 && allocated[i] >= allocated[targetIdx]) {
          targetIdx = i;
        } else if (diff < 0 && allocated[i] > allocated[targetIdx]) {
          targetIdx = i;
        }
      }
      if (diff > 0) {
        allocated[targetIdx] += 1;
        diff -= 1;
      } else if (allocated[targetIdx] > 1) {
        allocated[targetIdx] -= 1;
        diff += 1;
      } else {
        break;
      }
      guard++;
    }
  }

  let cursor = 0;
  return stages.map((stage, idx) => {
    const minutes = allocated[idx];
    const startMinute = cursor;
    const endMinute = cursor + minutes;
    cursor = endMinute;
    return {
      ...stage,
      minutes,
      startMinute,
      endMinute,
    };
  });
}

function formatMMSS(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const LessonPacingTimer: React.FC<LessonPacingTimerProps> = ({ planTitle, stages }) => {
  const allocatedStages = useMemo(() => allocateStagesTo40Minutes(stages), [stages]);
  const planSignature = `${planTitle}::${stages.map((s) => s.phase).join('|')}`;

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [stepRemainingSec, setStepRemainingSec] = useState<number>(
    () => (allocatedStages[0]?.minutes ?? TOTAL_LESSON_MINUTES) * 60
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTransitionChime = (isFinal = false) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      const now = ctx.currentTime;
      const notes = isFinal ? [523.25, 659.25, 783.99] : [587.33, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.11);
        gain.gain.setValueAtTime(0.001, now + idx * 0.11);
        gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.11 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.11 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.11);
        osc.stop(now + idx * 0.11 + 0.36);
      });
    } catch {
      // Ignore audio restrictions in locked browsers
    }
  };

  // Reset timer cleanly when switching or regenerating lesson plans
  useEffect(() => {
    setIsRunning(false);
    setIsCompleted(false);
    setCurrentStepIdx(0);
    setStepRemainingSec((allocatedStages[0]?.minutes ?? TOTAL_LESSON_MINUTES) * 60);
  }, [planSignature, allocatedStages]);

  // 1-second tick loop
  useEffect(() => {
    if (!isRunning || allocatedStages.length === 0) return;

    const timer = window.setInterval(() => {
      setStepRemainingSec((prev) => {
        if (prev > 1) return prev - 1;

        // Current step hit 0
        const hasNext = currentStepIdx < allocatedStages.length - 1;
        if (hasNext && autoAdvance) {
          const nextIdx = currentStepIdx + 1;
          playTransitionChime(false);
          setCurrentStepIdx(nextIdx);
          return allocatedStages[nextIdx].minutes * 60;
        }

        if (hasNext && !autoAdvance) {
          playTransitionChime(false);
          setIsRunning(false);
          return 0;
        }

        // Final step finished
        playTransitionChime(true);
        setIsRunning(false);
        setIsCompleted(true);
        return 0;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, currentStepIdx, autoAdvance, allocatedStages, soundEnabled]);

  if (allocatedStages.length === 0) return null;

  const activeStage = allocatedStages[currentStepIdx] || allocatedStages[0];
  const activeStepTotalSec = activeStage.minutes * 60;
  const activeStepElapsedSec = Math.max(0, activeStepTotalSec - stepRemainingSec);

  const priorMinutesSec = allocatedStages
    .slice(0, currentStepIdx)
    .reduce((acc, s) => acc + s.minutes * 60, 0);
  const totalLessonSec = TOTAL_LESSON_MINUTES * 60;
  const totalElapsedSec = isCompleted
    ? totalLessonSec
    : Math.min(totalLessonSec, priorMinutesSec + activeStepElapsedSec);
  const totalRemainingSec = Math.max(0, totalLessonSec - totalElapsedSec);

  const jumpToStep = (idx: number) => {
    if (idx < 0 || idx >= allocatedStages.length) return;
    setCurrentStepIdx(idx);
    setStepRemainingSec(allocatedStages[idx].minutes * 60);
    setIsCompleted(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setCurrentStepIdx(0);
    setStepRemainingSec(allocatedStages[0].minutes * 60);
  };

  return (
    <div className="space-y-4">
      {/* Live 40-Minute Pacing Console */}
      <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>40 Dakikalık Ders Kronometresi & Adım Takipçisi</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5 tabular-nums">
              Adım {currentStepIdx + 1} / {allocatedStages.length} ·{' '}
              {isCompleted
                ? 'Durum: 40 dakikalık ders tamamlandı'
                : isRunning
                ? 'Durum: Kronometre çalışıyor'
                : 'Durum: Hazır / Duraklatıldı'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setAutoAdvance((prev) => !prev)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                autoAdvance
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-stone-200'
              }`}
              title="Etap süresi bitince sonraki adıma otomatik geç"
            >
              Oto Geçiş: {autoAdvance ? 'Açık' : 'Kapalı'}
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              aria-label={soundEnabled ? 'Sesli uyarıyı kapat' : 'Sesli uyarıyı aç'}
              title={soundEnabled ? 'Etap geçiş zili açık' : 'Etap geçiş zili kapalı'}
              className="p-1.5 rounded-md border border-stone-800 bg-stone-900 text-stone-300 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Countdown Display & Playback Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] text-stone-400">
              Aktif Etap ({activeStage.startMinute}–{activeStage.endMinute}. dk):{' '}
              <span className="text-stone-200 font-semibold">{activeStage.phase}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono tabular-nums text-3xl font-bold tracking-tight text-amber-400">
                {formatMMSS(stepRemainingSec)}
              </span>
              <span className="text-[11px] font-mono tabular-nums text-stone-400">
                / {formatMMSS(activeStepTotalSec)} etap süresi
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono tabular-nums text-stone-400">
              <span>Toplam Geçen: {formatMMSS(totalElapsedSec)}</span>
              <span aria-hidden="true">·</span>
              <span>Derse Kalan: {formatMMSS(totalRemainingSec)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => jumpToStep(currentStepIdx - 1)}
              disabled={currentStepIdx === 0}
              title="Önceki adıma geç"
              className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-40 border border-stone-800 text-stone-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (isCompleted) {
                  jumpToStep(0);
                  setIsRunning(true);
                } else {
                  setIsRunning((prev) => !prev);
                }
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Duraklat</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'Yeniden Başlat' : totalElapsedSec > 0 ? 'Devam Et' : 'Başlat'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => jumpToStep(currentStepIdx + 1)}
              disabled={currentStepIdx >= allocatedStages.length - 1}
              title="Sonraki adıma geç"
              className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-40 border border-stone-800 text-stone-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleReset}
              title="Kronometreyi başa sıfırla"
              className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Proportional 40-Minute Segmented Progress Track */}
        <div className="space-y-1.5">
          <div className="h-2.5 w-full flex gap-1">
            {allocatedStages.map((stage, idx) => {
              const segWidthPct = (stage.minutes / TOTAL_LESSON_MINUTES) * 100;
              const isPast = isCompleted || idx < currentStepIdx;
              const isCurrent = !isCompleted && idx === currentStepIdx;
              const currentFillPct = isCurrent
                ? Math.min(100, Math.round((activeStepElapsedSec / (stage.minutes * 60)) * 100))
                : isPast
                ? 100
                : 0;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => jumpToStep(idx)}
                  title={`${stage.phase} (${stage.minutes} dk)`}
                  style={{ width: `${segWidthPct}%` }}
                  className="h-full bg-stone-800 rounded-sm overflow-hidden cursor-pointer relative group"
                >
                  <div
                    className={`h-full transition-all duration-300 ${
                      isPast ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                    style={{ width: `${currentFillPct}%` }}
                  />
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono tabular-nums text-stone-500">
            <span>00:00</span>
            <span>20:00 (Ders Ortası)</span>
            <span>40:00</span>
          </div>
        </div>
      </div>

      {/* Interactive Clickable Step-by-Step Stages List */}
      <div className="space-y-2">
        <span className="font-bold text-stone-400 block uppercase tracking-wider text-[11px]">
          Dersin Etapları (Adıma tıklayarak zamanlayıcıyı taşıyabilirsiniz):
        </span>
        {allocatedStages.map((stage, i) => {
          const isPast = isCompleted || i < currentStepIdx;
          const isCurrent = !isCompleted && i === currentStepIdx;

          return (
            <button
              key={i}
              type="button"
              onClick={() => jumpToStep(i)}
              className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer space-y-1.5 ${
                isCurrent
                  ? 'bg-amber-500/10 border-amber-500/60'
                  : isPast
                  ? 'bg-emerald-950/20 border-emerald-800/50 opacity-85'
                  : 'bg-stone-950/80 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <span
                      className={`w-5 h-5 rounded-full text-[11px] font-mono tabular-nums font-bold flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-amber-400 text-stone-950'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {i + 1}
                    </span>
                  )}
                  <span
                    className={`font-bold ${
                      isCurrent
                        ? 'text-amber-300'
                        : isPast
                        ? 'text-emerald-300'
                        : 'text-stone-200'
                    }`}
                  >
                    {stage.phase}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums">
                  <span className="text-stone-400">Rol: {stage.role}</span>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <span
                    className={`font-bold ${
                      isCurrent ? 'text-amber-300' : isPast ? 'text-emerald-300' : 'text-stone-300'
                    }`}
                  >
                    {stage.minutes} dk ({stage.startMinute}–{stage.endMinute})
                  </span>
                </div>
              </div>
              <p className="text-stone-300 text-xs leading-relaxed pl-7">{stage.activity}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
