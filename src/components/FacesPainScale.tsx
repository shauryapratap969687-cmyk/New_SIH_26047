// MediKiosk AI — Wong-Baker FACES Pain Scale
// 6 face illustrations (0–10) — globally validated for low-literacy patients
// Completely replaces the 1-10 numeric slider for illiterate/child patients

import React from 'react';
import { useA11y } from './AccessibilityProvider';

export interface FaceLevel {
  score: number;
  emoji: string;
  svgMouth: string; // SVG path for mouth
  svgEyes: 'open' | 'squint' | 'cry';
  color: string;     // face fill color
  eyebrowDown: boolean;
  label: { en: string; hi: string; ta: string; bn: string };
  audio: { en: string; hi: string; ta: string; bn: string };
}

export const FACE_LEVELS: FaceLevel[] = [
  {
    score: 0,
    emoji: '😊',
    svgMouth: 'M 36 60 Q 50 72 64 60',
    svgEyes: 'open',
    color: '#86efac',
    eyebrowDown: false,
    label: { en: 'No pain', hi: 'कोई दर्द नहीं', ta: 'வலி இல்லை', bn: 'ব্যথা নেই' },
    audio: { en: 'No pain at all — completely fine', hi: 'बिल्कुल दर्द नहीं', ta: 'வலியே இல்லை', bn: 'একদম ব্যথা নেই' },
  },
  {
    score: 2,
    emoji: '🙂',
    svgMouth: 'M 38 60 Q 50 68 62 60',
    svgEyes: 'open',
    color: '#bef264',
    eyebrowDown: false,
    label: { en: 'Hurts a little', hi: 'थोड़ा दर्द', ta: 'கொஞ்சம் வலிக்கிறது', bn: 'একটু ব্যথা' },
    audio: { en: 'Hurts just a little bit', hi: 'थोड़ा सा दर्द', ta: 'கொஞ்சம் வலிக்கிறது', bn: 'একটু ব্যথা লাগছে' },
  },
  {
    score: 4,
    emoji: '😐',
    svgMouth: 'M 38 62 L 62 62',
    svgEyes: 'open',
    color: '#fde68a',
    eyebrowDown: false,
    label: { en: 'Hurts some', hi: 'कुछ दर्द है', ta: 'சில வலி', bn: 'কিছুটা ব্যথা' },
    audio: { en: 'Hurts a bit more — noticeable pain', hi: 'थोड़ा ज्यादा दर्द है', ta: 'சற்று அதிக வலி', bn: 'একটু বেশি ব্যথা' },
  },
  {
    score: 6,
    emoji: '😣',
    svgMouth: 'M 38 65 Q 50 56 62 65',
    svgEyes: 'squint',
    color: '#fdba74',
    eyebrowDown: true,
    label: { en: 'Hurts even more', hi: 'ज्यादा दर्द', ta: 'அதிக வலி', bn: 'বেশি ব্যথা' },
    audio: { en: 'Hurts even more — quite uncomfortable', hi: 'काफी दर्द हो रहा है', ta: 'மிகவும் வலிக்கிறது', bn: 'বেশ ব্যথা হচ্ছে' },
  },
  {
    score: 8,
    emoji: '😰',
    svgMouth: 'M 36 68 Q 50 56 64 68',
    svgEyes: 'squint',
    color: '#f87171',
    eyebrowDown: true,
    label: { en: 'Hurts a lot', hi: 'बहुत दर्द', ta: 'மிக அதிகமான வலி', bn: 'অনেক ব্যথা' },
    audio: { en: 'Hurts a whole lot — very hard to bear', hi: 'बहुत ज्यादा दर्द — सहना मुश्किल', ta: 'மிக மிக அதிகமான வலி', bn: 'অনেক অনেক ব্যথা' },
  },
  {
    score: 10,
    emoji: '😭',
    svgMouth: 'M 34 70 Q 50 54 66 70',
    svgEyes: 'cry',
    color: '#ef4444',
    eyebrowDown: true,
    label: { en: 'Worst pain', hi: 'असहनीय दर्द', ta: 'மிக மோசமான வலி', bn: 'অসহ্য ব্যথা' },
    audio: { en: 'Worst pain imaginable — unbearable', hi: 'सबसे ज्यादा दर्द — असहनीय', ta: 'மிக மோசமான வலி — தாங்க முடியாத', bn: 'সবচেয়ে বেশি ব্যথা — অসহ্য' },
  },
];

