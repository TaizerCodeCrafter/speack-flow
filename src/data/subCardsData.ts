import { PracticeSubCard } from '../types';

export const PRACTICE_CARDS_STORAGE_KEY = 'speakflow_practice_subcards_v2';

export const DEFAULT_PRACTICE_CARDS: PracticeSubCard[] = [
  // ==========================================
  // WRITING HUB CARDS
  // ==========================================
  {
    id: 'writing-card-1',
    hub: 'writing',
    category: 'writing',
    number: 1,
    title: 'Writing',
    subtitle: 'Sentence Structure & Essay Composition (ලිවීමේ කුසලතා)',
    englishContent:
      'Clear English writing is built upon consistent sentence structure: Subject + Verb + Object.\n\nKey Principles of Good Writing:\n1. Organize your thoughts into three core sections: Introduction, Body, and Conclusion.\n2. Use cohesive transitions (linking words) like "Furthermore", "However", "In addition", and "Therefore" to connect ideas smoothly.\n3. Vary your sentence lengths to maintain the reader\'s interest.',
    sinhalaContent:
      'සාර්ථක ඉංග්‍රීසි ලේඛනයක් (English Writing) ආරම්භ වන්නේ මූලික වාක්‍ය රටාවෙනි: Subject (කර්තෘ) + Verb (ක්‍රියාව) + Object (කර්මය).\n\nහොඳින් රචනා කිරීමේ මූලික පියවර:\n1. ඔබේ අදහස් කොටස් 3කට ගොනු කරන්න: හැඳින්වීම (Introduction), ප්‍රධාන කරුණු (Body Paragraphs), සහ සමාලෝචනය (Conclusion).\n2. වාක්‍ය අතර මනා සම්බන්ධයක් ඇති කිරීමට "Furthermore" (තවද), "However" (කෙසේ වෙතත්), "In addition" (ඊට අමතරව) වැනි සම්බන්ධක පද (Linking Words) භාවිත කරන්න.\n3. කියවන්නාගේ උනන්දුව රඳවා ගැනීමට කෙටි සහ දිගු වාක්‍ය සමබරව යොදාගන්න.',
    examples: [
      {
        english: 'In addition to building vocabulary, daily reading sharpens our writing style.',
        sinhala: 'වචන මාලාව වැඩිදියුණු කිරීමට අමතරව, දිනපතා කියවීම අපගේ ලිවීමේ රටාව ඔප්නංවයි.',
      },
      {
        english: 'However, one must always inspect essays for spelling and punctuation errors.',
        sinhala: 'කෙසේ වෙතත්, අක්ෂර වින්‍යාසය සහ විරාම ලකුණු වැරදි සඳහා රචනා නිරන්තරයෙන් පරීක්ෂා කළ යුතුය.',
      },
      {
        english: 'Therefore, practicing structured paragraphs daily leads to rapid improvement.',
        sinhala: 'එමනිසා, දිනපතා ක්‍රමානුකූල ඡේද ලිවීම පුහුණුවීමෙන් වේගවත් ප්‍රගතියක් අත්කරගත හැක.',
      },
    ],
    notes:
      'Always proofread your text twice before finalizing. / ලියා අවසන් කළ පසු වැරදි නිවැරදි කරගැනීමට අවම වශයෙන් දෙවරක්වත් කියවා බලන්න.',
    iconName: 'PenTool',
  },
  {
    id: 'reading-card-1',
    hub: 'writing',
    category: 'reading',
    number: 2,
    title: 'Reading',
    subtitle: 'Comprehension, Skimming & Context Clues (කියවීම සහ අවබෝධය)',
    englishContent:
      'Reading comprehension is the foundation of language mastery.\n\nTwo Essential Reading Strategies:\n• Skimming: Reading rapidly across headings and topic sentences to grasp the general overview.\n• Scanning: Moving your eyes quickly through a passage searching for specific keywords, dates, or figures.\n\nContext Clues: When meeting an unknown word, read the surrounding sentences to deduce its meaning before opening a dictionary.',
    sinhalaContent:
      'ඉංග්‍රීසි භාෂා ප්‍රවීණත්වයේ ප්‍රධාන අඩිතාලම වන්නේ කියවීම සහ අවබෝධයයි (Reading Comprehension).\n\nප්‍රධාන කියවීමේ ක්‍රමවේද 2ක්:\n• Skimming: ලිපියක හෝ ඡේදයක ප්‍රධාන අදහස ඉක්මනින් වටහා ගැනීමට සිරස්තල සහ මුල් වාක්‍ය වේගයෙන් කියවා බැලීම.\n• Scanning: නිශ්චිත දිනයක්, නමක් හෝ අංකයක් සෙවීම සඳහා ලිපිය හරහා ඇස් යොමු කරමින් ඉක්මනින් තොරතුරු සෙවීම.\n\nසන්දර්භය ඇසුරෙන් අර්ථ දැක්වීම (Context Clues): නුහුරු ඉංග්‍රීසි වචනයක් හමු වූ විට, ශබ්දකෝෂය විවෘත කිරීමට පෙර එම වාක්‍යයේ අසල ඇති වචන ඇසුරෙන් එහි තේරුම අනුමාන කිරීමට උත්සාහ කරන්න.',
    examples: [
      {
        english: 'She quickly skimmed through the morning news before the staff meeting.',
        sinhala: 'කාර්යමණ්ඩල රැස්වීමට පෙර ඇය උදෑසන පුවත් ඉක්මනින් පිරික්සා බැලුවාය.',
      },
      {
        english: 'Scan the timetable carefully to find the departure time of the train.',
        sinhala: 'දුම්රිය පිටත්වන වේලාව සොයා ගැනීමට කාලසටහන හොඳින් පරීක්ෂා කරන්න.',
      },
      {
        english: 'Daily reading for 20 minutes dramatically expands active English vocabulary.',
        sinhala: 'දිනකට විනාඩි 20ක් කියවීමෙන් ඔබේ සක්‍රීය ඉංග්‍රීසි වචන මාලාව බෙහෙවින් වර්ධනය වේ.',
      },
    ],
    notes:
      'Read texts slightly above your current comfort level to build fluency. / ඔබ දන්නා මට්ටමට වඩා මදක් උසස් ලිපි කියවීමෙන් ඔබේ ඉංග්‍රීසි මට්ටම වේගයෙන් ඉහළ නංවාගත හැක.',
    iconName: 'BookOpen',
  },

  // ==========================================
  // SPOKEN / ORAL HUB CARDS
  // ==========================================
  {
    id: 'speaking-card-1',
    hub: 'spoken_oral',
    category: 'speaking',
    number: 1,
    title: 'Speaking',
    subtitle: 'Spoken Fluency, Pronunciation & Rhythm (කථන ඉංග්‍රීසි පුහුණුව)',
    englishContent:
      'Spoken English fluency is achieved through vocal confidence, not textbook perfection.\n\nTips to Speak Naturally:\n1. Focus on conveying meaning rather than pausing over small grammatical slips.\n2. Sentence Stress: In English, content words (nouns, main verbs, adjectives) receive more vocal energy and emphasis than function words.\n3. Intonation: Raise voice pitch at the end of Yes/No inquiries; lower voice pitch at the completion of informative statements.',
    sinhalaContent:
      'කථන ඉංග්‍රීසි (Spoken English) චතුර බව ළඟා කරගත හැක්කේ බිය නැති කරගෙන ශබ්ද නඟා කතා කිරීමෙනි.\n\nස්වභාවිකව කතා කිරීමට උපදෙස්:\n1. ව්‍යාකරණ වැරදි ගැන අධික ලෙස බිය නොවී, ඔබේ පණිවිඩය අනෙකාට පැහැදිලිව දීමට මුල්තැන දෙන්න.\n2. වාක්‍ය අවධාරණය (Sentence Stress): ප්‍රධාන නාම පද (Nouns), ක්‍රියා පද (Verbs) සහ විශේෂණ පද (Adjectives) වලට වැඩි බරක් දී කතා කරන්න.\n3. ස්වර රටාව (Intonation): Yes/No ප්‍රශ්න ඇසීමේදී වාක්‍යයේ අග ස්වරය මදක් ඉහළ නංවන්න; සාමාන්‍ය වාක්‍ය අවසානයේ ස්වරය පහත හෙළන්න.',
    examples: [
      {
        english: 'Could you please repeat that at a slightly slower pace?',
        sinhala: 'කරුණාකර එය මදක් සෙමින් නැවත පැවසිය හැකිද?',
      },
      {
        english: 'I feel more confident speaking English with friends every single day.',
        sinhala: 'සෑම දිනකම මිතුරන් සමඟ ඉංග්‍රීසියෙන් කතා කිරීමෙන් මට විශාල ආත්ම විශ්වාසයක් දැනේ.',
      },
      {
        english: 'Excuse me, where can I catch the bus heading to the city center?',
        sinhala: 'සමාවෙන්න, නගර මධ්‍යයට යන බස් රථයට ගොඩවිය හැක්කේ කොතැනින්ද?',
      },
    ],
    notes:
      'Record your voice reading short dialogues and compare your rhythm with native speakers. / කෙටි දෙබස් ශබ්ද නඟා කියවා පටිගත කර අසා බැලීමෙන් උච්චාරණය පහසුවෙන් නිවැරදි කරගත හැක.',
    iconName: 'Mic',
  },
  {
    id: 'listening-card-1',
    hub: 'spoken_oral',
    category: 'listening',
    number: 2,
    title: 'Listening',
    subtitle: 'Ear Training, Connected Speech & Real Audio (ශ්‍රවණය සහ වටහාගැනීම)',
    englishContent:
      'Listening is the receptive half of fluent communication.\n\nConnected Speech Phenomenon:\nIn real conversation, native speakers link words together seamlessly:\n• "Going to" becomes "gonna"\n• "Want to" becomes "wanna"\n• Consonant-to-vowel links: "an apple" sounds like "a-napple".\n\nEar Training Routine:\nListen to English audio without text first, note main themes, and replay with transcripts to identify unfamiliar expressions.',
    sinhalaContent:
      'සාර්ථක සන්නිවේදනයක අඩක්ම රඳා පවතින්නේ හොඳින් අසා වටහාගැනීම (Listening Comprehension) මතය.\n\nවචන එකට සම්බන්ධ වී ඇසීම (Connected Speech):\nස්වභාවික ඉංග්‍රීසි කතාබහේදී වචන එකට බැඳී උච්චාරණය වේ:\n• "Going to" යන්න "gonna" ලෙස ඇසේ.\n• "Want to" යන්න "wanna" ලෙස ඇසේ.\n• "An apple" යන්න "a-napple" ලෙස එකට ඇසේ.\n\nශ්‍රවණ පුහුණුවට ක්‍රමයක්:\nපළමුව උපසිරැසි නොමැතිව ශ්‍රවණය කරන්න, පසුව උපසිරැසි සහිතව නැවත අසා මඟහැරුණු වචන සටහන් කරගන්න.',
    examples: [
      {
        english: 'Did you catch what the flight announcement just mentioned?',
        sinhala: 'ගුවන් ගමන් නිවේදනයෙන් දැන් ප්‍රකාශ කළ දේ ඔබට පැහැදිලිව ඇසුණාද?',
      },
      {
        english: 'Active listening requires paying attention to tone, emotion, and pauses.',
        sinhala: 'සක්‍රීය ශ්‍රවණය සඳහා කථිකයාගේ ස්වරය, හැඟීම් සහ නැවතුම් කෙරෙහි සැලකිලිමත් විය යුතුය.',
      },
      {
        english: 'Listening to native podcasts daily trains your brain to process natural English.',
        sinhala: 'දිනපතා ඉංග්‍රීසි පොඩ්කාස්ට් ඇසීමෙන් ස්වභාවික ඉංග්‍රීසි ඉක්මනින් තේරුම් ගැනීමට මොළය හුරු වේ.',
      },
    ],
    notes:
      'Focus on the overall message first rather than getting stuck on one missed word. / එක් වචනයක් මඟහැරුණු විට නොනැවතී, සම්පූර්ණ ප්‍රකාශයේ ප්‍රධාන අදහස වටහා ගැනීමට උත්සාහ කරන්න.',
    iconName: 'Headphones',
  },

  // ==========================================
  // GRAMMAR HUB CARDS (DO, HAVE, BE)
  // ==========================================
  {
    id: 'do-1',
    hub: 'grammar',
    category: 'do',
    number: 1,
    title: 'Card 1',
    subtitle: 'Basic Usage of Do & Does (Do සහ Does භාවිතය)',
    englishContent:
      'We use "do" and "does" as auxiliary verbs in the simple present tense to form questions and negative statements.\n\n• Use "do" with subjects: I, You, We, They (and plural nouns).\n• Use "does" with subjects: He, She, It (and singular nouns).',
    sinhalaContent:
      'අපි සරල වර්තමාන කාලයේදී (Simple Present Tense) ප්‍රශ්න සහ "නැත" (Negative) යන අර්ථය දෙන වාක්‍ය සෑදීමට "do" සහ "does" උපකාරක ක්‍රියාපද ලෙස යොදාගනිමු.\n\n• "do" භාවිත කරන්නේ: I, You, We, They (සහ බහුවචන නාම පද සමඟ).\n• "does" භාවිත කරන්නේ: He, She, It (සහ ඒකවචන නාම පද සමඟ).',
    examples: [
      {
        english: 'I do my homework every afternoon.',
        sinhala: 'මම සෑම දිනකම සවස මගේ ගෙදර වැඩ කරමි.',
      },
      {
        english: 'She does not (doesn’t) drink coffee in the evening.',
        sinhala: 'ඇය සවස් කාලයේ කෝපි බොන්නේ නැත.',
      },
      {
        english: 'Do you speak English fluently?',
        sinhala: 'ඔබ චතුර ලෙස ඉංග්‍රීසි කතා කරනවාද?',
      },
      {
        english: 'Does he play cricket on weekends?',
        sinhala: 'ඔහු සති අන්තවල ක්‍රිකට් ක්‍රීඩා කරනවාද?',
      },
    ],
    notes:
      'Crucial Rule: After "does" or "doesn’t", the main verb always remains in its base form (e.g., "She doesn’t work", NOT "She doesn’t works"). / Does යෙදූ පසු ප්‍රධාන ක්‍රියාපදයට s හෝ es එකතු නොවේ.',
  },
  {
    id: 'do-2',
    hub: 'grammar',
    category: 'do',
    number: 2,
    title: 'Card 2',
    subtitle: 'Past Tense (Did) & Emphasis (Did භාවිතය සහ අවධාරණය)',
    englishContent:
      '"Did" is the simple past form of both "do" and "does". It is used for all subjects (I, You, He, She, It, We, They).\n\nIn affirmative sentences, "do/does/did" can also be used before a base verb to give strong emphasis.',
    sinhalaContent:
      '"Did" යනු "do" සහ "does" යන දෙකෙහිම අතීත කාල (Past Tense) ස්වරූපයයි. එය සියලුම කර්තෘවරුන් සඳහා (I, You, He, She, It, We, They) එකසේ භාවිත වේ.\n\nසාමාන්‍ය වාක්‍යයක යම් කරුණක් තදින් අවධාරණය කිරීමටද (Emphasis) ක්‍රියාපදයට පෙර did යෙදිය හැක.',
    examples: [
      {
        english: 'Did you finish the assignment yesterday?',
        sinhala: 'ඔබ ඊයේ පැවරුම අවසන් කළාද?',
      },
      {
        english: 'They did not (didn’t) attend the seminar.',
        sinhala: 'ඔවුන් සම්මන්ත්‍රණයට සහභාගී වූයේ නැත.',
      },
      {
        english: 'I do believe you are right! (Emphatic)',
        sinhala: 'ඔබ කියන්නේ හරි බව මම සැබවින්ම විශ්වාස කරමි!',
      },
      {
        english: 'She did tell me the truth before she left.',
        sinhala: 'ඇය පිටත්ව යාමට පෙර ඇත්තෙන්ම මට සත්‍යය පැවසුවාය.',
      },
    ],
    notes:
      'In questions with "did", the main verb reverts to base form: "Did you go?" (NOT "Did you went?"). / Did යෙදූ විට ප්‍රධාන ක්‍රියාපදය මුල් ස්වරූපයට (Base form) පත්වේ.',
  },
  {
    id: 'have-1',
    hub: 'grammar',
    category: 'have',
    number: 1,
    title: 'Card 1',
    subtitle: 'Possession & Present Perfect (Have සහ Has භාවිතය)',
    englishContent:
      'The verb "have" serves two primary roles in English:\n1. As a main verb indicating possession (ownership), relationships, or experiences.\n2. As an auxiliary verb with a past participle (V3) to form Perfect Tenses.\n\n• Present: Use "have" with I, You, We, They. Use "has" with He, She, It.\n• Past: Use "had" for all persons.',
    sinhalaContent:
      'ඉංග්‍රීසි භාෂාවේ "have" ප්‍රධාන කාර්යයන් දෙකක් ඉටු කරයි:\n1. යමක් සතු බව (Possession / අයිතිය) හෝ අත්දැකීමක් ප්‍රකාශ කිරීමට ප්‍රධාන ක්‍රියාපදයක් ලෙස.\n2. පූර්ණ කාල (Perfect Tenses) හැඟවීම සඳහා අතීත කෘදන්ත (V3) සමඟ යෙදෙන උපකාරක ක්‍රියාපදයක් ලෙස.\n\n• වර්තමාන: "have" (I, You, We, They සමඟ) සහ "has" (He, She, It සමඟ).\n• අතීත: "had" (සියලුම කර්තෘවරුන් සමඟ).',
    examples: [
      {
        english: 'I have two older sisters and a brother.',
        sinhala: 'මට වැඩිමල් සහෝදරියන් දෙදෙනෙක් සහ සහෝදරයෙක් සිටී.',
      },
      {
        english: 'He has an interesting book about world history.',
        sinhala: 'ඔහු සතුව ලෝක ඉතිහාසය පිළිබඳ රසවත් පොතක් ඇත.',
      },
      {
        english: 'We have completed our English lesson for today.',
        sinhala: 'අපි අද දිනට නියමිත ඉංග්‍රීසි පාඩම සම්පූර්ණ කර ඇත්තෙමු.',
      },
      {
        english: 'She had already left when the rain started.',
        sinhala: 'වැස්ස පටන් ගන්නා විටත් ඇය පිටත්ව ගොස් තිබුණි.',
      },
    ],
    notes:
      '"Have got" is commonly used in British spoken English for possession: "I’ve got a car." / බ්‍රිතාන්‍ය ඉංග්‍රීසි කතාබහේදී අයිතිය හැඟවීමට "Have got" බහුලව යෙදේ.',
  },
  {
    id: 'be-1',
    hub: 'grammar',
    category: 'be',
    number: 1,
    title: 'Card 1',
    subtitle: 'Present Tense (Am / Is / Are)',
    englishContent:
      'The verb "to be" describes identity, condition, state, or location.\n\n• "Am" is used exclusively with I.\n• "Is" is used with singular subjects: He, She, It.\n• "Are" is used with plural subjects and You: You, We, They.',
    sinhalaContent:
      '"Be" ක්‍රියාපදය යමෙකුගේ අනන්‍යතාවය, තත්ත්වය, ස්වභාවය හෝ සිටින ස්ථානය විස්තර කිරීමට යොදාගනී.\n\n• "Am": I සමඟ පමණක් යෙදේ.\n• "Is": ඒකවචන කර්තෘවරුන් සමඟ (He, She, It).\n• "Are": බහුවචන කර්තෘවරුන් සහ You සමඟ (You, We, They).',
    examples: [
      {
        english: 'I am excited to improve my English speaking skills.',
        sinhala: 'මගේ ඉංග්‍රීසි කථන කුසලතා දියුණු කර ගැනීමට මම ඉතා උනන්දු වෙමි.',
      },
      {
        english: 'She is a talented software engineer.',
        sinhala: 'ඇය දක්ෂ මෘදුකාංග ඉංජිනේරුවරියකි.',
      },
      {
        english: 'They are ready for the upcoming examination.',
        sinhala: 'ඔවුන් එළඹෙන විභාගය සඳහා සූදානමින් සිටිති.',
      },
    ],
    notes:
      'In present continuous, am/is/are connects to verb+ing: "She is studying." / ක්‍රියාකාරී වර්තමාන කාලයේදී am/is/are සමඟ verb+ing යෙදේ.',
  },
  {
    id: 'be-2',
    hub: 'grammar',
    category: 'be',
    number: 2,
    title: 'Card 2',
    subtitle: 'Past Tense (Was / Were)',
    englishContent:
      '"Was" and "were" are the past tense forms of "be".\n\n• Use "was" with: I, He, She, It.\n• Use "were" with: You, We, They.',
    sinhalaContent:
      '"Was" සහ "were" යනු "be" ක්‍රියාපදයේ අතීත කාල ස්වරූපයන් වේ.\n\n• "was" යෙදෙන්නේ: I, He, She, It (ඒකවචන සමඟ).\n• "were" යෙදෙන්නේ: You, We, They (බහුවචන සමඟ).',
    examples: [
      {
        english: 'I was at the library yesterday afternoon.',
        sinhala: 'මම ඊයේ සවස පුස්තකාලයේ සිටියෙමි.',
      },
      {
        english: 'We were very happy with the final test results.',
        sinhala: 'අවසාන විභාග ප්‍රතිඵල පිළිබඳව අපි ඉතා සතුටු වුණෙමු.',
      },
    ],
    notes:
      'Negatives: was not (wasn’t) and were not (weren’t). / සෘණාත්මක ආකාර: wasn’t සහ weren’t.',
  },
  {
    id: 'be-3',
    hub: 'grammar',
    category: 'be',
    number: 3,
    title: 'Card 3',
    subtitle: 'Participles (Been & Being)',
    englishContent:
      '• "Been" is the past participle used after have/has/had in perfect tenses.\n• "Being" is the present participle used in continuous passive or temporary behavior.',
    sinhalaContent:
      '• "Been" යනු have/has/had සමඟ යෙදෙන අතීත කෘදන්තයයි (Past Participle).\n• "Being" යනු තාවකාලික හැසිරීමක් හෝ අඛණ්ඩ කර්මකාරක වාක්‍යයක (Continuous Passive) යෙදෙන වර්තමාන කෘදන්තයයි.',
    examples: [
      {
        english: 'I have been to Singapore twice for conferences.',
        sinhala: 'මම සම්මන්ත්‍රණ සඳහා දෙවරක් සිංගප්පූරුවට ගොස් ඇත්තෙමි.',
      },
      {
        english: 'Why are you being so quiet today?',
        sinhala: 'ඔබ අද මෙතරම් නිශ්ශබ්දව හැසිරෙන්නේ ඇයි?',
      },
    ],
    notes:
      'Contrast: "He has been silly" (state) vs "He is being silly" (temporary act right now).',
  },
];

