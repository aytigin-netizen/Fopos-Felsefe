import React, { useEffect, useState } from 'react';
import { TYMM_CURRICULUM_TOPICS } from '../data/curriculumData';
import { CurriculumTopic } from '../types/philosophy';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Save,
  Trash2,
  FolderOpen,
  Printer,
  ChevronRight,
  Target,
  Clock,
  Layers,
  Compass,
  Award,
  ShieldCheck
} from 'lucide-react';

interface LessonPlanDraft {
  id: string;
  savedAt: string;
  topicId: string;
  topicTitle: string;
  title: string;
  plan: any;
}

const DRAFTS_STORAGE_KEY = 'fopos.lesson-plan-drafts';

export const CurriculumStudio: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<'all' | '10. Sınıf' | '11. Sınıf'>('all');
  const [activeTopic, setActiveTopic] = useState<CurriculumTopic>(TYMM_CURRICULUM_TOPICS[0]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedDrafts, setSavedDrafts] = useState<LessonPlanDraft[]>([]);

  useEffect(() => {
    try {
      const storedDrafts = window.localStorage.getItem(DRAFTS_STORAGE_KEY);
      if (storedDrafts) {
        const parsedDrafts = JSON.parse(storedDrafts);
        if (Array.isArray(parsedDrafts)) setSavedDrafts(parsedDrafts);
      }
    } catch (error) {
      console.warn('Ders planı taslakları yüklenemedi:', error);
    }
  }, []);

  const persistDrafts = (drafts: LessonPlanDraft[]) => {
    setSavedDrafts(drafts);
    window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  };

  const handleSaveDraft = () => {
    if (!generatedPlan) return;
    const draft: LessonPlanDraft = {
      id: `${activeTopic.id}-${Date.now()}`,
      savedAt: new Date().toISOString(),
      topicId: activeTopic.id,
      topicTitle: `${activeTopic.unit}: ${activeTopic.title}`,
      title: generatedPlan.title || activeTopic.title,
      plan: generatedPlan
    };
    persistDrafts([draft, ...savedDrafts].slice(0, 20));
  };

  const handleLoadDraft = (draft: LessonPlanDraft) => {
    const topic = TYMM_CURRICULUM_TOPICS.find((item) => item.id === draft.topicId);
    if (topic) {
      setActiveTopic(topic);
      setSelectedGrade(topic.grade);
    }
    setGeneratedPlan(draft.plan);
  };

  const handleDeleteDraft = (draftId: string) => {
    persistDrafts(savedDrafts.filter((draft) => draft.id !== draftId));
  };

  const filteredTopics =
    selectedGrade === 'all'
      ? TYMM_CURRICULUM_TOPICS
      : TYMM_CURRICULUM_TOPICS.filter((t) => t.grade === selectedGrade);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: activeTopic.grade,
          unit: activeTopic.unit,
          topic: activeTopic.title,
          code: activeTopic.code,
          fieldSkills: activeTopic.fieldSkills,
          duration: 40,
          methodology: 'TYMM Maarif Modeli Soruşturma Topluluğu & Sokratik Çember'
        })
      });

      const data = await response.json();
      setGeneratedPlan(data.plan);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPlan = () => {
    if (!generatedPlan) return;
    const text = `TÜRKİYE YÜZYILI MAARİF MODELİ DERS PLANI (${activeTopic.code})
DERS: ${generatedPlan.title}
ALAN BECERİSİ: ${activeTopic.fieldSkills}
SÜRE: 40 Dakika

KAZANIM / ÖĞRENME ÇIKTISI:
${activeTopic.outcomes.join('\n')}

UYARICI MATERYAL:
${generatedPlan.stimulusMaterial}

YÖNLENDİRİCİ SORULAR:
${generatedPlan.inquiryQuestions?.map((q: string) => `- ${q}`).join('\n')}

DERS ETAPLARI:
${generatedPlan.stages?.map((s: any) => `[${s.phase}] ${s.activity} (Öğretmen Rolü: ${s.role})`).join('\n')}

FARKLILAŞTIRMA (ZENGİNLEŞTİRME):
${activeTopic.enrichment}

ÖZ-DEĞERLENDİRME:
${generatedPlan.reflectionPrompt}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
              <span>T.C. Millî Eğitim Bakanlığı 2026</span>
              <span aria-hidden="true">·</span>
              <span>Türkiye Yüzyılı Maarif Modeli (TYMM)</span>
              <span aria-hidden="true">·</span>
              <span>Erdem-Değer-Eylem & Alan Becerileri</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 tracking-tight">
              TYMM Felsefe Müfredat & Soruşturma Stüdyosu
            </h1>
            <p className="mt-1 text-sm text-stone-600 max-w-3xl">
              Güncellenmiş 10. ve 11. Sınıf öğretim programının öğrenme çıktıları (FEL.XX.X.X), alan becerileri (SBAB13/14/15), süreç bileşenleri, farklılaştırma yönergeleri ve P4C ders planı üreticisi.
            </p>
          </div>

          {/* Grade Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-stone-200 rounded-lg text-xs font-semibold shrink-0">
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedGrade === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              Tüm Üniteler ({TYMM_CURRICULUM_TOPICS.length})
            </button>
            <button
              onClick={() => setSelectedGrade('10. Sınıf')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedGrade === '10. Sınıf' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              10. Sınıf (9 Ünite)
            </button>
            <button
              onClick={() => setSelectedGrade('11. Sınıf')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedGrade === '11. Sınıf' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              11. Sınıf (6 Çağdaş Ünite)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Topic Explorer (Col 1-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-700 uppercase tracking-wider">
              TYMM Ünite Listesi
            </span>
            <span className="text-stone-500 font-mono text-[11px]">
              Haftalık 2 Saat · 72 Saat/Yıl
            </span>
          </div>

          <div className="space-y-2.5 max-h-[660px] overflow-y-auto pr-1">
            {filteredTopics.map((topic) => {
              const isSelected = activeTopic.id === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    setActiveTopic(topic);
                    setGeneratedPlan(null);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-800">{topic.grade}</span>
                    <span className="font-mono text-[11px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded font-bold">
                      {topic.code}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-display font-bold text-stone-900 leading-snug">
                    {topic.unit}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
                    <span className="truncate max-w-[200px]">{topic.title}</span>
                    <span className="font-mono text-stone-400 shrink-0">{topic.hours} Ders Saati (%{topic.percentage})</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Topic Detail & Lesson Generator Deck (Col 6-12) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Selected Topic Blueprint Card */}
          <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-amber-800">{activeTopic.grade}</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="font-mono text-xs font-bold text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                    {activeTopic.code}
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="text-xs text-stone-500">{activeTopic.hours} Saat (%{activeTopic.percentage})</span>
                </div>
                <h2 className="text-lg sm:text-xl font-display font-bold text-stone-900">
                  {activeTopic.unit}: {activeTopic.title}
                </h2>
              </div>

              <button
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isGenerating ? 'Hazırlanıyor...' : 'TYMM Uyumlu Ders Planı Üret'}
              </button>
            </div>

            {/* Alan Becerisi & Programlar Arası Bileşenler */}
            <div className="p-3.5 bg-stone-900 text-stone-100 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Sosyal Bilimler Alan Becerisi:
                </span>
                <span className="font-mono text-stone-300">{activeTopic.fieldSkills}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-300 pt-1 border-t border-stone-800">
                <div>
                  <strong className="text-stone-400">Değerler:</strong> {activeTopic.values.join(', ')}
                </div>
                <div>
                  <strong className="text-stone-400">Okuryazarlıklar:</strong> {activeTopic.literacies.join(', ')}
                </div>
              </div>
            </div>

            {/* Process Components (Süreç Bileşenleri) */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2 text-xs">
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-600" />
                Öğrenme Çıktısı Süreç Bileşenleri (Öğrencinin Deneyimleyeceği Adımlar):
              </span>
              <ul className="space-y-1.5 text-stone-700">
                {activeTopic.processComponents.map((pc, idx) => (
                  <li key={idx} className="leading-relaxed flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold shrink-0">•</span>
                    <span>{pc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* P4C Stimulus & Question */}
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                TYMM P4C Soruşturma Çemberi Açılış Sorusu:
              </span>
              <p className="italic text-stone-900 text-sm font-serif">
                {activeTopic.p4cQuestion}
              </p>
              <div className="text-stone-600 text-[11px] border-t border-amber-200/60 pt-2">
                <strong className="text-amber-900">Öğrenme-Öğretme Etkinliği:</strong> {activeTopic.activityIdea}
              </div>
            </div>

            {/* Farklılaştırma (Zenginleştirme & Destekleme) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 space-y-1 text-emerald-950">
                <span className="font-bold flex items-center gap-1 text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  Zenginleştirme (İleri Düzey / SBL):
                </span>
                <p className="text-[11px] leading-relaxed">{activeTopic.enrichment}</p>
              </div>

              <div className="p-3 bg-sky-50/70 rounded-lg border border-sky-200 space-y-1 text-sky-950">
                <span className="font-bold flex items-center gap-1 text-sky-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Destekleme (Sadeleştirme & Akran):
                </span>
                <p className="text-[11px] leading-relaxed">{activeTopic.support}</p>
              </div>
            </div>
          </div>

          {/* Generated Lesson Plan View */}
          {generatedPlan && (
            <div className="p-6 bg-stone-900 text-stone-100 rounded-xl border border-stone-800 space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    TYMM Uyumlu Ders Akış Planı (40 Dakika)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveDraft}
                    className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs rounded transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Taslağı Kaydet
                  </button>
                  <button
                    onClick={handleCopyPlan}
                    className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Kopyalandı' : 'Kopyala'}
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-amber-200 text-sm mb-1">{generatedPlan.title}</h4>
                  <p className="text-stone-300 italic">{generatedPlan.stimulusMaterial}</p>
                </div>

                {/* Stages Timeline */}
                <div className="space-y-2">
                  <span className="font-bold text-stone-400 block uppercase tracking-wider text-[11px]">
                    Dersin Etapları:
                  </span>
                  {generatedPlan.stages?.map((stage: any, i: number) => (
                    <div key={i} className="p-3 bg-stone-950/80 rounded-lg border border-stone-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300">{stage.phase}</span>
                        <span className="text-[10px] text-stone-400">Rol: {stage.role}</span>
                      </div>
                      <p className="text-stone-300 text-xs leading-relaxed">{stage.activity}</p>
                    </div>
                  ))}
                </div>

                {/* Socratic Inquiry Questions */}
                <div>
                  <span className="font-bold text-stone-400 block uppercase tracking-wider text-[11px] mb-1">
                    Yönlendirici Sokratik Sorular:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-300">
                    {generatedPlan.inquiryQuestions?.map((q: string, i: number) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {savedDrafts.length > 0 && (
            <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-amber-600" />
                  Kayıtlı Ders Planı Taslakları
                </span>
                <span className="text-[11px] text-stone-500">Bu cihazda saklanır</span>
              </div>
              <div className="space-y-2">
                {savedDrafts.map((draft) => (
                  <div key={draft.id} className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-stone-800">{draft.title}</p>
                      <p className="truncate text-[11px] text-stone-500">
                        {draft.topicTitle} · {new Date(draft.savedAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => handleLoadDraft(draft)}
                        className="flex items-center gap-1 rounded bg-stone-900 px-2 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-stone-700 cursor-pointer"
                      >
                        <FolderOpen className="w-3 h-3" />
                        Aç
                      </button>
                      <button
                        onClick={() => handleDeleteDraft(draft.id)}
                        title="Taslağı sil"
                        className="rounded p-1 text-stone-400 transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
