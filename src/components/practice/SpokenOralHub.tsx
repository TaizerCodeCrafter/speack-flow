import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, Headphones, ArrowRight, Sparkles } from 'lucide-react';
import { PracticeSubCard } from '../../types';
import { getStoredPracticeCards } from '../../data/subCardsData';
import { PracticeCardView } from './PracticeCardView';

interface SpokenOralHubProps {
  onOpenAdmin?: () => void;
}

export const SpokenOralHub: React.FC<SpokenOralHubProps> = ({ onOpenAdmin }) => {
  const [cards, setCards] = useState<PracticeSubCard[]>(() =>
    getStoredPracticeCards('spoken_oral')
  );
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  useEffect(() => {
    const handleStorage = () => {
      setCards(getStoredPracticeCards('spoken_oral'));
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleStorage);
    };
  }, []);

  const activeCard = cards.find((c) => c.id === activeCardId);

  if (activeCard) {
    return (
      <PracticeCardView
        card={activeCard}
        onBack={() => setActiveCardId(null)}
        onOpenAdmin={onOpenAdmin}
        themeColor="purple"
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Title */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200/80 text-xs font-bold mb-3 shadow-2xs">
          <Mic className="w-3.5 h-3.5 text-purple-600" />
          <span>Spoken / Oral Practice Studio</span>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
          Spoken / Oral
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select a card below to read English & Sinhala notes
        </p>
      </div>

      {/* Cards Grid: Speaking and Listening (2 columns side by side on mobile) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4.5 max-w-2xl mx-auto px-0.5">
        {cards.map((card) => {
          const hasContent = Boolean(
            card.englishContent?.trim() ||
              card.sinhalaContent?.trim() ||
              (card.examples && card.examples.length > 0)
          );

          const isSpeaking = card.category === 'speaking';
          const Icon = isSpeaking ? Mic : Headphones;

          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCardId(card.id)}
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3 sm:p-5 bg-gradient-to-br from-purple-500/15 via-fuchsia-500/10 to-violet-600/20 backdrop-blur-xl border border-purple-300/40 hover:border-purple-400/70 shadow-[0_8px_25px_rgba(168,85,247,0.15)] hover:shadow-[0_14px_35px_rgba(168,85,247,0.25)] transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Frosted glass shimmer */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-purple-500/20 text-purple-800 border border-purple-300/60 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  {hasContent ? (
                    <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-900 border border-purple-300/60 backdrop-blur-md">
                      Notes
                    </span>
                  ) : (
                    <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60 text-slate-600 border border-white/80">
                      Empty
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-lg font-black text-slate-900 group-hover:text-black transition-colors leading-tight">
                  {card.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-purple-800/80 font-semibold mt-0.5 leading-tight line-clamp-1">
                  {card.subtitle || 'Spoken & Oral Notes'}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-700/90 mt-1 sm:mt-2 line-clamp-2 leading-snug hidden xs:block">
                  {card.sinhalaContent || card.englishContent || 'No notes added yet.'}
                </p>
              </div>

              <div className="relative z-10 mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-black/5 flex items-center justify-between text-xs font-bold text-purple-900">
                <span className="text-[10px] sm:text-xs truncate max-w-[80px] sm:max-w-none">{hasContent ? 'Read Notes' : 'Open'}</span>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-600 text-white flex items-center justify-center transition-all shadow-2xs group-hover:bg-purple-700 shrink-0">
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
