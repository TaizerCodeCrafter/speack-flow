import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Volume2,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  Info,
  Globe,
  Languages,
  Maximize2,
  Minimize2,
  X,
  Award,
  CheckCircle2,
  Zap,
  Star,
} from 'lucide-react';
import { PracticeSubCard, UserProfile } from '../../types';
import { getCurrentUser } from '../../utils/authStorage';
import { awardCardCompletionXP, getLevelProgress, XP_REWARDS } from '../../utils/levelUtils';

interface PracticeCardViewProps {
  card: PracticeSubCard;
  onBack: () => void;
  onOpenAdmin?: () => void;
  themeColor?: 'teal' | 'purple' | 'amber' | 'sky' | 'emerald' | 'rose' | 'indigo' | 'orange';
}

export const PracticeCardView: React.FC<PracticeCardViewProps> = ({
  card,
  onBack,
  onOpenAdmin,
  themeColor = 'teal',
}) => {
  // Language view modes: 'both' (default) | 'en' | 'si'
  const [langView, setLangView] = useState<'both' | 'en' | 'si'>('both');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [justEarned, setJustEarned] = useState<{
    xp: number;
    leveledUp: boolean;
    newLevel: number;
  } | null>(null);

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener('auth-state-changed', handleAuthChange);
    return () => window.removeEventListener('auth-state-changed', handleAuthChange);
  }, []);

  const isCompleted = currentUser?.completedCardIds?.includes(card.id) ?? false;
  const userLevel = currentUser ? getLevelProgress(currentUser.xp || 0) : null;

  const handleCompleteCard = () => {
    if (!currentUser) return;
    const res = awardCardCompletionXP(
      currentUser.id,
      card.id,
      card.title,
      XP_REWARDS.PRACTICE_CARD_COMPLETE
    );
    if (res && res.success) {
      setCurrentUser(res.user);
      setJustEarned({
        xp: res.xpEarned,
        leveledUp: res.leveledUp,
        newLevel: res.newLevel,
      });
      setTimeout(() => {
        setJustEarned(null);
      }, 4500);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    // Optionally request browser fullscreen
    try {
      if (!isFullscreen && !document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (isFullscreen && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {
      // Ignored in environments where browser fullscreen is restricted
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window && text.trim()) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = () => {
    const combined = `${card.title}\n\n[English Notes]\n${card.englishContent}\n\n[සිංහල සටහන්]\n${card.sinhalaContent || ''}`;
    navigator.clipboard.writeText(combined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasContent = Boolean(
    card.englishContent?.trim() ||
      card.sinhalaContent?.trim() ||
      (card.examples && card.examples.length > 0)
  );

  const themeStyles = {
    teal: {
      accentText: 'text-teal-700',
      badge: 'bg-teal-50 text-teal-800 border-teal-200',
      btnPrimary: 'bg-teal-600 hover:bg-teal-700 text-white',
      cardBorder: 'border-teal-200/80',
      bgLight: 'bg-teal-50/50 border-teal-100',
      tag: 'bg-teal-500/10 text-teal-700 border-teal-500/20',
      noteBg: 'bg-teal-50/40 border-teal-100/90',
    },
    purple: {
      accentText: 'text-purple-700',
      badge: 'bg-purple-50 text-purple-800 border-purple-200',
      btnPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
      cardBorder: 'border-purple-200/80',
      bgLight: 'bg-purple-50/50 border-purple-100',
      tag: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
      noteBg: 'bg-purple-50/40 border-purple-100/90',
    },
    amber: {
      accentText: 'text-amber-700',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      btnPrimary: 'bg-amber-500 hover:bg-amber-600 text-white',
      cardBorder: 'border-amber-200/80',
      bgLight: 'bg-amber-50/50 border-amber-100',
      tag: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
      noteBg: 'bg-amber-50/40 border-amber-100/90',
    },
    sky: {
      accentText: 'text-sky-700',
      badge: 'bg-sky-50 text-sky-800 border-sky-200',
      btnPrimary: 'bg-sky-600 hover:bg-sky-700 text-white',
      cardBorder: 'border-sky-200/80',
      bgLight: 'bg-sky-50/50 border-sky-100',
      tag: 'bg-sky-500/10 text-sky-700 border-sky-500/20',
      noteBg: 'bg-sky-50/40 border-sky-100/90',
    },
    emerald: {
      accentText: 'text-emerald-700',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      cardBorder: 'border-emerald-200/80',
      bgLight: 'bg-emerald-50/50 border-emerald-100',
      tag: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
      noteBg: 'bg-emerald-50/40 border-emerald-100/90',
    },
    rose: {
      accentText: 'text-rose-700',
      badge: 'bg-rose-50 text-rose-800 border-rose-200',
      btnPrimary: 'bg-rose-600 hover:bg-rose-700 text-white',
      cardBorder: 'border-rose-200/80',
      bgLight: 'bg-rose-50/50 border-rose-100',
      tag: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
      noteBg: 'bg-rose-50/40 border-rose-100/90',
    },
    indigo: {
      accentText: 'text-indigo-700',
      badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      btnPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      cardBorder: 'border-indigo-200/80',
      bgLight: 'bg-indigo-50/50 border-indigo-100',
      tag: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
      noteBg: 'bg-indigo-50/40 border-indigo-100/90',
    },
    orange: {
      accentText: 'text-orange-700',
      badge: 'bg-orange-50 text-orange-800 border-orange-200',
      btnPrimary: 'bg-orange-600 hover:bg-orange-700 text-white',
      cardBorder: 'border-orange-200/80',
      bgLight: 'bg-orange-50/50 border-orange-100',
      tag: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
      noteBg: 'bg-orange-50/40 border-orange-100/90',
    },
  }[themeColor] || {
    accentText: 'text-teal-700',
    badge: 'bg-teal-50 text-teal-800 border-teal-200',
    btnPrimary: 'bg-teal-600 hover:bg-teal-700 text-white',
    cardBorder: 'border-teal-200/80',
    bgLight: 'bg-teal-50/50 border-teal-100',
    tag: 'bg-teal-500/10 text-teal-700 border-teal-500/20',
    noteBg: 'bg-teal-50/40 border-teal-100/90',
  };

  if (!hasContent) {
    return (
      <div className="space-y-6 w-full">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cards</span>
        </button>

        <div className="py-16 text-center text-slate-500 bg-white/90 rounded-3xl border border-dashed border-slate-200 p-6 sm:p-8 max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto border border-slate-200 shadow-2xs font-black text-2xl">
            {card.number || 1}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">{card.title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs mx-auto">
              {currentUser?.role === 'admin'
                ? 'This card is currently empty. You can add English and Sinhala notes from the Admin Panel.'
                : 'This lesson is currently being prepared by the teacher. Please check back soon! (මෙම පාඩම මේ වන විට සකස් කෙරෙමින් පවතී.)'}
            </p>
          </div>

          {currentUser?.role === 'admin' && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${themeStyles.btnPrimary} font-bold text-xs transition-all shadow-xs cursor-pointer`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add English & Sinhala Notes in Admin</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-[100] w-screen h-screen bg-white sm:bg-slate-50/95 overflow-y-auto flex flex-col no-scrollbar overscroll-contain'
          : 'w-full space-y-3 sm:space-y-5'
      }
    >
      {/* Top action bar */}
      <div
        className={
          isFullscreen
            ? 'sticky top-0 z-30 px-3 sm:px-8 py-3 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between gap-2 shadow-xs'
            : 'flex flex-wrap items-center justify-between gap-2.5 pb-1'
        }
      >
        <button
          onClick={isFullscreen ? () => setIsFullscreen(false) : onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-2xs"
          title={isFullscreen ? 'Exit Full Screen' : 'Back to Cards'}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isFullscreen ? 'Exit Full Screen' : 'Back to Cards'}</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Language Mode Toggle */}
          <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setLangView('both')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                langView === 'both' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              දෙකම
            </button>
            <button
              onClick={() => setLangView('en')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                langView === 'en' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLangView('si')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                langView === 'si' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              සිංහල
            </button>
          </div>

          {/* Fullscreen Mode Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-2xs ${
              isFullscreen
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-white hover:bg-slate-100 border border-slate-200/90 text-slate-700'
            }`}
            title={isFullscreen ? 'Exit Full Screen' : 'View Full Screen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Normal View</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Full Screen</span>
              </>
            )}
          </button>

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${themeStyles.badge} font-bold text-xs transition-all cursor-pointer`}
              title="Edit notes in Admin Panel"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Edit Notes</span>
            </button>
          )}

          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Close Full Screen"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Box: Spans full width smoothly */}
      <div className={isFullscreen ? 'flex-1 p-3 sm:p-6 lg:p-10 max-w-5xl mx-auto w-full' : 'w-full'}>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-7 lg:p-9 shadow-sm space-y-5 sm:space-y-7"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-100">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl ${themeStyles.tag} flex items-center justify-center font-black text-xs sm:text-sm border`}
                >
                  {card.number || 1}
                </span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {card.hub.replace('_', ' ')} • {card.category}
                </span>
                {userLevel && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                    <span>Lv.{userLevel.level} ({userLevel.totalXp} XP)</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                {card.title}
              </h2>
              {card.subtitle && (
                <p className={`text-xs sm:text-sm font-semibold ${themeStyles.accentText}`}>
                  {card.subtitle}
                </p>
              )}
            </div>

            {/* Top Audio & Copy actions */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              {card.englishContent && (
                <button
                  onClick={() => handleSpeak(card.englishContent)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl ${themeStyles.btnPrimary} font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer`}
                  title="Listen to English notes"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Audio</span>
                </button>
              )}
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer border border-slate-200/60"
                title="Copy notes"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* English Notes Section */}
          {(langView === 'both' || langView === 'en') && card.englishContent && (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span>English Notes & Explanation</span>
                </div>
                <button
                  onClick={() => handleSpeak(card.englishContent)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Play Voice</span>
                </button>
              </div>
              <div className="p-4 sm:p-6 rounded-2xl bg-teal-50/40 border border-teal-100/90 text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                {card.englishContent}
              </div>
            </div>
          )}

          {/* Sinhala Notes Section (සිංහල සටහන්) */}
          {(langView === 'both' || langView === 'si') && card.sinhalaContent && (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Languages className="w-4 h-4 text-amber-600" />
                <span>සිංහල සටහන් සහ පැහැදිලි කිරීම් (Sinhala Notes)</span>
              </div>
              <div className="p-4 sm:p-6 rounded-2xl bg-amber-50/40 border border-amber-100/90 text-slate-900 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                {card.sinhalaContent}
              </div>
            </div>
          )}

          {/* Example Sentences with Sinhala Meanings */}
          {card.examples && card.examples.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Example Sentences & Sinhala Meaning ({card.examples.length})</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                {card.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 hover:bg-white border border-slate-200/70 hover:border-sky-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="space-y-1">
                        <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {ex.english}
                        </p>
                        {ex.sinhala && (langView === 'both' || langView === 'si') && (
                          <p className="text-xs sm:text-sm font-medium text-amber-900/90 leading-snug">
                            {ex.sinhala}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSpeak(ex.english)}
                      className="self-end sm:self-center p-2 rounded-xl bg-white hover:bg-sky-50 text-slate-400 hover:text-sky-600 transition-colors shadow-2xs border border-slate-100 cursor-pointer"
                      title="Listen to this example"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Notes / Grammar Tip */}
          {card.notes && (
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-indigo-950 flex items-start gap-3.5">
              <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Key Rule & Tip / විශේෂ සටහන
                </h4>
                <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed font-medium">
                  {card.notes}
                </p>
              </div>
            </div>
          )}

          {/* Student Level & Card Completion XP Box */}
          <div
            id={`complete-card-${card.id}`}
            className="pt-2"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-indigo-50/50 to-emerald-50/60 border border-amber-200/80 shadow-xs">
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs border ${
                    isCompleted
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                      : 'bg-amber-100 border-amber-300 text-amber-700'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <Award className="w-6 h-6 text-amber-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900">
                      {isCompleted ? 'Practice Card Completed!' : 'Mark Card as Completed'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] shadow-2xs">
                      {isCompleted ? '+15 XP Bonus' : '+50 XP'}
                    </span>
                    {userLevel && (
                      <span className="text-[11px] font-bold text-indigo-700">
                        • Level {userLevel.level}: {userLevel.title}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {currentUser
                      ? isCompleted
                        ? 'Great job! You already completed this card. Click Practice Again anytime for a +15 XP retention bonus.'
                        : 'Finish reviewing the notes and examples above, then click to earn +50 XP towards your next level!'
                      : 'Please sign in or create an account to record your XP and level up your student profile.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-center">
                {currentUser ? (
                  <button
                    id={`btn-complete-${card.id}`}
                    onClick={handleCompleteCard}
                    className={`w-full sm:w-auto px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
                      isCompleted
                        ? 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400'
                        : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Practice Again (+15 XP)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 fill-white" />
                        <span>Complete Card (+50 XP)</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold text-center w-full">
                    Log in to earn XP
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Celebration Popup when XP earned */}
      <AnimatePresence>
        {justEarned && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full p-4 rounded-3xl bg-slate-900/95 backdrop-blur-xl text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                <Star className="w-5 h-5 fill-slate-950" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-black text-sm text-amber-300">
                    {justEarned.leveledUp ? '🎉 LEVEL UP ACHIEVED!' : '⭐ +XP EARNED!'}
                  </h4>
                  <button
                    onClick={() => setJustEarned(null)}
                    className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-200 mt-0.5">
                  You earned <strong className="text-amber-300 font-bold">+{justEarned.xp} XP</strong> for practicing{' '}
                  <span className="italic">"{card.title}"</span>.
                </p>
                {justEarned.leveledUp && (
                  <div className="mt-2 p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-[11px] font-bold text-amber-200 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>You advanced to Level {justEarned.newLevel}! Visit profile to view progress.</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

