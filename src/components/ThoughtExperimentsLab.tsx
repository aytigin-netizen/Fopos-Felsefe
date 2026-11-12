import React, { useState } from 'react';
import { THOUGHT_EXPERIMENTS } from '../data/thoughtExperiments';
import { ThoughtExperiment } from '../types/philosophy';
import {
  Compass,
  ArrowRight,
  RotateCcw,
  Users,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Shield,
  BookOpen
} from 'lucide-react';

export const ThoughtExperimentsLab: React.FC = () => {
  const [selectedExp, setSelectedExp] = useState<ThoughtExperiment>(THOUGHT_EXPERIMENTS[0]);

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

          {/* Experiment Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/70 rounded-lg shrink-0">
            {THOUGHT_EXPERIMENTS.map((exp) => (
              <button
                key={exp.id}
                onClick={() => setSelectedExp(exp)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  selectedExp.id === exp.id
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {exp.id === 'trolley' && 'Tramvay (Ahlak)'}
                {exp.id === 'theseus' && 'Theseus (Varlık)'}
                {exp.id === 'cave' && 'Mağara (Bilgi)'}
                {exp.id === 'veil' && 'Peçe (Siyaset/Hukuk)'}
                {exp.id === 'chinese_room' && 'Çin Odası (Teknoloji)'}
                {exp.id === 'eco_dilemma' && 'Eko-Etik (Çevre)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Zone Split: Left Interactive Stage (65%) + Right Control & Context Deck (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Stage (Col 1-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Visual Stage Card */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            {/* Stage Banner Image with subtle overlay */}
            <div className="relative aspect-16/9 w-full max-h-[380px] overflow-hidden bg-stone-900">
              <img
                src={selectedExp.image}
                alt={selectedExp.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center gap-2 text-xs font-medium text-amber-300 mb-1">
                  <span>{selectedExp.field}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedExp.philosophers.join(', ')}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                  {selectedExp.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 line-clamp-2">
                  {selectedExp.subtitle}
                </p>
              </div>
            </div>

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
            </div>
          </div>
        </div>

        {/* Right Stage: Control & Concept Deck (Col 9-12) */}
        <div className="lg:col-span-4 space-y-6">
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