// SVG Face renderer
const FaceSVG: React.FC<{ level: FaceLevel; selected: boolean; size?: number }> = ({ level, selected, size = 80 }) => {
  const cx = 50;
  const cy = 50;
  const r = 42;

  const renderEyes = () => {
    if (level.svgEyes === 'open') {
      return (
        <>
          <ellipse cx="35" cy="42" rx="5" ry="6" fill={selected ? '#fff' : '#1e293b'} />
          <ellipse cx="65" cy="42" rx="5" ry="6" fill={selected ? '#fff' : '#1e293b'} />
          <ellipse cx="36" cy="40" rx="2" ry="2" fill={selected ? level.color : '#fff'} />
          <ellipse cx="66" cy="40" rx="2" ry="2" fill={selected ? level.color : '#fff'} />
        </>
      );
    }
    if (level.svgEyes === 'squint') {
      return (
        <>
          <path d="M 29 40 Q 35 36 41 40" stroke={selected ? '#fff' : '#1e293b'} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 59 40 Q 65 36 71 40" stroke={selected ? '#fff' : '#1e293b'} strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    }
    // cry
    return (
      <>
        <path d="M 29 40 Q 35 36 41 40" stroke={selected ? '#fff' : '#1e293b'} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 59 40 Q 65 36 71 40" stroke={selected ? '#fff' : '#1e293b'} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Tears */}
        <ellipse cx="33" cy="50" rx="2.5" ry="5" fill="#93c5fd" opacity="0.8" />
        <ellipse cx="67" cy="50" rx="2.5" ry="5" fill="#93c5fd" opacity="0.8" />
      </>
    );
  };

  const renderEyebrows = () => {
    if (!level.eyebrowDown) {
      return (
        <>
          <path d="M 27 32 Q 35 28 43 32" stroke={selected ? '#fff' : '#334155'} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 57 32 Q 65 28 73 32" stroke={selected ? '#fff' : '#334155'} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      );
    }
    return (
      <>
        <path d="M 27 34 Q 35 30 43 34" stroke={selected ? '#fff' : '#334155'} strokeWidth="2.5" fill="none" strokeLinecap="round" transform="rotate(10 35 32)" />
        <path d="M 57 34 Q 65 30 73 34" stroke={selected ? '#fff' : '#334155'} strokeWidth="2.5" fill="none" strokeLinecap="round" transform="rotate(-10 65 32)" />
      </>
    );
  };

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      {/* Face circle */}
      <circle
        cx={cx} cy={cy} r={r}
        fill={selected ? level.color : level.color + '88'}
        stroke={selected ? '#0d9488' : '#94a3b8'}
        strokeWidth={selected ? 4 : 2}
      />
      {renderEyebrows()}
      {renderEyes()}
      {/* Mouth */}
      <path
        d={level.svgMouth}
        stroke={selected ? '#fff' : '#1e293b'}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Score badge */}
      <circle cx="82" cy="18" r="12" fill={selected ? '#0d9488' : '#e2e8f0'} />
      <text x="82" y="23" textAnchor="middle" fontSize="12" fontWeight="bold" fill={selected ? '#fff' : '#64748b'}>
        {level.score}
      </text>
    </svg>
  );
};

interface FacesPainScaleProps {
  value: number | null;
  onChange: (score: number) => void;
}

export const FacesPainScale: React.FC<FacesPainScaleProps> = ({ value, onChange }) => {
  const { lang, speak } = useA11y();

  const handleSelect = (level: FaceLevel) => {
    speak(level.audio[lang] ?? level.audio.en);
    onChange(level.score);
  };

  const selected = FACE_LEVELS.find(f => f.score === value);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Title */}
      <p className="text-sm text-slate-500 font-medium text-center">
        {lang === 'hi'
          ? 'वह चेहरा चुनें जो आपके दर्द को दर्शाता है'
          : lang === 'ta'
          ? 'உங்கள் வலியை காட்டும் முகத்தை தேர்வு செய்யவும்'
          : lang === 'bn'
          ? 'যে মুখটি আপনার ব্যথা দেখায় তা বেছে নিন'
          : 'Tap the face that shows how much it hurts'}
      </p>

      {/* Faces grid */}
      <div
        className="grid grid-cols-3 sm:grid-cols-6 gap-3 w-full"
        role="radiogroup"
        aria-label="Pain scale — select a face"
      >
        {FACE_LEVELS.map(level => {
          const isSelected = value === level.score;
          const label = level.label[lang] ?? level.label.en;
          return (
            <button
              key={level.score}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${label} — ${level.score} out of 10`}
              onClick={() => handleSelect(level)}
              className={`
                flex flex-col items-center gap-2 p-3 rounded-2xl border-2
                transition-all duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400
                active:scale-95 cursor-pointer
                ${isSelected
                  ? 'border-teal-500 shadow-lg scale-105'
                  : 'border-slate-200 bg-white hover:border-teal-300 hover:scale-102'}
              `}
            >
              <FaceSVG level={level} selected={isSelected} size={72} />
              <span className={`text-xs font-semibold text-center leading-tight ${isSelected ? 'text-teal-700' : 'text-slate-600'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected feedback */}
      {selected && (
        <div
          aria-live="polite"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-teal-300 bg-teal-50"
        >
          <FaceSVG level={selected} selected size={48} />
          <div>
            <p className="font-bold text-teal-800">
              {selected.score}/10 — {selected.label[lang] ?? selected.label.en}
            </p>
            <p className="text-teal-600 text-sm">
              {lang === 'hi' ? 'दर्द का स्तर चुना गया' : 'Pain level selected'}
            </p>
          </div>
          <button
            type="button"
            aria-label="Hear this pain level description"
            onClick={() => speak(selected.audio[lang] ?? selected.audio.en)}
            className="ml-auto text-teal-600 text-xl focus:outline-none"
          >
            🔊
          </button>
        </div>
      )}
    </div>
  );
};
