import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { SimpleSentenceItem } from '../../types';
import {
  getStoredSimpleSentences,
  saveStoredSimpleSentences,
  speakText,
  getStoredSentenceCategories,
  saveStoredSentenceCategories,
  DEFAULT_SENTENCE_CATEGORIES,
} from '../../data/simpleSentencesData';

interface SimpleSentenceManagerProps {
  onShowToast: (msg: string) => void;
}

export const SimpleSentenceManager: React.FC<SimpleSentenceManagerProps> = ({ onShowToast }) => {
  const [sentences, setSentences] = useState<SimpleSentenceItem[]>(() =>
    getStoredSimpleSentences()
  );

  const [categories, setCategories] = useState<string[]>(() => {
    const stored = getStoredSentenceCategories();
    const sentenceCats = getStoredSimpleSentences()
      .map((s) => s.category?.trim())
      .filter(Boolean) as string[];
    const combined = Array.from(new Set([...stored, ...sentenceCats]));
    return combined.length > 0 ? combined : DEFAULT_SENTENCE_CATEGORIES;
  });

  // Form input states
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

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEnglish, setEditEnglish] = useState('');
  const [editSinhala, setEditSinhala] = useState('');
  const [editCategory, setEditCategory] = useState('');

  useEffect(() => {
    const handleStorage = () => {
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

    const newItem: SimpleSentenceItem = {
      id: `sent-${Date.now()}`,
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
    onShowToast('Sentence added successfully (පහළ ලැයිස්තුවට එක් විය)');
  };

  const handleDelete = (id: string, text: string) => {
    if (window.confirm(`Delete sentence "${text}"?`)) {
      const updated = sentences.filter((s) => s.id !== id);
      setSentences(updated);
      saveStoredSimpleSentences(updated);
      onShowToast('Sentence deleted');
    }
  };

  const handleStartEdit = (item: SimpleSentenceItem) => {
    setEditingId(item.id);
    setEditEnglish(item.english);
    setEditSinhala(item.sinhala);
    setEditCategory(item.category || 'General');
  };

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
        };
      }
      return s;
    });

    setSentences(updated);
    saveStoredSimpleSentences(updated);
    setEditingId(null);
    onShowToast('Sentence updated');
  };

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

  // Delete category handler ("catogory words delete karanna")
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

    // 1. Move any sentences in this category to 'General'
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

    // 2. Remove category from categories array
    const updatedCats = categories.filter(
      (c) => c.toLowerCase() !== catToDelete.toLowerCase()
    );
    const finalCats = updatedCats.length > 0 ? updatedCats : ['General'];
    setCategories(finalCats);
    saveStoredSentenceCategories(finalCats);

    // 3. Reset filters/inputs if they were pointing to this category
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

  // Filtered sentences based on search & category
  const filteredSentences = sentences.filter((s) => {
    const matchesCat =
      listCategoryFilter === 'all' ||
      (s.category || 'General').toLowerCase() === listCategoryFilter.toLowerCase();
    if (!matchesCat) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.english.toLowerCase().includes(q) ||
      s.sinhala.toLowerCase().includes(q) ||
      (s.category && s.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-indigo-500/10 border border-sky-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Simple Sentences Studio</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-200/80 text-sky-900">
                Admin
              </span>
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              සරල ඉංග්‍රීසි වාක්‍ය සහ සිංහල තේරුම පහසුවෙන් කළමනාකරණය කරන්න.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <span className="px-3.5 py-1.5 rounded-full bg-white text-sky-800 text-xs font-bold border border-sky-300 shadow-2xs">
            {sentences.length} Sentences
          </span>
        </div>
      </div>

      {/* Input Form: Add Sentence */}
      <div className="bg-white rounded-3xl border border-sky-200/90 p-4 sm:p-6 shadow-xs relative">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            +
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
              Add New Sentence / වාක්‍යයක් එක් කරන්න
            </h4>
            <p className="text-[11px] text-slate-500">
              ඉංග්‍රීසි වාක්‍යය සහ සිංහල තේරුම ඇතුළත් කර පහළ ලැයිස්තුවට එක් කරන්න.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddSentence} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* English Text Input */}
            <div className="md:col-span-5">
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
            <div className="md:col-span-4">
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
            <div className="md:col-span-3">
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
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__add_new__" className="text-sky-600 font-bold">
                      + Type New Category...
                    </option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="New category name"
                    autoFocus
                    className="flex-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-sky-300 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewCategory(false);
                      setCustomCategory('');
                    }}
                    className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Category Pills */}
          <div className="pt-2 flex items-center gap-1.5 flex-wrap">
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
              <span>Add Sentence to List (පහළට එක් කරන්න)</span>
            </button>
          </div>
        </form>
      </div>

      {/* Downward List of All Sentences ("pahalata ekin eka") */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* List Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Sentences List (එක් කරන ලද වාක්‍ය ලැයිස්තුව)
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

        {/* Filter Pills for List with Category Delete (×) button */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Filter List:</span>
          </span>
          <button
            onClick={() => setListCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              listCategoryFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
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
              ඉහත පෝරමයේ English text එක සහ Sinhala තේරුම ටයිප් කර "Add Sentence to List" ක්ලික් කරන්න.
            </p>
          </div>
        ) : filteredSentences.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No sentences match "{searchQuery}" in this view.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSentences.map((item) => {
              const originalIndex = sentences.findIndex((s) => s.id === item.id);
              const isSpeaking = speakingId === item.id;
              const isEditing = editingId === item.id;

              if (isEditing) {
                return (
                  <div key={item.id} className="p-4 bg-sky-50/70 border-l-4 border-sky-500 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                      <span>Editing Sentence #{originalIndex + 1}</span>
                      <span className="text-[10px] text-slate-400">Press Save when done</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      <div className="sm:col-span-5">
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
                      <div className="sm:col-span-4">
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
                      <div className="sm:col-span-3">
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
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="px-4 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-2xs"
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
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5">
                      {originalIndex + 1}
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
    </div>
  );
};
