import { UserProfile } from '../types';
import { getCurrentUser, updateUserProfile } from './authStorage';

export interface LevelMilestone {
  level: number;
  title: string;
  sinhalaTitle: string;
  minXp: number;
  maxXp: number;
  badgeBg: string;
  badgeTextColor: string;
  ringColor: string;
  iconColor: string;
  description: string;
}

export const LEVEL_MILESTONES: LevelMilestone[] = [
  {
    level: 1,
    title: 'Novice Speaker',
    sinhalaTitle: 'ආරම්භක ශිෂ්‍ය',
    minXp: 0,
    maxXp: 100,
    badgeBg: 'bg-slate-100',
    badgeTextColor: 'text-slate-700',
    ringColor: 'ring-slate-300',
    iconColor: 'text-slate-500',
    description: 'Begins English journey and completes foundational cards.',
  },
  {
    level: 2,
    title: 'Curious Learner',
    sinhalaTitle: 'උනන්දු ශිෂ්‍ය',
    minXp: 100,
    maxXp: 250,
    badgeBg: 'bg-emerald-50',
    badgeTextColor: 'text-emerald-800',
    ringColor: 'ring-emerald-400',
    iconColor: 'text-emerald-600',
    description: 'Reads notes and speaks example sentences actively.',
  },
  {
    level: 3,
    title: 'Active Practicer',
    sinhalaTitle: 'ක්‍රියාකාරී පුහුණුකරු',
    minXp: 250,
    maxXp: 450,
    badgeBg: 'bg-sky-50',
    badgeTextColor: 'text-sky-800',
    ringColor: 'ring-sky-400',
    iconColor: 'text-sky-600',
    description: 'Completes speaking drills and sentence construction.',
  },
  {
    level: 4,
    title: 'Fluent Explorer',
    sinhalaTitle: 'දක්ෂ ගවේෂක',
    minXp: 450,
    maxXp: 700,
    badgeBg: 'bg-indigo-50',
    badgeTextColor: 'text-indigo-800',
    ringColor: 'ring-indigo-400',
    iconColor: 'text-indigo-600',
    description: 'Masters grammar patterns, Do/Have/Be verbs and rules.',
  },
  {
    level: 5,
    title: 'English Champion',
    sinhalaTitle: 'ඉංග්‍රීසි ශූරයා',
    minXp: 700,
    maxXp: 1000,
    badgeBg: 'bg-purple-50',
    badgeTextColor: 'text-purple-800',
    ringColor: 'ring-purple-400',
    iconColor: 'text-purple-600',
    description: 'High fluency and quick voice recall in daily conversations.',
  },
  {
    level: 6,
    title: 'Fluency Pro',
    sinhalaTitle: 'ප්‍රවීණ කථික',
    minXp: 1000,
    maxXp: 1400,
    badgeBg: 'bg-amber-50',
    badgeTextColor: 'text-amber-800',
    ringColor: 'ring-amber-400',
    iconColor: 'text-amber-600',
    description: 'Fluent speaker handling advanced grammar and spoken oral drills.',
  },
  {
    level: 7,
    title: 'Language Master',
    sinhalaTitle: 'භාෂා විශාරද',
    minXp: 1400,
    maxXp: 1900,
    badgeBg: 'bg-rose-50',
    badgeTextColor: 'text-rose-800',
    ringColor: 'ring-rose-400',
    iconColor: 'text-rose-600',
    description: 'Demonstrates deep mastery of English spoken and written structures.',
  },
  {
    level: 8,
    title: 'Grand Champion',
    sinhalaTitle: 'ශ්‍රේෂ්ඨ ශූරයා',
    minXp: 1900,
    maxXp: 2500,
    badgeBg: 'bg-orange-50',
    badgeTextColor: 'text-orange-800',
    ringColor: 'ring-orange-400',
    iconColor: 'text-orange-600',
    description: 'Exemplary speed, accent mastery, and extensive vocabulary recall.',
  },
  {
    level: 9,
    title: 'SpeakFlow Legend',
    sinhalaTitle: 'පුරාවෘත්තය',
    minXp: 2500,
    maxXp: 5000,
    badgeBg: 'bg-gradient-to-r from-amber-100 to-yellow-100',
    badgeTextColor: 'text-amber-950',
    ringColor: 'ring-amber-500',
    iconColor: 'text-amber-600',
    description: 'Ultimate master of all practice cards and drills in SpeakFlow.',
  },
];

export interface LevelProgress {
  level: number;
  title: string;
  sinhalaTitle: string;
  totalXp: number;
  currentLevelXp: number;
  xpRequiredForNextLevel: number;
  progressPercentage: number;
  isMaxLevel: boolean;
  milestone: LevelMilestone;
  nextMilestone?: LevelMilestone;
  xpRemaining: number;
}

