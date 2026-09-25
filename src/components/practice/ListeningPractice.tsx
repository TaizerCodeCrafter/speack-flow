import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Eye,
  EyeOff,
  Volume2,
  FileText,
  Sparkles,
} from 'lucide-react';
import { LISTENING_EXERCISES } from '../../data/learningData';
import { ListeningExercise } from '../../types';
import { speechService, calculateSpeechAccuracy } from '../../utils/speech';

export const ListeningPractice: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const exercise: ListeningExercise = LISTENING_EXERCISES[selectedIdx] || LISTENING_EXERCISES[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showTranscript, setShowTranscript] = useState(false);

  // Dictation state
  const [dictationInput, setDictationInput] = useState('');
  const [dictationResult, setDictationResult] = useState<{
    score: number;
    matchedWords: string[];
    missingWords: string[];
  } | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<{ [qIdx: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    speechService.stop();
    setIsPlaying(false);
    setShowTranscript(false);
    setDictationInput('');
    setDictationResult(null);
    setQuizAnswers({});
    setQuizSubmitted(false);

    return () => {
      speechService.stop();
    };
  }, [selectedIdx]);

  const handlePlayAudio = () => {
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speechService.speak(exercise.transcript, {
        rate: playbackSpeed,
        onEnd: () => setIsPlaying(false),
      });
    }
  };

  const handlePlayDictation = () => {
    speechService.speak(exercise.dictationSentence, {
      rate: playbackSpeed * 0.9,
    });
  };

  const checkDictation = () => {
    if (!dictationInput.trim()) return;
    const res = calculateSpeechAccuracy(dictationInput, exercise.dictationSentence);
    setDictationResult(res);
  };

  const handleSelectQuiz = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Exercise Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Choose Listening Track
          </p>
          <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar pb-1">
            {LISTENING_EXERCISES.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedIdx(idx)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedIdx === idx
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{item.title}</span>
                <span className="ml-1.5 opacity-80">({item.level})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 text-xs shrink-0 self-start sm:self-auto">
          <span className="text-slate-500 px-1.5 text-[11px]">Tempo:</span>
          {[0.75, 1.0, 1.25].map((speed) => (
            <button
              key={speed}
              onClick={() => {
                setPlaybackSpeed(speed);
                if (isPlaying) {
                  speechService.stop();
                  setIsPlaying(true);
                  speechService.speak(exercise.transcript, {
                    rate: speed,
                    onEnd: () => setIsPlaying(false),
                  });
                }
              }}
              className={`px-2 py-1 rounded text-xs font-semibold min-w-[32px] ${
                playbackSpeed === speed
                  ? 'bg-sky-100 text-sky-800'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Audio Player Card */}
      <div className="bg-gradient-to-br from-sky-50/70 via-white to-sky-50/40 p-4 sm:p-7 md:p-8 rounded-2xl border border-sky-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold bg-sky-100 text-sky-800">
                {exercise.level}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Speaker: {exercise.speaker}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400">• {exercise.duration}</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {exercise.title}
            </h3>
          </div>

          {/* Audio Action Buttons - Full-width flexible on phone screens */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={handlePlayAudio}
              className={`min-h-[44px] px-5 py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
                isPlaying
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-sky-600 hover:bg-sky-700 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause Audio</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play Dialogue</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="min-h-[44px] px-4 py-2.5 sm:py-3.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-[0.98]"
            >
              {showTranscript ? (
                <>
                  <EyeOff className="w-4 h-4 text-slate-500" />
                  <span>Hide Script</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span>View Script</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Sound Wave visualizer when playing */}
        {isPlaying && (
          <div className="mt-6 pt-4 border-t border-sky-100 flex items-center justify-center gap-1">
            {[40, 70, 30, 85, 55, 95, 45, 75, 60, 90, 35, 80, 50, 70].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-sky-500 rounded-full animate-pulse"
                style={{
                  height: `${h * 0.35}px`,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
            <span className="ml-3 text-xs text-sky-700 font-semibold">
              Playing native dialogue audio...
            </span>
          </div>
        )}

        {/* Script / Transcript Box */}
        {showTranscript && (
          <div className="mt-6 p-5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line shadow-xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>Full Audio Script</span>
            </div>
            {exercise.transcript}
          </div>
        )}
      </div>

      {/* Interactive Dictation Challenge */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Active Dictation Drill</span>
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Listen & Type the Missing Sentence
            </h4>
            <p className="text-xs text-slate-500">
              Click the speaker to hear the sentence, then type what you hear word-for-word.
            </p>
          </div>

          <button
            onClick={handlePlayDictation}
            className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-sky-600" />
            <span>Play Dictation Sentence</span>
          </button>
        </div>

        <div className="space-y-3">
          <textarea
            value={dictationInput}
            onChange={(e) => setDictationInput(e.target.value)}
            placeholder="Type the exact sentence you heard here..."
            rows={2}
            className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={checkDictation}
              disabled={!dictationInput.trim()}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer shadow-xs"
            >
              Check Accuracy
            </button>

            {dictationResult && (
              <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                dictationResult.score >= 80
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                Match Accuracy: {dictationResult.score}%
              </span>
            )}
          </div>

          {/* Dictation Feedback Details */}
          {dictationResult && (
            <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <p className="text-slate-600">
                <span className="font-bold text-slate-900">Correct Target: </span>
                "{exercise.dictationSentence}"
              </p>
              {dictationResult.missingWords.length > 0 && (
                <p className="text-rose-700">
                  <span className="font-bold">Words to review: </span>
                  {dictationResult.missingWords.join(', ')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Listening Comprehension Questions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h4 className="font-bold text-base text-slate-900">
              Listening Comprehension Check
            </h4>
            <p className="text-xs text-slate-500">
              Verify your auditory retention from the conversation.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {exercise.questions.map((q, qIdx) => {
            const userAnswer = quizAnswers[qIdx];
            const isCorrect = userAnswer === q.correctIndex;

            return (
              <div key={qIdx} className="space-y-3">
                <p className="text-sm font-semibold text-slate-900">
                  {qIdx + 1}. {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => {
                    let btnClass = 'border-slate-200 hover:bg-slate-50 text-slate-700';

                    if (userAnswer === optIdx) {
                      btnClass = 'border-sky-500 bg-sky-50 text-sky-900 font-semibold';
                    }

                    if (quizSubmitted) {
                      if (optIdx === q.correctIndex) {
                        btnClass = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold';
                      } else if (userAnswer === optIdx && !isCorrect) {
                        btnClass = 'border-rose-300 bg-rose-50 text-rose-900 line-through';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => handleSelectQuiz(qIdx, optIdx)}
                        className={`text-left p-3 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${btnClass}`}
                      >
                        <span className="font-mono mr-2 text-slate-400">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
          {quizSubmitted ? (
            <button
              onClick={() => {
                setQuizAnswers({});
                setQuizSubmitted(false);
              }}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Reset Quiz
            </button>
          ) : (
            <button
              disabled={Object.keys(quizAnswers).length === 0}
              onClick={() => setQuizSubmitted(true)}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
            >
              Check Answers
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
