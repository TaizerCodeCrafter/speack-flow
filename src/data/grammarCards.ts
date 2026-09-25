import { GrammarSubCard } from '../types';

export const GRAMMAR_CARDS_STORAGE_KEY = 'speakflow_grammar_subcards_v1';

export const DEFAULT_GRAMMAR_CARDS: GrammarSubCard[] = [
  // Do Category
  {
    id: 'do-1',
    category: 'do',
    number: 1,
    title: 'Card 1',
    subtitle: 'Basic Usage of Do & Does',
    englishContent:
      'We use "do" and "does" as auxiliary verbs in the simple present tense to form questions and negative statements.\n\n• Use "do" with subjects: I, You, We, They (and plural nouns).\n• Use "does" with subjects: He, She, It (and singular nouns).',
    examples: [
      'I do my homework every afternoon.',
      'She does not (doesn’t) drink coffee in the evening.',
      'Do you speak English fluently?',
      'Does he play cricket on weekends?',
    ],
    notes:
      'Crucial Rule: After "does" or "doesn’t", the main verb always remains in its base form (infinitive without to). Never add "s" or "es" to the main verb (e.g., "She doesn’t work", NOT "She doesn’t works").',
  },
  {
    id: 'do-2',
    category: 'do',
    number: 2,
    title: 'Card 2',
    subtitle: 'Past Tense (Did) & Emphasis',
    englishContent:
      '"Did" is the simple past form of both "do" and "does". It is used for all subjects (I, You, He, She, It, We, They).\n\nIn affirmative sentences, "do/does/did" can also be used before a base verb to give strong emphasis.',
    examples: [
      'Did you finish the assignment yesterday?',
      'They did not (didn’t) attend the seminar.',
      'I do believe you are right! (Emphatic)',
      'She did tell me the truth before she left.',
    ],
    notes:
      'Always remember: When using "did" in a question or negative statement, the main verb reverts to the base form: "Did you go?" (NOT "Did you went?").',
  },

  // Have Category
  {
    id: 'have-1',
    category: 'have',
    number: 1,
    title: 'Card 1',
    subtitle: 'Possession & Present Perfect',
    englishContent:
      'The verb "have" serves two primary roles in English:\n\n1. As a main verb indicating ownership, relationships, or experiences.\n2. As an auxiliary verb used with a past participle (V3) to form Perfect Tenses.\n\n• Present: Use "have" with I, You, We, They. Use "has" with He, She, It.\n• Past: Use "had" for all persons.',
    examples: [
      'I have two older sisters and a brother.',
      'He has an interesting book about world history.',
      'We have completed our English lesson for today.',
      'She had already left when the rain started.',
    ],
    notes:
      'Tip: "Have got" is frequently used in conversational British English for possession: "I’ve got a question." In American English, "I have a question" is more common.',
  },

  // Be Category
  {
    id: 'be-1',
    category: 'be',
    number: 1,
    title: 'Card 1',
    subtitle: 'Present Tense (Am / Is / Are)',
    englishContent:
      'The verb "to be" connects the subject to an adjective, noun, or location to describe identity, condition, or state.\n\n• "Am" is used exclusively with I.\n• "Is" is used with singular subjects: He, She, It.\n• "Are" is used with plural subjects and You: You, We, They.',
    examples: [
      'I am excited to improve my English speaking skills.',
      'She is a talented software engineer.',
      'They are ready for the upcoming examination.',
      'The weather is calm and pleasant today.',
    ],
    notes:
      'In present continuous tense, "am/is/are" is paired with verb+ing: "He is reading", "They are studying".',
  },
  {
    id: 'be-2',
    category: 'be',
    number: 2,
    title: 'Card 2',
    subtitle: 'Past Tense (Was / Were)',
    englishContent:
      '"Was" and "were" are the past tense forms of "be". They describe states, conditions, or actions that were taking place at a specific moment in the past.\n\n• Use "was" with: I, He, She, It.\n• Use "were" with: You, We, They.',
    examples: [
      'I was at the library yesterday afternoon.',
      'We were very happy with the final test results.',
      'She was preparing dinner when I called.',
      'They were not (weren’t) aware of the schedule change.',
    ],
    notes:
      'In hypothetical / conditional sentences (If clauses), "were" is traditionally used with all subjects: "If I were you, I would practice daily."',
  },
  {
    id: 'be-3',
    category: 'be',
    number: 3,
    title: 'Card 3',
    subtitle: 'Participles (Been & Being)',
    englishContent:
      '• "Been" is the past participle of "be". It is used after "have", "has", or "had" to form perfect tenses and perfect passive voice.\n• "Being" is the present participle (verb+ing). It is used in continuous passive sentences or to describe someone acting in a temporary way.',
    examples: [
      'I have been to Singapore twice for conferences.',
      'She has been studying English for three years.',
      'The new hospital is being constructed right now.',
      'Why are you being so quiet today?',
    ],
    notes:
      'Contrast: "He has been silly" (state up to now) vs "He is being silly" (temporary behavior happening right at this moment).',
  },
];

export function getStoredGrammarCards(): GrammarSubCard[] {
  try {
    const raw = localStorage.getItem(GRAMMAR_CARDS_STORAGE_KEY);
    if (!raw) {
      saveStoredGrammarCards(DEFAULT_GRAMMAR_CARDS);
      return DEFAULT_GRAMMAR_CARDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load grammar subcards from storage', err);
  }
  return DEFAULT_GRAMMAR_CARDS;
}

export function saveStoredGrammarCards(cards: GrammarSubCard[]): void {
  try {
    localStorage.setItem(GRAMMAR_CARDS_STORAGE_KEY, JSON.stringify(cards));
  } catch (err) {
    console.error('Failed to save grammar subcards to storage', err);
  }
}
