import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowLeft,
  BookOpen,
  Headphones,
  Mic,
  MessageSquare,
  PenTool,
  Globe,
  Sparkles,
  Zap,
} from 'lucide-react';
import { SkillType, UserProfile } from '../types';
import { WritingHub } from './practice/WritingHub';
import { SpokenOralHub } from './practice/SpokenOralHub';
import { GrammarHub } from './practice/GrammarHub';
import { SimpleSentenceHub } from './practice/SimpleSentenceHub';
import { EssentialVerbsHub } from './practice/EssentialVerbsHub';

interface PracticeModalProps {
  activeSkill: SkillType | null;
  onClose: () => void;
  onSwitchSkill: (skill: SkillType) => void;
  onOpenAdmin?: (hub?: 'writing' | 'spoken_oral' | 'grammar' | 'simple_sentence' | 'essential_verbs') => void;
  currentUser?: UserProfile | null;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  activeSkill,
  onClose,
  onSwitchSkill,
  onOpenAdmin,
  currentUser,
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const effectiveOpenAdmin = isAdmin ? onOpenAdmin : undefined;
  // Handle ESC key to exit full screen modal and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeSkill) {
        onClose();
      }
    };

    if (activeSkill) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSkill, onClose]);

  if (!activeSkill) return null;

  const getTitle = () => {
    switch (activeSkill) {
      case 'reading':
        return {
          title: 'Reading Studio',
          icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
          badgeColor: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20',
          accent: 'emerald',
        };
      case 'listening':
        return {
          title: 'Listening Lab',
          icon: <Headphones className="w-5 h-5 text-sky-600" />,
          badgeColor: 'bg-sky-500/10 text-sky-800 border-sky-500/20',
          accent: 'sky',
        };
      case 'speaking':
        return {
          title: 'Speaking Studio',
          icon: <Mic className="w-5 h-5 text-amber-600" />,
          badgeColor: 'bg-amber-500/10 text-amber-800 border-amber-500/20',
          accent: 'amber',
        };
      case 'conversation':
        return {
          title: 'Conversation Hub',
          icon: <MessageSquare className="w-5 h-5 text-indigo-600" />,
          badgeColor: 'bg-indigo-500/10 text-indigo-800 border-indigo-500/20',
          accent: 'indigo',
        };
      case 'writing':
        return {
          title: 'Writing Studio',
          icon: <PenTool className="w-5 h-5 text-teal-600" />,
          badgeColor: 'bg-teal-500/10 text-teal-800 border-teal-500/20',
          accent: 'teal',
        };
      case 'spoken_oral':
        return {
          title: 'Spoken / Oral Practice',
          icon: <Globe className="w-5 h-5 text-purple-600" />,
          badgeColor: 'bg-purple-500/10 text-purple-800 border-purple-500/20',
          accent: 'purple',
        };
      case 'grammar':
        return {
          title: 'Grammar Studio',
          icon: <Sparkles className="w-5 h-5 text-amber-600" />,
          badgeColor: 'bg-amber-500/10 text-amber-800 border-amber-500/20',
          accent: 'amber',
        };
      case 'simple_sentence':
        return {
          title: 'Simple Sentence Studio',
          icon: <BookOpen className="w-5 h-5 text-sky-600" />,
          badgeColor: 'bg-sky-500/10 text-sky-800 border-sky-500/20',
          accent: 'sky',
        };
      case 'essential_verbs':
        return {
          title: 'Essential Verbs Studio',
          icon: <Zap className="w-5 h-5 text-rose-600 fill-rose-500" />,
          badgeColor: 'bg-rose-500/10 text-rose-800 border-rose-500/20',
          accent: 'rose',
        };
    }
  };

  const currentMeta = getTitle();
  const allSkills: SkillType[] = [
    'writing',
    'spoken_oral',
    'grammar',
    'simple_sentence',
    'essential_verbs',
  ];

  const formatSkillLabel = (sk: SkillType) => {
    if (sk === 'writing') return 'Writing';
    if (sk === 'spoken_oral') return 'Spoken/Oral';
    if (sk === 'grammar') return 'Grammar';
    if (sk === 'simple_sentence') return 'Simple Sentence';
    if (sk === 'essential_verbs') return 'Essential Verbs';
    return sk;
  };

  return (
    <AnimatePresence>
      <motion.div
        id="fullscreen-practice-studio"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 w-screen h-screen bg-slate-50 flex flex-col overflow-hidden"
      >
        {/* Subtle Ambient Background Lighting */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[600px] h-[350px] rounded-full bg-emerald-100/30 blur-[140px]" />
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[350px] rounded-full bg-sky-100/30 blur-[140px]" />
        </div>

        {/* Full-Screen Sticky Header */}
        <header className="px-4 sm:px-8 py-3.5 sm:py-4 bg-white/85 backdrop-blur-2xl border-b border-slate-200/70 flex items-center justify-between shrink-0 shadow-xs z-20">
          {/* Left: Back button & Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              id="back-to-home-btn"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white hover:bg-slate-100/80 border border-slate-200/80 text-slate-700 hover:text-slate-950 font-bold text-xs shadow-2xs transition-all cursor-pointer group"
              title="Return to Home (Esc)"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0">
                {currentMeta.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {currentMeta.title}
                  </h2>
                  <span
                    className={`hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-xs ${currentMeta.badgeColor}`}
                  >
                    Active Session
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Skill Switching Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/80 backdrop-blur-md border border-slate-200/60 shadow-2xs">
            {allSkills.map((sk) => {
              const isActive = activeSkill === sk;
              return (
                <button
                  key={sk}
                  onClick={() => onSwitchSkill(sk)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {formatSkillLabel(sk)}
                </button>
              );
            })}
          </nav>

          {/* Right: Close (X) button with keyboard hint */}
          <div className="flex items-center gap-2">
            <button
              id="close-fullscreen-studio-btn"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white hover:bg-slate-100/80 border border-slate-200/80 text-slate-600 hover:text-slate-900 text-xs font-bold shadow-2xs transition-all cursor-pointer"
              aria-label="Close Studio"
            >
              <span className="hidden lg:inline text-[11px] text-slate-400 font-mono">Esc</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile Quick Switcher Bar */}
        <div className="lg:hidden flex items-center gap-1.5 px-4 py-2 border-b border-slate-200/60 bg-white/70 backdrop-blur-md overflow-x-auto no-scrollbar shrink-0">
          {allSkills.map((sk) => (
            <button
              key={sk}
              onClick={() => onSwitchSkill(sk)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeSkill === sk
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200/70'
              }`}
            >
              {formatSkillLabel(sk)}
            </button>
          ))}
        </div>

        {/* Full-Screen Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar sm:custom-scrollbar overscroll-contain pb-6 sm:pb-8">
          <div className="w-full max-w-5xl mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-6">
            {/* Writing: Shows Writing and Reading cards */}
            {activeSkill === 'writing' && <WritingHub onOpenAdmin={effectiveOpenAdmin} />}

            {/* Spoken / Oral: Shows Speaking and Listening cards */}
            {activeSkill === 'spoken_oral' && <SpokenOralHub onOpenAdmin={effectiveOpenAdmin} />}

            {/* Grammar: Shows Do, Have, Be cards */}
            {activeSkill === 'grammar' && <GrammarHub onOpenAdmin={effectiveOpenAdmin} />}

            {/* Essential Verbs Studio */}
            {activeSkill === 'essential_verbs' && (
              <EssentialVerbsHub
                onOpenAdmin={effectiveOpenAdmin ? () => effectiveOpenAdmin('essential_verbs') : undefined}
                currentUser={currentUser}
              />
            )}
            {activeSkill === 'simple_sentence' && (
              <SimpleSentenceHub
                onOpenAdmin={effectiveOpenAdmin ? () => effectiveOpenAdmin('simple_sentence') : undefined}
                currentUser={currentUser}
              />
            )}
          </div>
        </main>
      </motion.div>
    </AnimatePresence>
  );
};
