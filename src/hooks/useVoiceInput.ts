/**
 * Web Speech API hook — returns a (start, stop) pair for a single
 * field's dictation. If the browser doesn't support it, both methods
 * are no-ops and `isSupported` is false.
 */
import { useCallback, useEffect, useRef, useState } from "react";

interface SRAny {
  start: () => void;
  stop: () => void;
  abort?: () => void;
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onresult: ((ev: any) => void) | null;
  onerror: ((ev: any) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export function useVoiceInput(onResult: (text: string) => void) {
  const [isSupported, setSupported] = useState(false);
  const [isListening, setListening] = useState(false);
  const recRef = useRef<SRAny | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!Ctor);
  }, []);

  const start = useCallback(() => {
    if (!isSupported) return;
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec: SRAny = new Ctor();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = navigator.language || "en-IN";
    rec.onresult = (ev: any) => {
      const t = ev.results?.[0]?.[0]?.transcript ?? "";
      if (t) onResult(String(t));
    };
    rec.onerror = () => {};
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  }, [isSupported, onResult]);

  const stop = useCallback(() => {
    recRef.current?.stop?.();
    setListening(false);
  }, []);

  return { isSupported, isListening, start, stop };
}
