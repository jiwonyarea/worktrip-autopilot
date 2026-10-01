import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// Text the agent appears to be writing as you arrive. Used for the one line
// that reports what the agent just did — it reads as the result landing rather
// than as a page that was already sitting there.
//
// Every screen's line under the title types, and nothing else does — that is
// what keeps it meaning "the agent is talking" rather than being decoration.
// No caret: it drew the eye to the mechanism instead of the sentence.

interface TypewriterProps {
  text: string;
  /** Milliseconds per character. */
  speed?: number;
  /** Milliseconds to wait before the first character. */
  delay?: number;
  className?: string;
}

export function Typewriter({ text, speed = 34, delay = 160, className = "" }: TypewriterProps) {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setShown(text.length);
      return;
    }

    setShown(0);
    let typed = 0;
    let ticker: number | undefined;

    const starter = window.setTimeout(() => {
      ticker = window.setInterval(() => {
        typed += 1;
        setShown(typed);
        if (typed >= text.length && ticker) window.clearInterval(ticker);
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(starter);
      if (ticker) window.clearInterval(ticker);
    };
  }, [text, speed, delay, reduceMotion]);

  return (
    <span className={className}>
      {/* Assistive tech gets the finished sentence; the animation is decoration
          and would otherwise be announced a letter at a time. */}
      <span className="sr-only">{text}</span>
      {/* The finished line is laid out invisibly underneath and the typed text
          sits on top of it, so the line holds its final width from the first
          character. Without this a centred line grows outwards from its middle
          — both ends creeping apart — instead of being written left to right.
          inline-grid, so the stack is still only as wide as the sentence and
          whatever centres the line keeps centring it. */}
      <span className="inline-grid" aria-hidden="true">
        <span className="col-start-1 row-start-1 invisible">{text}</span>
        <span className="col-start-1 row-start-1 text-left">
        {text.slice(0, shown)}
        </span>
      </span>
    </span>
  );
}
