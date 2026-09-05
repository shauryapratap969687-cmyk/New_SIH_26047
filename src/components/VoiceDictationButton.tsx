import React, { useState } from 'react';
import { Mic, MicOff, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import type { SupportedLanguage } from '../hooks/useSpeechToText';

interface VoiceDictationButtonProps {
  onAppendText: (newText: string) => void;
  targetLabel?: string;
  className?: string;
}

export const VoiceDictationButton: React.FC<VoiceDictationButtonProps> = ({
  onAppendText,
  targetLabel = 'Field',
  className = '',
}) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en-IN');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const {
    isListening,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    setLanguage,
  } = useSpeechToText({
    language: selectedLang,
  });

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((appendedText) => {
        onAppendText(appendedText);
      });
    }
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    setLanguage(lang);
    setShowLanguageMenu(false);
    if (isListening) {
      stopListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="inline-flex items-center text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
        <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600 shrink-0" />
        <span>Voice input requires Chrome / Edge</span>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      {/* Listening status badge with waveform animation */}
      {isListening && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium animate-pulse">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          <span>Listening to {targetLabel}...</span>
          {interimTranscript && (
            <span className="italic text-gray-500 max-w-[140px] truncate">
              "{interimTranscript}"
            </span>
          )}
        </div>
      )}

      {/* Main Mic Button */}
      <button
        type="button"
        onClick={handleToggle}
        title={isListening ? 'Stop dictation' : `Dictate into ${targetLabel}`}
        className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 border ${
          isListening
            ? 'bg-red-600 text-white border-red-700 shadow-md ring-2 ring-red-300'
            : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100 hover:border-teal-300'
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5 animate-pulse text-white" />
            <span>Stop</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-teal-700" />
            <span>Dictate Voice</span>
          </>
        )}
      </button>

      {/* Language Selector Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          title="Change dictation language"
          className="inline-flex items-center gap-1 px-1.5 py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md transition-colors"
        >
          <Globe className="w-3 h-3 text-gray-500" />
          <span className="font-semibold text-[11px]">
            {selectedLang === 'en-IN' ? 'EN' : 'हिन्दी'}
          </span>
        </button>

        {showLanguageMenu && (
          <div className="absolute right-0 bottom-full mb-1 z-30 w-36 bg-white rounded-md shadow-lg border border-gray-200 py-1 text-xs animate-in fade-in zoom-in-95">
            <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
              Select Language
            </div>
            <button
              type="button"
              onClick={() => handleLanguageChange('en-IN')}
              className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-teal-50 transition-colors ${
                selectedLang === 'en-IN' ? 'text-teal-800 font-bold bg-teal-50/50' : 'text-gray-700'
              }`}
            >
              <span>English (India)</span>
              {selectedLang === 'en-IN' && <CheckCircle2 className="w-3 h-3 text-teal-600" />}
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('hi-IN')}
              className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-teal-50 transition-colors ${
                selectedLang === 'hi-IN' ? 'text-teal-800 font-bold bg-teal-50/50' : 'text-gray-700'
              }`}
            >
              <span>हिन्दी (India)</span>
              {selectedLang === 'hi-IN' && <CheckCircle2 className="w-3 h-3 text-teal-600" />}
            </button>
          </div>
        )}
      </div>

      {error && !isListening && (
        <span className="text-[11px] text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </span>
      )}
    </div>
  );
};
