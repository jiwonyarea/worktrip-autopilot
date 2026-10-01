import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { formatMoney } from "../utils/itinerary";

// A dollar figure that counts to its new value instead of snapping to it.
// Swapping a flight changes four numbers at once; watching them travel is what
// tells you the edit landed and which lines it touched.
//
// The first render is not animated — a page arriving is not a change.

interface AnimatedMoneyProps {
  value?: number | null;
  /** Milliseconds for the full count. */
  duration?: number;
  className?: string;
}

/** Decelerating, so the number settles rather than stopping dead. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function AnimatedMoney({ value, duration = 300, className = "" }: AnimatedMoneyProps) {
  const target = Number(value ?? 0);
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  const frame = useRef<number>();

  useEffect(() => {
    if (reduceMotion || from.current === target) {
      from.current = target;
      setShown(target);
      return;
    }

    const start = performance.now();
    const origin = from.current;
    const distance = target - origin;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setShown(origin + distance * easeOut(progress));
      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
      } else {
        from.current = target;
      }
    };

    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      from.current = target;
    };
  }, [target, duration, reduceMotion]);

  // Tabular figures, so the digits do not jitter sideways while counting.
  return (
    <span className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {formatMoney(shown)}
    </span>
  );
}
