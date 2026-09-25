import React from 'react';
import { motion } from 'motion/react';
import {
  Home,
  PenTool,
  Globe,
  Sparkles,
  BookOpen,
  Zap,
  MessageSquareQuote,
  Layers,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { SkillType, UserProfile } from '../types';

interface MobileBottomNavProps {
  activeSkill: SkillType | null;
  onSelectSkill: (skill: SkillType) => void;
  onGoHome: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSkill,
  onSelectSkill,
  onGoHome,
  currentUser,
  onOpenAuth,
}) => {
  // If user is NOT logged in: show Landing page navigation with Register & Login
  if (!currentUser) {
    const guestItems = [
      {
        id: 'home',
        label: 'Home',
        icon: Home,
        isActive: true,
        activeColor: 'text-slate-900',
        activeBg: 'bg-slate-100',
        indicator: 'bg-slate-900',
        onClick: () => {
          onGoHome();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      },
      {
        id: 'quotes',
        label: 'Quotes',
        icon: MessageSquareQuote,
        isActive: false,
        activeColor: 'text-purple-700',
        activeBg: 'bg-purple-500/15',
        indicator: 'bg-purple-600',
        onClick: () => {
          window.scrollTo({ top: 400, behavior: 'smooth' });
        },
      },
      {
        id: 'courses',
        label: 'Studios',
        icon: Layers,
        isActive: false,
        activeColor: 'text-indigo-700',
        activeBg: 'bg-indigo-500/15',
        indicator: 'bg-indigo-600',
        onClick: () => {
          window.scrollTo({ top: 900, behavior: 'smooth' });
        },
      },
      {
        id: 'login',
        label: 'Log In',
        icon: LogIn,
        isActive: false,
        activeColor: 'text-slate-800',
        activeBg: 'bg-slate-100',
        indicator: 'bg-slate-900',
        onClick: () => {
          if (onOpenAuth) onOpenAuth('login');
        },
      },
      {
        id: 'register',
        label: 'Register',
        icon: UserPlus,
        isActive: false,
        activeColor: 'text-emerald-700',
        activeBg: 'bg-emerald-500/20',
        indicator: 'bg-emerald-600',
        isPrimary: true,
        onClick: () => {
          if (onOpenAuth) onOpenAuth('register');
        },
      },
    ];

    return (
      <nav
        id="mobile-bottom-nav-guest"
        aria-label="Mobile Guest Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto items-center">
          {guestItems.map((item) => {
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                id={`mobile-guest-nav-${item.id}`}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={item.onClick}
                className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer select-none ${
                  item.isPrimary
                    ? 'text-emerald-700 font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <div
                  className={`w-10 h-7 rounded-xl flex items-center justify-center transition-colors ${
                    item.isPrimary
                      ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-500/30'
                      : item.isActive
                      ? item.activeBg
                      : 'bg-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={item.isPrimary ? 2.5 : 2} />
                </div>
                <span
                  className={`text-[10px] font-bold mt-0.5 tracking-tight ${
                    item.isPrimary ? 'text-emerald-700 font-black' : ''
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    );
  }

  // If user is LOGGED IN: show full studio skill navigation
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      isActive: activeSkill === null,
      activeColor: 'text-slate-950',
      activeBg: 'bg-slate-100',
      indicator: 'bg-slate-900',
      onClick: onGoHome,
    },
    {
      id: 'writing',
      label: 'Writing',
      icon: PenTool,
      isActive: activeSkill === 'writing',
      activeColor: 'text-teal-700',
      activeBg: 'bg-teal-500/15',
      indicator: 'bg-teal-600',
      onClick: () => onSelectSkill('writing'),
    },
    {
      id: 'spoken_oral',
      label: 'Spoken',
      icon: Globe,
      isActive: activeSkill === 'spoken_oral',
      activeColor: 'text-purple-700',
      activeBg: 'bg-purple-500/15',
      indicator: 'bg-purple-600',
      onClick: () => onSelectSkill('spoken_oral'),
    },
    {
      id: 'grammar',
      label: 'Grammar',
      icon: Sparkles,
      isActive: activeSkill === 'grammar',
      activeColor: 'text-amber-700',
      activeBg: 'bg-amber-500/15',
      indicator: 'bg-amber-600',
      onClick: () => onSelectSkill('grammar'),
    },
    {
      id: 'simple_sentence',
      label: 'Sentences',
      icon: BookOpen,
      isActive: activeSkill === 'simple_sentence',
      activeColor: 'text-sky-700',
      activeBg: 'bg-sky-500/15',
      indicator: 'bg-sky-600',
      onClick: () => onSelectSkill('simple_sentence'),
    },
    {
      id: 'essential_verbs',
      label: 'Verbs',
      icon: Zap,
      isActive: activeSkill === 'essential_verbs',
      activeColor: 'text-rose-700',
      activeBg: 'bg-rose-500/15',
      indicator: 'bg-rose-600',
      onClick: () => onSelectSkill('essential_verbs'),
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-6 gap-0.5 max-w-md mx-auto items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <motion.button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={item.onClick}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer select-none ${
                active ? item.activeColor : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {/* Active Pill Glow */}
              <div
                className={`w-12 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  active ? item.activeBg : 'bg-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    active ? 'scale-110' : 'scale-100'
                  }`}
                  strokeWidth={active ? 2.3 : 1.8}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-bold mt-0.5 tracking-tight transition-all ${
                  active ? 'font-black opacity-100' : 'opacity-80'
                }`}
              >
                {item.label}
              </span>

              {/* Top Micro Dot Indicator */}
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className={`absolute -top-1 w-5 h-1 rounded-full ${item.indicator}`}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
