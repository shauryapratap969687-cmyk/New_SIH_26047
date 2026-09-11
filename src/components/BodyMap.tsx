// MediKiosk AI — Interactive Body Map
// Patient taps exact location of pain on an SVG body diagram
// No reading required — designed for illiterate patients

import React, { useState } from 'react';
import { useA11y } from './AccessibilityProvider';

export interface BodyRegion {
  id: string;
  label: { en: string; hi: string; ta: string; bn: string };
  audioKey: { en: string; hi: string; ta: string; bn: string };
  svgId: string; // corresponds to SVG element
}

export const BODY_REGIONS: BodyRegion[] = [
  {
    id: 'head', svgId: 'region-head',
    label: { en: 'Head / Face', hi: 'सिर / चेहरा', ta: 'தலை / முகம்', bn: 'মাথা / মুখ' },
    audioKey: { en: 'Head or face', hi: 'सिर या चेहरा', ta: 'தலை அல்லது முகம்', bn: 'মাথা বা মুখ' },
  },
  {
    id: 'neck', svgId: 'region-neck',
    label: { en: 'Neck / Throat', hi: 'गर्दन / गला', ta: 'கழுத்து / தொண்டை', bn: 'ঘাড় / গলা' },
    audioKey: { en: 'Neck or throat', hi: 'गर्दन या गला', ta: 'கழுத்து அல்லது தொண்டை', bn: 'ঘাড় বা গলা' },
  },
  {
    id: 'chest', svgId: 'region-chest',
    label: { en: 'Chest / Heart', hi: 'छाती / हृदय', ta: 'மார்பு / இதயம்', bn: 'বুক / হৃদয়' },
    audioKey: { en: 'Chest or heart area', hi: 'छाती या हृदय क्षेत्र', ta: 'மார்பு அல்லது இதய பகுதி', bn: 'বুক বা হৃদয় এলাকা' },
  },
  {
    id: 'abdomen', svgId: 'region-abdomen',
    label: { en: 'Stomach / Abdomen', hi: 'पेट', ta: 'வயிறு', bn: 'পেট' },
    audioKey: { en: 'Stomach or abdomen', hi: 'पेट', ta: 'வயிறு', bn: 'পেট' },
  },
  {
    id: 'lower_abdomen', svgId: 'region-lower-abdomen',
    label: { en: 'Lower Abdomen / Groin', hi: 'निचला पेट / कमर', ta: 'கீழ் வயிறு', bn: 'তলপেট' },
    audioKey: { en: 'Lower abdomen', hi: 'निचला पेट', ta: 'கீழ் வயிறு', bn: 'তলপেট' },
  },
  {
    id: 'left_arm', svgId: 'region-left-arm',
    label: { en: 'Left Arm / Shoulder', hi: 'बायाँ हाथ / कंधा', ta: 'இடது கை / தோள்', bn: 'বাম হাত / কাঁধ' },
    audioKey: { en: 'Left arm or shoulder', hi: 'बायाँ हाथ या कंधा', ta: 'இடது கை அல்லது தோள்', bn: 'বাম হাত বা কাঁধ' },
  },
  {
    id: 'right_arm', svgId: 'region-right-arm',
    label: { en: 'Right Arm / Shoulder', hi: 'दायाँ हाथ / कंधा', ta: 'வலது கை / தோள்', bn: 'ডান হাত / কাঁধ' },
    audioKey: { en: 'Right arm or shoulder', hi: 'दायाँ हाथ या कंधा', ta: 'வலது கை அல்லது தோள்', bn: 'ডান হাত বা কাঁধ' },
  },
  {
    id: 'back', svgId: 'region-back',
    label: { en: 'Back / Spine', hi: 'पीठ / रीढ़', ta: 'முதுகு / தண்டு', bn: 'পিঠ / মেরুদণ্ড' },
    audioKey: { en: 'Back or spine', hi: 'पीठ या रीढ़', ta: 'முதுகு அல்லது தண்டு', bn: 'পিঠ বা মেরুদণ্ড' },
  },
  {
    id: 'left_leg', svgId: 'region-left-leg',
    label: { en: 'Left Leg / Knee', hi: 'बायाँ पैर / घुटना', ta: 'இடது கால் / முழங்கால்', bn: 'বাম পা / হাঁটু' },
    audioKey: { en: 'Left leg or knee', hi: 'बायाँ पैर या घुटना', ta: 'இடது கால் அல்லது முழங்கால்', bn: 'বাম পা বা হাঁটু' },
  },
  {
    id: 'right_leg', svgId: 'region-right-leg',
    label: { en: 'Right Leg / Knee', hi: 'दायाँ पैर / घुटना', ta: 'வலது கால் / முழங்கால்', bn: 'ডান পা / হাঁটু' },
    audioKey: { en: 'Right leg or knee', hi: 'दायाँ पैर या घुटना', ta: 'வலது கால் அல்லது முழங்கால்', bn: 'ডান পা বা হাঁটু' },
  },
  {
    id: 'whole_body', svgId: 'region-whole',
    label: { en: 'Whole Body / General', hi: 'पूरा शरीर / सामान्य', ta: 'முழு உடல்', bn: 'সমস্ত শরীর' },
    audioKey: { en: 'Whole body or general feeling', hi: 'पूरा शरीर', ta: 'முழு உடல்', bn: 'সমস্ত শরীর' },
  },
];

