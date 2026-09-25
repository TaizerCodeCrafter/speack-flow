import {
  SkillCardData,
  ReadingLesson,
  ListeningExercise,
  SpeakingDrill,
  ConversationScenario,
  ResourceItem,
  Flashcard,
  IdiomItem,
} from '../types';

export const SKILL_CARDS: SkillCardData[] = [
  {
    id: 'reading',
    title: 'Reading Studio',
    tagline: 'Comprehension & Vocabulary',
    description:
      'Immerse in curated articles, news pieces, and stories. Click any word for phonetic pronunciation, clear definitions, and test your understanding with instant quizzes.',
    color: 'emerald',
    accentBg: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    badge: 'Core Input Skill',
    stats: [
      { label: 'Passages', value: '3 Levels' },
      { label: 'Vocab / Story', value: '15+ Words' },
      { label: 'Audio Reader', value: 'Included' },
    ],
    features: [
      'Interactive word lookup with instant definitions',
      'Sentence-by-sentence audio narration',
      'Reading speed calculator (Words Per Minute)',
      'Multiple-choice comprehension challenge',
    ],
  },
  {
    id: 'listening',
    title: 'Listening Lab',
    tagline: 'Native Accents & Audio Dictation',
    description:
      'Sharpen your ear to natural conversational tempo. Train with dialogues, speed adjustments (0.75x - 1.5x), dictation drills, and synchronized transcripts.',
    color: 'sky',
    accentBg: 'bg-sky-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
    badge: 'Auditory Mastery',
    stats: [
      { label: 'Audio Tracks', value: '4 Scenarios' },
      { label: 'Speed Control', value: '0.75x - 1.5x' },
      { label: 'Dictation', value: 'Interactive' },
    ],
    features: [
      'Paced audio with variable playback speed',
      'Synchronized transcript with reveal toggle',
      'Listening comprehension quiz questions',
      'Fill-in-the-blank dictation audio tests',
    ],
  },
  {
    id: 'speaking',
    title: 'Speaking Studio',
    tagline: 'Pronunciation & Voice Recognition',
    description:
      'Overcome hesitation by practicing aloud. Use your microphone to receive real-time pronunciation match scores, rhythm guides, and tongue-twister drills.',
    color: 'amber',
    accentBg: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    badge: 'Active Output',
    stats: [
      { label: 'Speaking Drills', value: '8 Challenges' },
      { label: 'Voice Match', value: 'Real-time' },
      { label: 'Tongue Twisters', value: 'Included' },
    ],
    features: [
      'Browser speech recognition with accuracy score',
      'Listen to model native pronunciation first',
      'Phonetic transcription and syllable stress tips',
      'Targeted phonetic tips for common pronunciation traps',
    ],
  },
  {
    id: 'conversation',
    title: 'Conversation Hub',
    tagline: 'Real-world Roleplay Scenarios',
    description:
      'Practice realistic two-way dialogues: café orders, job interviews, customer service, and casual small talk with interactive speech responses and helpful phrase suggestions.',
    color: 'indigo',
    accentBg: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    badge: 'Interactive Flow',
    stats: [
      { label: 'Scenarios', value: '4 Realistic' },
      { label: 'Turn-by-Turn', value: 'Audio Mode' },
      { label: 'Formality', value: 'Casual & Formal' },
    ],
    features: [
      'Interactive simulated conversation partner',
      'Audio read-aloud for all conversation turns',
      'Formality guides (Casual vs Formal vs Friendly)',
      'Side-by-side phrasing guides for confidence',
    ],
  },
];

