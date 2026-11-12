import React, { useEffect, useState } from 'react';
import { CheckCircle2, LoaderCircle, ShieldCheck, Vote } from 'lucide-react';

interface VotingOption {
  id: string;
  label: string;
}

interface PublicRound {
  id: string;
  question: string;
  options: VotingOption[];
  status: 'open' | 'closed';
  counts: Record<string, number>;
}

interface PublicSession {
  code: string;
  status: 'lobby' | 'voting' | 'paused' | 'closed';
  experimentId: string;
  currentRound: PublicRound | null;
  participantCount: number;
  expiresAt: string;
}

const participantStorageKey = (code: string) => `fopos.classroom.participant.${code}`;

export const StudentJoinView: React.FC<{ sessionCode: string }> = ({ sessionCode }) => {
  const code = sessionCode.trim().toUpperCase();
  const [session, setSession] = useState<PublicSession | null>(null);
  const [participantToken, setParticipantToken] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Oturum kontrol ediliyor...');

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch(`/api/classroom/join/${encodeURIComponent(code)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Oturum bulunamadı.');

        const storedToken = window.sessionStorage.getItem(participantStorageKey(code));
        let token = storedToken || '';
        if (!token) {
          const joinResponse = await fetch(`/api/classroom/sessions/${encodeURIComponent(code)}/participants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
          const joinData = await joinResponse.json();
          if (!joinResponse.ok) throw new Error(joinData.error?.message || 'Oturuma katılamadınız.');
          token = joinData.participantToken;
          window.sessionStorage.setItem(participantStorageKey(code), token);
          setSession(joinData.session);
        } else {
          setSession(data.session);
        }
        setParticipantToken(token);
        setStatus('ready');
        setMessage('Oylama için hazır.');
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Oturum yüklenemedi.');
      }
    };

    if (code) loadSession();
    else {
      setStatus('error');
      setMessage('Geçerli bir oturum kodu bulunamadı.');
    }
  }, [code]);

  const round = session?.currentRound;

  const handleVote = async () => {
    if (!round || !selectedOption || !participantToken || hasVoted) return;
    setStatus('loading');
    setMessage('Oyunuz gönderiliyor...');
    try {
      const response = await fetch(`/api/classroom/sessions/${encodeURIComponent(code)}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantToken, roundId: round.id, optionId: selectedOption }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Oy gönderilemedi.');
      setSession(data.session);
      setHasVoted(true);
      setStatus('success');
      setMessage('Oyunuz anonim olarak kaydedildi.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Oy gönderilemedi.');
    }
  };

  return (
    <main className="min-h-screen bg-stone-950 px-4 py-8 text-stone-100 sm:flex sm:items-center sm:justify-center">
      <section className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-2xl sm:p-8">
        <header className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/15 text-amber-300">
            <Vote className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">FOPOS Sınıf Katılımı</p>
          <h1 className="font-display text-2xl font-bold text-white">Oturum {code}</h1>
          <p className="text-sm text-stone-400">İsminiz ve kişisel bilgileriniz istenmez.</p>
        </header>

        {status === 'loading' && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-stone-800 bg-stone-950 p-5 text-sm text-stone-300">
            <LoaderCircle className="h-4 w-4 animate-spin text-amber-400" />
            {message}
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-center text-sm text-rose-200">{message}</div>
        )}

        {session && round && !hasVoted && status !== 'loading' && (
          <div className="space-y-5">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="text-base font-semibold leading-relaxed text-amber-50">{round.question}</p>
            </div>
            <div className="space-y-3">
              {round.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full rounded-xl border p-4 text-left text-sm font-semibold transition-colors ${
                    selectedOption === option.id
                      ? 'border-amber-400 bg-amber-400 text-stone-950'
                      : 'border-stone-700 bg-stone-950 text-stone-200 hover:border-amber-400/60'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleVote}
              disabled={!selectedOption}
              className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-stone-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Oyumu Gönder
            </button>
          </div>
        )}

        {session && hasVoted && (
          <div className="space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-5 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
            <p className="font-semibold text-emerald-100">{message}</p>
            <p className="text-xs text-emerald-200/70">Sonuçları öğretmeniniz tahtada paylaşacaktır.</p>
          </div>
        )}

        {session && !round && status !== 'error' && (
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-5 text-center text-sm text-stone-300">Öğretmen henüz bir oylama turu başlatmadı.</div>
        )}

        <footer className="flex items-center justify-center gap-2 border-t border-stone-800 pt-4 text-[11px] text-stone-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Anonim katılım · Tek oy · Oturum süresi sınırlı
        </footer>
      </section>
    </main>
  );
};
