import React, { useState, useEffect, useRef } from 'react';
import { THOUGHT_EXPERIMENTS } from '../data/thoughtExperiments';
import { ApiSource, ConceptualIllustration, FallbackReason, ThoughtExperiment } from '../types/philosophy';
import {
  Compass,
  RotateCcw,
  Users,
  Lightbulb,
  BookOpen,
  Star,
  Wand2,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  X,
  Palette,
  Download,
  Image as ImageIcon
} from 'lucide-react';

const FAVORITE_EXPERIMENTS_KEY = 'fopos_favorite_experiments_v1';
const CUSTOM_EXPERIMENTS_KEY = 'fopos_custom_experiments_v1';
const ILLUSTRATIONS_STORAGE_KEY = 'fopos_experiment_illustrations_v1';

const getInitialIllustrations = (): Record<string, ConceptualIllustration> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(ILLUSTRATIONS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

interface ThemePreset {
  id: string;
  label: string;
  theme: string;
  defaultGrade: '10. Sınıf' | '11. Sınıf' | '10. ve 11. Sınıf';
}

const CURRICULUM_THEME_PRESETS: ThemePreset[] = [
  {
    id: 'tech-ethics',
    label: 'Teknoloji Etiği & Yapay Zekâ',
    theme: 'Teknoloji Etiği ve Yapay Zekâ (Özerklik, Mahremiyet, Robot Etiği)',
    defaultGrade: '11. Sınıf',
  },
  {
    id: 'political-phil',
    label: 'Siyaset Felsefesi & Adalet',
    theme: 'Siyaset Felsefesi (Toplumsal Sözleşme, Hakkaniyet ve Özgürlük)',
    defaultGrade: '10. Sınıf',
  },
  {
    id: 'env-ethics',
    label: 'Çevre Sorunları & Ekosistem Etiği',
    theme: 'Çevre Etiği ve Gelecek Kuşaklara Sorumluluk',
    defaultGrade: '11. Sınıf',
  },
  {
    id: 'moral-phil',
    label: 'Ahlak Felsefesi & Ödev Çatışması',
    theme: 'Ahlak Felsefesi (Evrensel Ahlak Yasası ve Özgür İrade)',
    defaultGrade: '10. Sınıf',
  },
  {
    id: 'epistemology',
    label: 'Bilgi Felsefesi & Simülasyon',
    theme: 'Bilgi Felsefesi (Hakikat, Sanı ve Dijital Yanılsama)',
    defaultGrade: '10. Sınıf',
  },
  {
    id: 'law-phil',
    label: 'Hukuk ve Felsefe (Doğal vs Pozitif)',
    theme: 'Hukuk ve Felsefe (Vicdan, Yasa ve Adalet İlişkisi)',
    defaultGrade: '11. Sınıf',
  },
  {
    id: 'meaning-life',
    label: 'Hayatın Anlamı & Varoluş',
    theme: 'Hayatın Anlamı (Otantik Yaşam, Kaygı ve Özgür Seçim)',
    defaultGrade: '11. Sınıf',
  },
];

const getImageForField = (field: ThoughtExperiment['field']): string => {
  switch (field) {
    case 'Etik & Ahlak':
      return '/src/assets/images/trolley_dilemma_1794482208117.jpg';
    case 'Ontoloji (Varlık)':
      return '/src/assets/images/ship_theseus_1794482209012.jpg';
    case 'Epistemoloji (Bilgi)':
      return '/src/assets/images/plato_cave_1794482209298.jpg';
    default:
      return '/src/assets/images/fopos_hero_agora_1794482207191.jpg';
  }
};

const getInitialCustomExperiments = (): ThoughtExperiment[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_EXPERIMENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is ThoughtExperiment =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.title === 'string'
    );
  } catch {
    return [];
  }
};

const getInitialFavoriteIds = (customList: ThoughtExperiment[]): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(FAVORITE_EXPERIMENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const validIds = new Set([
      ...THOUGHT_EXPERIMENTS.map((exp) => exp.id),
      ...customList.map((exp) => exp.id),
    ]);
    return parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id));
  } catch {
    return [];
  }
};

