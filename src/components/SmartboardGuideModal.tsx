import React, { useState, useEffect } from 'react';
import { X, Copy, Check, QrCode, Monitor, Share2, Download, ExternalLink, HelpCircle, ShieldCheck } from 'lucide-react';
import QRCode from 'qrcode';

interface SmartboardGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenClassroomMode: () => void;
}

export const SmartboardGuideModal: React.FC<SmartboardGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenClassroomMode,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // The permanent shared URL for school and classroom presentation
  const sharedUrl = 'https://ais-pre-odhfkaastbz2dzrsek53x6-445302990897.europe-west2.run.app';
  const currentUrl = typeof window !== 'undefined' ? (window.location.origin.includes('localhost') ? sharedUrl : window.location.origin) : sharedUrl;

  useEffect(() => {
    QRCode.toDataURL(currentUrl, {
      width: 240,
      margin: 1.5,
      color: {
        dark: '#1c1917',
        light: '#fef3c7',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [currentUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-stone-100 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                Akıllı Tahtada Açma ve Paylaşım Rehberi
              </h2>
              <p className="text-xs text-stone-400">
                MEB Etkileşimli Tahta (Pardus / Windows) ve Sınıf İçi Erişim
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live URL & QR Code Box */}
        <div className="p-5 bg-stone-950 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-center gap-6">
          {/* QR Code Container */}
          <div className="shrink-0 flex flex-col items-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="FOPOS Akıllı Tahta QR Kodu"
                className="w-36 h-36 rounded-lg shadow-md border-2 border-amber-400/40"
              />
            ) : (
              <div className="w-36 h-36 bg-stone-800 rounded-lg flex items-center justify-center text-stone-500">
                <QrCode className="w-10 h-10" />
              </div>
            )}
            <span className="text-[11px] text-amber-300/80 font-mono mt-2 flex items-center gap-1">
              <Share2 className="w-3 h-3" /> Telefon / Tahta İle Tara
            </span>
          </div>

          {/* URL & Copy Actions */}
          <div className="flex-1 w-full space-y-3">
            <div>
              <label className="text-xs font-semibold text-stone-400 block mb-1">
                Akıllı Tahta Doğrudan Erişim Bağlantısı (Herkese Açık & Şifresiz)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs font-mono text-amber-200 select-all focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Kopyalandı!' : 'Kopyala'}
                </button>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Bu bağlantı MEB Fatih internet ağı dahil tüm cihazlarda ve tarayıcılarda doğrudan açılır. Herhangi bir Google hesabı veya şifre gerektirmez.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenClassroomMode();
                }}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                Şimdi Akıllı Tahta Modunu Başlat
              </button>
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-lg flex items-center gap-1.5 hover:text-white"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Yeni Sekmede Aç
              </a>
            </div>
          </div>
        </div>

        {/* 4 Practical Steps for School */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Okulda ve Akıllı Tahtada Adım Adım Nasıl Kullanılır?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-200">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[11px]">1</span>
                Tahtadaki Tarayıcıyı Açın
              </div>
              <p className="text-stone-400 leading-relaxed">
                Pardus veya Windows akıllı tahtanızdaki Chrome/Firefox tarayıcısına yukarıdaki bağlantıyı yazın ve Yer İmlerine (Yıldız tuşu) ekleyin.
              </p>
            </div>

            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-200">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[11px]">2</span>
                F11 ile Tam Ekran Yapın
              </div>
              <p className="text-stone-400 leading-relaxed">
                Klavyeden <strong>F11</strong> tuşuna basarak veya sağ üstteki <strong>"Akıllı Tahta Modu"</strong> butonuna dokunarak sınıf odaklı sunum görünümüne geçin.
              </p>
            </div>

            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-200">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[11px]">3</span>
                Masaüstü Kısayolu Ekleyin
              </div>
              <p className="text-stone-400 leading-relaxed">
                Chrome menüsünden <em>"Kaydet ve Paylaş &gt; Kısayol Oluştur"</em> seçeneğini işaretleyerek tahtanın masaüstüne bir FOPOS ikonu yerleştirebilirsiniz.
              </p>
            </div>

            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-200">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px]">4</span>
                MEB Fatih Ağı ve Güvenlik
              </div>
              <p className="text-stone-400 leading-relaxed">
                Uygulama standart HTTPS güvenlik sertifikalarına sahiptir; MEB güvenlik filtrelerine takılmaz, USB virüsü riski taşımaz.
              </p>
            </div>
          </div>
        </div>

        {/* Where is it stored? */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Uygulama Nerede Saklanıyor?
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            • <strong>Canlı Barındırma:</strong> Google Cloud Run yüksek erişilebilir sunucularında 7/24 aktif olarak çalışmaktadır.<br />
            • <strong>Kaynak Kodlar:</strong> Modern React 19 + Express + Tailwind v4 yapısında hazırlanmıştır. Dilediğiniz zaman GitHub reponuza (<code>aytigin-netizen/FOPOS</code>) aktarabilir veya kendi okul sunucunuzda da barındırabilirsiniz.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-lg text-xs cursor-pointer transition-colors"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
