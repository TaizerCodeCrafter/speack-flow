import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Volume2,
  Copy,
  Check,
  Search,
  X,
  SlidersHorizontal,
  Volume1,
} from 'lucide-react';
import { SimpleSentenceItem, UserProfile } from '../../types';
import {
  getStoredSimpleSentences,
  getStoredSentenceCategories,
  speakText,
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

  const [sentences, setSentences] = useState<SimpleSentenceItem[]>(() =>
    getStoredSimpleSentences()
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const handleStorage = () => {
      setSentences(getStoredSimpleSentences());
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleStorage);
    };
  }, []);

  const handleSpeak = (id: string, text: string, rateMultiplier: number = speechRate) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
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
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Distinct categories from sentences + stored categories
  const sentenceCatNames = Array.from(
    new Set(sentences.map((s) => s.category?.trim()).filter(Boolean) as string[])
  );

  const allCategories = Array.from(
    new Set([...getStoredSentenceCategories(), ...sentenceCatNames])
  );

  // Filter sentences
  const filteredSentences = sentences.filter((s) => {
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

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200/80 text-xs font-bold mb-3 shadow-2xs">
          <BookOpen className="w-3.5 h-3.5 text-sky-600" />
          <span>Simple Sentence Studio</span>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
          Simple Sentence (සරල වාක්‍ය)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          සරල ඉංග්‍රීසි වාක්‍ය සහ ඒවායේ සිංහල තේරුම ශ්‍රවණය කරමින් පහසුවෙන් පුහුණු වන්න
        </p>
      </div>

      {/* Toolbar: Search, Speech Speed, Admin Button */}
      <div className="bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-sky-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
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

        {/* Speed Controls & Admin Button */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-bold">
            <span className="px-2 text-slate-500">Speed:</span>
            <button
              onClick={() => setSpeechRate(1.0)}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                speechRate === 1.0 ? 'bg-white text-sky-700 shadow-2xs font-black' : 'text-slate-600'
              }`}
            >
              1.0x
            </button>
            <button
              onClick={() => setSpeechRate(0.85)}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                speechRate === 0.85 ? 'bg-white text-sky-700 shadow-2xs font-black' : 'text-slate-600'
              }`}
            >
              0.85x
            </button>
            <button
              onClick={() => setSpeechRate(0.65)}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                speechRate === 0.65 ? 'bg-white text-sky-700 shadow-2xs font-black' : 'text-slate-600'
              }`}
            >
              0.65x
            </button>
          </div>

          {isAdmin && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
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
          All Sentences ({sentences.length})
        </button>
        {allCategories.map((cat) => {
          const count = sentences.filter(
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
              {cat} {count > 0 ? `(${count})` : ''}
            </button>
          );
        })}
      </div>

      {/* Sentences List Downward */}
      {filteredSentences.length === 0 ? (
        <div className="rounded-3xl p-10 bg-white border border-slate-200 text-center shadow-2xs">
          <BookOpen className="w-8 h-8 text-sky-500 mx-auto mb-2 opacity-60" />
          <p className="text-slate-600 text-sm font-bold">
            {searchQuery ? `No sentences match "${searchQuery}"` : 'දැනට වාක්‍ය කිසිවක් නැත.'}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Admin වෙත ගොස් නව වාක්‍ය එක් කළ හැක.
          </p>
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
                    : 'bg-white/90 hover:bg-white border-slate-200/80 hover:border-sky-300 shadow-2xs hover:shadow-xs'
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

                  {/* Actions: Speak Normal, Slow Voice, Copy */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleSpeak(item.id, item.english, speechRate)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                        isSpeaking
                          ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-md ring-2 ring-sky-400/40'
                          : 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-900 border border-sky-300/70 hover:border-sky-400'
                      }`}
                      title="Speak Sentence"
                    >
                      <Volume2
                        className={`w-4 h-4 ${
                          isSpeaking ? 'animate-bounce text-white' : 'text-sky-600'
                        }`}
                      />
                      <span>{isSpeaking ? 'Speaking...' : 'Speak'}</span>
                    </button>

                    <button
                      onClick={() => handleSpeak(item.id, item.english, 0.65)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                      title="Slow Voice (0.65x)"
                    >
                      <Volume1 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleCopy(item.id, item.english)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                      title="Copy English Sentence"
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
    </div>
  );
};
