import React, { useState } from 'react';
import { PHILOSOPHY_CONCEPTS, PHILOSOPHY_TIMELINE } from '../data/conceptPairs';
import { ConceptCard } from '../types/philosophy';
import { Trophy, CheckCircle, XCircle, RotateCcw, Clock, BookOpen, Flame } from 'lucide-react';

export const ConceptArena: React.FC = () => {
  const [subView, setSubView] = useState<'match' | 'timeline'>('match');

  // Matching game state
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const currentCard: ConceptCard = PHILOSOPHY_CONCEPTS[currentIdx % PHILOSOPHY_CONCEPTS.length];

  // Prepare 4 choices whenever currentIdx changes
  React.useEffect(() => {
    const wrongPhilosophers = Array.from(
      new Set(PHILOSOPHY_CONCEPTS.map((c) => c.philosopherOrSchool))
    ).filter((p) => p !== currentCard.philosopherOrSchool);

    const shuffledWrongs = wrongPhilosophers.sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [currentCard.philosopherOrSchool, ...shuffledWrongs].sort(() => 0.5 - Math.random());
    setShuffledOptions(options);
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [currentIdx]);

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === currentCard.philosopherOrSchool) {
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setCurrentIdx((prev) => prev + 1);
  };

  const handleResetGame = () => {
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
              <span>Hafıza & Kavram Eşleştirme</span>
              <span aria-hidden="true">·</span>
              <span>Filozoflar Zaman Çizelgesi</span>
              <span aria-hidden="true">·</span>
              <span>Sınıf İçi Bilgi Arenası</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 tracking-tight">
              Kavram Arenası & Zaman Çizelgesi
            </h1>
            <p className="mt-1 text-sm text-stone-600 max-w-3xl">
              Felsefi kavramları, ekolleri ve filozofları interaktif bilgi eşleştirmeleriyle pekiştirin; Antik Çağ'dan Çağdaş Döneme düşünce tarihinin kırılma anlarını keşfedin.
            </p>
          </div>

          {/* Subview switcher */}
          <div className="flex items-center gap-1 p-1 bg-stone-200 rounded-lg text-xs font-semibold shrink-0">
            <button
              onClick={() => setSubView('match')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                subView === 'match' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              Kavram Eşleştirme Arenası
            </button>
            <button
              onClick={() => setSubView('timeline')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                subView === 'timeline' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              Felsefe Tarihi Zaman Çizelgesi
            </button>
          </div>
        </div>
      </div>

      {/* 1. MATCHING GAME VIEW */}
      {subView === 'match' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Game Stage (Col 1-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Question Card */}
            <div className="p-8 bg-white rounded-xl border border-stone-200 shadow-xs space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-100 pb-3">
                <span className="font-bold text-amber-800 uppercase tracking-wider">
                  Alan: {currentCard.branch}
                </span>
                <span>
                  Soru {((currentIdx % PHILOSOPHY_CONCEPTS.length) + 1)} / {PHILOSOPHY_CONCEPTS.length}
                </span>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-stone-400 block uppercase tracking-wider">
                  Kavram / Felsefi Teori:
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900">
                  "{currentCard.term}"
                </h2>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                  {currentCard.definition}
                </p>
              </div>

              {/* Options Grid */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-stone-600 block">
                  Bu kavram hangi filozof veya akımla özdeşleşmiştir?
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {shuffledOptions.map((opt, i) => {
                    const isCorrect = opt === currentCard.philosopherOrSchool;
                    const isSelected = selectedAnswer === opt;

                    let btnStyle = 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800';
                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'border-rose-600 bg-rose-50 text-rose-950';
                      } else {
                        btnStyle = 'border-stone-200 opacity-40 bg-stone-50 text-stone-400';
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(opt)}
                        disabled={isAnswered}
                        className={`p-4 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                      >
                        <span className="font-medium">{opt}</span>
                        {isAnswered && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                        {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback & Next Button */}
              {isAnswered && (
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between flex-wrap gap-4">
                  <div className="text-xs">
                    {selectedAnswer === currentCard.philosopherOrSchool ? (
                      <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> Doğru! +10 Puan
                      </span>
                    ) : (
                      <span className="font-bold text-rose-700 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" /> Doğru Cevap: {currentCard.philosopherOrSchool}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Sonraki Kavrama Geç →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Gamification Stats Deck (Col 9-12) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-stone-900 text-stone-100 rounded-xl border border-stone-800 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" />
                  Performans & Seri
                </span>
                <button
                  onClick={handleResetGame}
                  className="text-stone-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Sıfırla
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-950/80 rounded-lg text-center border border-stone-800">
                  <span className="text-[11px] text-stone-400 block mb-0.5">Toplam Skor</span>
                  <span className="font-mono text-2xl font-bold text-amber-400">{score}</span>
                </div>
                <div className="p-3 bg-stone-950/80 rounded-lg text-center border border-stone-800">
                  <span className="text-[11px] text-stone-400 block mb-0.5">Üst Üste Doğru</span>
                  <span className="font-mono text-2xl font-bold text-emerald-400 flex items-center justify-center gap-1">
                    <Flame className="w-5 h-5 text-amber-500" />
                    {streak}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-stone-950/40 rounded border border-stone-800 text-[11px] text-stone-400">
                <span className="font-bold text-stone-300 block mb-1">Öğretmen İpucu:</span>
                Bu bölümü dersin ilk 5 dakikasında "Geri Getirme Pratiği (Retrieval Practice)" olarak akıllı tahtada açıp öğrencileri sırayla kaldırarak ısınma amaçlı kullanabilirsiniz.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TIMELINE VIEW */}
      {subView === 'timeline' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PHILOSOPHY_TIMELINE.map((period, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs space-y-4 hover:border-amber-400 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-700 block">
                      {period.span}
                    </span>
                    <h3 className="text-lg font-display font-bold text-stone-900">
                      {period.era}
                    </h3>
                  </div>
                </div>

                <p className="text-xs font-medium text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200/60">
                  <strong>Ana Tema:</strong> {period.theme}
                </p>

                <div className="space-y-3 pt-1">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Önemli Filozoflar ve Alıntılar:
                  </span>
                  {period.figures.map((fig, fIdx) => (
                    <div key={fIdx} className="p-3 bg-stone-50/70 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">{fig.name}</span>
                        <span className="text-[10px] text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded">
                          {fig.focus}
                        </span>
                      </div>
                      <p className="italic text-stone-600 font-serif">
                        "{fig.quote}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
