import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Volume2,
  Search,
  Filter,
  SlidersHorizontal,
  TableProperties,
  Layers,
  Brain,
  ListFilter,
  Check,
  Copy,
  Plus,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  RotateCcw,
  BookOpen,
  Edit2,
  Trash2,
  Save,
} from 'lucide-react';
import { EssentialVerbItem, VerbPackCard, UserProfile } from '../../types';
import {
  getStoredEssentialVerbs,
  saveStoredEssentialVerbs,
  getStoredVerbCategories,
  getStoredVerbPacks,
  DEFAULT_VERB_PACKS,
  speakVerbText,
} from '../../data/essentialVerbsData';
import { getCurrentUser } from '../../utils/authStorage';

interface EssentialVerbsHubProps {
  onOpenAdmin?: () => void;
  currentUser?: UserProfile | null;
}

export const EssentialVerbsHub: React.FC<EssentialVerbsHubProps> = ({
  onOpenAdmin,
  currentUser: propUser,
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => propUser ?? getCurrentUser());

  useEffect(() => {
    if (propUser !== undefined) {
      setCurrentUser(propUser);
      return;
    }
    const handleAuth = () => setCurrentUser(getCurrentUser());
    window.addEventListener('auth-state-changed', handleAuth);
    return () => window.removeEventListener('auth-state-changed', handleAuth);
  }, [propUser]);

  const isAdmin = currentUser?.role === 'admin';

  const [packs, setPacks] = useState<VerbPackCard[]>(() => getStoredVerbPacks());
  const [activePackId, setActivePackId] = useState<string | null>(null);

  const [verbs, setVerbs] = useState<EssentialVerbItem[]>(() => getStoredEssentialVerbs());
  const [categories, setCategories] = useState<string[]>(() => getStoredVerbCategories());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [rangeFilter, setRangeFilter] = useState<string>('all');
  
  // Default to compact list for mobile-first sleek vertical scrolling
  const [viewMode, setViewMode] = useState<'compact' | 'table' | 'cards' | 'flashcards'>('compact');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick Add Verb Form State
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [sinhalaInput, setSinhalaInput] = useState('');
  const [v1Input, setV1Input] = useState('');
  const [v2Input, setV2Input] = useState('');
  const [v3Input, setV3Input] = useState('');
  const [v4Input, setV4Input] = useState('');
  const [v5Input, setV5Input] = useState('');
  const [categoryInput, setCategoryInput] = useState('Daily Routine');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Flashcard mode state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Editing Verb Modal State
  const [editingVerb, setEditingVerb] = useState<EssentialVerbItem | null>(null);
  const [editSinhala, setEditSinhala] = useState('');
  const [editV1, setEditV1] = useState('');
  const [editV2, setEditV2] = useState('');
  const [editV3, setEditV3] = useState('');
  const [editV4, setEditV4] = useState('');
  const [editV5, setEditV5] = useState('');
  const [editCategory, setEditCategory] = useState('Daily Routine');
  const [editCardId, setEditCardId] = useState('essential-verbs-1');
  const [editExampleSentence, setEditExampleSentence] = useState('');
  const [editExampleSinhala, setEditExampleSinhala] = useState('');
  const [editIsIrregular, setEditIsIrregular] = useState(false);

  const handleStartEdit = (item: EssentialVerbItem) => {
    setEditingVerb(item);
    setEditSinhala(item.sinhalaMeaning || '');
    setEditV1(item.verb || '');
    setEditV2(item.pastSimple || '');
    setEditV3(item.pastParticiple || '');
    setEditV4(item.sOrEsForm || '');
    setEditV5(item.ingForm || '');
    setEditCategory(item.category || 'Daily Routine');
    setEditCardId(item.cardId || activePack.id);
    setEditExampleSentence(item.exampleSentence || '');
    setEditExampleSinhala(item.exampleSinhala || '');
    setEditIsIrregular(!!item.isIrregular);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVerb || !editV1.trim() || !editSinhala.trim()) {
      showToast('කරුණාකර Verb සහ සිංහල තේරුම ඇතුළත් කරන්න.');
      return;
    }

    const updated = verbs.map((v) => {
      if (v.id === editingVerb.id) {
        return {
          ...v,
          verb: editV1.trim(),
          sinhalaMeaning: editSinhala.trim(),
          pastSimple: editV2.trim() || v.pastSimple,
          pastParticiple: editV3.trim() || v.pastParticiple,
          sOrEsForm: editV4.trim() || v.sOrEsForm,
          ingForm: editV5.trim() || v.ingForm,
          category: editCategory.trim(),
          cardId: editCardId || activePack.id,
          exampleSentence: editExampleSentence.trim(),
          exampleSinhala: editExampleSinhala.trim(),
          isIrregular: editIsIrregular,
        };
      }
      return v;
    });

    setVerbs(updated);
    saveStoredEssentialVerbs(updated);
    setEditingVerb(null);
    showToast(`"${editV1}" ක්‍රියාපදය සාර්ථකව යාවත්කාලීන විය!`);
  };

  const handleDeleteVerb = (id: string, name: string) => {
    if (window.confirm(`"${name}" ක්‍රියාපදය මෙම Card එකෙන් ඉවත් කිරීමට (Delete) ඔබට විශ්වාසද?`)) {
      const updated = verbs.filter((v) => v.id !== id);
      setVerbs(updated);
      saveStoredEssentialVerbs(updated);
      showToast(`"${name}" ක්‍රියාපදය ඉවත් කරන ලදී.`);
    }
  };

  // Reload on window storage change
  useEffect(() => {
    const handleStorage = () => {
      setPacks(getStoredVerbPacks());
      setVerbs(getStoredEssentialVerbs());
      setCategories(getStoredVerbCategories());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Currently active pack and its verbs
  const activePack = useMemo(() => {
    return packs.find((p) => p.id === activePackId) || packs[0] || DEFAULT_VERB_PACKS[0];
  }, [packs, activePackId]);

  const verbsInActivePack = useMemo(() => {
    return verbs.filter((v) => (v.cardId || 'essential-verbs-1') === activePack.id);
  }, [verbs, activePack.id]);

  // Show temporary toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Smart helper: when user types V1, predict standard regular V2, V3, V4, V5
  const handleV1Change = (val: string) => {
    setV1Input(val);
    const trimmed = val.trim().toLowerCase();
    if (!trimmed) return;

    // Only auto-fill if fields are currently empty or unchanged
    if (!v2Input || v2Input.toLowerCase().startsWith(trimmed)) {
      if (trimmed.endsWith('e')) {
        setV2Input(val + 'd');
        setV3Input(val + 'd');
      } else if (trimmed.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(trimmed.charAt(trimmed.length - 2))) {
        const base = val.slice(0, -1);
        setV2Input(base + 'ied');
        setV3Input(base + 'ied');
      } else {
        setV2Input(val + 'ed');
        setV3Input(val + 'ed');
      }
    }

    if (!v4Input || v4Input.toLowerCase().startsWith(trimmed)) {
      if (trimmed.endsWith('s') || trimmed.endsWith('sh') || trimmed.endsWith('ch') || trimmed.endsWith('x') || trimmed.endsWith('z')) {
        setV4Input(val + 'es');
      } else if (trimmed.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(trimmed.charAt(trimmed.length - 2))) {
        setV4Input(val.slice(0, -1) + 'ies');
      } else {
        setV4Input(val + 's');
      }
    }

    if (!v5Input || v5Input.toLowerCase().startsWith(trimmed)) {
      if (trimmed.endsWith('e') && !trimmed.endsWith('ee')) {
        setV5Input(val.slice(0, -1) + 'ing');
      } else {
        setV5Input(val + 'ing');
      }
    }
  };

  // Handle Quick Add Submit
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sinhalaInput.trim()) {
      showToast('කරුණාකර සිංහල තේරුම ඇතුළත් කරන්න!');
      return;
    }
    if (!v1Input.trim()) {
      showToast('Please enter the Present verb (V1)!');
      return;
    }

    const nextNumber = verbsInActivePack.length + 1;
    const newVerb: EssentialVerbItem = {
      id: `verb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      cardId: activePack.id,
      number: nextNumber,
      verb: v1Input.trim(),
      pastSimple: v2Input.trim() || v1Input.trim(),
      pastParticiple: v3Input.trim() || v1Input.trim(),
      sOrEsForm: v4Input.trim() || `${v1Input.trim()}s`,
      ingForm: v5Input.trim() || `${v1Input.trim()}ing`,
      sinhalaMeaning: sinhalaInput.trim(),
      category: categoryInput.trim() || 'General',
      isIrregular: false,
      createdAt: Date.now(),
    };

    const updated = [...verbs, newVerb];
    setVerbs(updated);
    saveStoredEssentialVerbs(updated);

    // Reset inputs
    setSinhalaInput('');
    setV1Input('');
    setV2Input('');
    setV3Input('');
    setV4Input('');
    setV5Input('');
    setIsAddFormOpen(false);

    showToast(`"${newVerb.verb}" (#${nextNumber}) added to "${activePack.title}"!`);
  };

  // Available unique starting letters in active pack
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    verbsInActivePack.forEach((v) => {
      const char = v.verb.trim().charAt(0).toUpperCase();
      if (char >= 'A' && char <= 'Z') {
        letters.add(char);
      }
    });
    return Array.from(letters).sort();
  }, [verbsInActivePack]);

  // Filtered verbs based on category, range, letter, search query in active pack
  const filteredVerbs = useMemo(() => {
    return verbsInActivePack.filter((item, index) => {
      // Range filter
      if (rangeFilter !== 'all') {
        const [startStr, endStr] = rangeFilter.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          if (index + 1 < start || index + 1 > end) return false;
        }
      }

      // Letter filter
      if (selectedLetter !== 'ALL') {
        if (!item.verb.toUpperCase().startsWith(selectedLetter)) {
          return false;
        }
      }

      // Category filter
      const matchesCat =
        selectedCategory === 'All'
          ? true
          : selectedCategory === 'Irregular Verbs'
          ? !!item.isIrregular
          : item.category?.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesCat) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.verb.toLowerCase().includes(q) ||
        item.pastSimple.toLowerCase().includes(q) ||
        item.pastParticiple.toLowerCase().includes(q) ||
        (item.sOrEsForm && item.sOrEsForm.toLowerCase().includes(q)) ||
        (item.ingForm && item.ingForm.toLowerCase().includes(q)) ||
        item.sinhalaMeaning.toLowerCase().includes(q) ||
        (item.number && item.number.toString() === q) ||
        (item.exampleSentence && item.exampleSentence.toLowerCase().includes(q))
      );
    });
  }, [verbsInActivePack, selectedCategory, selectedLetter, rangeFilter, searchQuery]);

  // Handle Speech
  const handleSpeak = (text: string, id: string) => {
    if (speakingId === id) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingId(null);
      return;
    }

    setSpeakingId(id);
    const spoken = speakVerbText(
      text,
      speechRate,
      () => setSpeakingId(null),
      () => setSpeakingId(null)
    );
    if (!spoken) setSpeakingId(null);
  };

  // Copy text helper
  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Flashcard navigation
  const currentCard = filteredVerbs[flashcardIndex] || filteredVerbs[0];

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev + 1) % (filteredVerbs.length || 1));
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev - 1 + filteredVerbs.length) % (filteredVerbs.length || 1));
  };

  // When no card is chosen, display the Essential Verbs Cards Grid
  if (activePackId === null) {
    return (
      <div id="essential-verbs-cards-grid" className="space-y-6 sm:space-y-8 pb-16 animate-in fade-in duration-300">
        {/* Toast notification */}
        {toastMessage && (
          <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Banner */}
        <div className="text-center max-w-xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200/80 text-xs font-bold shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
            <span>Essential Verbs Studio (ක්‍රියාපද අභ්‍යාස මධ්‍යස්ථානය)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Essential Verbs
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Select a Verb Card below to explore daily action verbs, forms (V1, V2, V3, V4, V5) and Sinhala meanings (අධ්‍යයනය සඳහා පහත කාඩ්පතක් තෝරන්න).
          </p>
          {onOpenAdmin && (
            <div className="pt-1.5 flex items-center justify-center gap-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer hover:scale-102"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
                <span>Admin Studio (කාඩ්පත් කළමනාකරණය)</span>
              </button>
            </div>
          )}
        </div>

        {/* Verb Cards Grid: Essential Verbs 1, Essential Verbs 2 (2 columns side by side on mobile) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-5 max-w-3xl mx-auto px-0.5">
          {packs.map((pack) => {
            const countInPack = verbs.filter((v) => (v.cardId || 'essential-verbs-1') === pack.id).length;
            const isFirst = pack.id === 'essential-verbs-1';
            const themeGradient = isFirst
              ? 'from-rose-500/10 via-amber-500/5 to-rose-600/15 border-rose-200/90 hover:border-rose-400 shadow-rose-500/5 hover:shadow-rose-500/15'
              : 'from-indigo-500/10 via-sky-500/5 to-purple-600/15 border-indigo-200/90 hover:border-indigo-400 shadow-indigo-500/5 hover:shadow-indigo-500/15';
            const iconBg = isFirst ? 'bg-rose-500 text-white shadow-rose-500/30' : 'bg-indigo-600 text-white shadow-indigo-500/30';
            const badgeBg = isFirst
              ? 'bg-rose-100 text-rose-800 border-rose-200'
              : 'bg-indigo-100 text-indigo-800 border-indigo-200';
            const btnBg = isFirst
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/25'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25';

            return (
              <motion.div
                key={pack.id}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                onClick={() => {
                  setActivePackId(pack.id);
                  setFlashcardIndex(0);
                }}
                className={`group cursor-pointer rounded-2xl sm:rounded-3xl p-3 sm:p-5 bg-gradient-to-br ${themeGradient} bg-white/95 backdrop-blur-xl border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden`}
              >
                {/* Ambient glow decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

                <div className="space-y-2 sm:space-y-3 relative z-10">
                  {/* Top Row with Icon and Count Badge */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${iconBg}`}>
                      {isFirst ? <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> : <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                    <span className={`text-[9px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full border shadow-2xs truncate ${badgeBg}`}>
                      {countInPack > 0 ? `${countInPack} Verbs` : 'Soon'}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-sm sm:text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors leading-tight">
                      {pack.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-600 mt-0.5 leading-tight line-clamp-1">
                      {pack.subtitle || (isFirst ? 'Daily Action Verbs' : 'Advanced Verbs')}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-[10px] sm:text-xs text-slate-500 leading-snug line-clamp-2 hidden xs:block">
                    {pack.description || (isFirst
                      ? 'Master 1,000+ vital action verbs with Sinhala meanings and forms.'
                      : 'Explore conversational verbs for fluent English.')}
                  </p>

                  {/* Feature Badges */}
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    <span className="text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-white/80 text-slate-600 border border-slate-200/70">
                      V1 - V5
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-white/80 text-slate-600 border border-slate-200/70">
                      සිංහල
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-white/80 text-slate-600 border border-slate-200/70">
                      Audio
                    </span>
                  </div>
                </div>

                {/* Bottom CTA Bar */}
                <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-slate-200/60 relative z-10 flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors hidden sm:inline">
                    {countInPack > 0 ? `${countInPack} words` : 'View card'}
                  </span>
                  <div className={`w-full sm:w-auto inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black shadow-2xs transition-all ${btnBg} group-hover:gap-2`}>
                    <span>Open (බලන්න)</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div id="essential-verbs-hub" className="space-y-4 sm:space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation: Back to Cards + Direct Pack Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          onClick={() => setActivePackId(null)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs transition-all cursor-pointer hover:shadow-xs group"
        >
          <ArrowLeft className="w-4 h-4 text-rose-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>← Back to Verb Cards (සියලුම කාඩ්පත්)</span>
        </button>

        {/* Quick Switcher for Fast Toggling between Essential Verbs 1 & 2 */}
        <div className="inline-flex items-center gap-1.5 bg-white/90 border border-slate-200/90 p-1 rounded-2xl shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 px-2 hidden sm:inline">Active Card:</span>
          {packs.map((p) => {
            const isCurrent = p.id === activePack.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActivePackId(p.id);
                  setFlashcardIndex(0);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {p.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Banner & Title */}
      <div className="rounded-3xl bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-rose-600/15 border border-rose-200/80 p-4 sm:p-6 shadow-xs backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-300/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/90 border border-rose-300/80 text-rose-900 text-xs font-bold shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
              <span>Card: {activePack.title} ({verbsInActivePack.length} Verbs)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activePack.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activePack.subtitle || 'Daily Action Verbs & Forms'} •{' '}
              {activePack.description || 'Master vital action verbs, forms (V1, V2, V3, V4, V5) and Sinhala meanings.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Pronunciation Speed Toggle */}
            <div className="inline-flex items-center gap-1 bg-white/90 border border-slate-200/80 p-1 rounded-2xl shadow-2xs text-xs font-bold text-slate-700">
              <span className="px-2 text-slate-400 text-[11px]">Speed:</span>
              <button
                onClick={() => setSpeechRate(0.75)}
                className={`px-2 py-0.5 rounded-xl transition-all cursor-pointer ${
                  speechRate === 0.75 ? 'bg-rose-500 text-white shadow-xs' : 'hover:bg-slate-100'
                }`}
              >
                0.75x
              </button>
              <button
                onClick={() => setSpeechRate(0.95)}
                className={`px-2 py-0.5 rounded-xl transition-all cursor-pointer ${
                  speechRate === 0.95 ? 'bg-rose-500 text-white shadow-xs' : 'hover:bg-slate-100'
                }`}
              >
                1.0x
              </button>
            </div>

            {/* Quick Add Verb Button */}
            <button
              onClick={() => setIsAddFormOpen(!isAddFormOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-98"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddFormOpen ? 'Close Add Form' : `+ Add Verb`}</span>
            </button>

            {/* Admin Studio Button */}
            {onOpenAdmin && (
              <button
                id="verbs-open-admin-btn"
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Admin Studio</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* VERB CARDS SELECTOR (2 Visual Cards: Essential Verbs 1 & Essential Verbs 2) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Select Verb Card (කාඩ්පත තෝරන්න):
            </span>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 shadow-2xs">
              Open: {activePack.title}
            </span>
          </div>

          {isAdmin && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded-xl border border-rose-200 shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Admin Studio</span>
            </button>
          )}
        </div>

        {/* 2 Full Interactive Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {packs.map((pack) => {
            const isCurrent = pack.id === activePack.id;
            const countInPack = verbs.filter((v) => (v.cardId || 'essential-verbs-1') === pack.id).length;
            const isFirst = pack.id === 'essential-verbs-1';

            return (
              <div
                key={pack.id}
                onClick={() => {
                  setActivePackId(pack.id);
                  setFlashcardIndex(0);
                }}
                className={`relative rounded-3xl p-4 sm:p-5 transition-all duration-200 cursor-pointer overflow-hidden border ${
                  isCurrent
                    ? isFirst
                      ? 'bg-gradient-to-br from-rose-50/90 via-white to-amber-50/40 border-rose-400 ring-4 ring-rose-500/15 shadow-md'
                      : 'bg-gradient-to-br from-indigo-50/90 via-white to-sky-50/40 border-indigo-400 ring-4 ring-indigo-500/15 shadow-md'
                    : 'bg-white hover:bg-slate-50/90 border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-slate-300'
                }`}
              >
                {/* Active Indicator Top Accent Bar */}
                {isCurrent && (
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 ${
                      isFirst
                        ? 'bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600'
                        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500'
                    }`}
                  />
                )}

                <div className="flex items-start justify-between gap-3">
                  {/* Left: Icon & Titles */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-transform ${
                        isCurrent
                          ? isFirst
                            ? 'bg-rose-600 text-white shadow-rose-500/30 ring-2 ring-rose-200 scale-105'
                            : 'bg-indigo-600 text-white shadow-indigo-500/30 ring-2 ring-indigo-200 scale-105'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isFirst ? (
                        <Zap className={`w-5 h-5 sm:w-6 sm:h-6 ${isCurrent ? 'fill-white' : ''}`} />
                      ) : (
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                          {pack.title}
                        </h3>
                        {isCurrent && (
                          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {pack.subtitle || (isFirst ? 'Daily Action Verbs & Forms' : 'Advanced & Conversational Verbs')}
                      </p>
                    </div>
                  </div>

                  {/* Right: Count Badge */}
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-2xs whitespace-nowrap shrink-0 ${
                      isCurrent
                        ? isFirst
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-indigo-100 text-indigo-800 border-indigo-300'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {countInPack} Verbs
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 mt-2.5 leading-relaxed line-clamp-1">
                  {pack.description || (isFirst
                    ? 'Master 250 vital action verbs with Sinhala meanings and 5 forms.'
                    : 'Next level action verbs and expressive conversational vocabulary.')}
                </p>

                {/* Bottom Bar: Status + Open Action */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] font-bold">
                    {isCurrent ? (
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Active & Open (දැනට විවෘතයි)</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        {countInPack > 0 ? `${countInPack} words available` : 'Empty pack (වචන නොමැත)'}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePackId(pack.id);
                      setFlashcardIndex(0);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-2xs transition-all cursor-pointer ${
                      isCurrent
                        ? isFirst
                          ? 'bg-rose-600 text-white shadow-rose-500/20'
                          : 'bg-indigo-600 text-white shadow-indigo-500/20'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{isCurrent ? 'Viewing Verbs (බලමින්)' : 'Open Card (විවෘත කරන්න)'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK ADD VERB EXPANDABLE FORM - STRICTLY FOR ADMIN ONLY */}
      <AnimatePresence>
        {isAdmin && isAddFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleQuickAdd}
              className="bg-white rounded-3xl border-2 border-rose-300 p-4 sm:p-6 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">
                    #{verbs.length + 1}
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    නව ක්‍රියාපදයක් එකතු කරන්න (Add New Verb)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Strict Requested Order:
                  1. Sinhala Meaning
                  2. Present (V1)
                  3. Past (V2)
                  4. Past Participle (V3)
                  5. s/es (V4)
                  6. ing (V5)
              */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* 1. Sinhala Meaning */}
                <div className="lg:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    1. සිංහල තේරුම <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={sinhalaInput}
                    onChange={(e) => setSinhalaInput(e.target.value)}
                    placeholder="උදා: සෙල්ලම් කරනවා"
                    className="w-full px-3 py-2 bg-rose-50/50 border border-rose-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    required
                  />
                </div>

                {/* 2. Present (V1) */}
                <div className="lg:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    2. Present (V1) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={v1Input}
                    onChange={(e) => handleV1Change(e.target.value)}
                    placeholder="e.g. Play"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    required
                  />
                </div>

                {/* 3. Past (V2) */}
                <div className="lg:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    3. Past (V2)
                  </label>
                  <input
                    type="text"
                    value={v2Input}
                    onChange={(e) => setV2Input(e.target.value)}
                    placeholder="e.g. Played"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                {/* 4. Past Participle (V3) */}
                <div className="lg:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    4. Past Participle (V3)
                  </label>
                  <input
                    type="text"
                    value={v3Input}
                    onChange={(e) => setV3Input(e.target.value)}
                    placeholder="e.g. Played"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                {/* 5. s/es (V4) */}
                <div className="lg:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    5. s/es (V4)
                  </label>
                  <input
                    type="text"
                    value={v4Input}
                    onChange={(e) => setV4Input(e.target.value)}
                    placeholder="e.g. Plays"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                {/* 6. ing (V5) */}
                <div className="lg:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    6. ing (V5)
                  </label>
                  <input
                    type="text"
                    value={v5Input}
                    onChange={(e) => setV5Input(e.target.value)}
                    placeholder="e.g. Playing"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">Category:</span>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
                  >
                    <option value="Daily Routine">Daily Routine</option>
                    <option value="Communication">Communication</option>
                    <option value="Movement">Movement</option>
                    <option value="Work & Study">Work & Study</option>
                    <option value="Feelings">Feelings</option>
                    <option value="Action">Action</option>
                    <option value="Irregular Verbs">Irregular Verbs</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddFormOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md active:scale-98 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save to Web (පහළට එකතු කරන්න)</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Bar: Search & View Switcher */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search English verb (V1-V5) or සිංහල තේරුම..."
              className="w-full pl-10 pr-12 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Modes Switcher */}
          <div className="flex items-center justify-end gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60 self-start sm:self-auto overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setViewMode('compact')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'compact'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Clean vertical straight list for mobile screens"
            >
              <ListFilter className="w-3.5 h-3.5 text-rose-500" />
              <span>Compact List</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Full horizontal data table"
            >
              <TableProperties className="w-3.5 h-3.5 text-rose-500" />
              <span>Full Table</span>
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-rose-500" />
              <span>Cards</span>
            </button>

            <button
              onClick={() => {
                setViewMode('flashcards');
                setIsFlipped(false);
                setFlashcardIndex(0);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'flashcards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-rose-500" />
              <span>Quiz</span>
            </button>
          </div>
        </div>

        {/* Quick Range Selector */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1">Range:</span>
          {[
            { id: 'all', label: `All (${verbsInActivePack.length})` },
            { id: '1-100', label: '1 - 100' },
            { id: '101-250', label: '101 - 250' },
            { id: '251-500', label: '251 - 500' },
            { id: '501-750', label: '501 - 750' },
            { id: '751-1100', label: '751 - 1000+' },
          ].map((rng) => (
            <button
              key={rng.id}
              onClick={() => setRangeFilter(rng.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                rangeFilter === rng.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {rng.label}
            </button>
          ))}
        </div>

        {/* Alphabet Jump Bar (A-Z) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1">A-Z:</span>
          <button
            onClick={() => setSelectedLetter('ALL')}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
              selectedLetter === 'ALL'
                ? 'bg-rose-500 text-white'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          {availableLetters.map((ltr) => (
            <button
              key={ltr}
              onClick={() => setSelectedLetter(ltr)}
              className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                selectedLetter === ltr
                  ? 'bg-rose-500 text-white shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {ltr}
            </button>
          ))}
        </div>
      </div>

      {/* When active pack has no verbs, show a clean, friendly empty state card */}
      {verbsInActivePack.length === 0 ? (
        <div className="bg-white/95 rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100 shadow-2xs">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            {activePack.title} is being prepared
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            මෙම Verb Card එකෙහි වචන මේ වන විට ගුරුවරයා විසින් සකස් කරමින් පවතී (No verbs added yet in this pack). ඉක්මනින් නව වචන එකතු කරනු ඇත!
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => setActivePackId('essential-verbs-1')}
              className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Explore Essential Verbs 1 (වචන 1,000+ බලන්න) →
            </button>
            <button
              onClick={() => setActivePackId(null)}
              className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Back to Cards (කාඩ්පත් වෙත)
            </button>
          </div>
          {isAdmin && (
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsAddFormOpen(true)}
                className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add First Verb to {activePack.title}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Results Count & Quick Stats */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-900">{filteredVerbs.length}</strong> of{' '}
              <strong className="text-slate-900">{verbsInActivePack.length}</strong> verbs in order
            </span>
            {searchQuery && (
              <span className="text-rose-600 font-medium">
                Filtered by &quot;{searchQuery}&quot;
              </span>
            )}
          </div>

      {/* =========================================================================
          VIEW 1: COMPACT LIST (Mobile-First Straight Vertical Row - "kelin digata podiwata")
          Header and Rows in exact requested order:
          # | සිංහල තේරුම | Present | Past | Past Participle | s/es | ing | Audio
         ========================================================================= */}
      {viewMode === 'compact' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          {/* Sticky List Header */}
          <div className="bg-slate-100/90 border-b border-slate-200 px-3 sm:px-4 py-2.5 grid grid-cols-12 gap-1 sm:gap-2 text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-wider items-center">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-3 sm:col-span-2 text-rose-800">සිංහල තේරුම</div>
            <div className="col-span-2 sm:col-span-2 text-slate-900">Present (V1)</div>
            <div className="col-span-2 sm:col-span-2 text-rose-700">Past (V2)</div>
            <div className="col-span-2 sm:col-span-2 text-indigo-700">Past Part. (V3)</div>
            <div className="hidden sm:block sm:col-span-1 text-emerald-700">s/es (V4)</div>
            <div className="hidden sm:block sm:col-span-1 text-sky-700">ing (V5)</div>
            <div className="col-span-2 sm:col-span-1 text-center">Actions</div>
          </div>

          {/* Downward List Items */}
          <div className="divide-y divide-slate-100">
            {filteredVerbs.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2">
                <p className="text-sm font-bold text-slate-700">කිසිදු ක්‍රියාපදයක් හමු නොවීය</p>
                <p className="text-xs text-slate-400">Search query හෝ filters වෙනස් කර නැවත උත්සාහ කරන්න.</p>
              </div>
            ) : (
              filteredVerbs.map((item, idx) => {
                const itemNum = item.number || idx + 1;
                const isSpeaking = speakingId === `cmp-${item.id}`;
                const isCopied = copiedId === `cmp-${item.id}`;

                return (
                  <div
                    key={item.id}
                    id={`verb-row-${item.id}`}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 grid grid-cols-12 gap-1 sm:gap-2 items-center hover:bg-rose-50/40 transition-colors text-xs"
                  >
                    {/* # Number Badge */}
                    <div className="col-span-1 text-center font-mono text-[11px] font-bold text-slate-400">
                      #{itemNum}
                    </div>

                    {/* 1. Sinhala Meaning */}
                    <div className="col-span-3 sm:col-span-2 font-bold text-slate-800 text-xs sm:text-[13px] truncate">
                      {item.sinhalaMeaning}
                    </div>

                    {/* 2. Present (V1) */}
                    <div className="col-span-2 sm:col-span-2 font-black text-slate-900 text-xs sm:text-[13px] truncate">
                      {item.verb}
                    </div>

                    {/* 3. Past (V2) */}
                    <div className="col-span-2 sm:col-span-2 font-bold text-rose-700 text-xs sm:text-[13px] truncate">
                      {item.pastSimple}
                    </div>

                    {/* 4. Past Participle (V3) */}
                    <div className="col-span-2 sm:col-span-2 font-bold text-indigo-700 text-xs sm:text-[13px] truncate">
                      {item.pastParticiple}
                    </div>

                    {/* 5. s/es (V4) - On mobile, displayed cleanly or hidden on ultra-small */}
                    <div className="hidden sm:block sm:col-span-1 font-medium text-emerald-700 text-xs truncate">
                      {item.sOrEsForm || `${item.verb}s`}
                    </div>

                    {/* 6. ing (V5) */}
                    <div className="hidden sm:block sm:col-span-1 font-medium text-sky-700 text-xs truncate">
                      {item.ingForm || `${item.verb}ing`}
                    </div>

                    {/* Audio & Actions Controls */}
                    <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-0.5 sm:gap-1">
                      <button
                        id={`speak-btn-${item.id}`}
                        onClick={() =>
                          handleSpeak(
                            `${item.verb}. Past tense: ${item.pastSimple}. Past participle: ${item.pastParticiple}. ${item.sOrEsForm ? `Third person: ${item.sOrEsForm}.` : ''} Continuous: ${item.ingForm || item.verb + 'ing'}.`,
                            `cmp-${item.id}`
                          )
                        }
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                          isSpeaking
                            ? 'bg-rose-500 text-white shadow-xs'
                            : 'text-rose-600 hover:bg-rose-100/70'
                        }`}
                        title="Listen to pronunciation"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                        title="Edit verb (සංස්කරණය කරන්න)"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteVerb(item.id, item.verb)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Delete verb (ඉවත් කරන්න)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          handleCopy(
                            `${item.sinhalaMeaning}: ${item.verb}, ${item.pastSimple}, ${item.pastParticiple}, ${item.sOrEsForm || item.verb + 's'}, ${item.ingForm || item.verb + 'ing'}`,
                            `cmp-${item.id}`
                          )
                        }
                        className="hidden lg:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                        title="Copy all forms"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: FULL DATA TABLE (All columns wide table)
          Header order: # | සිංහල තේරුම | Present (V1) | Past (V2) | Past Participle (V3) | s/es (V4) | ing (V5) | Audio
         ========================================================================= */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-600 uppercase tracking-wider text-[11px] font-black">
                  <th className="py-3 px-3.5 text-center">#</th>
                  <th className="py-3 px-3.5 text-rose-800">සිංහල තේරුම</th>
                  <th className="py-3 px-3.5 text-slate-900">Present (V1)</th>
                  <th className="py-3 px-3.5 text-rose-700">Past (V2)</th>
                  <th className="py-3 px-3.5 text-indigo-700">Past Participle (V3)</th>
                  <th className="py-3 px-3.5 text-emerald-700">s/es (V4)</th>
                  <th className="py-3 px-3.5 text-sky-700">ing (V5)</th>
                  <th className="py-3 px-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVerbs.map((item, idx) => {
                  const itemNum = item.number || idx + 1;
                  const isSpeaking = speakingId === `tbl-${item.id}`;
                  return (
                    <tr key={item.id} className="hover:bg-rose-50/40 transition-colors">
                      <td className="py-2.5 px-3.5 text-center font-mono text-slate-400 text-[11px] font-bold">
                        #{itemNum}
                      </td>
                      <td className="py-2.5 px-3.5 font-bold text-slate-800 text-[13px]">
                        {item.sinhalaMeaning}
                      </td>
                      <td className="py-2.5 px-3.5 font-black text-slate-900 text-[13px]">
                        {item.verb}
                      </td>
                      <td className="py-2.5 px-3.5 font-bold text-rose-700 text-[13px]">
                        {item.pastSimple}
                      </td>
                      <td className="py-2.5 px-3.5 font-bold text-indigo-700 text-[13px]">
                        {item.pastParticiple}
                      </td>
                      <td className="py-2.5 px-3.5 font-semibold text-emerald-700 text-[12px]">
                        {item.sOrEsForm || `${item.verb}s`}
                      </td>
                      <td className="py-2.5 px-3.5 font-semibold text-sky-700 text-[12px]">
                        {item.ingForm || `${item.verb}ing`}
                      </td>
                      <td className="py-2.5 px-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() =>
                              handleSpeak(
                                `${item.verb}. Past tense: ${item.pastSimple}. Past participle: ${item.pastParticiple}.`,
                                `tbl-${item.id}`
                              )
                            }
                            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                              isSpeaking
                                ? 'bg-rose-500 text-white shadow-xs'
                                : 'text-rose-600 hover:bg-rose-100'
                            }`}
                            title="Pronounce Verb Forms"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleStartEdit(item)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                            title="Edit verb (සංස්කරණය කරන්න)"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteVerb(item.id, item.verb)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Delete verb (ඉවත් කරන්න)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: CARDS VIEW
         ========================================================================= */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredVerbs.map((item, idx) => {
              const itemNum = item.number || idx + 1;
              const isSpeakingThisVerb = speakingId === `verb-${item.id}`;

              return (
                <motion.div
                  key={item.id}
                  id={`verb-card-${item.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.2) }}
                  className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-rose-200 transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Card Top: Number + Sinhala Meaning + Audio */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                          #{itemNum}
                        </span>
                        <span className="text-sm font-extrabold text-slate-800">
                          {item.sinhalaMeaning}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          id={`speak-verb-btn-${item.id}`}
                          onClick={() =>
                            handleSpeak(
                              `${item.verb}. Past tense: ${item.pastSimple}. Past participle: ${item.pastParticiple}. Continuous: ${item.ingForm || item.verb + 'ing'}.`,
                              `verb-${item.id}`
                            )
                          }
                          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                            isSpeakingThisVerb
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'text-rose-600 hover:bg-rose-100'
                          }`}
                          title="Pronounce Verb"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                          title="Edit verb (සංස්කරණය කරන්න)"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteVerb(item.id, item.verb)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                          title="Delete verb (ඉවත් කරන්න)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* The 5 Forms Grid: Present, Past, Past Participle, s/es, ing */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400">Present (V1)</span>
                        <span className="font-black text-slate-900 text-sm">{item.verb}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-rose-500">Past (V2)</span>
                        <span className="font-bold text-rose-700 text-sm">{item.pastSimple}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-indigo-500">Past Part. (V3)</span>
                        <span className="font-bold text-indigo-700 text-sm">{item.pastParticiple}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-emerald-600">s/es (V4)</span>
                        <span className="font-semibold text-emerald-800 text-xs">{item.sOrEsForm || `${item.verb}s`}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-sky-600">ing (V5)</span>
                        <span className="font-semibold text-sky-800 text-xs">{item.ingForm || `${item.verb}ing`}</span>
                      </div>
                    </div>

                    {/* Example Sentence if available */}
                    {item.exampleSentence && (
                      <div className="mt-3 rounded-xl bg-rose-50/40 p-2.5 text-xs border border-rose-100/60">
                        <p className="font-semibold text-slate-800">{item.exampleSentence}</p>
                        {item.exampleSinhala && (
                          <p className="text-slate-500 text-[11px] mt-0.5">{item.exampleSinhala}</p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: QUIZ / FLASHCARDS
         ========================================================================= */}
      {viewMode === 'flashcards' && currentCard && (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span>
              Card <strong>{flashcardIndex + 1}</strong> of {filteredVerbs.length}
            </span>
            <span>Tap card to reveal all forms &amp; Sinhala meaning</span>
          </div>

          <motion.div
            key={currentCard.id}
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer bg-white rounded-3xl border-2 border-rose-200 p-8 sm:p-10 shadow-lg min-h-[260px] flex flex-col items-center justify-center text-center relative select-none group"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="absolute top-4 left-4 font-mono text-xs font-bold text-slate-400">
              #{currentCard.number || flashcardIndex + 1}
            </div>

            {!isFlipped ? (
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold tracking-wider text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
                  Base Form (V1)
                </span>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900">
                  {currentCard.verb}
                </h2>
                <p className="text-xs text-slate-400 font-medium pt-2">
                  (Tap to see Sinhala meaning, V2, V3, s/es, ing)
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-2xl font-black text-rose-600">
                  {currentCard.sinhalaMeaning}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">V1</span>
                    <span className="font-bold text-slate-900">{currentCard.verb}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-400 block font-bold">V2</span>
                    <span className="font-bold text-rose-700">{currentCard.pastSimple}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-400 block font-bold">V3</span>
                    <span className="font-bold text-indigo-700">{currentCard.pastParticiple}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-500 block font-bold">V4 (s/es)</span>
                    <span className="font-semibold text-emerald-800">{currentCard.sOrEsForm || `${currentCard.verb}s`}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-sky-500 block font-bold">V5 (ing)</span>
                    <span className="font-semibold text-sky-800">{currentCard.ingForm || `${currentCard.verb}ing`}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <div className="flex items-center justify-between gap-3 px-2">
            <button
              onClick={handlePrevFlashcard}
              className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => handleSpeak(`${currentCard.verb}. Past tense: ${currentCard.pastSimple}. Past participle: ${currentCard.pastParticiple}.`, 'flash-audio')}
              className="p-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer"
              title="Speak"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleNextFlashcard}
              className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
        </>
      )}

      {/* Edit Verb Modal Popup */}
      <AnimatePresence>
        {editingVerb && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col my-auto max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-rose-500 to-indigo-600 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Edit2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black">
                      ක්‍රියාපදය සංස්කරණය (Edit Verb)
                    </h3>
                    <p className="text-[11px] text-white/80 font-medium">
                      #{editingVerb.number || 1} • {editingVerb.verb} ({editingVerb.sinhalaMeaning})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingVerb(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveEdit} className="p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                {/* Pack Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Card (කාඩ්පත තෝරන්න):
                  </label>
                  <select
                    value={editCardId}
                    onChange={(e) => setEditCardId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold focus:outline-rose-500"
                  >
                    {packs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sinhala Meaning */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    සිංහල තේරුම (Sinhala Meaning) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editSinhala}
                    onChange={(e) => setEditSinhala(e.target.value)}
                    placeholder="උදා: කනවා, බොනවා, යනවා..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-rose-500"
                  />
                </div>

                {/* The 5 Forms Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Present (V1) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editV1}
                      onChange={(e) => setEditV1(e.target.value)}
                      placeholder="e.g. eat, go"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-rose-700 mb-1">
                      Past (V2)
                    </label>
                    <input
                      type="text"
                      value={editV2}
                      onChange={(e) => setEditV2(e.target.value)}
                      placeholder="e.g. ate, went"
                      className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs sm:text-sm font-bold text-rose-700 focus:outline-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-indigo-700 mb-1">
                      Past Participle (V3)
                    </label>
                    <input
                      type="text"
                      value={editV3}
                      onChange={(e) => setEditV3(e.target.value)}
                      placeholder="e.g. eaten, gone"
                      className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-xs sm:text-sm font-bold text-indigo-700 focus:outline-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-700 mb-1">
                      s/es Form (V4)
                    </label>
                    <input
                      type="text"
                      value={editV4}
                      onChange={(e) => setEditV4(e.target.value)}
                      placeholder="e.g. eats, goes"
                      className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-xs sm:text-sm font-semibold text-emerald-800 focus:outline-rose-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-sky-700 mb-1">
                      Continuous / ing Form (V5)
                    </label>
                    <input
                      type="text"
                      value={editV5}
                      onChange={(e) => setEditV5(e.target.value)}
                      placeholder="e.g. eating, going"
                      className="w-full px-3 py-2 rounded-xl border border-sky-200 text-xs sm:text-sm font-semibold text-sky-800 focus:outline-rose-500"
                    />
                  </div>
                </div>

                {/* Example Sentences */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700">
                    උදාහරණ වාක්‍ය (Example Sentence):
                  </label>
                  <input
                    type="text"
                    value={editExampleSentence}
                    onChange={(e) => setEditExampleSentence(e.target.value)}
                    placeholder="e.g. I eat rice every day."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-rose-500"
                  />
                  <input
                    type="text"
                    value={editExampleSinhala}
                    onChange={(e) => setEditExampleSinhala(e.target.value)}
                    placeholder="උදා: මම හැමදාම බත් කනවා."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-rose-500"
                  />
                </div>

                {/* Category & Irregular Flag */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Category:
                    </label>
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      placeholder="e.g. Daily Routine"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-rose-500"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-4">
                    <input
                      type="checkbox"
                      checked={editIsIrregular}
                      onChange={(e) => setEditIsIrregular(e.target.checked)}
                      className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                    <span>Irregular Verb</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingVerb(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel (අවලංගු කරන්න)
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes (සුරකින්න)</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
