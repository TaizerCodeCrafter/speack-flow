import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Sparkles,
  LayoutGrid,
  FileText,
  Volume2,
  Eye,
  Layers,
  BookOpen,
  PenTool,
  Mic,
  Headphones,
  Languages,
  Info,
  Zap,
  Users,
  Settings,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Tv,
} from 'lucide-react';
import {
  LearningCard,
  CardColorTheme,
  CardIconName,
  SkillType,
  PracticeSubCard,
  SubCardExample,
  GrammarSubCard,
  UserProfile,
} from '../types';
import {
  DEFAULT_CARDS,
  ICON_COMPONENTS,
  THEME_STYLES,
} from '../data/defaultCards';
import { TaizerFlowLogo } from './TaizerFlowLogo';
import { SimpleSentenceManager } from './admin/SimpleSentenceManager';
import { EssentialVerbsManager } from './admin/EssentialVerbsManager';
import { UserApprovalManager } from './admin/UserApprovalManager';
import { AdminSettingsManager } from './admin/AdminSettingsManager';
import { SideMediaManager } from './admin/SideMediaManager';
import { getStoredUsers, getCurrentUser } from '../utils/authStorage';
import {
  DEFAULT_PRACTICE_CARDS,
  getStoredPracticeCards,
  saveStoredPracticeCards,
} from '../data/subCardsData';
import { saveStoredGrammarCards } from '../data/grammarCards';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cards: LearningCard[];
  onUpdateCards: (cards: LearningCard[]) => void;
  initialHub?: 'writing' | 'spoken_oral' | 'grammar' | 'simple_sentence' | 'essential_verbs';
  currentUser?: UserProfile | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  cards,
  onUpdateCards,
  initialHub,
  currentUser,
}) => {
  // Navigation Tabs: 'notes_editor' | 'home_cards' | 'side_media' | 'user_approval' | 'admin_settings'
  const [activeTab, setActiveTab] = useState<
    'notes_editor' | 'home_cards' | 'side_media' | 'user_approval' | 'admin_settings'
  >('notes_editor');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync initialHub if provided when opening
  useEffect(() => {
    if (isOpen && initialHub) {
      setSelectedHub(initialHub);
      setActiveTab('notes_editor');
    }
  }, [isOpen, initialHub]);

  // Pending user approval count for tab notification badge
  const [pendingUserCount, setPendingUserCount] = useState<number>(() => {
    try {
      return getStoredUsers().filter((u) => u.status === 'pending').length;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const updatePending = () => {
      try {
        const count = getStoredUsers().filter((u) => u.status === 'pending').length;
        setPendingUserCount(count);
      } catch {
        // ignore
      }
    };
    window.addEventListener('users-storage-changed', updatePending);
    window.addEventListener('auth-state-changed', updatePending);
    return () => {
      window.removeEventListener('users-storage-changed', updatePending);
      window.removeEventListener('auth-state-changed', updatePending);
    };
  }, []);

  // Lock background body scroll while AdminPanel is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // ----------------------------------------------------
  // 1. Home Cards State
  // ----------------------------------------------------
  const [editingHomeCardId, setEditingHomeCardId] = useState<string | null>(null);
  const [showHomeAddForm, setShowHomeAddForm] = useState(false);

  const [homeTitle, setHomeTitle] = useState('');
  const [homeSubtitle, setHomeSubtitle] = useState('');
  const [homeDescription, setHomeDescription] = useState('');
  const [homeTag, setHomeTag] = useState('');
  const [homeSkillType, setHomeSkillType] = useState<SkillType>('grammar');
  const [homeColorTheme, setHomeColorTheme] = useState<CardColorTheme>('amber');
  const [homeIconName, setHomeIconName] = useState<CardIconName>('Sparkles');

  // ----------------------------------------------------
  // 2. Practice Sub-Cards State (Writing, Spoken/Oral, Grammar)
  // ----------------------------------------------------
  const [practiceCards, setPracticeCards] = useState<PracticeSubCard[]>(() =>
    getStoredPracticeCards()
  );

  // Selected Hub for sub-card editing: 'writing' | 'spoken_oral' | 'grammar' | 'simple_sentence' | 'essential_verbs'
  const [selectedHub, setSelectedHub] = useState<'writing' | 'spoken_oral' | 'grammar' | 'simple_sentence' | 'essential_verbs'>('writing');

  // For grammar hub: category 'do' | 'have' | 'be'
  const [selectedGrammarCat, setSelectedGrammarCat] = useState<'do' | 'have' | 'be'>('do');

  const [editingSubCard, setEditingSubCard] = useState<PracticeSubCard | null>(null);
  const [isAddingSubCard, setIsAddingSubCard] = useState(false);

  // Form Fields for English & Sinhala Notes
  const [cardTitle, setCardTitle] = useState('');
  const [cardSubtitle, setCardSubtitle] = useState('');
  const [englishContent, setEnglishContent] = useState('');
  const [sinhalaContent, setSinhalaContent] = useState('');
  const [examplesList, setExamplesList] = useState<SubCardExample[]>([]);
  const [newExEnglish, setNewExEnglish] = useState('');
  const [newExSinhala, setNewExSinhala] = useState('');
  const [cardNotes, setCardNotes] = useState('');
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewLang, setPreviewLang] = useState<'both' | 'en' | 'si'>('both');

  // Handle ESC key to exit full screen and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  const handleSpeechTest = (text: string) => {
    if ('speechSynthesis' in window && text.trim()) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Sync state with storage
  const syncCards = (updated: PracticeSubCard[]) => {
    setPracticeCards(updated);
    saveStoredPracticeCards(updated);

    // Also sync grammar cards store
    const grammarOnly: GrammarSubCard[] = updated
      .filter((c) => c.hub === 'grammar')
      .map((c) => ({
        id: c.id,
        category: c.category as 'do' | 'have' | 'be',
        number: c.number,
        title: c.title,
        subtitle: c.subtitle,
        englishContent: c.englishContent,
        sinhalaContent: c.sinhalaContent,
        examples: c.examples.map((ex) => ex.english),
        notes: c.notes,
      }));
    saveStoredGrammarCards(grammarOnly);

    window.dispatchEvent(new Event('storage'));
  };

  // ----------------------------------------------------
  // Sub-Cards Form Handlers (Writing, Spoken/Oral, Grammar)
  // ----------------------------------------------------
  const handleOpenEditSubCard = (card: PracticeSubCard) => {
    setEditingSubCard(card);
    setIsAddingSubCard(false);
    setCardTitle(card.title);
    setCardSubtitle(card.subtitle || '');
    setEnglishContent(card.englishContent || '');
    setSinhalaContent(card.sinhalaContent || '');
    setExamplesList(card.examples || []);
    setNewExEnglish('');
    setNewExSinhala('');
    setCardNotes(card.notes || '');
    setShowLivePreview(false);
  };

  const handleOpenAddSubCard = () => {
    const relevantCards = practiceCards.filter((c) => {
      if (selectedHub === 'grammar') {
        return c.hub === 'grammar' && c.category === selectedGrammarCat;
      }
      return c.hub === selectedHub;
    });

    const nextNum = relevantCards.length + 1;
    const defaultTitle =
      selectedHub === 'writing'
        ? nextNum === 1
          ? 'Writing'
          : nextNum === 2
          ? 'Reading'
          : `Writing Card ${nextNum}`
        : selectedHub === 'spoken_oral'
        ? nextNum === 1
          ? 'Speaking'
          : nextNum === 2
          ? 'Listening'
          : `Spoken Card ${nextNum}`
        : `Card ${nextNum}`;

    setEditingSubCard(null);
    setIsAddingSubCard(true);
    setCardTitle(defaultTitle);
    setCardSubtitle('');
    setEnglishContent('');
    setSinhalaContent('');
    setExamplesList([]);
    setNewExEnglish('');
    setNewExSinhala('');
    setCardNotes('');
    setShowLivePreview(false);
  };

  const handleAddExample = () => {
    if (!newExEnglish.trim()) return;
    setExamplesList([
      ...examplesList,
      { english: newExEnglish.trim(), sinhala: newExSinhala.trim() },
    ]);
    setNewExEnglish('');
    setNewExSinhala('');
  };

  const handleRemoveExample = (index: number) => {
    setExamplesList(examplesList.filter((_, idx) => idx !== index));
  };

  const handleSaveSubCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardTitle.trim()) {
      showToast('Please provide a Card Title.');
      return;
    }

    if (editingSubCard) {
      // Update existing
      const updated = practiceCards.map((c) => {
        if (c.id === editingSubCard.id) {
          return {
            ...c,
            title: cardTitle.trim(),
            subtitle: cardSubtitle.trim(),
            englishContent: englishContent.trim(),
            sinhalaContent: sinhalaContent.trim(),
            examples: examplesList,
            notes: cardNotes.trim(),
          };
        }
        return c;
      });

      syncCards(updated);
      setEditingSubCard(null);
      showToast(`Updated "${cardTitle}" successfully!`);
    } else if (isAddingSubCard) {
      // Add new card
      const category =
        selectedHub === 'grammar'
          ? selectedGrammarCat
          : selectedHub === 'simple_sentence'
          ? 'sentence'
          : selectedHub === 'writing'
          ? cardTitle.toLowerCase().includes('reading')
            ? 'reading'
            : 'writing'
          : cardTitle.toLowerCase().includes('listen')
          ? 'listening'
          : 'speaking';

      const existingInCat = practiceCards.filter((c) => {
        if (selectedHub === 'grammar') {
          return c.hub === 'grammar' && c.category === selectedGrammarCat;
        }
        return c.hub === selectedHub;
      });

      const newSubCard: PracticeSubCard = {
        id: `${selectedHub}-${Date.now()}`,
        hub: selectedHub,
        category,
        number: existingInCat.length + 1,
        title: cardTitle.trim(),
        subtitle: cardSubtitle.trim(),
        englishContent: englishContent.trim(),
        sinhalaContent: sinhalaContent.trim(),
        examples: examplesList,
        notes: cardNotes.trim(),
      };

      const updated = [...practiceCards, newSubCard];
      syncCards(updated);
      setIsAddingSubCard(false);
      showToast(`Added new card "${cardTitle}"!`);
    }
  };

  const handleDeleteSubCard = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = practiceCards.filter((c) => c.id !== id);
      syncCards(updated);
      if (editingSubCard?.id === id) {
        setEditingSubCard(null);
      }
      showToast(`Deleted "${title}".`);
    }
  };

  // ----------------------------------------------------
  // Home Cards Handlers
  // ----------------------------------------------------
  const handleEditHomeCard = (card: LearningCard) => {
    setEditingHomeCardId(card.id);
    setShowHomeAddForm(false);
    setHomeTitle(card.title);
    setHomeSubtitle(card.subtitle);
    setHomeDescription(card.description);
    setHomeTag(card.tag);
    setHomeSkillType(card.skillType);
    setHomeColorTheme(card.colorTheme);
    setHomeIconName(card.iconName);
  };

  const handleOpenAddHomeCard = () => {
    setEditingHomeCardId(null);
    setShowHomeAddForm(true);
    setHomeTitle('');
    setHomeSubtitle('');
    setHomeDescription('');
    setHomeTag('New Practice');
    setHomeSkillType('writing');
    setHomeColorTheme('teal');
    setHomeIconName('PenTool');
  };

  const handleSaveHomeCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTitle.trim() || !homeSubtitle.trim()) {
      showToast('Please fill out the card title and subtitle.');
      return;
    }

    if (editingHomeCardId) {
      const updated = cards.map((c) => {
        if (c.id === editingHomeCardId) {
          return {
            ...c,
            title: homeTitle.trim(),
            subtitle: homeSubtitle.trim(),
            description: homeDescription.trim(),
            tag: homeTag.trim(),
            skillType: homeSkillType,
            colorTheme: homeColorTheme,
            iconName: homeIconName,
          };
        }
        return c;
      });
      onUpdateCards(updated);
      setEditingHomeCardId(null);
      showToast(`Updated card "${homeTitle}" successfully!`);
    } else if (showHomeAddForm) {
      const newCard: LearningCard = {
        id: `card_${Date.now()}`,
        title: homeTitle.trim(),
        subtitle: homeSubtitle.trim(),
        description: homeDescription.trim(),
        tag: homeTag.trim(),
        skillType: homeSkillType,
        colorTheme: homeColorTheme,
        iconName: homeIconName,
      };
      onUpdateCards([...cards, newCard]);
      setShowHomeAddForm(false);
      showToast(`Created new card "${homeTitle}"!`);
    }
  };

  const handleDeleteHomeCard = (id: string, title: string) => {
    if (cards.length <= 1) {
      showToast('Cannot delete the last remaining card.');
      return;
    }
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = cards.filter((c) => c.id !== id);
      onUpdateCards(updated);
      if (editingHomeCardId === id) setEditingHomeCardId(null);
      showToast(`Deleted card "${title}".`);
    }
  };

  const handleMoveHomeCard = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= cards.length) return;
    const newCards = [...cards];
    const [moved] = newCards.splice(idx, 1);
    newCards.splice(targetIdx, 0, moved);
    onUpdateCards(newCards);
  };

  if (!isOpen) return null;

  // Security Check: Enforce admin role strictly
  const effectiveUser = currentUser ?? getCurrentUser();
  if (effectiveUser?.role !== 'admin') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Admin Access Required</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            මෙම අංගය පරිපාලක (Admin) සඳහා පමණක් වෙන් කර ඇත. සාමාන්‍ය සිසුන්ට (Students) මෙහි දත්ත වෙනස් කිරීමට හෝ එකතු කිරීමට අවසර නොමැත.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close (වසන්න)
          </button>
        </div>
      </div>
    );
  }

  // Filter practice sub-cards for current hub & category
  const activeSubCards = practiceCards.filter((c) => {
    if (selectedHub === 'grammar') {
      return c.hub === 'grammar' && c.category === selectedGrammarCat;
    }
    return c.hub === selectedHub;
  });

  const hubTheme = {
    writing: {
      name: 'Writing',
      icon: PenTool,
      accentText: 'text-teal-700',
      activeTab: 'bg-teal-600 text-white',
      badge: 'bg-teal-50 text-teal-800 border-teal-200',
      tag: 'Writing & Reading Hub',
    },
    spoken_oral: {
      name: 'Spoken / Oral',
      icon: Mic,
      accentText: 'text-purple-700',
      activeTab: 'bg-purple-600 text-white',
      badge: 'bg-purple-50 text-purple-800 border-purple-200',
      tag: 'Speaking & Listening Hub',
    },
    grammar: {
      name: 'Grammar',
      icon: Sparkles,
      accentText: 'text-amber-700',
      activeTab: 'bg-amber-600 text-white',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      tag: 'Do, Have, Be Hub',
    },
    simple_sentence: {
      name: 'Simple Sentence',
      icon: BookOpen,
      accentText: 'text-sky-700',
      activeTab: 'bg-sky-600 text-white',
      badge: 'bg-sky-50 text-sky-800 border-sky-200',
      tag: 'Sentence Patterns',
    },
    essential_verbs: {
      name: 'Essential Verbs',
      icon: Zap,
      accentText: 'text-rose-700',
      activeTab: 'bg-rose-600 text-white',
      badge: 'bg-rose-50 text-rose-800 border-rose-200',
      tag: 'Action Verbs & Forms Hub',
    },
  }[selectedHub];

  return (
    <div className="fixed inset-0 z-[60] w-screen h-screen bg-slate-50 flex flex-col overflow-hidden overscroll-contain">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="w-full h-full flex flex-col overflow-hidden bg-slate-50"
      >
        {/* Full Screen Header - Fully Responsive for Mobile & Desktop */}
        <div className="bg-white/95 backdrop-blur-md px-2.5 sm:px-6 py-2 sm:py-3.5 border-b border-slate-200/80 flex flex-col xl:flex-row xl:items-center justify-between gap-2 sm:gap-3 shrink-0 shadow-2xs z-10">
          {/* Top Bar (Mobile & Desktop): Back / Logo / Title / Exit */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 w-full xl:w-auto">
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-[11px] sm:text-xs transition-all cursor-pointer shadow-2xs shrink-0"
                title="Close and Return to App (Esc)"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Back</span>
              </button>

              <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0" />

              <div className="shrink-0 scale-90 sm:scale-100 origin-left">
                <TaizerFlowLogo size="sm" showSubtitle={false} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1 sm:gap-2">
                  <h2 className="text-xs sm:text-base font-black text-slate-900 leading-tight tracking-tight truncate">
                    Admin Studio
                  </h2>
                  <span className="text-[8px] sm:text-[10px] font-black px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 hidden md:block truncate">
                  Manage Home Cards, English &amp; Sinhala notes, Media Hub, and Student accounts
                </p>
              </div>
            </div>

            {/* Done / Exit button */}
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] sm:text-xs shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
              title="Close Admin Panel"
            >
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              <span>Done</span>
            </button>
          </div>

          {/* Navigation Switcher Tabs - Mobile Touch Scroll & Seamless Pill Container */}
          <div className="w-full xl:w-auto overflow-x-auto no-scrollbar scrollbar-none py-0.5">
            <div className="inline-flex min-w-full sm:min-w-max items-center bg-slate-100/90 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs gap-0.5 sm:gap-1">
              <button
                onClick={() => {
                  setActiveTab('notes_editor');
                  setShowHomeAddForm(false);
                  setEditingHomeCardId(null);
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs transition-all cursor-pointer shrink-0 ${
                  activeTab === 'notes_editor'
                    ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-900/5 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Languages className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-indigo-600" />
                <span className="sm:hidden">Notes</span>
                <span className="hidden sm:inline">Notes &amp; Content</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('home_cards');
                  setEditingSubCard(null);
                  setIsAddingSubCard(false);
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs transition-all cursor-pointer shrink-0 ${
                  activeTab === 'home_cards'
                    ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-900/5 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <LayoutGrid className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-indigo-600" />
                <span className="sm:hidden">Cards ({cards.length})</span>
                <span className="hidden sm:inline">Home Cards ({cards.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('side_media');
                  setShowHomeAddForm(false);
                  setEditingHomeCardId(null);
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs transition-all cursor-pointer shrink-0 ${
                  activeTab === 'side_media'
                    ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-900/5 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Tv className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-amber-500" />
                <span className="sm:hidden">Media Hub</span>
                <span className="hidden sm:inline">Side Hub (Videos/Ads)</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('user_approval');
                  setShowHomeAddForm(false);
                  setEditingHomeCardId(null);
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs transition-all cursor-pointer shrink-0 relative ${
                  activeTab === 'user_approval'
                    ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-900/5 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-indigo-600" />
                <span className="sm:hidden">Users</span>
                <span className="hidden sm:inline">User Approvals</span>
                {pendingUserCount > 0 && (
                  <span className="ml-0.5 px-1 sm:px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-extrabold text-[9px] sm:text-[10px] animate-pulse">
                    {pendingUserCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('admin_settings');
                  setShowHomeAddForm(false);
                  setEditingHomeCardId(null);
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs transition-all cursor-pointer shrink-0 ${
                  activeTab === 'admin_settings'
                    ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-900/5 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-slate-600" />
                <span className="sm:hidden">Settings</span>
                <span className="hidden sm:inline">Admin Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-xl flex items-center gap-2 backdrop-blur-md border border-slate-700"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar sm:custom-scrollbar p-2 sm:p-6 md:p-8 overscroll-contain">
          {/* ============================================================= */}
          {/* TAB 1: NOTES & CONTENT FORM (ENGLISH & SINHALA)               */}
          {/* ============================================================= */}
          {activeTab === 'notes_editor' && (
            <div className="space-y-6 max-w-6xl mx-auto pb-12">
              {/* Hub Selector (Writing, Spoken/Oral, Grammar) */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Select Studio Section / Hub
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Choose which cards to add or edit English & Sinhala notes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
                  <button
                    onClick={() => {
                      setSelectedHub('writing');
                      setEditingSubCard(null);
                      setIsAddingSubCard(false);
                    }}
                    className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm border transition-all cursor-pointer ${
                      selectedHub === 'writing'
                        ? 'bg-teal-600 text-white border-teal-700 shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Writing</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedHub('spoken_oral');
                      setEditingSubCard(null);
                      setIsAddingSubCard(false);
                    }}
                    className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm border transition-all cursor-pointer ${
                      selectedHub === 'spoken_oral'
                        ? 'bg-purple-600 text-white border-purple-700 shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>Spoken / Oral</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedHub('grammar');
                      setEditingSubCard(null);
                      setIsAddingSubCard(false);
                    }}
                    className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm border transition-all cursor-pointer ${
                      selectedHub === 'grammar'
                        ? 'bg-amber-600 text-white border-amber-700 shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Grammar</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedHub('simple_sentence');
                      setEditingSubCard(null);
                      setIsAddingSubCard(false);
                    }}
                    className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm border transition-all cursor-pointer ${
                      selectedHub === 'simple_sentence'
                        ? 'bg-sky-600 text-white border-sky-700 shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Simple Sentence</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedHub('essential_verbs');
                      setEditingSubCard(null);
                      setIsAddingSubCard(false);
                    }}
                    className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm border transition-all cursor-pointer ${
                      selectedHub === 'essential_verbs'
                        ? 'bg-rose-600 text-white border-rose-700 shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Essential Verbs</span>
                  </button>
                </div>

                {/* If Grammar is selected, show Do, Have, Be category selector */}
                {selectedHub === 'grammar' && (
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 mr-2">Category:</span>
                    {(['do', 'have', 'be'] as const).map((cat) => {
                      const count = practiceCards.filter(
                        (c) => c.hub === 'grammar' && c.category === cat
                      ).length;
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedGrammarCat(cat);
                            setEditingSubCard(null);
                            setIsAddingSubCard(false);
                          }}
                          className={`px-4 py-1.5 rounded-xl font-bold text-xs uppercase transition-all cursor-pointer ${
                            selectedGrammarCat === cat
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dedicated Managers OR Form View for Sub-Cards */}
              {selectedHub === 'simple_sentence' ? (
                <SimpleSentenceManager onShowToast={showToast} />
              ) : selectedHub === 'essential_verbs' ? (
                <EssentialVerbsManager onShowToast={showToast} />
              ) : (editingSubCard || isAddingSubCard) ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${hubTheme.badge}`}>
                          {hubTheme.name}
                        </span>
                        {selectedHub === 'grammar' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {selectedGrammarCat}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-black text-slate-900">
                        {editingSubCard
                          ? `Edit Notes for "${editingSubCard.title}"`
                          : `Create New Card for ${hubTheme.name}`}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Add English notes and Sinhala explanations (සිංහල සටහන් සහ තේරුම්)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowLivePreview(!showLivePreview)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          showLivePreview
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{showLivePreview ? 'Hide Preview' : 'Live Preview'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingSubCard(null);
                          setIsAddingSubCard(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* The Beautiful Dual Form */}
                  <form onSubmit={handleSaveSubCard} className="space-y-6">
                    {/* Row 1: Title and Subtitle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Card Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cardTitle}
                          onChange={(e) => setCardTitle(e.target.value)}
                          placeholder="e.g. Writing, Speaking, or Card 1"
                          required
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Subtitle / Subject Area (උප මාතෘකාව)
                        </label>
                        <input
                          type="text"
                          value={cardSubtitle}
                          onChange={(e) => setCardSubtitle(e.target.value)}
                          placeholder="e.g. Sentence Structure & Essay Composition"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                    </div>

                    {/* Row 2: English Notes & Explanation */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                          <BookOpen className="w-4 h-4 text-teal-600" />
                          <span>1. English Notes & Lesson Explanation (ඉංග්‍රීසි සටහන්)</span>
                        </label>

                        {englishContent && (
                          <button
                            type="button"
                            onClick={() => handleSpeechTest(englishContent)}
                            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Test Voice Audio</span>
                          </button>
                        )}
                      </div>

                      <textarea
                        rows={5}
                        value={englishContent}
                        onChange={(e) => setEnglishContent(e.target.value)}
                        placeholder="Write the English rules, theory, structure, and guidelines here... (e.g. Subject + Verb + Object rules, linking words, etc.)"
                        className="w-full p-4 rounded-2xl bg-teal-50/20 border border-teal-200/80 text-sm text-slate-900 font-medium leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>

                    {/* Row 3: Sinhala Notes & Explanation (සිංහල සටහන් සහ පැහැදිලි කිරීම්) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                          <Languages className="w-4 h-4 text-amber-600" />
                          <span>2. Sinhala Notes & Meanings (සිංහල සටහන් සහ තේරුම්)</span>
                        </label>
                      </div>

                      <textarea
                        rows={5}
                        value={sinhalaContent}
                        onChange={(e) => setSinhalaContent(e.target.value)}
                        placeholder="පාඩමේ සිංහල පැහැදිලි කිරීම, නීති රීති සහ සටහන් මෙහි ලියන්න... (උදා: වාක්‍ය රටාව කර්තෘ + ක්‍රියාව + කර්මය ලෙස ගොඩනැගේ, Linking words භාවිතය ආදිය)"
                        className="w-full p-4 rounded-2xl bg-amber-50/30 border border-amber-200/80 text-sm text-slate-900 font-medium leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    {/* Row 4: Examples List (English Sentence + Sinhala Meaning) */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-sky-600" />
                          <span>3. Example Sentences with Sinhala Meaning ({examplesList.length})</span>
                        </label>
                      </div>

                      {/* Display added examples */}
                      {examplesList.length > 0 && (
                        <div className="space-y-2">
                          {examplesList.map((ex, idx) => (
                            <div
                              key={idx}
                              className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80"
                            >
                              <div className="flex items-start gap-2.5">
                                <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{ex.english}</p>
                                  {ex.sinhala && (
                                    <p className="text-xs font-medium text-amber-800/90 mt-0.5">
                                      {ex.sinhala}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleSpeechTest(ex.english)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-white transition-colors cursor-pointer"
                                  title="Test sentence audio"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExample(idx)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Remove sentence"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add new sentence fields */}
                      <div className="p-4 rounded-2xl bg-sky-50/40 border border-sky-200/80 space-y-3">
                        <span className="text-xs font-bold text-sky-900 block">
                          + Add a New Sentence Pair
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={newExEnglish}
                            onChange={(e) => setNewExEnglish(e.target.value)}
                            placeholder="English sentence (e.g. She writes essays every day.)"
                            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
                          />
                          <input
                            type="text"
                            value={newExSinhala}
                            onChange={(e) => setNewExSinhala(e.target.value)}
                            placeholder="සිංහල තේරුම (උදා: ඇය සෑම දිනකම රචනා ලියයි.)"
                            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddExample}
                          disabled={!newExEnglish.trim()}
                          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          + Add Example Sentence
                        </button>
                      </div>
                    </div>

                    {/* Row 5: Notes / Key Tip */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <Info className="w-4 h-4 text-indigo-600" />
                        <span>4. Key Grammar Tip / Golden Rule (විශේෂ සටහන හෝ නීතිය)</span>
                      </label>
                      <input
                        type="text"
                        value={cardNotes}
                        onChange={(e) => setCardNotes(e.target.value)}
                        placeholder="e.g. Always proofread your written work before submitting. / ලියා අවසන් වූ පසු දෙවරක් කියවා බලන්න."
                        className="w-full px-4 py-2.5 rounded-xl bg-indigo-50/30 border border-indigo-200/80 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>

                    {/* Live Preview Box */}
                    {showLivePreview && (
                      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                              Student Live Preview
                            </span>
                          </div>

                          {/* Language view preview toggle */}
                          <div className="flex items-center bg-slate-800 p-1 rounded-xl">
                            <button
                              type="button"
                              onClick={() => setPreviewLang('both')}
                              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                                previewLang === 'both' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                              }`}
                            >
                              දෙකම (Both)
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewLang('en')}
                              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                                previewLang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                              }`}
                            >
                              English
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewLang('si')}
                              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                                previewLang === 'si' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                              }`}
                            >
                              සිංහල
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-black">{cardTitle || 'Card Title'}</h4>
                          {cardSubtitle && (
                            <p className="text-xs text-indigo-300 font-semibold">{cardSubtitle}</p>
                          )}
                        </div>

                        {(previewLang === 'both' || previewLang === 'en') && englishContent && (
                          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                            <span className="text-[10px] font-bold text-teal-400 block mb-1">
                              ENGLISH NOTES:
                            </span>
                            {englishContent}
                          </div>
                        )}

                        {(previewLang === 'both' || previewLang === 'si') && sinhalaContent && (
                          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-900/60 text-xs sm:text-sm text-amber-200 leading-relaxed whitespace-pre-line">
                            <span className="text-[10px] font-bold text-amber-400 block mb-1">
                              සිංහල සටහන්:
                            </span>
                            {sinhalaContent}
                          </div>
                        )}

                        {examplesList.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-sky-400 block">
                              EXAMPLES ({examplesList.length}):
                            </span>
                            {examplesList.map((ex, i) => (
                              <div
                                key={i}
                                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-0.5"
                              >
                                <p className="font-bold text-white">{ex.english}</p>
                                {ex.sinhala && (
                                  <p className="font-medium text-amber-300/80">{ex.sinhala}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Submit Action */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSubCard(null);
                          setIsAddingSubCard(false);
                        }}
                        className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save English & Sinhala Notes</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                /* Sub-cards List for the active hub */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        {hubTheme.name} Cards ({activeSubCards.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Click "Edit Notes" to add or update English and Sinhala explanations
                      </p>
                    </div>

                    <button
                      onClick={handleOpenAddSubCard}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add New Card to {hubTheme.name}</span>
                    </button>
                  </div>

                  {/* Sub-cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeSubCards
                      .sort((a, b) => a.number - b.number)
                      .map((card) => {
                        const hasContent = Boolean(
                          card.englishContent?.trim() ||
                            card.sinhalaContent?.trim() ||
                            (card.examples && card.examples.length > 0)
                        );

                        return (
                          <div
                            key={card.id}
                            className="group relative rounded-3xl p-5 bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-sm transition-all shadow-2xs flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-black text-base shadow-2xs">
                                  {card.number}
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {hasContent ? (
                                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      Notes Added
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                                      Empty
                                    </span>
                                  )}

                                  <button
                                    onClick={() => handleDeleteSubCard(card.id, card.title)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Delete card"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <h4 className="text-base font-black text-slate-900 leading-snug">
                                {card.title}
                              </h4>
                              {card.subtitle && (
                                <p className={`text-xs font-bold mt-0.5 ${hubTheme.accentText}`}>
                                  {card.subtitle}
                                </p>
                              )}

                              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                {card.sinhalaContent || card.englishContent || 'No notes added yet.'}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400">
                                {card.examples?.length || 0} example sentences
                              </span>
                              <button
                                onClick={() => handleOpenEditSubCard(card)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-xs transition-all cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit English & Sinhala Notes</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================= */}
          {/* TAB 2: HOME SCREEN CARDS MANAGEMENT                           */}
          {/* ============================================================= */}
          {activeTab === 'home_cards' && (
            <div className="space-y-6 max-w-6xl mx-auto pb-12">
              {/* Home Add / Edit Form */}
              {(editingHomeCardId || showHomeAddForm) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-md space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {editingHomeCardId ? 'Edit Home Card' : 'Add New Home Card'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Configure the card appearing on the main Home screen
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingHomeCardId(null);
                        setShowHomeAddForm(false);
                      }}
                      className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveHomeCard} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Card Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={homeTitle}
                          onChange={(e) => setHomeTitle(e.target.value)}
                          placeholder="e.g. Vocabulary Master"
                          required
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Subtitle <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={homeSubtitle}
                          onChange={(e) => setHomeSubtitle(e.target.value)}
                          placeholder="e.g. Words & Idioms"
                          required
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={homeDescription}
                        onChange={(e) => setHomeDescription(e.target.value)}
                        placeholder="Brief summary of what this section teaches..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tag</label>
                        <input
                          type="text"
                          value={homeTag}
                          onChange={(e) => setHomeTag(e.target.value)}
                          placeholder="e.g. Core Skills"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Linked Hub
                        </label>
                        <select
                          value={homeSkillType}
                          onChange={(e) => setHomeSkillType(e.target.value as SkillType)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                          <option value="writing">Writing (Writing & Reading)</option>
                          <option value="spoken_oral">Spoken/Oral (Speaking & Listening)</option>
                          <option value="grammar">Grammar (Do, Have, Be)</option>
                          <option value="simple_sentence">Simple Sentence (Sentence Patterns)</option>
                        </select>
                      </div>
                    </div>

                    {/* Color Theme Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Card Color Theme
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {(['teal', 'purple', 'amber', 'emerald', 'sky', 'rose', 'indigo', 'orange'] as CardColorTheme[]).map(
                          (theme) => {
                            const thStyle = THEME_STYLES[theme];
                            const isSelected = homeColorTheme === theme;
                            return (
                              <button
                                key={theme}
                                type="button"
                                onClick={() => setHomeColorTheme(theme)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold capitalize border transition-all cursor-pointer ${
                                  isSelected
                                    ? `${thStyle.glassCard} text-slate-950 font-black scale-105 shadow-xs`
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                <span className={`w-2.5 h-2.5 rounded-full ${thStyle.accentBar}`} />
                                <span>{theme}</span>
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>

                    {/* Icon Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Icon</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(ICON_COMPONENTS).map((iconKey) => {
                          const IconComp = ICON_COMPONENTS[iconKey as CardIconName];
                          const isSelected = homeIconName === iconKey;
                          return (
                            <button
                              key={iconKey}
                              type="button"
                              onClick={() => setHomeIconName(iconKey as CardIconName)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                              title={iconKey}
                            >
                              <IconComp className="w-5 h-5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingHomeCardId(null);
                          setShowHomeAddForm(false);
                        }}
                        className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                      >
                        Save Card
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Cards List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Home Screen Cards ({cards.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Add, edit, reorder or delete main home screen cards
                    </p>
                  </div>

                  {!showHomeAddForm && !editingHomeCardId && (
                    <button
                      onClick={handleOpenAddHomeCard}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Home Card</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {cards.map((card, idx) => {
                    const Icon = ICON_COMPONENTS[card.iconName] || Sparkles;
                    const theme = THEME_STYLES[card.colorTheme] || THEME_STYLES.teal;

                    return (
                      <div
                        key={card.id}
                        className={`relative overflow-hidden rounded-2xl p-3.5 sm:p-4 ${theme.glassCard} ${theme.glassGlow} transition-all flex flex-col justify-between group shadow-xs`}
                      >
                        {/* Frosted glass shimmer highlight */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-2.5">
                            <div
                              className={`w-8 h-8 rounded-xl ${theme.iconBg} flex items-center justify-center shadow-2xs`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="flex items-center gap-0.5 bg-white/70 backdrop-blur-xs p-0.5 rounded-lg border border-white/80">
                              <button
                                onClick={() => handleMoveHomeCard(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 rounded-md text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                title="Move up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveHomeCard(idx, 'down')}
                                disabled={idx === cards.length - 1}
                                className="p-1 rounded-md text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                title="Move down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteHomeCard(card.id, card.title)}
                                className="p-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 transition-colors cursor-pointer ml-0.5"
                                title="Delete card"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-1.5">
                            <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                              {card.title}
                            </h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badge}`}
                            >
                              {card.tag}
                            </span>
                          </div>

                          <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                            {card.subtitle}
                          </p>
                          <p className="text-xs text-slate-600/90 mt-1.5 line-clamp-2 leading-relaxed">
                            {card.description}
                          </p>
                        </div>

                        <div className="relative z-10 mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Linked: {card.skillType}
                          </span>
                          <button
                            onClick={() => handleEditHomeCard(card)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-slate-800 font-bold text-xs border border-white/80 shadow-2xs transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit Card</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* TAB: SIDE HUB & MEDIA (VIDEOS, WEBSITES, NEWS, ADS)          */}
          {/* ============================================================= */}
          {activeTab === 'side_media' && (
            <div className="max-w-6xl mx-auto pb-12">
              <SideMediaManager />
            </div>
          )}

          {/* ============================================================= */}
          {/* TAB 3: USER APPROVALS & ACCOUNT MANAGEMENT                    */}
          {/* ============================================================= */}
          {activeTab === 'user_approval' && (
            <div className="max-w-6xl mx-auto pb-12">
              <UserApprovalManager
                onNotify={(msg) => {
                  setToastMessage(msg);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
              />
            </div>
          )}

          {/* ============================================================= */}
          {/* TAB 4: ADMIN SETTINGS & POLICIES                              */}
          {/* ============================================================= */}
          {activeTab === 'admin_settings' && (
            <div className="max-w-5xl mx-auto pb-12">
              <AdminSettingsManager
                onNotify={(msg) => {
                  setToastMessage(msg);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
