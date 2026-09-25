import { LearningCard, CardColorTheme, CardIconName } from '../types';
import {
  BookOpen,
  Headphones,
  Mic,
  MessageSquare,
  Sparkles,
  Trophy,
  PenTool,
  Globe,
  Zap,
} from 'lucide-react';
import React from 'react';

export const DEFAULT_CARDS: LearningCard[] = [
  {
    id: 'writing',
    skillType: 'writing',
    title: 'Writing',
    subtitle: 'Writing & Reading',
    description: 'Master written expression, composition, essays, and explore interactive reading texts.',
    tag: 'Writing & Reading',
    iconName: 'PenTool',
    colorTheme: 'teal',
  },
  {
    id: 'spoken_oral',
    skillType: 'spoken_oral',
    title: 'Spoken/Oral',
    subtitle: 'Speaking & Listening',
    description: 'Develop spoken fluency, speech recognition drills, and native ear listening practice.',
    tag: 'Speaking & Listening',
    iconName: 'Globe',
    colorTheme: 'purple',
  },
  {
    id: 'grammar',
    skillType: 'grammar',
    title: 'Grammar',
    subtitle: 'Do, Have & Be',
    description: 'Explore core English auxiliary verbs and essential grammar cards for Do, Have, and Be.',
    tag: 'Do, Have, Be',
    iconName: 'Sparkles',
    colorTheme: 'amber',
  },
  {
    id: 'simple_sentence',
    skillType: 'simple_sentence',
    title: 'Simple Sentence',
    subtitle: 'Sentence Patterns & Structures',
    description: 'Construct and practice simple English sentences with Subject, Verb, and Object patterns.',
    tag: 'Sentence Patterns',
    iconName: 'BookOpen',
    colorTheme: 'sky',
  },
  {
    id: 'essential_verbs',
    skillType: 'essential_verbs',
    title: 'Essential Verbs',
    subtitle: 'Daily Action Verbs & Forms',
    description: 'Master vital daily action verbs, forms (V1, V2, V3), and natural sentence usages with Sinhala meanings.',
    tag: 'Action Verbs & Forms',
    iconName: 'Zap',
    colorTheme: 'rose',
  },
];

export const CARDS_STORAGE_KEY = 'speakflow_cards_v1';

export function getStoredCards(): LearningCard[] {
  try {
    const raw = localStorage.getItem(CARDS_STORAGE_KEY);
    if (!raw) return DEFAULT_CARDS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Filter out the 4 removed cards from Home: reading, listening, speaking, conversation
      const removedIds = ['reading', 'listening', 'speaking', 'conversation'];
      let updated = parsed.filter(
        (c: LearningCard) => !removedIds.includes(c.id) && !removedIds.includes(c.skillType)
      );

      const hasWriting = updated.some((c: LearningCard) => c.id === 'writing' || c.skillType === 'writing');
      const hasSpoken = updated.some((c: LearningCard) => c.id === 'spoken_oral' || c.skillType === 'spoken_oral');
      const hasGrammar = updated.some((c: LearningCard) => c.id === 'grammar' || c.skillType === 'grammar');
      const hasSimpleSentence = updated.some(
        (c: LearningCard) => c.id === 'simple_sentence' || c.skillType === 'simple_sentence'
      );
      const hasEssentialVerbs = updated.some(
        (c: LearningCard) => c.id === 'essential_verbs' || c.skillType === 'essential_verbs'
      );

      if (!hasWriting) {
        const writingCard = DEFAULT_CARDS.find((c) => c.id === 'writing');
        if (writingCard) updated.push(writingCard);
      }

      if (!hasSpoken) {
        const spokenCard = DEFAULT_CARDS.find((c) => c.id === 'spoken_oral');
        if (spokenCard) updated.push(spokenCard);
      }

      if (!hasGrammar) {
        const grammarCard = DEFAULT_CARDS.find((c) => c.id === 'grammar');
        if (grammarCard) updated.push(grammarCard);
      }

      if (!hasSimpleSentence) {
        const simpleSentenceCard = DEFAULT_CARDS.find((c) => c.id === 'simple_sentence');
        if (simpleSentenceCard) updated.push(simpleSentenceCard);
      }

      if (!hasEssentialVerbs) {
        const verbsCard = DEFAULT_CARDS.find((c) => c.id === 'essential_verbs');
        if (verbsCard) updated.push(verbsCard);
      }

      saveStoredCards(updated);
      return updated;
    }
  } catch (err) {
    console.error('Failed to load cards from storage', err);
  }
  return DEFAULT_CARDS;
}

