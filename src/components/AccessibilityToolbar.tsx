// MediKiosk AI — Floating Accessibility Toolbar
// Always visible; provides audio/contrast/font-size controls

import React, { useState } from 'react';
import { useA11y } from './AccessibilityProvider';
import type { FontSize } from './AccessibilityProvider';

interface AccessibilityToolbarProps {
  className?: string;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({ className = '' }) => {
  const {
    audioMode, setAudioMode,
    highContrast, setHighContrast,
    fontSize, setFontSize,
    speak, t,
  } = useA11y();

  const [open, setOpen] = useState(false);

  const cycleFontSize = () => {
    const order: FontSize[] = ['normal', 'large', 'xlarge'];
    const next = order[(order.indexOf(fontSize) + 1) % order.length];
    setFontSize(next);
    speak(`Text size: ${next}`);
  };

  const toggleAudio = () => {
    setAudioMode(!audioMode);
    // Speak before turning off if currently on
    if (audioMode) {
      speak('Audio guidance turned off');
    }
  };

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    speak(highContrast ? t('highContrastOff') : t('highContrastOn'));
  };

  const FONT_ICONS: Record<FontSize, string> = {
    normal: 'A',
    large: 'A+',
    xlarge: 'A++',
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex flex-col items-end gap-2 ${className}`}
      role="complementary"
      aria-label="Accessibility controls"
    >
      {/* Toggle button */}
      <button
        type="button"
        aria-label="Open accessibility settings"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="
          w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700
          text-white shadow-lg flex items-center justify-center
          focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400
          transition-all
        "
      >
        <span className="text-xl" aria-hidden="true">♿</span>
      </button>

      {/* Expanded panel */}
      {open && (
        <div
          role="group"
          aria-label="Accessibility options"
          className="
            flex flex-col gap-2 bg-white rounded-2xl shadow-xl border border-slate-200
            p-3 animate-in fade-in slide-in-from-top-2
          "
        >
          {/* Audio toggle */}
          <button
            type="button"
            aria-label={audioMode ? t('audioOff') : t('audioOn')}
            aria-pressed={audioMode}
            onClick={toggleAudio}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
              focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400
              transition-all min-w-[180px]
              ${audioMode
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
            `}
          >
            <span className="text-xl" aria-hidden="true">{audioMode ? '🔊' : '🔇'}</span>
            <span>{audioMode ? t('audioOn') : t('audioOff')}</span>
          </button>

          {/* High contrast toggle */}
          <button
            type="button"
            aria-label={highContrast ? t('highContrastOff') : t('highContrastOn')}
            aria-pressed={highContrast}
            onClick={toggleContrast}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
              focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400
              transition-all
              ${highContrast
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
            `}
          >
            <span className="text-xl" aria-hidden="true">🌓</span>
            <span>{highContrast ? t('highContrastOn') : t('highContrastOff')}</span>
          </button>

          {/* Font size cycle */}
          <button
            type="button"
            aria-label={`${t('fontSizeLabel')}: ${fontSize}. Tap to change.`}
            onClick={cycleFontSize}
            className="
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
              bg-slate-100 text-slate-700 hover:bg-slate-200
              focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-400
              transition-all
            "
          >
            <span
              className="font-bold text-purple-700 w-8 text-center"
              aria-hidden="true"
            >
              {FONT_ICONS[fontSize]}
            </span>
            <span>{t('fontSizeLabel')}: {fontSize}</span>
          </button>
        </div>
      )}
    </div>
  );
};