export const ThoughtExperimentsLab: React.FC = () => {
  const [customExperiments, setCustomExperiments] = useState<ThoughtExperiment[]>(getInitialCustomExperiments);
  const [selectedExpId, setSelectedExpId] = useState<string>(THOUGHT_EXPERIMENTS[0].id);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    getInitialFavoriteIds(getInitialCustomExperiments())
  );
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);

  // AI Custom Thought Experiment Generator state
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [selectedThemePreset, setSelectedThemePreset] = useState<ThemePreset>(CURRICULUM_THEME_PRESETS[0]);
  const [assistantGrade, setAssistantGrade] = useState<'10. Sınıf' | '11. Sınıf' | '10. ve 11. Sınıf'>(
    CURRICULUM_THEME_PRESETS[0].defaultGrade
  );
  const [assistantFocus, setAssistantFocus] = useState<string>('');
  const [isGeneratingExp, setIsGeneratingExp] = useState<boolean>(false);
  const [generatorError, setGeneratorError] = useState<string | null>(null);

  // Interactive state for custom AI-generated dilemmas
  const [customChoiceMap, setCustomChoiceMap] = useState<Record<string, number | null>>({});
  const [customVoteMap, setCustomVoteMap] = useState<Record<string, { a: number; b: number }>>({});

  // Conceptual editorial illustration state (per experiment)
  const [illustrationsMap, setIllustrationsMap] = useState<Record<string, ConceptualIllustration>>(
    getInitialIllustrations
  );
  const [visualMode, setVisualMode] = useState<'photo' | 'illustration'>('photo');
  const [isGeneratingIllustration, setIsGeneratingIllustration] = useState<boolean>(false);
  const [illustrationError, setIllustrationError] = useState<string | null>(null);
  const illustrationSvgRef = useRef<SVGSVGElement | null>(null);

  const allExperiments: ThoughtExperiment[] = [...THOUGHT_EXPERIMENTS, ...customExperiments];
  const selectedExp: ThoughtExperiment =
    allExperiments.find((exp) => exp.id === selectedExpId) || THOUGHT_EXPERIMENTS[0];
  const activeIllustration = illustrationsMap[selectedExp.id];

  const selectExperiment = (exp: ThoughtExperiment) => {
    setSelectedExpId(exp.id);
    setImageLoadError(false);
    setIllustrationError(null);
    setVisualMode(illustrationsMap[exp.id] ? 'illustration' : 'photo');
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITE_EXPERIMENTS_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Ignore storage quota or private browsing errors
    }
  }, [favoriteIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CUSTOM_EXPERIMENTS_KEY, JSON.stringify(customExperiments));
    } catch {
      // Ignore storage quota or private browsing errors
    }
  }, [customExperiments]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ILLUSTRATIONS_STORAGE_KEY, JSON.stringify(illustrationsMap));
    } catch {
      // Ignore storage quota or private browsing errors
    }
  }, [illustrationsMap]);

  const toggleFavorite = (expId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(expId) ? prev.filter((id) => id !== expId) : [...prev, expId]
    );
  };

  const handleGenerateIllustration = async () => {
    if (isGeneratingIllustration) return;
    setIsGeneratingIllustration(true);
    setIllustrationError(null);
    try {
      const response = await fetch('/api/generate-illustration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedExp.title,
          subtitle: selectedExp.subtitle,
          summary: selectedExp.summary,
          field: selectedExp.field,
          philosophers: selectedExp.philosophers,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.illustration) {
        setIllustrationError(data.error || 'Kavramsal illüstrasyon üretilirken bir hata oluştu.');
        return;
      }
      setIllustrationsMap((prev) => ({
        ...prev,
        [selectedExp.id]: data.illustration as ConceptualIllustration,
      }));
      setVisualMode('illustration');
    } catch (err) {
      console.error(err);
      setIllustrationError('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsGeneratingIllustration(false);
    }
  };

  const handleDownloadIllustrationSvg = () => {
    const svgEl = illustrationSvgRef.current;
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const svgSource = serializer.serializeToString(svgEl);
    const blob = new Blob([svgSource], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeSlug = selectedExp.id.replace(/[^a-zA-Z0-9_-]/g, '-');
    link.href = url;
    link.download = `fopos-illustrasyon-${safeSlug}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSelectThemePreset = (preset: ThemePreset) => {
    setSelectedThemePreset(preset);
    setAssistantGrade(preset.defaultGrade);
  };

  const handleGenerateExperiment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGeneratingExp) return;
    setIsGeneratingExp(true);
    setGeneratorError(null);

    try {
      const response = await fetch('/api/generate-thought-experiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: selectedThemePreset.theme,
          grade: assistantGrade,
          focus: assistantFocus.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setGeneratorError(data.error || 'Düşünce deneyi üretilirken bir hata oluştu.');
        return;
      }

      const expData = data.experiment;
      const resolvedField: ThoughtExperiment['field'] = expData.field || 'Etik & Ahlak';
      const newExp: ThoughtExperiment = {
        id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        title: expData.title,
        subtitle: expData.subtitle,
        field: resolvedField,
        image: getImageForField(resolvedField),
        philosophers: Array.isArray(expData.philosophers) ? expData.philosophers : ['Sokrates'],
        summary: expData.summary,
        context: expData.context,
        interactiveType: 'custom_dilemma',
        discussionQuestions: Array.isArray(expData.discussionQuestions) ? expData.discussionQuestions : [],
        mebUnit: expData.mebUnit || `${assistantGrade} · ${selectedThemePreset.label}`,
        tymmCode: expData.tymmCode || 'FEL.10 / FEL.11',
        dilemmaChoices: Array.isArray(expData.dilemmaChoices) ? expData.dilemmaChoices : [],
        isCustom: true,
        createdAt: new Date().toISOString(),
        theme: selectedThemePreset.label,
        source: (data.source as ApiSource) || 'fallback',
        fallbackReason: (data.fallbackReason as FallbackReason) || null,
      };

      setCustomExperiments((prev) => [newExp, ...prev]);
      setSelectedExpId(newExp.id);
      setImageLoadError(false);
      setShowFavoritesOnly(false);
      setAssistantFocus('');
      setIsAssistantOpen(false);
    } catch (err) {
      console.error(err);
      setGeneratorError('Sunucuya ulaşılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
    } finally {
      setIsGeneratingExp(false);
    }
  };

  const handleDeleteCustomExperiment = (expId: string) => {
    setCustomExperiments((prev) => prev.filter((item) => item.id !== expId));
    setFavoriteIds((prev) => prev.filter((id) => id !== expId));
    if (selectedExpId === expId) {
      setSelectedExpId(THOUGHT_EXPERIMENTS[0].id);
      setImageLoadError(false);
    }
  };

  const handleCustomVote = (expId: string, side: 'a' | 'b') => {
    setCustomVoteMap((prev) => {
      const curr = prev[expId] || { a: 0, b: 0 };
      return {
        ...prev,
        [expId]: {
          ...curr,
          [side]: curr[side] + 1,
        },
      };
    });
  };

  const handleResetCustomVotes = (expId: string) => {
    setCustomVoteMap((prev) => ({
      ...prev,
      [expId]: { a: 0, b: 0 },
    }));
  };

  const isSelectedFavorite = favoriteIds.includes(selectedExp.id);
  const favoriteExperiments = allExperiments.filter((exp) => favoriteIds.includes(exp.id));
  const displayedExperiments = showFavoritesOnly ? favoriteExperiments : allExperiments;

  // Interactive state for Trolley Problem
  const [trolleyVariant, setTrolleyVariant] = useState<'switch' | 'bridge'>('switch');
  const [trolleySwitched, setTrolleySwitched] = useState<boolean>(false);
  const [trolleyVotes, setTrolleyVotes] = useState<{ pull: number; pass: number }>({ pull: 18, pass: 6 });

  // Interactive state for Ship of Theseus
  const [theseusReplacedPercent, setTheseusReplacedPercent] = useState<number>(50);
  const [theseusUserChoice, setTheseusUserChoice] = useState<'repaired' | 'reconstructed' | 'neither' | null>(null);

  // Interactive state for Plato's Cave
  const [caveStage, setCaveStage] = useState<1 | 2 | 3>(1);
  const [modernMetaphor, setModernMetaphor] = useState<boolean>(false);

  // Interactive state for Rawls' Veil
  const [taxRate, setTaxRate] = useState<number>(30);
  const [safetyNet, setSafetyNet] = useState<number>(40);
  const [drawnIdentity, setDrawnIdentity] = useState<{ role: string; income: number; wellbeing: string } | null>(null);

  // Interactive state for Searle's Chinese Room (TYMM Teknoloji ve Hayat)
  const [chineseQuery, setChineseQuery] = useState<string>('你明白哲学吗？ (Felsefeyi anlıyor musun?)');
  const [chineseStep, setChineseStep] = useState<'input' | 'lookup' | 'output'>('input');

  // Interactive state for Eco-Dilemma (TYMM Çevre Sorunları ve Felsefe)
  const [ecoFramework, setEcoFramework] = useState<'anthro' | 'bio' | 'eco'>('anthro');

  // Trolley vote handler
  const handleTrolleyVote = (choice: 'pull' | 'pass') => {
    setTrolleyVotes((prev) => ({
      ...prev,
      [choice]: prev[choice] + 1,
    }));
  };

  // Rawls random lottery draw
  const drawLottery = () => {
    const roles = [
      { role: 'Asgari Ücretli Tarım İşçisi', baseScore: 25 },
      { role: 'Kronik Rahatsızlığı Olan Emekli', baseScore: 20 },
      { role: 'Teknoloji Girişimcisi & Yatırımcı', baseScore: 90 },
      { role: 'Devlet Memuru & Öğretmen', baseScore: 55 },
      { role: 'İşsiz Üniversite Mezunu', baseScore: 30 }
    ];
    const picked = roles[Math.floor(Math.random() * roles.length)];
    const adjustedIncome = Math.round(picked.baseScore + (safetyNet * 0.4) - (taxRate * 0.15));
    setDrawnIdentity({
      role: picked.role,
      income: adjustedIncome,
      wellbeing: adjustedIncome > 50 ? 'Yüksek Refah & Güvence' : 'Kırılgan / Destek Gereksinimi'
    });
  };

  return (
    <div className="space-y-8">
      {/* Editorial Intro Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
              <span>Etik & Ontoloji Laboratuvarı</span>
              <span aria-hidden="true">·</span>
              <span>Sınıf İçi İnteraktif Simülasyonlar</span>
              <span aria-hidden="true">·</span>
              <span>MEB 10 & 11 Müfredat Uyumlu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 tracking-tight">
              Düşünce Deneyleri Laboratuvarı
            </h1>
            <p className="mt-1 text-sm text-stone-600 max-w-3xl">
              Felsefe tarihinin en çetin ikilemlerini doğrudan sınıfta manipüle edin; parametreleri değiştirin, öğrencilerin oylarını kıyaslayın ve etik teorileri canlı akıl yürütmeyle test edin.
            </p>
          </div>

          {/* Experiment Switcher Tabs, Favorites Filter & AI Assistant Trigger */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0 max-w-full">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsAssistantOpen((prev) => !prev)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 border ${
                  isAssistantOpen
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 border-amber-400 shadow-xs'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isAssistantOpen ? 'Üreticiyi Kapat' : 'Özel Deney Üret'}</span>
              </button>

              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/70 rounded-lg">
                <button
                  type="button"
                  onClick={() => setShowFavoritesOnly((prev) => !prev)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    showFavoritesOnly
                      ? 'bg-amber-500 text-stone-950 shadow-xs'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100/70'
                  }`}
                  title="Yalnızca favori deneyleri listele"
                >
                  <Star className={`w-3.5 h-3.5 ${showFavoritesOnly || favoriteIds.length > 0 ? 'fill-current' : ''}`} />
                  <span className="tabular-nums">Favoriler ({favoriteIds.length})</span>
                </button>

                {displayedExperiments.map((exp) => {
                  const isFav = favoriteIds.includes(exp.id);
                  const shortLabel =
                    exp.id === 'trolley'
                      ? 'Tramvay (Ahlak)'
                      : exp.id === 'theseus'
                      ? 'Theseus (Varlık)'
                      : exp.id === 'cave'
                      ? 'Mağara (Bilgi)'
                      : exp.id === 'veil'
                      ? 'Peçe (Siyaset/Hukuk)'
                      : exp.id === 'chinese_room'
                      ? 'Çin Odası (Teknoloji)'
                      : exp.id === 'eco_dilemma'
                      ? 'Eko-Etik (Çevre)'
                      : exp.title;

                  return (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => selectExperiment(exp)}
                      title={exp.title}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 max-w-[200px] ${
                        selectedExp.id === exp.id
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {isFav && <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />}
                      <span className="truncate">{shortLabel}</span>
                      {exp.isCustom && (
                        <span className="text-[10px] font-medium text-amber-700 shrink-0">· Özel</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {showFavoritesOnly && favoriteExperiments.length === 0 && (
              <span className="text-[11px] text-amber-700 font-medium">
                Henüz favori deney eklemediniz; sahnedeki yıldız simgesiyle favori belirleyebilirsiniz.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible AI Thought Experiment Generator Panel */}
      {isAssistantOpen && (
        <form
          onSubmit={handleGenerateExperiment}
          className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5"
        >
          <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
                <span>Yapay Zekâ Asistanı</span>
                <span aria-hidden="true">·</span>
                <span>TYMM Müfredat Temalı</span>
                <span aria-hidden="true">·</span>
                <span>Canlı İkilem & Sınıf Oylaması</span>
              </div>
              <h2 className="text-lg font-display font-bold text-stone-900">
                Müfredat Temasına Göre Özgün Düşünce Deneyi Tasarla
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsAssistantOpen(false)}
              aria-label="Üretici panelini kapat"
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                1. Müfredat Teması Seçin
              </label>
              <div className="flex flex-wrap gap-2">
                {CURRICULUM_THEME_PRESETS.map((preset) => {
                  const active = selectedThemePreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectThemePreset(preset)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  2. Hedef Sınıf Düzeyi
                </label>
                <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200">
                  {(['10. Sınıf', '11. Sınıf', '10. ve 11. Sınıf'] as const).map((gradeOpt) => (
                    <button
                      key={gradeOpt}
                      type="button"
                      onClick={() => setAssistantGrade(gradeOpt)}
                      className={`flex-1 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        assistantGrade === gradeOpt
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {gradeOpt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-8">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="custom-exp-focus" className="text-xs font-bold text-stone-700">
                    3. Sınıf Odak Notu veya Senaryo Bağlamı (Opsiyonel)
                  </label>
                  <span className="text-[11px] font-mono tabular-nums text-stone-500">
                    {assistantFocus.length}/300
                  </span>
                </div>
                <input
                  id="custom-exp-focus"
                  type="text"
                  maxLength={300}
                  value={assistantFocus}
                  onChange={(e) => setAssistantFocus(e.target.value)}
                  placeholder="Örn: Otonom okul servisleri, yapay zekâ destekli sınav gözetimi veya dijital oy verme..."
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600"
                />
              </div>
            </div>

            {generatorError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{generatorError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-100">
              <p className="text-xs text-stone-500">
                Seçili tema: <span className="font-semibold text-stone-800">{selectedThemePreset.theme}</span>
              </p>
              <button
                type="submit"
                disabled={isGeneratingExp}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isGeneratingExp ? 'Deney Kurgulanıyor...' : 'Düşünce Deneyi Oluştur'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Main 2-Zone Split: Left Interactive Stage (65%) + Right Control & Context Deck (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Stage (Col 1-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Visual Stage Card */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            {/* Stage Banner Image or Generated Conceptual Vector Illustration */}
            <div className="relative aspect-16/9 w-full max-h-[380px] overflow-hidden bg-stone-900">
              {visualMode === 'illustration' && activeIllustration ? (
                <div
                  className={`w-full h-full relative ${
                    activeIllustration.mood === 'warm'
                      ? 'bg-gradient-to-br from-stone-950 via-amber-950/70 to-stone-900'
                      : activeIllustration.mood === 'slate'
                      ? 'bg-gradient-to-br from-slate-950 via-stone-900 to-slate-900'
                      : 'bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950'
                  }`}
                >
                  <svg
                    ref={illustrationSvgRef}
                    viewBox="0 0 800 450"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                    role="img"
                    aria-label={activeIllustration.metaphorTitle}
                  >
                    <rect width="800" height="450" fill="#141210" />
                    <g opacity="0.12" stroke="#78716c" strokeWidth="1">
                      <line x1="0" y1="112" x2="800" y2="112" />
                      <line x1="0" y1="225" x2="800" y2="225" />
                      <line x1="0" y1="337" x2="800" y2="337" />
                      <line x1="200" y1="0" x2="200" y2="450" />
                      <line x1="400" y1="0" x2="400" y2="450" />
                      <line x1="600" y1="0" x2="600" y2="450" />
                    </g>

                    {activeIllustration.shapes.map((shape, idx) => {
                      const common = {
                        fill: shape.fill || 'none',
                        stroke: shape.stroke || '#f59e0b',
                        strokeWidth: shape.strokeWidth ?? 2,
                        opacity: shape.opacity ?? 0.85,
                      };
                      if (shape.kind === 'circle') {
                        return (
                          <circle
                            key={idx}
                            cx={shape.x ?? 400}
                            cy={shape.y ?? 225}
                            r={shape.r ?? 50}
                            {...common}
                          />
                        );
                      }
                      if (shape.kind === 'rect') {
                        return (
                          <rect
                            key={idx}
                            x={shape.x ?? 250}
                            y={shape.y ?? 140}
                            width={shape.width ?? 160}
                            height={shape.height ?? 100}
                            rx={6}
                            {...common}
                          />
                        );
                      }
                      if (shape.kind === 'line') {
                        return (
                          <line
                            key={idx}
                            x1={shape.x ?? 150}
                            y1={shape.y ?? 225}
                            x2={shape.x2 ?? 650}
                            y2={shape.y2 ?? 225}
                            {...common}
                          />
                        );
                      }
                      if (shape.kind === 'polygon' && shape.points) {
                        return <polygon key={idx} points={shape.points} {...common} />;
                      }
                      if (shape.kind === 'path' && shape.d) {
                        return <path key={idx} d={shape.d} {...common} />;
                      }
                      return null;
                    })}

                    {activeIllustration.annotations.map((note, idx) => (
                      <text
                        key={idx}
                        x={note.x}
                        y={note.y}
                        textAnchor={note.align || 'middle'}
                        fill={
                          note.tone === 'amber'
                            ? '#fbbf24'
                            : note.tone === 'muted'
                            ? '#a8a29e'
                            : '#fafaf9'
                        }
                        fontSize="13"
                        fontWeight="600"
                        letterSpacing="0.06em"
                        fontFamily="ui-sans-serif, system-ui, sans-serif"
                      >
                        {note.text}
                      </text>
                    ))}
                  </svg>
                </div>
              ) : !imageLoadError ? (
                <img
                  src={selectedExp.image}
                  alt={selectedExp.title}
                  referrerPolicy="no-referrer"
                  onError={() => setImageLoadError(true)}
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-102"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 flex items-center justify-center">
                  <Compass className="w-12 h-12 text-amber-500/40" />
                </div>
              )}

              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                {selectedExp.isCustom && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCustomExperiment(selectedExp.id)}
                    title="Bu özel deneyi sil"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer backdrop-blur-sm border bg-stone-950/75 text-rose-200 border-rose-400/30 hover:bg-rose-950/90 whitespace-nowrap shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sil</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => toggleFavorite(selectedExp.id)}
                  aria-pressed={isSelectedFavorite}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-sm border whitespace-nowrap shrink-0 ${
                    isSelectedFavorite
                      ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-sm'
                      : 'bg-stone-950/70 text-stone-100 border-white/20 hover:bg-stone-900/90'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${isSelectedFavorite ? 'fill-stone-950' : ''}`} />
                  <span>{isSelectedFavorite ? 'Favorilerde' : 'Favoriye Ekle'}</span>
                </button>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-amber-300 mb-1">
                  <span>{selectedExp.field}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedExp.philosophers.join(', ')}</span>
                  {selectedExp.isCustom && selectedExp.source && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 text-stone-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        {selectedExp.source === 'gemini' ? 'Gemini AI Kurgusu' : 'Yerel Yedek Şablon'}
                      </span>
                    </>
                  )}
                  {visualMode === 'illustration' && activeIllustration && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 text-stone-200">
                        <Palette className="w-3.5 h-3.5 text-amber-400" />
                        {activeIllustration.source === 'gemini'
                          ? 'Gemini Kavramsal İllüstrasyon'
                          : 'Yerel Diyagram Şablonu'}
                      </span>
                    </>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                  {visualMode === 'illustration' && activeIllustration
                    ? activeIllustration.metaphorTitle
                    : selectedExp.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 line-clamp-2">
                  {visualMode === 'illustration' && activeIllustration
                    ? activeIllustration.visualCaption
                    : selectedExp.subtitle}
                </p>
              </div>
            </div>

            {/* Conceptual Illustration Control Bar */}
            <div className="px-6 py-3 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {activeIllustration && (
                  <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200">
                    <button
                      type="button"
                      onClick={() => setVisualMode('photo')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        visualMode === 'photo'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Sahne Görseli</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisualMode('illustration')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        visualMode === 'illustration'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Palette className="w-3.5 h-3.5 text-amber-600" />
                      <span>Kavramsal İllüstrasyon</span>
                    </button>
                  </div>
                )}

                {!activeIllustration && (
                  <span className="text-xs text-stone-500">
                    Seçili deney metnine göre özgün bir kavramsal diyagram üretebilirsiniz.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {visualMode === 'illustration' && activeIllustration && (
                  <button
                    type="button"
                    onClick={handleDownloadIllustrationSvg}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>SVG İndir</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleGenerateIllustration}
                  disabled={isGeneratingIllustration}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {isGeneratingIllustration
                      ? 'İllüstrasyon Çiziliyor...'
                      : activeIllustration
                      ? 'İllüstrasyonu Yenile'
                      : 'Metne Göre İllüstrasyon Üret'}
                  </span>
                </button>
              </div>
            </div>

            {illustrationError && (
              <div className="mx-6 mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{illustrationError}</span>
              </div>
            )}

            {/* Interactive Simulation Sandbox Canvas */}
            <div className="p-6 bg-stone-50/70 border-t border-stone-200">
              {/* 1. TROLLEY PROBLEM SIMULATION */}
              {selectedExp.interactiveType === 'trolley' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Varyant Seçimi:
                      </span>
                      <div className="flex items-center gap-1 bg-stone-200 p-1 rounded-md text-xs">
                        <button
                          onClick={() => setTrolleyVariant('switch')}
                          className={`px-2.5 py-1 rounded font-medium transition-colors ${
                            trolleyVariant === 'switch' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                          }`}
                        >
                          Klasik Makas Kolu (Bystander)
                        </button>
                        <button
                          onClick={() => setTrolleyVariant('bridge')}
                          className={`px-2.5 py-1 rounded font-medium transition-colors ${
                            trolleyVariant === 'bridge' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                          }`}
                        >
                          Üst Geçit & Ağır Adam (Footbridge)
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setTrolleySwitched(!trolleySwitched)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                        trolleySwitched
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-stone-900 text-white hover:bg-stone-800'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      {trolleyVariant === 'switch'
                        ? trolleySwitched
                          ? 'Makas Çekildi (Yan Hat)'
                          : 'Makası Çek (Kolu Değiştir)'
                        : trolleySwitched
                        ? 'İtildi (Eylem Yapıldı)'
                        : 'Üst Geçitten İt (Doğrudan Müdahale)'}
                    </button>
                  </div>

                  {/* Visual Railway Track Diagram */}
                  <div className="p-6 bg-stone-900 rounded-xl text-stone-100 relative overflow-hidden">
                    <div className="text-xs text-stone-400 mb-4 flex items-center justify-between">
                      <span>Simülasyon Durumu: Raylı Hat Ayrımı</span>
                      <span className="font-mono text-amber-400">
                        {trolleySwitched ? 'DURUM: SAPTIRILDI' : 'DURUM: DÜZ HAT'}
                      </span>
                    </div>

                    {/* Schematic Track Diagram */}
                    <div className="relative py-8">
                      {/* Incoming Track */}
                      <div className="h-2 bg-stone-700 w-1/3 rounded-l relative flex items-center">
                        <div
                          className="w-10 h-6 bg-amber-500 rounded border border-amber-300 text-stone-950 font-bold text-[10px] flex items-center justify-center absolute left-6 shadow-md transition-all duration-500"
                          style={{ left: trolleySwitched ? '22%' : '8%' }}
                        >
                          TRAMVAY
                        </div>
                      </div>

                      {/* Switch Fork */}
                      <div className="absolute left-1/3 top-8 bottom-8 flex flex-col justify-between w-2/3">
                        {/* Upper Track: 5 Workers */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-2 flex-1 rounded transition-colors ${
                              !trolleySwitched ? 'bg-rose-600/80' : 'bg-stone-700'
                            }`}
                          />
                          <div className="p-2 rounded bg-rose-950/80 border border-rose-600/50 text-rose-300 text-xs font-medium shrink-0 flex items-center gap-1.5">
                            <span className="font-bold text-rose-200">5 İşçi</span>
                            <span className="text-[10px] text-rose-400">
                              {!trolleySwitched ? '(Hedefte - Tehlike)' : '(Kurtuldu)'}
                            </span>
                          </div>
                        </div>

                        {/* Lower Track: 1 Worker */}
                        <div className="flex items-center gap-3 mt-6">
                          <div
                            className={`h-2 flex-1 rounded transition-colors ${
                              trolleySwitched ? 'bg-amber-500' : 'bg-stone-700'
                            }`}
                          />
                          <div className="p-2 rounded bg-amber-950/80 border border-amber-600/50 text-amber-300 text-xs font-medium shrink-0 flex items-center gap-1.5">
                            <span className="font-bold text-amber-200">
                              {trolleyVariant === 'switch' ? '1 Yan Hat İşçisi' : '1 Masum Kişi (Üst Geçit)'}
                            </span>
                            <span className="text-[10px] text-amber-400">
                              {trolleySwitched ? '(Hedefte - Kayıp)' : '(Güvende)'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Moral Calculator Readout */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-800 text-xs">
                      <div className="p-3 bg-stone-950/60 rounded-lg">
                        <span className="text-stone-400 block mb-1">Faydacı Perspektif (Bentham/Mill):</span>
                        <div className="font-semibold text-emerald-400">
                          {trolleySwitched
                            ? '+4 Net Can Kurtarıldı (Maksimum Toplam Fayda)'
                            : '-4 Net Can Kaybı (Eylemsizlik Tercihi)'}
                        </div>
                      </div>
                      <div className="p-3 bg-stone-950/60 rounded-lg">
                        <span className="text-stone-400 block mb-1">Kantçı Deontoloji Perspektifi:</span>
                        <div className="font-semibold text-rose-300">
                          {trolleySwitched
                            ? trolleyVariant === 'bridge'
                              ? 'İhlal: İnsan bir araç olarak kullanılamaz!'
                              : 'İkilem: Doğrudan öldürme vs İzin verme'
                            : 'Koşulsuz Buyruk: Masum birini öldürme suçu işlenmedi'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Classroom Live Voting Panel */}
                  <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-800 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-amber-600" />
                        Sınıf İçi Oylama ve İstatistik
                      </span>
                      <span className="text-stone-500">
                        Toplam {trolleyVotes.pull + trolleyVotes.pass} Öğrenci Oyu
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden flex">
                      <div
                        className="bg-amber-600 transition-all duration-300"
                        style={{
                          width: `${
                            (trolleyVotes.pull / (trolleyVotes.pull + trolleyVotes.pass || 1)) * 100
                          }%`,
                        }}
                      />
                      <div
                        className="bg-stone-700 transition-all duration-300"
                        style={{
                          width: `${
                            (trolleyVotes.pass / (trolleyVotes.pull + trolleyVotes.pass || 1)) * 100
                          }%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleTrolleyVote('pull')}
                        className="flex items-center gap-1.5 text-amber-700 hover:text-amber-900 font-medium cursor-pointer"
                      >
                        <span className="font-bold">Kolu Çekerim (%{Math.round((trolleyVotes.pull / (trolleyVotes.pull + trolleyVotes.pass || 1)) * 100)})</span>
                        <span className="text-stone-400">(+{trolleyVotes.pull})</span>
                      </button>

                      <button
                        onClick={() => handleTrolleyVote('pass')}
                        className="flex items-center gap-1.5 text-stone-700 hover:text-stone-900 font-medium cursor-pointer"
                      >
                        <span className="font-bold">Dokunmam (%{Math.round((trolleyVotes.pass / (trolleyVotes.pull + trolleyVotes.pass || 1)) * 100)})</span>
                        <span className="text-stone-400">(+{trolleyVotes.pass})</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. SHIP OF THESEUS SIMULATION */}
              {selectedExp.interactiveType === 'theseus' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-stone-700">
                        Değiştirilen Ahşap Parça Oranı:{' '}
                        <span className="font-mono text-amber-600 font-bold text-sm">
                          %{theseusReplacedPercent}
                        </span>
                      </label>
                      <span className="text-xs text-stone-500">
                        {theseusReplacedPercent === 0 && 'Tamamen Orijinal Gemi'}
                        {theseusReplacedPercent > 0 && theseusReplacedPercent < 100 && 'Kısmi Yenilenme Etabı'}
                        {theseusReplacedPercent === 100 && 'Tek Bir Orijinal Parça Kalmadı!'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={10}
                      value={theseusReplacedPercent}
                      onChange={(e) => setTheseusReplacedPercent(parseInt(e.target.value, 10))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>

                  {/* Visual Ship Deck Representation */}
                  <div className="p-6 bg-stone-900 rounded-xl text-stone-100 space-y-4">
                    <div className="text-xs text-stone-400 flex justify-between">
                      <span>Liman Simülasyonu: Gemi Gövdesi ve Tahta Dokusu</span>
                      <span className="font-mono text-amber-400">
                        Orijinal Parça: %{100 - theseusReplacedPercent} · Yeni Parça: %{theseusReplacedPercent}
                      </span>
                    </div>

                    {/* Ship Plank Grid */}
                    <div className="grid grid-cols-10 gap-1.5 p-4 bg-stone-950/70 rounded-lg border border-stone-800">
                      {Array.from({ length: 30 }).map((_, i) => {
                        const isReplaced = (i / 30) * 100 < theseusReplacedPercent;
                        return (
                          <div
                            key={i}
                            className={`h-8 rounded transition-all duration-300 flex items-center justify-center text-[10px] font-mono font-bold ${
                              isReplaced
                                ? 'bg-amber-600 text-amber-100 border border-amber-400/40'
                                : 'bg-stone-700 text-stone-300 border border-stone-600'
                            }`}
                            title={isReplaced ? 'Yeni Çam Tahtası' : 'Orijinal Meşe Tahtası'}
                          >
                            {isReplaced ? 'Y' : 'O'}
                          </div>
                        );
                      })}
                    </div>

                    {/* Aristotle's 4 Causes Explorer */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                      <div className="p-2.5 bg-stone-900 rounded border border-stone-800">
                        <span className="text-stone-400 block text-[11px]">1. Maddi Neden:</span>
                        <span className="font-semibold text-stone-200">
                          {theseusReplacedPercent === 100 ? 'Farklı Ağaç Lifleri' : 'Orijinal Meşe'}
                        </span>
                      </div>
                      <div className="p-2.5 bg-stone-900 rounded border border-stone-800">
                        <span className="text-stone-400 block text-[11px]">2. Formel Neden:</span>
                        <span className="font-semibold text-amber-300">Aynı Gemi Biçimi</span>
                      </div>
                      <div className="p-2.5 bg-stone-900 rounded border border-stone-800">
                        <span className="text-stone-400 block text-[11px]">3. Fail Neden:</span>
                        <span className="font-semibold text-stone-200">Marangoz / Usta</span>
                      </div>
                      <div className="p-2.5 bg-stone-900 rounded border border-stone-800">
                        <span className="text-stone-400 block text-[11px]">4. Ereksel Neden:</span>
                        <span className="font-semibold text-emerald-300">Zafer Anısı & Sefer</span>
                      </div>
                    </div>
                  </div>

                  {/* Student Choice Arena */}
                  <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                    <span className="text-xs font-bold text-stone-800 block">
                      Tüm parçalar değiştiğinde hangisi Theseus\'un gerçek gemisidir?
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <button
                        onClick={() => setTheseusUserChoice('repaired')}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          theseusUserChoice === 'repaired'
                            ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        A) Limanda Yüzen Gemi (Süreklilik & Form)
                      </button>

                      <button
                        onClick={() => setTheseusUserChoice('reconstructed')}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          theseusUserChoice === 'reconstructed'
                            ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        B) Eski Tahtalardan Toplanan İkinci Gemi (Maddi Özdeşlik)
                      </button>

                      <button
                        onClick={() => setTheseusUserChoice('neither')}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          theseusUserChoice === 'neither'
                            ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        C) İkisi de Değil (Özdeşlik Bozuldu / Herakleitos)
                      </button>
                    </div>

                    {theseusUserChoice && (
                      <div className="p-3 bg-stone-100 rounded-lg text-xs text-stone-700">
                        {theseusUserChoice === 'repaired' &&
                          'Aristotelesçi Form ve John Lockeçu süreklilik perspektifi: Nesneyi koruyan atomlar değil, formel yapı ve kesintisiz hafızadır.'}
                        {theseusUserChoice === 'reconstructed' &&
                          'Thomas Hobbes ikilemi: Orijinal maddeyi oluşturan töz ikinci gemide toplanmıştır; dolayısıyla köken bağı oradadır.'}
                        {theseusUserChoice === 'neither' &&
                          'Herakleitosçu oluş perspektifi: "Aynı ırmağa iki kez girilemez." Değişim gerçektir ve sabit bir nesnel kimlik bir yanılsamadır.'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. PLATO'S CAVE SIMULATION */}
              {selectedExp.interactiveType === 'cave' && (
                <div className="space-y-6">
                  {/* Stage Selector */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-stone-700">Alegori Basamakları:</span>
                    <div className="flex items-center gap-1.5 p-1 bg-stone-200 rounded-lg text-xs">
                      <button
                        onClick={() => setCaveStage(1)}
                        className={`px-3 py-1 rounded-md font-medium transition-colors ${
                          caveStage === 1 ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                        }`}
                      >
                        1. Aşama: Mağara & Gölgeler (Doxa)
                      </button>
                      <button
                        onClick={() => setCaveStage(2)}
                        className={`px-3 py-1 rounded-md font-medium transition-colors ${
                          caveStage === 2 ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                        }`}
                      >
                        2. Aşama: Zincirleri Kırış (Sorgulama)
                      </button>
                      <button
                        onClick={() => setCaveStage(3)}
                        className={`px-3 py-1 rounded-md font-medium transition-colors ${
                          caveStage === 3 ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                        }`}
                      >
                        3. Aşama: Güneş & İdealar (Episteme)
                      </button>
                    </div>
                  </div>

                  {/* Interactive Visual Stage */}
                  <div className="p-6 bg-stone-900 rounded-xl text-stone-100 space-y-4">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>Epistemolojik Düzey: {caveStage === 1 ? 'Sanı (Doxa)' : caveStage === 2 ? 'Matematiksel Akıl (Dianoia)' : 'Hakikat & İdealar (Noesis)'}</span>
                      <span className="font-mono text-amber-400">
                        Aydınlanma Seviyesi: %{caveStage === 1 ? '15' : caveStage === 2 ? '50' : '100'}
                      </span>
                    </div>

                    <div
                      className={`p-6 rounded-lg transition-all duration-500 border ${
                        caveStage === 1
                          ? 'bg-stone-950 border-stone-800 text-stone-300'
                          : caveStage === 2
                          ? 'bg-amber-950/40 border-amber-800 text-amber-200'
                          : 'bg-gradient-to-r from-amber-900/60 via-amber-800/40 to-stone-900 border-amber-500 text-amber-100'
                      }`}
                    >
                      <h4 className="text-base font-display font-bold mb-2">
                        {caveStage === 1 && 'Karanlık Mağara ve Duvara Yansıyan Gölgeler'}
                        {caveStage === 2 && 'Arkaya Dönüş: Ateş, Kuklalar ve Acı Veren Işık'}
                        {caveStage === 3 && 'Mağaranın Dışına Çıkış: Doğrudan Güneşe Bakış'}
                      </h4>
                      <p className="text-xs leading-relaxed">
                        {caveStage === 1 &&
                          'Mahkumlar yalnızca kuklacıların ateş önünden geçirdiği nesnelerin gölgelerini görür. Gölgeleri tek gerçeklik kabul ederler. Duyular dünyasının yanılsaması (Doxa).'}
                        {caveStage === 2 &&
                          'Zincirlerini çözen mahkum arkasını döner. Ateşin ışığı gözlerini kamaştırır. Gördüğü gölgelerin aslında yapay kuklaların yansıması olduğunu fark eder. Bu felsefi kriz aşamasıdır.'}
                        {caveStage === 3 &&
                          'Zorlu tırmanışın ardından gün ışığına ulaşılır. Artık yansımalar değil, bizzat nesnelerin kendisi ve her şeyi aydınlatan Güneş (İyi İdeası) kavranır.'}
                      </p>
                    </div>

                    {/* Modern Metaphor Comparison */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => setModernMetaphor(!modernMetaphor)}
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Lightbulb className="w-4 h-4" />
                        {modernMetaphor ? 'Tarihsel Metne Dön' : 'Modern Çağla Eşleştir (Sosyal Medya & Algoritmalar)'}
                      </button>
                    </div>

                    {modernMetaphor && (
                      <div className="p-3 bg-stone-950 rounded border border-amber-500/30 text-xs text-stone-300 space-y-1">
                        <span className="font-bold text-amber-300 block">
                          21. Yüzyıl Mağarası:
                        </span>
                        <span>
                          Duvara yansıyan gölgeler = Kişiselleştirilmiş sosyal medya akışları, algoritmik yankı odaları ve sahte haberler.
                        </span>
                        <span className="block mt-1">
                          Zincirleri kırmak = Eleştirel dijital okuryazarlık, kaynak teyidi ve dogmaları sorgulama cesareti.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. RAWLS' VEIL OF IGNORANCE SIMULATION */}
              {selectedExp.interactiveType === 'veil' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-stone-700 flex justify-between mb-1">
                        <span>Zenginlikten Alınan Vergi Oranı:</span>
                        <span className="font-mono text-amber-600">%{taxRate}</span>
                      </label>
                      <input
                        type="range"
                        min={10}
                        max={70}
                        step={5}
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseInt(e.target.value, 10))}
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 flex justify-between mb-1">
                        <span>En Dezavantajlıya Sosyal Taban Güvencesi:</span>
                        <span className="font-mono text-amber-600">{safetyNet} Puan</span>
                      </label>
                      <input
                        type="range"
                        min={10}
                        max={80}
                        step={5}
                        value={safetyNet}
                        onChange={(e) => setSafetyNet(parseInt(e.target.value, 10))}
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Lottery Draw Trigger */}
                  <div className="p-4 bg-stone-900 rounded-xl text-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        Peçe Arkasından Topluma Doğuş Kurası
                      </h4>
                      <p className="text-xs text-stone-300 mt-0.5">
                        Kurallarınızı koydunuz. Şimdi bu topluma hangi kimlikle doğacağınızı rastgele çekin.
                      </p>
                    </div>

                    <button
                      onClick={drawLottery}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      Kura Çek (Doğum Piyangosu)
                    </button>
                  </div>

                  {drawnIdentity && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-950 text-sm">
                          Doğduğunuz Kimlik: {drawnIdentity.role}
                        </span>
                        <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-semibold rounded text-[11px]">
                          Refah Endeksi: {drawnIdentity.income} / 100
                        </span>
                      </div>
                      <p className="text-stone-700">
                        Belirlediğiniz kurallara göre hayat standardınız:{' '}
                        <span className="font-semibold">{drawnIdentity.wellbeing}</span>.
                      </p>
                      <p className="text-stone-500 text-[11px]">
                        Rawls\'un Fark İlkesi (Difference Principle): Eşitsizlikler ancak toplumun en alt basamağındakinin durumunu iyileştiriyorsa meşrudur.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 5. SEARLE'S CHINESE ROOM SIMULATION (TYMM TEKNOLOJİ VE HAYAT) */}
              {selectedExp.interactiveType === 'chinese_room' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="font-bold text-stone-700">Simülasyon Adımı:</span>
                    <div className="flex items-center gap-1.5 p-1 bg-stone-200 rounded-lg">
                      <button
                        onClick={() => setChineseStep('input')}
                        className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                          chineseStep === 'input' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                        }`}
                      >
                        1. Dışarıdan Gelen Çince Soru
                      </button>
                      <button
                        onClick={() => setChineseStep('lookup')}
                        className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                          chineseStep === 'lookup' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                        }`}
                      >
                        2. Odadaki Kural Kitabı Eşleştirmesi (Sentaks)
                      </button>
                      <button
                        onClick={() => setChineseStep('output')}
                        className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                          chineseStep === 'output' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                        }`}
                      >
                        3. Dışarı Verilen Cevap (Turing Testi)
                      </button>
                    </div>
                  </div>

                  {/* Room Simulation Canvas */}
                  <div className="p-6 bg-stone-900 rounded-xl text-stone-100 space-y-4">
                    <div className="flex justify-between items-center text-xs text-stone-400">
                      <span>Kapalı Oda Deneyi: Zihin, Algoritma ve Anlama</span>
                      <span className="font-mono text-amber-400">
                        {chineseStep === 'input' && 'GİRDİ AŞAMASI'}
                        {chineseStep === 'lookup' && 'SENTAKS KURALI: SÖZDİZİMSEL EŞLEŞTİRME'}
                        {chineseStep === 'output' && 'ÇIKTI: ANLAMA YOK, TAKLİT TAM'}
                      </span>
                    </div>

                    <div className="p-5 bg-stone-950 rounded-lg border border-stone-800 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-400">Odaya Giren Çince Metin:</span>
                        <span className="font-mono text-amber-300 font-bold">{chineseQuery}</span>
                      </div>

                      {chineseStep !== 'input' && (
                        <div className="p-3 bg-stone-900 rounded border border-stone-800 text-xs space-y-1">
                          <span className="text-stone-400 block text-[11px]">İngilizce Kural Kitabı Direktifi:</span>
                          <span className="font-mono text-emerald-400">
                            Eğer girdi "你明白哲学吗？" ise, sepetten "我遵循规则，但我不思考。" sembolünü çıkarıp dışarı ver.
                          </span>
                        </div>
                      )}

                      {chineseStep === 'output' && (
                        <div className="p-3 bg-amber-950/60 rounded border border-amber-500/40 text-xs text-amber-200">
                          <strong className="block mb-1">Dışarıdakilerin Algısı:</strong>
                          "İçerideki kişi mükemmel Çince konuşuyor ve felsefeyi anlıyor!"
                          <strong className="block mt-2 text-rose-300">İçerideki Gerçeklik (Searle):</strong>
                          "Odadaki insan tek bir Çince kelime bile bilmiyor. Yalnızca şekilleri eşleştirdi. Sentaks (sözdizim), semantik (anlam) doğurmaz!"
                        </div>
                      )}
                    </div>

                    {/* Cahit Arf Perspective Box */}
                    <div className="p-3 bg-stone-900/60 rounded border border-stone-800 text-xs text-stone-300">
                      <span className="font-bold text-amber-400 block mb-1">Cahit Arf Perspektifi:</span>
                      "Makineler düşünebilir mi?" Cahit Arf, makinelerin mantıksal ve matematiksel bağıntıları işleyebileceğini ancak insanın estetik, ahlaki ve sezgisel derinliğini taklit etmekle yetineceğini vurgular.
                    </div>
                  </div>
                </div>
              )}

              {/* 6. ECO-DILEMMA SIMULATION (TYMM ÇEVRE SORUNLARI VE FELSEFE) */}
              {selectedExp.interactiveType === 'eco_dilemma' && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-stone-700 block mb-2">
                      Çevre Etiği Yaklaşımını Seçin:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <button
                        onClick={() => setEcoFramework('anthro')}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                          ecoFramework === 'anthro'
                            ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        1. İnsan Merkezli (Antroposentrizm)
                        <span className="text-[11px] text-stone-500 block font-normal mt-0.5">
                          Doğa, insanın refahı ve ekonomik faydası için bir araçtır.
                        </span>
                      </button>

                      <button
                        onClick={() => setEcoFramework('bio')}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                          ecoFramework === 'bio'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        2. Canlı Merkezli (Biyosentrizm)
                        <span className="text-[11px] text-stone-500 block font-normal mt-0.5">
                          Yaşayan her canlının (hayvanlar, bitkiler) içsel bir hakkı vardır.
                        </span>
                      </button>

                      <button
                        onClick={() => setEcoFramework('eco')}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                          ecoFramework === 'eco'
                            ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        3. Çevre Merkezli (Ekosentrizm)
                        <span className="text-[11px] text-stone-500 block font-normal mt-0.5">
                          Tüm ekosistem (nehirler, dağlar, toprak) ahlaki bir bütündür.
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Impact Readout */}
                  <div className="p-6 bg-stone-900 rounded-xl text-stone-100 space-y-4">
                    <div className="text-xs text-stone-400 flex justify-between">
                      <span>Proje Kararı: Vadi Barajı ve Enerji Santrali</span>
                      <span className="font-mono text-amber-400">
                        {ecoFramework === 'anthro' && 'KARAR: BARAJ İNŞA EDİLİR'}
                        {ecoFramework === 'bio' && 'KARAR: PROJE REVİZE EDİLİR (CANLI KORUMASI)'}
                        {ecoFramework === 'eco' && 'KARAR: VADİ DOKUNULMAZ İLAN EDİLİR'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-3 bg-stone-950 rounded border border-stone-800">
                        <span className="text-stone-400 block text-[11px] mb-1">İnsan Refahı / Enerji:</span>
                        <span className={`font-mono text-sm font-bold ${ecoFramework === 'anthro' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {ecoFramework === 'anthro' ? '%95 (Yüksek)' : ecoFramework === 'bio' ? '%60 (Dengeli)' : '%30 (Alternatif)'}
                        </span>
                      </div>

                      <div className="p-3 bg-stone-950 rounded border border-stone-800">
                        <span className="text-stone-400 block text-[11px] mb-1">Biyoçeşitlilik Koruma:</span>
                        <span className={`font-mono text-sm font-bold ${ecoFramework === 'eco' ? 'text-emerald-400' : ecoFramework === 'bio' ? 'text-emerald-300' : 'text-rose-400'}`}>
                          {ecoFramework === 'anthro' ? '%20 (Kayıp)' : ecoFramework === 'bio' ? '%85 (Korundu)' : '%100 (Kusursuz)'}
                        </span>
                      </div>

                      <div className="p-3 bg-stone-950 rounded border border-stone-800">
                        <span className="text-stone-400 block text-[11px] mb-1">Gelecek Kuşaklara Sorumluluk:</span>
                        <span className={`font-mono text-sm font-bold ${ecoFramework !== 'anthro' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {ecoFramework === 'anthro' ? 'Kısa Vadeli Fayda' : 'Sürdürülebilir Miras (Hans Jonas)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. CUSTOM AI-GENERATED DILEMMA SIMULATION */}
              {selectedExp.interactiveType === 'custom_dilemma' && (
                <div className="space-y-6">
                  {/* Narrative Dilemma Brief */}
                  <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-stone-500">
                      <span className="font-bold text-stone-800">Senaryo Metni</span>
                      <span>
                        {selectedExp.theme ? `${selectedExp.theme} · ` : ''}
                        {selectedExp.tymmCode}
                      </span>
                    </div>
                    <p className="text-sm text-stone-800 leading-relaxed">
                      {selectedExp.summary}
                    </p>
                    <p className="text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-2">
                      {selectedExp.context}
                    </p>
                  </div>

                  {/* Interactive Philosophical Choice Canvas */}
                  {(() => {
                    const choices = selectedExp.dilemmaChoices || [];
                    const selectedChoiceIdx = customChoiceMap[selectedExp.id] ?? null;
                    const votes = customVoteMap[selectedExp.id] || { a: 0, b: 0 };
                    const totalVotes = votes.a + votes.b;
                    const percentA = totalVotes > 0 ? Math.round((votes.a / totalVotes) * 100) : 50;
                    const percentB = totalVotes > 0 ? Math.round((votes.b / totalVotes) * 100) : 50;

                    return (
                      <>
                        <div className="p-6 bg-stone-900 rounded-xl text-stone-100 space-y-4">
                          <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-stone-400">
                            <span>Sınıf Karar Çatallanması: İkilemin İki Ucu</span>
                            <span className="font-mono text-amber-400">
                              {selectedChoiceIdx === null
                                ? 'BİR TERCİH SEÇİN'
                                : `SEÇİLİ KONUM: SEÇENEK ${selectedChoiceIdx === 0 ? 'A' : 'B'}`}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {choices.map((choice, idx) => {
                              const isSelected = selectedChoiceIdx === idx;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() =>
                                    setCustomChoiceMap((prev) => ({
                                      ...prev,
                                      [selectedExp.id]: idx,
                                    }))
                                  }
                                  className={`p-4 rounded-lg border text-left transition-colors cursor-pointer space-y-1.5 ${
                                    isSelected
                                      ? 'bg-amber-500/15 border-amber-400 text-white'
                                      : 'bg-stone-950/70 border-stone-800 text-stone-300 hover:border-stone-600'
                                  }`}
                                >
                                  <div className="text-[11px] font-mono text-amber-400">
                                    SEÇENEK {idx === 0 ? 'A' : 'B'}
                                  </div>
                                  <div className="text-sm font-bold text-white leading-snug">
                                    {choice.label}
                                  </div>
                                  <div className="text-xs text-stone-400">
                                    {choice.perspectiveTitle}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {selectedChoiceIdx !== null && choices[selectedChoiceIdx] && (
                            <div className="p-4 bg-stone-950 rounded-lg border border-amber-500/40 space-y-1.5">
                              <div className="text-xs font-bold text-amber-300">
                                Felsefi Çözümleme: {choices[selectedChoiceIdx].perspectiveTitle}
                              </div>
                              <p className="text-xs text-stone-200 leading-relaxed">
                                {choices[selectedChoiceIdx].philosophicalAnalysis}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Live Classroom Voting Bar */}
                        {choices.length >= 2 && (
                          <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-amber-600" />
                                Sınıf İçi Oylama ve İstatistik
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-stone-500 tabular-nums">
                                  Toplam {totalVotes} Öğrenci Oyu
                                </span>
                                {totalVotes > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleResetCustomVotes(selectedExp.id)}
                                    className="text-[11px] font-medium text-stone-500 hover:text-stone-900 cursor-pointer flex items-center gap-1"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    Sıfırla
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden flex">
                              <div
                                className="bg-amber-600 transition-all duration-300"
                                style={{ width: `${percentA}%` }}
                              />
                              <div
                                className="bg-stone-700 transition-all duration-300"
                                style={{ width: `${percentB}%` }}
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <button
                                type="button"
                                onClick={() => handleCustomVote(selectedExp.id, 'a')}
                                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium cursor-pointer text-left"
                              >
                                <span className="truncate">A) {choices[0].label}</span>
                                <span className="font-mono tabular-nums font-bold shrink-0">
                                  %{percentA} (+{votes.a})
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCustomVote(selectedExp.id, 'b')}
                                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-900 font-medium cursor-pointer text-left"
                              >
                                <span className="truncate">B) {choices[1].label}</span>
                                <span className="font-mono tabular-nums font-bold shrink-0">
                                  %{percentB} (+{votes.b})
                                </span>
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Stage: Control & Concept Deck (Col 9-12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Favorite Experiments Quick-Access Panel */}
          <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                Favori Deneylerim
              </div>
              <span className="text-[11px] font-semibold text-stone-500 tabular-nums">
                {favoriteExperiments.length} kayıtlı
              </span>
            </div>

            {favoriteExperiments.length === 0 ? (
              <p className="text-xs text-stone-500 leading-relaxed">
                Sık kullandığınız düşünce deneylerini yıldızlayarak ders öncesi hızlı erişim listesi oluşturabilirsiniz.
              </p>
            ) : (
              <div className="space-y-2">
                {favoriteExperiments.map((favExp) => {
                  const isCurrent = favExp.id === selectedExp.id;
                  return (
                    <div
                      key={favExp.id}
                      className={`flex items-center justify-between gap-2 p-2.5 rounded-lg border transition-colors ${
                        isCurrent
                          ? 'bg-amber-50/80 border-amber-300'
                          : 'bg-stone-50 border-stone-200/80 hover:border-stone-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => selectExperiment(favExp)}
                        className="flex-1 text-left cursor-pointer min-w-0"
                      >
                        <div className="text-xs font-bold text-stone-900 truncate">
                          {favExp.title}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">
                          {favExp.field} · {favExp.tymmCode}
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(favExp.id)}
                        title="Favorilerden çıkar"
                        aria-label={`${favExp.title} deneyini favorilerden çıkar`}
                        className="p-1.5 rounded-md text-amber-500 hover:bg-amber-100/70 transition-colors cursor-pointer shrink-0"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pedagogical & Discussion Questions Deck */}
          <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-3">
              <Compass className="w-4 h-4 text-amber-600" />
              Sınıf Tartışma Soruları
            </div>

            <div className="space-y-3">
              {selectedExp.discussionQuestions.map((q, idx) => (
                <div key={idx} className="p-3 bg-stone-50 rounded-lg border border-stone-200/80 text-xs text-stone-700 space-y-1">
                  <span className="font-bold text-amber-700 block">Soru #{idx + 1}:</span>
                  <p className="leading-relaxed font-medium">{q}</p>
                </div>
              ))}
            </div>
          </div>

          {/* MEB Curriculum Integration Box */}
          <div className="p-5 bg-stone-900 text-stone-100 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              MEB Müfredat Kazanım Eşleşmesi
            </div>
            <p className="text-xs text-stone-300 font-medium">
              {selectedExp.mebUnit}
            </p>
            <div className="text-[11px] text-stone-400 border-t border-stone-800 pt-3">
              <span className="font-bold text-stone-300 block mb-1">Öğretmen Kolaylaştırıcı İpucu:</span>
              Düşünce deneyini doğrudan anlatmak yerine, öğrencilere ilk olarak seçim yaptırın. Seçimin ardından kendi varsayımlarını savunmalarını isteyin.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
