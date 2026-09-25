import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Globe,
  Newspaper,
  Megaphone,
  ExternalLink,
  Sparkles,
  Layers,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Tv,
} from 'lucide-react';
import { SideMediaItem, SideMediaType, UserProfile } from '../types';
import { getSideMediaItems } from '../utils/sideMediaStorage';

interface SideMediaDrawerProps {
  currentUser: UserProfile | null;
  onOpenAdmin?: () => void;
}

export const SideMediaDrawer: React.FC<SideMediaDrawerProps> = ({
  currentUser,
  onOpenAdmin,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<SideMediaItem[]>(() => getSideMediaItems());
  const [activeFilter, setActiveFilter] = useState<'all' | SideMediaType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState<SideMediaItem | null>(null);

  // Lock background body scroll while Drawer or Video Modal is open
  useEffect(() => {
    if (isOpen || activeVideoModal) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen, activeVideoModal]);

  // Synchronize on storage changes
  useEffect(() => {
    const handleUpdate = () => {
      setItems(getSideMediaItems());
    };
    window.addEventListener('side-media-changed', handleUpdate);
    return () => window.removeEventListener('side-media-changed', handleUpdate);
  }, []);

  // Filter only active items for public view, plus filter by category & search
  const visibleItems = items.filter((item) => {
    // If not admin, only show active
    if (currentUser?.role !== 'admin' && !item.isActive) {
      return false;
    }
    if (activeFilter !== 'all' && item.type !== activeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchSub = item.subtitle?.toLowerCase().includes(q) || false;
      const matchBadge = item.badgeText?.toLowerCase().includes(q) || false;
      return matchTitle || matchDesc || matchSub || matchBadge;
    }
    return true;
  });

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
      }
    } catch {
      // ignore
    }
    return url;
  };

  const getTypeMeta = (type: SideMediaType) => {
    switch (type) {
      case 'video':
        return {
          label: 'Video',
          sinhalaLabel: 'වීඩියෝ',
          icon: Play,
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/80',
          accentGradient: 'from-rose-500 to-red-600',
          btnText: 'Watch Video',
        };
      case 'website':
        return {
          label: 'Website',
          sinhalaLabel: 'වෙබ් අඩවි',
          icon: Globe,
          badgeColor: 'bg-sky-50 text-sky-700 border-sky-200/80',
          accentGradient: 'from-sky-500 to-indigo-600',
          btnText: 'Visit Website',
        };
      case 'news':
        return {
          label: 'News',
          sinhalaLabel: 'පුවත්',
          icon: Newspaper,
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          accentGradient: 'from-emerald-500 to-teal-600',
          btnText: 'Read Notice',
        };
      case 'ad':
        return {
          label: 'Promo / Ad',
          sinhalaLabel: 'දැන්වීම්',
          icon: Megaphone,
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
          accentGradient: 'from-amber-500 to-orange-600',
          btnText: 'View Offer',
        };
    }
  };

  return (
    <>
      {/* Floating Side Toggle Button on Right Edge */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center select-none pointer-events-auto">
        <motion.button
          id="side-media-toggle-btn"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex flex-col items-center justify-center gap-1 py-3 px-2 sm:px-2.5 rounded-l-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white shadow-[0_8px_30px_rgba(0,0,0,0.3)] border-y border-l border-indigo-400/30 cursor-pointer group transition-all"
          title="Open Media, Videos, News & Websites"
        >
          {/* Subtle Glow Ring */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>

          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-xs group-hover:rotate-12 transition-transform">
            <Tv className="w-3.5 h-3.5" />
          </div>

          <span className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase [writing-mode:vertical-rl] rotate-180 text-amber-300 py-1">
            Media Hub
          </span>
        </motion.button>
      </div>

      {/* Slide-out Media Drawer Backdrop and Content */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] cursor-pointer overscroll-contain"
            />

            {/* Slide-Out Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-full max-w-md sm:max-w-lg bg-white/95 backdrop-blur-2xl shadow-2xl z-[60] flex flex-col overflow-hidden border-l border-white/80 overscroll-contain"
            >
              {/* Drawer Sticky Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 text-white flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-tight">
                      Explore Media Hub
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      වීඩියෝ, වෙබ් අඩවි, අධ්‍යාපනික පුවත් &amp; දැන්වීම්
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {currentUser?.role === 'admin' && onOpenAdmin && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onOpenAdmin();
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-colors text-xs font-bold flex items-center gap-1"
                      title="Manage items in Admin Panel"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                      <span className="hidden sm:inline">Manage</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search and Category Filter Tabs */}
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 space-y-2.5 shrink-0">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search videos, websites, news..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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

                {/* Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      activeFilter === 'all'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    All ({items.filter((i) => currentUser?.role === 'admin' || i.isActive).length})
                  </button>

                  <button
                    onClick={() => setActiveFilter('video')}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      activeFilter === 'video'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
                    }`}
                  >
                    <Play className="w-3 h-3" />
                    <span>Videos</span>
                  </button>

                  <button
                    onClick={() => setActiveFilter('website')}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      activeFilter === 'website'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-white text-sky-700 hover:bg-sky-50 border border-sky-200'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    <span>Websites</span>
                  </button>

                  <button
                    onClick={() => setActiveFilter('news')}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      activeFilter === 'news'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                    }`}
                  >
                    <Newspaper className="w-3 h-3" />
                    <span>News</span>
                  </button>

                  <button
                    onClick={() => setActiveFilter('ad')}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      activeFilter === 'ad'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
                    }`}
                  >
                    <Megaphone className="w-3 h-3" />
                    <span>Ads &amp; Promos</span>
                  </button>
                </div>
              </div>

              {/* Items Feed List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {visibleItems.length === 0 ? (
                  <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-800">No Items Found</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      No items matched your current filter or search criteria.
                    </p>
                  </div>
                ) : (
                  visibleItems.map((item) => {
                    const meta = getTypeMeta(item.type);
                    const TypeIcon = meta.icon;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col ${
                          !item.isActive ? 'opacity-60 ring-1 ring-amber-400/50' : ''
                        }`}
                      >
                        {/* Thumbnail Image Header (if provided) */}
                        {item.imageUrl && (
                          <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {item.type === 'video' && (
                              <button
                                onClick={() => setActiveVideoModal(item)}
                                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-xs transition-all shadow-lg hover:scale-110 cursor-pointer"
                              >
                                <Play className="w-5 h-5 fill-white ml-0.5" />
                              </button>
                            )}
                          </div>
                        )}

                        {/* Card Content Body */}
                        <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            {/* Top row: Badge and Type */}
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${meta.badgeColor}`}
                              >
                                <TypeIcon className="w-3 h-3" />
                                <span>{meta.label}</span>
                              </span>

                              <div className="flex items-center gap-1.5">
                                {item.badgeText && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                    {item.badgeText}
                                  </span>
                                )}
                                {!item.isActive && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                                    Inactive (Hidden)
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Title & Subtitle */}
                            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                              {item.title}
                            </h4>

                            {item.subtitle && (
                              <p className="text-xs font-semibold text-indigo-700 leading-tight">
                                {item.subtitle}
                              </p>
                            )}

                            {/* Description */}
                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                              {item.description}
                            </p>
                          </div>

                          {/* Action Button */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            {item.type === 'video' ? (
                              <button
                                onClick={() => setActiveVideoModal(item)}
                                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                              >
                                <Play className="w-3.5 h-3.5 fill-white" />
                                <span>Watch Video Clip</span>
                              </button>
                            ) : item.url && item.url !== '#' ? (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                              >
                                <span>{meta.btnText}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                              </a>
                            ) : (
                              <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl w-full text-center">
                                Official Update Published
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer Status */}
              <div className="p-3 border-t border-slate-200/80 bg-slate-50/90 text-center text-[11px] text-slate-500">
                <span>SpeakFlow Media &amp; Learning Resources</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Video Player Modal */}
      {activeVideoModal && (
        <div
          className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overscroll-contain"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveVideoModal(null);
          }}
        >
          <div className="relative w-full max-w-2xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <div className="flex items-center justify-between p-3.5 bg-slate-900 text-white border-b border-white/10">
              <span className="font-bold text-xs sm:text-sm truncate max-w-sm">
                {activeVideoModal.title}
              </span>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video w-full bg-slate-950">
              {activeVideoModal.url.includes('youtube.com') ||
              activeVideoModal.url.includes('youtu.be') ? (
                <iframe
                  src={getYouTubeEmbedUrl(activeVideoModal.url)}
                  title={activeVideoModal.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white">
                  <Play className="w-12 h-12 text-rose-500 mb-3" />
                  <p className="text-sm font-semibold mb-4">{activeVideoModal.description}</p>
                  <a
                    href={activeVideoModal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-2"
                  >
                    <span>Open External Video Link</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
