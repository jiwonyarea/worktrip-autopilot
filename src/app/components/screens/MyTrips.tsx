import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import bgImage from "figma:asset/68491a71f021c38c1c7368d77b05b5434580c49f.png";
import { DemoTrip, getDemoCatalog } from "../../utils/tripApi";
import { TripSummaryCard } from "../TripSummaryCard";
import { Typewriter } from "../Typewriter";
import { Reveal } from "../Reveal";

// Every trip the organiser has, rather than the two the landing page has room
// for. Same card, same actions — this screen is the list growing up, not a
// second way of showing a trip.

/** Whole days from today. Negative once the date has passed. */
function daysUntil(iso?: string | null): number | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  const target = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

interface MyTripsProps {
  onOpenTrip?: (tripId: string) => void;
  onOpenTripExpenses?: (tripId: string) => void;
  onPlanTrip?: () => void;
}

export function MyTrips({ onOpenTrip, onOpenTripExpenses, onPlanTrip }: MyTripsProps) {
  const [trips, setTrips] = useState<DemoTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    getDemoCatalog()
      .then((catalog) => {
        if (!cancelled) setTrips(catalog.trips);
      })
      .catch(() => {
        // A list that cannot load is an empty list with a way forward, not an
        // error the organiser can do anything about.
        if (!cancelled) setTrips([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Soonest first, with finished trips after the ones still ahead.
  const sorted = [...trips].sort((a, b) => {
    const aDone = (daysUntil(a.end_date) ?? 0) < 0;
    const bDone = (daysUntil(b.end_date) ?? 0) < 0;
    if (aDone !== bDone) return aDone ? 1 : -1;
    return (a.start_date ?? "").localeCompare(b.start_date ?? "");
  });

  const upcoming = sorted.filter((t) => (daysUntil(t.end_date) ?? 0) >= 0).length;
  // A finished trip is only still open because its receipts are not in, so
  // that is the line worth leading with when there is one.
  const awaitingReceipts = sorted.length - upcoming;

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
              My trips
            </h1>
            {!loading && (
              <Typewriter
                className="block text-[14px] font-normal text-[#4a5565] mt-1"
                text={
                  trips.length === 0
                    ? "No trips yet — describe one and Autopilot will plan it"
                    : awaitingReceipts > 0
                      ? `${awaitingReceipts} trip${awaitingReceipts === 1 ? " is" : "s are"} waiting for your receipts`
                      : `${trips.length} trip${trips.length === 1 ? "" : "s"}, ${upcoming} still ahead of you`
                }
              />
            )}
          </div>
        </div>

        {/* Nothing while the list loads: it arrives in well under a second and
            a placeholder only draws the eye to a wait not worth announcing. */}
        {!loading && trips.length === 0 && (
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm px-6 py-8 text-center">
            <p className="text-[14px] text-[#4a5565] m-0 mb-4">
              Nothing planned yet. Describe a trip in a sentence and the agent will
              search real flights and hotels against your policy.
            </p>
            <button
              onClick={onPlanTrip}
              className="h-11 px-6 rounded-xl bg-[#916af5] hover:bg-[#7c5dd4] text-white text-[15px] font-semibold transition-colors"
            >
              Plan a trip
            </button>
          </div>
        )}

        <div className="flex flex-col gap-[14px]">
          {sorted.map((trip, index) => {
            const daysAway = daysUntil(trip.start_date);
            const hasEnded = (daysUntil(trip.end_date) ?? 0) < 0;

            return (
              <Reveal key={trip.trip_id} delay={index * 100}>
                <TripSummaryCard
                  className="h-[90px]"
                  name={trip.label}
                  destination={trip.destination}
                  startDate={trip.start_date}
                  endDate={trip.end_date}
                  travelers={trip.travelers}
                  purpose={trip.purpose}
                  chip={
                    hasEnded ? (
                      <span className="h-[22px] px-[8px] rounded-full bg-white border border-[#D8D3E5] text-[#4a5565] text-[11px] font-medium flex items-center justify-center flex-shrink-0">
                        Completed
                      </span>
                    ) : daysAway !== null && daysAway >= 0 ? (
                      <span className="min-w-[40px] h-[22px] px-[8px] rounded-full bg-[#EEE9FD] border border-[#916AF5] text-[#916AF5] text-[11px] font-medium flex items-center justify-center flex-shrink-0">
                        D-{daysAway}
                      </span>
                    ) : undefined
                  }
                  actions={
                    <>
                      <button
                        onClick={() => onOpenTrip?.(trip.trip_id)}
                        className="h-8 px-3 rounded-lg border border-[rgba(0,0,0,0.1)] bg-[#f5f7fa] text-[14px] font-medium text-[#1f2933] hover:bg-gray-100 transition-colors"
                      >
                        View
                      </button>
                      {hasEnded ? (
                        <button
                          onClick={() => onOpenTripExpenses?.(trip.trip_id)}
                          className="h-8 px-3 rounded-lg bg-[#916AF5] text-white text-[14px] font-medium hover:bg-[#7c5dd4] transition-colors whitespace-nowrap"
                        >
                          Upload Receipt
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenTrip?.(trip.trip_id)}
                          className="h-8 px-3 rounded-lg border border-[rgba(0,0,0,0.1)] bg-[#f5f7fa] text-[14px] font-medium text-[#1f2933] hover:bg-gray-100 transition-colors"
                        >
                          Edit
                        </button>
                      )}
                    </>
                  }
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
