export type TabType = 'experiments' | 'socratic' | 'argument' | 'curriculum' | 'arena' | 'rubric';

export interface ThoughtExperimentChoice {
  label: string;
  perspectiveTitle: string;
  philosophicalAnalysis: string;
}

export interface IllustrationShape {
  kind: 'circle' | 'rect' | 'line' | 'polygon' | 'path';
  x?: number;
  y?: number;
  x2?: number;
  y2?: number;
  r?: number;
  width?: number;
  height?: number;
  points?: string;
  d?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

export interface IllustrationAnnotation {
  x: number;
  y: number;
  text: string;
  align?: 'start' | 'middle' | 'end';
  tone?: 'light' | 'amber' | 'muted';
}

export interface ConceptualIllustration {
  metaphorTitle: string;
  visualCaption: string;
  mood: 'dark' | 'warm' | 'slate';
  shapes: IllustrationShape[];
  annotations: IllustrationAnnotation[];
  source: ApiSource;
  fallbackReason?: FallbackReason | null;
  generatedAt: string;
}

export type ApiSource = 'gemini' | 'fallback';
export type FallbackReason = 'no_api_key' | 'timeout' | 'api_error';

export interface ThoughtExperiment {
  id: string;
  title: string;
  subtitle: string;
  field: 'Etik & Ahlak' | 'Ontoloji (Varlık)' | 'Epistemoloji (Bilgi)' | 'Siyaset Felsefesi' | 'Teknoloji Felsefesi' | 'Çevre Etiği';
  image: string;
  philosophers: string[];
  summary: string;
  context: string;
  interactiveType: 'trolley' | 'theseus' | 'cave' | 'veil' | 'chinese_room' | 'eco_dilemma' | 'custom_dilemma';
  discussionQuestions: string[];
  mebUnit: string;
  tymmCode: string;
  dilemmaChoices?: ThoughtExperimentChoice[];
  isCustom?: boolean;
  createdAt?: string;
  theme?: string;
  source?: ApiSource;
  fallbackReason?: FallbackReason | null;
}

export interface SocraticMessage {
  id: string;
  sender: 'user' | 'philosopher';
  text: string;
  timestamp: string;
  fallacyNote?: string;
  source?: ApiSource;
  fallbackReason?: FallbackReason;
}

export interface ArgumentNode {
  id: string;
  type: 'claim' | 'premise' | 'counter' | 'rebuttal';
  text: string;
  valid?: boolean;
}

export interface CurriculumTopic {
  id: string;
  grade: '10. Sınıf' | '11. Sınıf';
  unitNumber: number;
  unit: string;
  title: string;
  code: string;
  hours: number;
  percentage: number;
  fieldSkills: string; // SBAB13, SBAB14, SBAB15
  conceptualSkills?: string;
  tendencies: string[]; // E1.1, E3.8 vb.
  values: string[]; // D1, D3 vb.
  literacies: string[]; // OB1, OB2 vb.
  keyPhilosophers: string[];
  keyConcepts: string[];
  outcomes: string[];
  processComponents: string[];
  p4cQuestion: string;
  activityIdea: string;
  enrichment: string;
  support: string;
}

export interface ConceptCard {
  id: string;
  term: string;
  definition: string;
  philosopherOrSchool: string;
  branch: string;
}

export interface LessonPlanStage {
  phase: string;
  activity: string;
  role: string;
}

export interface GeneratedLessonPlan {
  title: string;
  learningOutcomes: string[];
  stimulusMaterial: string;
  inquiryQuestions: string[];
  stages: LessonPlanStage[];
  commonFallaciesToWatch: string[];
  reflectionPrompt: string;
}

export interface SavedLessonPlan {
  id: string;
  savedAt: string;
  topicId: string;
  grade: '10. Sınıf' | '11. Sınıf';
  unit: string;
  topicTitle: string;
  code: string;
  fieldSkills: string;
  source: ApiSource;
  fallbackReason?: FallbackReason | null;
  plan: GeneratedLessonPlan;
}

