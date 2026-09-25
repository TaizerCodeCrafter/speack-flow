import { SimpleSentenceItem, SentenceCategoryMeta } from '../types';

export const SIMPLE_SENTENCES_STORAGE_KEY = 'taizerflow_simple_sentences_v1';
export const SIMPLE_SENTENCES_CATEGORIES_KEY = 'taizerflow_sentence_categories_v1';
export const SIMPLE_SENTENCES_METAS_KEY = 'taizerflow_sentence_category_metas_v1';

export const DEFAULT_CATEGORY_METAS: SentenceCategoryMeta[] = [
  {
    id: 'general',
    name: 'General',
    sinhalaName: 'සාමාන්‍ය භාවිතය',
    description: 'Everyday common English sentences & routine statements',
    iconName: 'BookOpen',
    colorTheme: 'sky',
  },
  {
    id: 'daily_life',
    name: 'Daily Life',
    sinhalaName: 'දෛනික ජීවිතය',
    description: 'Morning routines, habits, meals, and daily activities',
    iconName: 'Sun',
    colorTheme: 'emerald',
  },
  {
    id: 'basics',
    name: 'Basics',
    sinhalaName: 'මූලික රටා',
    description: 'Fundamental sentence building blocks for beginners',
    iconName: 'Sparkles',
    colorTheme: 'indigo',
  },
  {
    id: 'questions',
    name: 'Questions',
    sinhalaName: 'ප්‍රශ්න ඇසීම',
    description: 'Asking and answering daily questions with total confidence',
    iconName: 'HelpCircle',
    colorTheme: 'amber',
  },
  {
    id: 'greetings',
    name: 'Greetings',
    sinhalaName: 'සුබ පැතුම් සහ ආචාර',
    description: 'Warm greetings, polite phrases & courteous conversation',
    iconName: 'Smile',
    colorTheme: 'rose',
  },
  {
    id: 'work_study',
    name: 'Work & Study',
    sinhalaName: 'රැකියාව සහ අධ්‍යාපනය',
    description: 'Sentences for the classroom, study sessions & workplace',
    iconName: 'Briefcase',
    colorTheme: 'teal',
  },
  {
    id: 'travel',
    name: 'Travel',
    sinhalaName: 'ගමන් බිමන්',
    description: 'Directions, transport, tickets & travel conversations',
    iconName: 'Plane',
    colorTheme: 'purple',
  },
];

export const DEFAULT_SENTENCE_CATEGORIES = DEFAULT_CATEGORY_METAS.map((m) => m.name);

export const INITIAL_SAMPLE_SENTENCES: SimpleSentenceItem[] = [
  {
    id: 'sent-sample-1',
    english: 'I wake up at six in the morning.',
    sinhala: 'මම උදෑසන හයට අවදි වෙමි.',
    category: 'Daily Life',
    createdAt: 1700000000001,
  },
  {
    id: 'sent-sample-2',
    english: 'She prepares breakfast for the family.',
    sinhala: 'ඇය පවුල සඳහා උදෑසන ආහාරය පිළියෙල කරයි.',
    category: 'Daily Life',
    createdAt: 1700000000002,
  },
  {
    id: 'sent-sample-3',
    english: 'We drink coffee together every afternoon.',
    sinhala: 'අපි සෑම දහවල් කාලයකම එකට කෝපි බොමු.',
    category: 'Daily Life',
    createdAt: 1700000000003,
  },
  {
    id: 'sent-sample-4',
    english: 'This is my favorite English book.',
    sinhala: 'මේ මගේ ප්‍රියතම ඉංග්‍රීසි පොතයි.',
    category: 'Basics',
    createdAt: 1700000000004,
  },
  {
    id: 'sent-sample-5',
    english: 'The weather is very pleasant today.',
    sinhala: 'අද කාලගුණය ඉතා ප්‍රසන්නයි.',
    category: 'Basics',
    createdAt: 1700000000005,
  },
  {
    id: 'sent-sample-6',
    english: 'Where is the nearest bus station?',
    sinhala: 'ළඟම ඇති බස් නැවතුම්පොළ කොහේද?',
    category: 'Questions',
    createdAt: 1700000000006,
  },
  {
    id: 'sent-sample-7',
    english: 'What time does the English lesson start?',
    sinhala: 'ඉංග්‍රීසි පාඩම ආරම්භ වන්නේ කීයටද?',
    category: 'Questions',
    createdAt: 1700000000007,
  },
  {
    id: 'sent-sample-8',
    english: 'Good morning! Have a wonderful day ahead.',
    sinhala: 'සුබ උදෑසනක්! ඔබට සුබ දවසක් වේවා.',
    category: 'Greetings',
    createdAt: 1700000000008,
  },
  {
    id: 'sent-sample-9',
    english: 'Thank you so much for your kind help.',
    sinhala: 'ඔබගේ කාරුණික සහයෝගයට බොහෝම ස්තූතියි.',
    category: 'Greetings',
    createdAt: 1700000000009,
  },
  {
    id: 'sent-sample-10',
    english: 'I completed all my assignments yesterday.',
    sinhala: 'මම ඊයේ මගේ සියලුම පැවරුම් අවසන් කළෙමි.',
    category: 'Work & Study',
    createdAt: 1700000000010,
  },
  {
    id: 'sent-sample-11',
    english: 'Could you please show me the way to the city center?',
    sinhala: 'කරුණාකර මට නගර මධ්‍යස්ථානයට යන මාර්ගය පෙන්විය හැකිද?',
    category: 'Travel',
    createdAt: 1700000000011,
  },
];

