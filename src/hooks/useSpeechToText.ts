import { useState, useRef, useCallback } from 'react';

// Speech Recognition type definitions for cross-browser support
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export type SupportedLanguage = 'en-IN' | 'hi-IN';

export interface UseSpeechToTextOptions {
  language?: SupportedLanguage;
  onTranscript?: (transcript: string) => void;
}

function checkSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function useSpeechToText(options?: UseSpeechToTextOptions) {
  const isSupported = checkSpeechRecognitionSupported();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [language, setLanguage] = useState<SupportedLanguage>(options?.language || 'en-IN');
  const [error, setError] = useState<string | null>(
    isSupported ? null : 'Voice input is not supported in this browser. Please use Chrome/Edge.'
  );

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const startListening = useCallback(
    (onAppend?: (text: string) => void) => {
      const SpeechRecognitionClass =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        setError('Voice input is not supported in this browser. Please use Chrome/Edge.');
        return;
      }

      setError(null);

      // Stop existing instance if any
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      try {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;
        recognitionRef.current = recognition;

        recognition.onstart = () => {
          setIsListening(true);
          isListeningRef.current = true;
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let currentInterim = '';
          let currentFinal = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcriptChunk = result[0].transcript;
            if (result.isFinal) {
              currentFinal += transcriptChunk + ' ';
            } else {
              currentInterim += transcriptChunk;
            }
          }

          if (currentFinal) {
            setTranscript((prev) => prev + currentFinal);
            if (onAppend) {
              onAppend(currentFinal);
            }
            if (options?.onTranscript) {
              options.onTranscript(currentFinal);
            }
          }

          setInterimTranscript(currentInterim);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.warn('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            setError('Microphone permission denied. Please allow microphone access in your browser.');
            stopListening();
          } else if (event.error === 'no-speech') {
            // Keep listening
          } else {
            setError(`Speech recognition notice: ${event.error}`);
          }
        };

        recognition.onend = () => {
          if (isListeningRef.current) {
            // Automatically restart if continuous was interrupted by silence
            try {
              recognition.start();
            } catch {
              setIsListening(false);
              isListeningRef.current = false;
            }
          } else {
            setIsListening(false);
          }
        };

        recognition.start();
      } catch (err: any) {
        console.error('Failed to start speech recognition:', err);
        setError('Could not access microphone: ' + (err.message || 'Unknown error'));
        setIsListening(false);
        isListeningRef.current = false;
      }
    },
    [language, options, stopListening]
  );

  return {
    isListening,
    transcript,
    interimTranscript,
    language,
    setLanguage,
    isSupported,
    error,
    startListening,
    stopListening,
    clearTranscript: () => {
      setTranscript('');
      setInterimTranscript('');
    },
  };
}