export const XP_REWARDS = {
  PRACTICE_CARD_COMPLETE: 50,
  QUIZ_EXCELLENCE: 40,
  SPEAKING_DRILL: 25,
  PRACTICE_REPEAT: 15,
};

/**
 * Calculates current level, level titles, XP within current level, and % progress
 */
export function getLevelProgress(totalXp = 0): LevelProgress {
  const safeXp = Math.max(0, Number(totalXp) || 0);

  // Find corresponding milestone
  let milestone = LEVEL_MILESTONES[0];
  for (let i = LEVEL_MILESTONES.length - 1; i >= 0; i--) {
    if (safeXp >= LEVEL_MILESTONES[i].minXp) {
      milestone = LEVEL_MILESTONES[i];
      break;
    }
  }

  const nextMilestone = LEVEL_MILESTONES.find((m) => m.level === milestone.level + 1);
  const isMaxLevel = !nextMilestone;

  if (isMaxLevel) {
    return {
      level: milestone.level,
      title: milestone.title,
      sinhalaTitle: milestone.sinhalaTitle,
      totalXp: safeXp,
      currentLevelXp: safeXp - milestone.minXp,
      xpRequiredForNextLevel: 1000,
      progressPercentage: 100,
      isMaxLevel: true,
      milestone,
      xpRemaining: 0,
    };
  }

  const range = nextMilestone.minXp - milestone.minXp;
  const currentLevelXp = safeXp - milestone.minXp;
  const progressPercentage = Math.min(100, Math.max(0, Math.round((currentLevelXp / range) * 100)));
  const xpRemaining = Math.max(0, nextMilestone.minXp - safeXp);

  return {
    level: milestone.level,
    title: milestone.title,
    sinhalaTitle: milestone.sinhalaTitle,
    totalXp: safeXp,
    currentLevelXp,
    xpRequiredForNextLevel: range,
    progressPercentage,
    isMaxLevel: false,
    milestone,
    nextMilestone,
    xpRemaining,
  };
}

export interface AwardXPResult {
  success: boolean;
  xpEarned: number;
  totalXp: number;
  oldLevel: number;
  newLevel: number;
  leveledUp: boolean;
  cardAlreadyCompleted: boolean;
  user: UserProfile;
}

/**
 * Awards XP to a user for completing or practicing a card
 */
export function awardCardCompletionXP(
  userId: string,
  cardId: string,
  cardTitle: string,
  baseXp: number = XP_REWARDS.PRACTICE_CARD_COMPLETE
): AwardXPResult | null {
  const current = getCurrentUser();
  if (!current || current.id !== userId) {
    return null;
  }

  const oldTotalXp = current.xp || 0;
  const oldLevelInfo = getLevelProgress(oldTotalXp);
  const completedIds = Array.isArray(current.completedCardIds) ? [...current.completedCardIds] : [];
  const alreadyCompleted = completedIds.includes(cardId);

  // If already completed once, give repeat practice bonus (+15 XP); if new, give full (+50 XP)
  const xpEarned = alreadyCompleted ? XP_REWARDS.PRACTICE_REPEAT : baseXp;

  if (!alreadyCompleted && cardId) {
    completedIds.push(cardId);
  }

  const newTotalXp = oldTotalXp + xpEarned;
  const newLevelInfo = getLevelProgress(newTotalXp);
  const leveledUp = newLevelInfo.level > oldLevelInfo.level;

  const updates: Partial<UserProfile> = {
    xp: newTotalXp,
    level: newLevelInfo.level,
    completedCardsCount: completedIds.length,
    completedCardIds: completedIds,
    lastXpAwardedAt: Date.now(),
  };

  const updateRes = updateUserProfile(userId, updates);
  if (!updateRes.success || !updateRes.user) {
    return null;
  }

  // Dispatch custom event for UI notifications
  try {
    window.dispatchEvent(
      new CustomEvent('taizerflow-xp-awarded', {
        detail: {
          xpEarned,
          cardId,
          cardTitle,
          newTotalXp,
          newLevel: newLevelInfo.level,
          leveledUp,
          alreadyCompleted,
        },
      })
    );
  } catch (e) {
    // Ignore event error in test environments
  }

  return {
    success: true,
    xpEarned,
    totalXp: newTotalXp,
    oldLevel: oldLevelInfo.level,
    newLevel: newLevelInfo.level,
    leveledUp,
    cardAlreadyCompleted: alreadyCompleted,
    user: updateRes.user,
  };
}
