// MediKiosk AI — Global Accessibility Context Provider
// Manages: language, audio guidance, high-contrast, font size, TTS, sonification

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { SupportedLang } from '../i18n/strings';
import { STRINGS, LANG_META } from '../i18n/strings';

export type FontSize = 'normal' | 'large' | 'xlarge';

export interface A11yContextValue {
  lang: SupportedLang;
  setLang: (l: SupportedLang) => void;
  t: (key: string) => string;       // translate a key
  audioMode: boolean;
  setAudioMode: (v: boolean) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  fontSize: FontSize;
  setFontSize: (s: FontSize) => void;
  speak: (text: string, overrideLang?: SupportedLang) => void;
  stopSpeaking: () => void;
  playTone: (event: ToneEvent) => void;
  isListening: boolean;
  setIsListening: (v: boolean) => void;
}

export type ToneEvent = 'listening' | 'processing' | 'done' | 'error' | 'emergency' | 'info';

const TONE_FREQUENCIES: Record<ToneEvent, { freq: number[]; duration: number[]; gain: number }> = {
  listening: { freq: [440, 660], duration: [0.15, 0.15], gain: 0.3 },
  processing: { freq: [330], duration: [0.5], gain: 0.15 },
  done: { freq: [523, 659, 784], duration: [0.1, 0.1, 0.2], gain: 0.35 },
  error: { freq: [220, 196], duration: [0.2, 0.4], gain: 0.4 },
  emergency: { freq: [880, 440, 880], duration: [0.1, 0.1, 0.3], gain: 0.5 },
  info: { freq: [523], duration: [0.2], gain: 0.2 },
};

const A11yContext = createContext<A11yContextValue | null>(null);

export const useA11y = (): A11yContextValue => {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error('useA11y must be used inside AccessibilityProvider');
  return ctx;
};

interface Props {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<Props> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLang>('en');
  const [audioMode, setAudioMode] = useState(true); // DEFAULT ON per spec
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [isListening, setIsListening] = useState(false);

  // Apply high-contrast class to <html>
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Apply font-size class to <html>
  useEffect(() => {
    document.documentElement.classList.remove('font-large', 'font-xlarge');
    if (fontSize === 'large') document.documentElement.classList.add('font-large');
    if (fontSize === 'xlarge') document.documentElement.classList.add('font-xlarge');
  }, [fontSize]);

  const setLang = useCallback((l: SupportedLang) => {
    setLangState(l);
    localStorage.setItem('medikiosk_lang', l);
  }, []);

  // Restore saved language
  useEffect(() => {
    const saved = localStorage.getItem('medikiosk_lang') as SupportedLang | null;
    if (saved && ['en', 'hi', 'ta', 'bn'].includes(saved)) setLangState(saved);
  }, []);

  // Translate a key — falls back to English if key missing
  const t = useCallback((key: string): string => {
    const strings = STRINGS[lang] as unknown as Record<string, unknown>;
    const val = strings[key];
    if (typeof val === 'string') return val;
    const enStrings = STRINGS['en'] as unknown as Record<string, unknown>;
    const enVal = enStrings[key];
    if (typeof enVal === 'string') return enVal;
    return key; // fallback: return key itself
  }, [lang]);

  // TTS speak function
  const speak = useCallback((text: string, overrideLang?: SupportedLang) => {
    if (!audioMode) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANG_META[overrideLang ?? lang].ttsLang;
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('TTS error:', err);
    }
  }, [audioMode, lang]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Audio tone (Web Audio API) — plays even when TTS is off for screen-reader users
  const playTone = useCallback((event: ToneEvent) => {
    if (typeof window === 'undefined' || !('AudioContext' in window || 'webkitAudioContext' in window)) return;
    try {
      const ACtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new ACtx();
      const tone = TONE_FREQUENCIES[event];
      let offset = 0;
      tone.freq.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = event === 'error' || event === 'emergency' ? 'sawtooth' : 'sine';
        osc.frequency.value = freq;
        gainNode.gain.setValueAtTime(tone.gain, ctx.currentTime + offset);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + tone.duration[i]);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + tone.duration[i]);
        offset += tone.duration[i];
      });
    } catch {
      // Web Audio not supported — silently fail
    }
  }, []);

  const value: A11yContextValue = {
    lang, setLang,
    t,
    audioMode, setAudioMode,
    highContrast, setHighContrast,
    fontSize, setFontSize,
    speak, stopSpeaking,
    playTone,
    isListening, setIsListening,
  };

  return (
    <A11yContext.Provider value={value}>
      {children}
    </A11yContext.Provider>
  );
};
