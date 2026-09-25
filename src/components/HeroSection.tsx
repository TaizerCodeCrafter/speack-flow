import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, BookOpen, Headphones, Mic, MessageSquare, Sparkles } from 'lucide-react';
import { SkillType } from '../types';

interface HeroSectionProps {
  onSelectSkill: (skill: SkillType) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectSkill }) => {
  const scrollToCards = () => {
    const el = document.getElementById('core-skills-cards');
    if (el) {
      const navHeight = 76;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="hero-section" className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 md:pt-20 md:pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Animated Frosted Glass Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-white/90 text-slate-700 text-xs sm:text-sm font-medium mb-6 shadow-xs hover:shadow-sm transition-all"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-semibold text-slate-800">4-Pillar Active Immersion</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Interactive Studio
          </span>
        </motion.div>

        {/* Main Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6.5xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.14] text-balance"
        >
          Master English with Fluency, Clarity, and Confidence
        </motion.h1>

        {/* Narrative Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          A dedicated language studio built for active learners. Train your mind through active reading, native audio listening, real-time voice speech analysis, and real-world conversation roleplays.
        </motion.p>

        {/* Call to Action Glass Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 max-w-md sm:max-w-none mx-auto"
        >
          {/* Primary Glass Button */}
          <button
            id="hero-explore-cards-btn"
            onClick={scrollToCards}
            className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-850 text-white font-bold text-sm shadow-[0_8px_20px_rgba(15,23,42,0.15)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-white/10"
          >
            <span>Explore Practice Cards</span>
            <ArrowDown className="w-4 h-4 text-slate-300 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Secondary Translucent Glass Button */}
          <button
            id="hero-start-speaking-btn"
            onClick={() => onSelectSkill('speaking')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/80 hover:bg-white active:bg-white/90 backdrop-blur-xl border border-white/90 text-slate-800 font-bold text-sm shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-600">
              <Mic className="w-3.5 h-3.5" />
            </div>
            <span>Try Speaking Drill Now</span>
          </button>
        </motion.div>

        {/* Quick Pillar Indicator Row with Frosted Glass Surface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left"
        >
          {/* Reading Glass Pill */}
          <div
            onClick={() => onSelectSkill('reading')}
            className="group relative p-3.5 sm:p-4 rounded-2xl bg-white/70 hover:bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors truncate">
                Reading
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                Interactive Text
              </p>
            </div>
          </div>

          {/* Listening Glass Pill */}
          <div
            onClick={() => onSelectSkill('listening')}
            className="group relative p-3.5 sm:p-4 rounded-2xl bg-white/70 hover:bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-700 flex items-center justify-center shrink-0 border border-sky-500/20 group-hover:scale-110 transition-transform">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-800 transition-colors truncate">
                Listening
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                Audio Dictation
              </p>
            </div>
          </div>

          {/* Speaking Glass Pill */}
          <div
            onClick={() => onSelectSkill('speaking')}
            className="group relative p-3.5 sm:p-4 rounded-2xl bg-white/70 hover:bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors truncate">
                Speaking
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                Voice Precision
              </p>
            </div>
          </div>

          {/* Conversation Glass Pill */}
          <div
            onClick={() => onSelectSkill('conversation')}
            className="group relative p-3.5 sm:p-4 rounded-2xl bg-white/70 hover:bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-800 transition-colors truncate">
                Conversation
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                Roleplay Studio
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
