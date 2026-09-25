import { SimpleSentenceItem, SentenceCategoryMeta, SentencePackCard } from '../types';
import { PDF_100_HAVE_DO_BE_SENTENCES } from './pdf100HaveDoBeSentences';
import { PDF_100_MODAL_SENTENCES } from './pdf100ModalSentences';
import { PDF_800_MIXED_ADVANCE_SENTENCES } from './pdf800MixedAdvanceSentences';

export { PDF_100_HAVE_DO_BE_SENTENCES, PDF_100_MODAL_SENTENCES, PDF_800_MIXED_ADVANCE_SENTENCES };

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
  {
    id: 'mixed-advance',
    title: 'Mixed Advance',
    subtitle: 'Daily Conversation & Routine',
    description: 'Master 800 comprehensive real-world English sentences in sequential order with accurate Sinhala translations and natural audio.',
    tag: 'Mixed Advance (800 Sentences)',
    iconName: 'Sparkles',
    colorTheme: 'sky',
    createdAt: 1730000000000,
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

        // Ensure Mixed Advance card exists
        const hasMixed = updated.some(
          (p: SentencePackCard) => p.id === 'mixed-advance' || p.title.toLowerCase().trim() === 'mixed advance'
        );
        if (!hasMixed) {
          updated.push(DEFAULT_SENTENCE_PACKS[2]);
          hasChanges = true;
        }

        DEFAULT_SENTENCE_PACKS.forEach((defaultPack) => {
          if (!updated.some((p: SentencePackCard) => p.id === defaultPack.id || p.title.toLowerCase().trim() === defaultPack.title.toLowerCase().trim())) {
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
    id: 'morning_routine',
    name: 'Morning & Routine',
    sinhalaName: 'උදෑසන හා දින චර්යාව',
    description: 'Waking up, getting ready, and everyday routine habits',
    iconName: 'Sun',
    colorTheme: 'amber',
  },
  {
    id: 'study_learning',
    name: 'Study & Learning',
    sinhalaName: 'ඉගෙනුම හා පාඩම්',
    description: 'Learning English, fast comprehension, and skill practice',
    iconName: 'BookOpen',
    colorTheme: 'emerald',
  },
  {
    id: 'food_meals',
    name: 'Food & Meals',
    sinhalaName: 'කෑම බීම හා ආහාර',
    description: 'Meals, cooking, dinner, and eating habits',
    iconName: 'Smile',
    colorTheme: 'rose',
  },
  {
    id: 'drinks_refreshment',
    name: 'Drinks & Refreshment',
    sinhalaName: 'පාන වර්ග හා ප්‍රබෝධය',
    description: 'Water, tea, healthy beverages, and refreshment',
    iconName: 'Sparkles',
    colorTheme: 'teal',
  },
  {
    id: 'communication_truth',
    name: 'Communication & Truth',
    sinhalaName: 'සන්නිවේදනය හා සත්‍යය',
    description: 'Speaking truth, sharing opinions, and conversation',
    iconName: 'MessageSquare',
    colorTheme: 'sky',
  },
  {
    id: 'feelings_emotions',
    name: 'Feelings & Emotions',
    sinhalaName: 'හැඟීම් හා සිතුවිලි',
    description: 'Happiness, overcoming sadness, courage, and confidence',
    iconName: 'Smile',
    colorTheme: 'purple',
  },
  {
    id: 'work_career',
    name: 'Work & Career',
    sinhalaName: 'රැකියාව හා වෘත්තිය',
    description: 'Jobs, hard work, office tasks, and professional life',
    iconName: 'Briefcase',
    colorTheme: 'indigo',
  },
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
  ...PDF_800_MIXED_ADVANCE_SENTENCES,
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
    const storedPacks = getStoredSentencePacks();
    const mixedCard = storedPacks.find((p) => p.title.toLowerCase().trim() === 'mixed advance') || { id: 'mixed-advance' };

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
            const mapped800 = PDF_800_MIXED_ADVANCE_SENTENCES.map((s) => ({ ...s, cardId: mixedCard.id }));
            const withPdf = [
              ...PDF_100_HAVE_DO_BE_SENTENCES,
              ...PDF_100_MODAL_SENTENCES,
              ...mapped800,
              ...normalized,
            ];
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

      const existingIds = new Set(workingList.map((s: any) => s.id));
      const missingHaveDoBe = PDF_100_HAVE_DO_BE_SENTENCES.filter((s) => !existingIds.has(s.id));
      const missingModal = PDF_100_MODAL_SENTENCES.filter((s) => !existingIds.has(s.id));
      const missingMixed = PDF_800_MIXED_ADVANCE_SENTENCES.filter((s) => !existingIds.has(s.id));

      if (missingHaveDoBe.length > 0 || missingModal.length > 0 || missingMixed.length > 0) {
        const mappedMixed = missingMixed.map((s) => ({ ...s, cardId: mixedCard.id }));
        workingList = [...missingHaveDoBe, ...missingModal, ...mappedMixed, ...workingList];
        needsSave = true;
      }

      // If user's Mixed Advance card has a dynamic ID, map all mixed-adv items to it
      if (mixedCard && mixedCard.id) {
        workingList = workingList.map((s) => {
          if (s.id && s.id.startsWith('mixed-adv-') && s.cardId !== mixedCard.id) {
            needsSave = true;
            return { ...s, cardId: mixedCard.id };
          }
          return s;
        });
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
          number: item.number,
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

export function restoreDefaultMixedAdvanceSentences(): SimpleSentenceItem[] {
  const current = getStoredSimpleSentences();
  const storedPacks = getStoredSentencePacks();
  const mixedCard = storedPacks.find((p) => p.title.toLowerCase().trim() === 'mixed advance') || { id: 'mixed-advance' };
  const existingOther = current.filter((s) => !s.id.startsWith('mixed-adv-'));
  const mapped800 = PDF_800_MIXED_ADVANCE_SENTENCES.map((s) => ({ ...s, cardId: mixedCard.id }));
  const restored = [...mapped800, ...existingOther];
  saveStoredSimpleSentences(restored);
  return restored;
}

export function restoreAllPackSentences(): SimpleSentenceItem[] {
  const current = getStoredSimpleSentences();
  const storedPacks = getStoredSentencePacks();
  const mixedCard = storedPacks.find((p) => p.title.toLowerCase().trim() === 'mixed advance') || { id: 'mixed-advance' };
  const existingOther = current.filter(
    (s) => !s.id.startsWith('have-do-be-') && !s.id.startsWith('modal-sent-') && !s.id.startsWith('mixed-adv-')
  );
  const mapped800 = PDF_800_MIXED_ADVANCE_SENTENCES.map((s) => ({ ...s, cardId: mixedCard.id }));
  const restored = [
    ...PDF_100_HAVE_DO_BE_SENTENCES,
    ...PDF_100_MODAL_SENTENCES,
    ...mapped800,
    ...existingOther,
  ];
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
