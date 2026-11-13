import React, { useState, useEffect, useMemo } from 'react';
import {
  CurriculumTopic,
  GeneratedLessonPlan,
} from '../types/philosophy';
import {
  CalendarClock,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Target,
  Award,
  RotateCcw,
  SlidersHorizontal,
  Minus,
  Plus,
  CheckSquare,
  Square,
  Scale,
} from 'lucide-react';

interface LessonActivityTimelineProps {
  topic: CurriculumTopic;
  generatedPlan: GeneratedLessonPlan | null;
}

interface TimelineActivityItem {
  id: string;
  indexLabel: string;
  title: string;
  description: string;
  role: string;
  defaultMinutes: number;
  outcomeText: string;
  outcomeCode: string;
  processComponent: string;
  sbabTags: string[];
  valueOrLiteracyTag: string;
  tone: 'amber' | 'emerald' | 'sky' | 'stone';
}

const TARGET_LESSON_MINUTES = 40;

function extractOutcomeCode(text: string, fallbackCode: string): string {
  const match = text.match(/FEL\.\d+\.\d+\.\d+/);
  if (match) return match[0];
  const firstCode = fallbackCode.split('/')[0]?.trim();
  return firstCode || fallbackCode;
}

function extractSbabCodes(fieldSkills: string): string[] {
  const matches = fieldSkills.match(/SBAB\d+/g);
  return matches && matches.length > 0 ? Array.from(new Set(matches)) : ['SBAB14'];
}

function parseMinutesFromPhase(phase: string): number | null {
  const match = phase.match(/(\d{1,3})\s*(?:dk|dakika)\b/i);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  return Number.isFinite(num) && num > 0 ? num : null;
}

function normalizeMinutesToTarget(weights: number[], target: number): number[] {
  if (weights.length === 0) return [];
  const totalWeight = weights.reduce((acc, w) => acc + w, 0) || weights.length;
  const allocated = weights.map((w) => Math.max(2, Math.round((w / totalWeight) * target)));
  let diff = target - allocated.reduce((acc, m) => acc + m, 0);
  let guard = 0;

  while (diff !== 0 && guard < 120) {
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
    } else if (allocated[targetIdx] > 2) {
      allocated[targetIdx] -= 1;
      diff += 1;
    } else {
      break;
    }
    guard++;
  }
  return allocated;
}

