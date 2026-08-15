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
  // Chrome transcribes on Google's servers, so this fires when that service
  // is unreachable *or* when the build has no access to it — which is the
  // usual story inside embedded webviews (VS Code's Simple Browser, Electron
  // shells) and some de-Googled Chromium forks. Offline is the rarer cause.
  network:
    "Voice input could not reach the speech service. If you are viewing this " +
    "inside an editor preview or embedded browser, open it in Chrome, Edge, " +
    "or Safari instead.",
};

export interface UseSpeechRecognition {
  /** False on browsers without the API (notably Firefox) — hide the mic. */
  supported: boolean;
  /** Running in a frame/webview, where the speech backend usually fails. */
  embedded: boolean;
  listening: boolean;
  /** Words recognised so far in the current phrase, not yet finalised. */
  interim: string;
  error: string | null;
  start: () => void;
  stop: () => void;
}

/**
 * Embedded webviews expose the API but usually cannot reach the speech
 * backend, so dictation fails only once the person tries it. Detecting the
 * frame lets the UI warn up front instead.
 */
function isEmbedded(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.self !== window.top;
  } catch {
    // Cross-origin frame access throws, which itself means we are embedded.
    return true;
  }
}

export function useSpeechRecognition(options: {
  /** Called for each finalised phrase, ready to append. */
  onResult: (transcript: string) => void;
  lang?: string;
}): UseSpeechRecognition {
  const { onResult, lang } = options;

  const [supported] = useState(() => getRecognitionCtor() !== null);
  const [embedded] = useState(isEmbedded);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  // Chrome ends the session on its own after a pause. This tracks whether the
  // person actually asked to stop, so we can restart transparently if not.
  const wantsToListenRef = useRef(false);
  // Keep the latest callback without re-creating the recognition instance.
  const onResultRef = useRef(onResult);
  const restartTimerRef = useRef<number | null>(null);
  // A session that ends immediately and repeatedly means restarting is not
  // working (mic held elsewhere, backend unreachable). Back out rather than
  // spinning forever with the UI claiming to listen.
  const restartsRef = useRef(0);
  const sawResultRef = useRef(false);

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

    const debug = (...args: unknown[]) => {
      if (import.meta.env.DEV) console.debug("[speech]", ...args);
    };

    recognition.onstart = () => {
      debug("session started", { lang: recognition.lang });
      setListening(true);
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let pending = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) finalText += text;
        else pending += text;
      }

      // Any result at all proves the pipeline works; stop counting restarts.
      sawResultRef.current = true;
      restartsRef.current = 0;
      debug("result", { final: finalText, interim: pending });

      setInterim(pending);
      if (finalText.trim()) {
        onResultRef.current(finalText.trim());
        setInterim("");
      }
    };

    recognition.onerror = (event) => {
      debug("error", event.error);
      // Silence between sentences is normal, not a failure worth surfacing.
      if (event.error === "no-speech" || event.error === "aborted") return;

      setError(ERROR_MESSAGES[event.error] ?? "Dictation stopped unexpectedly.");
      wantsToListenRef.current = false;
      setListening(false);
      setInterim("");
    };

    recognition.onend = () => {
      debug("session ended", {
        wantsToListen: wantsToListenRef.current,
        restarts: restartsRef.current,
      });

      if (!wantsToListenRef.current) {
        setListening(false);
        setInterim("");
        return;
      }

      // Give up if sessions keep ending before a single word is recognised.
      if (!sawResultRef.current && restartsRef.current >= 3) {
        wantsToListenRef.current = false;
        setListening(false);
        setInterim("");
        setError(
          "Voice input could not hear anything. Check that the right microphone " +
            "is selected and no other app is using it, then try again.",
        );
        return;
      }

      restartsRef.current += 1;

      // Restarting synchronously inside onend throws InvalidStateError in
      // Chrome, because the previous session still holds the mic. Yield first.
      restartTimerRef.current = window.setTimeout(() => {
        if (!wantsToListenRef.current) return;
        try {
          recognition.start();
        } catch (err) {
          debug("restart failed", err);
          wantsToListenRef.current = false;
          setListening(false);
          setInterim("");
        }
      }, 250);
    };

    recognitionRef.current = recognition;

    return () => {
      wantsToListenRef.current = false;
      if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current);
      recognition.onstart = null;
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
    restartsRef.current = 0;
    sawResultRef.current = false;

    try {
      recognition.start();
      // onstart flips `listening`; set it here too so the button reacts
      // immediately rather than waiting on the browser.
      setListening(true);
    } catch {
      // start() throws if a session is already running — treat as listening.
      setListening(true);
    }
  }, []);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    wantsToListenRef.current = false;
    if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current);
    setListening(false);
    setInterim("");
    recognition?.stop();
  }, []);

  return { supported, embedded, listening, interim, error, start, stop };
}
