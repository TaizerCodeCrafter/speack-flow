import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Volume2,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Tag,
  FolderPlus,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRightLeft,
} from 'lucide-react';
import { EssentialVerbItem, VerbPackCard, CardColorTheme } from '../../types';
import {
  getStoredEssentialVerbs,
  saveStoredEssentialVerbs,
  getStoredVerbCategories,
  saveStoredVerbCategories,
  getStoredVerbPacks,
  saveStoredVerbPacks,
  DEFAULT_VERB_PACKS,
  speakVerbText,
  INITIAL_ESSENTIAL_VERBS,
  DEFAULT_VERB_CATEGORIES,
} from '../../data/essentialVerbsData';

interface EssentialVerbsManagerProps {
  onShowToast: (msg: string) => void;
}

export const EssentialVerbsManager: React.FC<EssentialVerbsManagerProps> = ({ onShowToast }) => {
  // Stored Packs (Cards) & Verbs
  const [packs, setPacks] = useState<VerbPackCard[]>(() => getStoredVerbPacks());
  const [verbs, setVerbs] = useState<EssentialVerbItem[]>(() => getStoredEssentialVerbs());
  const [categories, setCategories] = useState<string[]>(() => getStoredVerbCategories());

  // Selected Pack (Card) for adding / editing verbs (default to first pack, e.g. "Essential Verbs 1")
  const [selectedPackId, setSelectedPackId] = useState<string>(() => {
    const stored = getStoredVerbPacks();
    return stored[0]?.id || 'essential-verbs-1';
  });

  // Card (Pack) Creation & Editing Modal States
  const [showCreatePackModal, setShowCreatePackModal] = useState(false);
  const [newPackTitle, setNewPackTitle] = useState('');
  const [newPackSubtitle, setNewPackSubtitle] = useState('');
  const [newPackTag, setNewPackTag] = useState('');
  const [newPackDescription, setNewPackDescription] = useState('');
  const [newPackColor, setNewPackColor] = useState<CardColorTheme>('rose');

  const [editingPack, setEditingPack] = useState<VerbPackCard | null>(null);
  const [editPackTitle, setEditPackTitle] = useState('');
  const [editPackSubtitle, setEditPackSubtitle] = useState('');
  const [editPackTag, setEditPackTag] = useState('');
  const [editPackDescription, setEditPackDescription] = useState('');
  const [editPackColor, setEditPackColor] = useState<CardColorTheme>('rose');

  // Form states for adding new verb (Ordered strictly: Sinhala, V1, V2, V3, V4, V5)
  const [sinhalaMeaningInput, setSinhalaMeaningInput] = useState('');
  const [verbInput, setVerbInput] = useState('');
  const [pastSimpleInput, setPastSimpleInput] = useState('');
  const [pastParticipleInput, setPastParticipleInput] = useState('');
  const [sOrEsInput, setSOrEsInput] = useState('');
  const [ingInput, setIngInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Daily Routine');
  const [exampleSentenceInput, setExampleSentenceInput] = useState('');
  const [exampleSinhalaInput, setExampleSinhalaInput] = useState('');
  const [isIrregular, setIsIrregular] = useState(false);

  // New Category creator state
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Verb Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSinhala, setEditSinhala] = useState('');
  const [editVerb, setEditVerb] = useState('');
  const [editPastSimple, setEditPastSimple] = useState('');
  const [editPastParticiple, setEditPastParticiple] = useState('');
  const [editSOrEs, setEditSOrEs] = useState('');
  const [editIng, setEditIng] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editExampleSentence, setEditExampleSentence] = useState('');
  const [editExampleSinhala, setEditExampleSinhala] = useState('');
  const [editIsIrregular, setEditIsIrregular] = useState(false);
  const [editCardId, setEditCardId] = useState('');

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterCategory, setActiveFilterCategory] = useState('All');

  // Audio testing state
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Listen to external storage events
  useEffect(() => {
    const handleStorage = () => {
      setPacks(getStoredVerbPacks());
      setVerbs(getStoredEssentialVerbs());
      setCategories(getStoredVerbCategories());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Sync helpers
  const syncPacks = (updated: VerbPackCard[]) => {
    setPacks(updated);
    saveStoredVerbPacks(updated);
  };

  const syncVerbs = (updated: EssentialVerbItem[]) => {
    setVerbs(updated);
    saveStoredEssentialVerbs(updated);
  };

  const syncCategories = (updatedCats: string[]) => {
    setCategories(updatedCats);
    saveStoredVerbCategories(updatedCats);
  };

  // Find currently active pack
  const activePack = useMemo(() => {
    return packs.find((p) => p.id === selectedPackId) || packs[0] || DEFAULT_VERB_PACKS[0];
  }, [packs, selectedPackId]);

  // Verbs strictly inside the currently active pack (e.g. Essential Verbs 1 = 250 verbs)
  const verbsInActivePack = useMemo(() => {
    return verbs.filter((v) => (v.cardId || 'essential-verbs-1') === activePack.id);
  }, [verbs, activePack.id]);

  // Auto fill predictions when user enters V1
  const handleV1Change = (val: string) => {
    setVerbInput(val);
    const trimmed = val.trim().toLowerCase();
    if (!trimmed) return;

    if (!pastSimpleInput || pastSimpleInput.toLowerCase().startsWith(trimmed)) {
      if (trimmed.endsWith('e')) {
        setPastSimpleInput(val + 'd');
        setPastParticipleInput(val + 'd');
      } else if (trimmed.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(trimmed.charAt(trimmed.length - 2))) {
        const base = val.slice(0, -1);
        setPastSimpleInput(base + 'ied');
        setPastParticipleInput(base + 'ied');
      } else {
        setPastSimpleInput(val + 'ed');
        setPastParticipleInput(val + 'ed');
      }
    }

    if (!sOrEsInput || sOrEsInput.toLowerCase().startsWith(trimmed)) {
      if (trimmed.endsWith('s') || trimmed.endsWith('sh') || trimmed.endsWith('ch') || trimmed.endsWith('x') || trimmed.endsWith('z')) {
        setSOrEsInput(val + 'es');
      } else if (trimmed.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(trimmed.charAt(trimmed.length - 2))) {
        setSOrEsInput(val.slice(0, -1) + 'ies');
      } else {
        setSOrEsInput(val + 's');
      }
    }

    if (!ingInput || ingInput.toLowerCase().startsWith(trimmed)) {
      if (trimmed.endsWith('e') && !trimmed.endsWith('ee')) {
        setIngInput(val.slice(0, -1) + 'ing');
      } else {
        setIngInput(val + 'ing');
      }
    }
  };

  // Derive all categories across stored + current pack verbs
  const allCategories: string[] = useMemo(() => {
    const fromVerbs = verbs
      .map((v) => v.category?.trim())
      .filter((c): c is string => Boolean(c));
    const combined = Array.from(new Set([...categories, ...fromVerbs]));
    return combined.length > 0 ? combined : DEFAULT_VERB_CATEGORIES;
  }, [verbs, categories]);

  // Filtered verbs for the downward list inside active pack
  const filteredVerbs = useMemo(() => {
    return verbsInActivePack.filter((item) => {
      const matchesCat =
        activeFilterCategory === 'All'
          ? true
          : item.category?.toLowerCase() === activeFilterCategory.toLowerCase();

      if (!matchesCat) return false;

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
  }, [verbsInActivePack, activeFilterCategory, searchQuery]);

  // Audio Pronunciation
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
      0.9,
      () => setSpeakingId(null),
      () => setSpeakingId(null)
    );
    if (!spoken) setSpeakingId(null);
  };

  // -------------------------------------------------------------
  // CARD / PACK MANAGEMENT
  // -------------------------------------------------------------

  // Open modal to create a new card (e.g. "Essential Verbs 2")
  const handleOpenCreatePack = () => {
    const nextIndex = packs.length + 1;
    setNewPackTitle(`Essential Verbs ${nextIndex}`);
    setNewPackSubtitle(`Action Verbs & Forms Pack ${nextIndex}`);
    setNewPackTag(`Pack ${nextIndex}`);
    setNewPackDescription(`Master daily action verbs, forms and Sinhala meanings.`);
    setNewPackColor('rose');
    setShowCreatePackModal(true);
  };

  // Save new card
  const handleSaveCreatePack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackTitle.trim()) {
      onShowToast('Please enter a card title (e.g. Essential Verbs 2)');
      return;
    }

    const newId = `essential-verbs-${Date.now()}`;
    const newPack: VerbPackCard = {
      id: newId,
      title: newPackTitle.trim(),
      subtitle: newPackSubtitle.trim() || undefined,
      tag: newPackTag.trim() || undefined,
      description: newPackDescription.trim() || undefined,
      iconName: 'Zap',
      colorTheme: newPackColor,
      createdAt: Date.now(),
    };

    const updated = [...packs, newPack];
    syncPacks(updated);
    setSelectedPackId(newId);
    setShowCreatePackModal(false);
    onShowToast(`Card "${newPack.title}" created successfully! You can now add verbs into it.`);
  };

  // Open Edit Card Modal
  const handleOpenEditPack = (pack: VerbPackCard) => {
    setEditingPack(pack);
    setEditPackTitle(pack.title);
    setEditPackSubtitle(pack.subtitle || '');
    setEditPackTag(pack.tag || '');
    setEditPackDescription(pack.description || '');
    setEditPackColor(pack.colorTheme || 'rose');
  };

  // Save Card Edits
  const handleSaveEditPack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPack || !editPackTitle.trim()) return;

    const updated = packs.map((p) => {
      if (p.id === editingPack.id) {
        return {
          ...p,
          title: editPackTitle.trim(),
          subtitle: editPackSubtitle.trim() || undefined,
          tag: editPackTag.trim() || undefined,
          description: editPackDescription.trim() || undefined,
          colorTheme: editPackColor,
        };
      }
      return p;
    });

    syncPacks(updated);
    setEditingPack(null);
    onShowToast('Card updated successfully!');
  };

  // Delete Card
  const handleDeletePack = (packId: string, packTitle: string) => {
    if (packs.length <= 1) {
      alert('You cannot delete the only card. At least one card must remain.');
      return;
    }

    const verbsInThis = verbs.filter((v) => (v.cardId || 'essential-verbs-1') === packId);
    const confirmMsg = verbsInThis.length > 0
      ? `Are you sure you want to delete "${packTitle}"? It has ${verbsInThis.length} verbs. Its verbs will be moved to the primary card.`
      : `Are you sure you want to delete "${packTitle}"?`;

    if (window.confirm(confirmMsg)) {
      const remainingPacks = packs.filter((p) => p.id !== packId);
      const targetPackId = remainingPacks[0].id;

      // Reassign verbs so no verbs are lost
      const updatedVerbs = verbs.map((v) => {
        if ((v.cardId || 'essential-verbs-1') === packId) {
          return { ...v, cardId: targetPackId };
        }
        return v;
      });

      syncPacks(remainingPacks);
      syncVerbs(updatedVerbs);
      setSelectedPackId(targetPackId);
      onShowToast(`Deleted card "${packTitle}".`);
    }
  };

  // -------------------------------------------------------------
  // VERB MANAGEMENT
  // -------------------------------------------------------------

  // Add new Category handler
  const handleCreateCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      onShowToast('Please enter a category name');
      return;
    }

    const exists = allCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setCategoryInput(trimmed);
      setIsAddingNewCategory(false);
      setNewCategoryName('');
      onShowToast(`Selected category: "${trimmed}"`);
      return;
    }

    const updated = [...categories, trimmed];
    syncCategories(updated);
    setCategoryInput(trimmed);
    setIsAddingNewCategory(false);
    setNewCategoryName('');
    onShowToast(`Added category: "${trimmed}"`);
  };

  // Delete Category from Essential Verbs
  const handleDeleteCategory = (catToDelete: string) => {
    const matchingVerbs = verbs.filter(
      (v) => (v.category || 'General').toLowerCase() === catToDelete.toLowerCase()
    );
    const count = matchingVerbs.length;

    let proceed = false;
    if (count > 0) {
      proceed = window.confirm(
        `Are you sure you want to delete category "${catToDelete}"?\n\n${count} verb(s) in this category will be safely moved to "General".\n\n("${catToDelete}" කාණ්ඩය මකාදැමීමට අවශ්‍යද? මෙහි ඇති ක්‍රියාපද ${count} "General" කාණ්ඩයට මාරු කරනු ලැබේ.)`
      );
    } else {
      proceed = window.confirm(
        `Are you sure you want to delete category "${catToDelete}"?\n\n("${catToDelete}" කාණ්ඩය මකාදැමීමට අවශ්‍යද?)`
      );
    }

    if (!proceed) return;

    // Move matching verbs to 'General'
    if (count > 0) {
      const updatedVerbs = verbs.map((v) => {
        if ((v.category || 'General').toLowerCase() === catToDelete.toLowerCase()) {
          return { ...v, category: 'General' };
        }
        return v;
      });
      syncVerbs(updatedVerbs);
    }

    // Remove from categories list
    const updatedCats = categories.filter((c) => c.toLowerCase() !== catToDelete.toLowerCase());
    syncCategories(updatedCats.length > 0 ? updatedCats : ['General']);

    if (activeFilterCategory.toLowerCase() === catToDelete.toLowerCase()) {
      setActiveFilterCategory('All');
    }
    if (categoryInput.toLowerCase() === catToDelete.toLowerCase()) {
      setCategoryInput('General');
    }

    onShowToast(`Category "${catToDelete}" deleted!`);
  };

  // Add new verb to the ACTIVE PACK
  const handleAddVerb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sinhalaMeaningInput.trim()) {
      onShowToast('කරුණාකර සිංහල තේරුම ඇතුළත් කරන්න (Sinhala Meaning is required)!');
      return;
    }
    if (!verbInput.trim()) {
      onShowToast('Please enter the English Present Verb (V1)!');
      return;
    }

    const nextNumber = verbsInActivePack.length + 1;
    const newVerb: EssentialVerbItem = {
      id: `verb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      cardId: activePack.id,
      number: nextNumber,
      sinhalaMeaning: sinhalaMeaningInput.trim(),
      verb: verbInput.trim(),
      pastSimple: pastSimpleInput.trim() || verbInput.trim(),
      pastParticiple: pastParticipleInput.trim() || verbInput.trim(),
      sOrEsForm: sOrEsInput.trim() || `${verbInput.trim()}s`,
      ingForm: ingInput.trim() || `${verbInput.trim()}ing`,
      category: categoryInput.trim() || 'General',
      exampleSentence: exampleSentenceInput.trim(),
      exampleSinhala: exampleSinhalaInput.trim(),
      isIrregular,
      createdAt: Date.now(),
    };

    const updated = [...verbs, newVerb];
    syncVerbs(updated);

    // Reset inputs
    setSinhalaMeaningInput('');
    setVerbInput('');
    setPastSimpleInput('');
    setPastParticipleInput('');
    setSOrEsInput('');
    setIngInput('');
    setExampleSentenceInput('');
    setExampleSinhalaInput('');

    onShowToast(`Verb "${newVerb.verb}" added to "${activePack.title}"!`);
  };

  // Start editing verb
  const handleStartEdit = (item: EssentialVerbItem) => {
    setEditingId(item.id);
    setEditSinhala(item.sinhalaMeaning);
    setEditVerb(item.verb);
    setEditPastSimple(item.pastSimple);
    setEditPastParticiple(item.pastParticiple);
    setEditSOrEs(item.sOrEsForm || `${item.verb}s`);
    setEditIng(item.ingForm || `${item.verb}ing`);
    setEditCategory(item.category || 'General');
    setEditExampleSentence(item.exampleSentence || '');
    setEditExampleSinhala(item.exampleSinhala || '');
    setEditIsIrregular(!!item.isIrregular);
    setEditCardId(item.cardId || activePack.id);
  };

  // Save edited verb
  const handleSaveEdit = () => {
    if (!editVerb.trim() || !editSinhala.trim()) {
      onShowToast('Verb and Sinhala meaning cannot be empty.');
      return;
    }

    const updated = verbs.map((v) => {
      if (v.id === editingId) {
        return {
          ...v,
          cardId: editCardId || activePack.id,
          sinhalaMeaning: editSinhala.trim(),
          verb: editVerb.trim(),
          pastSimple: editPastSimple.trim(),
          pastParticiple: editPastParticiple.trim(),
          sOrEsForm: editSOrEs.trim(),
          ingForm: editIng.trim(),
          category: editCategory.trim() || 'General',
          exampleSentence: editExampleSentence.trim(),
          exampleSinhala: editExampleSinhala.trim(),
          isIrregular: editIsIrregular,
        };
      }
      return v;
    });

    syncVerbs(updated);
    setEditingId(null);
    onShowToast('Verb updated successfully!');
  };

  // Delete verb
  const handleDeleteVerb = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = verbs.filter((v) => v.id !== id);
      syncVerbs(updated);
      onShowToast(`Deleted "${name}".`);
    }
  };

  // Move verb up/down within active pack
  const handleMove = (activeIdx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? activeIdx - 1 : activeIdx + 1;
    if (targetIdx < 0 || targetIdx >= verbsInActivePack.length) return;

    const sourceVerb = verbsInActivePack[activeIdx];
    const targetVerb = verbsInActivePack[targetIdx];

    const sourceGlobalIdx = verbs.findIndex((v) => v.id === sourceVerb.id);
    const targetGlobalIdx = verbs.findIndex((v) => v.id === targetVerb.id);

    if (sourceGlobalIdx === -1 || targetGlobalIdx === -1) return;

    const newVerbs = [...verbs];
    newVerbs[sourceGlobalIdx] = targetVerb;
    newVerbs[targetGlobalIdx] = sourceVerb;

    syncVerbs(newVerbs);
  };

  // Restore 250 Verbs into "Essential Verbs 1"
  const handleRestoreDefaults = () => {
    if (
      window.confirm(
        'Restore the 250 Essential Verbs into "Essential Verbs 1"? Any customized verbs in this pack will be refreshed.'
      )
    ) {
      // Keep verbs of other packs, and reset Essential Verbs 1 to INITIAL_ESSENTIAL_VERBS
      const otherPackVerbs = verbs.filter(
        (v) => (v.cardId || 'essential-verbs-1') !== 'essential-verbs-1'
      );
      const defaultPackVerbs = INITIAL_ESSENTIAL_VERBS.map((v) => ({
        ...v,
        cardId: 'essential-verbs-1',
      }));

      syncVerbs([...defaultPackVerbs, ...otherPackVerbs]);
      syncCategories(DEFAULT_VERB_CATEGORIES);
      onShowToast('Essential Verbs 1 restored with all 250 verbs!');
    }
  };

  return (
    <div id="essential-verbs-admin-manager" className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. VERB CARDS / PACKS SELECTOR & MANAGEMENT                                */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200 mb-1">
              <Layers className="w-3.5 h-3.5 text-rose-600" />
              <span>Verb Cards & Packs (ක්‍රියාපද කාඩ්පත්)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Essential Verbs Cards ({packs.length})
            </h3>
            <p className="text-xs text-slate-500">
              Select a card to manage its verbs, or click "+ Create New Card" to add cards like "Essential Verbs 2".
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenCreatePack}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>+ Create New Card (e.g. Essential Verbs 2)</span>
            </button>

            <button
              type="button"
              onClick={handleRestoreDefaults}
              title="Restore full 250 verbs to Essential Verbs 1"
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset 250 Verbs</span>
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {packs.map((pack) => {
            const isSelected = pack.id === activePack.id;
            const countInThis = verbs.filter(
              (v) => (v.cardId || 'essential-verbs-1') === pack.id
            ).length;

            return (
              <div
                key={pack.id}
                onClick={() => setSelectedPackId(pack.id)}
                className={`group relative rounded-2xl p-4.5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-50/70 border-rose-500 shadow-md ring-2 ring-rose-400/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Zap className="w-4 h-4 fill-current" />
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {countInThis} Verbs
                      </span>
                    </div>

                    {isSelected ? (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
                        Active Card
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-rose-600">
                        Click to Manage
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-black text-slate-900">{pack.title}</h4>
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

                <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                    {pack.tag || `${countInThis} Verbs`}
                  </span>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleOpenEditPack(pack)}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
                      title="Edit Card Title & Info"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {packs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeletePack(pack.id, pack.title)}
                        className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 transition-colors"
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
      {/* 2. ACTIVE CARD NOTICE & ADD NEW VERB FORM                                 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-600 text-white text-xs font-black shadow-2xs">
                <Zap className="w-3 h-3 fill-current" />
                <span>Card: {activePack.title}</span>
              </span>
              <span className="text-xs font-bold text-slate-500">
                ({verbsInActivePack.length} Verbs currently inside)
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Add New Verb to "{activePack.title}" (ක්‍රියාපද එකතු කිරීම)
            </h3>
            <p className="text-xs text-slate-500">
              පිළිවෙලට: <strong>සිංහල තේරුම, Present (V1), Past (V2), Past Participle (V3), s/es (V4), ing (V5)</strong>.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddVerb} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* 1. Sinhala Meaning */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                1. සිංහල තේරුම <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={sinhalaMeaningInput}
                onChange={(e) => setSinhalaMeaningInput(e.target.value)}
                placeholder="උදා: සෙල්ලම් කරනවා"
                className="w-full px-3 py-2 bg-rose-50/40 border border-rose-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>

            {/* 2. Present (V1) */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span>2. Present (V1)</span>
                  <span className="text-rose-500">*</span>
                </label>
                {verbInput.trim() && (
                  <button
                    type="button"
                    onClick={() => handleSpeak(verbInput, 'test-v1')}
                    className="text-[10px] text-rose-600 hover:text-rose-800 font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    <Volume2 className="w-2.5 h-2.5" />
                    <span>Speak</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={verbInput}
                onChange={(e) => handleV1Change(e.target.value)}
                placeholder="e.g. Play"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>

            {/* 3. Past (V2) */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                3. Past (V2)
              </label>
              <input
                type="text"
                value={pastSimpleInput}
                onChange={(e) => setPastSimpleInput(e.target.value)}
                placeholder="e.g. Played"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            {/* 4. Past Participle (V3) */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                4. Past Part. (V3)
              </label>
              <input
                type="text"
                value={pastParticipleInput}
                onChange={(e) => setPastParticipleInput(e.target.value)}
                placeholder="e.g. Played"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            {/* 5. s/es (V4) */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                5. s/es (V4)
              </label>
              <input
                type="text"
                value={sOrEsInput}
                onChange={(e) => setSOrEsInput(e.target.value)}
                placeholder="e.g. Plays"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            {/* 6. ing (V5) */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                6. ing (V5)
              </label>
              <input
                type="text"
                value={ingInput}
                onChange={(e) => setIngInput(e.target.value)}
                placeholder="e.g. Playing"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Row 2: Category & Irregular Toggle */}
          <div className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-rose-600" />
                <span>Select Category (කාණ්ඩය):</span>
              </label>

              {!isAddingNewCategory && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewCategory(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 bg-white px-2 py-0.5 rounded-lg border border-rose-200 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Category</span>
                </button>
              )}
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap items-center gap-1.5">
              {allCategories.map((cat) => {
                const isSelected = categoryInput.toLowerCase() === cat.toLowerCase();
                return (
                  <div
                    key={cat}
                    className={`inline-flex items-center rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-white hover:bg-rose-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setCategoryInput(cat)}
                      className="px-2.5 py-1.5 text-inherit cursor-pointer flex items-center gap-1"
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{cat}</span>
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
                          ? 'text-white/70 hover:text-white hover:bg-rose-600'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-100/50'
                      }`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {isAddingNewCategory && (
              <div className="flex items-center gap-2 pt-2 border-t border-rose-100">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name..."
                  className="px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs font-semibold"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNewCategory(false)}
                  className="px-2 py-1 text-slate-400 text-xs hover:text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Example Sentence & Sinhala Meaning (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Example Sentence (උදාහරණ ඉංග්‍රීසි වාක්‍යය - Optional)
              </label>
              <input
                type="text"
                value={exampleSentenceInput}
                onChange={(e) => setExampleSentenceInput(e.target.value)}
                placeholder="e.g. They play football every evening."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Example Sinhala Translation (වාක්‍යයේ සිංහල තේරුම - Optional)
              </label>
              <input
                type="text"
                value={exampleSinhalaInput}
                onChange={(e) => setExampleSinhalaInput(e.target.value)}
                placeholder="උදා: ඔවුන් සෑම සවසකම පාපන්දු ක්‍රීඩා කරති."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Add Verb to "{activePack.title}"</span>
            </button>
          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* 3. VERBS LIST INSIDE ACTIVE CARD                                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>{activePack.title} Verb List ({filteredVerbs.length})</span>
            </h4>
            <p className="text-xs text-slate-500">
              Verbs belonging to <strong>{activePack.title}</strong>. Edit, test voice audio, or reorder.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search English or Sinhala..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>

          <button
            onClick={() => setActiveFilterCategory('All')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilterCategory === 'All'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({verbsInActivePack.length})
          </button>

          {allCategories.map((cat) => {
            const count = verbsInActivePack.filter(
              (v) => v.category?.toLowerCase() === cat.toLowerCase()
            ).length;
            const isSelected = activeFilterCategory.toLowerCase() === cat.toLowerCase();
            return (
              <div
                key={cat}
                className={`inline-flex items-center rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                  isSelected
                    ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveFilterCategory(cat)}
                  className="px-2.5 py-1 text-inherit cursor-pointer flex items-center gap-1.5"
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-white text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
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
                      ? 'text-white/70 hover:text-white hover:bg-rose-600'
                      : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Verbs List */}
        {filteredVerbs.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm font-bold text-slate-500">No verbs found in this card.</p>
            <p className="text-xs text-slate-400 mt-1">
              Use the form above to add your first verb to {activePack.title}.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredVerbs.map((item, idx) => {
              const isEditing = editingId === item.id;

              if (isEditing) {
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-amber-50/50 border-2 border-amber-300 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800">
                        Editing Verb #{item.number || idx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        {packs.length > 1 && (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-slate-500">Card:</span>
                            <select
                              value={editCardId}
                              onChange={(e) => setEditCardId(e.target.value)}
                              className="text-xs font-bold px-2 py-1 rounded-lg bg-white border border-slate-200"
                            >
                              {packs.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          1. Sinhala Meaning
                        </label>
                        <input
                          type="text"
                          value={editSinhala}
                          onChange={(e) => setEditSinhala(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          2. Present (V1)
                        </label>
                        <input
                          type="text"
                          value={editVerb}
                          onChange={(e) => setEditVerb(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          3. Past (V2)
                        </label>
                        <input
                          type="text"
                          value={editPastSimple}
                          onChange={(e) => setEditPastSimple(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          4. Past Part. (V3)
                        </label>
                        <input
                          type="text"
                          value={editPastParticiple}
                          onChange={(e) => setEditPastParticiple(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          5. s/es (V4)
                        </label>
                        <input
                          type="text"
                          value={editSOrEs}
                          onChange={(e) => setEditSOrEs(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          6. ing (V5)
                        </label>
                        <input
                          type="text"
                          value={editIng}
                          onChange={(e) => setEditIng(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="px-4 py-1 rounded-xl bg-amber-600 text-white text-xs font-bold"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 text-xs font-black flex items-center justify-center shrink-0">
                      #{item.number || idx + 1}
                    </span>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{item.verb}</span>
                        <span className="text-xs text-slate-400 font-semibold">•</span>
                        <span className="text-xs font-bold text-slate-700">{item.pastSimple}</span>
                        <span className="text-xs text-slate-400 font-semibold">•</span>
                        <span className="text-xs font-bold text-slate-700">{item.pastParticiple}</span>
                        {item.category && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            {item.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-rose-700">
                          {item.sinhalaMeaning}
                        </span>
                        {(item.sOrEsForm || item.ingForm) && (
                          <span className="text-[11px] text-slate-500 font-medium">
                            ({item.sOrEsForm}, {item.ingForm})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-end gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSpeak(`${item.verb}, ${item.pastSimple}, ${item.pastParticiple}`, item.id)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        speakingId === item.id
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                      title="Speak V1, V2, V3"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-600 border border-slate-200 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === verbsInActivePack.length - 1}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-600 border border-slate-200 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                      title="Edit Verb"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteVerb(item.id, item.verb)}
                      className="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                      title="Delete Verb"
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
      {/* MODAL: CREATE NEW VERB CARD (e.g. "Essential Verbs 2")                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showCreatePackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Create New Verb Card
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add a new card group like "Essential Verbs 2" for more action verbs.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreatePackModal(false)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCreatePack} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Card Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPackTitle}
                    onChange={(e) => setNewPackTitle(e.target.value)}
                    placeholder="e.g. Essential Verbs 2"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subtitle / Subject
                  </label>
                  <input
                    type="text"
                    value={newPackSubtitle}
                    onChange={(e) => setNewPackSubtitle(e.target.value)}
                    placeholder="e.g. Action Verbs & Usages Part 2"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Badge Tag
                    </label>
                    <input
                      type="text"
                      value={newPackTag}
                      onChange={(e) => setNewPackTag(e.target.value)}
                      placeholder="e.g. Pack 2"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Theme Color
                    </label>
                    <select
                      value={newPackColor}
                      onChange={(e) => setNewPackColor(e.target.value as CardColorTheme)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      <option value="rose">Rose (Red/Pink)</option>
                      <option value="emerald">Emerald (Green)</option>
                      <option value="sky">Sky (Blue)</option>
                      <option value="amber">Amber (Orange/Gold)</option>
                      <option value="purple">Purple</option>
                      <option value="teal">Teal</option>
                      <option value="indigo">Indigo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={newPackDescription}
                    onChange={(e) => setNewPackDescription(e.target.value)}
                    placeholder="Short description of what students will practice in this card..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreatePackModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Create Card
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: EDIT EXISTING VERB CARD                                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingPack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Edit Verb Card: {editingPack.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update title, subtitle or description for this card.
                  </p>
                </div>
                <button
                  onClick={() => setEditingPack(null)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditPack} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Card Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editPackTitle}
                    onChange={(e) => setEditPackTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subtitle / Subject
                  </label>
                  <input
                    type="text"
                    value={editPackSubtitle}
                    onChange={(e) => setEditPackSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Badge Tag
                    </label>
                    <input
                      type="text"
                      value={editPackTag}
                      onChange={(e) => setEditPackTag(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Theme Color
                    </label>
                    <select
                      value={editPackColor}
                      onChange={(e) => setEditPackColor(e.target.value as CardColorTheme)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      <option value="rose">Rose</option>
                      <option value="emerald">Emerald</option>
                      <option value="sky">Sky</option>
                      <option value="amber">Amber</option>
                      <option value="purple">Purple</option>
                      <option value="teal">Teal</option>
                      <option value="indigo">Indigo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={editPackDescription}
                    onChange={(e) => setEditPackDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingPack(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
