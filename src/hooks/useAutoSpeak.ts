// MediKiosk AI — useAutoSpeak hook
// Automatically speaks a given text when a component mounts or step changes

import { useEffect, useRef } from 'react';
import { useA11y } from '../components/AccessibilityProvider';

/**
 * Speak a piece of text automatically when:
 * - The component first mounts (if `speakOnMount` is true)
 * - The `deps` change (e.g. when activeStep changes)
 *
 * @param text The text to speak. Can be a string or a function returning a string.
 * @param deps Dependency array — when these change, re-speak the text.
 * @param speakOnMount Whether to speak immediately on mount (default: true)
 * @param delayMs Milliseconds to wait before speaking (default: 300ms)
 */
export const useAutoSpeak = (
  text: string | (() => string),
  deps: React.DependencyList = [],
  speakOnMount = true,
  delayMs = 350,
) => {
  const { speak, audioMode } = useA11y();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!audioMode) return;
    if (!speakOnMount && !hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    hasMounted.current = true;

    const t = setTimeout(() => {
      const content = typeof text === 'function' ? text() : text;
      if (content) speak(content);
    }, delayMs);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioMode, ...deps]);
};
