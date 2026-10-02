import { useEffect, useState } from "react";
import { HelpCircle, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { formatMoney, nightsBetween } from "../utils/itinerary";
import { AnimatedMoney } from "./AnimatedMoney";
import { StatusIcon } from "./StatusIcon";

// The trip's money and policy standing. Shared by the itinerary edit screen and
// the booked trip overview so approving a trip and looking at it afterwards
// show the same figure — they used to compute it two different ways.

// Three states rather than a boolean: editing a flight or hotel can move a trip
// from compliant to needing a look without putting it out of policy.
//
// `status` is the word in the dial, `line` the sentence under the figure. Each
// state is one flat colour — a gradient read as decoration and implied the
// colour meant something along the arc's length. It does not; only where it
// stops does.
const COMPLIANCE = {
  compliant: {
    status: "Compliant",
    line: "All categories in policy",
    text: "text-[#1F9D55]",
    // A short sweep rather than a wash: the darker end lands where the arc
    // stops, so the eye is drawn to the figure the dial is reporting.
    gradient: ["#50C743", "#1FA59A"],
    icon: { color: "#1F9D55", kind: "check" } as const,
    flag: "pass",
  },
  review_required: {
    status: "Needs review",
    line: "Your trip requires a review",
    text: "text-[#b45309]",
    gradient: ["#FFBF51", "#FFA466"],
    icon: null,
    flag: "review",
  },
  out_of_policy: {
    status: "Out of policy",
    line: "Out of compliance with company policy",
    text: "text-[#D82A2A]",
    gradient: ["#FC7974", "#F2553D"],
    icon: null,
    flag: "over",
  },
} as const;

// How a single booked line is marked. Amber draws the eye without claiming the
// trip is blocked; red says a stated limit was actually exceeded. The grounds
// stay pale — these sit beside a row of plain text, not on their own.
const FLAGS = {
  pass: { label: "Pass", chip: "bg-[#e6f6ec] text-[#167C3C]", text: "text-[#4a5565]", amount: "text-[#1f2933]" },
  review: { label: "Review", chip: "bg-[#fff3de] text-[#b45309]", text: "text-[#b45309]", amount: "text-[#b45309]" },
  over: { label: "Over", chip: "bg-[#ffe6e6] text-[#c02626]", text: "text-[#c02626]", amount: "text-[#c02626]" },
} as const;

type FlagName = keyof typeof FLAGS;

// Dev only. Written the way a real travel policy reads — the clause, the figure
// it is measured against, and what has to happen next — so the hover panel can
// be judged on realistic content rather than placeholder text.
const DEV_FLAGS: Record<string, { flights?: LineState; hotel?: LineState }> = {
  compliant: {
    flights: { flag: "pass" },
    hotel: { flag: "pass" },
  },
  review_required: {
    flights: { flag: "pass" },
    hotel: {
      flag: "review",
      detail: {
        note:
          "$215/night is $35 over the $180 limit, but still within the 20% " +
          "manager approval range.",
      },
    },
  },
  out_of_policy: {
    flights: {
      flag: "over",
      detail: {
        note:
          "Premium economy on a 3-hour flight puts the party $394 over the " +
          "$1,400 cap, and economy was available on the same routing.",
      },
    },
    hotel: {
      flag: "over",
      detail: {
        note:
          "$215/night is 19% over the $180 limit, and this quarter's lodging " +
          "exception has already been used.",
      },
    },
  },
};

// A half-circle drawn left to right. The sweep is how much of the budget the
// booked total takes, so a full arc means the trip spends all of it — the
// colour says whether that is allowed.
const ARC = { width: 200, height: 104, cx: 100, cy: 92, r: 76, stroke: 10 };
const ARC_PATH = `M ${ARC.cx - ARC.r} ${ARC.cy} A ${ARC.r} ${ARC.r} 0 0 1 ${ARC.cx + ARC.r} ${ARC.cy}`;
const ARC_LENGTH = Math.PI * ARC.r;

// Only the booked lines carry a mark — flights and the hotel are charged, the
// per-diems are allowances nobody has drawn on yet, so a verdict there would be
// about money that has not been spent.
function LineFlag({ line }: { line?: LineState }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  if (!line) return null;

  const f = FLAGS[line.flag];
  const detail = line.detail;

  return (
    <span
      className="relative inline-flex items-center gap-1.5"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {line.flag !== "pass" && detail && (
        <button
          type="button"
          aria-label={`Agent note: ${detail.note}`}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          className="inline-flex rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#916AF5]/50"
        >
          <HelpCircle className="w-[14px] h-[14px] flex-shrink-0 opacity-80" strokeWidth={2} />
        </button>
      )}

      <span className={`rounded-full px-2 py-[2px] text-[11px] font-medium ${f.chip}`}>
        {f.label}
      </span>

      {open && detail && (
        <span
          role="tooltip"
          className="absolute bottom-full left-0 z-30 mb-2 w-[254px] rounded-xl border border-[#e5e7eb] bg-white p-3 text-left shadow-[0px_12px_24px_-8px_rgba(16,24,40,0.18)]"
        >
          <span className="flex items-center gap-1.5">
            <motion.span
              className="inline-flex"
              animate={
                reduceMotion ? undefined : { scale: [1, 1.14, 1], rotate: [0, 8, 0, -8, 0] }
              }
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles
                className="w-[13px] h-[13px] text-[#916AF5] fill-[#916AF5]"
                aria-hidden
              />
            </motion.span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#916AF5]">
              Agent Note
            </span>
          </span>

          <span className="mt-1.5 block text-[12.5px] leading-[17px] text-[#1f2933]">
            {detail.note}
          </span>

        </span>
      )}
    </span>
  );
}

interface TripTotalsCardProps {
  trip: any;
  itinerary: any;
  /** Filed against each per-diem. Zero until the trip actually happens. */
  groundSpent?: number;
  foodSpent?: number;
  className?: string;
}

export function TripTotalsCard({
  trip,
  itinerary,
  groundSpent = 0,
  foodSpent = 0,
  className = "",
}: TripTotalsCardProps) {
  const details = itinerary?.details ?? {};
  const nights = nightsBetween(trip?.start_date, trip?.end_date);

  // Flights and hotel are booked and charged. Ground transport and food are
  // per-diem allowances, so they are shown as drawn against budget rather than
  // folded into the total being approved.
  const bookableTotal = (details.flight_cost ?? 0) + (details.hotel_cost ?? 0);
  const groundBudget = details.ground_transport_cost ?? 0;
  const foodBudget = details.food_cost ?? 0;

  const derivedState: keyof typeof COMPLIANCE =
    itinerary?.compliance && itinerary.compliance in COMPLIANCE
      ? itinerary.compliance
      : itinerary?.policy_compliant === false
        ? "out_of_policy"
        : "compliant";
  // Dev-only: lets the three states be looked at without a trip in each one.
  const [devState, setDevState] = useState<keyof typeof COMPLIANCE | null>(null);
  const state = devState ?? derivedState;
  const compliance = COMPLIANCE[state];
  // Per state, so two cards on a page share one definition rather than
  // colliding on a single id.
  const gradientId = `trip-arc-${state}`;

  // The agent marks each booked line itself. Without that we only mark lines
  // when the whole trip is compliant — nothing else in the data says which
  // line is at fault, and guessing would invent a finding.
  const agentFlags = itinerary?.policy_flags;
  const detailFor = (which: "flights" | "hotel"): FlagDetail | undefined => {
    const found = (agentFlags?.details ?? []).find((d: any) => d.line === which);
    return found ? { note: found.note } : undefined;
  };

  const flags: { flights?: LineState; hotel?: LineState } = devState
    ? DEV_FLAGS[devState]
    : agentFlags
      ? {
          flights: { flag: agentFlags.flights, detail: detailFor("flights") },
          hotel: { flag: agentFlags.hotel, detail: detailFor("hotel") },
        }
      : state === "compliant"
        ? { flights: { flag: "pass" }, hotel: { flag: "pass" } }
        : {};

  const pct = Math.min(
    trip?.total_budget ? (bookableTotal / trip.total_budget) * 100 : 100,
    100,
  );

  // The arc draws itself on arrival rather than appearing already full. After
  // that first sweep, changes to the total move it like any other edit.
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    // Two frames would be enough to make the transition run, but the card
    // itself fades in behind a scroll reveal — the sweep was finishing while
    // it was still invisible. Starting a beat later means the arc is drawn
    // where it can actually be watched.
    const timer = setTimeout(() => setFilled(true), 420);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`bg-[rgb(255,255,255)] backdrop-blur-sm border border-[#e5e7eb] rounded-xl p-6 ${className}`}
    >
      <h3 className="text-base font-semibold text-[#1f2933] mb-4">
        Trip total &amp; Compliance
      </h3>

      {/* The dial, then the figure it is measuring, then the verdict. */}
      <div className="relative mx-auto" style={{ width: ARC.width, height: ARC.height }}>
        <svg
          viewBox={`0 0 ${ARC.width} ${ARC.height}`}
          className="w-full h-full"
          role="img"
          aria-label={`${compliance.status}. ${compliance.line}.`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={compliance.gradient[0]} />
              <stop offset="100%" stopColor={compliance.gradient[1]} />
            </linearGradient>
          </defs>
          <path
            d={ARC_PATH}
            fill="none"
            stroke="#eceef2"
            strokeWidth={ARC.stroke}
            strokeLinecap="round"
          />
          <path
            d={ARC_PATH}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={ARC.stroke}
            strokeLinecap="round"
            strokeDasharray={ARC_LENGTH}
            // Drawn from empty on arrival, so the arc and the counting figure
            // below it tell the same story at the same pace.
            strokeDashoffset={filled ? ARC_LENGTH * (1 - pct / 100) : ARC_LENGTH}
            style={{
              transition: "stroke-dashoffset 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </svg>

        {/* The figure the dial is measuring, and the dial's verdict on it,
            both inside its mouth — the number and what it means read as one
            answer rather than two. */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-[5px]">
          <AnimatedMoney
            value={bookableTotal}
            className="block text-[26px] font-semibold leading-none text-[#0a0a0a]"
          />
          <span
            className={`mt-1.5 flex items-center gap-1 text-[13px] font-semibold leading-none ${compliance.text}`}
            title={itinerary?.policy_note}
          >
            {compliance.icon && (
              <StatusIcon color={compliance.icon.color} size={15} />
            )}
            {compliance.status}
          </span>
        </div>
      </div>

      <div className="mb-5" />

      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className={`flex items-center gap-1 ${flags.flights ? FLAGS[flags.flights.flag].text : "text-[#4a5565]"}`}>
            Flights
            <LineFlag line={flags.flights} />
          </span>
          <AnimatedMoney
            value={details.flight_cost}
            className={`font-medium ${flags.flights ? FLAGS[flags.flights.flag].amount : "text-[#1f2933]"}`}
          />
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className={`flex items-center gap-1 ${flags.hotel ? FLAGS[flags.hotel.flag].text : "text-[#4a5565]"}`}>
            Hotels ({nights} night{nights === 1 ? "" : "s"})
            <LineFlag line={flags.hotel} />
          </span>
          <AnimatedMoney
            value={details.hotel_cost}
            className={`font-medium ${flags.hotel ? FLAGS[flags.hotel.flag].amount : "text-[#1f2933]"}`}
          />
        </div>
        {/* Drawn / allowed, with the allowance muted — nothing is spent against
            a per-diem until receipts come in. */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#4a5565]">Ground Transportation</span>
          <span className="font-medium text-[#1f2933]">
            {formatMoney(groundSpent)}{" "}
            <span className="text-[#9095a1]">/ {formatMoney(groundBudget)}</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#4a5565]">Food</span>
          <span className="font-medium text-[#1f2933]">
            {formatMoney(foodSpent)}{" "}
            <span className="text-[#9095a1]">/ {formatMoney(foodBudget)}</span>
          </span>
        </div>
      </div>

      {/* Dev only — compiled out of production builds. No trip in this demo is
          ever in two of these states, so they could not be looked at any other
          way. */}
      {import.meta.env.DEV && (
        <div className="mt-5 pt-4 border-t border-dashed border-[#e5e7eb]">
          <p className="text-[11px] uppercase tracking-[0.08em] text-[#9095a1] m-0 mb-2">
            Dev · preview state
          </p>
          <div className="flex flex-wrap gap-1.5">
            {([
              [null, "Real"],
              ["compliant", "Compliant"],
              ["review_required", "Review"],
              ["out_of_policy", "Out of policy"],
            ] as const).map(([value, label]) => (
              <button
                key={label}
                onClick={() => setDevState(value)}
                className={`rounded-full border px-2.5 py-[3px] text-[11px] transition-colors ${
                  devState === value
                    ? "border-[#916AF5] bg-[#916AF5] text-white"
                    : "border-[#D8D3E5] bg-white text-[#4a5565] hover:bg-[#F2F1F8]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
