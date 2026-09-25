import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  BookOpen,
  PenTool,
  Globe,
  Zap,
  Trophy,
  ShieldCheck,
  Flame,
  MessageSquareQuote,
  Check,
  RefreshCw,
  Award,
  Play,
  Heart,
  ChevronRight,
  GraduationCap,
  Sparkle,
  Layers,
  ArrowUpRight,
  Clock,
  Laptop,
  Smile,
} from 'lucide-react';
import { SkillType } from '../types';

interface GuestLandingPageProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onPreviewSkill?: (skill: SkillType) => void;
}

interface QuoteItem {
  quote: string;
  author: string;
  sinhala: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
  glowColor: string;
  gradient: string;
}

const INSPIRING_QUOTES: QuoteItem[] = [
  {
    quote: "The limits of my language mean the limits of my world.",
    author: "Ludwig Wittgenstein",
    sinhala: "මාගේ භාෂාවේ සීමාව යනු මාගේ මුළු ලෝකයේම සීමාවයි.",
    accent: "from-indigo-600 via-purple-600 to-pink-500",
    badgeBg: "bg-indigo-50 border-indigo-200 text-indigo-700",
    badgeText: "Wisdom of Thought",
    glowColor: "rgba(99, 102, 241, 0.15)",
    gradient: "from-indigo-500/10 via-purple-500/5 to-transparent",
  },
  {
    quote: "Speak with confidence, write with elegance, listen with deep understanding.",
    author: "Fluency Creed",
    sinhala: "විශ්වාසයෙන් කතා කරන්න, අලංකාරව ලියන්න, ගැඹුරු අවබෝධයෙන් යුතුව සවන් දෙන්න.",
    accent: "from-emerald-600 via-teal-600 to-cyan-500",
    badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
    badgeText: "Core Fluency",
    glowColor: "rgba(16, 185, 129, 0.15)",
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
  },
  {
    quote: "A different language is a different vision of life.",
    author: "Federico Fellini",
    sinhala: "වෙනත් භාෂාවක් ප්‍රගුණ කිරීම යනු ජීවිතය දෙස බලන වෙනස්ම අපූර්ව දෘෂ්ටියකි.",
    accent: "from-rose-500 via-pink-600 to-amber-500",
    badgeBg: "bg-rose-50 border-rose-200 text-rose-700",
    badgeText: "Vision & Growth",
    glowColor: "rgba(244, 63, 94, 0.15)",
    gradient: "from-rose-500/10 via-pink-500/5 to-transparent",
  },
  {
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    sinhala: "ආරම්භ කිරීමට ඔබ ශ්‍රේෂ්ඨ විය යුතු නැත, නමුත් ශ්‍රේෂ්ඨ වීමට ඔබ ආරම්භ කළ යුතුමය.",
    accent: "from-amber-500 via-orange-500 to-yellow-500",
    badgeBg: "bg-amber-50 border-amber-200 text-amber-800",
    badgeText: "Daily Motivation",
    glowColor: "rgba(245, 158, 11, 0.15)",
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
  },
  {
    quote: "One language sets you in a corridor for life. Two languages open every door along the way.",
    author: "Frank Smith",
    sinhala: "එක් භාෂාවක් ඔබව එක් මාවතකට සීමා කරයි. දෙවන භාෂාවක් එම මාවතේ සියලු දොරටු විවර කරයි.",
    accent: "from-sky-500 via-blue-600 to-indigo-600",
    badgeBg: "bg-sky-50 border-sky-200 text-sky-700",
    badgeText: "Global Opportunity",
    glowColor: "rgba(14, 165, 233, 0.15)",
    gradient: "from-sky-500/10 via-blue-500/5 to-transparent",
  },
  {
    quote: "Fluency is not about perfection. It is about the courage to connect your thoughts.",
    author: "Active English Mastery",
    sinhala: "ඉංග්‍රීසි චතුර බව යනු වැරදි නොමැතිකම නොවේ. ඔබේ සිතුවිලි බිය නැතිව අන් අයට සන්නිවේදනය කිරීමයි.",
    accent: "from-violet-600 via-fuchsia-600 to-pink-500",
    badgeBg: "bg-purple-50 border-purple-200 text-purple-700",
    badgeText: "Mindset Shift",
    glowColor: "rgba(168, 85, 247, 0.15)",
    gradient: "from-purple-500/10 via-fuchsia-500/5 to-transparent",
  },
];

