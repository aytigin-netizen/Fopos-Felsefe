import React, { useState } from 'react';
import { SocraticMessage } from '../types/philosophy';
import { Send, Sparkles, MessageSquare, AlertCircle, ShieldCheck, RefreshCw, Feather } from 'lucide-react';

interface PhilosopherOption {
  id: string;
  name: string;
  era: string;
  stance: string;
  avatarLetter: string;
}

const PHILOSOPHERS: PhilosopherOption[] = [
  {
    id: 'sokrates',
    name: 'Sokrates',
    era: 'Antik Yunan (M.Ö. 469-399)',
    stance: 'İroni & Maiotik (Kavram Doğurtma, Bilgisizlik İtirafı)',
    avatarLetter: 'Σ'
  },
  {
    id: 'kant',
    name: 'Immanuel Kant',
    era: 'Aydınlanma (1724-1804)',
    stance: 'Kategorik Buyruk, Ödev Ahlakı, Aklın Sınırları',
    avatarLetter: 'K'
  },
  {
    id: 'nietzsche',
    name: 'Friedrich Nietzsche',
    era: '19. Yüzyıl (1844-1900)',
    stance: 'Değerlerin Yeniden Değerlendirilmesi, Güç İstemi, Sürü Ahlakı Eleştirisi',
    avatarLetter: 'N'
  },
  {
    id: 'ibnsina',
    name: 'İbn Sina (Avicenna)',
    era: 'İslam Rönesansı (980-1037)',
    stance: 'Meşşai Akılcılık, Mantık ve Zorunlu Varlık Kanıtı',
    avatarLetter: 'İ'
  },
  {
    id: 'spinoza',
    name: 'Baruch Spinoza',
    era: '17. Yüzyıl (1632-1677)',
    stance: 'Deus sive Natura, Panteist Zorunluluk, Akli Özgürleşme',
    avatarLetter: 'S'
  }
];

const STARTER_PROMPTS = [
  'Eğer kimse beni görmüyorsa ve asla yakalanmayacaksam, adil davranmak zorunda mıyım?',
  'Yapay zeka acı çekemez veya aşık olamaz; bu yüzden hiçbir zaman gerçek bir bilince sahip olamaz.',
  'Özgür irade fiziki nedenselliğin bir yanılsamasıdır; kararlarımız beynimizin kimyasal tepkimeleridir.',
  'İyi ve kötü diye nesnel bir şey yoktur; ahlak toplumun güçsüzleri dizginlemek için uydurduğu bir kuraldır.'
];

