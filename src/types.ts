export type SkillType =
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'conversation'
  | 'writing'
  | 'spoken_oral'
  | 'grammar'
  | 'simple_sentence'
  | 'essential_verbs';

export type CardColorTheme =
  | 'emerald'
  | 'sky'
  | 'amber'
  | 'indigo'
  | 'purple'
  | 'rose'
  | 'teal'
  | 'orange';

export type CardIconName =
  | 'BookOpen'
  | 'Headphones'
  | 'Mic'
  | 'MessageSquare'
  | 'Sparkles'
  | 'Trophy'
  | 'PenTool'
  | 'Globe'
  | 'Zap';

export interface LearningCard {
  id: string;
  skillType: SkillType;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  iconName: CardIconName;
  colorTheme: CardColorTheme;
}

export interface SubCardExample {
  english: string;
  sinhala?: string;
}

export interface SimpleSentenceItem {
  id: string;
  cardId?: string; // which Sentence Pack Card it belongs to (e.g. "simple-sentences-1")
  number?: number; // 1 to 800+
  english: string;
  sinhala: string;
  category?: string;
  createdAt: number;
}

export interface SentencePackCard {
  id: string; // e.g. "simple-sentences-1", "simple-sentences-2"
  title: string; // e.g. "Simple Sentences 1"
  subtitle?: string; // e.g. "Daily Routine & Basics"
  description?: string; // e.g. "Master everyday English simple sentences..."
  tag?: string; // e.g. "Simple Sentences 1"
  iconName?: CardIconName;
  colorTheme?: CardColorTheme;
  createdAt?: number;
}

export interface SentenceCategoryMeta {
  id: string;
  name: string;
  sinhalaName?: string;
  description?: string;
  iconName?: string;
  colorTheme?: string;
}

export interface VerbPackCard {
  id: string; // e.g. "essential-verbs-1", "essential-verbs-2"
  title: string; // e.g. "Essential Verbs 1"
  subtitle?: string; // e.g. "Daily Action Verbs & Forms"
  description?: string; // e.g. "Master vital daily action verbs..."
  tag?: string; // e.g. "Essential Verbs 1 (250 Verbs)"
  iconName?: CardIconName;
  colorTheme?: CardColorTheme;
  createdAt?: number;
}

export interface EssentialVerbItem {
  id: string;
  cardId?: string; // which Verb Pack Card it belongs to (e.g. "essential-verbs-1")
  number?: number; // 1 to 250+
  sinhalaMeaning: string; // e.g. "පිළිගන්නවා"
  verb: string; // Base Form (V1 Present) e.g., "accept"
  pastSimple: string; // Past Simple (V2 Past) e.g., "accepted"
  pastParticiple: string; // Past Participle (V3) e.g., "accepted"
  sOrEsForm?: string; // V4 (s/es) e.g., "accepts"
  ingForm?: string; // V5 (-ing) e.g., "accepting"
  category?: string; // e.g. "Action Verbs"
  exampleSentence?: string;
  exampleSinhala?: string;
  isIrregular?: boolean;
  createdAt?: number;
}

export interface PracticeSubCard {
  id: string;
  hub: 'writing' | 'spoken_oral' | 'grammar' | 'simple_sentence' | 'essential_verbs';
  category: string;
  number: number;
  title: string;
  subtitle: string;
  englishContent: string;
  sinhalaContent?: string;
  examples: SubCardExample[];
  notes?: string;
  iconName?: CardIconName;
}

export interface GrammarSubCard {
  id: string;
  category: 'do' | 'have' | 'be';
  number: number;
  title: string;
  subtitle: string;
  englishContent: string;
  sinhalaContent?: string;
  examples: string[];
  notes?: string;
}

export interface SkillCardData {
  id: SkillType;
  title: string;
  tagline: string;
  description: string;
  color: string;
  accentBg: string;
  borderColor: string;
  textColor: string;
  badge: string;
  stats: {
    label: string;
    value: string;
  }[];
  features: string[];
}

export interface ReadingLesson {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  content: string;
  vocabulary: {
    word: string;
    phonetic: string;
    meaning: string;
    example: string;
  }[];
  questions: {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface ListeningExercise {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  speaker: string;
  topic: string;
  transcript: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
  dictationSentence: string;
}

export interface SpeakingDrill {
  id: string;
  title: string;
  category: 'Tongue Twister' | 'Daily Phrases' | 'Pronunciation' | 'Workplace';
  targetSentence: string;
  phoneticGuide: string;
  tip: string;
  keyWords: string[];
  audioSpeed?: number;
}

export interface ConversationTurn {
  id: number;
  speaker: 'AI' | 'User';
  name: string;
  text: string;
  audioPrompt?: string;
}

export interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  partnerName: string;
  partnerRole: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  turns: {
    aiPrompt: string;
    suggestedResponses: {
      text: string;
      formality: 'Formal' | 'Casual' | 'Friendly';
    }[];
  }[];
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'grammar' | 'vocabulary' | 'idioms' | 'cheat-sheets';
  level: 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  content: string[];
  tags: string[];
  downloadable?: boolean;
}

export interface Flashcard {
  id: string;
  word: string;
  partOfSpeech: string;
  phonetic: string;
  definition: string;
  example: string;
  category: string;
}

export interface IdiomItem {
  id: string;
  idiom: string;
  meaning: string;
  example: string;
  origin?: string;
}

export type UserAccountStatus = 'pending' | 'approved' | 'suspended';
export type UserRole = 'student' | 'admin' | 'instructor';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  nic: string;
  phoneNumber: string;
  email: string;
  password?: string;
  rememberMe?: boolean;
  registeredAt?: number;
  status: UserAccountStatus;
  role: UserRole;
  approvedAt?: number;
  approvedBy?: string;
  adminNotes?: string;
  lastLoginAt?: number;
  avatarUrl?: string;
  xp?: number;
  level?: number;
  completedCardsCount?: number;
  completedCardIds?: string[];
  lastXpAwardedAt?: number;
}

export interface AdminSettings {
  requireApproval: boolean;
  allowPublicRegistration: boolean;
  requireNicValidation: boolean;
  pendingUserNotice: string;
  announcementText: string;
  showAnnouncement: boolean;
  autoApproveStaff: boolean;
}

export type SideMediaType = 'video' | 'website' | 'news' | 'ad';

export interface SideMediaItem {
  id: string;
  type: SideMediaType;
  title: string;
  subtitle?: string;
  description: string;
  url: string;
  imageUrl?: string;
  badgeText?: string;
  isActive: boolean;
  createdAt: number;
  order: number;
}
