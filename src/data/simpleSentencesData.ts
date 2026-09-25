import { SimpleSentenceItem, SentenceCategoryMeta, SentencePackCard } from '../types';
import { PDF_100_HAVE_DO_BE_SENTENCES } from './pdf100HaveDoBeSentences';
import { PDF_100_MODAL_SENTENCES } from './pdf100ModalSentences';

export { PDF_100_HAVE_DO_BE_SENTENCES, PDF_100_MODAL_SENTENCES };

export const SIMPLE_SENTENCES_STORAGE_KEY = 'taizerflow_simple_sentences_v2';
export const SIMPLE_SENTENCES_CATEGORIES_KEY = 'taizerflow_sentence_categories_v1';
export const SIMPLE_SENTENCES_METAS_KEY = 'taizerflow_sentence_category_metas_v1';
export const SENTENCE_PACKS_STORAGE_KEY = 'taizerflow_sentence_packs_v1';

export const DEFAULT_SENTENCE_PACKS: SentencePackCard[] = [
  {
    id: 'simple-sentences-1',
    title: 'Have / Do / Be',
    subtitle: 'Daily Life, Greetings & Routine',
    description: 'Master 100 practical Have, Do, Be sentence patterns with clear Sinhala meanings, natural audio pronunciation, and everyday expressions.',
    tag: 'Have / Do / Be (100+ Sentences)',
    iconName: 'BookOpen',
    colorTheme: 'amber',
    createdAt: 1700000000000,
  },
  {
    id: 'simple-sentences-2',
    title: 'Can / Will / Would / Should / Must',
    subtitle: 'Questions & Study',
    description: 'Master 100 essential modal verbs (Can, Could, Will, Would, Should, Must, May, Might, Need) with Sinhala meanings and audio.',
    tag: 'Can / Will / Would / Should / Must (100+ Sentences)',
    iconName: 'Sparkles',
    colorTheme: 'purple',
    createdAt: 1700000001000,
  },
];

export function getStoredSentencePacks(): SentencePackCard[] {
  try {
    const raw = localStorage.getItem(SENTENCE_PACKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let updated = [...parsed];
        let hasChanges = false;

        // Auto-update first card title to "Have / Do / Be" if it was "Simple Sentences 1"
        const card1 = updated.find((p: SentencePackCard) => p.id === 'simple-sentences-1');
        if (card1 && (card1.title === 'Simple Sentences 1' || card1.title === 'Have / Do / Be')) {
          if (card1.title === 'Simple Sentences 1') {
            card1.title = 'Have / Do / Be';
            card1.colorTheme = 'amber';
            card1.tag = 'Have / Do / Be (100+ Sentences)';
            hasChanges = true;
          }
        }

        // Auto-update second card title to "Can / Will / Would / Should / Must" if it was "Simple Sentences 2"
        const card2 = updated.find((p: SentencePackCard) => p.id === 'simple-sentences-2');
        if (card2 && (card2.title === 'Simple Sentences 2' || card2.title.includes('Can / Will'))) {
          if (card2.title === 'Simple Sentences 2') {
            card2.title = 'Can / Will / Would / Should / Must';
            card2.subtitle = 'Questions & Study';
            card2.colorTheme = 'purple';
            card2.tag = 'Can / Will / Would / Should / Must (100+ Sentences)';
            hasChanges = true;
          }
        }

        DEFAULT_SENTENCE_PACKS.forEach((defaultPack) => {
          if (!updated.some((p: SentencePackCard) => p.id === defaultPack.id)) {
            updated.push(defaultPack);
            hasChanges = true;
          }
        });
        if (hasChanges) {
          saveStoredSentencePacks(updated);
        }
        return updated;
      }
    }
  } catch (err) {
    console.error('Failed to load sentence packs from storage', err);
  }
  return DEFAULT_SENTENCE_PACKS;
}

export function saveStoredSentencePacks(packs: SentencePackCard[]): void {
  try {
    localStorage.setItem(SENTENCE_PACKS_STORAGE_KEY, JSON.stringify(packs));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save sentence packs to storage', err);
  }
}

