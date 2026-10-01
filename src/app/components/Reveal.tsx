import { useEffect, useRef, useState } from "react";

// Content below the fold arrives as you reach it rather than sitting there
// pre-loaded. Plain IntersectionObserver and a CSS transition — this runs on
// scroll, where a JS-driven animation would be the wrong tool.
//
// It fires once. Re-animating on every pass up and down the page draws
// attention to the animation instead of the content.

interface RevealProps {
  children: React.ReactNode;
  /** Milliseconds behind its siblings, for staggering a row. */
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No observer (older browser, test environment) means show it, never hide.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 400ms ease-out, transform 400ms ease-out",
        transitionDelay: `${shown ? delay : 0}ms`,
      }}
    >
      {children}
    </div>
  );
}
