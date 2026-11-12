import React, { useState, useEffect } from 'react';
import { X, Maximize, Play, Pause, RotateCcw, Users, ThumbsUp, ThumbsDown, Check, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { THOUGHT_EXPERIMENTS } from '../data/thoughtExperiments';

interface ClassroomPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClassroomPresentationModal: React.FC<ClassroomPresentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedExpIdx, setSelectedExpIdx] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(180); // 3 minutes
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [votesA, setVotesA] = useState<number>(14);
  const [votesB, setVotesB] = useState<number>(11);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const sharedUrl = 'https://ais-pre-odhfkaastbz2dzrsek53x6-445302990897.europe-west2.run.app';

  useEffect(() => {
    QRCode.toDataURL(sharedUrl, {
      width: 200,
      margin: 1.5,
      color: { dark: '#1c1917', light: '#fef3c7' },
    }).then(setQrDataUrl).catch(console.error);
  }, []);

  const exp = THOUGHT_EXPERIMENTS[selectedExpIdx];

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((sec) => sec - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  if (!isOpen) return null;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const totalVotes = votesA + votesB;
  const percentA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 50;
  const percentB = totalVotes > 0 ? 100 - percentA : 50;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur flex flex-col p-4 sm:p-8 text-stone-100 overflow-y-auto">
      {/* Top Presentation Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-stone-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-amber-500 text-stone-950 font-bold rounded text-xs">
            AKILLI TAHTA MODU
          </span>
          <span className="text-stone-400 text-xs hidden sm:inline">
            Projeksiyon & Sınıf İçi Büyük Ekran Tartışması
          </span>
        </div>

        {/* Experiment Selector */}
        <div className="flex items-center gap-2">
          {THOUGHT_EXPERIMENTS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedExpIdx(idx);
                setVotesA(12);
                setVotesB(10);
                setTimerSeconds(180);
                setTimerActive(false);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedExpIdx === idx
                  ? 'bg-stone-100 text-stone-900'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200'
              }`}
            >
              {item.title.split('&')[0]}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowQR(!showQR)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              showQR
                ? 'bg-amber-400 text-stone-950 border-amber-400'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
            }`}
            title="Sınıfla Paylaşım QR Kodu & Bağlantı"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">QR Kod & Link</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating QR Card */}
          {showQR && (
            <div className="absolute right-0 top-12 z-50 bg-stone-900 border border-stone-700 p-4 rounded-xl shadow-2xl flex flex-col items-center gap-3 w-64 text-center">
              <span className="text-xs font-bold text-amber-300">Öğrenciler İçin Hızlı QR</span>
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Sınıf QR"
                  className="w-40 h-40 rounded-lg border border-amber-400/30"
                />
              )}
              <p className="text-[11px] text-stone-400 leading-tight">
                Öğrenciler telefonlarından kamerayla okutarak anında soru ve deneylere erişebilir.
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sharedUrl);
                  alert('Bağlantı kopyalandı!');
                }}
                className="w-full py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded font-medium cursor-pointer"
              >
                Linki Kopyala
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Focus Area */}
      <div className="max-w-5xl mx-auto w-full my-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded border border-amber-500/30">
              TYMM {exp.tymmCode}
            </span>
            <span className="text-stone-400">· {exp.field} · {exp.philosophers.join(' · ')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            {exp.title}
          </h1>
          <p className="text-base sm:text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
            "{exp.summary}"
          </p>
        </div>

        {/* Discussion Question Callout Banner */}
        <div className="p-6 bg-stone-900/90 rounded-2xl border border-amber-500/40 text-center space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            Sınıfa Yöneltilen Soruşturma Sorusu:
          </span>
          <p className="text-lg sm:text-2xl font-serif italic text-amber-100">
            "{exp.discussionQuestions[0]}"
          </p>
        </div>

        {/* Classroom Live Vote & Timer Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Live Hand-Raise Voting Widget */}
          <div className="p-6 bg-stone-900 rounded-2xl border border-stone-800 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" /> Sınıf Oylaması
              </span>
              <span className="text-stone-400">Toplam {totalVotes} Öğrenci</span>
            </div>

            {/* Voting Bar */}
            <div className="h-6 w-full bg-stone-800 rounded-xl overflow-hidden flex text-xs font-bold font-mono">
              <div
                className="bg-amber-600 flex items-center justify-center text-white transition-all duration-300"
                style={{ width: `${percentA}%` }}
              >
                %{percentA}
              </div>
              <div
                className="bg-stone-700 flex items-center justify-center text-stone-200 transition-all duration-300"
                style={{ width: `${percentB}%` }}
              >
                %{percentB}
              </div>
            </div>

            {/* Quick Count Adders for Teacher */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setVotesA((v) => v + 1)}
                className="p-3 bg-stone-950 hover:bg-stone-800 rounded-xl border border-stone-700 text-left transition-colors cursor-pointer"
              >
                <span className="text-xs text-amber-400 font-bold block mb-0.5">
                  1. Seçenek (Faydacı / Eylem):
                </span>
                <span className="text-lg font-bold font-mono text-white">+{votesA} Oy</span>
              </button>

              <button
                onClick={() => setVotesB((v) => v + 1)}
                className="p-3 bg-stone-950 hover:bg-stone-800 rounded-xl border border-stone-700 text-left transition-colors cursor-pointer"
              >
                <span className="text-xs text-stone-400 font-bold block mb-0.5">
                  2. Seçenek (Kantçı / İlke):
                </span>
                <span className="text-lg font-bold font-mono text-white">+{votesB} Oy</span>
              </button>
            </div>
          </div>

          {/* Group Discussion Countdown Timer */}
          <div className="p-6 bg-stone-900 rounded-2xl border border-stone-800 text-center space-y-4">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block">
              Grup Tartışması & Karar Sayacı
            </span>

            <div className="text-5xl font-mono font-bold text-amber-400">
              {formatTimer(timerSeconds)}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setTimerActive(!timerActive)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {timerActive ? 'Durdur' : 'Süreyi Başlat'}
              </button>

              <button
                onClick={() => {
                  setTimerActive(false);
                  setTimerSeconds(180);
                }}
                className="p-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-300 transition-colors cursor-pointer"
                title="Sıfırla"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