export const READING_LESSONS: ReadingLesson[] = [
  {
    id: 'ceylon-tea-tech',
    title: 'How Technology is Revolutionizing Modern Tea Production',
    level: 'Intermediate',
    readTime: '3 min read',
    content:
      'For over a century, the misty hill country of Sri Lanka has been synonymous with world-class Ceylon tea. Today, an intriguing transformation is taking place across these lush emerald slopes. Traditional estate managers are collaborating with agricultural technology startups to implement precision farming methods.\n\nHigh-resolution aerial drones equipped with multispectral cameras regularly sweep over tea plantations, scanning leaf health and soil moisture levels in minutes. Artificial intelligence algorithms analyze this data to detect moisture deficiencies and early signs of leaf disease before visible harm occurs.\n\nFurthermore, modern factories in Nuwara Eliya and Hatton have begun adopting climate-controlled withering troughs and automated grading sensors. These technological enhancements preserve the delicate aroma and character of the leaves while significantly reducing human fatigue and carbon footprints. As global markets demand sustainable agricultural practices, this unique blend of heritage craftsmanship and smart innovation ensures that Ceylon tea remains vibrant on the international stage.',
    vocabulary: [
      {
        word: 'synonymous',
        phonetic: '/sɪˈnɒnɪməs/',
        meaning: 'Closely associated with or equivalent to something',
        example: 'His name is synonymous with integrity.',
      },
      {
        word: 'intriguing',
        phonetic: '/ɪnˈtriːɡɪŋ/',
        meaning: 'Arousing great curiosity or interest; fascinating',
        example: 'She presented an intriguing solution to the dilemma.',
      },
      {
        word: 'deficiencies',
        phonetic: '/dɪˈfɪʃənsiz/',
        meaning: 'A lack or shortage of something necessary',
        example: 'Soil deficiencies can severely limit harvest yields.',
      },
      {
        word: 'heritage',
        phonetic: '/ˈherɪtɪdʒ/',
        meaning: 'Valued objects and qualities passed down from past generations',
        example: 'We must protect our natural and architectural heritage.',
      },
    ],
    questions: [
      {
        id: 1,
        question: 'What is the primary role of aerial drones in modern tea plantations?',
        options: [
          'Transporting harvested leaves to the city',
          'Scanning leaf health and soil moisture levels',
          'Replacing estate managers entirely',
          'Watering the tea bushes automatically',
        ],
        correctIndex: 1,
        explanation: 'Drones equipped with multispectral cameras scan leaf health and soil moisture levels across the plantations.',
      },
      {
        id: 2,
        question: 'Which towns are mentioned as adopting modern climate-controlled withering troughs?',
        options: ['Colombo and Galle', 'Kandy and Matale', 'Nuwara Eliya and Hatton', 'Jaffna and Trincomalee'],
        correctIndex: 2,
        explanation: 'The text specifically mentions factories in Nuwara Eliya and Hatton adopting these troughs.',
      },
      {
        id: 3,
        question: 'What does this combination of heritage and technology ensure?',
        options: [
          'Ceylon tea remains vibrant on the international stage',
          'Tea prices will drop to zero',
          'All hand-picking will stop by next month',
          'No factory workers will ever be needed',
        ],
        correctIndex: 0,
        explanation: 'The conclusion states that this unique blend ensures Ceylon tea remains vibrant on the international stage.',
      },
    ],
  },
  {
    id: 'habit-loops',
    title: 'The Secret Power of Small Daily Habits',
    level: 'Beginner',
    readTime: '2 min read',
    content:
      'Many people believe that monumental success requires monumental effort. However, behavioral scientists have discovered that extraordinary results are usually the cumulative effect of tiny daily improvements.\n\nEvery habit consists of a simple three-step loop: a cue, a routine, and a reward. For example, when your morning alarm sounds (the cue), you might brew a cup of coffee (the routine), which provides warmth and alert energy (the reward).\n\nIf you want to master the English language, you do not need to study for five exhausting hours on Sunday. Instead, dedicating just fifteen focused minutes every morning to reading a short story or speaking three new phrases will yield profound transformations over time. Small actions, repeated consistently, create miraculous momentum.',
    vocabulary: [
      {
        word: 'monumental',
        phonetic: '/ˌmɒnjuˈmentl/',
        meaning: 'Great in importance, extent, or size',
        example: 'Graduating college was a monumental achievement.',
      },
      {
        word: 'cumulative',
        phonetic: '/ˈkjuːmjələtɪv/',
        meaning: 'Increasing or growing by successive additions',
        example: 'The cumulative effect of daily reading is enormous.',
      },
      {
        word: 'profound',
        phonetic: '/prəˈfaʊnd/',
        meaning: 'Very great, intense, or deeply impactful',
        example: 'The teacher made a profound impact on my confidence.',
      },
    ],
    questions: [
      {
        id: 1,
        question: 'What are the three components of a habit loop?',
        options: [
          'Desire, struggle, failure',
          'Cue, routine, reward',
          'Plan, action, forget',
          'Morning, noon, night',
        ],
        correctIndex: 1,
        explanation: 'The passage highlights cue, routine, and reward as the three parts of every habit loop.',
      },
      {
        id: 2,
        question: 'What study routine does the author recommend for learning English?',
        options: [
          'Ten continuous hours without water',
          'Five exhausting hours on Sunday',
          'Fifteen focused minutes every morning',
          'Only reading grammar textbooks once a year',
        ],
        correctIndex: 2,
        explanation: 'Dedicating just fifteen focused minutes every morning is recommended over sporadic marathons.',
      },
    ],
  },
];

