export type TabType = 'experiments' | 'socratic' | 'argument' | 'curriculum' | 'arena' | 'rubric';

export interface ThoughtExperiment {
  id: string;
  title: string;
  subtitle: string;
  field: 'Etik & Ahlak' | 'Ontoloji (Varlık)' | 'Epistemoloji (Bilgi)' | 'Siyaset Felsefesi' | 'Teknoloji Felsefesi' | 'Çevre Etiği';
  image: string;
  philosophers: string[];
  summary: string;
  context: string;
  interactiveType: 'trolley' | 'theseus' | 'cave' | 'veil' | 'chinese_room' | 'eco_dilemma';
  discussionQuestions: string[];
  mebUnit: string;
  tymmCode: string;
}

export interface SocraticMessage {
  id: string;
  sender: 'user' | 'philosopher';
  text: string;
  timestamp: string;
  fallacyNote?: string;
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

