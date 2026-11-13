import { useEffect, useState } from 'react';

export interface LiveVotingOption {
  id: string;
  label: string;
}

export interface LiveRound {
  id: string;
  question: string;
  options: LiveVotingOption[];
  status: 'open' | 'closed';
  counts: Record<string, number>;
}

export interface LiveSessionSnapshot {
  code: string;
  status: 'lobby' | 'voting' | 'paused' | 'closed';
  experimentId: string;
  currentRound: LiveRound | null;
  participantCount: number;
  expiresAt: string;
}

export type StreamConnection = 'idle' | 'connecting' | 'live' | 'reconnecting' | 'ended';

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => { clearTimeout(timer); resolve(); }, { once: true });
  });

/**
 * Öğretmen canlı sonuç akışı. EventSource özel başlık gönderemediği için (öğretmen
 * token'ı URL'ye konmamalı) fetch + ReadableStream ile SSE okunur; kopma halinde
 * artan beklemeyle yeniden bağlanır ve sunucu her bağlantıda tam durumu yeniden yollar.
 */
export function useClassroomStream(code?: string, teacherToken?: string) {
  const [session, setSession] = useState<LiveSessionSnapshot | null>(null);
  const [connection, setConnection] = useState<StreamConnection>('idle');

  useEffect(() => {
    if (!code || !teacherToken) {
      setSession(null);
      setConnection('idle');
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const handleFrame = (frame: string): 'closed' | void => {
      let event = 'message';
      const dataLines: string[] = [];
      for (const line of frame.split('\n')) {
        if (line.startsWith(':')) continue;
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart());
      }
      if (event === 'closed') return 'closed';
      if (event === 'snapshot' && dataLines.length > 0) {
        try {
          setSession(JSON.parse(dataLines.join('\n')) as LiveSessionSnapshot);
        } catch (error) {
          console.error('Canlı akış verisi okunamadı:', error);
        }
      }
    };

    const run = async () => {
      let attempt = 0;
      while (!signal.aborted) {
        setConnection(attempt === 0 ? 'connecting' : 'reconnecting');
        try {
          const response = await fetch(`/api/classroom/sessions/${encodeURIComponent(code)}/events`, {
            headers: { Authorization: `Bearer ${teacherToken}`, Accept: 'text/event-stream' },
            signal,
          });
          if ([401, 404, 410].includes(response.status)) {
            setConnection('ended');
            return;
          }
          if (!response.ok || !response.body) throw new Error(`SSE ${response.status}`);

          attempt = 0;
          setConnection('live');
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
            let boundary = buffer.indexOf('\n\n');
            while (boundary !== -1) {
              const frame = buffer.slice(0, boundary);
              buffer = buffer.slice(boundary + 2);
              if (handleFrame(frame) === 'closed') {
                setConnection('ended');
                return;
              }
              boundary = buffer.indexOf('\n\n');
            }
          }
        } catch (error) {
          if (signal.aborted) return;
        }
        attempt += 1;
        await wait(Math.min(1000 * 2 ** Math.min(attempt, 4), 10000), signal);
      }
    };

    run();
    return () => controller.abort();
  }, [code, teacherToken]);

  return { session, connection };
}