export const LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: 'airport-transit',
    title: 'Navigating an International Flight Transfer',
    level: 'Intermediate',
    duration: '1:15',
    speaker: 'Airport Agent & Passenger',
    topic: 'Travel & Inquiries',
    transcript:
      "Agent: Good morning! Welcome to the transfer desk. May I please inspect your boarding pass and passport?\nPassenger: Good morning. Here you go. I just arrived on Flight 304 from Dubai, and my connecting flight to London Heathrow departs in two hours. Could you confirm which gate I should proceed to?\nAgent: Certainly, sir. Looking at our system, your flight to London, BA 158, is scheduled to depart from Gate B22. Boarding will commence at 10:45 AM, exactly forty-five minutes prior to departure.\nPassenger: Excellent. Do I need to recheck my luggage or will it be transferred automatically?\nAgent: Your baggage was checked straight through to Heathrow, so there is no need to retrieve it here. Just proceed straight through the security checkpoint on your left, and follow the overhead signs toward Terminal B.\nPassenger: Thank you so much for your assistance. Have a wonderful day!",
    questions: [
      {
        question: 'From which gate is the flight to London scheduled to depart?',
        options: ['Gate A12', 'Gate B22', 'Gate C04', 'Gate D18'],
        correctIndex: 1,
      },
      {
        question: 'What should the passenger do regarding his luggage?',
        options: [
          'Pick it up at baggage carousel 3',
          'Pay an extra excess luggage charge',
          'Nothing, it is checked straight through to London',
          'Leave it with the customer service officer',
        ],
        correctIndex: 2,
      },
      {
        question: 'What time does the boarding commence?',
        options: ['9:30 AM', '10:15 AM', '10:45 AM', '11:30 AM'],
        correctIndex: 2,
      },
    ],
    dictationSentence: 'Boarding will commence at ten forty-five, forty-five minutes prior to departure.',
  },
  {
    id: 'coffee-order',
    title: 'Ordering Artisan Coffee & Pastries',
    level: 'Beginner',
    duration: '0:50',
    speaker: 'Barista & Customer',
    topic: 'Daily Life & Dining',
    transcript:
      "Barista: Hi there! What can I get started for you today?\nCustomer: Hi! Could I please get a medium oat milk latte with just a pump of vanilla syrup?\nBarista: Sure thing. Would you like that hot or iced?\nCustomer: Hot, please. And do you have any fresh almond croissants left?\nBarista: Yes, we pulled a fresh batch out of the oven ten minutes ago! Would you like me to warm it up for you?\nCustomer: That would be delightful. That is all for today.\nBarista: That comes to six dollars and fifty cents. Tap your card right here whenever you are ready.",
    questions: [
      {
        question: 'What kind of milk did the customer order?',
        options: ['Almond milk', 'Oat milk', 'Whole dairy milk', 'Soy milk'],
        correctIndex: 1,
      },
      {
        question: 'How much was the total bill?',
        options: ['$4.50', '$5.00', '$6.50', '$8.25'],
        correctIndex: 2,
      },
    ],
    dictationSentence: 'Could I please get a medium oat milk latte with vanilla syrup?',
  },
];

