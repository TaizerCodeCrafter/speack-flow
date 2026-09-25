import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Send,
  User,
  Bot,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { CONVERSATION_SCENARIOS } from '../../data/learningData';
import { ConversationScenario } from '../../types';
import { speechService } from '../../utils/speech';

interface ChatMessage {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  formality?: string;
}

export const ConversationPractice: React.FC = () => {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const scenario: ConversationScenario =
    CONVERSATION_SCENARIOS[selectedScenarioIdx] || CONVERSATION_SCENARIOS[0];

  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [scenarioCompleted, setScenarioCompleted] = useState(false);

  // Initialize first turn
  useEffect(() => {
    speechService.stop();
    setCurrentTurnIndex(0);
    setScenarioCompleted(false);
    setCustomInput('');

    if (scenario.turns.length > 0) {
      const firstTurn = scenario.turns[0];
      setChatHistory([
        {
          id: 1,
          sender: 'ai',
          text: firstTurn.aiPrompt,
        },
      ]);
      // Speak AI prompt
      speechService.speak(firstTurn.aiPrompt, { rate: 0.95 });
    }

    return () => {
      speechService.stop();
    };
  }, [selectedScenarioIdx]);

  const handleSelectResponse = (respText: string, formality?: string) => {
    // Add user message
    const updatedHistory: ChatMessage[] = [
      ...chatHistory,
      {
        id: Date.now(),
        sender: 'user',
        text: respText,
        formality,
      },
    ];

    setChatHistory(updatedHistory);
    speechService.speak(respText, { rate: 0.95 });

    const nextTurnIdx = currentTurnIndex + 1;
    if (nextTurnIdx < scenario.turns.length) {
      setCurrentTurnIndex(nextTurnIdx);
      const nextTurn = scenario.turns[nextTurnIdx];

      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: nextTurn.aiPrompt,
          },
        ]);
        speechService.speak(nextTurn.aiPrompt, { rate: 0.95 });
      }, 1000);
    } else {
      setScenarioCompleted(true);
    }
  };

  const handleSendCustom = () => {
    if (!customInput.trim()) return;
    handleSelectResponse(customInput.trim(), 'Custom');
    setCustomInput('');
  };

  const handleSpeakText = (text: string) => {
    speechService.speak(text, { rate: 0.95 });
  };

  const resetConversation = () => {
    speechService.stop();
    setCurrentTurnIndex(0);
    setScenarioCompleted(false);
    setCustomInput('');
    if (scenario.turns.length > 0) {
      const firstTurn = scenario.turns[0];
      setChatHistory([
        {
          id: 1,
          sender: 'ai',
          text: firstTurn.aiPrompt,
        },
      ]);
      speechService.speak(firstTurn.aiPrompt, { rate: 0.95 });
    }
  };

  const activeTurn = scenario.turns[currentTurnIndex];

  return (
    <div className="space-y-6">
      {/* Scenario Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Choose Conversation Scenario
          </p>
          <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar pb-1">
            {CONVERSATION_SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenarioIdx(idx)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedScenarioIdx === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{sc.title}</span>
                <span className="ml-1.5 opacity-80">({sc.level})</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={resetConversation}
          className="min-h-[38px] px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 self-end sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Dialogue</span>
        </button>
      </div>

      {/* Scenario Banner */}
      <div className="bg-indigo-50/70 p-3.5 sm:p-4 rounded-xl border border-indigo-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm text-indigo-950">
              Partner: {scenario.partnerName}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
              {scenario.partnerRole}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-indigo-800 mt-0.5">{scenario.description}</p>
        </div>
      </div>

      {/* Chat History Box */}
      <div className="h-72 sm:h-96 overflow-y-auto p-3.5 sm:p-6 bg-white rounded-2xl border border-slate-200 space-y-3 sm:space-y-4 shadow-2xs">
        {chatHistory.map((msg) => {
          const isAi = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 sm:gap-3 ${
                isAi ? 'justify-start' : 'justify-end'
              }`}
            >
              {isAi && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-lg p-3 sm:p-4 rounded-2xl shadow-2xs space-y-1 ${
                  isAi
                    ? 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200/80'
                    : 'bg-indigo-600 text-white rounded-tr-none'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isAi ? 'text-slate-500' : 'text-indigo-200'
                  }`}>
                    {isAi ? scenario.partnerName : 'You'}
                  </span>
                  <button
                    onClick={() => handleSpeakText(msg.text)}
                    className="opacity-70 hover:opacity-100 cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
                    title="Listen"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm md:text-base leading-relaxed">{msg.text}</p>
              </div>

              {!isAi && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}
            </div>
          );
        })}

        {scenarioCompleted && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <h5 className="font-bold text-sm text-emerald-950">
              Dialogue Completed Successfully!
            </h5>
            <p className="text-xs text-emerald-800">
              You navigated this entire conversation scenario smoothly. Feel free to restart and try alternative responses!
            </p>
          </div>
        )}
      </div>

      {/* Reply Options or Custom Typing */}
      {!scenarioCompleted && activeTurn && (
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
              Choose your response or reply:
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-500">
              Turn {currentTurnIndex + 1} of {scenario.turns.length}
            </span>
          </div>

          {/* Quick Smart Suggested Replies */}
          <div className="grid grid-cols-1 gap-2">
            {activeTurn.suggestedResponses.map((option, idx) => (
              <button
                key={idx}
                onClick={() =>
                  handleSelectResponse(option.text, option.formality)
                }
                className="text-left p-3 sm:p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 active:bg-slate-50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] sm:text-xs font-bold text-indigo-700">
                    Option {idx + 1}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {option.formality} Tone
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-900 group-hover:text-indigo-950">
                  "{option.text}"
                </p>
              </button>
            ))}
          </div>

          {/* Custom Input Field */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCustom()}
              placeholder="Or write custom response..."
              className="flex-1 min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <button
              onClick={handleSendCustom}
              disabled={!customInput.trim()}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