function buildTimelineItems(
  topic: CurriculumTopic,
  generatedPlan: GeneratedLessonPlan | null
): TimelineActivityItem[] {
  const outcomes =
    generatedPlan?.learningOutcomes && generatedPlan.learningOutcomes.length > 0
      ? generatedPlan.learningOutcomes
      : topic.outcomes;
  const sbabTags = extractSbabCodes(topic.fieldSkills);
  const processList = topic.processComponents.length > 0 ? topic.processComponents : [topic.title];
  const tones: Array<'amber' | 'emerald' | 'sky' | 'stone'> = [
    'amber',
    'sky',
    'emerald',
    'stone',
  ];

  if (generatedPlan && generatedPlan.stages && generatedPlan.stages.length > 0) {
    const parsed = generatedPlan.stages.map((s) => parseMinutesFromPhase(s.phase));
    const hasAnyParsed = parsed.some((v) => v !== null);
    let weights: number[];
    if (hasAnyParsed) {
      const known = parsed.filter((v): v is number => v !== null);
      const avg = known.reduce((a, b) => a + b, 0) / known.length;
      weights = parsed.map((v) => (v !== null ? v : Math.max(5, Math.round(avg))));
    } else if (generatedPlan.stages.length === 3) {
      weights = [8, 22, 10];
    } else {
      weights = generatedPlan.stages.map(() => 1);
    }

    const minutesList = normalizeMinutesToTarget(weights, TARGET_LESSON_MINUTES);

    return generatedPlan.stages.map((stage, idx) => {
      const outcomeIdx = Math.min(outcomes.length - 1, Math.floor((idx * outcomes.length) / generatedPlan.stages.length));
      const outcomeText = outcomes[outcomeIdx] || topic.outcomes[0] || topic.title;
      const processText = processList[idx % processList.length];
      const valueTag =
        topic.values[idx % Math.max(1, topic.values.length)] ||
        topic.literacies[0] ||
        'TYMM Bütünsel Yaklaşım';

      return {
        id: `plan-stage-${topic.id}-${idx}`,
        indexLabel: String(idx + 1).padStart(2, '0'),
        title: stage.phase,
        description: stage.activity,
        role: stage.role,
        defaultMinutes: minutesList[idx],
        outcomeText,
        outcomeCode: extractOutcomeCode(outcomeText, topic.code),
        processComponent: processText,
        sbabTags,
        valueOrLiteracyTag: valueTag,
        tone: tones[idx % tones.length],
      };
    });
  }

  // Blueprint activities derived directly from selected TYMM topic
  const blueprint: Array<{
    title: string;
    description: string;
    role: string;
    minutes: number;
    outcomeIdx: number;
    processIdx: number;
    tag: string;
    tone: 'amber' | 'emerald' | 'sky' | 'stone';
  }> = [
    {
      title: 'P4C Soruşturma Açılışı & Uyaran',
      description: `Açılış sorusuyla merak uyandırma: ${topic.p4cQuestion}`,
      role: 'Soruşturma Kolaylaştırıcısı',
      minutes: 8,
      outcomeIdx: 0,
      processIdx: 0,
      tag: topic.tendencies[0] || 'E1.1. Merak',
      tone: 'amber',
    },
    {
      title: 'Kavramsal Analiz & Metin Muhakemesi',
      description: `${topic.keyConcepts.slice(0, 4).join(', ')} kavramları çerçevesinde ${processList[0]}`,
      role: 'Sokratik Rehber',
      minutes: 12,
      outcomeIdx: 0,
      processIdx: Math.min(1, processList.length - 1),
      tag: topic.literacies[0] || 'OB1. Bilgi Okuryazarlığı',
      tone: 'sky',
    },
    {
      title: 'Sınıf İçi Ana Uygulama Etkinliği',
      description: topic.activityIdea,
      role: 'Moderatör & Gözlemci',
      minutes: 14,
      outcomeIdx: Math.max(0, outcomes.length - 1),
      processIdx: processList.length - 1,
      tag: topic.values[0] || 'D16. Sorumluluk',
      tone: 'emerald',
    },
    {
      title: 'Farklılaştırma & Yansıtıcı Kapanış',
      description: `Zenginleştirme: ${topic.enrichment}`,
      role: 'Değerlendirici',
      minutes: 6,
      outcomeIdx: Math.max(0, outcomes.length - 1),
      processIdx: processList.length - 1,
      tag: topic.values[1] || topic.values[0] || 'D14. Saygı',
      tone: 'stone',
    },
  ];

  return blueprint.map((item, idx) => {
    const outcomeText = outcomes[item.outcomeIdx] || outcomes[0] || topic.title;
    return {
      id: `topic-act-${topic.id}-${idx}`,
      indexLabel: String(idx + 1).padStart(2, '0'),
      title: item.title,
      description: item.description,
      role: item.role,
      defaultMinutes: item.minutes,
      outcomeText,
      outcomeCode: extractOutcomeCode(outcomeText, topic.code),
      processComponent: processList[item.processIdx] || processList[0],
      sbabTags,
      valueOrLiteracyTag: item.tag,
      tone: item.tone,
    };
  });
}

const TONE_STYLES: Record<
  TimelineActivityItem['tone'],
  {
    block: string;
    selectedRing: string;
    laneBg: string;
    barAccent: string;
    codeText: string;
  }
