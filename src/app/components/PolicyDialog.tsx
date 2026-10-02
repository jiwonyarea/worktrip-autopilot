import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

// The policy the agent keeps citing. Every figure here is one the product uses
// somewhere else — the $180 Tier 2 cap in the hotel's Agent Note, the 20%
// manager band, the single quarterly exception, economy under six hours. A
// policy screen that disagreed with the notes beside it would be worse than
// none, so this is the one place those numbers are written down.

const POLICY = {
  version: "v4.2",
  effective: "Effective 1 January 2027",
  sections: [
    {
      number: "3",
      title: "Air travel",
      clauses: [
        {
          ref: "3.1",
          text: "Economy on flights under six hours. Premium economy is allowed beyond six hours; business class needs VP sign-off before booking.",
        },
        {
          ref: "3.2",
          text: "Book at least 14 days ahead. Inside 7 days a manager approves the fare difference.",
        },
        {
          ref: "3.3",
          text: "Mainline carriers only. Ultra-low-cost carriers are not reimbursable — their fares exclude the bag, the seat and the change a work trip needs.",
        },
      ],
    },
    {
      number: "4",
      title: "Lodging",
      clauses: [
        {
          ref: "4.1",
          text: "Rated hotels only, three star or above. Hostels, shared rooms and unrated properties are not bookable on company travel.",
        },
        {
          ref: "4.2",
          text: "Nightly caps before tax: Tier 1 $260, Tier 2 $180, Tier 3 $140. A manager may approve up to 20% over cap; beyond that it goes to Finance.",
          figures: [
            { label: "Tier 1 — NYC, SF, London", value: "$260 / night" },
            { label: "Tier 2 — Austin, Seattle, Chicago", value: "$180 / night" },
            { label: "Tier 3 — everywhere else", value: "$140 / night" },
          ],
        },
        {
          ref: "4.3",
          text: "Nobody is asked to share a room. Where a traveller offers to, the saving is theirs to keep as a meal credit.",
        },
      ],
    },
    {
      number: "5",
      title: "Per diems",
      clauses: [
        {
          ref: "5.1",
          text: "Allowances are drawn against, not paid out. Anything unspent stays with the company.",
          figures: [
            { label: "Meals", value: "$133 / day" },
            { label: "Ground transport", value: "$80 / day" },
            { label: "Receipt required above", value: "$25" },
          ],
        },
      ],
    },
    {
      number: "6",
      title: "Expenses",
      clauses: [
        {
          ref: "6.1",
          text: "File within 14 days of returning. Worktrip Autopilot files what it books; the rest is a photo of the receipt.",
        },
        {
          ref: "6.2",
          text: "Not reimbursable: minibar, in-flight wifi above $30, personal entertainment, companion travel, and fines of any kind.",
        },
      ],
    },
    {
      number: "7",
      title: "Exceptions",
      clauses: [
        {
          ref: "7.1",
          text: "One lodging exception per traveller per quarter, approved by a manager. A second needs written Finance approval with the reason recorded.",
        },
        {
          ref: "7.2",
          text: "Anything over a stated limit is never approved after the fact. Ask first.",
        },
      ],
    },
  ],
};

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

                      {"figures" in clause && clause.figures && (
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
