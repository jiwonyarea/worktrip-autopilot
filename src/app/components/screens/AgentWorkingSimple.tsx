import { Check, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Trip, getTrip, generateItineraries } from "../../utils/tripApi";
import { TripSummaryCard } from "../TripSummaryCard";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface AgentWorkingSimpleProps {
  onComplete: () => void;
  tripData?: Trip | null;
}

const planningSteps = [
  { id: 1, label: "Collecting preferences", icon: "📋" },
  { id: 2, label: "Searching flights", icon: "✈️" },
  { id: 3, label: "Finding hotels", icon: "🏨" },
  { id: 4, label: "Checking policy", icon: "🛡️" },
  { id: 5, label: "Combining options", icon: "🔄" },
];

export function AgentWorkingSimple({ onComplete, tripData }: AgentWorkingSimpleProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [trip, setTrip] = useState<Trip | null>(tripData || null);
  const [isLoading, setIsLoading] = useState(!tripData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

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

    try {
      await generateItineraries(trip.id);
      // On success, wait a moment and then complete
      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (err) {
      // Show what actually went wrong. Advancing to the next screen on failure
      // just turns a specific, fixable error into "No itineraries available".
      console.error("Itinerary generation failed:", err);
      setError(
        err instanceof Error ? err.message : "Could not build itineraries for this trip",
      );
      // A spent daily quota is not a failure of this trip — send people to the
      // pre-generated ones rather than a retry that cannot succeed today.
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

  // Animate progress steps while generating
  useEffect(() => {
    if (!isGenerating) return;

    const stepDurations = [1500, 2000, 2000, 1500, 1500];
    const timers: NodeJS.Timeout[] = [];
    let cumulativeDelay = 0;

    planningSteps.forEach((step, index) => {
      cumulativeDelay += stepDurations[index];
      const timer = setTimeout(() => {
        setCurrentStep(index + 1);
      }, cumulativeDelay);
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isGenerating]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
      <div className="w-full max-w-[700px] px-4 sm:px-0">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-xl relative"
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-2xl blur-xl opacity-60 ${
              error ? 'bg-[#FFE0E0]' : 'bg-[#D4E9FF]'
            }`} />
            <div className={`relative w-full h-full rounded-2xl flex items-center justify-center bg-white/70 backdrop-blur-xl border border-white/50 ${
              error ? 'border-[#FF4D4D]/20' : 'border-[#1246A5]/20'
            }`}>
              {error ? (
                <AlertCircle className="w-10 h-10 text-[#FF4D4D]" />
              ) : (
                <Sparkles className="w-10 h-10 text-[#1246A5] animate-pulse" />
              )}
            </div>
          </motion.div>
          <h1 className="text-2xl sm:text-4xl mb-3 text-[#0A0A0A]">{error ? "Planning failed" : "Autopilot is working on your trip"}</h1>
          <p className="text-lg text-[#4A4A4A]">
            {error ? error : "I'm preparing a few in-policy itineraries for this trip"}
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
        <div className="w-full max-w-[700px] mx-auto bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl px-8 py-10">
          <div className="flex items-start">
            {planningSteps.map((step, index) => {
              const isComplete = currentStep > step.id;
              const isActive = currentStep === step.id;

              return (
                <div key={step.id} className="flex-1 flex flex-col items-center relative">
                  {/* Connector back to the previous node. Drawn behind the
                      circles and coloured by whether that leg is done. */}
                  {index > 0 && (
                    <div className="absolute top-[18px] right-1/2 left-[-50%] h-[2px] -z-0">
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
                    className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isComplete
                        ? "bg-[#916AF5]"
                        : isActive
                          ? "bg-[#EEE9FD] border-2 border-[#916AF5]"
                          : "bg-white border-2 border-[#E5E7EB]"
                    }`}
                  >
                    {isComplete ? (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 text-[#916AF5] animate-spin" />
                    ) : (
                      <span className="text-[13px] leading-none">{step.icon}</span>
                    )}
                  </div>

                  <p
                    className={`mt-3 px-1 text-[12px] leading-tight text-center m-0 transition-colors ${
                      isComplete || isActive ? "text-[#1f2933] font-medium" : "text-[#9095a1]"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

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

        {/* Footer Note */}
        <div className="bg-[#D4E9FF]/40 backdrop-blur-sm rounded-2xl border border-[#4A90E2]/20 p-4">
          <p className="text-sm text-gray-700 text-center m-0">
            ⏱️ This may take a minute as I search for the best options...
          </p>
        </div>
      </div>
    </div>
  );
}