export const SocraticArena: React.FC = () => {
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<PhilosopherOption>(PHILOSOPHERS[0]);
  const [topic, setTopic] = useState<string>('Ahlak ve Adalet');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<SocraticMessage[]>([
    {
      id: 'init-1',
      sender: 'philosopher',
      text: 'Atina pazarında dolaşırken rastlaştık dostum. Zihnini kurcalayan, herkesin bildiğini sandığı ama aslında kimsenin tam tanımlayamadığı o temel kavram nedir? Bana adaleti, iyiyi ya da hakikati nasıl anladığını söyle.',
      timestamp: 'Şimdi'
    }
  ]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: SocraticMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/socratic-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          philosopher: selectedPhilosopher.id,
          topic,
          userMessage: textToSend,
          history: messages.slice(-5)
        })
      });

      const data = await response.json();
      const botMsg: SocraticMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'philosopher',
        text: data.reply || 'Düşüncenin derinliği bir soruyla başlar. Bu iddiayı hangi mantıksal öncüle dayandırıyorsun?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'philosopher',
          text: 'Bu iddian çok iddialı görünüyor. Peki aksi bir örnek ortaya koyarsam düşünceni değiştirmeye hazır mısın?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDialogue = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'philosopher',
        text: `${selectedPhilosopher.name} olarak buradayım. Hangi felsefi önermeni veya inancını birlikte sorgulayalım?`,
        timestamp: 'Şimdi'
      }
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Intro */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
              <span>Diyalektik & Mantık Laboratuvarı</span>
              <span aria-hidden="true">·</span>
              <span>Sokratik Maiotik Simülasyonu</span>
              <span aria-hidden="true">·</span>
              <span>Safsata Teşhisi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 tracking-tight">
              Sokratik Diyalog & Felsefi Münazara
            </h1>
            <p className="mt-1 text-sm text-stone-600 max-w-3xl">
              Felsefe tarihinin büyük düşünürleriyle doğrudan diyalog kurun; savunduğunuz tezleri çürütmeye veya çelişkilerini doğurtmaya çalışan sorularla akıl yürütme sınırlarınızı keşfedin.
            </p>
          </div>

          <button
            onClick={handleResetDialogue}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Diyaloğu Sıfırla
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Dialectic Chat Stage (Col 1-8) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Sparring Partner Banner */}
          <div className="p-4 bg-stone-900 text-stone-100 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-display font-bold text-amber-300 text-lg shrink-0">
                {selectedPhilosopher.avatarLetter}
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-amber-100">
                  {selectedPhilosopher.name}
                </h3>
                <p className="text-xs text-stone-400">
                  {selectedPhilosopher.era} · {selectedPhilosopher.stance}
                </p>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <span className="text-[11px] text-stone-400 block">Yöntem:</span>
              <span className="text-xs font-mono text-amber-400">Sokratik Elenkhos</span>
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 min-h-[440px] max-h-[560px] overflow-y-auto space-y-4 shadow-xs">
            {messages.map((msg) => {
              const isPhilosopher = msg.sender === 'philosopher';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isPhilosopher ? 'justify-start' : 'justify-end'}`}
                >
                  {isPhilosopher && (
                    <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center font-display font-bold text-amber-800 text-xs shrink-0 mt-1">
                      {selectedPhilosopher.avatarLetter}
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-xl p-4 text-xs leading-relaxed space-y-2 ${
                      isPhilosopher
                        ? 'bg-stone-50 border border-stone-200/90 text-stone-800'
                        : 'bg-stone-900 text-stone-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] text-stone-400">
                      <span className="font-semibold">
                        {isPhilosopher ? selectedPhilosopher.name : 'Öğrenci / Savunucu'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <p className="text-xs sm:text-sm font-sans whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-stone-500 italic pl-11">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{selectedPhilosopher.name} argümanınızdaki çelişkileri inceliyor...</span>
              </div>
            )}
          </div>

          {/* Input Box & Actions */}
          <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-3 shadow-xs">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Felsefi tezinizi veya argümanınızı yazın (Örn: İnsan doğası gereği bencil midir?)..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={loading || !inputMessage.trim()}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <span>Sorgula</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Socratic Sparks */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-stone-500 block">
                Örnek Felsefi Tezlerle Başla:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STARTER_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[11px] px-2.5 py-1 bg-stone-100 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 rounded-md text-stone-700 transition-colors text-left cursor-pointer truncate max-w-full"
                  >
                    "{prompt.slice(0, 45)}..."
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Partner & Dialectic Tools Deck (Col 9-12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Philosopher Selection Panel */}
          <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-3">
              <Feather className="w-4 h-4 text-amber-600" />
              Diyalektik Muhatabı Seçin
            </div>

            <div className="space-y-2">
              {PHILOSOPHERS.map((phil) => (
                <button
                  key={phil.id}
                  onClick={() => {
                    setSelectedPhilosopher(phil);
                    setMessages([
                      {
                        id: Date.now().toString(),
                        sender: 'philosopher',
                        text: `Ben ${phil.name}. Düşüncenin temel ilkelerini birlikte test edelim. İddian nedir?`,
                        timestamp: 'Şimdi'
                      }
                    ]);
                  }}
                  className={`w-full p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    selectedPhilosopher.id === phil.id
                      ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs shrink-0 ${
                      selectedPhilosopher.id === phil.id
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {phil.avatarLetter}
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-bold text-stone-900 block truncate">
                      {phil.name}
                    </span>
                    <span className="text-[11px] text-stone-500 block truncate">
                      {phil.stance}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Socratic Fallacy Inspector Checklist */}
          <div className="p-5 bg-stone-900 text-stone-100 rounded-xl border border-stone-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              Sınıfta İzlenecek Safsatalar (Fallacies)
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-stone-950/80 rounded border border-stone-800">
                <span className="font-bold text-rose-300 block mb-0.5">Ad Hominem (Kişiye Saldırı):</span>
                <span className="text-stone-400 text-[11px]">
                  İddiayı çürütmek yerine iddiayı öne süren kişinin karakterine, yaşına veya geçmişine saldırma.
                </span>
              </div>

              <div className="p-2.5 bg-stone-950/80 rounded border border-stone-800">
                <span className="font-bold text-rose-300 block mb-0.5">Saman Adam (Korkuluk):</span>
                <span className="text-stone-400 text-[11px]">
                  Karşı tarafın argümanını abartıp karikatürize ederek savunulması imkansız bir iddiaya dönüştürüp çürütme.
                </span>
              </div>

              <div className="p-2.5 bg-stone-950/80 rounded border border-stone-800">
                <span className="font-bold text-rose-300 block mb-0.5">Yanlış İkilem (Siyah-Beyaz):</span>
                <span className="text-stone-400 text-[11px]">
                  Ortada pek çok seçenek varken durumu sadece iki zıt uçtan ibaretmiş gibi sunma.
                </span>
              </div>

              <div className="p-2.5 bg-stone-950/80 rounded border border-stone-800">
                <span className="font-bold text-rose-300 block mb-0.5">Döngüsel Akıl Yürütme:</span>
                <span className="text-stone-400 text-[11px]">
                  Sonucu kanıtlamak için sunulan öncülün bizzat sonucun kendisini varsayması.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
