import { useEffect, useState } from "react";
import { formatMoney, nightsBetween } from "../utils/itinerary";
import { AnimatedMoney } from "./AnimatedMoney";

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
    stroke: "#3DC616",
  },
  review_required: {
    status: "Needs attention",
    line: "One or more items need a look",
    text: "text-[#b45309]",
    stroke: "#f5a623",
  },
  out_of_policy: {
    status: "Out of policy",
    line: "Over the company limit",
    text: "text-[#c02626]",
    stroke: "#c02626",
  },
} as const;

// A half-circle drawn left to right. The sweep is how much of the budget the
// booked total takes, so a full arc means the trip spends all of it — the
// colour says whether that is allowed.
const ARC = { width: 200, height: 104, cx: 100, cy: 92, r: 76, stroke: 14 };
const ARC_PATH = `M ${ARC.cx - ARC.r} ${ARC.cy} A ${ARC.r} ${ARC.r} 0 0 1 ${ARC.cx + ARC.r} ${ARC.cy}`;
const ARC_LENGTH = Math.PI * ARC.r;

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

  const state: keyof typeof COMPLIANCE =
    itinerary?.compliance && itinerary.compliance in COMPLIANCE
      ? itinerary.compliance
      : itinerary?.policy_compliant === false
        ? "out_of_policy"
        : "compliant";
  const compliance = COMPLIANCE[state];

  const pct = Math.min(
    trip?.total_budget ? (bookableTotal / trip.total_budget) * 100 : 100,
    100,
  );

  // The arc draws itself on arrival rather than appearing already full. After
  // that first sweep, changes to the total move it like any other edit.
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    // Two frames, not one: the first commits the empty arc to the DOM, the
    // second changes it. Flipping it inside a single frame lets the browser
    // collapse both into one paint, and the arc simply appears full.
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setFilled(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  return (
    <div
      className={`bg-[rgb(255,255,255)] backdrop-blur-sm border border-[#e5e7eb] rounded-xl p-6 ${className}`}
    >
      <h3 className="text-base font-semibold text-[#1f2933] mb-4">
        Trip total &amp; Compliance
      </h3>

      {/* The dial, then the figure it is measuring, then the verdict. */}
      <div className="relative mx-auto mb-1" style={{ width: ARC.width, height: ARC.height }}>
        <svg
          viewBox={`0 0 ${ARC.width} ${ARC.height}`}
          className="w-full h-full"
          role="img"
          aria-label={`${compliance.status}. ${compliance.line}.`}
        >
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
            stroke={compliance.stroke}
            strokeWidth={ARC.stroke}
            strokeLinecap="round"
            strokeDasharray={ARC_LENGTH}
            // Drawn from empty on arrival, so the arc and the counting figure
            // below it tell the same story at the same pace.
            strokeDashoffset={filled ? ARC_LENGTH * (1 - pct / 100) : ARC_LENGTH}
            style={{
              transition:
                "stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1), stroke 300ms ease",
            }}
          />
        </svg>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-[6px]">
          <span
            className={`px-4 text-center text-[16px] font-semibold leading-tight ${compliance.text}`}
            title={itinerary?.policy_note}
          >
            {compliance.status}
          </span>
        </div>
      </div>

      <div className="text-center mb-5">
        <AnimatedMoney
          value={bookableTotal}
          className="block text-3xl font-semibold text-[#0a0a0a]"
        />
        {trip?.total_budget ? (
          <span className="block text-sm text-[#6a7282] mt-0.5">
            of {formatMoney(trip.total_budget)}
          </span>
        ) : null}
        <p className={`text-sm m-0 mt-1.5 ${compliance.text}`}>{compliance.line}</p>
      </div>

      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#4a5565]">Flights</span>
          <AnimatedMoney value={details.flight_cost} className="font-medium text-[#1f2933]" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#4a5565]">
            Hotels ({nights} night{nights === 1 ? "" : "s"})
          </span>
          <AnimatedMoney value={details.hotel_cost} className="font-medium text-[#1f2933]" />
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
    </div>
  );
}
