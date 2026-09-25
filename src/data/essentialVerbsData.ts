import { EssentialVerbItem, VerbPackCard } from '../types';
import { PDF_250_VERBS } from './pdf250Verbs';

export const ESSENTIAL_VERBS_STORAGE_KEY = 'taizerflow_essential_verbs_v3';
export const ESSENTIAL_VERB_CATEGORIES_KEY = 'taizerflow_verb_categories_v2';
export const VERB_PACKS_STORAGE_KEY = 'taizerflow_verb_packs_v1';

export const DEFAULT_VERB_PACKS: VerbPackCard[] = [
  {
    id: 'essential-verbs-1',
    title: 'Essential Verbs 1',
    subtitle: 'Daily Action Verbs & Forms (V1 - V5)',
    description: 'Master 1,000+ vital daily action verbs, forms (V1, V2, V3, V4, V5), and natural sentence usages with Sinhala meanings.',
    tag: 'Essential Verbs 1 (1000+ Verbs)',
    iconName: 'Zap',
    colorTheme: 'rose',
    createdAt: 1700000000000,
  },
  {
    id: 'essential-verbs-2',
    title: 'Essential Verbs 2',
    subtitle: 'Advanced & Conversational Verbs',
    description: 'Next level action verbs, phrase verbs, and expressive vocabulary for fluent English speaking and writing.',
    tag: 'Essential Verbs 2',
    iconName: 'Sparkles',
    colorTheme: 'indigo',
    createdAt: 1700000001000,
  },
];

export function getStoredVerbPacks(): VerbPackCard[] {
  try {
    const raw = localStorage.getItem(VERB_PACKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let updated = [...parsed];
        let hasChanges = false;
        DEFAULT_VERB_PACKS.forEach((defaultPack) => {
          const existing = updated.find((p: VerbPackCard) => p.id === defaultPack.id);
          if (!existing) {
            updated.push(defaultPack);
            hasChanges = true;
          } else if (defaultPack.id === 'essential-verbs-1' && existing.tag?.includes('250')) {
            existing.tag = defaultPack.tag;
            existing.description = defaultPack.description;
            hasChanges = true;
          }
        });
        if (hasChanges) {
          saveStoredVerbPacks(updated);
        }
        return updated;
      }
    }
  } catch (err) {
    console.error('Failed to load verb packs from storage', err);
  }
  return DEFAULT_VERB_PACKS;
}

export function saveStoredVerbPacks(packs: VerbPackCard[]): void {
  try {
    localStorage.setItem(VERB_PACKS_STORAGE_KEY, JSON.stringify(packs));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save verb packs to storage', err);
  }
}

export const DEFAULT_VERB_CATEGORIES = [
  'All Verbs',
  'Daily Routine',
  'Communication',
  'Movement',
  'Work & Study',
  'Feelings',
  'Action',
  'Irregular Verbs',
];

export const INITIAL_ESSENTIAL_VERBS: EssentialVerbItem[] = PDF_250_VERBS.map((v) => ({
  ...v,
  cardId: v.cardId || 'essential-verbs-1',
}));

export function getStoredEssentialVerbs(): EssentialVerbItem[] {
  try {
    // Check v3 key first
    let raw = localStorage.getItem(ESSENTIAL_VERBS_STORAGE_KEY);
    if (!raw) {
      // Check legacy v2 key
      const legacyRaw = localStorage.getItem('taizerflow_essential_verbs_v2');
      if (legacyRaw) {
        try {
          const legacyParsed = JSON.parse(legacyRaw);
          if (Array.isArray(legacyParsed) && legacyParsed.length > 500) {
            const normalized = legacyParsed.map((item: EssentialVerbItem) => ({
              ...item,
              cardId: item.cardId || 'essential-verbs-1',
            }));
            saveStoredEssentialVerbs(normalized);
            return normalized;
          }
        } catch {
          // ignore
        }
      }
      // Initialize with full 1000+ verbs assigned to Essential Verbs 1
      const defaultWithCard = PDF_250_VERBS.map((v) => ({
        ...v,
        cardId: v.cardId || 'essential-verbs-1',
      }));
      saveStoredEssentialVerbs(defaultWithCard);
      return defaultWithCard;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      if (parsed.length < 500) {
        // Upgrade to full 1000+ verbs
        const defaultWithCard = PDF_250_VERBS.map((v) => ({
          ...v,
          cardId: v.cardId || 'essential-verbs-1',
        }));
        saveStoredEssentialVerbs(defaultWithCard);
        return defaultWithCard;
      }
      // Ensure all items have a cardId
      let needsSave = false;
      const normalized = parsed.map((item: EssentialVerbItem) => {
        if (!item.cardId) {
          needsSave = true;
          return { ...item, cardId: 'essential-verbs-1' };
        }
        return item;
      });
      if (needsSave) {
        saveStoredEssentialVerbs(normalized);
      }
      return normalized;
    }
  } catch (err) {
    console.error('Failed to load essential verbs from storage', err);
  }
  return PDF_250_VERBS.map((v) => ({ ...v, cardId: 'essential-verbs-1' }));
}

export function saveStoredEssentialVerbs(verbs: EssentialVerbItem[]): void {
  try {
    localStorage.setItem(ESSENTIAL_VERBS_STORAGE_KEY, JSON.stringify(verbs));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save essential verbs to storage', err);
  }
}

export function getStoredVerbCategories(): string[] {
  try {
    const raw = localStorage.getItem(ESSENTIAL_VERB_CATEGORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return Array.from(new Set(parsed.map((c: string) => c.trim()).filter(Boolean)));
      }
    }
  } catch (err) {
    console.error('Failed to load verb categories', err);
  }
  return DEFAULT_VERB_CATEGORIES;
}

export function saveStoredVerbCategories(categories: string[]): void {
  try {
    const unique = Array.from(new Set(categories.map((c) => c.trim()).filter(Boolean)));
    localStorage.setItem(ESSENTIAL_VERB_CATEGORIES_KEY, JSON.stringify(unique));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save verb categories', err);
  }
}

export function speakVerbText(
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
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) =>
        (v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))) ||
        v.lang === 'en-US' ||
        v.lang === 'en-GB'
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

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
