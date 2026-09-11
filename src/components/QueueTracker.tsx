// MediKiosk AI — Live Queue Token Tracker
// Simulates real-time OPD queue with patient's position, estimated wait,
// and auto-speaks updates in patient's chosen language

import React, { useState, useEffect, useCallback } from 'react';
import { useA11y } from './AccessibilityProvider';

interface QueueTrackerProps {
  tokenNumber: string;        // e.g. "OPD-4821"
  ayushSystem: string;        // e.g. "Ayurveda"
  isRedFlag?: boolean;
}

// Parse token number from "OPD-XXXX" format
const parseToken = (token: string): number => {
  const match = token.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : 1000;
};

// Generate a "currently serving" number that advances over time
const getSimulatedCurrentServing = (patientToken: number, startTime: number): number => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000); // seconds elapsed
  const patientsServed = Math.floor(elapsed / 90); // 1 patient every ~90 seconds
  const startOffset = Math.max(3, Math.floor(Math.random() * 8) + 3); // start 3-10 behind
  return Math.min(patientToken - 1, Math.max(patientToken - startOffset + patientsServed, 1));
};

const SYSTEM_ICONS: Record<string, string> = {
  'Ayurveda': '🌿',
  'Homoeopathy': '💊',
  'Unani': '⚗️',
  'Siddha': '🔮',
  'Yoga & Naturopathy': '🧘',
};

