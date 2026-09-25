import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Star, X, Sparkles, Trophy } from 'lucide-react';
import { getLevelProgress } from '../utils/levelUtils';

interface XpEventDetail {
  xpEarned: number;
  cardId: string;
  cardTitle: string;
  newTotalXp: number;
  newLevel: number;
  leveledUp: boolean;
  alreadyCompleted: boolean;
}

export const XpNotificationToast: React.FC = () => {
  const [notification, setNotification] = useState<XpEventDetail | null>(null);

  useEffect(() => {
    const handleXpEvent = (e: Event) => {
      const customEvent = e as CustomEvent<XpEventDetail>;
      if (customEvent.detail) {
        setNotification(customEvent.detail);

        // Auto dismiss after 4 seconds
        const timer = setTimeout(() => {
          setNotification((prev) => (prev === customEvent.detail ? null : prev));
        }, 4000);

        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('taizerflow-xp-awarded', handleXpEvent);
    return () => window.removeEventListener('taizerflow-xp-awarded', handleXpEvent);
  }, []);

  if (!notification) return null;

  const levelInfo = getLevelProgress(notification.newTotalXp);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.95 }}
        className="fixed top-20 sm:top-24 right-4 sm:right-6 z-50 max-w-sm w-[90vw] pointer-events-auto"
      >
        <div
          className={`p-4 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.25)] border backdrop-blur-2xl text-white transition-all ${
            notification.leveledUp
              ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-amber-950 border-amber-400/60 ring-2 ring-amber-400/40'
              : 'bg-slate-900/95 border-white/20'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                notification.leveledUp
                  ? 'bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {notification.leveledUp ? (
                <Trophy className="w-6 h-6 fill-slate-950 text-slate-950" />
              ) : (
                <Star className="w-6 h-6 fill-amber-300 text-amber-300" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                  {notification.leveledUp ? '🎉 LEVEL UP!' : '⭐ XP EARNED!'}
                </span>
                <button
                  onClick={() => setNotification(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="font-extrabold text-sm text-white mt-0.5 leading-snug">
                {notification.leveledUp
                  ? `Reached Level ${notification.newLevel}: ${levelInfo.title}`
                  : `+${notification.xpEarned} XP Added!`}
              </h4>

              <p className="text-xs text-slate-300 mt-0.5 truncate">
                {notification.cardTitle || 'Practice Activity'}
              </p>

              {/* Progress mini indicator */}
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                <span>
                  Current: <strong className="text-white">Level {levelInfo.level}</strong>
                </span>
                <span className="font-mono text-amber-300 font-bold">
                  {notification.newTotalXp} XP Total
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
