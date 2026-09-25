import React from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Headphones,
  Mic,
  MessageSquare,
  PenTool,
  Globe,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { SkillType } from '../types';
import { SKILL_CARDS } from '../data/learningData';

interface SkillCardsSectionProps {
  onSelectSkill: (skill: SkillType) => void;
}

export const SkillCardsSection: React.FC<SkillCardsSectionProps> = ({
  onSelectSkill,
}) => {
  const getSkillIcon = (id: SkillType) => {
    switch (id) {
      case 'reading':
        return <BookOpen className="w-6 h-6 text-emerald-600" />;
      case 'listening':
        return <Headphones className="w-6 h-6 text-sky-600" />;
      case 'speaking':
        return <Mic className="w-6 h-6 text-amber-600" />;
      case 'conversation':
        return <MessageSquare className="w-6 h-6 text-indigo-600" />;
      case 'writing':
        return <PenTool className="w-6 h-6 text-teal-600" />;
      case 'spoken_oral':
        return <Globe className="w-6 h-6 text-purple-600" />;
      default:
        return <BookOpen className="w-6 h-6 text-slate-600" />;
    }
  };

  const getGlassStyles = (id: SkillType) => {
    switch (id) {
      case 'reading':
        return {
          glowColor: 'group-hover:shadow-[0_20px_45px_rgba(16,185,129,0.14)]',
          borderColor: 'border-emerald-500/20 group-hover:border-emerald-500/50',
          accentLight: 'bg-emerald-500/8 group-hover:bg-emerald-500/15',
          badgeStyle: 'bg-emerald-500/10 text-emerald-900 border-emerald-500/25',
          btnGlass: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_4px_16px_rgba(16,185,129,0.3)]',
          accentColor: 'text-emerald-600',
          iconBox: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25',
          statBox: 'bg-emerald-500/5 border-emerald-500/15',
        };
      case 'listening':
        return {
          glowColor: 'group-hover:shadow-[0_20px_45px_rgba(14,165,233,0.14)]',
          borderColor: 'border-sky-500/20 group-hover:border-sky-500/50',
          accentLight: 'bg-sky-500/8 group-hover:bg-sky-500/15',
          badgeStyle: 'bg-sky-500/10 text-sky-900 border-sky-500/25',
          btnGlass: 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-[0_4px_16px_rgba(14,165,233,0.3)]',
          accentColor: 'text-sky-600',
          iconBox: 'bg-sky-500/15 text-sky-700 border-sky-500/25',
          statBox: 'bg-sky-500/5 border-sky-500/15',
        };
      case 'speaking':
        return {
          glowColor: 'group-hover:shadow-[0_20px_45px_rgba(245,158,11,0.14)]',
          borderColor: 'border-amber-500/20 group-hover:border-amber-500/50',
          accentLight: 'bg-amber-500/8 group-hover:bg-amber-500/15',
          badgeStyle: 'bg-amber-500/10 text-amber-900 border-amber-500/25',
          btnGlass: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-[0_4px_16px_rgba(245,158,11,0.3)]',
          accentColor: 'text-amber-600',
          iconBox: 'bg-amber-500/15 text-amber-700 border-amber-500/25',
          statBox: 'bg-amber-500/5 border-amber-500/15',
        };
      case 'conversation':
        return {
          glowColor: 'group-hover:shadow-[0_20px_45px_rgba(99,102,241,0.14)]',
          borderColor: 'border-indigo-500/20 group-hover:border-indigo-500/50',
          accentLight: 'bg-indigo-500/8 group-hover:bg-indigo-500/15',
          badgeStyle: 'bg-indigo-500/10 text-indigo-900 border-indigo-500/25',
          btnGlass: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_4px_16px_rgba(99,102,241,0.3)]',
          accentColor: 'text-indigo-600',
          iconBox: 'bg-indigo-500/15 text-indigo-700 border-indigo-500/25',
          statBox: 'bg-indigo-500/5 border-indigo-500/15',
        };
      case 'writing':
        return {
          glowColor: 'group-hover:shadow-[0_20px_45px_rgba(20,184,166,0.14)]',
          borderColor: 'border-teal-500/20 group-hover:border-teal-500/50',
          accentLight: 'bg-teal-500/8 group-hover:bg-teal-500/15',
          badgeStyle: 'bg-teal-500/10 text-teal-900 border-teal-500/25',
          btnGlass: 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-[0_4px_16px_rgba(20,184,166,0.3)]',
          accentColor: 'text-teal-600',
          iconBox: 'bg-teal-500/15 text-teal-700 border-teal-500/25',
          statBox: 'bg-teal-500/5 border-teal-500/15',
        };
      case 'spoken_oral':
      default:
        return {
          glowColor: 'group-hover:shadow-[0_20px_45px_rgba(168,85,247,0.14)]',
          borderColor: 'border-purple-500/20 group-hover:border-purple-500/50',
          accentLight: 'bg-purple-500/8 group-hover:bg-purple-500/15',
          badgeStyle: 'bg-purple-500/10 text-purple-900 border-purple-500/25',
          btnGlass: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_4px_16px_rgba(168,85,247,0.3)]',
          accentColor: 'text-purple-600',
          iconBox: 'bg-purple-500/15 text-purple-700 border-purple-500/25',
          statBox: 'bg-purple-500/5 border-purple-500/15',
        };
    }
  };

  return (
    <section id="core-skills-cards" className="py-14 sm:py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Glass Aesthetic */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-white/90 text-slate-700 text-xs font-bold mb-3.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Core Fluency Modules</span>
          </div>
          <h2 className="text-2.5xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Four Pillars of Complete English Mastery
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Select any module to enter the live interactive practice studio with native voice synthesis, live speech assessment, and roleplay simulations.
          </p>
        </div>

        {/* 4 Animated Glass Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 lg:gap-8">
          {SKILL_CARDS.map((card, index) => {
            const glass = getGlassStyles(card.id);

            return (
              <motion.div
                key={card.id}
                id={`card-${card.id}`}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                whileHover={{ y: -7, transition: { duration: 0.25 } }}
                className={`group relative rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer backdrop-blur-xl bg-white/75 hover:bg-white/90 border ${glass.borderColor} shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${glass.glowColor}`}
                onClick={() => onSelectSkill(card.id)}
              >
                {/* Ambient Soft Glass Gradient Glow */}
                <div
                  className={`absolute -top-24 -right-24 w-64 h-64 rounded-full ${glass.accentLight} blur-3xl transition-all duration-500 pointer-events-none`}
                />

                {/* Shimmer Light Reflection on Top Border */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

                <div className="relative z-10">
                  {/* Card Header: Glass Squircle Icon + Pill Badge */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl ${glass.iconBox} border flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300 shrink-0`}>
                        {getSkillIcon(card.id)}
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-slate-950 transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                          {card.tagline}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border backdrop-blur-md shrink-0 shadow-2xs ${glass.badgeStyle}`}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Card Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {card.description}
                  </p>

                  {/* Feature Checkmarks in Frosted Capsules */}
                  <div className="space-y-2 mb-6">
                    {card.features.slice(0, 3).map((feat, fIndex) => (
                      <div
                        key={fIndex}
                        className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold p-2 rounded-xl bg-white/60 border border-white/80 backdrop-blur-sm"
                      >
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${glass.accentColor}`} />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Frosted Stats + Glass Action Button */}
                <div className="pt-4 border-t border-slate-200/50 relative z-10 mt-auto">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {card.stats.map((st, stIdx) => (
                      <div
                        key={stIdx}
                        className={`rounded-xl p-2 sm:p-2.5 text-center border backdrop-blur-xs ${glass.statBox}`}
                      >
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">
                          {st.label}
                        </p>
                        <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 truncate">
                          {st.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Glass Action Button with Fluid Animation */}
                  <button
                    id={`open-skill-${card.id}-btn`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSkill(card.id);
                    }}
                    className={`w-full min-h-[46px] py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${glass.btnGlass} hover:scale-[1.01] active:scale-[0.98]`}
                  >
                    <span>Launch {card.title} Studio</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