export function getStoredPracticeCards(
  hub?: 'writing' | 'spoken_oral' | 'grammar' | 'simple_sentence'
): PracticeSubCard[] {
  try {
    const raw = localStorage.getItem(PRACTICE_CARDS_STORAGE_KEY);
    if (!raw) {
      saveStoredPracticeCards(DEFAULT_PRACTICE_CARDS);
      return hub ? DEFAULT_PRACTICE_CARDS.filter((c) => c.hub === hub) : DEFAULT_PRACTICE_CARDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure all cards have required fields
      const valid = parsed.map((card: Partial<PracticeSubCard>) => ({
        ...card,
        examples: Array.isArray(card.examples)
          ? card.examples.map((ex: any) =>
              typeof ex === 'string' ? { english: ex, sinhala: '' } : ex
            )
          : [],
      })) as PracticeSubCard[];

      return hub ? valid.filter((c) => c.hub === hub) : valid;
    }
  } catch (err) {
    console.error('Failed to load practice cards from storage', err);
  }
  return hub ? DEFAULT_PRACTICE_CARDS.filter((c) => c.hub === hub) : DEFAULT_PRACTICE_CARDS;
}

export function saveStoredPracticeCards(cards: PracticeSubCard[]): void {
  try {
    localStorage.setItem(PRACTICE_CARDS_STORAGE_KEY, JSON.stringify(cards));
  } catch (err) {
    console.error('Failed to save practice cards to storage', err);
  }
}
