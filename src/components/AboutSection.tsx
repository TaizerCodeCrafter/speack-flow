import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Headphones,
  Mic,
  MessageSquare,
  Clock,
  Target,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { SkillType } from '../types';

interface AboutSectionProps {
  onSelectSkill: (skill: SkillType) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onSelectSkill,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Quick Level Self-Checker State
  const [q1, setQ1] = useState<string>('');
  const [q2, setQ2] = useState<string>('');
  const [recommendation, setRecommendation] = useState<{
    level: string;
    suggestedPillar: SkillType;
    tip: string;
  } | null>(null);

  const calculateLevelCheck = () => {
    if (!q1 || !q2) return;

    if (q1 === 'nervous' || q2 === 'beginner') {
      setRecommendation({
        level: 'Foundation / Elementary (A1-A2)',
        suggestedPillar: 'speaking',
        tip: 'Begin with daily Speaking Drills & Tongue Twisters to loosen vocal cords and build tongue confidence without stress.',
      });
    } else if (q1 === 'understand_cant_speak') {
      setRecommendation({
        level: 'Intermediate Transition (B1-B2)',
        suggestedPillar: 'conversation',
        tip: 'You have good input comprehension! Your biggest unlock will come from active Conversation Hub roleplays where you formulate spontaneous sentences.',
      });
    } else {
      setRecommendation({
        level: 'Fluent / Advanced (B2-C1)',
        suggestedPillar: 'reading',
        tip: 'Focus on high-level Reading Studio articles and Listening to refine your nuanced vocabulary, idioms, and natural rhythm.',
      });
    }
  };

  const faqs = [
    {
      q: 'Why does SpeakFlow combine Reading, Listening, Speaking, and Conversation together?',
      a: 'Language acquisition follows the Input-Output principle. Reading and Listening provide vocabulary and grammar structures (Input). Speaking and Conversation train your brain and vocal muscles to produce natural phrases spontaneously (Output). Without balanced output, passive knowledge never turns into fluent speech.',
    },
    {
      q: 'How does the microphone voice recognition check my pronunciation?',
      a: 'Using your browser’s built-in Web Speech API, SpeakFlow compares your spoken words against the target phonetic sentence. It calculates accuracy percentage, highlights missing or mispronounced words, and lets you listen to model pronunciation.',
    },
    {
      q: 'How many minutes per day should I spend practicing?',
      a: 'Consistency beats intensity. Spending just 15 to 20 focused minutes daily—5 minutes of reading, 5 minutes of listening, 5 minutes of speaking aloud—produces faster and more enduring results than sporadic weekend marathons.',
    },
    {
      q: 'Is this suitable for both academic and workplace goals?',
      a: 'Yes! SpeakFlow is intentionally designed with real-life vocabulary, workplace interview dialogues, and idiomatic phrases to help you transition into confident international standard English.',
    },
  ];

