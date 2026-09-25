import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Play,
  Globe,
  Newspaper,
  Megaphone,
  ExternalLink,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Image as ImageIcon,
} from 'lucide-react';
import { SideMediaItem, SideMediaType } from '../../types';
import {
  getSideMediaItems,
  saveSideMediaItems,
  addSideMediaItem,
  updateSideMediaItem,
  deleteSideMediaItem,
  toggleSideMediaItemActive,
  resetSideMediaToDefaults,
} from '../../utils/sideMediaStorage';

const SAMPLE_IMAGE_PRESETS = [
  { label: 'Video Studio', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Library & Reading', url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Classroom & Study', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80' },
  { label: 'Online Learning', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80' },
  { label: 'Speaking & Mic', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80' },
  { label: 'Dictionary Books', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80' },
];

export const SideMediaManager: React.FC = () => {
  const [items, setItems] = useState<SideMediaItem[]>(() => getSideMediaItems());
  const [selectedFilter, setSelectedFilter] = useState<'all' | SideMediaType>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [formType, setFormType] = useState<SideMediaType>('video');
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formBadgeText, setFormBadgeText] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  useEffect(() => {
    const handleUpdate = () => setItems(getSideMediaItems());
    window.addEventListener('side-media-changed', handleUpdate);
    return () => window.removeEventListener('side-media-changed', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAddForm = (defaultType: SideMediaType = 'video') => {
    setEditingItemId(null);
    setFormType(defaultType);
    setFormTitle('');
    setFormSubtitle('');
    setFormDescription('');
    setFormUrl(defaultType === 'video' ? 'https://www.youtube.com/watch?v=' : defaultType === 'website' ? 'https://' : '#');
    setFormImageUrl(SAMPLE_IMAGE_PRESETS[0].url);
    setFormBadgeText(defaultType === 'ad' ? 'Special Promo' : defaultType === 'news' ? 'Important Update' : 'Recommended');
    setFormIsActive(true);
    setIsAddingOrEditing(true);
  };

  const handleOpenEditForm = (item: SideMediaItem) => {
    setEditingItemId(item.id);
    setFormType(item.type);
    setFormTitle(item.title);
    setFormSubtitle(item.subtitle || '');
    setFormDescription(item.description);
    setFormUrl(item.url);
    setFormImageUrl(item.imageUrl || '');
    setFormBadgeText(item.badgeText || '');
    setFormIsActive(item.isActive);
    setIsAddingOrEditing(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('කරුණාකර මාතෘකාව (Title) ඇතුළත් කරන්න.');
      return;
    }

    if (editingItemId) {
      updateSideMediaItem(editingItemId, {
        type: formType,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || undefined,
        description: formDescription.trim(),
        url: formUrl.trim() || '#',
        imageUrl: formImageUrl.trim() || undefined,
        badgeText: formBadgeText.trim() || undefined,
        isActive: formIsActive,
      });
      showToast('Media item updated successfully! (යාවත්කාලීන විය)');
    } else {
      addSideMediaItem({
        type: formType,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || undefined,
        description: formDescription.trim(),
        url: formUrl.trim() || '#',
        imageUrl: formImageUrl.trim() || undefined,
        badgeText: formBadgeText.trim() || undefined,
        isActive: formIsActive,
      });
      showToast('New media item added to side hub! (නව අයිතමය එකතු විය)');
    }

    setIsAddingOrEditing(false);
    setEditingItemId(null);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`මෙම අයිතමය "${title}" මකා දැමීමට සහතිකද?`)) {
      deleteSideMediaItem(id);
      showToast('Item removed. (අයිතමය ඉවත් කරන ලදී)');
    }
  };

  const handleToggle = (id: string) => {
    toggleSideMediaItemActive(id);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // update orders
    const reordered = newItems.map((it, idx) => ({ ...it, order: idx + 1 }));
    saveSideMediaItems(reordered);
  };

  const handleResetDefaults = () => {
    if (window.confirm('සියලුම Side Media අයිතම මුල් තත්වයට (Restore Defaults) පත් කිරීමට අවශ්‍යද?')) {
      resetSideMediaToDefaults();
      showToast('Restored default media items!');
    }
  };

  const filteredItems = items.filter((it) => {
    if (selectedFilter === 'all') return true;
    return it.type === selectedFilter;
  });

  const getTypeStyle = (type: SideMediaType) => {
    switch (type) {
      case 'video':
        return {
          label: 'Video',
          icon: Play,
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'website':
        return {
          label: 'Website',
          icon: Globe,
          badge: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      case 'news':
        return {
          label: 'News',
          icon: Newspaper,
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'ad':
        return {
          label: 'Ad / Promo',
          icon: Megaphone,
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
        };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-xl flex items-center gap-2 border border-white/20">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Description */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-400/20 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              Side Hub Manager
            </span>
            <span className="text-xs text-slate-300 font-mono">
              Total Items: {items.length}
            </span>
          </div>
          <h2 className="text-xl font-black text-white">
            Side Toggle Media (Videos, Websites, News &amp; Ads)
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            ශිෂ්‍යයින්ට පෙනෙන Side Drawer එකේ වීඩියෝ, වෙබ් අඩවි, නිවුස් සහ ප්‍රවර්ධන දැන්වීම් කළමනාකරණය කරන්න.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenAddForm('video')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm cursor-pointer transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Media Item</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold cursor-pointer transition-all"
            title="Restore default sample videos & websites"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Quick Add Category */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'video', 'website', 'news', 'ad'] as const).map((cat) => {
            const count =
              cat === 'all' ? items.length : items.filter((i) => i.type === cat).length;
            const isActive = selectedFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="capitalize">{cat === 'ad' ? 'Ads & Promos' : cat}</span>
                <span className="ml-1.5 text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Quick Add Buttons by Type */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => handleOpenAddForm('video')}
            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[11px] flex items-center gap-1"
          >
            <Play className="w-3 h-3" /> +Video
          </button>
          <button
            onClick={() => handleOpenAddForm('website')}
            className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-[11px] flex items-center gap-1"
          >
            <Globe className="w-3 h-3" /> +Website
          </button>
          <button
            onClick={() => handleOpenAddForm('news')}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] flex items-center gap-1"
          >
            <Newspaper className="w-3 h-3" /> +News
          </button>
          <button
            onClick={() => handleOpenAddForm('ad')}
            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold text-[11px] flex items-center gap-1"
          >
            <Megaphone className="w-3 h-3" /> +Ad
          </button>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      {isAddingOrEditing && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>
                  {editingItemId ? 'Edit Media Item (සංස්කරණය)' : 'Add New Media Item (නව අයිතමය)'}
                </span>
              </h3>
              <button
                onClick={() => setIsAddingOrEditing(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Media Type (වර්ගය)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { type: 'video', label: 'Video', icon: Play, color: 'border-rose-500 text-rose-700 bg-rose-50' },
                    { type: 'website', label: 'Website', icon: Globe, color: 'border-sky-500 text-sky-700 bg-sky-50' },
                    { type: 'news', label: 'News', icon: Newspaper, color: 'border-emerald-500 text-emerald-700 bg-emerald-50' },
                    { type: 'ad', label: 'Ad / Promo', icon: Megaphone, color: 'border-amber-500 text-amber-800 bg-amber-50' },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = formType === t.type;
                    return (
                      <button
                        type="button"
                        key={t.type}
                        onClick={() => setFormType(t.type as SideMediaType)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          isSelected
                            ? `${t.color} ring-2 ring-indigo-500 shadow-xs font-extrabold`
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Title (මාතෘකාව) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g., Daily Spoken English Phrases"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sinhala Subtitle (සිංහල උපසිරැසිය)
                  </label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="e.g., දිනපතා භාවිත වන වාක්‍ය 50ක්"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Target URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination URL / Video Link (යොමුව හෝ YouTube Link එක)
                </label>
                <input
                  type="text"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://example.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  💡 For YouTube videos, paste the standard YouTube or youtu.be link. For news notices without a link, you can use #.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Content (විස්තරය)
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Briefly describe what this video, website, news or promo offers..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Image URL & Presets */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Thumbnail Image URL (පින්තූර Link එක)
                </label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />

                {/* Image Presets Selector */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-slate-400" /> Presets:
                  </span>
                  {SAMPLE_IMAGE_PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p.label}
                      onClick={() => setFormImageUrl(p.url)}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badge Text & Active Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Badge / Tag (ටැග් ලේබලය)
                  </label>
                  <input
                    type="text"
                    value={formBadgeText}
                    onChange={(e) => setFormBadgeText(e.target.value)}
                    placeholder="e.g., Trending, Special 50% Off, New"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Active Status</p>
                    <p className="text-[10px] text-slate-500">ශිෂ්‍යයින්ට Side Drawer එකේ පෙන්වන්න</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormIsActive(!formIsActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      formIsActive ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formIsActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingOrEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Media Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Items Table / Grid */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">No media items found</p>
            <button
              onClick={() => handleOpenAddForm('video')}
              className="mt-3 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Add First Item
            </button>
          </div>
        ) : (
          filteredItems.map((item, index) => {
            const style = getTypeStyle(item.type);
            const Icon = style.icon;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  !item.isActive ? 'opacity-65 bg-slate-50' : ''
                }`}
              >
                {/* Left: Thumbnail + Info */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  {item.imageUrl ? (
                    <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                      <Icon className="w-5 h-5" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${style.badge}`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{style.label}</span>
                      </span>

                      {item.badgeText && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {item.badgeText}
                        </span>
                      )}

                      {!item.isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                          Hidden
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 truncate mt-1">
                      {item.title}
                    </h4>

                    {item.subtitle && (
                      <p className="text-xs text-indigo-700 truncate font-semibold">
                        {item.subtitle}
                      </p>
                    )}

                    <p className="text-[11px] text-slate-500 truncate max-w-md mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                  {/* Reorder Buttons */}
                  <div className="flex items-center bg-slate-100 rounded-xl p-0.5">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === items.length - 1}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Active Toggle Button */}
                  <button
                    onClick={() => handleToggle(item.id)}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                      item.isActive
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                    title={item.isActive ? 'Deactivate (Hide)' : 'Activate (Show)'}
                  >
                    {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEditForm(item)}
                    className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 cursor-pointer transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