export const QueueTracker: React.FC<QueueTrackerProps> = ({
  tokenNumber,
  ayushSystem,
  isRedFlag = false,
}) => {
  const { lang, speak, playTone } = useA11y();
  const [startTime] = useState(() => Date.now());
  const [currentServing, setCurrentServing] = useState<number>(0);
  const [lastSpokenPosition, setLastSpokenPosition] = useState<number>(-1);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [hasAlerted, setHasAlerted] = useState(false);

  const patientToken = parseToken(tokenNumber);

  const getPosition = useCallback(() => Math.max(0, patientToken - currentServing), [patientToken, currentServing]);
  const getWaitMinutes = useCallback(() => Math.max(0, getPosition() * 2), [getPosition]);

  // Update every 15 seconds
  useEffect(() => {
    const update = () => {
      const newServing = getSimulatedCurrentServing(patientToken, startTime);
      setCurrentServing(newServing);
      setLastUpdated(new Date());
    };
    update(); // immediate first update
    const interval = setInterval(update, 15000);
    return () => clearInterval(interval);
  }, [patientToken, startTime]);

  // Speak position updates at key moments
  useEffect(() => {
    if (currentServing === 0) return;
    const pos = getPosition();

    if (pos !== lastSpokenPosition) {
      // Announce at key thresholds
      if (pos <= 3 && pos !== lastSpokenPosition) {
        playTone('info');
        const msg = lang === 'hi'
          ? `आपकी बारी आने वाली है! आप ${pos === 0 ? 'अगले हैं' : `${pos} नंबर पर हैं`}`
          : lang === 'ta'
          ? `உங்கள் முறை வரப்போகிறது! நீங்கள் ${pos === 0 ? 'அடுத்தவர்' : `${pos} வரிசையில்`}`
          : lang === 'bn'
          ? `আপনার পালা আসতে চলেছে! আপনি ${pos === 0 ? 'পরবর্তী' : `${pos} নম্বরে`}`
          : pos === 0
          ? 'You are NEXT! Please go to the doctor\'s room now.'
          : `Almost your turn! You are number ${pos} in queue. Please be ready.`;
        speak(msg);
        setLastSpokenPosition(pos);
        if (pos === 1 && !hasAlerted) {
          setHasAlerted(true);
          playTone('emergency');
        }
      }
    }
  }, [currentServing, getPosition, lang, speak, playTone, lastSpokenPosition, hasAlerted]);

  const position = getPosition();
  const waitMinutes = getWaitMinutes();
  const systemIcon = SYSTEM_ICONS[ayushSystem] ?? '🏥';

  const getStatusColor = () => {
    if (isRedFlag) return 'border-red-500 bg-red-50';
    if (position === 0) return 'border-green-500 bg-green-50';
    if (position <= 3) return 'border-amber-400 bg-amber-50';
    return 'border-teal-300 bg-teal-50';
  };

  const getStatusText = () => {
    if (isRedFlag) {
      return {
        en: '🚨 Priority — Please alert staff immediately',
        hi: '🚨 प्राथमिकता — स्टाफ को तुरंत बताएं',
        ta: '🚨 முன்னுரிமை — ஊழியரை உடனே அழையுங்கள்',
        bn: '🚨 অগ্রাধিকার — এখনই স্টাফকে জানান',
      }[lang] ?? '🚨 Priority — Please alert staff immediately';
    }
    if (position === 0) {
      return {
        en: '✅ Your turn! Please go to the doctor room now',
        hi: '✅ आपकी बारी! अभी डॉक्टर के कमरे में जाएं',
        ta: '✅ உங்கள் முறை! இப்போது மருத்துவர் அறைக்கு செல்லுங்கள்',
        bn: '✅ আপনার পালা! এখনই ডাক্তারের ঘরে যান',
      }[lang] ?? '✅ Your turn now!';
    }
    if (position <= 2) {
      return {
        en: '⏰ Almost your turn — please be ready',
        hi: '⏰ लगभग आपकी बारी है — तैयार रहें',
        ta: '⏰ கிட்டத்தட்ட உங்கள் முறை — தயாராக இருங்கள்',
        bn: '⏰ প্রায় আপনার পালা — প্রস্তুত থাকুন',
      }[lang] ?? '⏰ Almost your turn!';
    }
    return {
      en: `Please wait — approximately ${waitMinutes} minutes remaining`,
      hi: `कृपया प्रतीक्षा करें — लगभग ${waitMinutes} मिनट बाकी`,
      ta: `காத்திருங்கள் — சுமார் ${waitMinutes} நிமிடங்கள் மீதி`,
      bn: `অপেক্ষা করুন — প্রায় ${waitMinutes} মিনিট বাকি`,
    }[lang] ?? `Wait ~${waitMinutes} minutes`;
  };

  const speakCurrentStatus = () => {
    const text = position === 0
      ? 'Your turn now! Go to the doctor room.'
      : `Your token is ${tokenNumber}. Currently serving ${currentServing}. You are number ${position} in queue. Estimated wait: ${waitMinutes} minutes.`;
    speak(text);
  };

  return (
    <div
      className={`w-full rounded-3xl border-2 p-5 ${getStatusColor()} transition-all duration-500`}
      role="region"
      aria-label="Queue status"
      aria-live="polite"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">{systemIcon}</span>
          <div>
            <p className="text-xs text-slate-500 font-medium">{ayushSystem} OPD</p>
            <p className="text-2xl font-black text-slate-800 tracking-wider">{tokenNumber}</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Hear current queue status"
          onClick={speakCurrentStatus}
          className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xl text-slate-600 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400 transition-all active:scale-95"
        >
          🔊
        </button>
      </div>

      {/* Queue visual */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Currently serving */}
        <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
          <p className="text-xs text-slate-500 font-medium mb-1">
            {lang === 'hi' ? 'अभी' : lang === 'ta' ? 'இப்போது' : lang === 'bn' ? 'এখন' : 'Serving now'}
          </p>
          <p className="text-2xl font-black text-slate-800">
            {currentServing > 0 ? currentServing : '—'}
          </p>
        </div>

        {/* Position */}
        <div className={`rounded-2xl p-3 text-center shadow-sm ${
          position === 0 ? 'bg-green-500' : position <= 3 ? 'bg-amber-400' : 'bg-white'
        }`}>
          <p className={`text-xs font-medium mb-1 ${position <= 3 && position > 0 || position === 0 ? 'text-white' : 'text-slate-500'}`}>
            {lang === 'hi' ? 'आपका नंबर' : lang === 'ta' ? 'உங்கள் இடம்' : lang === 'bn' ? 'আপনার অবস্থান' : 'Your position'}
          </p>
          <p className={`text-2xl font-black ${position <= 3 || position === 0 ? 'text-white' : 'text-slate-800'}`}>
            {position === 0 ? '🎉' : `#${position}`}
          </p>
        </div>

        {/* Wait time */}
        <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
          <p className="text-xs text-slate-500 font-medium mb-1">
            {lang === 'hi' ? 'अनुमानित' : lang === 'ta' ? 'தோராயமான' : lang === 'bn' ? 'আনুমানিক' : 'Est. wait'}
          </p>
          <p className="text-2xl font-black text-slate-800">
            {position === 0 ? '0' : waitMinutes}
            <span className="text-sm font-medium text-slate-500 ml-1">min</span>
          </p>
        </div>
      </div>

      {/* Status message */}
      <div className={`rounded-2xl px-4 py-3 text-center font-semibold text-sm ${
        isRedFlag ? 'bg-red-100 text-red-800' :
        position === 0 ? 'bg-green-100 text-green-800' :
        position <= 2 ? 'bg-amber-100 text-amber-800' :
        'bg-white text-slate-700'
      }`}>
        {getStatusText()}
      </div>

      {/* Queue visualization */}
      {position > 0 && position <= 8 && (
        <div className="mt-4">
          <p className="text-xs text-slate-500 mb-2 font-medium">
            {lang === 'hi' ? 'लाइन में स्थिति:' : 'Your position in line:'}
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: Math.min(position + 1, 9) }, (_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < position
                    ? 'bg-slate-200 text-slate-400'
                    : 'bg-teal-600 text-white ring-4 ring-teal-200 scale-110'
                }`}
              >
                {i < position ? '👤' : '🙋'}
              </div>
            ))}
            {position > 8 && (
              <span className="text-xs text-slate-400 self-center ml-1">
                +{position - 8} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Last updated */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
          <p className="text-xs text-green-600 font-medium">Live</p>
        </div>
      </div>

      {/* Tips while waiting */}
      {position > 3 && (
        <div className="mt-4 p-3 bg-white rounded-2xl border border-slate-100">
          <p className="text-xs text-slate-500 font-semibold mb-1">
            💡 {lang === 'hi' ? 'प्रतीक्षा के दौरान:' : lang === 'ta' ? 'காத்திருக்கும்போது:' : lang === 'bn' ? 'অপেক্ষার সময়:' : 'While you wait:'}
          </p>
          <p className="text-xs text-slate-600">
            {lang === 'hi'
              ? 'अपने दस्तावेज़ तैयार रखें। यदि लक्षण बिगड़ें तो 🆘 दबाएं।'
              : lang === 'ta'
              ? 'உங்கள் ஆவணங்களை தயாராக வையுங்கள். அறிகுறிகள் மோசமானால் 🆘 அழுத்துங்கள்.'
              : lang === 'bn'
              ? 'আপনার কাগজপত্র প্রস্তুত রাখুন। লক্ষণ খারাপ হলে 🆘 চাপুন।'
              : 'Keep your documents ready. If symptoms worsen, press 🆘 for staff.'}
          </p>
        </div>
      )}
    </div>
  );
};
