import React, { useState } from 'react';
import {
  GitFork,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Download,
  Share2,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';

interface ArgumentBlock {
  id: string;
  type: 'claim' | 'premise' | 'counter' | 'rebuttal';
  label: string;
  text: string;
}

const TEMPLATES: Record<string, { title: string; philosopher: string; blocks: ArgumentBlock[] }> = {
  descartes: {
    title: 'Descartes: Kartezyen Şüphe & Cogito',
    philosopher: 'René Descartes (1641)',
    blocks: [
      { id: '1', type: 'claim', label: 'Ana Tez (Sonuç)', text: 'Ben şüphe edilemeyecek bir kesinlikle varım (Cogito ergo sum).' },
      { id: '2', type: 'premise', label: 'Öncül 1 (Duyuların Aldatıcılığı)', text: 'Duyularım beni zaman zaman yanıltır; öyleyse hiçbir zaman tamamen güvenilemezler.' },
      { id: '3', type: 'premise', label: 'Öncül 2 (Şüphenin Zorunluluğu)', text: 'Her şeyden, hatta bir rüyada olduğumdan bile şüphe edebilirim.' },
      { id: '4', type: 'premise', label: 'Öncül 3 (Düşünce Eylemi)', text: 'Fakat şüphe edebilmem için şüphe eden bir şey olmam gerekir; şüphe etmek bir düşünme biçimidir.' },
      { id: '5', type: 'counter', label: 'Olası İtiraz (Nietzsche)', text: '"Düşünüyorum" demek "bir özne var" sonucunu zorunlu kılmaz; sadece bir düşünce var olduğunu gösterir.' },
      { id: '6', type: 'rebuttal', label: 'Çürütme & Savunma', text: 'Düşüncenin varlığı dahi bilinçli bir deneyimleyicinin mevcudiyetine işaret eder.' }
    ]
  },
  epikuros: {
    title: 'Epikuros: Kötülük Problemi Paradoksu',
    philosopher: 'Epikuros & David Hume',
    blocks: [
      { id: '1', type: 'claim', label: 'Ana Tez (Sonuç)', text: 'Dünyada kötülüğün varlığı, hem mutlak iyi hem de mutlak güçlü bir yaratıcı tanımıyla çelişir.' },
      { id: '2', type: 'premise', label: 'Öncül 1 (İrade)', text: 'Tanrı kötülüğü önlemek istiyor da gücü mü yetmiyor? O halde mutlak kudretli değildir.' },
      { id: '3', type: 'premise', label: 'Öncül 2 (Kudret)', text: 'Gücü yetiyor da kötülüğü önlemek mi istemiyor? O halde mutlak iyi ve merhametli değildir.' },
      { id: '4', type: 'counter', label: 'Olası İtiraz (Özgür İrade Savunması)', text: 'Kötülük Tanrı\'dan değil, insana bahşedilen ahlaki özgür iradenin kötüye kullanılmasından doğar.' },
      { id: '5', type: 'rebuttal', label: 'Çürütme & Yanıt', text: 'Doğal felaketler, depremler ve masum bebeklerin acıları insanın ahlaki seçimiyle açıklanamaz (Doğal Kötülük).' }
    ]
  },
  kant: {
    title: 'Kant: Evrenselleştirilebilirlik & Kategorik Buyruk',
    philosopher: 'Immanuel Kant',
    blocks: [
      { id: '1', type: 'claim', label: 'Ana Tez (Sonuç)', text: 'Yalan söylemek hiçbir koşulda (hatta bir hayat kurtaracak olsa bile) ahlaken meşru kılınamaz.' },
      { id: '2', type: 'premise', label: 'Öncül 1 (Maksim Testi)', text: 'Bir eylem ilkesi ancak herkes tarafından aynı anda genel bir doğa yasası haline getirilebiliyorsa ahlakidir.' },
      { id: '3', type: 'premise', label: 'Öncül 2 (Mantıksal Çelişki)', text: 'Eğer herkes zor durumda kaldığında yalan söyleseydi "söz verme" ve "güven" kavramı yok olurdu; kural kendi kendini imha ederdi.' },
      { id: '4', type: 'counter', label: 'Olası İtiraz (Benjamin Constant)', text: 'Bir katil arkadaşımızı öldürmek için onun yerini sorduğunda hakikati söylemek cinayete ortak olmak demektir.' },
      { id: '5', type: 'rebuttal', label: 'Çürütme & Kantçı Yanıt', text: 'Sonuçlar bizim tam kontrolümüzde değildir; ahlaki ödev sonuçların tahminine göre eğilip bükülemez.' }
    ]
  }
};

export const ArgumentMapper: React.FC = () => {
  const [activeTemplateKey, setActiveTemplateKey] = useState<string>('descartes');
  const [blocks, setBlocks] = useState<ArgumentBlock[]>(TEMPLATES.descartes.blocks);
  const [analysisResult, setAnalysisResult] = useState<{
    strengthScore: number;
    validityAssessment: string;
    detectedFallacies: string[];
    strengtheningTips: string[];
    counterCounterStrategy: string;
    source?: 'gemini' | 'fallback';
    fallbackReason?: string;
  } | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleSelectTemplate = (key: string) => {
    setActiveTemplateKey(key);
    setBlocks(TEMPLATES[key].blocks);
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  const handleAddBlock = (type: 'premise' | 'counter' | 'rebuttal') => {
    if (blocks.length >= 16) return;
    const labels: Record<string, string> = {
      premise: `Öncül ${blocks.filter((b) => b.type === 'premise').length + 1}`,
      counter: 'Yeni Karşı Argüman (İtiraz)',
      rebuttal: 'Yeni Çürütme & Savunma'
    };

    const newBlock: ArgumentBlock = {
      id: Date.now().toString(),
      type,
      label: labels[type],
      text: ''
    };

    setBlocks([...blocks, newBlock]);
  };

  const handleUpdateText = (id: string, text: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, text: text.slice(0, 500) } : b)));
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const claimBlock = blocks.find((b) => b.type === 'claim')?.text || '';
      const premises = blocks.filter((b) => b.type === 'premise').map((b) => b.text).filter(Boolean).slice(0, 10);
      const counterArguments = blocks.filter((b) => b.type === 'counter').map((b) => b.text).filter(Boolean).slice(0, 10);

      const res = await fetch('/api/analyze-argument', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: claimBlock, premises, counterArguments })
      });

      const data = await res.json();
      if (!res.ok) {
        setAnalysisError(data.error || 'Mantıksal analiz tamamlanamadı.');
        return;
      }
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
      setAnalysisError('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExportText = () => {
    const textContent = blocks
      .map((b) => `[${b.label}]\n${b.text}\n`)
      .join('\n----------------------------------------\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `arguman-haritasi-${activeTemplateKey}.txt`;
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
              <span>Mantık & Akıl Yürütme Şeması</span>
              <span aria-hidden="true">·</span>
              <span>Öncül - İddia - İtiraz Mimarisi</span>
              <span aria-hidden="true">·</span>
              <span>Tümdengelim & Geçerlilik Testi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 tracking-tight">
              İnteraktif Argüman Haritası
            </h1>
            <p className="mt-1 text-sm text-stone-600 max-w-3xl">
              Felsefi iddiaları mantıksal yapı taşlarına ayırın; öncülleri, karşı tezleri ve çürütmeleri görselleştirerek bir savın geçerli ve sağlam (sound) olup olmadığını test edin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportText}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Metin Olarak İndir
            </button>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {analyzing ? 'İnceleniyor...' : 'Mantıksal Tutarlılığı Test Et'}
            </button>
          </div>
        </div>
      </div>

      {/* Template Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-stone-500 uppercase tracking-wider shrink-0 text-[11px]">
          Felsefi Kanıt Şablonları:
        </span>
        {Object.entries(TEMPLATES).map(([key, item]) => (
          <button
            key={key}
            onClick={() => handleSelectTemplate(key)}
            className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
              activeTemplateKey === key
                ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-xs'
                : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Visual Map Canvas (Col 1-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-3">
            {blocks.map((block, index) => {
              const isClaim = block.type === 'claim';
              const isPremise = block.type === 'premise';
              const isCounter = block.type === 'counter';
              const isRebuttal = block.type === 'rebuttal';

              return (
                <div
                  key={block.id}
                  className={`p-4 rounded-xl border transition-all relative ${
                    isClaim
                      ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                      : isPremise
                      ? 'bg-white border-stone-200 shadow-xs'
                      : isCounter
                      ? 'bg-rose-50/80 border-rose-200'
                      : 'bg-emerald-50/80 border-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isClaim
                            ? 'text-amber-900 font-display'
                            : isPremise
                            ? 'text-stone-700'
                            : isCounter
                            ? 'text-rose-900'
                            : 'text-emerald-900'
                        }`}
                      >
                        {block.label}
                      </span>
                    </div>

                    {!isClaim && (
                      <button
                        onClick={() => handleDeleteBlock(block.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
                        title="Düğümü Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={2}
                    maxLength={500}
                    value={block.text}
                    onChange={(e) => handleUpdateText(block.id, e.target.value)}
                    placeholder="Argüman önermesini buraya yazın..."
                    className="w-full text-xs sm:text-sm bg-transparent border-0 focus:ring-0 p-0 text-stone-800 resize-none font-sans leading-relaxed"
                  />
                </div>
              );
            })}
          </div>

          {/* Add Node Controls */}
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <button
              onClick={() => handleAddBlock('premise')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-stone-500" />
              Destekleyici Öncül Ekle
            </button>

            <button
              onClick={() => handleAddBlock('counter')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-rose-500" />
              Karşı Argüman (İtiraz) Ekle
            </button>

            <button
              onClick={() => handleAddBlock('rebuttal')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-500" />
              Çürütme & Savunma Ekle
            </button>
          </div>
        </div>

        {/* Right Analysis & Logical Rules Deck (Col 9-12) */}
        <div className="lg:col-span-4 space-y-6">
          {analysisError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}

          {/* Analysis Results Box */}
          {analysisResult ? (
            <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-4">
              <div className="border-b border-stone-100 pb-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Mantıksal Analiz Raporu
                  </span>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded">
                    Güç Puanı: {analysisResult.strengthScore} / 100
                  </span>
                </div>
                {analysisResult.source && (
                  <div className="pt-1">
                    {analysisResult.source === 'gemini' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-semibold">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        Kaynak: Gemini Canlı Analiz
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-mono font-semibold">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Kaynak: Yerel Yedek Analiz (
                        {analysisResult.fallbackReason === 'timeout'
                          ? 'Zaman aşımı'
                          : analysisResult.fallbackReason === 'api_error'
                          ? 'API hatası'
                          : 'Çevrimdışı'}
                        )
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-stone-700 block mb-1">
                    Geçerlilik ve Tutarlılık Değerlendirmesi:
                  </span>
                  <p className="text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded border border-stone-200/60">
                    {analysisResult.validityAssessment}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-rose-700 block mb-1">
                    Riskli Safsatalar:
                  </span>
                  <ul className="list-disc list-inside text-stone-600 space-y-0.5">
                    {analysisResult.detectedFallacies.map((fal, i) => (
                      <li key={i}>{fal}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-bold text-emerald-700 block mb-1">
                    Argümanı Güçlendirme Önerileri:
                  </span>
                  <ul className="list-disc list-inside text-stone-600 space-y-1">
                    {analysisResult.strengtheningTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-stone-900 text-stone-100 rounded-xl border border-stone-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                Mantıksal Sağlamlık Kuralları
              </div>

              <div className="space-y-2.5 text-xs text-stone-300">
                <p>
                  <strong className="text-amber-300">Geçerlilik (Validity):</strong> Öncüller doğru kabul edildiğinde sonucun zorunlu olarak doğru çıkmasıdır. Biçimsel mantıkla ilgilidir.
                </p>
                <p>
                  <strong className="text-amber-300">Sağlamlık (Soundness):</strong> Argümanın hem mantıksal olarak geçerli olması hem de tüm öncüllerinin fiilen doğru olması durumudur.
                </p>
                <p className="text-stone-400 text-[11px] border-t border-stone-800 pt-2">
                  İpucu: "Mantıksal Tutarlılığı Test Et" butonuna tıklayarak argümanınızı doğrudan analiz edebilirsiniz.
                </p>
              </div>
            </div>
          )}

          {/* Teacher Worksheet Handout Helper */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
            <span className="font-bold flex items-center gap-1.5 text-amber-900">
              <FileText className="w-4 h-4 text-amber-700" />
              Sınıf İçi Etkinlik Yönergesi:
            </span>
            <p className="leading-relaxed">
              Öğrencileri ikişerli gruplara ayırın. Bir öğrenci iddiayı savunacak öncülleri kurarken, diğeri çürütme ve karşı argüman bloklarını yazsın. Ardından rolleri değiştirin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