> = {
  amber: {
    block: 'bg-amber-50 border-amber-300 text-stone-900 hover:border-amber-400',
    selectedRing: 'ring-2 ring-amber-500/40 border-amber-600 bg-amber-100/70',
    laneBg: 'bg-amber-50/70 border-amber-200',
    barAccent: 'bg-amber-500',
    codeText: 'text-amber-800',
  },
  sky: {
    block: 'bg-sky-50 border-sky-300 text-stone-900 hover:border-sky-400',
    selectedRing: 'ring-2 ring-sky-500/40 border-sky-600 bg-sky-100/70',
    laneBg: 'bg-sky-50/70 border-sky-200',
    barAccent: 'bg-sky-600',
    codeText: 'text-sky-800',
  },
  emerald: {
    block: 'bg-emerald-50 border-emerald-300 text-stone-900 hover:border-emerald-400',
    selectedRing: 'ring-2 ring-emerald-500/40 border-emerald-600 bg-emerald-100/70',
    laneBg: 'bg-emerald-50/70 border-emerald-200',
    barAccent: 'bg-emerald-600',
    codeText: 'text-emerald-800',
  },
  stone: {
    block: 'bg-stone-100 border-stone-300 text-stone-900 hover:border-stone-400',
    selectedRing: 'ring-2 ring-stone-500/40 border-stone-700 bg-stone-200/70',
    laneBg: 'bg-stone-100/80 border-stone-200',
    barAccent: 'bg-stone-700',
    codeText: 'text-stone-700',
  },
};