export function getStoredCategoryMetas(): SentenceCategoryMeta[] {
  try {
    const raw = localStorage.getItem(SIMPLE_SENTENCES_METAS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load category metas', err);
  }
  return DEFAULT_CATEGORY_METAS;
}

export function saveStoredCategoryMetas(metas: SentenceCategoryMeta[]): void {
  try {
    localStorage.setItem(SIMPLE_SENTENCES_METAS_KEY, JSON.stringify(metas));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save category metas', err);
  }
}

export function getCategoryMeta(categoryName: string, metas?: SentenceCategoryMeta[]): SentenceCategoryMeta {
  const allMetas = metas || getStoredCategoryMetas();
  const normalized = categoryName.trim().toLowerCase();
  const found = allMetas.find(
    (m) => m.name.toLowerCase() === normalized || m.id.toLowerCase() === normalized
  );

  if (found) return found;

  // Auto-generate fallback metadata for dynamic custom categories
  const fallbackThemes = ['sky', 'emerald', 'indigo', 'amber', 'purple', 'rose', 'teal'];
  const hash = Math.abs(
    categoryName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );
  const colorTheme = fallbackThemes[hash % fallbackThemes.length];

  return {
    id: categoryName.toLowerCase().replace(/\s+/g, '_'),
    name: categoryName,
    sinhalaName: `${categoryName} වාක්‍ය`,
    description: `Specialized sentences for ${categoryName}`,
    iconName: 'BookOpen',
    colorTheme,
  };
}

export function getStoredSentenceCategories(): string[] {
  try {
    const raw = localStorage.getItem(SIMPLE_SENTENCES_CATEGORIES_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = Array.from(new Set(parsed.map((c: string) => c.trim()).filter(Boolean)));
        return cleaned.length > 0 ? cleaned : ['General'];
      }
    }
  } catch (err) {
    console.error('Failed to load categories', err);
  }
  return DEFAULT_SENTENCE_CATEGORIES;
}

export function saveStoredSentenceCategories(categories: string[]): void {
  try {
    const unique = Array.from(new Set(categories.map((c) => c.trim()).filter(Boolean)));
    localStorage.setItem(SIMPLE_SENTENCES_CATEGORIES_KEY, JSON.stringify(unique));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save categories', err);
  }
}

export function getStoredSimpleSentences(): SimpleSentenceItem[] {
  try {
    const raw = localStorage.getItem(SIMPLE_SENTENCES_STORAGE_KEY);
    if (!raw) {
      // First time initialization: populate default samples so cards are immediately visible!
      return INITIAL_SAMPLE_SENTENCES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      if (parsed.length === 0) return [];
      return parsed.map((item: Partial<SimpleSentenceItem>, idx: number) => ({
        id: item.id || `sentence-${Date.now()}-${idx}`,
        english: (item.english || '').trim(),
        sinhala: (item.sinhala || '').trim(),
        category: item.category || 'General',
        createdAt: item.createdAt || Date.now(),
      }));
    }
  } catch (err) {
    console.error('Failed to load simple sentences from storage', err);
  }
  return INITIAL_SAMPLE_SENTENCES;
}

export function saveStoredSimpleSentences(sentences: SimpleSentenceItem[]): void {
  try {
    localStorage.setItem(SIMPLE_SENTENCES_STORAGE_KEY, JSON.stringify(sentences));
    // Dispatch custom event for real-time reactivity across tabs and components
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save simple sentences to storage', err);
  }
}

export function speakText(
  text: string,
  rate: number = 0.9,
  onEnd?: () => void,
  onError?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    if (!text || !text.trim()) return false;

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    if (onEnd) utterance.onend = onEnd;
    if (onError) utterance.onerror = onError;

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error', err);
    if (onError) onError();
    return false;
  }
}
