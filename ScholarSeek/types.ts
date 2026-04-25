export interface LocalizedText {
  es: string;
  en: string;
}

export interface StrategicAnswer {
  category: LocalizedText;
  question: LocalizedText;
  answer: LocalizedText;
}

export interface Paper {
  rank: number;
  relevanceScore: number; // 0-100%
  keyAreas: string[]; // List from: Nexus, Water, Energy, etc.
  keywordsFound: string[]; // User keywords identified in the paper
  title: string;
  authors: string;
  year: number;
  journal: string; // "Source" mapped to Journal
  url: string;     // DOI or Link
  apaCitation: string; // Explicit APA format citation
  mainIdea: LocalizedText; // Bilingual
  pillarAlignment: LocalizedText; // Alignment with general Ph.D. research pillars
  contextRelevance: LocalizedText; // Relevance specifically against user's Advanced Context input
  strategicQuotes: LocalizedText; // New: Quotes for relatability and 2024+ policy alignment
  researchApproach: LocalizedText; // Research methodology/approach
  isUploadedFile?: boolean; // Flag to identify papers from attachments
  isManualEntry?: boolean; // Flag to identify papers pasted manually as text
  verificationStatus: 'verified_source' | 'verified_search' | 'unverified'; // Status of the URL
}

export interface StrategicAnalysis {
  designThinking: LocalizedText;    // Q1: Design Thinking Impact
  collaborativeValue: LocalizedText; // Q2: Collaborative Design Value
  qualitativeData: LocalizedText;    // Q3: Qualitative Data Translation
  academicRole: LocalizedText;       // Q4: Academic Mediation Role
  nexusEfficiency: LocalizedText;    // Q5: Nexus Cost-Effectiveness
  coBenefits: LocalizedText;         // Q6: Economic/Social/Env Co-benefits
}

export interface InvestigationOpportunity {
  rank: number;
  title: LocalizedText; // Tentative Paper Title
  theGap: LocalizedText; // "La Brecha Científica"
  theNovelty: LocalizedText; // "La Contribución PhD"
  highValueContext: LocalizedText; // "Contexto de Aplicación"
  basedOnTitles: string[]; // List of paper titles
  strategicAnalysis: StrategicAnalysis; // New field for per-opportunity strategic answers
  userContextAnalysis?: LocalizedText; // Analysis based on specific user context
}

export interface ProposedTitle {
  title: LocalizedText;
  rationale: LocalizedText;
}

export interface LiteratureReviewResponse {
  papers: Paper[];
  opportunities: InvestigationOpportunity[];
  proposedTitles: ProposedTitle[]; // New: Alternative titles for the main research project
}

export enum SearchStatus {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface SearchState {
  status: SearchStatus;
  data: LiteratureReviewResponse;
  error?: string;
}

export type Language = 'es' | 'en';

export type SearchMode = 'deep' | 'fast';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
  personalApiKey?: string;
}

export interface UserState {
  user: AuthUser | null;
  isLoading: boolean;
}
