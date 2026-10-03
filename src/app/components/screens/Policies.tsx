import { Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import bgImage from "figma:asset/68491a71f021c38c1c7368d77b05b5434580c49f.png";
import { POLICY } from "../../data/travelPolicy";
import { Typewriter } from "../Typewriter";
import { Reveal } from "../Reveal";

// The same policy the dialog shows over a trip, given a page of its own. Both
// read one file, so the rule quoted in an Agent Note and the rule printed here
// cannot disagree.

export function Policies() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-no-repeat pb-[120px]"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="relative z-10 max-w-[1088px] mx-auto px-4 sm:px-6 pt-[60px]">
        <div className="flex items-start gap-3 mb-6">
          <motion.div
            animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], rotate: [0, 8, 0, -8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex-shrink-0"
          >
            <Sparkles className="w-10 h-10 text-[#916AF5] fill-[#916AF5]" aria-hidden />
          </motion.div>
          <div>
            <h1 className="font-display font-medium text-[20px] leading-tight text-[#0a0a0a] m-0">
              Travel &amp; Expense Policy
            </h1>
            <Typewriter
              className="block text-[14px] font-normal text-[#4a5565] mt-1"
              text="Autopilot plans against these rules and flags anything that strains them"
            />
          </div>
        </div>

        {/* Version, kept where a reader looks for it before quoting a clause. */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.06)] px-[18px] py-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-[14px] text-[#4a5565] m-0">
            Applies to every trip planned in Worktrip Autopilot.
          </p>
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#9095a1] m-0">
            {POLICY.version} · {POLICY.effective}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {POLICY.sections.map((section, index) => (
            <Reveal key={section.number} delay={index * 60}>
              <section className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.06)] p-[18px] sm:p-6">
                <h2 className="flex items-baseline gap-2 text-[16px] font-semibold text-[#1f2933] m-0 mb-4">
                  <span className="text-[#916AF5]">{section.number}</span>
                  {section.title}
                </h2>

                <div className="flex flex-col gap-4">
                  {section.clauses.map((clause) => (
                    <div key={clause.ref}>
                      <p className="flex gap-3 text-[14px] leading-relaxed text-[#4a5565] m-0">
                        <span className="flex-shrink-0 font-medium text-[#9095a1] tabular-nums">
                          {clause.ref}
                        </span>
                        <span>{clause.text}</span>
                      </p>

                      {clause.figures && (
                        <div className="mt-3 ml-0 sm:ml-[38px] rounded-xl border border-[rgba(179,173,196,0.28)] bg-[rgba(179,173,196,0.11)] px-4 py-3">
                          {clause.figures.map((figure) => (
                            <div
                              key={figure.label}
                              className="flex items-baseline justify-between gap-4 py-1"
                            >
                              <span className="text-[13px] text-[#4a5565]">{figure.label}</span>
                              <span className="text-[13px] font-medium text-[#1f2933] tabular-nums whitespace-nowrap">
                                {figure.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>

        <p className="text-[13px] text-[#6a7282] mt-6 m-0">
          Questions about a clause go to Finance. An exception is approved before
          booking, never after.
        </p>
      </div>
    </div>
  );
}
