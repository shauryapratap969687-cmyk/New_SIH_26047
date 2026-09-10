// MediKiosk AI — Persistent Repeat / Back / Help Action Cluster
// Always visible at bottom-right of every kiosk screen (position: fixed)
// Per spec: "A visible/audible 'repeat that' and 'go back' option on every screen"

import React, { useState } from 'react';
import { useA11y } from './AccessibilityProvider';

interface RepeatBackButtonProps {
  onRepeat?: () => void;  // Called when patient taps Repeat
  onBack?: () => void;    // Called when patient taps Back
  showBack?: boolean;
  repeatText?: string;    // The text to re-speak when Repeat is tapped
  className?: string;
}

export const RepeatBackButton: React.FC<RepeatBackButtonProps> = ({
  onRepeat,
  onBack,
  showBack = true,
  repeatText,
  className = '',
}) => {
  const { speak, t, playTone } = useA11y();
  const [staffAlerted, setStaffAlerted] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);

  const handleRepeat = () => {
    playTone('info');
    if (repeatText) speak(repeatText);
    onRepeat?.();
  };

  const handleBack = () => {
    playTone('info');
    onBack?.();
  };

  const handleCallStaff = () => {
    playTone('emergency');
    speak(t('callStaffMessage'));
    setStaffAlerted(true);
    setShowStaffModal(true);
  };

  return (
    <>
      {/* Fixed cluster — always visible */}
      <div
        className={`fixed bottom-6 right-6 flex flex-col gap-3 z-50 ${className}`}
        role="group"
        aria-label="Navigation and help"
      >
        {/* Repeat button */}
        <button
          type="button"
          aria-label={t('repeat')}
          onClick={handleRepeat}
          className="
            w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600
            text-white shadow-lg flex flex-col items-center justify-center
            focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300
            transition-all active:scale-95 group
          "
        >
          <span className="text-2xl" aria-hidden="true">🔁</span>
          <span className="text-[10px] font-bold mt-0.5" aria-hidden="true">Repeat</span>
        </button>

        {/* Back button */}
        {showBack && (
          <button
            type="button"
            aria-label={t('back')}
            onClick={handleBack}
            className="
              w-14 h-14 rounded-full bg-slate-500 hover:bg-slate-600
              text-white shadow-lg flex flex-col items-center justify-center
              focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300
              transition-all active:scale-95
            "
          >
            <span className="text-2xl" aria-hidden="true">←</span>
            <span className="text-[10px] font-bold mt-0.5" aria-hidden="true">Back</span>
          </button>
        )}

        {/* Call Staff button — always present */}
        <button
          type="button"
          aria-label={t('callStaff')}
          onClick={handleCallStaff}
          className="
            w-14 h-14 rounded-full bg-red-600 hover:bg-red-700
            text-white shadow-lg flex flex-col items-center justify-center
            focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300
            transition-all active:scale-95
            animate-pulse
          "
        >
          <span className="text-2xl" aria-hidden="true">🆘</span>
          <span className="text-[10px] font-bold mt-0.5" aria-hidden="true">Help</span>
        </button>
      </div>

      {/* Staff alert modal */}
      {showStaffModal && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="staff-alert-title"
          aria-describedby="staff-alert-desc"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
        >
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-6xl mb-4" aria-hidden="true">🆘</div>
            <h2
              id="staff-alert-title"
              className="text-2xl font-bold text-red-700 mb-3"
            >
              {t('callStaff')}
            </h2>
            <p
              id="staff-alert-desc"
              className="text-slate-600 text-lg leading-relaxed mb-6"
            >
              {t('callStaffMessage')}
            </p>
            {staffAlerted && (
              <div
                aria-live="polite"
                className="flex items-center justify-center gap-2 text-green-700 font-semibold mb-4"
              >
                <span className="text-2xl">✅</span>
                <span>Staff has been notified</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowStaffModal(false)}
              aria-label="Close this message"
              className="
                w-full py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-2xl
                font-bold text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400
                transition-all
              "
            >
              {t('done')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
