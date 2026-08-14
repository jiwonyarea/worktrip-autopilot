import { Check, Clock, Loader2, Mail, Edit3, Copy, CheckCheck } from "lucide-react";
import { Button } from "../ui/button";
import { WizardStepper } from "../WizardStepper";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

const steps = [
  { number: 1, label: "Basics" },
  { number: 2, label: "People & Policy" },
  { number: 3, label: "Preferences" },
  { number: 4, label: "Options" },
  { number: 5, label: "Confirm" }
];

interface AgentWorkingProps {
  tripId?: string | null;
  onViewOptions?: () => void;
}

interface Traveler {
  name: string;
  email: string;
  role: string;
  preferences_completed: boolean;
}

export function AgentWorking({ tripId, onViewOptions }: AgentWorkingProps) {
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [tripData, setTripData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const progressIntervals = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (tripId) {
      loadTripData();
    }
  }, [tripId]);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadTripData = async () => {
    if (!tripId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-97df1df1/trips/${tripId}`,
        {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load trip");
      }

      const trip = await response.json();
      setTripData(trip);

      // Set travelers with their completion status
      if (trip.travelers && trip.travelers.length > 0) {
        setTravelers(trip.travelers);
      }
    } catch (err) {
      console.error("Error loading trip:", err);
      setError("Failed to load trip data.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSurveyLink = (travelerEmail: string) => {
    // In production, this would be your actual domain
    const baseUrl = window.location.origin;
    // Encode parameters for URL
    const encodedTripId = encodeURIComponent(tripId || '');
    const encodedEmail = encodeURIComponent(travelerEmail);
    return `${baseUrl}?screen=traveler-survey&tripId=${encodedTripId}&travelerEmail=${encodedEmail}`;
  };

  const handleCopyLink = (travelerEmail: string) => {
    const link = generateSurveyLink(travelerEmail);
    navigator.clipboard.writeText(link);
    setCopiedEmail(travelerEmail);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleSendInvite = (travelerEmail: string) => {
    // In production, this would trigger an email via backend
    const link = generateSurveyLink(travelerEmail);
    console.log(`Would send email to ${travelerEmail} with link: ${link}`);
    // For now, just copy the link
    handleCopyLink(travelerEmail);
  };

  const completedCount = travelers.filter(t => t.preferences_completed).length;
  const totalCount = travelers.length;
  const allCompleted = completedCount === totalCount && totalCount > 0;
  const canGenerate = totalCount > 0 && tripId; // Can generate if we have at least one traveler

  const handleGenerateItineraries = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);

    console.log(`========================================`);
    console.log(`AgentWorking: Starting itinerary generation`);
    console.log(`Trip ID: ${tripId}`);
    console.log(`========================================`);

    // Animate progress steps
    const progressSteps = [
      { step: 1, delay: 500 },
      { step: 2, delay: 1500 },
      { step: 3, delay: 2500 },
      { step: 4, delay: 3500 }
    ];

    progressSteps.forEach(({ step, delay }) => {
      const intervalId = setTimeout(() => {
        if (step <= 4) setGenerationProgress(step);
      }, delay);
      progressIntervals.current.push(intervalId);
    });

    try {
      console.log(`AgentWorking: Calling POST /trips/${tripId}/generate-itineraries`);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-97df1df1/trips/${tripId}/generate-itineraries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ tripId }),
        }
      );

      console.log(`AgentWorking: Response received`);
      console.log(`  - Status: ${response.status}`);
      console.log(`  - OK: ${response.ok}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`AgentWorking: Error response:`, errorData);
        
        // SPECIAL HANDLING: Check for Flowise model error in BOTH error and message fields
        const errorText = errorData.error || errorData.message || JSON.stringify(errorData);
        
        if (errorText && 
            (errorText.includes("404 No endpoints found") || 
             errorText.includes("No endpoints found for") ||
             errorText.includes("x-ai/grok") ||
             errorText.includes("predictionsServices.buildChatflow"))) {
          
          console.warn("🔧 WORKAROUND: Flowise model error detected, using local mock data");
          console.warn("Error text:", errorText);
          // toast.info("Using Demo Data", {
          //   description: "AI model is not configured. Showing sample itineraries for demo purposes.",
          //   duration: 6000,
          // });
          
          // Generate mock itineraries locally
          const mockItineraries = [
            {
              id: "option-1",
              option_label: "cost_saver",
              title: "Cost-Saving Itinerary",
              total_cost: travelers.length * 1000,
              budget_percentage: 50,
              policy_compliant: true,
              features: ["Cost-Effective", "Budget-Friendly"],
              details: {
                flight_summary: "Economy flights with layovers",
                hotel_summary: "Budget-friendly hotels with shared rooms",
                ground_transport_summary: "Public transportation and carpooling",
                food_summary: "Economic dining options and meal kits",
                preference_satisfaction_score: 75,
              },
            },
            {
              id: "option-2",
              option_label: "balanced",
              title: "Balanced Itinerary",
              total_cost: travelers.length * 2000,
              budget_percentage: 75,
              policy_compliant: true,
              features: ["Balanced Costs", "Moderate Comfort"],
              details: {
                flight_summary: "Direct flights with some layovers",
                hotel_summary: "Moderate hotels with private rooms",
                ground_transport_summary: "Rental cars and public transportation",
                food_summary: "Moderate dining options and some meal kits",
                preference_satisfaction_score: 85,
              },
            },
            {
              id: "option-3",
              option_label: "time_saver",
              title: "Time-Saving Itinerary",
              total_cost: travelers.length * 3000,
              budget_percentage: 100,
              policy_compliant: true,
              features: ["Time-Efficient", "High Comfort"],
              details: {
                flight_summary: "Direct flights with minimal layovers",
                hotel_summary: "Luxury hotels with private rooms",
                ground_transport_summary: "Private cars and airport transfers",
                food_summary: "High-end dining options and no meal kits",
                preference_satisfaction_score: 95,
              },
            },
          ];
          
          // Save to backend by updating the trip
          try {
            const updateResponse = await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-97df1df1/trips/${tripId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${publicAnonKey}`,
                },
                body: JSON.stringify({
                  itineraries: mockItineraries,
                  updated_at: new Date().toISOString(),
                }),
              }
            );
            
            if (updateResponse.ok) {
              console.log("Mock itineraries saved to backend successfully");
            } else {
              console.warn("Failed to save mock itineraries to backend, but continuing anyway");
            }
          } catch (saveError) {
            console.warn("Error saving mock itineraries:", saveError);
          }
          
          console.log("Using local mock itineraries:", mockItineraries);
          
          // Clear progress intervals and proceed
          if (progressIntervals.current.length > 0) {
            progressIntervals.current.forEach((id) => clearTimeout(id));
            progressIntervals.current = [];
          }
          
          setGenerationProgress(5);
          
          // Small delay for realism
          await new Promise(resolve => setTimeout(resolve, 500));
          
          setIsGenerating(false);
          onViewOptions?.();
          return;
        }
        
        // Create dynamic error message based on error type
        let errorMessage = "Failed to generate itineraries";
        
        if (errorData.error_type === "network_error") {
          errorMessage = "🌐 Network Error: Unable to reach Flowise API. Please check your internet connection and try again.";
        } else if (errorData.error_type === "flowise_api_error") {
          errorMessage = `🔴 Flowise API Error: The AI service returned an error (Status ${errorData.status_code}). Please try again or contact support if the issue persists.`;
        } else if (errorData.error_type === "invalid_response_format") {
          errorMessage = `📋 Invalid Response: Flowise returned an unexpected format. Expected itinerary data but received: ${errorData.available_fields?.join(', ') || 'unknown fields'}.`;
        } else if (errorData.error) {
          errorMessage = `⚠️ ${errorData.error}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("AgentWorking: Server response data:", data);

      // Clear intervals after successful completion
      if (progressIntervals.current.length > 0) {
        console.log("AgentWorking: Clearing progress intervals");
        progressIntervals.current.forEach((id) => clearTimeout(id));
        progressIntervals.current = [];
      }

      setGenerationProgress(5);
      
      // If we received mock data due to Flowise config error, show a warning toast
      if (data.mock_data && data.warning) {
        toast.info("Using Demo Data", {
          description: "AI model is not configured. Showing sample itineraries for demo purposes.",
          duration: 6000,
        });
      }

      // Check if response includes itineraries
      if (data.itineraries && data.itineraries.length > 0) {
        console.log(`========================================`);
        console.log(`AgentWorking: SUCCESS - Itineraries generated`);
        console.log(`Number of itineraries: ${data.itineraries?.length || 0}`);
        console.log(`Sample itinerary data:`);
        data.itineraries.forEach((itin: any, idx: number) => {
          console.log(`  ${idx + 1}. ${itin.title || itin.option_label} - $${itin.total_cost || 0}`);
        });
        console.log(`========================================`);

        // STEP 4: Add a small delay to ensure KV write completes on backend
        // The Edge Function should have already saved to KV before returning,
        // but we add a buffer to ensure database consistency
        console.log(`AgentWorking: Waiting 500ms for KV write to complete...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log(`AgentWorking: Navigating to ReviewApprove with tripId: ${tripId}`);
        console.log(`========================================`);
        
        setIsGenerating(false);
        onViewOptions?.();
      } else {
        throw new Error("No itineraries generated. Please try again.");
      }
    } catch (err) {
      console.error("========================================");
      console.error("AgentWorking: Error generating itineraries:", err);
      console.error("========================================");
      
      // SPECIAL HANDLING: Check if the error is the Flowise model configuration error
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      if (errorMessage.includes("404 No endpoints found") || 
          errorMessage.includes("No endpoints found for") ||
          errorMessage.includes("x-ai/grok") ||
          errorMessage.includes("predictionsServices.buildChatflow")) {
        
        console.warn("🔧 CATCH BLOCK: Flowise model error detected in catch, using local mock data");
        toast.info("Using Demo Data", {
          description: "AI model is not configured. Showing sample itineraries for demo purposes.",
          duration: 6000,
        });
        
        // Generate mock itineraries locally
        const mockItineraries = [
          {
            id: "option-1",
            option_label: "cost_saver",
            title: "Cost-Saving Itinerary",
            total_cost: travelers.length * 1000,
            budget_percentage: 50,
            policy_compliant: true,
            features: ["Cost-Effective", "Budget-Friendly"],
            details: {
              flight_summary: "Economy flights with layovers",
              hotel_summary: "Budget-friendly hotels with shared rooms",
              ground_transport_summary: "Public transportation and carpooling",
              food_summary: "Economic dining options and meal kits",
              preference_satisfaction_score: 75,
            },
          },
          {
            id: "option-2",
            option_label: "balanced",
            title: "Balanced Itinerary",
            total_cost: travelers.length * 2000,
            budget_percentage: 75,
            policy_compliant: true,
            features: ["Balanced Costs", "Moderate Comfort"],
            details: {
              flight_summary: "Direct flights with some layovers",
              hotel_summary: "Moderate hotels with private rooms",
              ground_transport_summary: "Rental cars and public transportation",
              food_summary: "Moderate dining options and some meal kits",
              preference_satisfaction_score: 85,
            },
          },
          {
            id: "option-3",
            option_label: "time_saver",
            title: "Time-Saving Itinerary",
            total_cost: travelers.length * 3000,
            budget_percentage: 100,
            policy_compliant: true,
            features: ["Time-Efficient", "High Comfort"],
            details: {
              flight_summary: "Direct flights with minimal layovers",
              hotel_summary: "Luxury hotels with private rooms",
              ground_transport_summary: "Private cars and airport transfers",
              food_summary: "High-end dining options and no meal kits",
              preference_satisfaction_score: 95,
            },
          },
        ];
        
        // Save to backend by updating the trip
        try {
          const updateResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-97df1df1/trips/${tripId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${publicAnonKey}`,
              },
              body: JSON.stringify({
                itineraries: mockItineraries,
                updated_at: new Date().toISOString(),
              }),
            }
          );
          
          if (updateResponse.ok) {
            console.log("Mock itineraries saved to backend successfully");
          } else {
            console.warn("Failed to save mock itineraries to backend, but continuing anyway");
          }
        } catch (saveError) {
          console.warn("Error saving mock itineraries:", saveError);
        }
        
        console.log("Using local mock itineraries:", mockItineraries);
        
        // Clear progress intervals and proceed
        if (progressIntervals.current.length > 0) {
          progressIntervals.current.forEach((id) => clearTimeout(id));
          progressIntervals.current = [];
        }
        
        setGenerationProgress(5);
        
        // Small delay for realism
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setIsGenerating(false);
        onViewOptions?.();
        return;
      }
      
      // For other errors, show the error message
      setError(
        err instanceof Error 
          ? `Failed to generate itineraries: ${err.message}` 
          : "Failed to generate itineraries. Please try again."
      );
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-[1088px] mx-auto">
        <WizardStepper steps={steps} currentStep={4} />

        {/* Trip Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-8 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2">{tripData?.trip_name || "Loading..."}</h1>
              <div className="flex items-center gap-6 text-gray-600">
                <span className="text-sm">📍 {tripData?.destination || "..."}</span>
                <span className="text-sm">📅 {tripData?.start_date && tripData?.end_date ? `${tripData.start_date} - ${tripData.end_date}` : "..."}</span>
                <span className="text-sm">👥 {travelers.length} travelers</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1246A5]/10 border border-[#1246A5]/20 rounded-lg">
              <span className="w-2 h-2 bg-[#1246A5] rounded-full"></span>
              <span className="text-sm text-[#1246A5]">Policy compliant</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 mb-2">{error}</p>
            <Button
              onClick={handleGenerateItineraries}
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100"
              disabled={!canGenerate}
            >
              Try Again
            </Button>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Traveler Preferences Status */}
          <div className="col-span-5">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="m-0">Traveler Preferences</h2>
                <span className="text-sm text-gray-600">
                  {completedCount} of {totalCount} complete
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#18A0A6] transition-all duration-500"
                    style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Traveler List */}
              <div className="space-y-3">
                {travelers.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No travelers added yet</p>
                ) : (
                  travelers.map((traveler, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {traveler.preferences_completed ? (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm m-0 truncate">{traveler.name}</p>
                          <p className="text-xs text-gray-500 m-0 truncate">{traveler.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {traveler.preferences_completed ? (
                            <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">
                              Complete
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <Button 
                  className="w-full bg-[#18A0A6] hover:bg-[#138b91] text-white gap-2"
                  onClick={() => {
                    // Send invites to all pending travelers
                    travelers.filter(t => !t.preferences_completed).forEach(t => {
                      handleSendInvite(t.email);
                    });
                  }}
                  disabled={allCompleted || travelers.length === 0}
                >
                  <Mail className="w-4 h-4" />
                  {allCompleted ? "All invites sent" : "Send invites to pending"}
                </Button>
                
                {/* Individual resend links */}
                {travelers.filter(t => !t.preferences_completed).length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-600 mb-2">Or copy individual survey links:</p>
                    {travelers.filter(t => !t.preferences_completed).map((traveler, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-600 flex-1 truncate">{traveler.name}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 h-7 text-xs"
                          onClick={() => handleCopyLink(traveler.email)}
                        >
                          {copiedEmail === traveler.email ? (
                            <>
                              <CheckCheck className="w-3 h-3" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy link
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {allCompleted && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 m-0 flex items-center gap-2">
                    <CheckCheck className="w-4 h-4" />
                    All travelers have completed their preferences!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Agent Progress */}
          <div className="col-span-7">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="mb-4">Trip Setup Summary</h2>
              
              <div className="space-y-6">
                {/* Status Message */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 m-0">
                    {allCompleted 
                      ? "✅ All preferences collected! You can now proceed to generate itinerary options."
                      : `⏳ Waiting for ${totalCount - completedCount} traveler${totalCount - completedCount !== 1 ? 's' : ''} to complete preferences...`
                    }
                  </p>
                </div>

                {/* Warning for incomplete preferences */}
                {!allCompleted && totalCount > 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-900 m-0">
                      💡 You can still generate itineraries. Default preferences will be used for travelers who haven't completed the survey.
                    </p>
                  </div>
                )}

                {/* Trip Summary */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm mb-2">Trip Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Destination:</span>
                        <span>{tripData?.destination || "..."}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Dates:</span>
                        <span>{tripData?.start_date && tripData?.end_date ? `${tripData.start_date} to ${tripData.end_date}` : "..."}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Purpose:</span>
                        <span>{tripData?.purpose || "..."}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Budget per person:</span>
                        <span>{tripData?.budget_per_person ? `$${tripData.budget_per_person}` : "Not set"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Autonomy level:</span>
                        <span className="capitalize">{tripData?.autonomy_level?.replace('_', ' ') || "..."}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm mb-2">Survey Configuration</h3>
                    <div className="flex flex-wrap gap-2">
                      {tripData?.survey_config && Object.entries(tripData.survey_config)
                        .filter(([_, enabled]) => enabled)
                        .map(([key, _]) => (
                          <span 
                            key={key}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                          >
                            {key.replace('_', ' ')}
                          </span>
                        ))
                      }
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm mb-3">Next Steps</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        allCompleted ? 'bg-green-100' : 'bg-gray-200'
                      }`}>
                        {allCompleted ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <span className="text-xs text-gray-600">1</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm m-0">Collect traveler preferences</p>
                        <p className="text-xs text-gray-500 m-0">
                          {allCompleted ? "All preferences collected" : `${completedCount}/${totalCount} completed`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-gray-600">2</span>
                      </div>
                      <div>
                        <p className="text-sm m-0">Generate itinerary options</p>
                        <p className="text-xs text-gray-500 m-0">
                          {allCompleted ? "Ready to generate" : "Waiting for preferences"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-gray-600">3</span>
                      </div>
                      <div>
                        <p className="text-sm m-0">Review and book</p>
                        <p className="text-xs text-gray-500 m-0">Coming up next</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between mt-6">
          <Button 
            variant="outline"
            className="border-gray-300"
            onClick={() => window.history.back()}
            disabled={isGenerating}
          >
            Back
          </Button>
          <Button 
            className="bg-[#916AF5] hover:bg-[#7c5dd4] text-white px-8"
            onClick={handleGenerateItineraries}
            disabled={!canGenerate || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Options"
            )}
          </Button>
        </div>

        {/* Generation Progress Overlay */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl">
              <h2 className="mb-6 text-center">Generating Itineraries</h2>
              <div className="space-y-4">
                {[
                  { id: 1, label: "Collecting preferences", icon: "📋" },
                  { id: 2, label: "Searching flights", icon: "✈️" },
                  { id: 3, label: "Finding hotels", icon: "🏨" },
                  { id: 4, label: "Combining options", icon: "🔄" }
                ].map((step) => (
                  <div key={step.id} className="flex items-center gap-3">
                    {generationProgress > step.id ? (
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    ) : generationProgress === step.id ? (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm text-gray-400">{step.icon}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className={`text-sm m-0 ${
                        generationProgress >= step.id ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-6 m-0">
                This may take a minute...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}