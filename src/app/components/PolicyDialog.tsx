import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { POLICY } from "../data/travelPolicy";

interface PolicyDialogProps {
  open: boolean;
  onClose: () => void;
}

export function PolicyDialog({ open, onClose }: PolicyDialogProps) {
  const reduceMotion = useReducedMotion();

  // Escape closes it, and the page behind does not scroll while it is open —
  // a long policy over a long page otherwise scrolls whichever one the pointer
  // happens to be over.
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* The page dims and softens behind it, so the policy is plainly a
              layer over the trip rather than a new place. */}
          <div
            className="absolute inset-0 bg-[#0a0a0a]/45 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Travel and expense policy"
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full sm:max-w-[640px] max-h-[86vh] sm:max-h-[80vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.28)] flex flex-col overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-[#f0f0f3]">
              <div className="min-w-0">
                <h2 className="text-[17px] font-semibold text-[#1f2933] m-0">
                  Travel &amp; Expense Policy
                </h2>
                <p className="text-[12px] text-[#9095a1] m-0 mt-0.5">
                  {POLICY.version} · {POLICY.effective}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close policy"
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[#6a7282] hover:bg-[#f5f7fa] hover:text-[#1f2933] transition-colors"
              >
                <X className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5">
              {POLICY.sections.map((section) => (
                <section key={section.number} className="mb-6 last:mb-0">
                  <h3 className="flex items-baseline gap-2 text-[13px] font-semibold text-[#1f2933] m-0 mb-2.5">
                    <span className="text-[#916AF5]">{section.number}</span>
                    {section.title}
                  </h3>

                  {section.clauses.map((clause) => (
                    <div key={clause.ref} className="mb-3 last:mb-0">
                      <p className="flex gap-2.5 text-[13px] leading-[19px] text-[#4a5565] m-0">
                        <span className="flex-shrink-0 font-medium text-[#9095a1] tabular-nums">
                          {clause.ref}
                        </span>
                        <span>{clause.text}</span>
                      </p>

                      {clause.figures && (
                        <div className="mt-2 ml-[34px] rounded-lg border border-[#f0f0f3] bg-[#fafafb] px-3 py-2">
                          {clause.figures.map((figure) => (
                            <div
                              key={figure.label}
                              className="flex items-baseline justify-between gap-4 py-[3px]"
                            >
                              <span className="text-[12px] text-[#6a7282]">{figure.label}</span>
                              <span className="text-[12px] font-medium text-[#1f2933] tabular-nums">
                                {figure.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              ))}
            </div>

            <div className="px-6 py-3.5 border-t border-[#f0f0f3] bg-[#fafafb]">
              <p className="text-[12px] text-[#9095a1] m-0">
                Worktrip Autopilot plans against this policy and flags anything that
                strains it before you book.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
