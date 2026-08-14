import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { WizardStepper } from "../WizardStepper";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { useState, useEffect } from "react";

const steps = [
  { number: 1, label: "Basics" },
  { number: 2, label: "People & Policy" },
  { number: 3, label: "Preferences" },
  { number: 4, label: "Options" },
  { number: 5, label: "Confirm" }
];

const surveySections = [
  { id: "flight-times", label: "Flight times", required: true },
  { id: "seat-mobility", label: "Seat & mobility", required: false },
  { id: "hotel", label: "Hotel preferences", required: true },
  { id: "room-sharing", label: "Room sharing", required: false },
  { id: "accessibility", label: "Accessibility", required: true },
  { id: "food-dietary", label: "Food & dietary restrictions", required: true },
  { id: "free-time", label: "Free time / exploration", required: false },
];

interface PreferenceSetupProps {
  tripId: string | null;
  onNext: () => void;
  onBack: () => void;
}

export function PreferenceSetup({ tripId, onNext, onBack }: PreferenceSetupProps) {
  const [surveyConfig, setSurveyConfig] = useState({
    flight_times: true,
    seat_mobility: false,
    hotel: true,
    room_sharing: false,
    accessibility: true,
    food_dietary: true,
    free_time: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load trip data on mount
  useEffect(() => {
    if (tripId) {
      loadTrip();
    }
  }, [tripId]);

  const loadTrip = async () => {
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
      
      // Populate survey config
      if (trip.survey_config) {
        setSurveyConfig(trip.survey_config);
      }
    } catch (err) {
      console.error("Error loading trip:", err);
      setError("Failed to load trip data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (sectionId: string, checked: boolean) => {
    // Map UI IDs to backend keys
    const keyMap: Record<string, keyof typeof surveyConfig> = {
      "flight-times": "flight_times",
      "seat-mobility": "seat_mobility",
      "hotel": "hotel",
      "room-sharing": "room_sharing",
      "accessibility": "accessibility",
      "food-dietary": "food_dietary",
      "free-time": "free_time",
    };

    const key = keyMap[sectionId];
    if (key) {
      setSurveyConfig(prev => ({ ...prev, [key]: checked }));
    }
  };

  const getConfigValue = (sectionId: string): boolean => {
    const keyMap: Record<string, keyof typeof surveyConfig> = {
      "flight-times": "flight_times",
      "seat-mobility": "seat_mobility",
      "hotel": "hotel",
      "room-sharing": "room_sharing",
      "accessibility": "accessibility",
      "food-dietary": "food_dietary",
      "free-time": "free_time",
    };
    const key = keyMap[sectionId];
    return key ? surveyConfig[key] : false;
  };

  const handleNext = async () => {
    if (!tripId) {
      setError("No trip ID found. Please return to dashboard.");
      return;
    }

    setIsSaving(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-97df1df1/trips/${tripId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            survey_config: surveyConfig,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save trip");
      }

      // Navigate to F1.5 Agent Working (control center)
      onNext();
    } catch (err) {
      console.error("Error saving trip:", err);
      setError("Failed to save trip. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviewSurvey = () => {
    // Optional: Open survey in preview mode
    // This could open F1.4 in a new window or navigate to it
    console.log("Preview survey clicked - would show F1.4 preview");
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <WizardStepper steps={steps} currentStep={3} />

        <div className="grid grid-cols-12 gap-6 mt-8">
          {/* Left Column - Survey Configuration */}
          <div className="col-span-5">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="mb-2">Configure Traveler Survey</h2>
              <p className="text-sm text-gray-600 mb-6 m-0">
                Select which sections travelers will be asked to complete
              </p>

              <div className="space-y-3">
                {surveySections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <Label htmlFor={section.id} className="cursor-pointer flex items-center gap-2 m-0">
                        <span>{section.label}</span>
                        {section.required && (
                          <span className="text-xs text-[#D64545]">*</span>
                        )}
                      </Label>
                    </div>
                    <Switch
                      id={section.id}
                      defaultChecked={section.required}
                      disabled={section.required}
                      checked={getConfigValue(section.id)}
                      onCheckedChange={(checked) => handleToggle(section.id, checked)}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button className="w-full bg-[#18A0A6] hover:bg-[#138b91] text-white gap-2">
                  <Send className="w-4 h-4" />
                  Invite travelers now
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2 m-0">
                  Travelers will receive an email with the survey link
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Survey Preview */}
          <div className="col-span-7">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="m-0">Survey Preview</h2>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  Traveler view
                </span>
              </div>

              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {/* Flight Times Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="mb-3">Flight times</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Preferred departure time</Label>
                      <div className="flex gap-2 mt-2">
                        {["Morning", "Afternoon", "Evening", "Flexible"].map((time) => (
                          <button
                            key={time}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:border-[#1246A5] hover:bg-[#1246A5]/5"
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Comfort vs. Cost preference</Label>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xs text-gray-500">Lower cost</span>
                        <input type="range" className="flex-1" />
                        <span className="text-xs text-gray-500">More comfort</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hotel Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="mb-3">Hotel preferences</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Distance from venue</Label>
                      <select className="w-full mt-1.5 text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white">
                        <option>Walking distance preferred</option>
                        <option>Up to 15 minutes travel</option>
                        <option>Up to 30 minutes travel</option>
                        <option>Flexible</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Accessibility Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="mb-3">
                    Accessibility <span className="text-[#D64545]">*</span>
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Wheelchair accessible room",
                      "Visual accommodations",
                      "Hearing accommodations",
                      "Other (please specify)"
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <label className="text-sm">{item}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Food & Dietary Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="mb-3">Food & dietary restrictions</h3>
                  <div className="space-y-2">
                    {[
                      "Vegetarian",
                      "Vegan",
                      "Gluten-free",
                      "Dairy-free",
                      "Nut allergy",
                      "Kosher",
                      "Halal"
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <label className="text-sm">{item}</label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <label className="text-sm">
                        I'd like to explore local restaurants within per-diem
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button 
            onClick={onBack}
            variant="outline"
            className="border-gray-300"
          >
            Back
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-[#916AF5] hover:bg-[#7c5dd4] text-white px-8"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}