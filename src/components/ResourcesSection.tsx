import React, { useState } from 'react';
import {
  Search,
  Volume2,
  RotateCw,
  Copy,
  Check,
  BookmarkCheck,
  Sparkles,
} from 'lucide-react';
import {
  RESOURCES_LIST,
  FLASHCARDS_LIST,
  IDIOMS_LIST,
} from '../data/learningData';
import { ResourceItem } from '../types';
import { speechService } from '../utils/speech';

type TabType = 'all' | 'grammar' | 'flashcards' | 'idioms' | 'cheat-sheets';

export const ResourcesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Flashcard flip states: set of flipped card IDs
  const [flippedCards, setFlippedCards] = useState<{ [cardId: string]: boolean }>({});

  const toggleFlip = (cardId: string) => {
    setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleSpeak = (text: string) => {
    speechService.speak(text, { rate: 0.95 });
  };

  const handleCopyResource = (res: ResourceItem) => {
    const textToCopy = `${res.title}\n\nSummary:\n${res.summary}\n\nContent:\n${res.content.join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(res.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered resources
  const filteredResources = RESOURCES_LIST.filter((item) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'grammar' && item.category === 'grammar') ||
      (activeTab === 'cheat-sheets' && item.category === 'cheat-sheets') ||
      (activeTab === 'idioms' && item.category === 'idioms');

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const filteredFlashcards = FLASHCARDS_LIST.filter((fc) => {
    return (
      fc.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fc.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fc.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredIdioms = IDIOMS_LIST.filter((idm) => {
    return (
      idm.idiom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idm.meaning.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <section id="resources" className="py-14 sm:py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-white/90 text-emerald-800 text-xs font-bold mb-3 shadow-xs">
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Curated Study Vault</span>
          </div>
          <h2 className="text-2.5xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Comprehensive Learning Resources
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Grammar cheat sheets, interactive vocabulary flashcards with native pronunciation, and essential phrase indexes.
          </p>
        </div>

        {/* Filter Controls & Search with Glass Aesthetics */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Frosted Glass Tabs Bar */}
          <div className="flex items-center gap-1.5 p-1.5 bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xs overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              All Resources
            </button>
            <button
              onClick={() => setActiveTab('grammar')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'grammar'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              Grammar Guides
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              Flashcards Deck
            </button>
            <button
              onClick={() => setActiveTab('idioms')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'idioms'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              Idioms & Phrasal Verbs
            </button>
            <button
              onClick={() => setActiveTab('cheat-sheets')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'cheat-sheets'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              Reference Guides
            </button>
          </div>

          {/* Frosted Glass Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search grammar, words, idioms..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white/80 backdrop-blur-xl border border-white/90 rounded-2xl shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* 1. Flashcards View */}
        {(activeTab === 'flashcards' || (activeTab === 'all' && !searchQuery)) && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Interactive Vocabulary Flashcards
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any card to flip and reveal the definition, example sentence, and usage context.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md">
                {filteredFlashcards.length} Cards
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFlashcards.map((fc) => {
                const isFlipped = !!flippedCards[fc.id];

                return (
                  <div
                    key={fc.id}
                    onClick={() => toggleFlip(fc.id)}
                    className="relative min-h-[220px] rounded-3xl backdrop-blur-xl bg-white/75 hover:bg-white/95 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group p-6 select-none overflow-hidden"
                  >
                    {/* Subtle colorful glass reflection glow */}
                    <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/15 transition-all pointer-events-none" />

                    {!isFlipped ? (
                      /* Front of Card */
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-slate-100/80 text-slate-700 border border-slate-200/50">
                              {fc.category}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeak(fc.word);
                              }}
                              className="w-8 h-8 rounded-xl bg-white/80 hover:bg-emerald-50 border border-slate-200/60 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                              title="Listen to Pronunciation"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>

                          <h4 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-800 transition-colors">
                            {fc.word}
                          </h4>
                          <p className="text-xs font-mono text-slate-500 mt-1">
                            {fc.phonetic} • {fc.partOfSpeech}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 text-xs text-slate-400 font-semibold">
                          <span className="flex items-center gap-1.5 group-hover:text-emerald-700 transition-colors">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                            Tap to reveal definition
                          </span>
                          <RotateCw className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
                        </div>
                      </>
                    ) : (
                      /* Back of Card */
                      <>
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                              Definition
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Back</span>
                          </div>

                          <p className="text-sm text-slate-800 font-semibold leading-snug">
                            {fc.definition}
                          </p>

                          <p className="text-xs text-slate-600 italic bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                            "{fc.example}"
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 text-xs text-slate-400 font-semibold">
                          <span>Tap to flip back</span>
                          <RotateCw className="w-3.5 h-3.5" />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Grammar Guides & Reference Cards */}
        {activeTab !== 'flashcards' && activeTab !== 'idioms' && (
          <div className="space-y-6 mb-14">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Essential Grammar & Cheatsheet Guides
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clear formulas, practical examples, and common error corrections.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResources.map((res) => (
                <div
                  key={res.id}
                  className="backdrop-blur-xl bg-white/75 hover:bg-white/95 rounded-3xl border border-white/80 p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-700 capitalize border border-slate-200/50">
                        {res.category}
                      </span>
                      <button
                        onClick={() => handleCopyResource(res)}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60 shadow-2xs transition-all cursor-pointer"
                        title="Copy Guide to Clipboard"
                      >
                        {copiedId === res.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <h4 className="text-lg sm:text-xl font-black text-slate-900">
                      {res.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {res.summary}
                    </p>

                    {/* Bullet Points in Frosted Glass Box */}
                    <div className="mt-4 p-4 rounded-2xl bg-white/70 border border-white/90 backdrop-blur-sm space-y-2.5">
                      {res.content.map((point, pIdx) => (
                        <div key={pIdx} className="text-xs text-slate-800 leading-relaxed flex items-start gap-2.5">
                          <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-5 pt-3.5 border-t border-slate-200/50 flex flex-wrap gap-1.5">
                    {res.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/60 text-slate-600 border border-slate-200/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Idioms & Phrasal Verbs Section */}
        {(activeTab === 'idioms' || (activeTab === 'all' && !searchQuery)) && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Frequently Used English Idioms
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Idiomatic phrases with real-life context and conversational tips.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredIdioms.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl backdrop-blur-xl bg-white/75 hover:bg-white/95 border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(99,102,241,0.08)] hover:border-indigo-300/60 hover:-translate-y-1 transition-all duration-300 space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-extrabold text-slate-900 text-sm leading-snug">
                        "{item.idiom}"
                      </h5>
                      <button
                        onClick={() => handleSpeak(item.idiom)}
                        className="w-7 h-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                        title="Listen"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 font-semibold mt-2">
                      {item.meaning}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-500 italic bg-indigo-50/50 p-2 rounded-xl border border-indigo-100/50">
                    "{item.example}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