export const SPEAKING_DRILLS: SpeakingDrill[] = [
  {
    id: 'drill-1',
    title: 'Professional Self-Introduction',
    category: 'Workplace',
    targetSentence: 'Good afternoon. It is a genuine pleasure to meet you, and I look forward to our discussion.',
    phoneticGuide: '/ɡʊd ˌɑːftəˈnuːn. ɪt ɪz ə ˈdʒenjuɪn ˈpleʒər tuː miːt juː/',
    tip: 'Pronounce "genuine" clearly as /dʒenjuɪn/ (three syllables) and maintain a soft ending on "pleasure" /pleʒər/.',
    keyWords: ['genuine', 'pleasure', 'discussion'],
    audioSpeed: 1.0,
  },
  {
    id: 'drill-2',
    title: 'Tongue Twister: Crisp Consonants',
    category: 'Tongue Twister',
    targetSentence: 'She sells sea shells by the sunny sea shore in Sri Lanka.',
    phoneticGuide: '/ʃiː sɛlz siː ʃɛlz baɪ ðə ˈsʌni siː ʃɔːr/',
    tip: 'Distinguish clearly between the "sh" /ʃ/ and "s" /s/ sounds. Keep your tongue behind your top front teeth for "sells".',
    keyWords: ['sells', 'shells', 'shore'],
    audioSpeed: 0.9,
  },
  {
    id: 'drill-3',
    title: 'Polite Negotiation & Disagreement',
    category: 'Daily Phrases',
    targetSentence: 'I see your point clearly, but perhaps we could consider an alternative perspective.',
    phoneticGuide: '/aɪ siː jɔː pɔɪnt ˈklɪəli bʌt pəˈhæps wiː kʊd kənˈsɪdər/',
    tip: 'Use a gentle rising tone on "clearly" and soften your delivery on "perhaps" to convey courtesy and diplomacy.',
    keyWords: ['clearly', 'perhaps', 'alternative', 'perspective'],
    audioSpeed: 1.0,
  },
  {
    id: 'drill-4',
    title: 'Vowel Clarity & Rhythm',
    category: 'Pronunciation',
    targetSentence: 'Consistency and clear communication will open countless doors for your career.',
    phoneticGuide: '/kənˈsɪstənsi ænd klɪər kəˌmjuːnɪˈkeɪʃən wɪl ˈoʊpən ˈkaʊntləs dɔːrz/',
    tip: 'Place the primary stress on the fourth syllable of "communication" (kə-mju-nɪ-KEY-shən) with steady rhythm.',
    keyWords: ['consistency', 'communication', 'countless'],
    audioSpeed: 0.95,
  },
];

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [
  {
    id: 'job-interview',
    title: 'Job Interview: Opening & Experience',
    description: 'Practice answering common opening questions with poise and confidence.',
    partnerName: 'Sarah Jenkins',
    partnerRole: 'Senior Hiring Manager',
    level: 'Intermediate',
    turns: [
      {
        aiPrompt:
          "Welcome to our office! Thank you for taking the time to speak with us today. Could you start by introducing yourself and highlighting your core strengths?",
        suggestedResponses: [
          {
            text: "Thank you for having me. I have three years of experience in project coordination, and my key strengths are proactive communication and problem-solving.",
            formality: 'Formal',
          },
          {
            text: "It is an honor to be here. I am an adaptable team player with a strong background in customer service and data organization.",
            formality: 'Friendly',
          },
        ],
      },
      {
        aiPrompt:
          "That is very impressive! How do you typically handle sudden deadlines or unexpected roadblocks in your team?",
        suggestedResponses: [
          {
            text: "I prioritize tasks methodically, communicate clearly with my colleagues, and focus immediately on actionable solutions rather than panicking.",
            formality: 'Formal',
          },
          {
            text: "I always stay calm, break the big problem into smaller achievable milestones, and keep the team updated throughout.",
            formality: 'Casual',
          },
        ],
      },
      {
        aiPrompt:
          "Wonderful answer. Finally, what motivates you to join our specific organization at this stage of your career?",
        suggestedResponses: [
          {
            text: "Your company is known for innovation and collaborative culture, and I am excited to contribute my skills while continuously growing professionally.",
            formality: 'Formal',
          },
        ],
      },
    ],
  },
  {
    id: 'colombo-cafe',
    title: 'Meeting a Friend at a Café',
    description: 'Casual, friendly English conversation catching up on weekend plans.',
    partnerName: 'Dilshan',
    partnerRole: 'College Friend',
    level: 'Beginner',
    turns: [
      {
        aiPrompt:
          "Hey mate! Long time no see! It has been ages since we caught up. How have you been holding up with work lately?",
        suggestedResponses: [
          {
            text: "Hey Dilshan! Great to see you! Work has been quite busy, but I am really glad we finally found time to hang out today.",
            formality: 'Casual',
          },
          {
            text: "Everything is going well! Just wrapping up a major project this week. Have you ordered anything to drink yet?",
            formality: 'Friendly',
          },
        ],
      },
      {
        aiPrompt:
          "Not yet, I was waiting for you! I hear their passion fruit iced tea is incredible. Are you hungry or just looking for a quick caffeine boost?",
        suggestedResponses: [
          {
            text: "That iced tea sounds refreshing! Let's get that along with a chicken puff to share.",
            formality: 'Casual',
          },
        ],
      },
    ],
  },
];

