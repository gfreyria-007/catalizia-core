export enum Persona {
  SAM = 'SAM',
  JUDAH = 'JUDAH',
  SYSTEM = 'SYSTEM'
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'High' | 'Extreme' | 'Critical';
  focus: string;
}

export interface Message {
  id: string;
  sender: Persona | 'CANDIDATE';
  text: string;
  timestamp: number;
  score?: number;
  reasoning?: string;
  personaName?: string;
}

export interface StudyModule {
  id: string;
  title: string;
  concept: string;
  acronyms: Record<string, string>;
  deepDive: {
    header: string;
    content: string;
  }[];
  caseStudy: {
    title: string;
    scenario: string;
    solution: string;
    roi: string;
  };
  comparison: {
    label: string;
    items: { name: string, description: string, pro: string, con: string }[];
  }[];
  executiveTakeaway: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
  category: 'AI/ML' | 'QA/EVALS' | 'INFRA/TI' | 'EXEC/BIZ';
}

export interface GauntletState {
  currentScore: number;
  stressLevel: number;
  messages: Message[];
  isThinking: boolean;
  precisionLevel: number;
  currentScenario: Scenario | null;
  passedScenarios: string[];
  viewMode: 'Lobby' | 'Study' | 'Interview' | 'Victory';
}