export const DEFAULT_CATEGORY_METAS: SentenceCategoryMeta[] = [
  {
    id: 'can_could',
    name: 'Can & Could',
    sinhalaName: 'Can / Could (හැකියාව)',
    description: 'Ability, permission, and polite requests with Can and Could',
    iconName: 'Sparkles',
    colorTheme: 'purple',
  },
  {
    id: 'will_wont',
    name: "Will & Won't",
    sinhalaName: "Will / Won't (අනාගතය)",
    description: 'Future intentions, promises, decisions, and refusals',
    iconName: 'Zap',
    colorTheme: 'indigo',
  },
  {
    id: 'would_wouldnt',
    name: "Would & Wouldn't",
    sinhalaName: "Would / Wouldn't (කැමැත්ත / ආචාරශීලී)",
    description: 'Polite offers, preferences, and conditional statements',
    iconName: 'Smile',
    colorTheme: 'teal',
  },
  {
    id: 'should_shouldnt',
    name: "Should & Shouldn't",
    sinhalaName: "Should / Shouldn't (උපදෙස් / යුතුකම)",
    description: 'Advice, recommendations, and moral obligations',
    iconName: 'BookOpen',
    colorTheme: 'emerald',
  },
  {
    id: 'must_mustnt',
    name: "Must & Mustn't",
    sinhalaName: "Must / Mustn't (අනිවාර්ය)",
    description: 'Strong obligation, necessity, prohibition, and logical deduction',
    iconName: 'HelpCircle',
    colorTheme: 'rose',
  },
  {
    id: 'may_might',
    name: 'May & Might',
    sinhalaName: 'May / Might (හැකියාව / අවසර)',
    description: 'Possibility, uncertainty, and formal permission',
    iconName: 'Sun',
    colorTheme: 'amber',
  },
  {
    id: 'need_have_to',
    name: 'Need & Have to',
    sinhalaName: 'Need / Needn\'t / Have to',
    description: 'Requirements, necessity, and lack of obligation',
    iconName: 'Layers',
    colorTheme: 'sky',
  },
  {
    id: 'used_to_going_to',
    name: 'Used to & Going to',
    sinhalaName: 'Used to / Going to (පුරුදු / සැලසුම්)',
    description: 'Past habits, future plans, and becoming accustomed to something',
    iconName: 'RotateCcw',
    colorTheme: 'purple',
  },
  {
    id: 'have_to',
    name: 'Have to Patterns',
    sinhalaName: 'Have to / Had to රටා',
    description: 'Obligation and necessity patterns (have to, had to, must)',
    iconName: 'Zap',
    colorTheme: 'amber',
  },
  {
    id: 'be_verbs',
    name: 'Be Verbs',
    sinhalaName: 'Be ක්‍රියාපද (Am/Is/Are/Was/Were)',
    description: 'State of being, presence, and emotions with be verbs',
    iconName: 'Sparkles',
    colorTheme: 'sky',
  },
  {
    id: 'do_dont',
    name: "Do & Don't",
    sinhalaName: "Do / Does / Did / Don't",
    description: 'Actions, habits, emphasis, and common daily imperatives',
    iconName: 'BookOpen',
    colorTheme: 'emerald',
  },
  {
    id: 'continuous_perfect',
    name: 'Continuous & Perfect',
    sinhalaName: 'Been / -ing / Done / Gone',
    description: 'Actions in progress, ongoing states, and completed actions',
    iconName: 'Layers',
    colorTheme: 'indigo',
  },
  {
    id: 'negative_patterns',
    name: 'Negative Patterns',
    sinhalaName: "සෘණ වාක්‍ය (Haven't / Hadn't / Don't)",
    description: 'Everyday negative sentences and denial expressions',
    iconName: 'HelpCircle',
    colorTheme: 'rose',
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
  {
    id: 'general',
    name: 'General',
    sinhalaName: 'සාමාන්‍ය භාවිතය',
    description: 'Everyday common English sentences & routine statements',
    iconName: 'BookOpen',
    colorTheme: 'sky',
  },
];

export const DEFAULT_SENTENCE_CATEGORIES = DEFAULT_CATEGORY_METAS.map((m) => m.name);

export const INITIAL_SAMPLE_SENTENCES: SimpleSentenceItem[] = [
  ...PDF_100_HAVE_DO_BE_SENTENCES,
  ...PDF_100_MODAL_SENTENCES,
  {
    id: 'sent-sample-1',
    cardId: 'simple-sentences-1',
    english: 'I wake up at six in the morning.',
    sinhala: 'මම උදෑසන හයට අවදි වෙමි.',
    category: 'Daily Life',
    createdAt: 1700000000001,
  },
  {
    id: 'sent-sample-2',
    cardId: 'simple-sentences-1',
    english: 'She prepares breakfast for the family.',
    sinhala: 'ඇය පවුල සඳහා උදෑසන ආහාරය පිළියෙල කරයි.',
    category: 'Daily Life',
    createdAt: 1700000000002,
  },
  {
    id: 'sent-sample-3',
    cardId: 'simple-sentences-1',
    english: 'We drink coffee together every afternoon.',
    sinhala: 'අපි සෑම දහවල් කාලයකම එකට කෝපි බොමු.',
    category: 'Daily Life',
    createdAt: 1700000000003,
  },
  {
    id: 'sent-sample-4',
    cardId: 'simple-sentences-1',
    english: 'This is my favorite English book.',
    sinhala: 'මේ මගේ ප්‍රියතම ඉංග්‍රීසි පොතයි.',
    category: 'Basics',
    createdAt: 1700000000004,
  },
  {
    id: 'sent-sample-5',
    cardId: 'simple-sentences-1',
    english: 'The weather is very pleasant today.',
    sinhala: 'අද කාලගුණය ඉතා ප්‍රසන්නයි.',
    category: 'Basics',
    createdAt: 1700000000005,
  },
  {
    id: 'sent-sample-6',
    cardId: 'simple-sentences-2',
    english: 'Where is the nearest bus station?',
    sinhala: 'ළඟම ඇති බස් නැවතුම්පොළ කොහේද?',
    category: 'Questions',
    createdAt: 1700000000006,
  },
  {
    id: 'sent-sample-7',
    cardId: 'simple-sentences-2',
    english: 'What time does the English lesson start?',
    sinhala: 'ඉංග්‍රීසි පාඩම ආරම්භ වන්නේ කීයටද?',
    category: 'Questions',
    createdAt: 1700000000007,
  },
  {
    id: 'sent-sample-8',
    cardId: 'simple-sentences-1',
    english: 'Good morning! Have a wonderful day ahead.',
    sinhala: 'සුබ උදෑසනක්! ඔබට සුබ දවසක් වේවා.',
    category: 'Greetings',
    createdAt: 1700000000008,
  },
  {
    id: 'sent-sample-9',
    cardId: 'simple-sentences-1',
    english: 'Thank you so much for your kind help.',
    sinhala: 'ඔබගේ කාරුණික සහයෝගයට බොහෝම ස්තූතියි.',
    category: 'Greetings',
    createdAt: 1700000000009,
  },
  {
    id: 'sent-sample-10',
    cardId: 'simple-sentences-2',
    english: 'I completed all my assignments yesterday.',
    sinhala: 'මම ඊයේ මගේ සියලුම පැවරුම් අවසන් කළෙමි.',
    category: 'Work & Study',
    createdAt: 1700000000010,
  },
  {
    id: 'sent-sample-11',
    cardId: 'simple-sentences-2',
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

  return {
    id: normalized.replace(/\s+/g, '_'),
    name: categoryName,
    sinhalaName: categoryName,
    description: `Sentences categorized under ${categoryName}`,
    iconName: 'BookOpen',
    colorTheme: 'sky',
  };
}

export function getStoredSentenceCategories(): string[] {
  try {
    const raw = localStorage.getItem(SIMPLE_SENTENCES_CATEGORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const combined = Array.from(new Set([...DEFAULT_SENTENCE_CATEGORIES, ...parsed]));
        return combined;
      }
    }
  } catch (err) {
    console.error('Failed to load sentence categories from storage', err);
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
    let raw = localStorage.getItem(SIMPLE_SENTENCES_STORAGE_KEY);
    if (!raw) {
      const legacyRaw = localStorage.getItem('taizerflow_simple_sentences_v1');
      if (legacyRaw) {
        try {
          const parsedLegacy = JSON.parse(legacyRaw);
          if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
            const normalized = parsedLegacy.map((item: Partial<SimpleSentenceItem>, idx: number) => ({
              id: item.id || `sentence-${Date.now()}-${idx}`,
              cardId: item.cardId || (idx % 2 === 0 ? 'simple-sentences-1' : 'simple-sentences-2'),
              english: (item.english || '').trim(),
              sinhala: (item.sinhala || '').trim(),
              category: item.category || 'General',
              createdAt: item.createdAt || Date.now(),
            }));
            const withPdf = [...PDF_100_HAVE_DO_BE_SENTENCES, ...PDF_100_MODAL_SENTENCES, ...normalized];
            saveStoredSimpleSentences(withPdf);
            return withPdf;
          }
        } catch {
          // ignore
        }
      }
      return INITIAL_SAMPLE_SENTENCES;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      let needsSave = false;
      let workingList = [...parsed];

      // Auto-merge the 100 Have/Do/Be sentences and 100 Modal sentences if they are missing
      const existingIds = new Set(workingList.map((s: any) => s.id));
      const missingHaveDoBe = PDF_100_HAVE_DO_BE_SENTENCES.filter((s) => !existingIds.has(s.id));
      const missingModal = PDF_100_MODAL_SENTENCES.filter((s) => !existingIds.has(s.id));

      if (missingHaveDoBe.length > 0 || missingModal.length > 0) {
        workingList = [...missingHaveDoBe, ...missingModal, ...workingList];
        needsSave = true;
      }

      const normalized = workingList.map((item: Partial<SimpleSentenceItem>, idx: number) => {
        if (!item.cardId) {
          needsSave = true;
          return {
            id: item.id || `sentence-${Date.now()}-${idx}`,
            cardId: 'simple-sentences-1',
            english: (item.english || '').trim(),
            sinhala: (item.sinhala || '').trim(),
            category: item.category || 'General',
            createdAt: item.createdAt || Date.now(),
          };
        }
        return {
          id: item.id || `sentence-${Date.now()}-${idx}`,
          cardId: item.cardId,
          english: (item.english || '').trim(),
          sinhala: (item.sinhala || '').trim(),
          category: item.category || 'General',
          createdAt: item.createdAt || Date.now(),
        };
      });

      if (needsSave) {
        saveStoredSimpleSentences(normalized);
      }
      return normalized;
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

export function restoreDefaultHaveDoBeSentences(): SimpleSentenceItem[] {
  const current = getStoredSimpleSentences();
  const existingOther = current.filter((s) => !s.id.startsWith('have-do-be-'));
  const restored = [...PDF_100_HAVE_DO_BE_SENTENCES, ...existingOther];
  saveStoredSimpleSentences(restored);
  return restored;
}

export function restoreDefaultModalSentences(): SimpleSentenceItem[] {
  const current = getStoredSimpleSentences();
  const existingOther = current.filter((s) => !s.id.startsWith('modal-sent-'));
  const restored = [...PDF_100_MODAL_SENTENCES, ...existingOther];
  saveStoredSimpleSentences(restored);
  return restored;
}

export function restoreAllPackSentences(): SimpleSentenceItem[] {
  const current = getStoredSimpleSentences();
  const existingOther = current.filter(
    (s) => !s.id.startsWith('have-do-be-') && !s.id.startsWith('modal-sent-')
  );
  const restored = [...PDF_100_HAVE_DO_BE_SENTENCES, ...PDF_100_MODAL_SENTENCES, ...existingOther];
  saveStoredSimpleSentences(restored);
  return restored;
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