export const RESOURCES_LIST: ResourceItem[] = [
  {
    id: 'res-tenses',
    title: 'The Master Cheat Sheet: All 12 English Tenses',
    category: 'grammar',
    level: 'All Levels',
    summary:
      'A crystal-clear guide explaining Simple, Continuous, Perfect, and Perfect Continuous tenses with formulas and real-life examples.',
    content: [
      'Present Simple: Subject + Verb(s/es) | "I write daily." (Habits, routines, and universal truths)',
      'Present Continuous: Subject + am/is/are + V-ing | "She is speaking now." (Actions happening right now)',
      'Present Perfect: Subject + have/has + Past Participle | "They have finished the work." (Past actions linked to present)',
      'Past Simple: Subject + V2 | "We visited Galle yesterday." (Actions completed at a definite past time)',
      'Future Simple: Subject + will + V1 | "He will call you tomorrow." (Predictions, instant decisions, and promises)',
    ],
    tags: ['Grammar', 'Tenses', 'Core Rules', 'Exam Essential'],
    downloadable: true,
  },
  {
    id: 'res-prepositions',
    title: 'Prepositions of Time & Place (In, On, At Made Simple)',
    category: 'grammar',
    level: 'Beginner',
    summary:
      'Never confuse "at night", "in July", or "on Monday" again. Use the inverted triangle rule for time and location.',
    content: [
      'AT: Specific pinpoint times & exact locations (at 5:00 PM, at the bus stop, at night).',
      'ON: Days, dates, and flat surfaces (on Monday, on 14th April, on the table, on the bus).',
      'IN: Enclosed spaces, months, years, long periods (in Sri Lanka, in 2026, in December, in the car).',
      'Common Mistake: Say "arrive AT the airport" (not arrive to).',
    ],
    tags: ['Prepositions', 'Common Pitfalls', 'Quick Rules'],
    downloadable: true,
  },
  {
    id: 'res-colloquial-vs-standard',
    title: 'Regional Expressions vs International Standard English',
    category: 'cheat-sheets',
    level: 'Intermediate',
    summary:
      'Boost your global fluency by discovering how local colloquialisms map into standard international business English.',
    content: [
      'Colloquial: "I will drop you" -> Standard: "I will give you a ride" or "I can drop you off".',
      'Colloquial: "Pass out from university" -> Standard: "Graduate from university".',
      'Colloquial: "What is your good name?" -> Standard: "May I have your name, please?"',
      'Colloquial: "He is having two cars" -> Standard: "He has two cars" (stative verbs don’t take -ing).',
      'Colloquial: "Can you put a call?" -> Standard: "Could you give me a call?"',
    ],
    tags: ['Fluency', 'Professional', 'Clear Phrasing'],
    downloadable: true,
  },
  {
    id: 'res-phrasal-verbs',
    title: '50 Most Powerful Phrasal Verbs for Everyday Fluency',
    category: 'idioms',
    level: 'Intermediate',
    summary:
      'Native speakers constantly rely on phrasal verbs. Master look forward to, run into, figure out, call off, and carry on.',
    content: [
      'Look forward to: Anticipate with pleasure ("I look forward to hearing from you").',
      'Run into: Meet someone unexpectedly ("I ran into Kasun at the supermarket").',
      'Figure out: Understand or solve a problem ("We finally figured out the code bug").',
      'Call off: Cancel an event ("The match was called off due to heavy rain").',
      'Bring up: Mention a topic in conversation ("She brought up an interesting point").',
    ],
    tags: ['Phrasal Verbs', 'Speaking Boost', 'Conversations'],
    downloadable: true,
  },
];

