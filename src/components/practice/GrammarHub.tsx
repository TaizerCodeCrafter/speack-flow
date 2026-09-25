import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Copy,
  Check,
  BookOpen,
  Info,
  Layers,
} from 'lucide-react';
import { GrammarSubCard, PracticeSubCard } from '../../types';
import { getStoredGrammarCards } from '../../data/grammarCards';
import { PracticeCardView } from './PracticeCardView';

interface GrammarHubProps {
  onOpenAdmin?: () => void;
}

export const GrammarHub: React.FC<GrammarHubProps> = ({ onOpenAdmin }) => {
  const [grammarCards, setGrammarCards] = useState<GrammarSubCard[]>(() => getStoredGrammarCards());
  const [activeCategory, setActiveCategory] = useState<'do' | 'have' | 'be' | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Reload when window focuses or storage changes
  useEffect(() => {
    const handleStorage = () => {
      setGrammarCards(getStoredGrammarCards());
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleStorage);
    };
  }, []);

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Find the actively selected sub-card
  const activeCard = grammarCards.find((c) => c.id === activeCardId);

  // When a specific sub-card is opened
  if (activeCategory && activeCard) {
    const mappedCard: PracticeSubCard = {
      id: activeCard.id,
      hub: 'grammar',
      category: activeCard.category,
      number: activeCard.number,
      title: activeCard.title,
      subtitle: activeCard.subtitle,
      englishContent: activeCard.englishContent,
      sinhalaContent: activeCard.sinhalaContent,
      examples: Array.isArray(activeCard.examples)
        ? activeCard.examples.map((ex: any) =>
            typeof ex === 'string' ? { english: ex, sinhala: '' } : ex
          )
        : [],
      notes: activeCard.notes,
    };

    return (
      <PracticeCardView
        card={mappedCard}
        onBack={() => setActiveCardId(null)}
        onOpenAdmin={onOpenAdmin}
        themeColor="amber"
      />
    );
  }

  // When Do, Have, or Be category is selected: show its sub-cards
  if (activeCategory) {
    const categoryTitle =
      activeCategory === 'do' ? 'Do' : activeCategory === 'have' ? 'Have' : 'Be';

    const categorySubCards = grammarCards
      .filter((c) => c.category === activeCategory)
      .sort((a, b) => a.number - b.number);

    const theme =
      activeCategory === 'do'
        ? {
            glassCard: 'bg-gradient-to-br from-amber-500/18 via-orange-500/12 to-yellow-500/20 backdrop-blur-xl border border-amber-300/50 hover:border-amber-400/80',
            bgIcon: 'bg-amber-500/25 text-amber-950 border border-amber-300/70 shadow-2xs',
            hoverShadow: 'shadow-[0_8px_25px_rgba(245,158,11,0.18)] hover:shadow-[0_14px_35px_rgba(245,158,11,0.30)]',
            btnHover: 'bg-amber-600 text-white group-hover:bg-amber-700',
            badge: 'bg-amber-500/20 text-amber-950 border border-amber-300/70',
            textHover: 'group-hover:text-black',
            linkText: 'text-amber-950',
          }
        : activeCategory === 'have'
        ? {
            glassCard: 'bg-gradient-to-br from-sky-500/15 via-blue-500/10 to-cyan-600/20 backdrop-blur-xl border border-sky-300/40 hover:border-sky-400/70',
            bgIcon: 'bg-sky-500/20 text-sky-900 border border-sky-300/60 shadow-2xs',
            hoverShadow: 'shadow-[0_8px_25px_rgba(14,165,233,0.15)] hover:shadow-[0_14px_35px_rgba(14,165,233,0.25)]',
            btnHover: 'bg-sky-600 text-white group-hover:bg-sky-700',
            badge: 'bg-sky-500/15 text-sky-950 border border-sky-300/60',
            textHover: 'group-hover:text-black',
            linkText: 'text-sky-950',
          }
        : {
            glassCard: 'bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-blue-600/20 backdrop-blur-xl border border-indigo-300/40 hover:border-indigo-400/70',
            bgIcon: 'bg-indigo-500/20 text-indigo-900 border border-indigo-300/60 shadow-2xs',
            hoverShadow: 'shadow-[0_8px_25px_rgba(99,102,241,0.15)] hover:shadow-[0_14px_35px_rgba(99,102,241,0.25)]',
            btnHover: 'bg-indigo-600 text-white group-hover:bg-indigo-700',
            badge: 'bg-indigo-500/15 text-indigo-950 border border-indigo-300/60',
            textHover: 'group-hover:text-black',
            linkText: 'text-indigo-950',
          };

    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveCategory(null)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Grammar</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {categorySubCards.length} {categorySubCards.length === 1 ? 'Card' : 'Cards'}
            </span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Manage in Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            {categoryTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Select a card below to read English explanations & examples
          </p>
        </div>

        {/* Sub-Cards Grid */}
        <div
          className={`grid gap-4 sm:gap-6 mx-auto ${
            categorySubCards.length === 1
              ? 'grid-cols-1 max-w-sm'
              : categorySubCards.length === 2
              ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl'
          }`}
        >
          {categorySubCards.map((card) => {
            const hasContent = Boolean(
              card.englishContent?.trim() || (card.examples && card.examples.length > 0)
            );

            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCardId(card.id)}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 ${theme.glassCard} ${theme.hoverShadow} transition-all cursor-pointer flex flex-col justify-between`}
              >
                {/* Frosted glass shimmer */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ${theme.bgIcon} flex items-center justify-center transition-all font-black text-base`}
                    >
                      {card.number}
                    </div>

                    {hasContent ? (
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${theme.badge} backdrop-blur-md`}>
                        Content Added
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/60 text-slate-600 border border-white/80">
                        Empty
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-base sm:text-lg font-black text-slate-900 ${theme.textHover} transition-colors leading-tight`}
                  >
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-700/90 mt-1.5 font-medium line-clamp-2 leading-relaxed">
                    {card.subtitle || `${categoryTitle} Card ${card.number}`}
                  </p>
                </div>

                <div
                  className={`relative z-10 mt-3.5 pt-2.5 border-t border-black/5 flex items-center justify-between text-xs font-bold ${theme.linkText}`}
                >
                  <span className="text-[11px] sm:text-xs">{hasContent ? 'Read English Notes' : 'Open Card'}</span>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl ${theme.btnHover} flex items-center justify-center transition-all shadow-2xs`}
                  >
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Top level: 3 cards - Do, Have, Be
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Title */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-bold mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Grammar Studio</span>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
          Grammar
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select a category below to explore cards
        </p>
      </div>

      {/* The 3 Category Cards: Do, Have, Be */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4.5 max-w-4xl mx-auto">
        {/* Do Category */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setActiveCategory('do');
            setActiveCardId(null);
          }}
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-amber-500/18 via-orange-500/12 to-yellow-500/20 backdrop-blur-xl border border-amber-300/50 hover:border-amber-400/80 shadow-[0_8px_25px_rgba(245,158,11,0.18)] hover:shadow-[0_14px_35px_rgba(245,158,11,0.30)] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-500/25 text-amber-950 border border-amber-300/70 flex items-center justify-center mb-3 group-hover:scale-105 transition-all font-black text-base shadow-2xs">
              Do
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-black transition-colors">
                Do
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-950 border border-amber-300/70 backdrop-blur-md">
                {grammarCards.filter((c) => c.category === 'do').length} Cards
              </span>
            </div>
            <p className="text-xs text-slate-700/90 mt-1 leading-snug">
              Do, Does & Did Usage
            </p>
          </div>

          <div className="relative z-10 mt-3.5 pt-2.5 border-t border-black/5 flex items-center justify-between text-xs font-bold text-amber-950">
            <span className="text-[11px] sm:text-xs">Open Do</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-600 text-white group-hover:bg-amber-700 flex items-center justify-center transition-all shadow-2xs">
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Have Category */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setActiveCategory('have');
            setActiveCardId(null);
          }}
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-sky-500/15 via-blue-500/10 to-cyan-600/20 backdrop-blur-xl border border-sky-300/40 hover:border-sky-400/70 shadow-[0_8px_25px_rgba(14,165,233,0.15)] hover:shadow-[0_14px_35px_rgba(14,165,233,0.25)] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-sky-500/20 text-sky-900 border border-sky-300/60 flex items-center justify-center mb-3 group-hover:scale-105 transition-all font-black text-base shadow-2xs">
              Have
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-black transition-colors">
                Have
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-950 border border-sky-300/60 backdrop-blur-md">
                {grammarCards.filter((c) => c.category === 'have').length} Cards
              </span>
            </div>
            <p className="text-xs text-slate-700/90 mt-1 leading-snug">
              Have, Has & Had Usage
            </p>
          </div>

          <div className="relative z-10 mt-3.5 pt-2.5 border-t border-black/5 flex items-center justify-between text-xs font-bold text-sky-950">
            <span className="text-[11px] sm:text-xs">Open Have</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-sky-600 text-white group-hover:bg-sky-700 flex items-center justify-center transition-all shadow-2xs">
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Be Category */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setActiveCategory('be');
            setActiveCardId(null);
          }}
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-blue-600/20 backdrop-blur-xl border border-indigo-300/40 hover:border-indigo-400/70 shadow-[0_8px_25px_rgba(99,102,241,0.15)] hover:shadow-[0_14px_35px_rgba(99,102,241,0.25)] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-500/20 text-indigo-900 border border-indigo-300/60 flex items-center justify-center mb-3 group-hover:scale-105 transition-all font-black text-base shadow-2xs">
              Be
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-black transition-colors">
                Be
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-950 border border-indigo-300/60 backdrop-blur-md">
                {grammarCards.filter((c) => c.category === 'be').length} Cards
              </span>
            </div>
            <p className="text-xs text-slate-700/90 mt-1 leading-snug">
              Am, Is, Are, Was, Were, Been
            </p>
          </div>

          <div className="relative z-10 mt-3.5 pt-2.5 border-t border-black/5 flex items-center justify-between text-xs font-bold text-indigo-950">
            <span className="text-[11px] sm:text-xs">Open Be</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-600 text-white group-hover:bg-indigo-700 flex items-center justify-center transition-all shadow-2xs">
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
