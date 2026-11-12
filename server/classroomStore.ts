import { createHash, randomBytes } from 'node:crypto';

export type ClassroomSessionStatus = 'lobby' | 'voting' | 'paused' | 'closed';

export interface VotingOption {
  id: string;
  label: string;
}

export interface ClassroomRound {
  id: string;
  question: string;
  options: VotingOption[];
  status: 'open' | 'closed';
  counts: Record<string, number>;
  voterTokens: Set<string>;
  createdAt: string;
}

export interface ClassroomSession {
  id: string;
  code: string;
  teacherTokenHash: string;
  participantTokenHashes: Set<string>;
  status: ClassroomSessionStatus;
  experimentId: string;
  currentRoundId: string | null;
  rounds: Map<string, ClassroomRound>;
  createdAt: string;
  expiresAt: number;
}

export interface PublicRound {
  id: string;
  question: string;
  options: VotingOption[];
  status: 'open' | 'closed';
  counts: Record<string, number>;
  createdAt: string;
}

export interface PublicSession {
  code: string;
  status: ClassroomSessionStatus;
  experimentId: string;
  currentRound: PublicRound | null;
  participantCount: number;
  expiresAt: string;
}

export class ClassroomStoreError extends Error {
  constructor(public readonly code: string, message: string, public readonly statusCode = 400) {
    super(message);
    this.name = 'ClassroomStoreError';
  }
}

const SESSION_TTL_MS = 90 * 60 * 1000;
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

const createCode = () => {
  const bytes = randomBytes(6);
  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join('');
};

const createToken = (prefix: string) => `${prefix}_${randomBytes(24).toString('base64url')}`;

const toPublicRound = (round: ClassroomRound | undefined): PublicRound | null => {
  if (!round) return null;
  return {
    id: round.id,
    question: round.question,
    options: round.options,
    status: round.status,
    counts: { ...round.counts },
    createdAt: round.createdAt,
  };
};

export class MemoryClassroomSessionStore {
  private readonly sessions = new Map<string, ClassroomSession>();

  createSession(input: { experimentId: string; question: string; options: VotingOption[] }) {
    this.cleanupExpired();

    let code = createCode();
    while (this.sessions.has(code)) code = createCode();

    const now = Date.now();
    const teacherToken = createToken('teacher');
    const round = this.createRoundRecord(input.question, input.options);
    const session: ClassroomSession = {
      id: randomBytes(12).toString('hex'),
      code,
      teacherTokenHash: hashToken(teacherToken),
      participantTokenHashes: new Set(),
      status: 'voting',
      experimentId: input.experimentId,
      currentRoundId: round.id,
      rounds: new Map([[round.id, round]]),
      createdAt: new Date(now).toISOString(),
      expiresAt: now + SESSION_TTL_MS,
    };

    this.sessions.set(code, session);
    return { session: this.toPublicSession(session), teacherToken };
  }

  getSession(code: string) {
    this.cleanupExpired();
    const session = this.sessions.get(this.normalizeCode(code));
    if (!session) {
      throw new ClassroomStoreError('SESSION_NOT_FOUND', 'Sınıf oturumu bulunamadı.', 404);
    }
    return session;
  }

  getPublicSession(code: string) {
    return this.toStudentSession(this.getSession(code));
  }

  joinSession(code: string) {
    const session = this.getSession(code);
    if (session.status === 'closed') {
      throw new ClassroomStoreError('SESSION_CLOSED', 'Bu sınıf oturumu sona ermiş.', 410);
    }

    const participantToken = createToken('student');
    session.participantTokenHashes.add(hashToken(participantToken));
    return { session: this.toStudentSession(session), participantToken };
  }

  castVote(input: { code: string; participantToken: string; roundId: string; optionId: string }) {
    const session = this.getSession(input.code);
    if (session.status === 'closed') {
      throw new ClassroomStoreError('SESSION_CLOSED', 'Bu sınıf oturumu sona ermiş.', 410);
    }
    if (!session.participantTokenHashes.has(hashToken(input.participantToken))) {
      throw new ClassroomStoreError('INVALID_PARTICIPANT_TOKEN', 'Katılım anahtarı geçersiz.', 401);
    }

    const round = session.rounds.get(input.roundId);
    if (!round) {
      throw new ClassroomStoreError('ROUND_NOT_FOUND', 'Oylama turu bulunamadı.', 404);
    }
    if (round.status !== 'open') {
      throw new ClassroomStoreError('ROUND_CLOSED', 'Bu oylama turu kapalı.', 409);
    }
    if (!round.options.some((option) => option.id === input.optionId)) {
      throw new ClassroomStoreError('INVALID_OPTION', 'Geçersiz oylama seçeneği.');
    }

    const voterHash = hashToken(input.participantToken);
    if (round.voterTokens.has(voterHash)) {
      throw new ClassroomStoreError('ROUND_ALREADY_VOTED', 'Bu tur için oyunuz daha önce kaydedildi.', 409);
    }

    round.voterTokens.add(voterHash);
    round.counts[input.optionId] += 1;
    return { round: { ...toPublicRound(round)!, counts: {} }, session: this.toStudentSession(session) };
  }

  private createRoundRecord(question: string, options: VotingOption[]): ClassroomRound {
    const normalizedOptions = options.map((option) => ({ id: option.id, label: option.label }));
    return {
      id: randomBytes(10).toString('hex'),
      question,
      options: normalizedOptions,
      status: 'open',
      counts: Object.fromEntries(normalizedOptions.map((option) => [option.id, 0])),
      voterTokens: new Set(),
      createdAt: new Date().toISOString(),
    };
  }

  private toPublicSession(session: ClassroomSession): PublicSession {
    const round = session.currentRoundId ? session.rounds.get(session.currentRoundId) : undefined;
    return {
      code: session.code,
      status: session.status,
      experimentId: session.experimentId,
      currentRound: toPublicRound(round),
      participantCount: session.participantTokenHashes.size,
      expiresAt: new Date(session.expiresAt).toISOString(),
    };
  }

  private toStudentSession(session: ClassroomSession): PublicSession {
    const publicSession = this.toPublicSession(session);
    return {
      ...publicSession,
      currentRound: publicSession.currentRound
        ? { ...publicSession.currentRound, counts: {} }
        : null,
    };
  }

  private normalizeCode(code: string) {
    return code.trim().toUpperCase();
  }

  private cleanupExpired() {
    const now = Date.now();
    for (const [code, session] of this.sessions) {
      if (session.expiresAt <= now) this.sessions.delete(code);
    }
  }
}
