import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface TravelerSurveyProps {
  tripId?: string | null;
  travelerId?: string | null;
  isMobile?: boolean;
  onSubmit?: () => void;
}

export function TravelerSurvey({ tripId, travelerId, isMobile = false, onSubmit }: TravelerSurveyProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Get traveler email from props or sessionStorage (for URL-based access)
  const effectiveTravelerId = travelerId || sessionStorage.getItem('surveyTravelerEmail');

  // Survey state
  const [airportFlexibility, setAirportFlexibility] = useState("home_only");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [comfortVsCost, setComfortVsCost] = useState(50);
  const [hotelDistance, setHotelDistance] = useState("flexible");
  const [roomSharingWilling, setRoomSharingWilling] = useState(false);
  const [roommatePreference, setRoommatePreference] = useState("");
  const [accessibilityNeeds, setAccessibilityNeeds] = useState<string[]>([]);
  const [accessibilityNotes, setAccessibilityNotes] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [exploreRestaurants, setExploreRestaurants] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [surveyConfig, setSurveyConfig] = useState<any>(null);
  const [travelersList, setTravelersList] = useState<any[]>([]);

  // Load preferences on mount if tripId and travelerId are provided
  useEffect(() => {
    if (tripId) {
      loadTripData();
      loadPreferences();
    }
  }, [tripId]);

  const loadTripData = async () => {
    if (!tripId) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-97df1df1/trips/${tripId}`,
        {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const trip = await response.json();
        // Store trip data for roommate options
        if (trip.survey_config) {
          setSurveyConfig(trip.survey_config);
        }
        // Store travelers for roommate selection
        if (trip.travelers) {
          setTravelersList(trip.travelers);
        }
      }
    } catch (err) {
      console.error("Error loading trip data:", err);
    }
  };

  const loadPreferences = async () => {
    if (!tripId || !effectiveTravelerId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-97df1df1/trips/${tripId}/preferences/${effectiveTravelerId}`,
        {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const prefs = await response.json();
        
        // Populate all fields
        setAirportFlexibility(prefs.airport_flexibility || "home_only");
        setDepartureTime(prefs.departure_time_pref || "");
        setArrivalTime(prefs.arrival_time_pref || "");
        setComfortVsCost(prefs.comfort_vs_cost || 50);
        setHotelDistance(prefs.hotel_distance_pref || "flexible");
        setRoomSharingWilling(prefs.room_sharing_willing || false);
        setRoommatePreference(prefs.roommate_preference_id || "");
        setAccessibilityNeeds(prefs.accessibility_needs || []);
        setAccessibilityNotes(prefs.accessibility_notes || "");
        setDietaryRestrictions(prefs.dietary_restrictions || []);
        setExploreRestaurants(prefs.explore_restaurants || false);
      }
      // If 404, it's okay - no preferences saved yet
    } catch (err) {
      console.error("Error loading preferences:", err);
      // Don't show error for missing preferences - it's expected for first-time survey
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndSubmit = async () => {
    if (!tripId || !effectiveTravelerId) {
      setError("Missing trip or traveler information. Please contact the organizer.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-97df1df1/trips/${tripId}/preferences/${effectiveTravelerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            airport_flexibility: airportFlexibility,
            departure_time_pref: departureTime,
            arrival_time_pref: arrivalTime,
            comfort_vs_cost: comfortVsCost,
            hotel_distance_pref: hotelDistance,
            room_sharing_willing: roomSharingWilling,
            roommate_preference_id: roommatePreference || null,
            accessibility_needs: accessibilityNeeds,
            accessibility_notes: accessibilityNotes,
            dietary_restrictions: dietaryRestrictions,
            explore_restaurants: exploreRestaurants,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      setSuccessMessage("Preferences saved successfully!");
      
      // Call onSubmit callback after a short delay
      setTimeout(() => {
        onSubmit?.();
      }, 1000);
    } catch (err) {
      console.error("Error saving preferences:", err);
      setError("Failed to save preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAccessibilityNeed = (need: string) => {
    if (accessibilityNeeds.includes(need)) {
      setAccessibilityNeeds(accessibilityNeeds.filter(n => n !== need));
    } else {
      setAccessibilityNeeds([...accessibilityNeeds, need]);
    }
  };

  const toggleDietaryRestriction = (restriction: string) => {
    if (dietaryRestrictions.includes(restriction)) {
      setDietaryRestrictions(dietaryRestrictions.filter(r => r !== restriction));
    } else {
      setDietaryRestrictions([...dietaryRestrictions, restriction]);
    }
  };

  const containerClass = isMobile
    ? "min-h-screen bg-[#F5F7FA] flex flex-col max-w-[390px] mx-auto"
    : "min-h-screen bg-[#F5F7FA] p-8";

  const contentClass = isMobile
    ? "flex-1 overflow-y-auto"
    : "max-w-2xl mx-auto";

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className={`bg-white ${isMobile ? 'px-4 py-4' : 'p-6 rounded-xl'} border-b border-gray-200 shadow-sm ${isMobile ? '' : 'mb-6'}`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="m-0">AWS re:Invent 2025</h2>
          {isMobile && (
            <button className="text-gray-500">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i + 1 <= currentStep ? "bg-[#1246A5]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2 m-0">Step {currentStep} of {totalSteps}</p>
        
        {/* Error/Success messages */}
        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            {successMessage}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={contentClass}>
        <div className={`bg-white ${isMobile ? 'p-4' : 'p-6 rounded-xl'} ${isMobile ? '' : 'shadow-sm border border-gray-200'}`}>
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4">Flight preferences</h3>
                
                <div className="space-y-5">
                  <div>
                    <Label className="text-sm mb-3 block">Airport preferences</Label>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        className={`px-4 py-2 text-sm border rounded-lg ${airportFlexibility === "home_only" ? "border-[#1246A5] bg-[#1246A5]/10 text-[#1246A5]" : "border-gray-300 hover:bg-gray-50"}`}
                        onClick={() => setAirportFlexibility("home_only")}
                      >
                        Home airport only
                      </button>
                      <button
                        className={`px-4 py-2 text-sm border rounded-lg ${airportFlexibility === "nearby_ok" ? "border-[#1246A5] bg-[#1246A5]/10 text-[#1246A5]" : "border-gray-300 hover:bg-gray-50"}`}
                        onClick={() => setAirportFlexibility("nearby_ok")}
                      >
                        Nearby airports okay
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm mb-3 block">Preferred departure time</Label>
                    <div className="flex gap-2 flex-wrap">
                      {["early_morning", "morning", "afternoon", "evening"].map((time) => (
                        <button
                          key={time}
                          className={`px-4 py-2 text-sm border rounded-lg capitalize ${departureTime === time ? "border-[#1246A5] bg-[#1246A5]/10 text-[#1246A5]" : "border-gray-300 hover:border-[#1246A5] hover:bg-[#1246A5]/5"}`}
                          onClick={() => setDepartureTime(time)}
                        >
                          {time.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm mb-3 block">Preferred arrival time</Label>
                    <div className="flex gap-2 flex-wrap">
                      {["morning", "afternoon", "evening", "flexible"].map((time) => (
                        <button
                          key={time}
                          className={`px-4 py-2 text-sm border rounded-lg capitalize ${arrivalTime === time ? "border-[#1246A5] bg-[#1246A5]/10 text-[#1246A5]" : "border-gray-300 hover:border-[#1246A5] hover:bg-[#1246A5]/5"}`}
                          onClick={() => setArrivalTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm mb-3 block">Comfort vs. Cost</Label>
                    <div className="px-2">
                      <input
                        type="range"
                        className="w-full"
                        min="0"
                        max="100"
                        value={comfortVsCost}
                        onChange={(e) => setComfortVsCost(Number(e.target.value))}
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500">Lower cost</span>
                        <span className="text-xs text-gray-500">More comfort</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4">Hotel preferences</h3>
                
                <div className="space-y-5">
                  <div>
                    <Label className="text-sm mb-2 block">Distance from venue</Label>
                    <select
                      className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 bg-white"
                      value={hotelDistance}
                      onChange={(e) => setHotelDistance(e.target.value)}
                    >
                      <option value="walking">Walking distance preferred</option>
                      <option value="15_min">Up to 15 minutes travel</option>
                      <option value="30_min">Up to 30 minutes travel</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm mb-3 block">Room sharing</Label>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <span className="text-sm">Willing to share a room</span>
                      <Switch
                        checked={roomSharingWilling}
                        onCheckedChange={(checked) => setRoomSharingWilling(checked)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm mb-2 block">Roommate preference (if sharing)</Label>
                    <select
                      className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 bg-white"
                      value={roommatePreference}
                      onChange={(e) => setRoommatePreference(e.target.value)}
                    >
                      <option value="">No preference</option>
                      {travelersList
                        .filter(t => t.email !== effectiveTravelerId)
                        .map((traveler) => (
                          <option key={traveler.email} value={traveler.email}>
                            {traveler.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">
                  Accessibility requirements <span className="text-[#D64545]">*</span>
                </h3>
                <p className="text-sm text-gray-600 mb-4 m-0">
                  Please let us know if you need any accommodations
                </p>
                
                <div className="space-y-3">
                  {[
                    "Wheelchair accessible room",
                    "Wheelchair accessible transportation",
                    "Visual accommodations",
                    "Hearing accommodations",
                    "Service animal accommodation",
                    "None needed"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 w-4 h-4"
                        checked={accessibilityNeeds.includes(item)}
                        onChange={() => toggleAccessibilityNeed(item)}
                      />
                      <label className="text-sm flex-1">{item}</label>
                    </div>
                  ))}
                  
                  <div className="mt-4">
                    <Label className="text-sm mb-2 block">Additional notes</Label>
                    <textarea
                      className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 bg-white resize-none"
                      rows={3}
                      placeholder="Please specify any other accessibility needs..."
                      value={accessibilityNotes}
                      onChange={(e) => setAccessibilityNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4">Food & dietary restrictions</h3>
                
                <div className="space-y-3 mb-5">
                  {[
                    "Vegetarian",
                    "Vegan",
                    "Gluten-free",
                    "Dairy-free",
                    "Nut allergy",
                    "Shellfish allergy",
                    "Kosher",
                    "Halal",
                    "No restrictions"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 w-4 h-4"
                        checked={dietaryRestrictions.includes(item)}
                        onChange={() => toggleDietaryRestriction(item)}
                      />
                      <label className="text-sm flex-1">{item}</label>
                    </div>
                  ))}
                </div>

                <div className="pt-5 border-t border-gray-200">
                  <div className="flex items-start gap-3 p-4 bg-[#18A0A6]/5 border border-[#18A0A6]/20 rounded-lg">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 w-4 h-4 mt-0.5"
                      checked={exploreRestaurants}
                      onChange={(e) => setExploreRestaurants(e.target.checked)}
                    />
                    <label className="text-sm flex-1">
                      I'd like to explore local restaurants within per-diem budget
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className={`bg-white border-t border-gray-200 ${isMobile ? 'p-4 sticky bottom-0' : 'p-6 rounded-xl mt-6 shadow-sm'}`}>
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              variant="outline"
              className="flex-1"
              disabled={isSaving}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          <Button
            onClick={() => {
              if (currentStep < totalSteps) {
                setCurrentStep(currentStep + 1);
              } else {
                handleSaveAndSubmit();
              }
            }}
            className="flex-1 bg-[#916AF5] hover:bg-[#7c5dd4] text-white"
            disabled={isSaving}
          >
            {currentStep < totalSteps ? (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            ) : (
              isSaving ? "Saving..." : "Save & Submit"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}