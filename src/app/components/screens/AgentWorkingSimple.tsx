import { Check, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Trip, getTrip, generateItineraries } from "../../utils/tripApi";
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
  { id: 4, label: "Combining options", icon: "🔄" }
];

export function AgentWorkingSimple({ onComplete, tripData }: AgentWorkingSimpleProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [trip, setTrip] = useState<Trip | null>(tripData || null);
  const [isLoading, setIsLoading] = useState(!tripData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const stepDurations = [1500, 2000, 2000, 1500];
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
      <div className="max-w-2xl w-full">
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
          <h1 className="text-4xl mb-3 text-[#0A0A0A]">{error ? "Planning failed" : "Autopilot is working on your trip"}</h1>
          <p className="text-lg text-[#4A4A4A]">
            {error ? error : "I'm preparing a few in-policy itineraries for this trip"}
          </p>
        </div>

        {/* Error state with retry button */}
        {error && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-[#FF4D4D]/20 shadow-lg p-8 mb-6">
            <div className="text-center">
              <Button
                onClick={handleGenerateItineraries}
                className="bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white rounded-full px-10 py-6"
              >
                Try again
              </Button>
            </div>
          </div>
        )}

        {/* Planning Steps - Main Frosted Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8 mb-6">
          <div className="space-y-6">
            {planningSteps.map((step, index) => {
              const isComplete = currentStep > step.id;
              const isActive = currentStep === step.id;
              const isPending = currentStep < step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center gap-4"
                >
                  {/* Step Icon */}
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all shadow-md
                    ${isComplete ? 'bg-[#D1F4E0]' : isActive ? 'bg-[#D4E9FF]' : 'bg-white/50 backdrop-blur-sm'}
                  `}>
                    {isComplete ? (
                      <Check className="w-6 h-6 text-[#52C93F]" />
                    ) : isActive ? (
                      <Loader2 className="w-6 h-6 text-[#4A90E2] animate-spin" />
                    ) : (
                      <span className="text-2xl">{step.icon}</span>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <p className={`
                      text-base m-0 transition-all
                      ${isComplete ? 'text-[#0A0A0A]' : isActive ? 'text-[#0A0A0A]' : 'text-gray-400'}
                    `}>
                      {step.label}
                    </p>
                    {isActive && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        className="h-1 bg-gradient-to-r from-[#1246A5] to-[#18A0A6] rounded-full mt-2"
                      />
                    )}
                  </div>

                  {/* Status Indicator */}
                  {isComplete && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-sm text-[#52C93F] px-3 py-1 bg-[#D1F4E0]/50 rounded-full"
                    >
                      Done
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Context Info */}
        {trip && (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30 p-5 mb-4">
            <p className="text-sm text-gray-600 m-0 mb-2">Planning for:</p>
            <div className="space-y-1">
              <p className="text-sm m-0"><strong>{trip.trip_name || trip.inferred_trip_name}</strong></p>
              <p className="text-sm text-gray-700 m-0">
                {trip.destination || trip.inferred_destination} · {trip.start_date || trip.inferred_dates?.start_date} – {trip.end_date || trip.inferred_dates?.end_date}
              </p>
              <p className="text-sm text-gray-700 m-0">
                {trip.travelers?.length || 0} traveler{trip.travelers?.length !== 1 ? 's' : ''}
              </p>
            </div>
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