export const FLASHCARDS_LIST: Flashcard[] = [
  {
    id: 'fc-1',
    word: 'Articulate',
    partOfSpeech: 'Adjective / Verb',
    phonetic: '/ɑːˈtɪkjʊlət/',
    definition: 'Expressing ideas clearly and effectively in speech or writing.',
    example: 'She gave an articulate presentation to the board of directors.',
    category: 'Professional',
  },
  {
    id: 'fc-2',
    word: 'Resilient',
    partOfSpeech: 'Adjective',
    phonetic: '/rɪˈzɪliənt/',
    definition: 'Able to recover quickly from difficult conditions or setbacks.',
    example: 'Communities proved exceptionally resilient during adversity.',
    category: 'Personality',
  },
  {
    id: 'fc-3',
    word: 'Pragmatic',
    partOfSpeech: 'Adjective',
    phonetic: '/præɡˈmætɪk/',
    definition: 'Dealing with things sensibly and realistically rather than theoretically.',
    example: 'We need a pragmatic approach to tackle budget constraints.',
    category: 'Business',
  },
  {
    id: 'fc-4',
    word: 'Meticulous',
    partOfSpeech: 'Adjective',
    phonetic: '/məˈtɪkjələs/',
    definition: 'Showing great attention to detail; very careful and precise.',
    example: 'The architect was meticulous about the building measurements.',
    category: 'Academic',
  },
  {
    id: 'fc-5',
    word: 'Spontaneous',
    partOfSpeech: 'Adjective',
    phonetic: '/spɒnˈteɪniəs/',
    definition: 'Happening as a result of a sudden impulse without prior planning.',
    example: 'We decided to take a spontaneous road trip to Nuwara Eliya.',
    category: 'Daily Life',
  },
];

export const IDIOMS_LIST: IdiomItem[] = [
  {
    id: 'id-1',
    idiom: 'Once in a blue moon',
    meaning: 'Very rarely; almost never.',
    example: 'Since moving to Kandy, I visit Colombo only once in a blue moon.',
  },
  {
    id: 'id-2',
    idiom: 'Bite the bullet',
    meaning: 'Decide to do something difficult that you have been hesitating to do.',
    example: 'I hated public speaking, but I bit the bullet and delivered the keynote.',
  },
  {
    id: 'id-3',
    idiom: 'Hit the nail on the head',
    meaning: 'Describe exactly what is causing a situation or problem.',
    example: 'When she mentioned lack of sleep, she hit the nail on the head.',
  },
  {
    id: 'id-4',
    idiom: 'A blessing in disguise',
    meaning: 'A misfortune that unexpectedly results in something good later.',
    example: 'Missing that delayed train turned out to be a blessing in disguise.',
  },
];
