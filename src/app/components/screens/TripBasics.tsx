import { Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { WizardStepper } from "../WizardStepper";
import { PolicyCard } from "../PolicyCard";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { useState, useEffect } from "react";

const steps = [
  { number: 1, label: "Basics" },
  { number: 2, label: "People & Policy" },
  { number: 3, label: "Preferences" },
  { number: 4, label: "Options" },
  { number: 5, label: "Confirm" }
];

interface TripBasicsProps {
  tripId: string | null;
  onNext: () => void;
  onBack: () => void;
}

export function TripBasics({ tripId, onNext, onBack }: TripBasicsProps) {
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [purpose, setPurpose] = useState("");
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
      setTripName(trip.trip_name || "");
      setDestination(trip.destination || "");
      setStartDate(trip.start_date || "");
      setEndDate(trip.end_date || "");
      setPurpose(trip.purpose || "");
    } catch (err) {
      console.error("Error loading trip:", err);
      setError("Failed to load trip data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (!tripId) {
      setError("No trip ID found. Please return to dashboard and create a new trip.");
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
            trip_name: tripName,
            destination: destination,
            start_date: startDate,
            end_date: endDate,
            purpose: purpose,
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
        <WizardStepper steps={steps} currentStep={1} />

        <div className="grid grid-cols-12 gap-6 mt-8">
          {/* Left Column - Form */}
          <div className="col-span-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="mb-6">Trip Basics</h2>

              <div className="space-y-5">
                {/* Trip Name */}
                <div>
                  <Label htmlFor="trip-name">Trip name</Label>
                  <Input
                    id="trip-name"
                    type="text"
                    placeholder="e.g., AWS re:Invent 2025"
                    className="mt-1.5 bg-[#F5F7FA] border-gray-200"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                  />
                </div>

                {/* Destination */}
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    type="text"
                    placeholder="Search for city or venue..."
                    className="mt-1.5 bg-[#F5F7FA] border-gray-200"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1 m-0">
                    Try searching "AWS re:Invent" or "Las Vegas, NV"
                  </p>
                </div>

                {/* Date Range */}
                <div>
                  <Label htmlFor="dates">Trip dates</Label>
                  <div className="grid grid-cols-2 gap-3 mt-1.5">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Start date"
                        className="pl-10 bg-[#F5F7FA] border-gray-200"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="End date"
                        className="pl-10 bg-[#F5F7FA] border-gray-200"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Flexibility Chips */}
                <div>
                  <Label>Date flexibility (optional)</Label>
                  <div className="flex gap-2 mt-1.5">
                    <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                      Arrive 1 day early
                    </button>
                    <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                      Leave 1 day late
                    </button>
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <Label htmlFor="purpose">Trip purpose</Label>
                  <Select defaultValue={purpose} onValueChange={setPurpose}>
                    <SelectTrigger id="purpose" className="mt-1.5 bg-[#F5F7FA] border-gray-200">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="client-visit">Client visit</SelectItem>
                      <SelectItem value="internal-offsite">Internal offsite</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Policy Summary */}
          <div className="col-span-4">
            <PolicyCard />
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