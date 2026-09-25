import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Award,
  Sparkles,
} from 'lucide-react';
import { SPEAKING_DRILLS } from '../../data/learningData';
import { SpeakingDrill } from '../../types';
import { speechService, calculateSpeechAccuracy } from '../../utils/speech';

export const SpeakingPractice: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentDrill: SpeakingDrill = SPEAKING_DRILLS[selectedIdx] || SPEAKING_DRILLS[0];

  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [accuracyResult, setAccuracyResult] = useState<{
    score: number;
    matchedWords: string[];
    missingWords: string[];
  } | null>(null);

  // Recognition reference
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  useEffect(() => {
    // Check Speech Recognition API support
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRec) {
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setSpokenTranscript(transcript);

        if (event.results[0].isFinal) {
          setIsRecording(false);
          const evaluation = calculateSpeechAccuracy(transcript, currentDrill.targetSentence);
          setAccuracyResult(evaluation);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognitionInstance(recognition);
    } else {
      setRecognitionSupported(false);
    }

    return () => {
      speechService.stop();
    };
  }, [currentDrill]);

  useEffect(() => {
    speechService.stop();
    setSpokenTranscript('');
    setAccuracyResult(null);
    setIsRecording(false);
  }, [selectedIdx]);

  const handleListenToModel = () => {
    speechService.speak(currentDrill.targetSentence, {
      rate: currentDrill.audioSpeed || 0.95,
    });
  };

  const startVoiceRecording = () => {
    if (!recognitionInstance) return;
    setSpokenTranscript('');
    setAccuracyResult(null);
    try {
      recognitionInstance.start();
      setIsRecording(true);
    } catch (e) {
      console.error(e);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionInstance) {
      recognitionInstance.stop();
      setIsRecording(false);
    }
  };

  // Manual fallback simulation for test
  const handleSimulateSentence = () => {
    setSpokenTranscript(currentDrill.targetSentence);
    const evaluation = calculateSpeechAccuracy(
      currentDrill.targetSentence,
      currentDrill.targetSentence
    );
    setAccuracyResult(evaluation);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Drills Selector */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Select Speaking Exercise
        </p>
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {SPEAKING_DRILLS.map((drill, idx) => (
            <button
              key={drill.id}
              onClick={() => setSelectedIdx(idx)}
              className={`min-h-[42px] p-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer shrink-0 w-44 sm:w-auto ${
                selectedIdx === idx
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="block text-[9px] uppercase opacity-75 font-mono truncate">
                {drill.category}
              </span>
              <span className="line-clamp-1">{drill.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Target Sentence Display Card */}
      <div className="bg-white p-4 sm:p-7 md:p-8 rounded-2xl border border-amber-200/90 shadow-2xs space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-100 text-amber-900">
              {currentDrill.category}
            </span>
            <span className="text-xs font-semibold text-slate-500 truncate">
              {currentDrill.title}
            </span>
          </div>

          <button
            onClick={handleListenToModel}
            className="w-full sm:w-auto min-h-[38px] px-3.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            <span>Listen to Model Pronunciation</span>
          </button>
        </div>

        {/* Target Sentence Hero Box */}
        <div className="text-center py-2 sm:py-4">
          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Target Sentence To Speak
          </p>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 max-w-2xl mx-auto leading-snug px-2">
            "{currentDrill.targetSentence}"
          </h3>
          <p className="font-mono text-xs sm:text-sm text-amber-800 mt-2 px-2">
            {currentDrill.phoneticGuide}
          </p>
        </div>

        {/* Pronunciation Tip Box */}
        {currentDrill.tip && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Pronunciation Tip: </span>
              {currentDrill.tip}
            </div>
          </div>
        )}

        {/* Microphone Recording Action Zone */}
        <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 text-center space-y-4">
          <div className="flex justify-center py-2">
            {isRecording ? (
              <button
                onClick={stopVoiceRecording}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg animate-bounce cursor-pointer ring-4 ring-rose-200"
                title="Stop Recording"
              >
                <MicOff className="w-7 h-7 sm:w-8 sm:h-8" />
              </button>
            ) : (
              <button
                onClick={startVoiceRecording}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-amber-100"
                title="Start Speaking"
              >
                <Mic className="w-7 h-7 sm:w-8 sm:h-8" />
              </button>
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">
              {isRecording ? 'Listening to your voice...' : 'Click the microphone & speak clearly'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Speak into your device microphone at a comfortable, natural pace.
            </p>
          </div>

          {/* Fallback button if Speech Recognition is not available in browser */}
          {!recognitionSupported && (
            <div className="p-3 bg-amber-100 text-amber-900 rounded-lg text-xs flex items-center justify-between">
              <span>Browser speech recognition requires Chrome/Edge or microphone permission.</span>
              <button
                onClick={handleSimulateSentence}
                className="ml-2 px-2.5 py-1 bg-amber-600 text-white rounded font-bold text-xs cursor-pointer"
              >
                Test Score
              </button>
            </div>
          )}

          {/* Real-time transcribed text */}
          {spokenTranscript && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Transcribed From Your Voice:
              </p>
              <p className="text-sm font-medium text-slate-900">
                "{spokenTranscript}"
              </p>
            </div>
          )}

          {/* Accuracy Score Card */}
          {accuracyResult && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-left space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-sm text-slate-900">
                    Pronunciation Accuracy Result
                  </span>
                </div>
                <span className={`text-sm font-black px-3 py-1 rounded-full ${
                  accuracyResult.score >= 80
                    ? 'bg-emerald-100 text-emerald-800'
                    : accuracyResult.score >= 50
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {accuracyResult.score}% Accuracy
                </span>
              </div>

              {/* Breakdown of words */}
              <div className="text-xs space-y-1">
                <p className="text-slate-600">
                  <span className="font-semibold text-emerald-700">Matched Words: </span>
                  {accuracyResult.matchedWords.length > 0
                    ? accuracyResult.matchedWords.join(', ')
                    : 'None recognized yet'}
                </p>
                {accuracyResult.missingWords.length > 0 && (
                  <p className="text-slate-600">
                    <span className="font-semibold text-rose-600">Words to improve: </span>
                    {accuracyResult.missingWords.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
