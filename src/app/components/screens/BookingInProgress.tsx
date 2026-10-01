import { Typewriter } from "../Typewriter";
import { StepTrack } from "../StepTrack";
import { Check, Sparkles, AlertCircle, Plane, Ticket, Hotel, ShieldCheck, MailCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Trip, getTrip, confirmBooking } from "../../utils/tripApi";
import { pickItinerary } from "../../utils/itinerary";
import { TripSummaryCard } from "../TripSummaryCard";
import { Button } from "../ui/button";

// The moment after "Confirm & Complete Booking". Deliberately the same track as
// the planning screen so the two waits read as one system doing one kind of
// work, and the last thing before the trip exists gets the same care.
//
// No reservation is really placed — the only real call here is persisting the
// choice, which is why the screen says so rather than implying tickets exist.

interface BookingInProgressProps {
  tripId: string | null;
  selectedItineraryId?: string | null;
  onComplete: () => void;
  onBack?: () => void;
}

const bookingSteps = [
  { id: 1, label: "Holding your seats", Icon: Plane },
  { id: 2, label: "Issuing tickets", Icon: Ticket },
  { id: 3, label: "Confirming hotel", Icon: Hotel },
  { id: 4, label: "Recording policy approval", Icon: ShieldCheck },
  { id: 5, label: "Sending confirmations", Icon: MailCheck },
];

/** Each step dwells this long before the track moves on. */
const STEP_MS = 850;

export function BookingInProgress({
  tripId,
  selectedItineraryId,
  onComplete,
  onBack,
}: BookingInProgressProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const reduceMotion = useReducedMotion();

  // onComplete changes identity on every parent render; a ref keeps the
  // finishing effect from re-running and firing the handover twice.
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  // The one real call. It runs alongside the track rather than gating it, so a
  // fast response still gets the full sequence and a slow one still finishes
  // truthfully — the track cannot reach "done" before this resolves.
  //
  // The trip is loaded first because the itinerary id is not always handed
  // down: arriving here straight from a resumed trip leaves it null, and the
  // same rule the other screens use resolves which option was chosen.
  useEffect(() => {
    if (!tripId) {
      setError("No trip to book.");
      return;
    }

    let cancelled = false;
    setError(null);
    setConfirmed(false);
    setCurrentStep(1);

    (async () => {
      try {
        const loaded = await getTrip(tripId);
        if (cancelled) return;
        setTrip(loaded);

        const itineraryId = selectedItineraryId ?? pickItinerary(loaded)?.id;
        if (!itineraryId) throw new Error("No itinerary selected for this trip");

        await confirmBooking(tripId, itineraryId);
        if (!cancelled) setConfirmed(true);
      } catch (err) {
        console.error("Booking failed:", err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not confirm this trip");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tripId, selectedItineraryId, attempt]);

  // Advance the track one step at a time, stopping at the last step until the
  // booking call has actually come back.
  useEffect(() => {
    if (error) return;
    if (currentStep >= bookingSteps.length) return;

    const timer = setTimeout(() => setCurrentStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(timer);
  }, [currentStep, error]);

  // Both finished: tick the final node, let it land, then hand over.
  useEffect(() => {
    if (error) return;
    if (!confirmed || currentStep < bookingSteps.length) return;

    const timers = [
      setTimeout(() => setCurrentStep(bookingSteps.length + 1), 300),
      setTimeout(() => completeRef.current(), 1000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [confirmed, currentStep, error]);

  const done = currentStep > bookingSteps.length;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
      <div className="w-full max-w-[700px] px-4 sm:px-0">
        <div className="text-center mb-[50px]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center mb-6"
          >
            {error ? (
              <AlertCircle className="w-12 h-12 text-[#FF4D4D]" />
            ) : done ? (
              <motion.div
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className="w-12 h-12 rounded-full bg-[#916AF5] flex items-center justify-center"
              >
                <Check className="w-7 h-7 text-white" strokeWidth={2} />
              </motion.div>
            ) : (
              <motion.div
                animate={
                  reduceMotion
                    ? undefined
                    : { scale: [1, 1.12, 1], rotate: [0, 8, 0, -8, 0] }
                }
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-12 h-12 text-[#916AF5] fill-[#916AF5]" />
              </motion.div>
            )}
          </motion.div>

          <h1 className="font-display font-medium text-[28px] sm:text-[36px] leading-tight text-[#0A0A0A] m-0">
            {error
              ? "Booking failed"
              : done
                ? "Your trip is booked"
                : "Autopilot is booking your trip"}
          </h1>
          {/* An error is not the agent talking — it appears at once. */}
          {error ? (
            <p className="mt-3 text-[14px] font-normal text-[#4A4A4A] m-0">{error}</p>
          ) : (
            <Typewriter
              className="block mt-3 text-[14px] font-normal text-[#4A4A4A]"
              text={
                done
                  ? "Confirmations are on their way to everyone travelling."
                  : "Confirming with each provider — this only takes a moment..."
              }
            />
          )}
        </div>

        {error && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-[#FF4D4D]/20 shadow-lg p-8 mb-6">
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={() => setAttempt((a) => a + 1)}
                className="bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white rounded-full px-10 py-6"
              >
                Try again
              </Button>
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="rounded-full px-8 py-6 border-[#D8D3E5]"
                >
                  Back to itinerary
                </Button>
              )}
            </div>
          </div>
        )}

        <StepTrack steps={bookingSteps} currentStep={currentStep} stalled={!!error} />

        {/* Say plainly that nothing was charged — a demo that implies real
            tickets is a worse demo. */}
        {!error && (
          <p className="text-center text-[13px] text-[#9095a1] m-0 mt-1">
            Simulated booking — no reservation is placed and no card is charged.
          </p>
        )}

        <p className="sr-only" aria-live="polite">
          {error
            ? `Booking failed: ${error}`
            : done
              ? "Booking complete"
              : `Step ${currentStep} of ${bookingSteps.length}: ${
                  bookingSteps[Math.max(currentStep - 1, 0)]?.label ?? ""
                }`}
        </p>

        {trip && (
          <div className="w-full max-w-[700px] mx-auto mt-6">
            <h2 className="text-[14px] font-semibold text-[#1f2933] m-0 mb-[14px]">
              Booking
            </h2>
            <TripSummaryCard
              name={trip.trip_name || trip.inferred_trip_name || "Work Trip"}
              destination={trip.destination || trip.inferred_destination}
              startDate={trip.start_date || trip.inferred_dates?.start_date}
              endDate={trip.end_date || trip.inferred_dates?.end_date}
              travelers={trip.travelers?.length || 1}
              purpose={trip.purpose}
            />
          </div>
        )}
      </div>
    </div>
  );
}
