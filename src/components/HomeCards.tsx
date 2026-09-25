import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
} from 'lucide-react';
import { SkillType, LearningCard, UserProfile } from '../types';
import { ICON_COMPONENTS, THEME_STYLES } from '../data/defaultCards';

interface HomeCardsProps {
  cards: LearningCard[];
  onSelectSkill: (skill: SkillType) => void;
  onOpenAdmin: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const HomeCards: React.FC<HomeCardsProps> = ({
  cards,
  onSelectSkill,
  onOpenAdmin,
  currentUser,
}) => {
  return (
    <section className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-4 sm:py-8 lg:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Compact Clean Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-8 relative">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-xl border border-white/90 text-slate-700 text-[11px] font-semibold shadow-2xs mb-2.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive English Studio</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight"
          >
            Choose a Skill to Practice
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-xs sm:text-sm text-slate-600 leading-normal max-w-md mx-auto"
          >
            Tap any colorful glass card below to open your interactive practice studio.
          </motion.p>
        </div>

        {/* Empty state if all cards deleted */}
        {cards.length === 0 ? (
          <div className="text-center py-12 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/90 p-6 max-w-md mx-auto shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 mb-1.5">
              No Cards Active
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              All skill cards have been removed.
            </p>
            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800 transition-all shadow-xs"
              >
                Open Admin Panel
              </button>
            )}
          </div>
        ) : (
          /* Cards Grid: Compact Vibrant Glass Cards (2 columns on mobile, 3 on tablet, 5 on desktop) */
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-4 max-w-7xl mx-auto">
            {cards.map((card, idx) => {
              const Icon = ICON_COMPONENTS[card.iconName] || ICON_COMPONENTS.BookOpen;
              const theme = THEME_STYLES[card.colorTheme] || THEME_STYLES.emerald;

              return (
                <motion.div
                  key={card.id}
                  id={`home-card-${card.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 * idx }}
                  whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.18 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectSkill(card.skillType)}
                  className={`group relative rounded-2xl sm:rounded-3xl p-3 sm:p-5 ${theme.glassCard} ${theme.glassGlow} transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden`}
                >
                  {/* Frosted Glass Specular Shimmer Highlight */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />

                  <div className="relative z-10">
                    {/* Top: Compact Icon + Colorful Glass Badge */}
                    <div className="flex items-center justify-between gap-1.5 mb-2 sm:mb-3">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ${theme.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>

                      <span
                        className={`text-[9px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full ${theme.badge} truncate max-w-[85px] sm:max-w-none text-center`}
                        title={card.tag}
                      >
                        {card.tag}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-sm sm:text-lg font-black text-slate-900 group-hover:text-black transition-colors leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-700/80 mt-0.5 leading-tight line-clamp-1">
                      {card.subtitle}
                    </p>

                    {/* Short Description */}
                    <p className="text-[11px] sm:text-xs text-slate-700/90 mt-1.5 sm:mt-2 leading-snug line-clamp-2">
                      {card.description}
                    </p>
                  </div>

                  {/* Compact Bottom Action Row */}
                  <div className="relative z-10 mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-black/5 flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="group-hover:text-black transition-colors text-[10px] sm:text-xs truncate mr-1">
                      <span className="hidden sm:inline">Open Studio </span>
                      <span className="inline sm:hidden">Open </span>Hub
                    </span>
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/70 text-slate-800 border border-white/80 flex items-center justify-center transition-all ${theme.actionBtn} shadow-2xs shrink-0`}
                    >
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Quick Access Admin Button at bottom center (Only visible to authenticated Admin) */}
        {currentUser?.role === 'admin' && (
          <div className="mt-5 sm:mt-8 text-center">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-slate-200/80 text-slate-600 hover:text-slate-950 font-bold text-xs shadow-2xs transition-all cursor-pointer group"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              <span>Manage Cards (Admin Panel)</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