  return (
    <section id="about" className="py-14 sm:py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-white/90 text-slate-700 text-xs font-bold mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>The Immersion Philosophy</span>
          </div>
          <h2 className="text-2.5xl sm:text-4xl font-black text-slate-900 tracking-tight">
            About SpeakFlow
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Designed to help learners bridge the gap between understanding English and speaking it fluently with genuine confidence.
          </p>
        </div>

        {/* 4 Pillars Immersion Matrix - Frosted Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16">
          {/* Input Block */}
          <div className="backdrop-blur-xl bg-white/75 rounded-3xl border border-white/80 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(16,185,129,0.06)] transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 backdrop-blur-md">
                Phase 1: Active Input (50%)
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Absorb Structure, Rhythm & Vocabulary
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Your subconscious mind needs rich, context-driven linguistic patterns before it can synthesize original thoughts.
            </p>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-white/70 border border-white/90 backdrop-blur-sm shadow-2xs flex items-start gap-3.5 hover:bg-white transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Reading Studio
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Builds deep vocabulary retention, grammar intuition, and rapid comprehension without rote memorization.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 border border-white/90 backdrop-blur-sm shadow-2xs flex items-start gap-3.5 hover:bg-white transition-colors">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-700 flex items-center justify-center shrink-0 border border-sky-500/20">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Listening Lab
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Tunes your ear to native tempo, connected speech, elisions, and natural dialogue cadence with speed controls.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Output Block */}
          <div className="backdrop-blur-xl bg-white/75 rounded-3xl border border-white/80 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(245,158,11,0.06)] transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 backdrop-blur-md">
                Phase 2: Active Output (50%)
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Vocal Clarity & Spontaneous Confidence
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Speaking is a physical muscle reflex. Regular spoken production eliminates mental hesitation and builds real fluency.
            </p>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-white/70 border border-white/90 backdrop-blur-sm shadow-2xs flex items-start gap-3.5 hover:bg-white transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Speaking Studio
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Trains your tongue, lips, and breath control using voice recognition scoring and targeted pronunciation drills.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 border border-white/90 backdrop-blur-sm shadow-2xs flex items-start gap-3.5 hover:bg-white transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Conversation Hub
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Simulates everyday social, workplace, and travel dialogues with instant audio partner replies and tone guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The 20-Minute Daily Routine Guide in Glass Container */}
        <div className="backdrop-blur-xl bg-white/75 p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-slate-200/50">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  The 20-Minute Daily High-Impact Routine
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                A structured micro-learning schedule that fits smoothly into your daily commute or morning coffee.
              </p>
            </div>
            <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 bg-indigo-500/10 text-indigo-800 rounded-full border border-indigo-500/20 backdrop-blur-md">
              Optimal Habit
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl backdrop-blur-md bg-emerald-500/5 border border-emerald-500/15">
              <div className="flex items-center justify-between text-xs font-extrabold text-emerald-800 mb-1.5">
                <span>01. Read</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px]">5 Mins</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Read 1 short passage in Reading Studio. Click 3 new words and save their definitions.
              </p>
            </div>

            <div className="p-4 rounded-2xl backdrop-blur-md bg-sky-500/5 border border-sky-500/15">
              <div className="flex items-center justify-between text-xs font-extrabold text-sky-800 mb-1.5">
                <span>02. Listen</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 text-[10px]">5 Mins</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Play 1 audio track at 1.0x speed. Complete the dictation sentence exercise.
              </p>
            </div>

            <div className="p-4 rounded-2xl backdrop-blur-md bg-amber-500/5 border border-amber-500/15">
              <div className="flex items-center justify-between text-xs font-extrabold text-amber-800 mb-1.5">
                <span>03. Speak</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px]">5 Mins</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Record yourself speaking 2 sentences into the microphone until you reach 85%+ accuracy.
              </p>
            </div>

            <div className="p-4 rounded-2xl backdrop-blur-md bg-indigo-500/5 border border-indigo-500/15">
              <div className="flex items-center justify-between text-xs font-extrabold text-indigo-800 mb-1.5">
                <span>04. Converse</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[10px]">5 Mins</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Complete 1 realistic dialogue scenario in Conversation Hub picking formal & casual replies.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Language Level Self-Assessment Widget in Glass Card */}
        <div className="backdrop-blur-xl bg-white/75 p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] mb-16">
          <div className="max-w-2xl mx-auto text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold mb-2 shadow-2xs">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              <span>Interactive Level Checker</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Where Should You Start Today?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select your current experience to receive a customized recommendation.
            </p>
          </div>

          <div className="max-w-xl mx-auto space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                1. How do you feel when you need to speak English in public or at work?
              </label>
              <select
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                className="w-full p-3 bg-white/90 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-xs"
              >
                <option value="">Select an option...</option>
                <option value="nervous">I feel shy, nervous, or worry about making grammar mistakes</option>
                <option value="understand_cant_speak">I understand almost everything I hear, but words don't come out when speaking</option>
                <option value="confident">I can speak reasonably well, but want to sound more professional and natural</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                2. What is your primary learning goal?
              </label>
              <select
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                className="w-full p-3 bg-white/90 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-xs"
              >
                <option value="">Select an option...</option>
                <option value="beginner">Building foundational vocabulary and clear pronunciation</option>
                <option value="conversations">Fluent everyday conversations and job interviews</option>
                <option value="professional">Advanced business presentations and global communication</option>
              </select>
            </div>

            <button
              onClick={calculateLevelCheck}
              disabled={!q1 || !q2}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 disabled:opacity-40 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md active:scale-[0.99]"
            >
              Generate Recommendation
            </button>

            {recommendation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-3xl backdrop-blur-xl bg-white border border-indigo-200 shadow-md space-y-3 mt-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Recommended Starting Point
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200">
                    {recommendation.level}
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-800 leading-relaxed">
                  {recommendation.tip}
                </p>

                <button
                  onClick={() => onSelectSkill(recommendation.suggestedPillar)}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <span>Launch Recommended {recommendation.suggestedPillar.toUpperCase()} Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Frequently Asked Questions (FAQ) in Glass Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Common questions on language acquisition and how to get the most out of SpeakFlow.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <div
                  key={index}
                  className="border border-white/80 backdrop-blur-xl bg-white/75 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/60 transition-colors"
                  >
                    <div>
                      <span className="text-sm sm:text-base font-bold text-slate-900 block">
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-slate-900' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
