// MediKiosk AI — Help Assistant Chatbot
// Floating bottom-left icon (doesn't conflict with RepeatBackButton at bottom-right)
// Context-aware: knows current kiosk step & question, can re-explain them

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useA11y } from './AccessibilityProvider';
import {
  KNOWLEDGE_BASE,
  QUICK_CHIPS,
  UNKNOWN_RESPONSE,
  findBestMatch,
} from '../services/chatbotKnowledge';
import type { SupportedLang } from '../i18n/strings';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
  chips?: string[];
}

interface HelpChatbotProps {
  /** Current kiosk step (1–5), if in patient-checkin flow */
  currentStep?: number;
  /** Text of the current question being shown to the patient */
  currentQuestionText?: string;
  /** Plain label of the current question for "re-explain" */
  currentQuestionLabel?: string;
}

// ─────────────────────────────────────────────
// Helper: generate unique message ID
// ─────────────────────────────────────────────
const uid = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export const HelpChatbot: React.FC<HelpChatbotProps> = ({
  currentStep,
  currentQuestionText,
  currentQuestionLabel,
}) => {
  const { lang, speak, playTone, audioMode } = useA11y();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);

  // ── Scroll to bottom on new message ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Focus input when opened ──
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setUnreadCount(0);
      // Show welcome if no messages yet
      if (messages.length === 0) {
        sendBotMessage(getWelcome(lang), []);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ─────────────────────────────────────────────
  // Welcome message
  // ─────────────────────────────────────────────
  const getWelcome = (l: SupportedLang): string => {
    const entry = KNOWLEDGE_BASE.find(e => e.id === 'greet');
    return entry?.response[l] ?? entry?.response.en ?? 'Hello! How can I help?';
  };

  // ─────────────────────────────────────────────
  // Send bot message
  // ─────────────────────────────────────────────
  const sendBotMessage = useCallback((text: string, chips?: string[]) => {
    const msg: ChatMessage = {
      id: uid(),
      role: 'bot',
      text,
      timestamp: new Date(),
      chips: chips ?? [],
    };
    setMessages(prev => [...prev, msg]);
    if (!open) setUnreadCount(n => n + 1);
    if (audioMode) {
      // Speak only first 200 chars to avoid overwhelming
      setTimeout(() => speak(text.slice(0, 200).replace(/\n/g, '. ')), 300);
    }
  }, [open, audioMode, speak]);

  // ─────────────────────────────────────────────
  // Handle user query
  // ─────────────────────────────────────────────
  const handleQuery = useCallback((query: string) => {
    if (!query.trim()) return;

    // Add user message
    const userMsg: ChatMessage = { id: uid(), role: 'user', text: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    playTone('processing');

    // Simulate short think delay
    setTimeout(() => {
      setIsTyping(false);
      playTone('done');

      const q = query.toLowerCase();

      // ── Special: explain current question ──
      if (
        (q.includes('explain') || q.includes('samjhao') || q.includes('repeat') ||
         q.includes('what does this mean') || q.includes('understand') || q.includes('dobara')) &&
        currentQuestionText
      ) {
        sendBotMessage(
          `🔍 Let me explain the current question:\n\n"${currentQuestionLabel ?? 'Current question'}"\n\n${currentQuestionText}\n\n💡 Just answer in your own words — there's no wrong answer! You can also tap the 🔊 button next to the question to hear it again.`,
          ['What is HPI?', 'How does this work?'],
        );
        return;
      }

      // ── Special: what step am I on? ──
      if (q.includes('step') || q.includes('where am i') || q.includes('which step')) {
        const stepNames: Record<number, string> = {
          1: 'Step 1 — Identifying you (Language & Login)',
          2: 'Step 2 — Telling us your symptoms (Adaptive Interview)',
          3: 'Step 3 — Scanning your documents',
          4: 'Step 4 — Reviewing your summary',
          5: 'Step 5 — Done! Your OPD token has been generated',
        };
        const stepText = currentStep
          ? `📍 You are currently on:\n\n${stepNames[currentStep] ?? `Step ${currentStep}`}`
          : `📋 This kiosk has 5 steps:\n1️⃣ Identify → 2️⃣ Interview → 3️⃣ Scan → 4️⃣ Summary → 5️⃣ Token`;
        sendBotMessage(stepText, ['How does this work?', 'What is HPI?']);
        return;
      }

      // ── Normal knowledge base match ──
      const match = findBestMatch(query, lang);
      if (match) {
        const resp = match.response[lang] ?? match.response.en;
        sendBotMessage(resp, match.followUpChips ?? []);
      } else {
        const resp = UNKNOWN_RESPONSE[lang] ?? UNKNOWN_RESPONSE.en;
        sendBotMessage(resp, ['Where is the lab?', 'What is HPI?', 'Documents needed']);
      }
    }, 600);
  }, [lang, currentStep, currentQuestionText, currentQuestionLabel, sendBotMessage, playTone]);

  // ─────────────────────────────────────────────
  // Voice input
  // ─────────────────────────────────────────────
  const startVoiceInput = () => {
    const SpeechRec = window.SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: typeof window.SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRec) {
      sendBotMessage('Voice input is not available in this browser. Please type your question below.');
      return;
    }

    if (recognitionRef.current) recognitionRef.current.stop();

    const rec = new SpeechRec();
    rec.lang = lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : lang === 'bn' ? 'bn-IN' : 'en-IN';
    rec.interimResults = false;
    rec.onstart = () => { setIsListening(true); playTone('listening'); };
    rec.onresult = (e: SpeechRecognitionEvent) => {
      setIsListening(false);
      playTone('done');
      handleQuery(e.results[0][0].transcript);
    };
    rec.onerror = () => { setIsListening(false); playTone('error'); };
    rec.onend = () => setIsListening(false);
    rec.start();
    recognitionRef.current = rec;
  };

  // ─────────────────────────────────────────────
  // Render message text (with newline support)
  // ─────────────────────────────────────────────
  const renderText = (text: string) =>
    text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <button
        type="button"
        aria-label={open ? 'Close Help Assistant' : 'Open Help Assistant'}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(o => !o)}
        className={`
          fixed bottom-6 left-6 z-50
          w-14 h-14 rounded-full shadow-xl
          flex flex-col items-center justify-center
          focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400
          transition-all duration-200 active:scale-95
          ${open
            ? 'bg-blue-700 hover:bg-blue-800'
            : 'bg-blue-600 hover:bg-blue-700 animate-bounce-slow'}
        `}
        style={{ animationDuration: '3s' }}
      >
        <span className="text-2xl" aria-hidden="true">{open ? '✕' : '🤖'}</span>
        <span className="text-[9px] font-bold text-white mt-0.5">Help</span>

        {/* Unread badge */}
        {!open && unreadCount > 0 && (
          <span
            aria-label={`${unreadCount} new messages`}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* ── Chat Panel ── */}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Help Assistant"
          className="
            fixed bottom-24 left-4 z-50
            w-80 sm:w-96 max-h-[70vh]
            bg-white rounded-3xl shadow-2xl
            flex flex-col overflow-hidden
            border border-blue-100
            animate-in slide-in-from-top-2
          "
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0" aria-hidden="true">
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">Help Assistant</p>
              <p className="text-blue-200 text-xs">
                {isListening ? '🎤 Listening…' : isTyping ? '⏳ Thinking…' : '● Online — ask me anything'}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close help assistant"
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                    ${msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-slate-100 text-slate-800 rounded-bl-sm'}
                  `}
                >
                  {renderText(msg.text)}

                  {/* Re-read button on bot messages */}
                  {msg.role === 'bot' && (
                    <button
                      type="button"
                      aria-label="Read this message aloud"
                      onClick={() => speak(msg.text.slice(0, 250).replace(/\n/g, '. '))}
                      className="mt-2 flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 focus:outline-none"
                    >
                      <span aria-hidden="true">🔊</span> Read aloud
                    </button>
                  )}

                  {/* Follow-up chips */}
                  {msg.role === 'bot' && msg.chips && msg.chips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {msg.chips.map(chip => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleQuery(chip)}
                          aria-label={`Ask: ${chip}`}
                          className="px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-all active:scale-95"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips (shown when few messages) */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2">
              <p className="text-xs text-slate-500 mb-2 font-medium">Quick questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CHIPS.map(chip => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => handleQuery(chip.query)}
                    aria-label={chip.label}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-all active:scale-95"
                  >
                    <span aria-hidden="true">{chip.icon}</span>
                    {chip.label}
                  </button>
                ))}

                {/* Context-aware: explain current question */}
                {currentQuestionLabel && (
                  <button
                    type="button"
                    onClick={() => handleQuery('explain current question')}
                    aria-label="Explain the current question"
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 border border-amber-300 text-amber-700 rounded-full text-xs font-semibold hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-all active:scale-95"
                  >
                    <span aria-hidden="true">❓</span>
                    Explain this question
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Input row */}
          <div className="border-t border-slate-100 px-3 py-2 flex gap-2 items-center bg-white">
            {/* Voice input */}
            <button
              type="button"
              aria-label={isListening ? 'Stop listening' : 'Speak your question'}
              onClick={startVoiceInput}
              className={`
                w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center
                focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400
                transition-all active:scale-95
                ${isListening
                  ? 'bg-red-500 text-white animate-listening'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}
              `}
            >
              <span className="text-lg" aria-hidden="true">{isListening ? '🔴' : '🎤'}</span>
            </button>

            {/* Text input */}
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && inputText.trim()) handleQuery(inputText);
              }}
              placeholder="Type or speak your question…"
              aria-label="Type your question"
              className="flex-1 bg-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-0"
            />

            {/* Send */}
            <button
              type="button"
              aria-label="Send message"
              onClick={() => { if (inputText.trim()) handleQuery(inputText); }}
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white flex-shrink-0 flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 transition-all active:scale-95"
            >
              <span className="text-lg" aria-hidden="true">➤</span>
            </button>
          </div>

          {/* Footer note */}
          <div className="bg-slate-50 px-4 py-1.5 text-center">
            <p className="text-[10px] text-slate-400">For emergencies press 🆘 or call 112</p>
          </div>
        </div>
      )}
    </>
  );
};
