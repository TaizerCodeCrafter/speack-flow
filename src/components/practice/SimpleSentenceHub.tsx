import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Volume2,
  Copy,
  Check,
  Search,
  X,
  SlidersHorizontal,
  Volume1,
  Plus,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Edit2,
  Trash2,
  Save,
  FolderPlus,
  Layers,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { SimpleSentenceItem, SentencePackCard, CardColorTheme, UserProfile } from '../../types';
import {
  getStoredSimpleSentences,
  saveStoredSimpleSentences,
  getStoredSentenceCategories,
  getStoredSentencePacks,
  saveStoredSentencePacks,
  DEFAULT_SENTENCE_PACKS,
  speakText,
  restoreDefaultHaveDoBeSentences,
} from '../../data/simpleSentencesData';
import { getCurrentUser } from '../../utils/authStorage';

interface SimpleSentenceHubProps {
  onOpenAdmin?: () => void;
  currentUser?: UserProfile | null;
}

export const SimpleSentenceHub: React.FC<SimpleSentenceHubProps> = ({
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

  // Packs (Cards) & Sentences
  const [packs, setPacks] = useState<SentencePackCard[]>(() => getStoredSentencePacks());
  const [activePackId, setActivePackId] = useState<string | null>(null);
  const [sentences, setSentences] = useState<SimpleSentenceItem[]>(() => getStoredSimpleSentences());

  // Search & Filter within Active Pack
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Add Sentence State
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newEnglish, setNewEnglish] = useState('');
  const [newSinhala, setNewSinhala] = useState('');
  const [newCategory, setNewCategory] = useState('Daily Life');

  // Edit Sentence Modal State
  const [editingSentence, setEditingSentence] = useState<SimpleSentenceItem | null>(null);
  const [editEnglish, setEditEnglish] = useState('');
  const [editSinhala, setEditSinhala] = useState('');
  const [editCategory, setEditCategory] = useState('Daily Life');
  const [editCardId, setEditCardId] = useState('simple-sentences-1');

  // Create Card Modal State
  const [showCreateCardModal, setShowCreateCardModal] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardSubtitle, setNewCardSubtitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [newCardTheme, setNewCardTheme] = useState<CardColorTheme>('sky');

  // Edit Card Modal State
  const [editingCard, setEditingCard] = useState<SentencePackCard | null>(null);
  const [editCardTitle, setEditCardTitle] = useState('');
  const [editCardSubtitle, setEditCardSubtitle] = useState('');
  const [editCardDescription, setEditCardDescription] = useState('');
  const [editCardTheme, setEditCardTheme] = useState<CardColorTheme>('sky');

  // Sync with storage events
  useEffect(() => {
    const handleStorage = () => {
      setPacks(getStoredSentencePacks());
      setSentences(getStoredSimpleSentences());
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleStorage);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Currently active pack and sentences
  const activePack = useMemo(() => {
    if (!activePackId) return null;
    return packs.find((p) => p.id === activePackId) || packs[0] || DEFAULT_SENTENCE_PACKS[0];
  }, [packs, activePackId]);

  const sentencesInActivePack = useMemo(() => {
    if (!activePack) return [];
    return sentences.filter((s) => (s.cardId || 'simple-sentences-1') === activePack.id);
  }, [sentences, activePack]);

  // Audio Playback
  const handleSpeak = (id: string, text: string, rateMultiplier: number = speechRate) => {
    if (speakingId === id) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingId(null);
      return;
    }

    setSpeakingId(id);
    speakText(
      text,
      rateMultiplier,
      () => setSpeakingId(null),
      () => setSpeakingId(null)
    );
  };

  const handleCopy = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  // Distinct categories in active pack
  const categoriesInPack = useMemo(() => {
    const set = new Set<string>();
    sentencesInActivePack.forEach((s) => {
      if (s.category) set.add(s.category.trim());
    });
    return Array.from(set);
  }, [sentencesInActivePack]);

  // Filtered sentences
  const filteredSentences = useMemo(() => {
    return sentencesInActivePack.filter((s) => {
      const matchesCat =
        selectedCategory === 'all' ||
        (s.category || 'General').toLowerCase() === selectedCategory.toLowerCase();
      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.english.toLowerCase().includes(q) ||
        s.sinhala.toLowerCase().includes(q) ||
        (s.category && s.category.toLowerCase().includes(q))
      );
    });
  }, [sentencesInActivePack, selectedCategory, searchQuery]);

  // Handle Quick Add Sentence
  const handleQuickAddSentence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnglish.trim() || !newSinhala.trim()) {
      showToast('Please fill in both English and Sinhala fields!');
      return;
    }

    const currentPackId = activePack?.id || 'simple-sentences-1';
    const newItem: SimpleSentenceItem = {
      id: `sent-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      cardId: currentPackId,
      english: newEnglish.trim(),
      sinhala: newSinhala.trim(),
      category: newCategory.trim() || 'Daily Life',
      createdAt: Date.now(),
    };

    const updated = [newItem, ...sentences];
    setSentences(updated);
    saveStoredSimpleSentences(updated);

    setNewEnglish('');
    setNewSinhala('');
    setIsAddFormOpen(false);
    showToast('නව වාක්‍යය සාර්ථකව එකතු විය!');
  };

  // Handle Start Edit Sentence
  const handleStartEditSentence = (item: SimpleSentenceItem) => {
    setEditingSentence(item);
    setEditEnglish(item.english);
    setEditSinhala(item.sinhala);
    setEditCategory(item.category || 'Daily Life');
    setEditCardId(item.cardId || activePack?.id || 'simple-sentences-1');
  };

  // Handle Save Edit Sentence
  const handleSaveEditSentence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSentence || !editEnglish.trim() || !editSinhala.trim()) {
      showToast('කරුණාකර ඉංග්‍රීසි සහ සිංහල වාක්‍ය ඇතුළත් කරන්න.');
      return;
    }

    const updated = sentences.map((s) => {
      if (s.id === editingSentence.id) {
        return {
          ...s,
          english: editEnglish.trim(),
          sinhala: editSinhala.trim(),
          category: editCategory.trim() || 'Daily Life',
          cardId: editCardId || activePack?.id || 'simple-sentences-1',
        };
      }
      return s;
    });

    setSentences(updated);
    saveStoredSimpleSentences(updated);
    setEditingSentence(null);
    showToast('වාක්‍යය සාර්ථකව යාවත්කාලීන විය!');
  };

  // Handle Delete Sentence
  const handleDeleteSentence = (id: string, text: string) => {
    if (window.confirm(`"${text}" වාක්‍යය මෙම Card එකෙන් ඉවත් කිරීමට (Delete) ඔබට විශ්වාසද?`)) {
      const updated = sentences.filter((s) => s.id !== id);
      setSentences(updated);
      saveStoredSimpleSentences(updated);
      showToast('වාක්‍යය ඉවත් කරන ලදී.');
    }
  };

  // Handle Create New Card
  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) {
      showToast('Please enter a Card title (උදා: Simple Sentences 2)!');
      return;
    }

    const nextId = `simple-sentences-${Date.now()}`;
    const newPack: SentencePackCard = {
      id: nextId,
      title: newCardTitle.trim(),
      subtitle: newCardSubtitle.trim() || 'Daily Conversations & Fluency',
      description: newCardDescription.trim() || 'Practice practical simple sentences with natural audio and Sinhala meanings.',
      tag: newCardTitle.trim(),
      iconName: 'BookOpen',
      colorTheme: newCardTheme,
      createdAt: Date.now(),
    };

    const updated = [...packs, newPack];
    setPacks(updated);
    saveStoredSentencePacks(updated);

    setShowCreateCardModal(false);
    setNewCardTitle('');
    setNewCardSubtitle('');
    setNewCardDescription('');
    setActivePackId(nextId);
    showToast(`"${newPack.title}" කාඩ්පත සාර්ථකව නිර්මාණය විය!`);
  };

  // Handle Start Edit Card
  const handleStartEditCard = (e: React.MouseEvent, pack: SentencePackCard) => {
    e.stopPropagation();
    setEditingCard(pack);
    setEditCardTitle(pack.title);
    setEditCardSubtitle(pack.subtitle || '');
    setEditCardDescription(pack.description || '');
    setEditCardTheme(pack.colorTheme || 'sky');
  };

  // Handle Save Edit Card
  const handleSaveEditCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard || !editCardTitle.trim()) return;

    const updated = packs.map((p) => {
      if (p.id === editingCard.id) {
        return {
          ...p,
          title: editCardTitle.trim(),
          subtitle: editCardSubtitle.trim() || undefined,
          description: editCardDescription.trim() || undefined,
          colorTheme: editCardTheme,
        };
      }
      return p;
    });

    setPacks(updated);
    saveStoredSentencePacks(updated);
    setEditingCard(null);
    showToast('Card updated successfully!');
  };

  // Handle Delete Card
  const handleDeleteCard = (e: React.MouseEvent, packId: string, packTitle: string) => {
    e.stopPropagation();
    if (packs.length <= 1) {
      alert('You cannot delete the only card. At least one card must remain.');
      return;
    }

    const countInCard = sentences.filter((s) => (s.cardId || 'simple-sentences-1') === packId).length;
    const confirmMsg = countInCard > 0
      ? `"${packTitle}" කාඩ්පත මකා දැමීමට ඔබට විශ්වාසද? මෙහි ඇති වාක්‍ය ${countInCard} ප්‍රධාන කාඩ්පත වෙත මාරු කරනු ලැබේ.`
      : `"${packTitle}" කාඩ්පත මකා දැමීමට ඔබට විශ්වාසද?`;

    if (window.confirm(confirmMsg)) {
      const remainingPacks = packs.filter((p) => p.id !== packId);
      const targetPackId = remainingPacks[0].id;

      const updatedSentences = sentences.map((s) => {
        if ((s.cardId || 'simple-sentences-1') === packId) {
          return { ...s, cardId: targetPackId };
        }
        return s;
      });

      setPacks(remainingPacks);
      saveStoredSentencePacks(remainingPacks);
      setSentences(updatedSentences);
      saveStoredSimpleSentences(updatedSentences);

      if (activePackId === packId) {
        setActivePackId(null);
      }
      showToast(`"${packTitle}" කාඩ්පත ඉවත් කරන ලදී.`);
    }
  };

  // Color theme class helper
  const getThemeClasses = (colorTheme?: CardColorTheme, isFirst: boolean = false) => {
    switch (colorTheme) {
      case 'emerald':
        return {
          gradient: 'from-emerald-500/10 via-teal-500/5 to-emerald-600/15 border-emerald-200/90 hover:border-emerald-400',
          iconBg: 'bg-emerald-600 text-white shadow-emerald-500/30',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25',
          bannerBg: 'from-emerald-500/10 via-teal-500/5 to-emerald-600/15 border-emerald-200/80',
          bannerText: 'text-emerald-900',
        };
      case 'indigo':
        return {
          gradient: 'from-indigo-500/10 via-sky-500/5 to-purple-600/15 border-indigo-200/90 hover:border-indigo-400',
          iconBg: 'bg-indigo-600 text-white shadow-indigo-500/30',
          badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          btnBg: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25',
          bannerBg: 'from-indigo-500/10 via-sky-500/5 to-purple-600/15 border-indigo-200/80',
          bannerText: 'text-indigo-900',
        };
      case 'rose':
        return {
          gradient: 'from-rose-500/10 via-amber-500/5 to-rose-600/15 border-rose-200/90 hover:border-rose-400',
          iconBg: 'bg-rose-600 text-white shadow-rose-500/30',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/25',
          bannerBg: 'from-rose-500/10 via-amber-500/5 to-rose-600/15 border-rose-200/80',
          bannerText: 'text-rose-900',
        };
      case 'amber':
        return {
          gradient: 'from-amber-500/10 via-orange-500/5 to-amber-600/15 border-amber-200/90 hover:border-amber-400',
          iconBg: 'bg-amber-600 text-white shadow-amber-500/30',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
          btnBg: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/25',
          bannerBg: 'from-amber-500/10 via-orange-500/5 to-amber-600/15 border-amber-200/80',
          bannerText: 'text-amber-900',
        };
      case 'purple':
        return {
          gradient: 'from-purple-500/10 via-pink-500/5 to-purple-600/15 border-purple-200/90 hover:border-purple-400',
          iconBg: 'bg-purple-600 text-white shadow-purple-500/30',
          badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
          btnBg: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25',
          bannerBg: 'from-purple-500/10 via-pink-500/5 to-purple-600/15 border-purple-200/80',
          bannerText: 'text-purple-900',
        };
      case 'sky':
      default:
        return {
          gradient: 'from-sky-500/10 via-blue-500/5 to-cyan-600/15 border-sky-200/90 hover:border-sky-400',
          iconBg: 'bg-sky-600 text-white shadow-sky-500/30',
          badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
          btnBg: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/25',
          bannerBg: 'from-sky-500/10 via-blue-500/5 to-cyan-600/15 border-sky-200/80',
          bannerText: 'text-sky-900',
        };
    }
  };

  // =========================================================================
  // VIEW 1: CARD SELECTION HUB (When activePackId === null)
  // =========================================================================
  if (!activePack) {
    return (
      <div id="simple-sentences-cards-hub" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
        {/* Toast notification */}
        {toastMessage && (
          <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Banner */}
        <div className="text-center max-w-xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200/80 text-xs font-bold shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span>Simple Sentence Studio (සරල වාක්‍ය මධ්‍යස්ථානය)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Simple Sentence Cards
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Select a Sentence Card below to explore daily sentences, audio pronunciation, and Sinhala meanings (අධ්‍යයනය සඳහා පහත කාඩ්පතක් තෝරන්න).
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => setShowCreateCardModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-102"
            >
              <FolderPlus className="w-4 h-4" />
              <span>+ Create New Card (අලුත් කාඩ්පතක් සාදන්න)</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Restore all 100 Have/Do/Be sentences from PDF to "Have / Do / Be" card? ("Have / Do / Be" කාඩ්පතට PDF එකේ වාක්‍ය 100 නැවත යාවත්කාලීන කිරීමට අවශ්‍යද?)')) {
                  const restored = restoreDefaultHaveDoBeSentences();
                  setSentences(restored);
                  showToast('100 Have/Do/Be sentences restored successfully (වාක්‍ය 100 සාර්ථකව එක් විය)!');
                }
              }}
              title="Restore all 100 sentences from PDF"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-xs font-bold shadow-2xs transition-all cursor-pointer hover:scale-102"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Reset 100 Sentences</span>
            </button>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer hover:scale-102"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                <span>Admin Studio</span>
              </button>
            )}
          </div>
        </div>

        {/* Cards Grid: Simple Sentences 1, Simple Sentences 2, and Custom Cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-5 max-w-3xl mx-auto px-0.5">
          {packs.map((pack, idx) => {
            const countInPack = sentences.filter((s) => (s.cardId || 'simple-sentences-1') === pack.id).length;
            const isFirst = idx === 0;
            const theme = getThemeClasses(pack.colorTheme, isFirst);

            return (
              <motion.div
                key={pack.id}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                onClick={() => setActivePackId(pack.id)}
                className={`group cursor-pointer rounded-2xl sm:rounded-3xl p-3 sm:p-5 bg-gradient-to-br ${theme.gradient} bg-white/95 backdrop-blur-xl border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden`}
              >
                {/* Ambient glow decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

                <div className="space-y-2 sm:space-y-3 relative z-10">
                  {/* Top Row with Icon, Count Badge and Card Edit/Delete */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${theme.iconBg}`}>
                      {isFirst ? <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>

                    <div className="flex items-center gap-1">
                      <span className={`text-[9px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full border shadow-2xs truncate ${theme.badgeBg}`}>
                        {countInPack} Sentences
                      </span>

                      {/* Card Edit and Delete buttons */}
                      <button
                        onClick={(e) => handleStartEditCard(e, pack)}
                        className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-white/80 transition-colors"
                        title="Edit Card Details"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>

                      {packs.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteCard(e, pack.id, pack.title)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white/80 transition-colors"
                          title="Delete Card"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-sm sm:text-lg font-black text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">
                      {pack.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-600 mt-0.5 leading-tight line-clamp-1">
                      {pack.subtitle || 'Daily Routine & Fluency'}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-[10px] sm:text-xs text-slate-500 leading-snug line-clamp-2 hidden xs:block">
                    {pack.description || 'Master practical simple sentences with clear Sinhala meanings.'}
                  </p>

                  {/* Feature Badges */}
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    <span className="text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-white/80 text-slate-600 border border-slate-200/70">
                      English
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-white/80 text-slate-600 border border-slate-200/70">
                      සිංහල
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-white/80 text-slate-600 border border-slate-200/70">
                      Audio 🔊
                    </span>
                  </div>
                </div>

                {/* Bottom CTA Bar */}
                <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-slate-200/60 relative z-10 flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors hidden sm:inline">
                    {countInPack > 0 ? `${countInPack} sentences` : 'View card'}
                  </span>
                  <div className={`w-full sm:w-auto inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black shadow-2xs transition-all ${theme.btnBg} group-hover:gap-2`}>
                    <span>Open (බලන්න)</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Create Card Modal */}
        <AnimatePresence>
          {showCreateCardModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col my-auto"
              >
                <div className="px-5 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderPlus className="w-5 h-5 text-white" />
                    <h3 className="text-base font-black">Create New Sentence Card</h3>
                  </div>
                  <button
                    onClick={() => setShowCreateCardModal(false)}
                    className="p-1 rounded-xl hover:bg-white/20 text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateCard} className="p-5 space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Card Title * (කාඩ්පතේ නම):
                    </label>
                    <input
                      type="text"
                      required
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      placeholder="e.g. Simple Sentences 3 or School Sentences"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subtitle (උපසිරැසිය):
                    </label>
                    <input
                      type="text"
                      value={newCardSubtitle}
                      onChange={(e) => setNewCardSubtitle(e.target.value)}
                      placeholder="e.g. Daily English Conversations"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Description (විස්තරය):
                    </label>
                    <textarea
                      rows={2}
                      value={newCardDescription}
                      onChange={(e) => setNewCardDescription(e.target.value)}
                      placeholder="Master practical daily sentences..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Color Theme (වර්ණය):
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['sky', 'emerald', 'indigo', 'rose', 'amber', 'purple', 'teal'] as CardColorTheme[]).map((thm) => (
                        <button
                          key={thm}
                          type="button"
                          onClick={() => setNewCardTheme(thm)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                            newCardTheme === thm
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {thm}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowCreateCardModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Card (සාදන්න)</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Card Modal */}
        <AnimatePresence>
          {editingCard && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col my-auto"
              >
                <div className="px-5 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit2 className="w-5 h-5 text-white" />
                    <h3 className="text-base font-black">Edit Card: {editingCard.title}</h3>
                  </div>
                  <button
                    onClick={() => setEditingCard(null)}
                    className="p-1 rounded-xl hover:bg-white/20 text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditCard} className="p-5 space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Card Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editCardTitle}
                      onChange={(e) => setEditCardTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={editCardSubtitle}
                      onChange={(e) => setEditCardSubtitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={editCardDescription}
                      onChange={(e) => setEditCardDescription(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Color Theme:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['sky', 'emerald', 'indigo', 'rose', 'amber', 'purple', 'teal'] as CardColorTheme[]).map((thm) => (
                        <button
                          key={thm}
                          type="button"
                          onClick={() => setEditCardTheme(thm)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                            editCardTheme === thm
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {thm}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingCard(null)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: INSIDE ACTIVE CARD (when activePackId is set)
  // =========================================================================
  const activeTheme = getThemeClasses(activePack.colorTheme);

  return (
    <div id="simple-sentences-active-card" className="space-y-6 sm:space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation: Back to Cards + Direct Card Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          onClick={() => setActivePackId(null)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs transition-all cursor-pointer hover:shadow-xs group"
        >
          <ArrowLeft className="w-4 h-4 text-sky-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>← Back to Sentence Cards (සියලුම කාඩ්පත්)</span>
        </button>

        {/* Fast Switcher between Simple Sentences 1, 2, etc. */}
        <div className="inline-flex items-center gap-1.5 bg-white/90 border border-slate-200/90 p-1 rounded-2xl shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 px-2 hidden sm:inline">Active Card:</span>
          {packs.map((p) => {
            const isCurrent = p.id === activePack.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActivePackId(p.id);
                  setSelectedCategory('all');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {p.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Card Top Banner */}
      <div className={`rounded-3xl bg-gradient-to-br ${activeTheme.bannerBg} bg-white/90 p-4 sm:p-6 shadow-xs backdrop-blur-xl relative overflow-hidden border`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/90 border border-sky-300/80 text-sky-900 text-xs font-bold shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>Card: {activePack.title} ({sentencesInActivePack.length} Sentences)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activePack.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {activePack.subtitle || 'Daily Routine & Everyday Conversations'} •{' '}
              {activePack.description || 'Master practical simple sentences with clear Sinhala meanings.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-white/90 p-1 rounded-2xl border border-slate-200 text-xs font-bold shadow-2xs">
              <span className="px-2 text-slate-400 text-[11px]">Speed:</span>
              <button
                onClick={() => setSpeechRate(1.0)}
                className={`px-2 py-0.5 rounded-xl transition-all cursor-pointer ${
                  speechRate === 1.0 ? 'bg-sky-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                1.0x
              </button>
              <button
                onClick={() => setSpeechRate(0.85)}
                className={`px-2 py-0.5 rounded-xl transition-all cursor-pointer ${
                  speechRate === 0.85 ? 'bg-sky-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                0.85x
              </button>
              <button
                onClick={() => setSpeechRate(0.65)}
                className={`px-2 py-0.5 rounded-xl transition-all cursor-pointer ${
                  speechRate === 0.65 ? 'bg-sky-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                0.65x
              </button>
            </div>

            {/* Quick Add Sentence Button */}
            <button
              onClick={() => setIsAddFormOpen(!isAddFormOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-98"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddFormOpen ? 'Close Add Form' : `+ Add Sentence`}</span>
            </button>

            {/* Admin Studio Button */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Inline Add Sentence Form */}
        <AnimatePresence>
          {isAddFormOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleQuickAddSentence}
              className="mt-4 pt-4 border-t border-sky-200/80 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    English Sentence *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEnglish}
                    onChange={(e) => setNewEnglish(e.target.value)}
                    placeholder="e.g. I wake up early in the morning."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    සිංහල තේරුම (Sinhala Meaning) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSinhala}
                    onChange={(e) => setNewSinhala(e.target.value)}
                    placeholder="උදා: මම උදෑසනින්ම අවදි වෙමි."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-sky-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">Category:</span>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Daily Life"
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-sky-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddFormOpen(false)}
                    className="px-3 py-1.5 rounded-xl bg-white text-slate-600 hover:bg-slate-100 text-xs font-bold border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Save Sentence to {activePack.title}
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Toolbar: Search input & Category Filter */}
      <div className="space-y-3">
        <div className="bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sentence or Sinhala..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredSentences.length}</strong> of{' '}
            <strong className="text-slate-900">{sentencesInActivePack.length}</strong> in {activePack.title}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Sentences ({sentencesInActivePack.length})
          </button>
          {categoriesInPack.map((cat) => {
            const count = sentencesInActivePack.filter(
              (s) => (s.category || 'General').toLowerCase() === cat.toLowerCase()
            ).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Sentences List Downward */}
      {filteredSentences.length === 0 ? (
        <div className="rounded-3xl p-10 bg-white border border-slate-200 text-center shadow-2xs space-y-2">
          <BookOpen className="w-8 h-8 text-sky-500 mx-auto mb-2 opacity-60" />
          <p className="text-slate-800 text-sm font-bold">
            {searchQuery ? `No sentences match "${searchQuery}"` : `No sentences added to "${activePack.title}" yet.`}
          </p>
          <p className="text-slate-400 text-xs">
            ඉහළින් ඇති "+ Add Sentence" බොත්තමෙන් මෙම Card එකට වාක්‍ය එක් කළ හැක.
          </p>
          <button
            onClick={() => setIsAddFormOpen(true)}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add First Sentence to {activePack.title}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSentences.map((item, idx) => {
            const isSpeaking = speakingId === item.id;
            const isCopied = copiedId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.25) }}
                className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 border backdrop-blur-xl transition-all ${
                  isSpeaking
                    ? 'bg-gradient-to-r from-sky-100/90 via-sky-50/90 to-white/90 border-sky-400 shadow-md ring-2 ring-sky-300/60'
                    : 'bg-white/95 hover:bg-white border-slate-200/90 hover:border-sky-300 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                  {/* Number + English & Sinhala */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border transition-colors ${
                        isSpeaking
                          ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                          : 'bg-sky-50 text-sky-800 border-sky-200'
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                          {item.english}
                        </h4>
                        {item.category && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
                        {item.sinhala}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Speak Normal, Slow Voice, Edit, Delete, Copy */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleSpeak(item.id, item.english, speechRate)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                        isSpeaking
                          ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-md ring-2 ring-sky-400/40'
                          : 'bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300/70 hover:border-sky-400'
                      }`}
                      title="Speak Sentence"
                    >
                      <Volume2
                        className={`w-3.5 h-3.5 ${
                          isSpeaking ? 'animate-bounce text-white' : 'text-sky-600'
                        }`}
                      />
                      <span>{isSpeaking ? 'Playing' : 'Speak'}</span>
                    </button>

                    <button
                      onClick={() => handleSpeak(item.id, item.english, 0.65)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                      title="Slow Voice (0.65x)"
                    >
                      <Volume1 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleStartEditSentence(item)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 border border-transparent hover:border-sky-200 transition-colors cursor-pointer"
                      title="Edit Sentence (සංස්කරණය)"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteSentence(item.id, item.english)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                      title="Delete Sentence (ඉවත් කරන්න)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleCopy(item.id, `${item.english} - ${item.sinhala}`)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                      title="Copy English & Sinhala"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit Sentence Modal Popup */}
      <AnimatePresence>
        {editingSentence && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col my-auto max-h-[90vh]"
            >
              <div className="px-5 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-white" />
                  <h3 className="text-sm sm:text-base font-black">
                    වාක්‍යය සංස්කරණය (Edit Sentence)
                  </h3>
                </div>
                <button
                  onClick={() => setEditingSentence(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditSentence} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
                {/* Pack Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Card (කාඩ්පත තෝරන්න):
                  </label>
                  <select
                    value={editCardId}
                    onChange={(e) => setEditCardId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold focus:outline-sky-500"
                  >
                    {packs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* English Sentence */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    English Sentence *
                  </label>
                  <input
                    type="text"
                    required
                    value={editEnglish}
                    onChange={(e) => setEditEnglish(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-sky-500"
                  />
                </div>

                {/* Sinhala Meaning */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    සිංහල තේරුම (Sinhala Meaning) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editSinhala}
                    onChange={(e) => setEditSinhala(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-sky-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category (කාණ්ඩය):
                  </label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-sky-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingSentence(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
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
