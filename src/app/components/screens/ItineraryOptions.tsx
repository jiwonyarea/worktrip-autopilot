import { Check, Star, Plane, Hotel, Car, UtensilsCrossed, Accessibility } from "lucide-react";
import { Button } from "../ui/button";
import { StatusBadge } from "../StatusBadge";
import { WizardStepper } from "../WizardStepper";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import svgPaths from "../../imports/svg-ckg9jzvd2s";
import imgImage1 from "figma:asset/50ba81ee3baed0d032549253a352c5d27d54adb9.png";

const steps = [
  { number: 1, label: "Basics" },
  { number: 2, label: "People & Policy" },
  { number: 3, label: "Preferences" },
  { number: 4, label: "Options" },
  { number: 5, label: "Confirm" }
];

interface ItineraryOptionsProps {
  tripId?: string | null;
  onContinue?: () => void;
  onViewDetails?: (id: string) => void;
}

interface Itinerary {
  id: string;
  option_label: string;
  title: string;
  total_cost: number;
  budget_percentage: number;
  policy_compliant: boolean;
  features: string[];
  details: any;
}

export function ItineraryOptions({ tripId, onContinue, onViewDetails }: ItineraryOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [tripData, setTripData] = useState<any>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tripId) {
      loadTripData();
    }
  }, [tripId]);

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
      
      // STEP 1: Add explicit logging for diagnosis
      console.log("F1.6 loaded trip:", trip);
      console.log("F1.6 trip.itineraries:", trip?.itineraries);
      console.log("F1.6 tripId used for fetch:", tripId);
      console.log("F1.6 trip structure keys:", Object.keys(trip));
      
      setTripData(trip);

      // Load itineraries from trip
      if (trip.itineraries && trip.itineraries.length > 0) {
        console.log("F1.6 setting itineraries state:", trip.itineraries);
        console.log("F1.6 number of itineraries:", trip.itineraries.length);
        setItineraries(trip.itineraries);
      } else {
        console.error("F1.6 ERROR: No itineraries found in trip object");
        console.error("F1.6 trip.itineraries value:", trip.itineraries);
        setError("No itineraries found. Please generate itineraries first.");
      }
    } catch (err) {
      console.error("Error loading trip:", err);
      setError("Failed to load itinerary options.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedOption && tripId) {
      // Save the selected itinerary to the trip
      console.log("Selected itinerary:", selectedOption);
      // In production, you would save this selection to Supabase
      onContinue?.();
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <WizardStepper steps={steps} currentStep={4} />

        {/* Header */}
        <div className="mt-8 mb-6">
          <h1 className="mb-2">Choose your itinerary</h1>
          <p className="text-gray-600 m-0">
            WorkTrip Autopilot found {itineraries.length} options that match your preferences and policy
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#1246A5] border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-600">Loading itineraries...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && itineraries.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No itineraries available yet.</p>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
            >
              Go back to generate itineraries
            </Button>
          </div>
        )}

        {/* Filter Chips - Only show if we have itineraries */}
        {itineraries.length > 0 && (
          <div className="flex gap-2 mb-6">
            <button className="px-3 py-1.5 text-sm bg-[#1246A5]/10 border border-[#1246A5]/20 text-[#1246A5] rounded-full">
              Show policy-compliant only
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50">
              Highlight accessibility
            </button>
          </div>
        )}

        {/* Options Grid */}
        {itineraries.length > 0 && (
          <div className="grid grid-cols-3 gap-6 mb-6">
            {itineraries.map((option, index) => {
              // Determine the option label for display
              const optionLabels = ["Cost saver", "Balanced", "Time saver"];
              const displayLabel = optionLabels[index] || option.title;
              const isBalanced = index === 1;

              return (
                <div
                  key={option.id}
                  className="relative h-[746px] w-full bg-white/70 rounded-[24px] border border-white/50 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] p-[20px]"
                >
                  {/* Header with Title and Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {isBalanced ? (
                          <Star className="w-5 h-5 text-[#F5A623] fill-[#F5A623]" />
                        ) : (
                          <Star className="w-5 h-5 text-gray-300" />
                        )}
                        <h3 className="text-[16px] font-semibold text-[#1f2933] m-0 tracking-[-0.3125px]">
                          {displayLabel}
                        </h3>
                      </div>
                      <p className="text-[24px] font-semibold text-[#101828] m-0 leading-[32px] tracking-[0.0703px]">
                        ${option.total_cost.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-[#d0f4e0] px-3 py-1 rounded-full">
                      <p className="text-[12px] font-medium text-[#44ad33] m-0 leading-[16px]">
                        In policy
                      </p>
                    </div>
                  </div>

                  {/* Flights Section */}
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                          <path d={svgPaths.pdab9800} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </svg>
                        <p className="text-[16px] font-normal text-[#1f2933] m-0 tracking-[-0.3125px]">
                          Flights
                        </p>
                      </div>
                      <p className="text-[18px] font-normal text-[#0a0a0a] m-0 leading-[36px] tracking-[0.3955px]">
                        ${Math.round(option.total_cost * 0.45).toLocaleString()}
                      </p>
                    </div>

                    {/* Outbound Flight Card */}
                    <div className="bg-[rgba(179,173,196,0.11)] border border-[rgba(179,173,196,0.28)] rounded-[16px] p-5 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-white rounded-[8px] w-10 h-10 flex items-center justify-center overflow-hidden">
                          <img src={imgImage1} alt="" className="w-[30px] h-[30px] object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[14px] font-bold text-[#101828] m-0 leading-[20px] tracking-[-0.1504px]">
                            9:00 - 11:05
                          </p>
                          <p className="text-[14px] font-normal text-[#364153] m-0 leading-[20px] tracking-[-0.1504px]">
                            Delta Airlines · DE 1234 · Direct
                          </p>
                        </div>
                        <div>
                          <p className="text-[14px] font-normal text-[#101828] m-0 leading-[20px] tracking-[-0.1504px]">
                            Mon, Feb 9, 2026
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Return Flight Card */}
                    <div className="bg-[rgba(179,173,196,0.11)] border border-[rgba(179,173,196,0.28)] rounded-[16px] p-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-white rounded-[8px] w-10 h-10 flex items-center justify-center overflow-hidden">
                          <img src={imgImage1} alt="" className="w-[30px] h-[30px] object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[14px] font-bold text-[#101828] m-0 leading-[20px] tracking-[-0.1504px]">
                            9:00 - 11:05
                          </p>
                          <p className="text-[14px] font-normal text-[#364153] m-0 leading-[20px] tracking-[-0.1504px]">
                            Delta Airlines · DE 1234 · Direct
                          </p>
                        </div>
                        <div>
                          <p className="text-[14px] font-normal text-[#101828] m-0 leading-[20px] tracking-[-0.1504px]">
                            Mon, Feb 13, 2026
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hotel Section */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                          <path d="M8.33301 18.3344V12.8594" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M10 9.16797H10.0083" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M10 5.83203H10.0083" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M11.667 12.8594V18.3344" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d={svgPaths.p20136f00} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M13.333 9.16797H13.3413" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M13.333 5.83203H13.3413" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M6.66699 9.16797H6.67533" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M6.66699 5.83203H6.67533" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d={svgPaths.p238f2580} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </svg>
                        <p className="text-[16px] font-normal text-[#1f2933] m-0 tracking-[-0.3125px]">
                          Hotel
                        </p>
                      </div>
                      <p className="text-[18px] font-normal text-[#0a0a0a] m-0 leading-[36px] tracking-[0.3955px]">
                        ${Math.round(option.total_cost * 0.35).toLocaleString()}
                      </p>
                    </div>

                    {/* Hotel Card */}
                    <div className="bg-[rgba(179,173,196,0.11)] border border-[rgba(179,173,196,0.28)] rounded-[16px] p-5">
                      <div className="flex items-start gap-3">
                        <div className="bg-white rounded-[8px] w-10 h-10" />
                        <div className="flex-1">
                          <p className="text-[14px] font-bold text-[#101828] m-0 leading-[20px] tracking-[-0.1504px]">
                            New York Marriott Downtown
                          </p>
                          <p className="text-[14px] font-normal text-[#364153] m-0 leading-[20px] tracking-[-0.1504px]">
                            4.2★ rating · 0.8 mi to venue
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ground Transport Section */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                          <path d={svgPaths.p2f635300} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d={svgPaths.p23837280} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d="M7.5 14.168H12.5" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d={svgPaths.p3849af00} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                        <p className="text-[16px] font-normal text-[#1f2933] m-0 tracking-[-0.3125px]">
                          Ground Transport
                        </p>
                      </div>
                      <p className="text-[18px] font-normal text-[#0a0a0a] m-0 leading-[36px] tracking-[0.3955px]">
                        ${Math.round(option.total_cost * 0.12).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Food Section */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                          <g clipPath="url(#clip0_3127_440)">
                            <path d={svgPaths.p2a5cc00} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            <path d={svgPaths.p18a1600} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            <path d="M1.75 18.168L7.08333 12.918" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            <path d="M15.8333 4.16797L10 10.0013" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </g>
                          <defs>
                            <clipPath id="clip0_3127_440">
                              <rect fill="white" height="20" width="20" />
                            </clipPath>
                          </defs>
                        </svg>
                        <p className="text-[16px] font-normal text-[#1f2933] m-0 tracking-[-0.3125px]">
                          Food
                        </p>
                      </div>
                      <p className="text-[18px] font-normal text-[#0a0a0a] m-0 leading-[36px] tracking-[0.3955px]">
                        ${Math.round(option.total_cost * 0.08).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mt-6 mb-4 h-[1px] bg-[#E6E6E6]" />

                  {/* Checkmarks */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 14 14">
                        <path d={svgPaths.p37426ec0} stroke="#1F9D55" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999871" />
                      </svg>
                      <p className="text-[14px] font-normal text-[#4a5565] m-0 leading-[16px]">
                        Within policy
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 14 14">
                        <path d={svgPaths.p37426ec0} stroke="#1F9D55" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999871" />
                      </svg>
                      <p className="text-[14px] font-normal text-[#4a5565] m-0 leading-[16px]">
                        Optimized for conference worktrip
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 14 14">
                        <path d={svgPaths.p37426ec0} stroke="#1F9D55" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999871" />
                      </svg>
                      <p className="text-[14px] font-normal text-[#4a5565] m-0 leading-[16px]">
                        Suggesting based on user preferences
                      </p>
                    </div>
                  </div>

                  {/* Select Button */}
                  <button
                    onClick={() => setSelectedOption(option.id)}
                    className={`w-full h-[45px] rounded-[12px] text-[18px] font-normal leading-[20px] tracking-[-0.1504px] transition-colors ${
                      selectedOption === option.id
                        ? "bg-[#916AF5] text-white"
                        : "bg-[#e9e7ef] text-black hover:bg-[#dcd9e5]"
                    }`}
                  >
                    Select and continue
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" className="border-gray-300">
            Back
          </Button>
          <Button 
            onClick={handleContinue}
            disabled={!selectedOption}
            className="bg-[#916AF5] hover:bg-[#7c5dd4] text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to booking
          </Button>
        </div>
      </div>
    </div>
  );
}