const COURSE_PILLARS = [
  {
    id: 'writing',
    title: 'Writing Masterclass',
    sinhalaTitle: 'නිවැරදි ලිඛිත ඉංග්‍රීසි කලාව',
    tag: 'Academic & Professional',
    color: 'emerald',
    icon: PenTool,
    accentBorder: 'border-emerald-300 hover:border-emerald-500',
    bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-500 text-white shadow-emerald-500/30',
    description:
      'ලිපි, රචනා, නිල ඊමේල් (Formal Emails), වාර්තා (Reports) සහ රැකියා අයදුම්පත් (CVs) ව්‍යාකරණ දෝෂ නොමැතිව ජාත්‍යන්තර ප්‍රමිතියෙන් ලිවීමේ පියවරෙන් පියවර මඟපෙන්වීම.',
    points: [
      'Advanced sentence structuring & formal tone',
      'Essay & Paragraph architecture',
      'Punctuation & capitalization mastery',
      'Instant Sinhala explanation with live examples',
    ],
  },
  {
    id: 'spoken_oral',
    title: 'Spoken Fluency & Oral Practice',
    sinhalaTitle: 'බිය නැතිව කතා කරන වාචික ඉංග්‍රීසි',
    tag: 'Active Speech Lab',
    color: 'purple',
    icon: Globe,
    accentBorder: 'border-purple-300 hover:border-purple-500',
    bgGradient: 'from-purple-500/10 via-indigo-500/5 to-transparent',
    iconBg: 'bg-purple-600 text-white shadow-purple-500/30',
    description:
      'පැකිලීමකින් තොරව (without hesitation) ඕනෑම අවස්ථාවක ආත්මවිශ්වාසයෙන් ඉංග්‍රීසි කතා කිරීම. Daily conversation patterns සහ pronunciation hacks.',
    points: [
      'Real-world conversational templates',
      'Interview & presentation confidence',
      'Overcoming hesitation & mother tongue influence',
      'Audio & rhythm practice scenarios',
    ],
  },
  {
    id: 'grammar',
    title: 'Grammar Architect & Rules',
    sinhalaTitle: 'පැහැදිලි ව්‍යාකරණ රීති සහ සූත්‍ර',
    tag: 'Rock Solid Foundation',
    color: 'amber',
    icon: Sparkles,
    accentBorder: 'border-amber-300 hover:border-amber-500',
    bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-500 text-white shadow-amber-500/30',
    description:
      'කටපාඩම් කිරීමෙන් තොරව, නිවැරදි තර්කානුකූල රටා ඔස්සේ ඉංග්‍රීසි ව්‍යාකරණ (All 12 Tenses, Active/Passive Voice, Prepositions) ඉතා සරලව මනසට කා වැද්දවීම.',
    points: [
      'All 12 Tenses made crystal clear',
      'Active & Passive voice simplified',
      'Prepositions & connectors in daily speech',
      'Interactive quiz tests with immediate feedback',
    ],
  },
  {
    id: 'simple_sentence',
    title: 'Sentence Construction Engine',
    sinhalaTitle: 'සරල වාක්‍යයේ සිට සංකීර්ණ වාක්‍ය දක්වා',
    tag: 'Formula & Building Blocks',
    color: 'sky',
    icon: BookOpen,
    accentBorder: 'border-sky-300 hover:border-sky-500',
    bgGradient: 'from-sky-500/10 via-cyan-500/5 to-transparent',
    iconBg: 'bg-sky-500 text-white shadow-sky-500/30',
    description:
      'Subject + Verb + Object මූලික ආකෘතියේ සිට අලංකාර සංයුක්ත (Compound & Complex) වාක්‍ය සැකසීම දක්වා ප්‍රායෝගික පුහුණුව.',
    points: [
      '100+ daily sentence patterns & formulas',
      'Question framing (Wh- & Helping questions)',
      'Sentence expansion strategies',
      'Bilingual Sinhala to English drills',
    ],
  },
  {
    id: 'essential_verbs',
    title: '1000+ Essential Verbs & Vocabulary',
    sinhalaTitle: 'අත්‍යවශ්‍ය ක්‍රියාපද සහ වචන කෝෂය',
    tag: 'Daily Verbs (V1, V2, V3)',
    color: 'rose',
    icon: Zap,
    accentBorder: 'border-rose-300 hover:border-rose-500',
    bgGradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    iconBg: 'bg-rose-500 text-white shadow-rose-500/30',
    description:
      'දිනපතා භාවිත වන අත්‍යවශ්‍යම ක්‍රියාපද (Present, Past, Past Participle - V1, V2, V3) ඒවායේ නිවැරදි සිංහල තේරුම සහ නිදසුන් වාක්‍ය සමඟ.',
    points: [
      'Irregular & Regular verbs grouped smartly',
      'V1, V2, V3 audio & usage examples',
      'Phrasal verbs for natural speaking',
      'Flashcards for rapid recall & memory',
    ],
  },
];

