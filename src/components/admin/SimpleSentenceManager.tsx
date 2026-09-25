import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Volume2,
  Trash2,
  Edit2,
  X,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Search,
  Tag,
  Filter,
  RotateCcw,
  FolderPlus,
  Layers,
  Sparkles,
  Check,
} from 'lucide-react';
import { SimpleSentenceItem, SentencePackCard, CardColorTheme } from '../../types';
import {
  getStoredSimpleSentences,
  saveStoredSimpleSentences,
  speakText,
  getStoredSentenceCategories,
  saveStoredSentenceCategories,
  DEFAULT_SENTENCE_CATEGORIES,
  getStoredSentencePacks,
  saveStoredSentencePacks,
  DEFAULT_SENTENCE_PACKS,
  restoreDefaultHaveDoBeSentences,
  restoreDefaultModalSentences,
  restoreDefaultMixedAdvanceSentences,
  restoreAllPackSentences,
} from '../../data/simpleSentencesData';

interface SimpleSentenceManagerProps {
  onShowToast: (msg: string) => void;
}

export const SimpleSentenceManager: React.FC<SimpleSentenceManagerProps> = ({ onShowToast }) => {
  // Stored Packs (Cards) & Sentences
  const [packs, setPacks] = useState<SentencePackCard[]>(() => getStoredSentencePacks());
  const [sentences, setSentences] = useState<SimpleSentenceItem[]>(() => getStoredSimpleSentences());

  // Selected Card filter in admin view: 'all' or pack.id
  const [selectedPackId, setSelectedPackId] = useState<string>(() => {
    const stored = getStoredSentencePacks();
    return stored[0]?.id || 'simple-sentences-1';
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const stored = getStoredSentenceCategories();
    const sentenceCats = getStoredSimpleSentences()
      .map((s) => s.category?.trim())
      .filter(Boolean) as string[];
    const combined = Array.from(new Set([...stored, ...sentenceCats]));
    return combined.length > 0 ? combined : DEFAULT_SENTENCE_CATEGORIES;
  });

  // Card (Pack) Creation Modal State
  const [showCreatePackModal, setShowCreatePackModal] = useState(false);
  const [newPackTitle, setNewPackTitle] = useState('');
  const [newPackSubtitle, setNewPackSubtitle] = useState('');
  const [newPackDescription, setNewPackDescription] = useState('');
  const [newPackTheme, setNewPackTheme] = useState<CardColorTheme>('sky');

  // Card (Pack) Editing Modal State
  const [editingPack, setEditingPack] = useState<SentencePackCard | null>(null);
  const [editPackTitle, setEditPackTitle] = useState('');
  const [editPackSubtitle, setEditPackSubtitle] = useState('');
  const [editPackDescription, setEditPackDescription] = useState('');
  const [editPackTheme, setEditPackTheme] = useState<CardColorTheme>('sky');

  // Form input states for Add Sentence
  const [targetCardId, setTargetCardId] = useState<string>(() => {
    const stored = getStoredSentencePacks();
    return stored[0]?.id || 'simple-sentences-1';
  });
  const [englishInput, setEnglishInput] = useState('');
  const [sinhalaInput, setSinhalaInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<string>(() => {
    const stored = getStoredSentenceCategories();
    return stored[0] || 'Daily Life';
  });
  const [customCategory, setCustomCategory] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [listCategoryFilter, setListCategoryFilter] = useState<string>('all');

  // Audio preview
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [previewSpeaking, setPreviewSpeaking] = useState(false);

  // Inline editing state for Sentence
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEnglish, setEditEnglish] = useState('');
  const [editSinhala, setEditSinhala] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editCardId, setEditCardId] = useState('simple-sentences-1');

  // Sync state across tabs / windows
  useEffect(() => {
    const handleStorage = () => {
      setPacks(getStoredSentencePacks());
      setSentences(getStoredSimpleSentences());
      const stored = getStoredSentenceCategories();
      const sentenceCats = getStoredSimpleSentences()
        .map((s) => s.category?.trim())
        .filter(Boolean) as string[];
      const combined = Array.from(new Set([...stored, ...sentenceCats]));
      setCategories(combined.length > 0 ? combined : DEFAULT_SENTENCE_CATEGORIES);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Sync target card with selectedPackId when user clicks a specific card
  useEffect(() => {
    if (selectedPackId !== 'all') {
      setTargetCardId(selectedPackId);
    }
  }, [selectedPackId]);

  // Audio speech handler
  const handleSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(id);
    speakText(
      text,
      0.9,
      () => setSpeakingId(null),
      () => setSpeakingId(null)
    );
  };

  const handlePreviewSpeak = () => {
    if (!englishInput.trim()) return;
    setPreviewSpeaking(true);
    speakText(
      englishInput.trim(),
      0.9,
      () => setPreviewSpeaking(false),
      () => setPreviewSpeaking(false)
    );
  };

  // Card Management handlers
  const handleOpenCreatePack = () => {
    const nextNum = packs.length + 1;
    setNewPackTitle(`Simple Sentences ${nextNum}`);
    setNewPackSubtitle('Daily Conversation & Routine');
    setNewPackDescription('Master essential English sentences with Sinhala meaning and voice.');
    setNewPackTheme(nextNum % 2 === 0 ? 'emerald' : 'sky');
    setShowCreatePackModal(true);
  };

  const handleSaveNewPack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackTitle.trim()) {
      onShowToast('Please enter a Card title (උදා: Simple Sentences 2)');
      return;
    }

    const nextId = `simple-sentences-${Date.now()}`;
    const newPack: SentencePackCard = {
      id: nextId,
      title: newPackTitle.trim(),
      subtitle: newPackSubtitle.trim() || 'Daily Conversations & Fluency',
      description: newPackDescription.trim() || 'Practice practical simple sentences with natural audio.',
      tag: newPackTitle.trim(),
      iconName: 'BookOpen',
      colorTheme: newPackTheme,
      createdAt: Date.now(),
    };

    const updated = [...packs, newPack];
    setPacks(updated);
    saveStoredSentencePacks(updated);

    setShowCreatePackModal(false);
    setSelectedPackId(nextId);
    setTargetCardId(nextId);
    onShowToast(`"${newPack.title}" කාඩ්පත සාර්ථකව නිර්මාණය විය!`);
  };

  const handleOpenEditPack = (pack: SentencePackCard) => {
    setEditingPack(pack);
    setEditPackTitle(pack.title);
    setEditPackSubtitle(pack.subtitle || '');
    setEditPackDescription(pack.description || '');
    setEditPackTheme(pack.colorTheme || 'sky');
  };

  const handleSaveEditPack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPack || !editPackTitle.trim()) return;

    const updated = packs.map((p) => {
      if (p.id === editingPack.id) {
        return {
          ...p,
          title: editPackTitle.trim(),
          subtitle: editPackSubtitle.trim() || undefined,
          description: editPackDescription.trim() || undefined,
          colorTheme: editPackTheme,
        };
      }
      return p;
    });

    setPacks(updated);
    saveStoredSentencePacks(updated);
    setEditingPack(null);
    onShowToast('Card updated successfully!');
  };

  const handleDeletePack = (packId: string, packTitle: string) => {
    if (packs.length <= 1) {
      alert('You cannot delete the only card. At least one card must remain.');
      return;
    }

    const countInCard = sentences.filter((s) => (s.cardId || 'simple-sentences-1') === packId).length;
    const confirmMsg =
      countInCard > 0
        ? `"${packTitle}" කාඩ්පත මකා දැමීමට ඔබට විශ්වාසද?\n\nමෙහි ඇති වාක්‍ය ${countInCard} ප්‍රධාන කාඩ්පත වෙත ආරක්ෂිතව මාරු කරනු ලැබේ.`
        : `"${packTitle}" කාඩ්පත මකා දැමීමට ඔබට විශ්වාසද?`;

    if (window.confirm(confirmMsg)) {
      const remainingPacks = packs.filter((p) => p.id !== packId);
      const fallbackPackId = remainingPacks[0].id;

      const updatedSentences = sentences.map((s) => {
        if ((s.cardId || 'simple-sentences-1') === packId) {
          return { ...s, cardId: fallbackPackId };
        }
        return s;
      });

      setPacks(remainingPacks);
      saveStoredSentencePacks(remainingPacks);
      setSentences(updatedSentences);
      saveStoredSimpleSentences(updatedSentences);

      if (selectedPackId === packId) {
        setSelectedPackId(fallbackPackId);
      }
      if (targetCardId === packId) {
        setTargetCardId(fallbackPackId);
      }
      onShowToast(`"${packTitle}" කාඩ්පත ඉවත් කරන ලදී.`);
    }
  };

  // Add Sentence Handler
  const handleAddSentence = (e: React.FormEvent) => {
    e.preventDefault();
    const eng = englishInput.trim();
    const sin = sinhalaInput.trim();

    if (!eng || !sin) {
      onShowToast('Please fill in both English and Sinhala fields');
      return;
    }

    const finalCategory = isAddingNewCategory
      ? customCategory.trim() || 'General'
      : categoryInput.trim() || 'General';

    const cardToAssign = targetCardId || packs[0]?.id || 'simple-sentences-1';

    const newItem: SimpleSentenceItem = {
      id: `sent-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      cardId: cardToAssign,
      english: eng,
      sinhala: sin,
      category: finalCategory,
      createdAt: Date.now(),
    };

    const updated = [newItem, ...sentences];
    setSentences(updated);
    saveStoredSimpleSentences(updated);

    // Save category if new
    if (!categories.some((c) => c.toLowerCase() === finalCategory.toLowerCase())) {
      const updatedCats = [...categories, finalCategory];
      setCategories(updatedCats);
      saveStoredSentenceCategories(updatedCats);
    }

    // Reset inputs
    setEnglishInput('');
    setSinhalaInput('');
    if (isAddingNewCategory) {
      setIsAddingNewCategory(false);
      setCustomCategory('');
      setCategoryInput(finalCategory);
    }

    const assignedPack = packs.find((p) => p.id === cardToAssign);
    onShowToast(`වාක්‍යය "${assignedPack?.title || 'Card'}" වෙත එක් විය!`);
  };

  // Delete Sentence
  const handleDelete = (id: string, text: string) => {
    if (window.confirm(`Delete sentence "${text}"?`)) {
      const updated = sentences.filter((s) => s.id !== id);
      setSentences(updated);
      saveStoredSimpleSentences(updated);
      onShowToast('Sentence deleted');
    }
  };

  // Start Edit Sentence
  const handleStartEdit = (item: SimpleSentenceItem) => {
    setEditingId(item.id);
    setEditEnglish(item.english);
    setEditSinhala(item.sinhala);
    setEditCategory(item.category || 'General');
    setEditCardId(item.cardId || packs[0]?.id || 'simple-sentences-1');
  };

  // Save Edit Sentence
  const handleSaveEdit = () => {
    if (!editEnglish.trim() || !editSinhala.trim()) {
      onShowToast('Both English and Sinhala are required');
      return;
    }

    const updated = sentences.map((s) => {
      if (s.id === editingId) {
        return {
          ...s,
          english: editEnglish.trim(),
          sinhala: editSinhala.trim(),
          category: editCategory.trim() || 'General',
          cardId: editCardId || packs[0]?.id || 'simple-sentences-1',
        };
      }
      return s;
    });

    setSentences(updated);
    saveStoredSimpleSentences(updated);
    setEditingId(null);
    onShowToast('Sentence updated');
  };

  // Move sentence up/down in overall list
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sentences.length) return;

    const copy = [...sentences];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    setSentences(copy);
    saveStoredSimpleSentences(copy);
  };

  const handleClearAll = () => {
    if (sentences.length === 0) return;
    if (window.confirm('Are you sure you want to delete all simple sentences?')) {
      setSentences([]);
      saveStoredSimpleSentences([]);
      onShowToast('All simple sentences cleared');
    }
  };

  // Delete category handler
  const handleDeleteCategory = (catToDelete: string) => {
    const matchingSentences = sentences.filter(
      (s) => (s.category || 'General').toLowerCase() === catToDelete.toLowerCase()
    );
    const count = matchingSentences.length;

    let proceed = false;
    if (count > 0) {
      proceed = window.confirm(
        `Are you sure you want to delete category "${catToDelete}"?\n\n${count} sentence(s) in this category will be moved to "General".\n\n("${catToDelete}" වර්ගය මකාදැමීමට අවශ්‍යද? මෙහි ඇති වාක්‍ය ${count} "General" වර්ගයට මාරු කරනු ලැබේ.)`
      );
    } else {
      proceed = window.confirm(
        `Are you sure you want to delete category "${catToDelete}"?\n\n("${catToDelete}" වර්ගය මකාදැමීමට අවශ්‍යද?)`
      );
    }

    if (!proceed) return;

    if (count > 0) {
      const updatedSentences = sentences.map((s) => {
        if ((s.category || 'General').toLowerCase() === catToDelete.toLowerCase()) {
          return { ...s, category: 'General' };
        }
        return s;
      });
      setSentences(updatedSentences);
      saveStoredSimpleSentences(updatedSentences);
    }

    const updatedCats = categories.filter(
      (c) => c.toLowerCase() !== catToDelete.toLowerCase()
    );
    const finalCats = updatedCats.length > 0 ? updatedCats : ['General'];
    setCategories(finalCats);
    saveStoredSentenceCategories(finalCats);

    if (listCategoryFilter.toLowerCase() === catToDelete.toLowerCase()) {
      setListCategoryFilter('all');
    }
    if (categoryInput.toLowerCase() === catToDelete.toLowerCase()) {
      setCategoryInput(finalCats[0] || 'General');
    }

    onShowToast(`Category "${catToDelete}" deleted successfully!`);
  };

  const handleResetCategories = () => {
    if (
      window.confirm(
        'Reset categories to default list (General, Daily Life, Basics, Questions, Greetings, Work & Study, Travel)?'
      )
    ) {
      setCategories(DEFAULT_SENTENCE_CATEGORIES);
      saveStoredSentenceCategories(DEFAULT_SENTENCE_CATEGORIES);
      onShowToast('Categories reset to defaults');
    }
  };

  // Filtered sentences based on active Card, search & category
  const filteredSentences = useMemo(() => {
    return sentences
      .filter((s) => {
        // 1. Card filter
        if (selectedPackId !== 'all') {
          const itemCardId = s.cardId || 'simple-sentences-1';
          if (itemCardId !== selectedPackId) return false;
        }

        // 2. Category filter
        const matchesCat =
          listCategoryFilter === 'all' ||
          (s.category || 'General').toLowerCase() === listCategoryFilter.toLowerCase();
        if (!matchesCat) return false;

        // 3. Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.english.toLowerCase().includes(q) ||
          s.sinhala.toLowerCase().includes(q) ||
          (s.category && s.category.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (a.number != null && b.number != null) return a.number - b.number;
        if (a.number != null) return -1;
        if (b.number != null) return 1;
        return 0;
      });
  }, [sentences, selectedPackId, listCategoryFilter, searchQuery]);

  // Color theme class helper for cards
  const getCardThemeStyle = (colorTheme?: CardColorTheme) => {
    switch (colorTheme) {
      case 'emerald':
        return {
          border: 'border-emerald-300 hover:border-emerald-400',
          activeBg: 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-400/20',
          badge: 'bg-emerald-100 text-emerald-800',
          iconBg: 'bg-emerald-600 text-white',
        };
      case 'indigo':
        return {
          border: 'border-indigo-300 hover:border-indigo-400',
          activeBg: 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-400/20',
          badge: 'bg-indigo-100 text-indigo-800',
          iconBg: 'bg-indigo-600 text-white',
        };
      case 'rose':
        return {
          border: 'border-rose-300 hover:border-rose-400',
          activeBg: 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-400/20',
          badge: 'bg-rose-100 text-rose-800',
          iconBg: 'bg-rose-600 text-white',
        };
      case 'amber':
        return {
          border: 'border-amber-300 hover:border-amber-400',
          activeBg: 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400/20',
          badge: 'bg-amber-100 text-amber-800',
          iconBg: 'bg-amber-600 text-white',
        };
      case 'purple':
        return {
          border: 'border-purple-300 hover:border-purple-400',
          activeBg: 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-400/20',
          badge: 'bg-purple-100 text-purple-800',
          iconBg: 'bg-purple-600 text-white',
        };
      case 'teal':
        return {
          border: 'border-teal-300 hover:border-teal-400',
          activeBg: 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-400/20',
          badge: 'bg-teal-100 text-teal-800',
          iconBg: 'bg-teal-600 text-white',
        };
      case 'sky':
      default:
        return {
          border: 'border-sky-300 hover:border-sky-400',
          activeBg: 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-400/20',
          badge: 'bg-sky-100 text-sky-800',
          iconBg: 'bg-sky-600 text-white',
        };
    }
  };

  const activePack = packs.find((p) => p.id === selectedPackId);

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP CARDS / PACKS SELECTOR & MANAGEMENT BANNER                         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-sky-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold mb-0.5">
                <BookOpen className="w-3 h-3 text-sky-600" />
                <span>Sentence Cards & Packs (කාඩ්පත්)</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Simple Sentence Cards ({packs.length})
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Click a card below to manage its sentences, or click "+ Create New Card" to add cards like Simple Sentences 2, 3, etc.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={handleOpenCreatePack}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>+ Create New Card</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const targetPack = packs.find((p) => p.id === selectedPackId);
                const isMixedAdvance =
                  selectedPackId === 'mixed-advance' ||
                  (targetPack && targetPack.title.toLowerCase().trim() === 'mixed advance');

                if (isMixedAdvance) {
                  if (
                    window.confirm(
                      'Restore all 800 Mixed Advance sentences to this card? ("Mixed Advance" කාඩ්පතට PDF එකේ වාක්‍ය 800 ම යාවත්කාලීන කිරීමට අවශ්‍යද?)'
                    )
                  ) {
                    const restored = restoreDefaultMixedAdvanceSentences();
                    setSentences(restored);
                    onShowToast('800 Mixed Advance sentences restored to "Mixed Advance" card!');
                  }
                } else if (selectedPackId === 'simple-sentences-2') {
                  if (
                    window.confirm(
                      'Restore 100 Modal sentences (Can/Will/Would/Should/Must) to this card? ("Can / Will / Would / Should / Must" කාඩ්පතට PDF එකේ වාක්‍ය 100 යාවත්කාලීන කිරීමට අවශ්‍යද?)'
                    )
                  ) {
                    const restored = restoreDefaultModalSentences();
                    setSentences(restored);
                    onShowToast('100 Modal sentences restored to "Can / Will / Would / Should / Must"!');
                  }
                } else if (selectedPackId === 'simple-sentences-1') {
                  if (
                    window.confirm(
                      'Restore 100 Have/Do/Be sentences to "Have / Do / Be" card? ("Have / Do / Be" කාඩ්පතට PDF එකේ වාක්‍ය 100 යාවත්කාලීන කිරීමට අවශ්‍යද?)'
                    )
                  ) {
                    const restored = restoreDefaultHaveDoBeSentences();
                    setSentences(restored);
                    onShowToast('100 Have/Do/Be sentences restored successfully!');
                  }
                } else {
                  if (
                    window.confirm(
                      'Restore all 1000 sentences from all PDFs to cards? (PDF ගොනුවල ඇති සියලුම වාක්‍ය 1000 [100+100+800] නැවත යාවත්කාලීන කිරීමට අවශ්‍යද?)'
                    )
                  ) {
                    const restored = restoreAllPackSentences();
                    setSentences(restored);
                    onShowToast('All 1000 sentences restored successfully!');
                  }
                }
              }}
              title="Restore sentences from PDF to active card"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {selectedPackId === 'simple-sentences-2'
                  ? 'Reset Modal 100'
                  : selectedPackId === 'simple-sentences-1'
                  ? 'Reset Have/Do/Be 100'
                  : selectedPackId === 'mixed-advance' || (activePack && activePack.title.toLowerCase().trim() === 'mixed advance')
                  ? 'Reset Mixed 800'
                  : 'Reset All (1000)'}
              </span>
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {/* Card: All Sentences shortcut */}
          <div
            onClick={() => setSelectedPackId('all')}
            className={`group rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPackId === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-400/20'
                : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      selectedPackId === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      selectedPackId === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {sentences.length} Total
                  </span>
                </div>
                {selectedPackId === 'all' ? (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white text-slate-900">
                    Selected
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700">
                    View All
                  </span>
                )}
              </div>
              <h4 className="text-sm font-black">All Sentences (සියලු වාක්‍ය)</h4>
              <p
                className={`text-xs mt-0.5 line-clamp-1 ${
                  selectedPackId === 'all' ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                View and manage all simple sentences across all cards.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-semibold">
              <span className={selectedPackId === 'all' ? 'text-slate-300' : 'text-slate-500'}>
                Across {packs.length} Cards
              </span>
            </div>
          </div>

          {/* Individual Pack Cards */}
          {packs.map((pack) => {
            const isSelected = selectedPackId === pack.id;
            const countInThis = sentences.filter(
              (s) => (s.cardId || 'simple-sentences-1') === pack.id
            ).length;
            const themeStyle = getCardThemeStyle(pack.colorTheme);

            return (
              <div
                key={pack.id}
                onClick={() => setSelectedPackId(pack.id)}
                className={`group relative rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? themeStyle.activeBg
                    : `bg-white hover:bg-slate-50 ${themeStyle.border}`
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${themeStyle.iconBg}`}>
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${themeStyle.badge}`}>
                        {countInThis} Sentences
                      </span>
                    </div>

                    {isSelected ? (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                        Active Card
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700">
                        Click to Select
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-black text-slate-900">{pack.title}</h4>
                  {pack.subtitle && (
                    <p className="text-xs font-semibold text-slate-600 mt-0.5 line-clamp-1">
                      {pack.subtitle}
                    </p>
                  )}
                  {pack.description && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {pack.description}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {pack.tag || `${countInThis} Sentences`}
                  </span>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleOpenEditPack(pack)}
                      className="p-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
                      title="Edit Card Title & Info"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {packs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeletePack(pack.id, pack.title)}
                        className="p-1 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 transition-colors"
                        title="Delete Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ADD SENTENCE FORM                                                      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-sky-200/90 p-4 sm:p-6 shadow-xs relative">
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              +
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                Add New Sentence / වාක්‍යයක් එක් කරන්න
              </h4>
              <p className="text-[11px] text-slate-500">
                ඉංග්‍රීසි වාක්‍යය, සිංහල තේරුම සහ අදාළ Card එක තෝරා ලැයිස්තුවට එක් කරන්න.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">Target Card:</span>
            <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 text-xs font-bold">
              {packs.find((p) => p.id === targetCardId)?.title || 'Simple Sentences 1'}
            </span>
          </div>
        </div>

        <form onSubmit={handleAddSentence} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* Target Card Selector */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Card (කාඩ්පත) <span className="text-rose-500">*</span>
              </label>
              <select
                value={targetCardId}
                onChange={(e) => setTargetCardId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                {packs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* English Text Input */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>
                  English Sentence <span className="text-rose-500">*</span>
                </span>
                {englishInput.trim() && (
                  <button
                    type="button"
                    onClick={handlePreviewSpeak}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2
                      className={`w-3 h-3 ${previewSpeaking ? 'animate-pulse text-sky-600' : ''}`}
                    />
                    <span>{previewSpeaking ? 'Playing...' : 'Test Voice'}</span>
                  </button>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={englishInput}
                  onChange={(e) => setEnglishInput(e.target.value)}
                  placeholder="e.g. She reads a book every night."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 pr-9"
                />
                {englishInput.trim() && (
                  <button
                    type="button"
                    onClick={handlePreviewSpeak}
                    title="Speak English text"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Sinhala Text Input */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sinhala Meaning / වචනය <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={sinhalaInput}
                onChange={(e) => setSinhalaInput(e.target.value)}
                placeholder="e.g. ඇය සෑම රාත්‍රියකම පොතක් කියවයි."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Category Input */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category / වර්ගය
              </label>
              {!isAddingNewCategory ? (
                <div className="flex gap-1.5">
                  <select
                    value={categoryInput}
                    onChange={(e) => {
                      if (e.target.value === '__add_new__') {
                        setIsAddingNewCategory(true);
                      } else {
                        setCategoryInput(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__add_new__" className="text-sky-600 font-bold">
                      + New...
                    </option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="New category"
                    autoFocus
                    className="flex-1 px-2.5 py-2 rounded-xl bg-slate-50 border border-sky-300 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewCategory(false);
                      setCustomCategory('');
                    }}
                    className="px-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Category Pills */}
          <div className="pt-1 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>Quick Categories:</span>
            </span>
            {categories.map((cat) => {
              const isSelected = categoryInput.toLowerCase() === cat.toLowerCase() && !isAddingNewCategory;
              return (
                <div
                  key={cat}
                  className={`inline-flex items-center rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/60'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryInput(cat);
                      setIsAddingNewCategory(false);
                    }}
                    className="px-2.5 py-1 text-inherit cursor-pointer font-bold"
                  >
                    {cat}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(cat);
                    }}
                    title={`Delete category "${cat}"`}
                    className={`p-1 pr-1.5 rounded-r-xl transition-colors cursor-pointer ${
                      isSelected
                        ? 'text-white/70 hover:text-white hover:bg-sky-700'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
            {!isAddingNewCategory && (
              <button
                type="button"
                onClick={() => setIsAddingNewCategory(true)}
                className="px-2 py-1 rounded-xl border border-dashed border-sky-300 hover:border-sky-500 text-sky-600 hover:bg-sky-50 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>+ New Category</span>
              </button>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={!englishInput.trim() || !sinhalaInput.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:pointer-events-none text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Add Sentence to {packs.find((p) => p.id === targetCardId)?.title || 'Card'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* 3. DOWNWARD LIST OF ALL SENTENCES WITH CARD FILTER                         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* List Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Sentences List {selectedPackId !== 'all' ? `(${activePack?.title || 'Card'})` : '(All Cards)'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[11px] font-bold">
              {filteredSentences.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search filter */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sentence or Sinhala..."
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {sentences.length > 0 && (
              <button
                onClick={handleClearAll}
                title="Clear all sentences"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Card Switcher Pills for Sentences List */}
        <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>Card Filter:</span>
          </span>

          <button
            onClick={() => setSelectedPackId('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedPackId === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Cards ({sentences.length})
          </button>

          {packs.map((p) => {
            const count = sentences.filter((s) => (s.cardId || 'simple-sentences-1') === p.id).length;
            const isSelected = selectedPackId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPackId(p.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{p.title}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Filter Pills for List with Category Delete (×) button */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Category:</span>
          </span>
          <button
            onClick={() => setListCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              listCategoryFilter === 'all'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All ({sentences.length})
          </button>
          {categories.map((cat) => {
            const count = sentences.filter(
              (s) => (s.category || 'General').toLowerCase() === cat.toLowerCase()
            ).length;
            const isSelected = listCategoryFilter.toLowerCase() === cat.toLowerCase();

            return (
              <div
                key={cat}
                className={`group inline-flex items-center rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setListCategoryFilter(cat)}
                  className="px-2.5 py-1.5 text-inherit cursor-pointer font-bold flex items-center gap-1.5"
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>

                {/* Delete Category Button (×) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(cat);
                  }}
                  title={`Delete category "${cat}"`}
                  className={`p-1.5 pr-2 rounded-r-xl transition-colors cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'text-white/70 hover:text-white hover:bg-sky-700'
                      : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleResetCategories}
            title="Reset to default categories"
            className="px-2.5 py-1 text-[11px] font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors shrink-0 whitespace-nowrap flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Sentences List Body */}
        {sentences.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h5 className="text-sm font-bold text-slate-800 mb-1">
              දැනට වාක්‍ය කිසිවක් ඇතුළත් කර නොමැත
            </h5>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              ඉහත පෝරමයේ English text එක සහ Sinhala තේරුම ටයිප් කර "Add Sentence" ක්ලික් කරන්න.
            </p>
          </div>
        ) : filteredSentences.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No sentences match your filter in this view.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSentences.map((item) => {
              const originalIndex = sentences.findIndex((s) => s.id === item.id);
              const isSpeaking = speakingId === item.id;
              const isEditing = editingId === item.id;
              const itemPack = packs.find((p) => p.id === (item.cardId || 'simple-sentences-1'));

              if (isEditing) {
                return (
                  <div key={item.id} className="p-4 bg-sky-50/70 border-l-4 border-sky-500 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                      <span>Editing Sentence #{originalIndex + 1}</span>
                      <span className="text-[10px] text-slate-400">Press Save when done</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                          English Text
                        </label>
                        <input
                          type="text"
                          value={editEnglish}
                          onChange={(e) => setEditEnglish(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                          Sinhala Meaning
                        </label>
                        <input
                          type="text"
                          value={editSinhala}
                          onChange={(e) => setEditSinhala(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                          Category
                        </label>
                        <input
                          type="text"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                          Belongs to Card
                        </label>
                        <select
                          value={editCardId}
                          onChange={(e) => setEditCardId(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        >
                          {packs.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="px-4 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-2xs cursor-pointer"
                      >
                        Save Sentence
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className={`p-3.5 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isSpeaking ? 'bg-sky-50/70' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="min-w-6 h-6 px-1 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5">
                      {item.number ? `#${item.number}` : originalIndex + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {item.english}
                        </p>
                        {item.category && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
                            {item.category}
                          </span>
                        )}
                        {itemPack && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            {itemPack.title}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {item.sinhala}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSpeak(item.id, item.english)}
                      title="Speak audio"
                      className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isSpeaking
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-sky-100 text-slate-700'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMove(originalIndex, 'up')}
                      disabled={originalIndex === 0}
                      title="Move Up"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMove(originalIndex, 'down')}
                      disabled={originalIndex === sentences.length - 1}
                      title="Move Down"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      title="Edit Sentence"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.english)}
                      title="Delete Sentence"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL: CREATE NEW CARD                                                 */}
      {/* ========================================================================= */}
      {showCreatePackModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-sky-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">Create New Sentence Card</h4>
                  <p className="text-xs text-slate-500">නව සරල වාක්‍ය කාඩ්පතක් එක් කරන්න</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreatePackModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPack} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Card Title (නම) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPackTitle}
                  onChange={(e) => setNewPackTitle(e.target.value)}
                  placeholder="e.g. Simple Sentences 2"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtitle (උපසිරැසිය)
                </label>
                <input
                  type="text"
                  value={newPackSubtitle}
                  onChange={(e) => setNewPackSubtitle(e.target.value)}
                  placeholder="e.g. Daily Routine & Workplace"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description (විස්තරය)
                </label>
                <textarea
                  value={newPackDescription}
                  onChange={(e) => setNewPackDescription(e.target.value)}
                  rows={2}
                  placeholder="Describe what kind of sentences are in this card..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Theme Color (වර්ණය)
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { theme: 'sky', label: 'Sky Blue', bg: 'bg-sky-500' },
                    { theme: 'emerald', label: 'Emerald Green', bg: 'bg-emerald-500' },
                    { theme: 'indigo', label: 'Indigo', bg: 'bg-indigo-500' },
                    { theme: 'rose', label: 'Rose Pink', bg: 'bg-rose-500' },
                    { theme: 'amber', label: 'Amber', bg: 'bg-amber-500' },
                    { theme: 'purple', label: 'Purple', bg: 'bg-purple-500' },
                    { theme: 'teal', label: 'Teal', bg: 'bg-teal-500' },
                  ].map((color) => (
                    <button
                      key={color.theme}
                      type="button"
                      onClick={() => setNewPackTheme(color.theme as CardColorTheme)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        newPackTheme === color.theme
                          ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${color.bg}`} />
                      <span>{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreatePackModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Create Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: EDIT CARD                                                       */}
      {/* ========================================================================= */}
      {editingPack && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-sky-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">Edit Sentence Card</h4>
                  <p className="text-xs text-slate-500">කාඩ්පතේ නම සහ විස්තර වෙනස් කරන්න</p>
                </div>
              </div>
              <button
                onClick={() => setEditingPack(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPack} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Card Title (නම) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editPackTitle}
                  onChange={(e) => setEditPackTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtitle (උපසිරැසිය)
                </label>
                <input
                  type="text"
                  value={editPackSubtitle}
                  onChange={(e) => setEditPackSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description (විස්තරය)
                </label>
                <textarea
                  value={editPackDescription}
                  onChange={(e) => setEditPackDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Theme Color (වර්ණය)
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { theme: 'sky', label: 'Sky Blue', bg: 'bg-sky-500' },
                    { theme: 'emerald', label: 'Emerald Green', bg: 'bg-emerald-500' },
                    { theme: 'indigo', label: 'Indigo', bg: 'bg-indigo-500' },
                    { theme: 'rose', label: 'Rose Pink', bg: 'bg-rose-500' },
                    { theme: 'amber', label: 'Amber', bg: 'bg-amber-500' },
                    { theme: 'purple', label: 'Purple', bg: 'bg-purple-500' },
                    { theme: 'teal', label: 'Teal', bg: 'bg-teal-500' },
                  ].map((color) => (
                    <button
                      key={color.theme}
                      type="button"
                      onClick={() => setEditPackTheme(color.theme as CardColorTheme)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        editPackTheme === color.theme
                          ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${color.bg}`} />
                      <span>{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPack(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