// Map body region IDs to the adaptive questioning option IDs
export const REGION_TO_OPTION: Record<string, string> = {
  head: 'head',
  neck: 'neck',
  chest: 'chest',
  abdomen: 'abdomen',
  lower_abdomen: 'lower_abdomen',
  left_arm: 'left_arm',
  right_arm: 'right_arm',
  back: 'back',
  left_leg: 'leg',
  right_leg: 'leg',
  whole_body: 'whole_body',
};

interface BodyMapProps {
  selectedIds: string[];
  onSelect: (regionId: string) => void;
  multi?: boolean;
}

const REGION_COLORS = {
  idle: '#e2e8f0',
  hover: '#99f6e4',
  selected: '#0d9488',
  label: { selected: '#fff', idle: '#334155' },
};

export const BodyMap: React.FC<BodyMapProps> = ({ selectedIds, onSelect, multi = false }) => {
  const { lang, speak } = useA11y();
  const [view, setView] = useState<'front' | 'back'>('front');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isSelected = (id: string) => selectedIds.includes(id);

  const handleRegionClick = (region: BodyRegion) => {
    const label = region.label[lang] ?? region.label.en;
    speak(label);
    onSelect(region.id);
  };

  const fillColor = (id: string) =>
    isSelected(id) ? REGION_COLORS.selected : hoveredId === id ? REGION_COLORS.hover : REGION_COLORS.idle;

  const strokeColor = (id: string) =>
    isSelected(id) ? '#0f766e' : '#94a3b8';

  // Regions visible in front view
  const frontRegions = BODY_REGIONS.filter(r => r.id !== 'back');
  // Regions visible in back view
  const backRegions = BODY_REGIONS.filter(r => ['back', 'head', 'neck', 'left_arm', 'right_arm', 'left_leg', 'right_leg'].includes(r.id));

  const activeRegions = view === 'front' ? frontRegions : backRegions;

  const regionLabel = (region: BodyRegion) => region.label[lang] ?? region.label.en;

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Front / Back toggle */}
      <div
        className="flex rounded-xl border border-slate-200 overflow-hidden"
        role="radiogroup"
        aria-label="Body view"
      >
        {(['front', 'back'] as const).map(v => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={view === v}
            onClick={() => setView(v)}
            className={`px-5 py-2 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
              view === v ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {v === 'front' ? '👤 Front' : '🔄 Back'}
          </button>
        ))}
      </div>

      {/* SVG Body Diagram */}
      <div className="relative flex flex-col sm:flex-row gap-6 items-start justify-center w-full">
        {/* SVG Body */}
        <svg
          viewBox="0 0 200 420"
          className="w-40 flex-shrink-0"
          role="img"
          aria-label="Body diagram — tap to select where your pain is"
        >
          {/* ── Head ── */}
          <g
            id="region-head"
            role="button"
            aria-label={regionLabel(BODY_REGIONS[0])}
            aria-pressed={isSelected('head')}
            tabIndex={0}
            onClick={() => handleRegionClick(BODY_REGIONS[0])}
            onKeyDown={e => e.key === 'Enter' && handleRegionClick(BODY_REGIONS[0])}
            onMouseEnter={() => setHoveredId('head')}
            onMouseLeave={() => setHoveredId(null)}
            style={{ cursor: 'pointer' }}
          >
            <ellipse cx="100" cy="44" rx="32" ry="38" fill={fillColor('head')} stroke={strokeColor('head')} strokeWidth="2" />
            {/* Face features */}
            <ellipse cx="89" cy="40" rx="4" ry="5" fill={isSelected('head') ? '#99f6e4' : '#94a3b8'} />
            <ellipse cx="111" cy="40" rx="4" ry="5" fill={isSelected('head') ? '#99f6e4' : '#94a3b8'} />
            <path d="M 90 56 Q 100 62 110 56" stroke={isSelected('head') ? '#99f6e4' : '#94a3b8'} strokeWidth="2" fill="none" strokeLinecap="round" />
            {isSelected('head') && <ellipse cx="100" cy="44" rx="32" ry="38" fill="none" stroke="#0d9488" strokeWidth="3" />}
          </g>

          {/* ── Neck ── */}
          <g
            id="region-neck"
            role="button"
            aria-label={regionLabel(BODY_REGIONS[1])}
            aria-pressed={isSelected('neck')}
            tabIndex={0}
            onClick={() => handleRegionClick(BODY_REGIONS[1])}
            onKeyDown={e => e.key === 'Enter' && handleRegionClick(BODY_REGIONS[1])}
            onMouseEnter={() => setHoveredId('neck')}
            onMouseLeave={() => setHoveredId(null)}
            style={{ cursor: 'pointer' }}
          >
            <rect x="85" y="80" width="30" height="22" rx="6" fill={fillColor('neck')} stroke={strokeColor('neck')} strokeWidth="2" />
            {isSelected('neck') && <rect x="85" y="80" width="30" height="22" rx="6" fill="none" stroke="#0d9488" strokeWidth="3" />}
          </g>

          {/* ── Torso ── */}
          <rect x="60" y="100" width="80" height="110" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* ── Chest (front only) ── */}
          {view === 'front' && (
            <g
              id="region-chest"
              role="button"
              aria-label={regionLabel(BODY_REGIONS[2])}
              aria-pressed={isSelected('chest')}
              tabIndex={0}
              onClick={() => handleRegionClick(BODY_REGIONS[2])}
              onKeyDown={e => e.key === 'Enter' && handleRegionClick(BODY_REGIONS[2])}
              onMouseEnter={() => setHoveredId('chest')}
              onMouseLeave={() => setHoveredId(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect x="62" y="102" width="76" height="52" rx="8" fill={fillColor('chest')} stroke={strokeColor('chest')} strokeWidth="2" />
              {/* Heart icon */}
              <text x="100" y="134" textAnchor="middle" fontSize="18" style={{ userSelect: 'none' }}>❤️</text>
              {isSelected('chest') && <rect x="62" y="102" width="76" height="52" rx="8" fill="none" stroke="#0d9488" strokeWidth="3" />}
            </g>
          )}

          {/* ── Back (back view) ── */}
          {view === 'back' && (
            <g
              id="region-back"
              role="button"
              aria-label={regionLabel(BODY_REGIONS[7])}
              aria-pressed={isSelected('back')}
              tabIndex={0}
              onClick={() => handleRegionClick(BODY_REGIONS[7])}
              onKeyDown={e => e.key === 'Enter' && handleRegionClick(BODY_REGIONS[7])}
              onMouseEnter={() => setHoveredId('back')}
              onMouseLeave={() => setHoveredId(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect x="62" y="102" width="76" height="108" rx="8" fill={fillColor('back')} stroke={strokeColor('back')} strokeWidth="2" />
              {/* Spine line */}
              <line x1="100" y1="108" x2="100" y2="204" stroke={isSelected('back') ? '#99f6e4' : '#94a3b8'} strokeWidth="2" strokeDasharray="4,3" />
              {isSelected('back') && <rect x="62" y="102" width="76" height="108" rx="8" fill="none" stroke="#0d9488" strokeWidth="3" />}
            </g>
          )}

          {/* ── Abdomen (front only) ── */}
          {view === 'front' && (
            <g
              id="region-abdomen"
              role="button"
              aria-label={regionLabel(BODY_REGIONS[3])}
              aria-pressed={isSelected('abdomen')}
              tabIndex={0}
              onClick={() => handleRegionClick(BODY_REGIONS[3])}
              onKeyDown={e => e.key === 'Enter' && handleRegionClick(BODY_REGIONS[3])}
              onMouseEnter={() => setHoveredId('abdomen')}
              onMouseLeave={() => setHoveredId(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect x="62" y="156" width="76" height="40" rx="6" fill={fillColor('abdomen')} stroke={strokeColor('abdomen')} strokeWidth="2" />
              {isSelected('abdomen') && <rect x="62" y="156" width="76" height="40" rx="6" fill="none" stroke="#0d9488" strokeWidth="3" />}
            </g>
          )}

          {/* ── Lower Abdomen (front only) ── */}
          {view === 'front' && (
            <g
              id="region-lower-abdomen"
              role="button"
              aria-label={regionLabel(BODY_REGIONS[4])}
              aria-pressed={isSelected('lower_abdomen')}
              tabIndex={0}
              onClick={() => handleRegionClick(BODY_REGIONS[4])}
              onKeyDown={e => e.key === 'Enter' && handleRegionClick(BODY_REGIONS[4])}
              onMouseEnter={() => setHoveredId('lower_abdomen')}
              onMouseLeave={() => setHoveredId(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect x="68" y="198" width="64" height="28" rx="6" fill={fillColor('lower_abdomen')} stroke={strokeColor('lower_abdomen')} strokeWidth="2" />
              {isSelected('lower_abdomen') && <rect x="68" y="198" width="64" height="28" rx="6" fill="none" stroke="#0d9488" strokeWidth="3" />}
            </g>
          )}

          {/* ── Left Arm ── */}
          <g
            id="region-left-arm"
            role="button"
            aria-label={regionLabel(BODY_REGIONS[5])}
            aria-pressed={isSelected('left_arm')}
            tabIndex={0}
            onClick={() => handleRegionClick(BODY_REGIONS[5])}
            onKeyDown={e => e.key === 'Enter' && handleRegionClick(BODY_REGIONS[5])}
            onMouseEnter={() => setHoveredId('left_arm')}
            onMouseLeave={() => setHoveredId(null)}
            style={{ cursor: 'pointer' }}
          >
            <rect x="20" y="100" width="36" height="90" rx="14" fill={fillColor('left_arm')} stroke={strokeColor('left_arm')} strokeWidth="2" />
            {/* Hand */}
            <ellipse cx="38" cy="200" rx="14" ry="10" fill={fillColor('left_arm')} stroke={strokeColor('left_arm')} strokeWidth="1.5" />
            {isSelected('left_arm') && <rect x="20" y="100" width="36" height="90" rx="14" fill="none" stroke="#0d9488" strokeWidth="3" />}
          </g>

          {/* ── Right Arm ── */}
          <g
            id="region-right-arm"
            role="button"
            aria-label={regionLabel(BODY_REGIONS[6])}
            aria-pressed={isSelected('right_arm')}
            tabIndex={0}
            onClick={() => handleRegionClick(BODY_REGIONS[6])}
            onKeyDown={e => e.key === 'Enter' && handleRegionClick(BODY_REGIONS[6])}
            onMouseEnter={() => setHoveredId('right_arm')}
            onMouseLeave={() => setHoveredId(null)}
            style={{ cursor: 'pointer' }}
          >
            <rect x="144" y="100" width="36" height="90" rx="14" fill={fillColor('right_arm')} stroke={strokeColor('right_arm')} strokeWidth="2" />
            <ellipse cx="162" cy="200" rx="14" ry="10" fill={fillColor('right_arm')} stroke={strokeColor('right_arm')} strokeWidth="1.5" />
            {isSelected('right_arm') && <rect x="144" y="100" width="36" height="90" rx="14" fill="none" stroke="#0d9488" strokeWidth="3" />}
          </g>

          {/* ── Left Leg ── */}
          <g
            id="region-left-leg"
            role="button"
            aria-label={regionLabel(BODY_REGIONS[8])}
            aria-pressed={isSelected('left_leg')}
            tabIndex={0}
            onClick={() => handleRegionClick(BODY_REGIONS[8])}
            onKeyDown={e => e.key === 'Enter' && handleRegionClick(BODY_REGIONS[8])}
            onMouseEnter={() => setHoveredId('left_leg')}
            onMouseLeave={() => setHoveredId(null)}
            style={{ cursor: 'pointer' }}
          >
            <rect x="65" y="228" width="34" height="120" rx="14" fill={fillColor('left_leg')} stroke={strokeColor('left_leg')} strokeWidth="2" />
            <ellipse cx="82" cy="352" rx="18" ry="10" fill={fillColor('left_leg')} stroke={strokeColor('left_leg')} strokeWidth="1.5" />
            {isSelected('left_leg') && <rect x="65" y="228" width="34" height="120" rx="14" fill="none" stroke="#0d9488" strokeWidth="3" />}
          </g>

          {/* ── Right Leg ── */}
          <g
            id="region-right-leg"
            role="button"
            aria-label={regionLabel(BODY_REGIONS[9])}
            aria-pressed={isSelected('right_leg')}
            tabIndex={0}
            onClick={() => handleRegionClick(BODY_REGIONS[9])}
            onKeyDown={e => e.key === 'Enter' && handleRegionClick(BODY_REGIONS[9])}
            onMouseEnter={() => setHoveredId('right_leg')}
            onMouseLeave={() => setHoveredId(null)}
            style={{ cursor: 'pointer' }}
          >
            <rect x="101" y="228" width="34" height="120" rx="14" fill={fillColor('right_leg')} stroke={strokeColor('right_leg')} strokeWidth="2" />
            <ellipse cx="118" cy="352" rx="18" ry="10" fill={fillColor('right_leg')} stroke={strokeColor('right_leg')} strokeWidth="1.5" />
            {isSelected('right_leg') && <rect x="101" y="228" width="34" height="120" rx="14" fill="none" stroke="#0d9488" strokeWidth="3" />}
          </g>

          {/* Selection checkmarks on selected regions */}
          {activeRegions.filter(r => isSelected(r.id)).map(r => (
            <text key={r.id} x="100" y="16" textAnchor="middle" fontSize="12" fill="#0d9488" fontWeight="bold" style={{ userSelect: 'none' }}>
              ✓
            </text>
          ))}
        </svg>

        {/* Region list (for small screens / keyboard nav) */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {lang === 'hi' ? 'या यहाँ से चुनें' : lang === 'ta' ? 'அல்லது இங்கிருந்து தேர்வு' : lang === 'bn' ? 'বা এখান থেকে বেছে নিন' : 'Or tap from list'}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {activeRegions.map(region => {
              const sel = isSelected(region.id);
              return (
                <button
                  key={region.id}
                  type="button"
                  role={multi ? 'checkbox' : 'radio'}
                  aria-checked={sel}
                  aria-label={region.label[lang] ?? region.label.en}
                  onClick={() => handleRegionClick(region)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                    border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
                    active:scale-95 text-left
                    ${sel
                      ? 'bg-teal-600 border-teal-600 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50'}
                  `}
                >
                  {sel && <span aria-hidden="true" className="text-sm">✓</span>}
                  <span>{region.label[lang] ?? region.label.en}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected display */}
      {selectedIds.length > 0 && (
        <div
          aria-live="polite"
          className="w-full bg-teal-50 border border-teal-200 rounded-2xl px-4 py-3 flex flex-wrap gap-2"
        >
          <span className="text-xs text-teal-700 font-semibold w-full">
            {lang === 'hi' ? 'चुना गया:' : lang === 'ta' ? 'தேர்ந்தெடுக்கப்பட்டது:' : lang === 'bn' ? 'নির্বাচিত:' : 'Selected:'}
          </span>
          {selectedIds.map(id => {
            const region = BODY_REGIONS.find(r => r.id === id);
            return region ? (
              <span key={id} className="px-3 py-1 bg-teal-600 text-white rounded-full text-xs font-semibold">
                {region.label[lang] ?? region.label.en}
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};
