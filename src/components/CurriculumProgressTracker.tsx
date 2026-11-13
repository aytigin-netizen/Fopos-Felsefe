import React, { useState } from 'react';
import { CurriculumTopic, SavedLessonPlan } from '../types/philosophy';
import {
  CheckCircle2,
  Circle,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';

interface SbabDefinition {
  code: 'SBAB13' | 'SBAB14' | 'SBAB15';
  title: string;
  description: string;
}

const SBAB_DEFINITIONS: SbabDefinition[] = [
  {
    code: 'SBAB13',
    title: 'Felsefi Sorgulama',
    description: 'Merak etme, şüphe duyma, felsefi soru sorma ve kavramları ilişkilendirme.',
  },
  {
    code: 'SBAB14',
    title: 'Felsefi Muhakeme',
    description: 'Argüman çözümleme, mantıksal tutarlılık denetimi ve metin yorumlama.',
  },
  {
    code: 'SBAB15',
    title: 'Felsefi Düşünce Ortaya Koyma',
    description: 'Güncel problemlere özgün felsefi metin ve gerekçeli tezler geliştirme.',
  },
];

interface CurriculumProgressTrackerProps {
  allTopics: CurriculumTopic[];
  selectedGrade: 'all' | '10. Sınıf' | '11. Sınıf';
  savedPlans: SavedLessonPlan[];
  selectedPlanIds: string[];
  activeDraft: {
    topicId: string;
    fieldSkills: string;
    code: string;
    title: string;
  } | null;
  activeTopicId: string;
  onSelectTopic: (topic: CurriculumTopic) => void;
  onSelectAllPlans: () => void;
  onClearPlanSelection: () => void;
}

export const CurriculumProgressTracker: React.FC<CurriculumProgressTrackerProps> = ({
  allTopics,
  selectedGrade,
  savedPlans,
  selectedPlanIds,
  activeDraft,
  activeTopicId,
  onSelectTopic,
  onSelectAllPlans,
  onClearPlanSelection,
}) => {
  const [showMatrix, setShowMatrix] = useState<boolean>(false);

  const scopedTopics =
    selectedGrade === 'all'
      ? allTopics
      : allTopics.filter((t) => t.grade === selectedGrade);

  const selectedSavedPlans = savedPlans.filter((p) => selectedPlanIds.includes(p.id));

  // Count how many selected plans cover each topicId
  const planCountByTopic = new Map<string, number>();
  for (const plan of selectedSavedPlans) {
    planCountByTopic.set(plan.topicId, (planCountByTopic.get(plan.topicId) ?? 0) + 1);
  }
  if (activeDraft) {
    planCountByTopic.set(activeDraft.topicId, (planCountByTopic.get(activeDraft.topicId) ?? 0) + 1);
  }

  const coveredTopicIds = new Set<string>(planCountByTopic.keys());

  const coveredScopedTopics = scopedTopics.filter((t) => coveredTopicIds.has(t.id));
  const totalScopedHours = scopedTopics.reduce((acc, t) => acc + t.hours, 0);
  const coveredScopedHours = coveredScopedTopics.reduce((acc, t) => acc + t.hours, 0);
  const overallUnitPct =
    scopedTopics.length > 0
      ? Math.round((coveredScopedTopics.length / scopedTopics.length) * 100)
      : 0;

  // Also check direct SBAB mentions in selected plans' fieldSkills
  const coveredSbabDirect = new Set<string>();
  for (const plan of selectedSavedPlans) {
    for (const def of SBAB_DEFINITIONS) {
      if (plan.fieldSkills.includes(def.code)) coveredSbabDirect.add(def.code);
    }
  }
  if (activeDraft) {
    for (const def of SBAB_DEFINITIONS) {
      if (activeDraft.fieldSkills.includes(def.code)) coveredSbabDirect.add(def.code);
    }
  }

  const extractSbabTags = (fieldSkills: string): string[] => {
    return SBAB_DEFINITIONS.filter((d) => fieldSkills.includes(d.code)).map((d) => d.code);
  };

  return (
    <section
      aria-label="TYMM Müfredat ve Kazanım İlerleme Takibi"
      className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5"
    >
      {/* Tracker Header & Overall Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-medium">
            <span>Müfredat Kapsam Takibi</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {selectedSavedPlans.length} / {savedPlans.length} Arşiv Planı Seçili
            </span>
            {activeDraft && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 font-semibold">+1 Aktif Taslak Dahil</span>
              </>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-display font-bold text-stone-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
            <span>TYMM Alan Becerileri (SBAB) ve Kazanım Kapsamı</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {savedPlans.length > 0 && (
            <div className="flex items-center gap-1.5 mr-1">
              <button
                type="button"
                onClick={onSelectAllPlans}
                disabled={selectedSavedPlans.length === savedPlans.length}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Tüm Planları Seç
              </button>
              <button
                type="button"
                onClick={onClearPlanSelection}
                disabled={selectedSavedPlans.length === 0}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Seçimi Temizle
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowMatrix((prev) => !prev)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="tabular-nums">
              Ünite Matrisi ({coveredScopedTopics.length}/{scopedTopics.length})
            </span>
            {showMatrix ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Overall Curriculum Completion Bar */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-stone-700">
            {selectedGrade === 'all' ? '10. ve 11. Sınıf Genel Ünite Kapsamı' : `${selectedGrade} Ünite Kapsamı`}
          </span>
          <div className="flex items-center gap-3 font-mono tabular-nums text-stone-600">
            <span>
              <strong className="text-stone-900">{coveredScopedTopics.length}</strong> / {scopedTopics.length} Ünite
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>
              <strong className="text-stone-900">{coveredScopedHours}</strong> / {totalScopedHours} Ders Saati
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="font-bold text-amber-700">%{overallUnitPct}</span>
          </div>
        </div>
        <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200/70">
          <div
            className={`h-full transition-all duration-300 ${
              overallUnitPct === 100 ? 'bg-emerald-600' : 'bg-amber-500'
            }`}
            style={{ width: `${overallUnitPct}%` }}
          />
        </div>
      </div>

      {/* SBAB13 / SBAB14 / SBAB15 Competency Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SBAB_DEFINITIONS.map((sbab) => {
          const matchingTopics = scopedTopics.filter((t) => t.fieldSkills.includes(sbab.code));
          const coveredMatching = matchingTopics.filter((t) => coveredTopicIds.has(t.id));
          const totalCount = matchingTopics.length;
          const coveredCount = coveredMatching.length;
          const pct = totalCount > 0 ? Math.round((coveredCount / totalCount) * 100) : 0;
          const isFullyCovered = totalCount > 0 && coveredCount === totalCount;
          const isPartiallyCovered = totalCount > 0 && coveredCount > 0 && coveredCount < totalCount;
          const isOutOfScopeForGrade = totalCount === 0;
          const hasDirectCoverage = coveredSbabDirect.has(sbab.code);

          return (
            <div
              key={sbab.code}
              className={`p-4 rounded-xl border transition-colors space-y-3 ${
                isFullyCovered
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : isPartiallyCovered || hasDirectCoverage
                  ? 'bg-amber-50/50 border-amber-300'
                  : 'bg-stone-50/70 border-stone-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-stone-900">{sbab.code}</span>
                  <h3 className="text-sm font-display font-bold text-stone-900 leading-snug">
                    {sbab.title}
                  </h3>
                </div>

                {isOutOfScopeForGrade ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 whitespace-nowrap shrink-0">
                    <Circle className="w-3.5 h-3.5 text-stone-400" />
                    {sbab.code === 'SBAB13' ? '10. Sınıf Ünitesi' : '11. Sınıf Ünitesi'}
                  </span>
                ) : isFullyCovered ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 whitespace-nowrap shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Tamamlandı
                  </span>
                ) : isPartiallyCovered ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 whitespace-nowrap shrink-0">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Devam Ediyor
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 whitespace-nowrap shrink-0">
                    <Circle className="w-3.5 h-3.5 text-stone-400" />
                    Plan Bekleniyor
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">{sbab.description}</p>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                  <span className="text-stone-600">
                    {isOutOfScopeForGrade
                      ? hasDirectCoverage
                        ? 'Diğer sınıf planında kapsandı'
                        : 'Bu sınıf filtresinde ünite yok'
                      : `${coveredCount} / ${totalCount} Ünite Kapsandı`}
                  </span>
                  {!isOutOfScopeForGrade && (
                    <span className="font-bold text-stone-900">%{pct}</span>
                  )}
                </div>

                <div className="h-2 w-full bg-stone-200/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isFullyCovered ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${isOutOfScopeForGrade ? 0 : pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable Unit & Outcome Matrix */}
      {showMatrix && (
        <div className="pt-3 border-t border-stone-100 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-bold text-stone-700 uppercase tracking-wider">
              Ünite & Öğrenme Çıktısı Durum Matrisi (Tıklayarak Üniteye Geçin)
            </span>
            <span>
              {savedPlans.length === 0 && !activeDraft
                ? 'İpucu: Bir ünite seçip ders planı üreterek kapsamı işaretleyin.'
                : 'Arşiv sekmesinden hangi planların hesaplanacağını seçebilirsiniz.'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {scopedTopics.map((topic) => {
              const planCount = planCountByTopic.get(topic.id) ?? 0;
              const isCovered = planCount > 0;
              const isCurrent = topic.id === activeTopicId;
              const sbabTags = extractSbabTags(topic.fieldSkills);

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onSelectTopic(topic)}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer space-y-1.5 ${
                    isCurrent
                      ? 'ring-2 ring-amber-500/40 border-amber-500 bg-amber-50/40'
                      : isCovered
                      ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70'
                      : 'border-stone-200 bg-stone-50/60 hover:border-stone-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-mono font-bold text-stone-800">{topic.code}</span>
                    {isCovered ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 tabular-nums whitespace-nowrap shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Kapsandı ({planCount})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-stone-500 whitespace-nowrap shrink-0">
                        <Circle className="w-3 h-3 text-stone-400" />
                        Planlanmadı
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-bold text-stone-900 truncate" title={topic.unit}>
                    {topic.grade} · {topic.unit}
                  </div>

                  <div className="flex items-center justify-between gap-2 text-[11px] text-stone-500">
                    <span className="truncate">{sbabTags.join(' · ')}</span>
                    <span className="font-mono tabular-nums shrink-0">{topic.hours} sa</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
