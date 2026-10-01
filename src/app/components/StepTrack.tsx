import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

// The horizontal progress track: five nodes on one line, filling left to right
// as each stage completes. Both waits use it — planning a trip and booking it —
// so the two screens cannot drift apart again. They had, by two pixels and a
// line colour, which is exactly the kind of difference nobody edits twice.

export interface Step {
  id: number;
  label: string;
  Icon: LucideIcon;
}

interface StepTrackProps {
  steps: Step[];
  /** The stage under way. Anything below it is done, anything above is waiting. */
  currentStep: number;
  /** A failed run holds its position rather than pulsing as if still working. */
  stalled?: boolean;
  className?: string;
}

export function StepTrack({ steps, currentStep, stalled = false, className = "" }: StepTrackProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`w-full p-[20px] ${className}`}>
      <div className="flex items-start w-full">
        {steps.map((step, index) => {
          const isComplete = currentStep > step.id;
          const isActive = currentStep === step.id && !stalled;

          return (
            <div key={step.id} className="flex-1 min-w-0 flex flex-col items-center relative">
              {/* Connector back to the previous node. Drawn behind the circles
                  and coloured by whether that leg is done. */}
              {index > 0 && (
                <div className="absolute top-[16px] right-1/2 left-[-50%] h-[4px] -z-0">
                  <div className="w-full h-full bg-white" />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: currentStep >= step.id ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ transformOrigin: "left" }}
                    className="w-full h-full bg-[#916AF5] -mt-[4px]"
                  />
                </div>
              )}

              <div
                className={`relative z-10 w-[36px] h-[36px] rounded-full flex items-center justify-center transition-colors ${
                  isComplete
                    ? "bg-[#916AF5]"
                    : isActive
                      ? "bg-[#EEE9FD] border-2 border-[#916AF5]"
                      : "bg-white border-2 border-[#E5E7EB]"
                }`}
              >
                {isComplete ? (
                  <Check className="w-[18px] h-[18px] text-white" strokeWidth={1.75} />
                ) : isActive ? (
                  // A single dot breathing in place — quieter than a spinner,
                  // and it reads as a pulse rather than waiting.
                  <motion.span
                    className="w-[10px] h-[10px] rounded-full bg-[#916AF5]"
                    animate={
                      reduceMotion ? undefined : { scale: [1, 1.55, 1], opacity: [0.85, 1, 0.85] }
                    }
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                ) : (
                  <step.Icon className="w-[18px] h-[18px] text-[#9095a1]" strokeWidth={1.75} />
                )}
              </div>

              <p
                className={`mt-3 px-1 text-[12px] leading-tight text-center m-0 transition-colors ${
                  isComplete || isActive ? "text-[#4a5565] font-medium" : "text-[#9095a1]"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
