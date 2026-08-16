import { Check, Loader2, Sparkles, AlertCircle, MessagesSquare, Plane, Hotel, ClipboardList, Layers } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Trip, getTrip, generateItineraries, searchInventory, InventorySummary } from "../../utils/tripApi";
import { TripSummaryCard } from "../TripSummaryCard";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface AgentWorkingSimpleProps {
  onComplete: () => void;
  tripData?: Trip | null;
}

// Icons are the same lucide set the itinerary screens use, all stroked at the
// same weight so the row reads as one family rather than mixed artwork.
const planningSteps = [
  { id: 1, label: "Collecting preferences", Icon: MessagesSquare },
  { id: 2, label: "Searching flights", Icon: Plane },
  { id: 3, label: "Finding hotels", Icon: Hotel },
  { id: 4, label: "Checking policy", Icon: ClipboardList },
  { id: 5, label: "Combining options", Icon: Layers },
];

export function AgentWorkingSimple({ onComplete, tripData }: AgentWorkingSimpleProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [trip, setTrip] = useState<Trip | null>(tripData || null);
  const [isLoading, setIsLoading] = useState(!tripData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  // What the search actually turned up, shown as it arrives.
  const [inventory, setInventory] = useState<InventorySummary | null>(null);
  // Motion loops are JS-driven, so the CSS reduced-motion rule cannot reach
  // them — they have to opt out here.
  const reduceMotion = useReducedMotion();

  // Fetch trip data on mount if not provided
  useEffect(() => {
    if (!tripData && trip?.id) {
      setIsLoading(true);
      getTrip(trip.id)
        .then(fetchedTrip => {
          setTrip(fetchedTrip);
        })
        .catch(error => {
          console.error("Failed to fetch trip:", error);
          setError("Failed to load trip data.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (tripData) {
      setTrip(tripData);
      setIsLoading(false);
    }
  }, [tripData, trip?.id]);

  // Generate itineraries when trip is loaded
  const handleGenerateItineraries = async () => {
    if (!trip?.id) {
      setError("No trip ID available.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setInventory(null);

    try {
      // Phase one: reading the trip is instant, so step 1 is already behind us.
      setCurrentStep(1);
      const { inventory: found } = await searchInventory(trip.id);
      setInventory(found);

      // Searching is done; the agent now has something to reason about.
      setCurrentStep(3);

      // Phase two. Step 5 stays active until this resolves, however long it
      // takes — the tracker must never claim to be finished before the work is.
      setCurrentStep(4);
      await generateItineraries(trip.id);
      setCurrentStep(planningSteps.length + 1);

      setTimeout(() => onComplete(), 400);
    } catch (err) {
      console.error("Itinerary generation failed:", err);
      setError(
        err instanceof Error ? err.message : "Could not build itineraries for this trip",
      );
      setRateLimited(Boolean((err as { rate_limited?: boolean })?.rate_limited));
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (trip?.id && !isGenerating && !error) {
      // Start generating itineraries
      handleGenerateItineraries();
    }
  }, [trip?.id]);

  // Each phase covers more than one displayed step, so nudge to the second
  // step of a phase after a moment. This never advances past what the API has
  // actually confirmed — the phase handlers own those transitions.
  useEffect(() => {
    if (!isGenerating) return;

    const timers: NodeJS.Timeout[] = [];
    if (currentStep === 1) {
      timers.push(setTimeout(() => setCurrentStep((s) => (s === 1 ? 2 : s)), 900));
    }
    if (currentStep === 4) {
      timers.push(setTimeout(() => setCurrentStep((s) => (s === 4 ? 5 : s)), 4000));
    }
    return () => timers.forEach(clearTimeout);
  }, [isGenerating, currentStep]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
      <div className="w-full max-w-[700px] px-4 sm:px-0">
        {/* Header. The icon sits on its own — no card, no glow — and drifts
            gently so it reads as the agent working rather than a static badge. */}
        <div className="text-center mb-[50px]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center mb-6"
          >
            {error ? (
              <AlertCircle className="w-12 h-12 text-[#FF4D4D]" />
            ) : (
              <motion.div
                animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], rotate: [0, 8, 0, -8, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-12 h-12 text-[#916AF5] fill-[#916AF5]" />
              </motion.div>
            )}
          </motion.div>

          <h1 className="font-display font-medium text-[28px] sm:text-[36px] leading-tight text-[#0A0A0A] m-0">
            {error ? "Planning failed" : "Autopilot is working on your trip"}
          </h1>
          <p className="mt-3 text-[14px] font-normal text-[#4A4A4A] m-0">
            {error ? error : "This may take a minute to offer best options..."}
          </p>
        </div>

        {/* Error state with retry button */}
        {error && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-[#FF4D4D]/20 shadow-lg p-8 mb-6">
            <div className="text-center">
              {rateLimited ? (
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="bg-[#916AF5] hover:bg-[#7c5dd4] text-white rounded-full px-10 py-6"
                >
                  Explore a finished trip instead
                </Button>
              ) : (
                <Button
                  onClick={handleGenerateItineraries}
                  className="bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white rounded-full px-10 py-6"
                >
                  Try again
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Planning steps as a horizontal timeline: five nodes on one track,
            filling left to right as each stage completes. */}
        <div className="w-full p-[20px]">
          <div className="flex items-start w-full">
            {planningSteps.map((step, index) => {
              const isComplete = currentStep > step.id;
              const isActive = currentStep === step.id;

              return (
                <div key={step.id} className="flex-1 min-w-0 flex flex-col items-center relative">
                  {/* Connector back to the previous node. Drawn behind the
                      circles and coloured by whether that leg is done. */}
                  {index > 0 && (
                    <div className="absolute top-[17px] right-1/2 left-[-50%] h-[2px] -z-0">
                      <div className="w-full h-full bg-[#E5E7EB]" />
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: currentStep >= step.id ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ transformOrigin: "left" }}
                        className="w-full h-full bg-[#916AF5] -mt-[2px]"
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
                      // A single dot breathing in place — quieter than a
                      // spinner, and it reads as a pulse rather than waiting.
                      <motion.span
                        className="w-[10px] h-[10px] rounded-full bg-[#916AF5]"
                        animate={reduceMotion ? undefined : { scale: [1, 1.55, 1], opacity: [0.85, 1, 0.85] }}
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

        {/* What the search actually returned. Turns the wait into evidence the
            agent is doing real work rather than a decorative loader. */}
        {inventory && !error && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-[14px] text-[#4a5565] m-0 mt-1"
          >
            Found{" "}
            <span className="font-medium text-[#1f2933]">
              {inventory.outbound_options} flight option
              {inventory.outbound_options === 1 ? "" : "s"}
            </span>
            {inventory.hotels > 0 && (
              <>
                {" and "}
                <span className="font-medium text-[#1f2933]">
                  {inventory.hotels} hotel{inventory.hotels === 1 ? "" : "s"}
                </span>
                {inventory.hotel_price_low > 0 && (
                  <span className="text-[#9095a1]">
                    {" "}· ${inventory.hotel_price_low}–${inventory.hotel_price_high}/night
                  </span>
                )}
              </>
            )}
          </motion.p>
        )}

        {/* Announce step changes to assistive tech, which cannot see the track. */}
        <p className="sr-only" aria-live="polite">
          {error
            ? `Planning failed: ${error}`
            : currentStep > planningSteps.length
              ? "Planning complete"
              : `Step ${currentStep} of ${planningSteps.length}: ${
                  planningSteps[Math.max(currentStep - 1, 0)]?.label ?? ""
                }`}
        </p>

        {/* Planning for — same trip card as the home screen, minus actions. */}
        {trip && (
          <div className="w-full max-w-[700px] mx-auto mt-6">
            <h2 className="text-[14px] font-semibold text-[#1f2933] m-0 mb-[14px]">
              Planning for
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