import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Info,
  Award,
  Star,
} from 'lucide-react';
import { READING_LESSONS } from '../../data/learningData';
import { ReadingLesson } from '../../types';
import { speechService } from '../../utils/speech';
import { getCurrentUser } from '../../utils/authStorage';
import { awardCardCompletionXP, XP_REWARDS } from '../../utils/levelUtils';

export const ReadingPractice: React.FC = () => {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const currentLesson: ReadingLesson = READING_LESSONS[selectedLessonIndex] || READING_LESSONS[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(0.95);
  const [selectedWord, setSelectedWord] = useState<ReadingLesson['vocabulary'][0] | null>(null);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    // Reset state on lesson switch
    speechService.stop();
    setIsPlaying(false);
    setUserAnswers({});
    setQuizSubmitted(false);
    setSelectedWord(null);

    return () => {
      speechService.stop();
    };
  }, [selectedLessonIndex]);

  const toggleAudio = () => {
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speechService.speak(currentLesson.content, {
        rate: playbackRate,
        onEnd: () => setIsPlaying(false),
      });
    }
  };

  const handleWordSpeak = (word: string) => {
    speechService.speak(word, { rate: 0.9 });
  };

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    currentLesson.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Lesson Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Select Reading Lesson
          </p>
          <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar pb-1">
            {READING_LESSONS.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLessonIndex(idx)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedLessonIndex === idx
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{lesson.title.slice(0, 26)}...</span>
                <span className="ml-1.5 opacity-80">({lesson.level})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Narration Bar */}
        <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 text-xs">
            <span className="text-slate-500 px-1.5 text-[11px]">Speed:</span>
            {[0.85, 1.0, 1.15].map((rate) => (
              <button
                key={rate}
                onClick={() => {
                  setPlaybackRate(rate);
                  if (isPlaying) {
                    speechService.stop();
                    setIsPlaying(true);
                    speechService.speak(currentLesson.content, {
                      rate,
                      onEnd: () => setIsPlaying(false),
                    });
                  }
                }}
                className={`px-2 py-1 rounded text-xs font-semibold min-w-[32px] ${
                  playbackRate === rate
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          <button
            onClick={toggleAudio}
            className={`min-h-[40px] flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
              isPlaying
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Listen to Story</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="border-b border-slate-100 pb-3 sm:pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            {currentLesson.level}
          </span>
          <span className="text-[11px] sm:text-xs text-slate-500">{currentLesson.readTime}</span>
        </div>
        <h3 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
          {currentLesson.title}
        </h3>
      </div>

      {/* Main Text Content */}
      <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-line bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        {currentLesson.content}
      </div>

      {/* Interactive Key Vocabulary Cards */}
      <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-sm text-slate-900">
              Key Vocabulary in This Lesson (Click to listen)
            </h4>
          </div>
          <span className="text-xs text-slate-500">
            {currentLesson.vocabulary.length} essential words
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentLesson.vocabulary.map((vocab, vIdx) => (
            <div
              key={vIdx}
              onClick={() => {
                setSelectedWord(vocab);
                handleWordSpeak(vocab.word);
              }}
              className={`p-3 rounded-xl border bg-white cursor-pointer transition-all hover:border-emerald-400 hover:shadow-xs ${
                selectedWord?.word === vocab.word
                  ? 'border-emerald-500 ring-2 ring-emerald-100'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">
                  {vocab.word}
                </span>
                <Volume2 className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                {vocab.phonetic}
              </p>
              <p className="text-xs text-slate-700 mt-1 line-clamp-2">
                {vocab.meaning}
              </p>
            </div>
          ))}
        </div>

        {/* Selected Word Details Panel */}
        {selectedWord && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-emerald-950 text-base">
                  {selectedWord.word}
                </span>
                <span className="text-xs font-mono text-emerald-700">
                  {selectedWord.phonetic}
                </span>
              </div>
              <p className="text-xs text-emerald-900 mt-1">
                <span className="font-semibold">Definition:</span> {selectedWord.meaning}
              </p>
              <p className="text-xs text-emerald-800 italic mt-0.5">
                <span className="font-semibold not-italic">Example:</span> "{selectedWord.example}"
              </p>
            </div>
            <button
              onClick={() => handleWordSpeak(selectedWord.word)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-700 shrink-0"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Pronounce</span>
            </button>
          </div>
        )}
      </div>

      {/* Comprehension Quiz Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
          <div>
            <h4 className="font-bold text-base text-slate-900">
              Reading Comprehension Check
            </h4>
            <p className="text-xs text-slate-500">
              Answer the questions below to test your understanding of the passage.
            </p>
          </div>

          {quizSubmitted && (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Score: {calculateScore()} / {currentLesson.questions.length} Correct</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-black flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                <span>+50 XP Earned</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {currentLesson.questions.map((q, qIndex) => {
            const userAnswer = userAnswers[q.id];
            const isCorrect = userAnswer === q.correctIndex;

            return (
              <div key={q.id} className="space-y-3">
                <p className="text-sm font-semibold text-slate-900">
                  {qIndex + 1}. {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => {
                    let optionStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700';

                    if (userAnswer === optIdx) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                    }

                    if (quizSubmitted) {
                      if (optIdx === q.correctIndex) {
                        optionStyle = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold';
                      } else if (userAnswer === optIdx && !isCorrect) {
                        optionStyle = 'border-rose-300 bg-rose-50 text-rose-900 line-through';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => handleAnswerSelect(q.id, optIdx)}
                        className={`text-left p-3 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${optionStyle}`}
                      >
                        <span className="font-mono mr-2 text-slate-400">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {quizSubmitted && (
                  <div className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                    isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'
                  }`}>
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <span>{q.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          {quizSubmitted ? (
            <button
              onClick={() => {
                setUserAnswers({});
                setQuizSubmitted(false);
              }}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
          ) : (
            <button
              disabled={Object.keys(userAnswers).length === 0}
              onClick={() => {
                setQuizSubmitted(true);
                const score = calculateScore();
                const current = getCurrentUser();
                if (current && score > 0) {
                  const xp = Math.round((score / currentLesson.questions.length) * XP_REWARDS.PRACTICE_CARD_COMPLETE);
                  awardCardCompletionXP(
                    current.id,
                    `reading_${currentLesson.id}`,
                    `Reading: ${currentLesson.title}`,
                    xp
                  );
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Submit &amp; Earn XP</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