export const LessonActivityTimeline: React.FC<LessonActivityTimelineProps> = ({
  topic,
  generatedPlan,
}) => {
  const sourceItems = useMemo(
    () => buildTimelineItems(topic, generatedPlan),
    [topic, generatedPlan]
  );

  const sourceSignature = `${topic.id}::${generatedPlan?.title || 'blueprint'}::${sourceItems
    .map((i) => i.id)
    .join(',')}`;

  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    sourceItems.map((i) => i.id)
  );
  const [durationsById, setDurationsById] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const item of sourceItems) {
      map[item.id] = item.defaultMinutes;
    }
    return map;
  });
  const [focusedItemId, setFocusedItemId] = useState<string>(
    () => sourceItems[0]?.id || ''
  );
  const [outcomeFilter, setOutcomeFilter] = useState<string>('all');

  // Re-initialize timeline state cleanly when active unit or generated plan changes
  useEffect(() => {
    setSelectedIds(sourceItems.map((i) => i.id));
    const initialDurations: Record<string, number> = {};
    for (const item of sourceItems) {
      initialDurations[item.id] = item.defaultMinutes;
    }
    setDurationsById(initialDurations);
    setFocusedItemId(sourceItems[0]?.id || '');
    setOutcomeFilter('all');
  }, [sourceSignature, sourceItems]);

  const distinctOutcomes = useMemo(() => {
    const seen = new Map<string, string>();
    for (const item of sourceItems) {
      if (!seen.has(item.outcomeCode)) {
        seen.set(item.outcomeCode, item.outcomeText);
      }
    }
    return Array.from(seen.entries()).map(([code, text]) => ({ code, text }));
  }, [sourceItems]);

  const selectedItems = useMemo(
    () => sourceItems.filter((item) => selectedIds.includes(item.id)),
    [sourceItems, selectedIds]
  );

  const totalSelectedMinutes = selectedItems.reduce(
    (sum, item) => sum + (durationsById[item.id] ?? item.defaultMinutes),
    0
  );

  const scaleMaxMinutes = Math.max(TARGET_LESSON_MINUTES, totalSelectedMinutes);

  // Build sequential timeline segments with exact cumulative minute bounds
  const timelineSegments = useMemo(() => {
    let cursor = 0;
    return selectedItems.map((item) => {
      const minutes = durationsById[item.id] ?? item.defaultMinutes;
      const startMinute = cursor;
      const endMinute = cursor + minutes;
      cursor = endMinute;
      const widthPct = scaleMaxMinutes > 0 ? (minutes / scaleMaxMinutes) * 100 : 0;
      const shareOf40Pct = Math.round((minutes / TARGET_LESSON_MINUTES) * 100);
      return {
        ...item,
        minutes,
        startMinute,
        endMinute,
        widthPct,
        shareOf40Pct,
      };
    });
  }, [selectedItems, durationsById, scaleMaxMinutes]);

  const focusedSegment =
    timelineSegments.find((s) => s.id === focusedItemId) || timelineSegments[0] || null;

  const toggleActivitySelection = (id: string) => {
    setSelectedIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      if (!exists) {
        setFocusedItemId(id);
      } else if (focusedItemId === id && next.length > 0) {
        setFocusedItemId(next[0]);
      }
      return next;
    });
  };

  const adjustDuration = (id: string, delta: number) => {
    setDurationsById((prev) => {
      const current = prev[id] ?? 5;
      const nextVal = Math.min(40, Math.max(1, current + delta));
      return { ...prev, [id]: nextVal };
    });
  };

  const handleAutoBalance40 = () => {
    if (selectedItems.length === 0) return;
    const weights = selectedItems.map((item) => durationsById[item.id] ?? item.defaultMinutes);
    const balanced = normalizeMinutesToTarget(weights, TARGET_LESSON_MINUTES);
    setDurationsById((prev) => {
      const next = { ...prev };
      selectedItems.forEach((item, idx) => {
        next[item.id] = balanced[idx];
      });
      return next;
    });
  };

  const handleResetDefaults = () => {
    setSelectedIds(sourceItems.map((i) => i.id));
    const defaults: Record<string, number> = {};
    for (const item of sourceItems) {
      defaults[item.id] = item.defaultMinutes;
    }
    setDurationsById(defaults);
    setFocusedItemId(sourceItems[0]?.id || '');
    setOutcomeFilter('all');
  };

  const isExact40 = totalSelectedMinutes === TARGET_LESSON_MINUTES;
  const isOver40 = totalSelectedMinutes > TARGET_LESSON_MINUTES;
  const deltaMinutes = totalSelectedMinutes - TARGET_LESSON_MINUTES;

  // Ruler tick marks (every 10 min up to scaleMaxMinutes)
  const rulerTicks: number[] = [];
  for (let m = 0; m <= scaleMaxMinutes; m += 10) {
    rulerTicks.push(m);
  }
  if (rulerTicks[rulerTicks.length - 1] !== scaleMaxMinutes) {
    rulerTicks.push(scaleMaxMinutes);
  }

  return (
    <section
      aria-label="Etkinlik Süresi ve TYMM Kazanım İlişkisi Yatay Zaman Çizelgesi"
      className="p-5 sm:p-6 bg-white rounded-xl border border-stone-200 shadow-xs space-y-5"
    >
      {/* Header Row */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-medium">
            <span>{generatedPlan ? 'Üretilen Ders Planı Akışı' : 'TYMM Ünite Etkinlik Taslağı'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-stone-700 font-semibold">{topic.code}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {selectedItems.length} / {sourceItems.length} Etkinlik Seçili
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-display font-bold text-stone-900 flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Yatay Ders Zaman Çizelgesi ve TYMM Kazanım İlişkisi</span>
          </h3>
        </div>

        {/* Duration Balance Status & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold tabular-nums whitespace-nowrap shrink-0 ${
              isExact40
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : isOver40
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {isExact40 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : isOver40 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            )}
            <span className="font-mono">
              {totalSelectedMinutes} / {TARGET_LESSON_MINUTES} dk
            </span>
            <span className="text-[11px] font-medium">
              {isExact40
                ? '· Tam 40 dk Uyumlu'
                : isOver40
                ? `· +${deltaMinutes} dk Fazla`
                : `· ${Math.abs(deltaMinutes)} dk Boşluk`}
            </span>
          </div>

          {!isExact40 && selectedItems.length > 0 && (
            <button
              type="button"
              onClick={handleAutoBalance40}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
              title="Seçili etkinliklerin sürelerini 40 dakikaya orantılı olarak dengele"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>40 dk'ya Dengele</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="Etkinlik seçimlerini ve sürelerini varsayılana sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Sıfırla</span>
          </button>
        </div>
      </div>

      {/* Outcome Alignment Filter Bar (useful especially for 2-outcome units like 11th grade & 10.2) */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-stone-600 font-semibold">
          <Target className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Kazanım Vurgusu:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-lg">
          <button
            type="button"
            onClick={() => setOutcomeFilter('all')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              outcomeFilter === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tüm Kazanımlar ({distinctOutcomes.length})
          </button>
          {distinctOutcomes.map((o) => (
            <button
              key={o.code}
              type="button"
              onClick={() => setOutcomeFilter(o.code)}
              title={o.text}
              className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                outcomeFilter === o.code
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {o.code}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Scaled Timeline Canvas */}
      {timelineSegments.length === 0 ? (
        <div className="p-6 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-center space-y-1">
          <p className="text-xs font-semibold text-stone-700">
            Zaman çizelgesi için en az bir etkinlik seçin
          </p>
          <p className="text-[11px] text-stone-500">
            Aşağıdaki listeden etkinlikleri işaretleyerek 40 dakikalık ders akışını yatay eksende görüntüleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[660px] space-y-2.5">
            {/* Horizontal Minute Ruler */}
            <div className="relative h-6 border-b border-stone-200 text-[10px] font-mono tabular-nums text-stone-500">
              {rulerTicks.map((minute) => {
                const leftPct = (minute / scaleMaxMinutes) * 100;
                const alignClass =
                  minute === 0
                    ? 'translate-x-0'
                    : minute === scaleMaxMinutes
                    ? '-translate-x-full'
                    : '-translate-x-1/2';
                return (
                  <div
                    key={minute}
                    style={{ left: `${leftPct}%` }}
                    className={`absolute bottom-1 flex flex-col items-center ${alignClass}`}
                  >
                    <span
                      className={
                        minute === TARGET_LESSON_MINUTES && isOver40
                          ? 'text-rose-700 font-bold'
                          : ''
                      }
                    >
                      {String(minute).padStart(2, '0')}:00
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Proportional Horizontal Activity Timeline Row */}
            <div className="relative">
              {/* Background vertical grid lines at 10-min intervals + 40-min marker */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
              >
                {rulerTicks
                  .filter((m) => m > 0 && m < scaleMaxMinutes)
                  .map((minute) => (
                    <div
                      key={minute}
                      style={{ left: `${(minute / scaleMaxMinutes) * 100}%` }}
                      className={`absolute top-0 bottom-0 border-l ${
                        minute === TARGET_LESSON_MINUTES && isOver40
                          ? 'border-rose-400 border-dashed z-10'
                          : 'border-stone-200/70 border-dotted'
                      }`}
                    />
                  ))}
              </div>

              <div className="flex items-stretch gap-1.5 relative">
                {timelineSegments.map((seg) => {
                  const style = TONE_STYLES[seg.tone];
                  const isFocused = focusedSegment?.id === seg.id;
                  const isDimmed =
                    outcomeFilter !== 'all' && seg.outcomeCode !== outcomeFilter;

                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => setFocusedItemId(seg.id)}
                      style={{ width: `${seg.widthPct}%` }}
                      className={`min-w-[92px] p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 relative overflow-hidden ${
                        isFocused ? style.selectedRing : style.block
                      } ${isDimmed ? 'opacity-35' : 'opacity-100'}`}
                    >
                      {/* Top Color Accent Strip (horizontal, not left-border cliché) */}
                      <span
                        aria-hidden="true"
                        className={`h-1 w-full rounded-full ${style.barAccent}`}
                      />

                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1 text-[10px] font-mono tabular-nums text-stone-600">
                          <span className="font-bold">
                            {seg.indexLabel} · {seg.startMinute}–{seg.endMinute}.dk
                          </span>
                          <span className="font-bold text-stone-900 shrink-0">
                            {seg.minutes} dk
                          </span>
                        </div>
                        <div className="text-xs font-display font-bold text-stone-900 leading-tight line-clamp-2">
                          {seg.title}
                        </div>
                      </div>

                      {/* Linked TYMM Code inside block */}
                      <div className="pt-1 border-t border-black/5 flex items-center justify-between gap-1 text-[10px] font-mono">
                        <span className={`font-bold truncate ${style.codeText}`}>
                          {seg.outcomeCode}
                        </span>
                        <span className="text-stone-500 shrink-0 tabular-nums">
                          %{seg.shareOf40Pct}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Aligned TYMM Objective & Process Mapping Lane directly underneath */}
              <div className="mt-2 pt-2 border-t border-stone-100 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Eşleşen TYMM Öğrenme Çıktısı & Alan Becerisi Şeridi
                </div>
                <div className="flex items-stretch gap-1.5">
                  {timelineSegments.map((seg) => {
                    const style = TONE_STYLES[seg.tone];
                    const isFocused = focusedSegment?.id === seg.id;
                    const isDimmed =
                      outcomeFilter !== 'all' && seg.outcomeCode !== outcomeFilter;

                    return (
                      <button
                        key={`lane-${seg.id}`}
                        type="button"
                        onClick={() => setFocusedItemId(seg.id)}
                        style={{ width: `${seg.widthPct}%` }}
                        className={`min-w-[92px] p-2 rounded-lg border text-left transition-all cursor-pointer space-y-1 ${
                          style.laneBg
                        } ${isFocused ? 'border-stone-700 shadow-xs' : ''} ${
                          isDimmed ? 'opacity-35' : 'opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                          <span className={`font-bold truncate ${style.codeText}`}>
                            {seg.sbabTags.join('+')}
                          </span>
                          <span className="text-stone-500 truncate">{seg.valueOrLiteracyTag.split('.')[0]}</span>
                        </div>
                        <p className="text-[11px] text-stone-700 leading-snug line-clamp-2">
                          {seg.processComponent}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Segment TYMM Alignment Inspector */}
      {focusedSegment && (
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-bold text-stone-900">
                Etkinlik {focusedSegment.indexLabel}
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="font-display font-bold text-stone-900">
                {focusedSegment.title}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums text-stone-600">
              <span>
                Zaman Aralığı: <strong className="text-stone-900">{focusedSegment.startMinute}–{focusedSegment.endMinute}. dk</strong>
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>
                Süre: <strong className="text-amber-700">{focusedSegment.minutes} dk (%{focusedSegment.shareOf40Pct})</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Etkinlik İçeriği & Öğretmen Rolü
              </div>
              <p className="text-stone-800 leading-relaxed">{focusedSegment.description}</p>
              <div className="text-[11px] text-stone-500 pt-1">
                Öğretmen Rolü: <strong className="text-stone-800">{focusedSegment.role}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>TYMM Kazanım ve Süreç İlişkisi</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-stone-200 space-y-1.5">
                <div className="text-[11px] font-semibold text-amber-900">
                  {focusedSegment.outcomeText}
                </div>
                <div className="text-[11px] text-stone-700 leading-relaxed">
                  <strong className="text-stone-900">Süreç Bileşeni:</strong>{' '}
                  {focusedSegment.processComponent}
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono text-stone-500">
                  <span>Alan Becerisi: {topic.fieldSkills}</span>
                  <span aria-hidden="true">·</span>
                  <span>Değer/Eğilim: {focusedSegment.valueOrLiteracyTag}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Selection & Minute Tuning List */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-700 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            <span>Etkinlik Seçimi & Süre Ayarı (Zaman Çizelgesini Özelleştir)</span>
          </span>
          <span className="text-[11px] text-stone-500 tabular-nums">
            Toplam: {totalSelectedMinutes} dk
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {sourceItems.map((item) => {
            const isChecked = selectedIds.includes(item.id);
            const mins = durationsById[item.id] ?? item.defaultMinutes;

            return (
              <div
                key={`ctrl-${item.id}`}
                className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                  isChecked
                    ? 'bg-white border-stone-200'
                    : 'bg-stone-50/70 border-stone-200/60 opacity-65'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleActivitySelection(item.id)}
                  className="flex items-start gap-2 text-left min-w-0 flex-1 cursor-pointer"
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-stone-900 truncate">
                      {item.indexLabel}. {item.title}
                    </div>
                    <div className="text-[10px] font-mono text-stone-500 truncate">
                      {item.outcomeCode} · {item.sbabTags.join('+')}
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={!isChecked || mins <= 1}
                    onClick={() => adjustDuration(item.id, -1)}
                    aria-label={`${item.title} süresini 1 dakika azalt`}
                    className="p-1 rounded border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-11 text-center font-mono tabular-nums text-xs font-bold text-stone-800">
                    {mins} dk
                  </span>
                  <button
                    type="button"
                    disabled={!isChecked || mins >= 40}
                    onClick={() => adjustDuration(item.id, 1)}
                    aria-label={`${item.title} süresini 1 dakika artır`}
                    className="p-1 rounded border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