export const GuestLandingPage: React.FC<GuestLandingPageProps> = ({
  onOpenAuth,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [selectedPillar, setSelectedPillar] = useState(COURSE_PILLARS[0]);

  const activeQuote = INSPIRING_QUOTES[quoteIndex];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % INSPIRING_QUOTES.length);
  };

  return (
    <div className="w-full overflow-hidden">
      {/* ================================================================= */}
      {/* HERO SECTION: Glowing, Vibrant & Engaging Welcome                 */}
      {/* ================================================================= */}
      <section className="relative pt-6 pb-14 sm:pt-12 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Floating Animated Badges in Background */}
        <div className="absolute top-10 left-10 pointer-events-none opacity-40 blur-[1px] hidden lg:block animate-bounce duration-1000">
          <div className="px-3.5 py-1.5 rounded-2xl bg-indigo-500/10 border border-indigo-300/40 text-indigo-700 font-bold text-xs backdrop-blur-md shadow-sm">
            ✨ Think in English
          </div>
        </div>
        <div className="absolute top-20 right-14 pointer-events-none opacity-40 blur-[1px] hidden lg:block animate-pulse">
          <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-300/40 text-emerald-700 font-bold text-xs backdrop-blur-md shadow-sm">
            🎯 Zero Hesitation
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto">
          {/* Top Pill Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-indigo-100 shadow-xs text-indigo-700 text-[11px] sm:text-xs font-black mb-4 sm:mb-6 tracking-wide uppercase max-w-[95%] mx-auto"
          >
            <Sparkle className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
            <span className="whitespace-nowrap">
              <span className="hidden sm:inline">SpeakFlow </span>Active English Course 2026
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 hidden min-[440px]:inline-block" />
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full text-[10px] font-bold lowercase shrink-0 whitespace-nowrap">
              students only
            </span>
          </motion.div>

          {/* Main Hero Headline with Vibrant Gradient Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]"
          >
            Master Real English.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent underline decoration-amber-400/60 decoration-wavy decoration-2">
              Speak &amp; Write
            </span>{' '}
            with Total Freedom!
          </motion.h1>

          {/* Sinhala Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-700 font-semibold max-w-2xl mx-auto leading-relaxed"
          >
            ඉංග්‍රීසි කතා කිරීමට සහ ලිවීමට ඇති බිය නැති කර, නිවැරදි සිංහල පැහැදිලි කිරීම් සමඟින් 
            පියවරෙන් පියවර චතුර ලෙස ඉංග්‍රීසි ප්‍රගුණ කරන ශ්‍රී ලංකාවේ අංක 1 ක්‍රමවේදය.
          </motion.p>

          {/* Key Quick Benefit Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-slate-600"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Sinhala Explanations</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 border border-purple-200 text-purple-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Interactive Practice Cards</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Level &amp; XP Progression</span>
            </span>
          </motion.div>

          {/* Primary Call To Actions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto"
          >
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-[0_10px_25px_rgba(16,185,129,0.35)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.45)] hover:scale-[1.02] active:scale-98 transition-all cursor-pointer group"
            >
              <GraduationCap className="w-5 h-5 text-emerald-200 group-hover:rotate-6 transition-transform" />
              <span>Register to Access Cards (නොමිලේ එක්වන්න)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm border border-slate-200/90 shadow-sm hover:shadow transition-all cursor-pointer active:scale-98"
            >
              <span>Log In (ඇතුල් වන්න)</span>
            </button>
          </motion.div>

          <p className="mt-3 text-[11px] font-semibold text-slate-500">
            🔒 Course cards &amp; practice studios are exclusively unlocked for registered students.
          </p>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 1: INSPIRING ENGLISH QUOTES CAROUSEL & WISDOM HUB         */}
      {/* Animated side-in on scroll with vibrant colors & Sinhala meaning */}
      {/* ================================================================= */}
      <section className="py-10 sm:py-16 bg-gradient-to-b from-transparent via-indigo-50/40 to-transparent relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header sliding from Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-100 text-purple-800 text-[11px] font-black uppercase tracking-wider mb-2">
                <MessageSquareQuote className="w-3.5 h-3.5 text-purple-600" />
                <span>Daily Wisdom &amp; Beautiful Quotes (අපූර්ව ඉංග්‍රීසි වදන්)</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Words that <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Empower</span> Your Mind
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                භාෂාවක් ඉගෙන ගැනීමට අවශ්‍ය විශාලතම සාධකය වන්නේ මනසේ ඇතිවන ආත්මවිශ්වාසයයි.
              </p>
            </div>

            <button
              onClick={handleNextQuote}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0 group active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600 group-hover:rotate-180 transition-transform duration-500" />
              <span>Next Quote (තවත් වදනක්)</span>
            </button>
          </motion.div>

          {/* Active Featured Quote Box with Glassmorphism & Colorful Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl p-6 sm:p-10 bg-white/90 backdrop-blur-2xl border border-slate-200/90 shadow-xl overflow-hidden mb-8"
          >
            {/* Ambient Background Glow */}
            <div
              className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-700"
              style={{ backgroundColor: activeQuote.glowColor }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45 }}
                className="relative z-10 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${activeQuote.badgeBg}`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{activeQuote.badgeText}</span>
                  </span>

                  <span className="text-xs font-mono font-bold text-slate-600">
                    Quote {quoteIndex + 1} of {INSPIRING_QUOTES.length}
                  </span>
                </div>

                {/* English Quote */}
                <blockquote className="text-xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight italic">
                  &ldquo;{activeQuote.quote}&rdquo;
                </blockquote>

                {/* Sinhala Translation */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5">
                    සිංහල අර්ථය (Sinhala Meaning):
                  </p>
                  <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
                    {activeQuote.sinhala}
                  </p>
                </div>

                {/* Author & Accent Bar */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-10 rounded-full bg-gradient-to-r ${activeQuote.accent}`} />
                    <span className="font-black text-xs sm:text-sm text-slate-700 tracking-wide">
                      — {activeQuote.author}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenAuth('register')}
                    className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer group"
                  >
                    <span>Start Practicing Today</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Grid of Other Colorful Mini Quotes (Slides from Right on Scroll) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {INSPIRING_QUOTES.slice(0, 3).map((q, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${q.accent}`} />
                    <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider">
                      {q.author}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    &ldquo;{q.quote}&rdquo;
                  </p>
                </div>
                <p className="text-[11px] font-semibold text-slate-700 mt-2.5 pt-2 border-t border-slate-100 line-clamp-2">
                  {q.sinhala}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 2: COURSE BREAKDOWN & 5 PRACTICE PILLARS                  */}
      {/* Alternating side entrances explaining what students will learn     */}
      {/* ================================================================= */}
      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Sliding from Right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Complete Curriculum (සම්පූර්ණ විෂය මාලාව)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            5 Powerful Practice Studios
          </h2>
          <p className="mt-2 text-xs sm:text-base text-slate-600 font-medium">
            ලියාපදිංචි වීමෙන් පසු ඔබට විවෘත වන අන්තර්ක්‍රියාකාරී අධ්‍යයන අංශ 5 මෙන්න.
          </p>
        </motion.div>

        {/* Pillar List with Alternating Slide Left / Slide Right Animations */}
        <div className="space-y-6 sm:space-y-8">
          {COURSE_PILLARS.map((pillar, index) => {
            const isEven = index % 2 === 0;
            const Icon = pillar.icon;

            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`rounded-3xl p-5 sm:p-8 bg-white border ${pillar.accentBorder} shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden`}
              >
                {/* Background Specular Flare */}
                <div
                  className={`absolute top-0 right-0 w-60 h-60 bg-gradient-to-bl ${pillar.bgGradient} rounded-full blur-2xl pointer-events-none`}
                />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Column: Icon + Titles + Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-md shrink-0 ${pillar.iconBg}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">
                          Pillar 0{index + 1} • {pillar.tag}
                        </span>
                        <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight truncate">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-indigo-700 mb-2">
                      ✨ {pillar.sinhalaTitle}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Right Column: Key Learnings & Locked Studio Badge */}
                  <div className="lg:w-80 shrink-0 bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                      What You Will Master:
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-700 font-semibold mb-4">
                      {pillar.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Unlocked Upon Registration CTA */}
                    <button
                      onClick={() => onOpenAuth('register')}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer group active:scale-98"
                    >
                      <span>Unlock with Free Account</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 3: WHY TAIZER FLOW? (FEATURES & METHODOLOGY)              */}
      {/* ================================================================= */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-200/80 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-xl mx-auto mb-10"
          >
            <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
              Smart Modern Learning
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Why Sri Lankan Students Love Us
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              සාම්ප්‍රදායික කටපාඩම් කිරීම වෙනුවට ප්‍රායෝගික තාක්ෂණය සහ ක්‍රියාකාරකම් මගින් ඉංග්‍රීසි හුරුවීම.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Gamified XP &amp; Badges
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                කාඩ්පත් සම්පූර්ණ කරන විට XP ලැබී ඔබ නව Level වලට පත්වේ. ඉගෙනීම ක්‍රීඩාවක් සේ ආකර්ශනීය වේ.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Mobile &amp; PC Sync
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                ස්මාර්ට් දුරකථනයෙන් හෝ පරිගණකයෙන් ඕනෑම තැනකදී පහසුවෙන් අධ්‍යයනය කළ හැකි පරිදි සකසා ඇත.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Verified Student Accounts
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                පරිපාලක අනුමැතිය (Admin Approval) සහිත ආරක්ෂිත අධ්‍යයන පරිසරයක් සහ සහතික කළ ප්‍රගතියක්.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* FINAL CALL TO ACTION: High Converting Registration Banner         */}
      {/* ================================================================= */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-7 sm:p-12 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-2xl overflow-hidden text-center"
        >
          {/* Ambient Corner Flare */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Free Student Registration</span>
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to Speak Fluent English?
            </h2>

            <p className="text-xs sm:text-base text-indigo-100 font-medium leading-relaxed">
              දැනටමත් සිය ගණනක් සිසුන් SpeakFlow සමඟින් තම ඉංග්‍රීසි භාෂා හැකියාව සාර්ථකව ඔප්නංවාගෙන ඇත. 
              අදම ලියාපදිංචි වී සම්පූර්ණ Practice Cards අංශය නොමිලේ අත්විඳින්න!
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-98 transition-all cursor-pointer group"
              >
                <span>Create Free Student Account (ලියාපදිංචි වන්න)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all cursor-pointer"
              >
                Already registered? Log In
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
