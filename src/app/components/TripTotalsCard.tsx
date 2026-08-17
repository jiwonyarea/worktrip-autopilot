import { formatMoney, nightsBetween } from "../utils/itinerary";

// The trip's money and policy standing. Shared by the itinerary edit screen and
// the booked trip overview so approving a trip and looking at it afterwards
// show the same figure — they used to compute it two different ways.

// Three states rather than a boolean: editing a flight or hotel can move a trip
// from compliant to needing a look without putting it out of policy.
const COMPLIANCE = {
  compliant: {
    line: "Your trip is fully compliant with policy",
    chip: "In policy",
    text: "text-[#1F9D55]",
    chipClass: "bg-[#d1f4e0] text-[#52c93f]",
    bar: "bg-gradient-to-r from-[#52c93f] to-[#18a0a6]",
  },
  review_required: {
    line: "Your trip requires a review",
    chip: "Review",
    text: "text-[#b45309]",
    chipClass: "bg-[#ffe9cc] text-[#b45309]",
    bar: "bg-gradient-to-r from-[#f5a623] to-[#f5a623]",
  },
  out_of_policy: {
    line: "Out of compliance with company policy",
    chip: "Action needed",
    text: "text-[#c02626]",
    chipClass: "bg-[#ffe0e0] text-[#c02626]",
    bar: "bg-gradient-to-r from-[#f5a623] to-[#e5484d]",
  },
} as const;

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

  return (
    <div
      className={`bg-[rgb(255,255,255)] backdrop-blur-sm border border-[#e5e7eb] rounded-xl p-6 ${className}`}
    >
      <h3 className="text-base font-semibold text-[#1f2933] mb-4">
        Trip total &amp; Compliance
      </h3>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-semibold text-[#0a0a0a]">
          {formatMoney(bookableTotal)}
        </span>
        {trip?.total_budget ? (
          <span className="text-sm text-[#6a7282]">
            of {formatMoney(trip.total_budget)}
          </span>
        ) : null}
      </div>

      <div className="w-full h-2.5 bg-[rgba(3,2,19,0.2)] rounded-full mb-2 overflow-hidden">
        <div
          className={`h-full ${compliance.bar}`}
          style={{
            width: `${Math.min(
              trip?.total_budget ? (bookableTotal / trip.total_budget) * 100 : 100,
              100,
            )}%`,
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-3 mb-4">
        <span className={`text-xs ${compliance.text}`} title={itinerary?.policy_note}>
          {compliance.line}
        </span>
        <div
          className={`${compliance.chipClass} rounded-full px-3 py-1 text-xs font-medium flex-shrink-0`}
        >
          {compliance.chip}
        </div>
      </div>

      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#4a5565]">Flights</span>
          <span className="font-medium text-[#1f2933]">
            {formatMoney(details.flight_cost)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#4a5565]">
            Hotels ({nights} night{nights === 1 ? "" : "s"})
          </span>
          <span className="font-medium text-[#1f2933]">
            {formatMoney(details.hotel_cost)}
          </span>
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
