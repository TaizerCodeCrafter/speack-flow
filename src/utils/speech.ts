/**
 * Speech synthesis (Text-to-Speech) and Speech recognition utilities
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.loadVoices();
    }
    return this.voices;
  }

  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
      onBoundary?: (charIndex: number) => void;
    }
  ): void {
    if (!this.synth) return;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate ?? 1.0;
    utterance.pitch = options?.pitch ?? 1.0;

    // Pick best English voice if available
    const englishVoices = this.getVoices().filter((v) =>
      v.lang.startsWith('en')
    );
    const preferredVoice =
      englishVoices.find((v) => v.name.includes('Google') || v.name.includes('Natural')) ||
      englishVoices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (options?.onEnd) {
      utterance.onend = options.onEnd;
      utterance.onerror = options.onEnd;
    }

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}

export const speechService = new SpeechService();

export function calculateSpeechAccuracy(spoken: string, target: string): {
  score: number;
  matchedWords: string[];
  missingWords: string[];
} {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const spokenWords = clean(spoken);
  const targetWords = clean(target);

  if (targetWords.length === 0) return { score: 100, matchedWords: [], missingWords: [] };

  const matchedWords: string[] = [];
  const missingWords: string[] = [];

  const spokenSet = new Set(spokenWords);

  targetWords.forEach((word) => {
    if (spokenSet.has(word)) {
      matchedWords.push(word);
    } else {
      missingWords.push(word);
    }
  });

  const score = Math.round((matchedWords.length / targetWords.length) * 100);
  return { score, matchedWords, missingWords };
}
