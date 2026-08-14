import { Search, UserPlus, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
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

interface PeopleAndPolicyProps {
  tripId: string | null;
  onNext: () => void;
  onBack: () => void;
}

export function PeopleAndPolicy({ tripId, onNext, onBack }: PeopleAndPolicyProps) {
  const [travelers, setTravelers] = useState<any[]>([]);
  const [autonomyLevel, setAutonomyLevel] = useState("suggest");
  const [budgetPerPerson, setBudgetPerPerson] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
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
      
      // Populate form fields
      if (trip.travelers && trip.travelers.length > 0) {
        setTravelers(trip.travelers);
      }
      setAutonomyLevel(trip.autonomy_level === "auto_book" ? "auto-book" : trip.autonomy_level === "auto_rebook" ? "auto-rebook" : "suggest");
      setBudgetPerPerson(trip.budget_per_person ? String(trip.budget_per_person) : "");
      setTotalBudget(trip.total_budget ? String(trip.total_budget) : "");
    } catch (err) {
      console.error("Error loading trip:", err);
      setError("Failed to load trip data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (!tripId) {
      setError("No trip ID found. Please return to dashboard.");
      return;
    }

    setIsSaving(true);
    setError(null);
    
    try {
      // Convert autonomy level to backend format
      const autonomyMapping: Record<string, string> = {
        "suggest": "suggest_only",
        "auto-book": "auto_book",
        "auto-rebook": "auto_rebook",
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-97df1df1/trips/${tripId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            travelers: travelers,
            autonomy_level: autonomyMapping[autonomyLevel],
            budget_per_person: budgetPerPerson ? Number(budgetPerPerson) : null,
            total_budget: totalBudget ? Number(totalBudget) : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save trip");
      }

      // Navigate to next screen
      onNext();
    } catch (err) {
      console.error("Error saving trip:", err);
      setError("Failed to save trip. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <WizardStepper steps={steps} currentStep={2} />

        <div className="grid grid-cols-12 gap-6 mt-8">
          {/* Left Column - Traveler Picker */}
          <div className="col-span-7">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="m-0">Travelers</h2>
                <Button variant="outline" size="sm" className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add traveler
                </Button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 bg-[#F5F7FA] border-gray-200"
                />
              </div>

              {/* Travelers Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm text-gray-600">Name</th>
                      <th className="text-left px-4 py-3 text-sm text-gray-600">Role</th>
                      <th className="text-left px-4 py-3 text-sm text-gray-600">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {travelers.map((traveler, index) => (
                      <tr key={traveler.id} className={index !== travelers.length - 1 ? "border-b border-gray-200" : ""}>
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm text-[#1F2933]">{traveler.name}</div>
                            <div className="text-xs text-gray-500">{traveler.email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-[#1246A5]/10 text-[#1246A5] border border-[#1246A5]/20">
                            {traveler.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white">
                            <option value="must">Must attend</option>
                            <option value="optional">Optional</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Guardrails */}
          <div className="col-span-5">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="mb-4">Autonomy & Guardrails</h2>

              {/* Autonomy Selector */}
              <div className="mb-6">
                <Label>Booking autonomy</Label>
                <RadioGroup defaultValue="suggest" className="mt-3 space-y-3">
                  <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="suggest" id="suggest" className="mt-0.5" />
                    <Label htmlFor="suggest" className="cursor-pointer flex-1 m-0">
                      <div className="text-sm">Suggest itineraries only</div>
                      <div className="text-xs text-gray-500 mt-0.5">Manual booking required</div>
                    </Label>
                  </div>
                  <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="auto-book" id="auto-book" className="mt-0.5" />
                    <Label htmlFor="auto-book" className="cursor-pointer flex-1 m-0">
                      <div className="text-sm">Auto-book policy-compliant</div>
                      <div className="text-xs text-gray-500 mt-0.5">Under budget per person</div>
                    </Label>
                  </div>
                  <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="auto-rebook" id="auto-rebook" className="mt-0.5" />
                    <Label htmlFor="auto-rebook" className="cursor-pointer flex-1 m-0">
                      <div className="text-sm">Auto-book & auto-rebook</div>
                      <div className="text-xs text-gray-500 mt-0.5">Within +10% of budget</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Budget Fields */}
              <div className="mb-6 space-y-3">
                <div>
                  <Label htmlFor="per-person-budget">Max per-person budget</Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="per-person-budget"
                      type="text"
                      placeholder="3,000"
                      className="pl-7 bg-[#F5F7FA] border-gray-200"
                      value={budgetPerPerson}
                      onChange={(e) => setBudgetPerPerson(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="total-budget">Total trip budget</Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="total-budget"
                      type="text"
                      placeholder="9,000"
                      className="pl-7 bg-[#F5F7FA] border-gray-200"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Approval Checkboxes */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <Checkbox id="approval-cost" className="mt-0.5" />
                  <Label htmlFor="approval-cost" className="text-sm cursor-pointer m-0">
                    Require approval if total cost exceeds $10,000
                  </Label>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox id="approval-time" className="mt-0.5" />
                  <Label htmlFor="approval-time" className="text-sm cursor-pointer m-0">
                    Require approval if travel time &gt; 8 hours
                  </Label>
                </div>
              </div>

              {/* Info Banner */}
              <div className="bg-[#18A0A6]/10 border border-[#18A0A6]/20 rounded-lg p-3 flex gap-2">
                <Info className="w-4 h-4 text-[#18A0A6] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#1F2933] m-0">
                  Within these limits, WorkTrip Autopilot can book and rebook on your behalf.
                </p>
              </div>
            </div>

            {/* Invite Link */}
            <div className="mt-4 text-center">
              <button className="text-sm text-[#1246A5] hover:underline">
                Invite travelers to fill preferences later
              </button>
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