export function saveStoredCards(cards: LearningCard[]): void {
  try {
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
  } catch (err) {
    console.error('Failed to save cards to storage', err);
  }
}

export const ICON_COMPONENTS: Record<CardIconName, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Headphones,
  Mic,
  MessageSquare,
  Sparkles,
  Trophy,
  PenTool,
  Globe,
  Zap,
};

export interface CardThemeStyle {
  glassCard: string;
  glassGlow: string;
  iconBg: string;
  iconColor?: string;
  border: string;
  glow: string;
  badge: string;
  actionBtn: string;
  highlight: string;
  accentBar: string;
}

export const THEME_STYLES: Record<CardColorTheme, CardThemeStyle> = {
  emerald: {
    glassCard: 'bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-emerald-600/20 backdrop-blur-xl border-emerald-400/40 hover:border-emerald-400/70',
    glassGlow: 'shadow-[0_8px_25px_rgba(16,185,129,0.15)] hover:shadow-[0_14px_35px_rgba(16,185,129,0.25)]',
    iconBg: 'bg-emerald-500/20 text-emerald-800 border-emerald-300/60 shadow-2xs group-hover:bg-emerald-500/30',
    border: 'border-emerald-300/40 hover:border-emerald-400/70',
    glow: 'hover:shadow-[0_14px_35px_rgba(16,185,129,0.22)]',
    badge: 'bg-emerald-500/15 text-emerald-900 border-emerald-300/60 backdrop-blur-md',
    actionBtn: 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700',
    highlight: 'text-emerald-700',
    accentBar: 'bg-emerald-500',
  },
  sky: {
    glassCard: 'bg-gradient-to-br from-sky-500/15 via-blue-500/10 to-cyan-600/20 backdrop-blur-xl border-sky-300/40 hover:border-sky-400/70',
    glassGlow: 'shadow-[0_8px_25px_rgba(14,165,233,0.15)] hover:shadow-[0_14px_35px_rgba(14,165,233,0.25)]',
    iconBg: 'bg-sky-500/20 text-sky-800 border-sky-300/60 shadow-2xs group-hover:bg-sky-500/30',
    border: 'border-sky-300/40 hover:border-sky-400/70',
    glow: 'hover:shadow-[0_14px_35px_rgba(14,165,233,0.22)]',
    badge: 'bg-sky-500/15 text-sky-900 border-sky-300/60 backdrop-blur-md',
    actionBtn: 'bg-sky-600 text-white shadow-2xs hover:bg-sky-700',
    highlight: 'text-sky-700',
    accentBar: 'bg-sky-500',
  },
  amber: {
    glassCard: 'bg-gradient-to-br from-amber-500/18 via-orange-500/12 to-yellow-500/20 backdrop-blur-xl border-amber-300/50 hover:border-amber-400/80',
    glassGlow: 'shadow-[0_8px_25px_rgba(245,158,11,0.18)] hover:shadow-[0_14px_35px_rgba(245,158,11,0.30)]',
    iconBg: 'bg-amber-500/25 text-amber-900 border-amber-300/70 shadow-2xs group-hover:bg-amber-500/35',
    border: 'border-amber-300/50 hover:border-amber-400/80',
    glow: 'hover:shadow-[0_14px_35px_rgba(245,158,11,0.25)]',
    badge: 'bg-amber-500/20 text-amber-950 border-amber-300/70 backdrop-blur-md',
    actionBtn: 'bg-amber-600 text-white shadow-2xs hover:bg-amber-700',
    highlight: 'text-amber-800',
    accentBar: 'bg-amber-500',
  },
  indigo: {
    glassCard: 'bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-blue-600/20 backdrop-blur-xl border-indigo-300/40 hover:border-indigo-400/70',
    glassGlow: 'shadow-[0_8px_25px_rgba(99,102,241,0.15)] hover:shadow-[0_14px_35px_rgba(99,102,241,0.25)]',
    iconBg: 'bg-indigo-500/20 text-indigo-800 border-indigo-300/60 shadow-2xs group-hover:bg-indigo-500/30',
    border: 'border-indigo-300/40 hover:border-indigo-400/70',
    glow: 'hover:shadow-[0_14px_35px_rgba(99,102,241,0.22)]',
    badge: 'bg-indigo-500/15 text-indigo-900 border-indigo-300/60 backdrop-blur-md',
    actionBtn: 'bg-indigo-600 text-white shadow-2xs hover:bg-indigo-700',
    highlight: 'text-indigo-700',
    accentBar: 'bg-indigo-500',
  },
  purple: {
    glassCard: 'bg-gradient-to-br from-purple-500/15 via-fuchsia-500/10 to-violet-600/20 backdrop-blur-xl border-purple-300/40 hover:border-purple-400/70',
    glassGlow: 'shadow-[0_8px_25px_rgba(168,85,247,0.15)] hover:shadow-[0_14px_35px_rgba(168,85,247,0.25)]',
    iconBg: 'bg-purple-500/20 text-purple-800 border-purple-300/60 shadow-2xs group-hover:bg-purple-500/30',
    border: 'border-purple-300/40 hover:border-purple-400/70',
    glow: 'hover:shadow-[0_14px_35px_rgba(168,85,247,0.22)]',
    badge: 'bg-purple-500/15 text-purple-900 border-purple-300/60 backdrop-blur-md',
    actionBtn: 'bg-purple-600 text-white shadow-2xs hover:bg-purple-700',
    highlight: 'text-purple-700',
    accentBar: 'bg-purple-500',
  },
  rose: {
    glassCard: 'bg-gradient-to-br from-rose-500/15 via-pink-500/10 to-red-500/20 backdrop-blur-xl border-rose-300/40 hover:border-rose-400/70',
    glassGlow: 'shadow-[0_8px_25px_rgba(244,63,94,0.15)] hover:shadow-[0_14px_35px_rgba(244,63,94,0.25)]',
    iconBg: 'bg-rose-500/20 text-rose-800 border-rose-300/60 shadow-2xs group-hover:bg-rose-500/30',
    border: 'border-rose-300/40 hover:border-rose-400/70',
    glow: 'hover:shadow-[0_14px_35px_rgba(244,63,94,0.22)]',
    badge: 'bg-rose-500/15 text-rose-900 border-rose-300/60 backdrop-blur-md',
    actionBtn: 'bg-rose-600 text-white shadow-2xs hover:bg-rose-700',
    highlight: 'text-rose-700',
    accentBar: 'bg-rose-500',
  },
  teal: {
    glassCard: 'bg-gradient-to-br from-teal-500/15 via-emerald-500/10 to-cyan-600/20 backdrop-blur-xl border-teal-300/40 hover:border-teal-400/70',
    glassGlow: 'shadow-[0_8px_25px_rgba(20,184,166,0.15)] hover:shadow-[0_14px_35px_rgba(20,184,166,0.25)]',
    iconBg: 'bg-teal-500/20 text-teal-800 border-teal-300/60 shadow-2xs group-hover:bg-teal-500/30',
    border: 'border-teal-300/40 hover:border-teal-400/70',
    glow: 'hover:shadow-[0_14px_35px_rgba(20,184,166,0.22)]',
    badge: 'bg-teal-500/15 text-teal-900 border-teal-300/60 backdrop-blur-md',
    actionBtn: 'bg-teal-600 text-white shadow-2xs hover:bg-teal-700',
    highlight: 'text-teal-700',
    accentBar: 'bg-teal-500',
  },
  orange: {
    glassCard: 'bg-gradient-to-br from-orange-500/15 via-amber-500/10 to-red-500/20 backdrop-blur-xl border-orange-300/40 hover:border-orange-400/70',
    glassGlow: 'shadow-[0_8px_25px_rgba(249,115,22,0.15)] hover:shadow-[0_14px_35px_rgba(249,115,22,0.25)]',
    iconBg: 'bg-orange-500/20 text-orange-800 border-orange-300/60 shadow-2xs group-hover:bg-orange-500/30',
    border: 'border-orange-300/40 hover:border-orange-400/70',
    glow: 'hover:shadow-[0_14px_35px_rgba(249,115,22,0.22)]',
    badge: 'bg-orange-500/15 text-orange-900 border-orange-300/60 backdrop-blur-md',
    actionBtn: 'bg-orange-600 text-white shadow-2xs hover:bg-orange-700',
    highlight: 'text-orange-700',
    accentBar: 'bg-orange-500',
  },
};
