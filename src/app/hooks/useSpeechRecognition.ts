import { useCallback, useEffect, useRef, useState } from "react";

// Live dictation via the browser's built-in speech recognition.
//
// Chrome, Edge, and Safari expose this (Safari and older Chrome behind the
// webkit prefix); Firefox does not ship it at all, so callers must check
// `supported` and hide the affordance rather than offering a dead button.
//
// Everything runs in the browser: no audio is uploaded by us, nothing is
// billed, and partial results arrive while the person is still talking.

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  readonly length: number;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: {
    readonly length: number;
    [index: number]: SpeechRecognitionResult;
  };
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const ERROR_MESSAGES: Record<string, string> = {
  "not-allowed": "Microphone access was blocked. Allow it in your browser settings to dictate.",
  "service-not-allowed": "Microphone access was blocked. Allow it in your browser settings to dictate.",
  "audio-capture": "No microphone found. Check that one is connected.",
  network: "Speech recognition needs a network connection.",
};

export interface UseSpeechRecognition {
  /** False on browsers without the API (notably Firefox) — hide the mic. */
  supported: boolean;
  listening: boolean;
  /** Words recognised so far in the current phrase, not yet finalised. */
  interim: string;
  error: string | null;
  start: () => void;
  stop: () => void;
}

export function useSpeechRecognition(options: {
  /** Called for each finalised phrase, ready to append. */
  onResult: (transcript: string) => void;
  lang?: string;
}): UseSpeechRecognition {
  const { onResult, lang } = options;

  const [supported] = useState(() => getRecognitionCtor() !== null);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  // Chrome ends the session on its own after a pause. This tracks whether the
  // person actually asked to stop, so we can restart transparently if not.
  const wantsToListenRef = useRef(false);
  // Keep the latest callback without re-creating the recognition instance.
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = lang ?? navigator.language ?? "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalText = "";
      let pending = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) finalText += text;
        else pending += text;
      }

      setInterim(pending);
      if (finalText.trim()) {
        onResultRef.current(finalText.trim());
        setInterim("");
      }
    };

    recognition.onerror = (event) => {
      // Silence between sentences is normal, not a failure worth surfacing.
      if (event.error === "no-speech" || event.error === "aborted") return;

      setError(ERROR_MESSAGES[event.error] ?? "Dictation stopped unexpectedly.");
      wantsToListenRef.current = false;
      setListening(false);
      setInterim("");
    };

    recognition.onend = () => {
      // Restart if the browser timed out but the person never pressed stop.
      if (wantsToListenRef.current) {
        try {
          recognition.start();
          return;
        } catch {
          // Already restarting; fall through and settle into the stopped state.
        }
      }
      setListening(false);
      setInterim("");
    };

    recognitionRef.current = recognition;

    return () => {
      wantsToListenRef.current = false;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [lang]);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || wantsToListenRef.current) return;

    setError(null);
    setInterim("");
    wantsToListenRef.current = true;

    try {
      recognition.start();
      setListening(true);
    } catch {
      // start() throws if a session is already running — treat as listening.
      setListening(true);
    }
  }, []);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    wantsToListenRef.current = false;
    setListening(false);
    setInterim("");
    recognition?.stop();
  }, []);

  return { supported, listening, interim, error, start, stop };
}
