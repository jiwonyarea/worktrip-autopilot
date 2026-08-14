import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Mic, MapPin, Calendar, Users, Briefcase, Sparkles, Loader2, Plane, Hotel, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Trip, createTrip, updateTrip, getTrip } from "../../utils/tripApi";
import { motion } from "motion/react";
import svgPaths from "../../imports/svg-8jn7paqll6";

interface IntentCaptureProps {
  onStartPlanning: (tripId: string, trip: Trip) => void;
  tripId?: string | null;
}

// Parsed fields interface
interface ParsedFields {
  origin_city?: string;
  destination?: string;
  dates?: {
    start_date?: string;
    end_date?: string;
  };
  travelers_count?: number;
  trip_name?: string;
}

// Helper function to format date string without timezone conversion
function formatDateString(dateStr: string, format: 'short' | 'long' = 'short'): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const monthNames = format === 'short' 
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${monthNames[month - 1]} ${day}, ${year}`;
}

// Smart suggestion cards for quick examples
const INTENT_SUGGESTIONS = [
  {
    label: "Conference trip",
    text: "Book me a trip from San Francisco to Seattle from December 5 to December 8 of 2025 for 3 passengers. The purpose of this trip is a conference.",
  },
  {
    label: "Client visit",
    text: "Book me a trip from Boston to New York City from January 15 to January 18 of 2026 for 2 passengers. The purpose of this trip is a client meeting.",
  },
  {
    label: "Team offsite",
    text: "Book me a trip from Los Angeles to Austin from March 10 to March 14 of 2026 for 10 passengers. The purpose of this trip is an offsite.",
  },
];

export function IntentCapture({ onStartPlanning, tripId }: IntentCaptureProps) {
  const [intent, setIntent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [serverTrip, setServerTrip] = useState<Trip | null>(null);
  const [parsedFields, setParsedFields] = useState<ParsedFields | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const parseTimeoutRef = useRef<NodeJS.Timeout>();

  // Enhanced parser - keeping the existing parsing logic
  const parseIntent = (intentText: string): ParsedFields => {
    const overrides: any = {};
    
    // Extract origin and destination
    const fromToMatch = intentText.match(/\bfrom\s+([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*|[A-Z]{2,4})\s+to\s+([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*|[A-Z]{2,4})(?:\s+from|\s+for|\s+of|\s+\d|,|\.|!|$)/i);
    
    if (fromToMatch && fromToMatch[1] && fromToMatch[2]) {
      overrides.origin_city = fromToMatch[1].trim();
      overrides.destination = fromToMatch[2].trim();
    } else {
      const destinationMatch = intentText.match(/(?:to|in)\s+([A-Z][A-Za-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]{2,4})(?:\s+for|,|with|\s+next|\s+this|\s+on|\s+Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|\s+\d|$)/i);
      if (destinationMatch && destinationMatch[1]) {
        overrides.destination = destinationMatch[1].trim();
      }
    }

    // Extract traveler count
    const forCountMatch = intentText.match(/\bfor\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:passenger|people|person|traveler|teammate|attendee)s?\b/i);
    if (forCountMatch && forCountMatch[1]) {
      const wordNumberMap: { [key: string]: number } = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
      };
      const countStr = forCountMatch[1];
      overrides.travelers_count = wordNumberMap[countStr.toLowerCase()] || parseInt(countStr, 10);
    }

    // Extract dates
    const currentYear = new Date().getFullYear();
    const fullDateWithYearMatch = intentText.match(/(?:from\s+)?(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})(?:\s+to\s+|\s*[-–—]\s*)(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})(?:\s+of\s+|\s*,\s*)?(\d{4})/i);
    
    if (fullDateWithYearMatch) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const startMonthName = fullDateWithYearMatch[1];
      const startDay = parseInt(fullDateWithYearMatch[2], 10);
      const endMonthName = fullDateWithYearMatch[3];
      const endDay = parseInt(fullDateWithYearMatch[4], 10);
      const explicitYear = parseInt(fullDateWithYearMatch[5], 10);
      
      let startMonthIndex = monthAbbr.findIndex(m => m.toLowerCase() === startMonthName.toLowerCase());
      if (startMonthIndex === -1) {
        startMonthIndex = monthNames.findIndex(m => m.toLowerCase() === startMonthName.toLowerCase());
      }
      
      let endMonthIndex = monthAbbr.findIndex(m => m.toLowerCase() === endMonthName.toLowerCase());
      if (endMonthIndex === -1) {
        endMonthIndex = monthNames.findIndex(m => m.toLowerCase() === endMonthName.toLowerCase());
      }
      
      if (startMonthIndex !== -1 && endMonthIndex !== -1) {
        const startMonth = String(startMonthIndex + 1).padStart(2, '0');
        const startDayStr = String(startDay).padStart(2, '0');
        const endMonth = String(endMonthIndex + 1).padStart(2, '0');
        const endDayStr = String(endDay).padStart(2, '0');
        
        overrides.dates = {
          start_date: `${explicitYear}-${startMonth}-${startDayStr}`,
          end_date: `${explicitYear}-${endMonth}-${endDayStr}`,
        };
      }
    }

    // Extract trip purpose
    const explicitPurposeMatch = intentText.match(/\bpurpose\s+of\s+(?:this|the)\s+trip\s+is\s+(?:a\s+)?(\w+(?:\s+\w+)?)/i);
    if (explicitPurposeMatch && explicitPurposeMatch[1]) {
      const purposeText = explicitPurposeMatch[1].toLowerCase();
      if (purposeText.includes('conference')) {
        overrides.trip_name = "Conference Trip";
      } else if (purposeText.includes('client') || purposeText.includes('visit') || purposeText.includes('meeting')) {
        overrides.trip_name = "Client Visit";
      } else if (purposeText.includes('offsite')) {
        overrides.trip_name = "Team Offsite";
      }
    }

    return overrides;
  };

  // Debounced parsing effect
  useEffect(() => {
    if (parseTimeoutRef.current) {
      clearTimeout(parseTimeoutRef.current);
    }

    if (!intent.trim()) {
      setParsedFields(null);
      return;
    }

    parseTimeoutRef.current = setTimeout(() => {
      const parsed = parseIntent(intent);
      setParsedFields(parsed);
    }, 500);

    return () => {
      if (parseTimeoutRef.current) {
        clearTimeout(parseTimeoutRef.current);
      }
    };
  }, [intent]);

  const handleSuggestionClick = (suggestionText: string) => {
    setIntent(suggestionText);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const isMissingCriticalFields = parsedFields && (!parsedFields.destination || !parsedFields.dates);

  const handleSubmit = async () => {
    if (!intent.trim()) {
      toast.error("Please describe your trip");
      return;
    }

    setIsCreating(true);

    try {
      const parsedOverrides = parseIntent(intent);
      
      if (!parsedOverrides.destination) {
        toast.error("Please specify a destination city in your trip description");
        setIsCreating(false);
        return;
      }
      
      const payload = {
        intentText: intent,
        overrides: parsedOverrides,
        organizer_name: "Sarah Chen",
        organizer_email: "sarah.chen@company.com",
      };

      let trip: Trip;
      
      try {
        if (serverTrip) {
          trip = await updateTrip(serverTrip.id, {
            intent_text: intent,
            ...parsedOverrides,
          });
          toast.success("Trip updated successfully!");
        } else {
          trip = await createTrip(payload);
          toast.success("Trip created successfully!");
        }
      } catch (apiError) {
        // toast.info("Demo Mode", {
        //   description: "Using mock data for demonstration purposes"
        // });
        
        trip = {
          id: `demo-trip-${Date.now()}`,
          organizer_id: null,
          organizer_name: payload.organizer_name || "Sarah Chen",
          organizer_email: payload.organizer_email || "sarah.chen@company.com",
          intent_text: intent,
          inferred_trip_name: parsedOverrides.trip_name || null,
          inferred_destination: parsedOverrides.destination || null,
          inferred_dates: parsedOverrides.dates || null,
          trip_name: parsedOverrides.trip_name || `Trip to ${parsedOverrides.destination}`,
          destination: parsedOverrides.destination || "",
          start_date: parsedOverrides.dates?.start_date || null,
          end_date: parsedOverrides.dates?.end_date || null,
          purpose: parsedOverrides.trip_name || "Business Trip",
          budget_per_person: null,
          total_budget: null,
          autonomy_level: "medium",
          travelers: [],
          survey_config: null,
          status: "planning" as const,
          selected_itinerary_id: null,
          confirmations: null,
          booked_at: null,
          itineraries: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      setServerTrip(trip);
      onStartPlanning(trip.id, trip);
    } catch (error) {
      toast.error(`Failed to ${serverTrip ? "update" : "create"} trip.`);
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Content Container */}
      <div className="relative z-10 max-w-[1088px] mx-auto px-6 pt-[112px]">
        {/* Centered Worktrip Autopilot Logo */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <h1 className="capitalize font-['Poppins:Medium',sans-serif] text-[58px] leading-[55px] tracking-[-2.92px] mb-0">
              <span className="text-white font-[Poppins] font-bold">Worktrip</span>
              <br />
              <span className="text-[#916af5] font-[Poppins] font-bold">Autopilot</span>
            </h1>
            {/* Underline SVG */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[110px] w-[152px] h-[14px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 152.768 14.0571">
                <path d={svgPaths.p318e5100} stroke="#916AF5" strokeWidth="4.9144" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Search Bar */}
        <div className="max-w-[710px] mx-auto mb-6">
          <div className="relative bg-white/80 backdrop-blur-xl rounded-[57px] border-[1.818px] border-white/50 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] h-[64px] flex items-center px-6 gap-4">
            <input
              ref={inputRef}
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="Try: Book me a trip from Pittsburgh to New York City from December 22 to December 30 of ..."
              className="flex-1 bg-transparent border-none outline-none text-[#717182] text-[14px] tracking-[-0.15px] placeholder:text-[#717182]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button className="flex-shrink-0">
              <Mic className="w-6 h-6 text-[#767676]" />
            </button>
          </div>
        </div>

        {/* Parsed Fields Preview (appears under search when text is filled) */}
        {parsedFields && intent.trim() && (
          <div className="max-w-[710px] mx-auto mb-6">
            <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isMissingCriticalFields ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-gray-700 font-medium">Missing required details</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700 font-medium">Trip details detected</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {parsedFields.origin_city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#4a5565]" />
                    <div>
                      <p className="text-xs text-gray-500 m-0">From</p>
                      <p className="text-sm text-gray-900 m-0">{parsedFields.origin_city}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#4a5565]" />
                  <div>
                    <p className="text-xs text-gray-500 m-0">Destination</p>
                    <p className="text-sm text-gray-900 m-0">
                      {parsedFields.destination || <span className="text-amber-600">Not detected</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#4a5565]" />
                  <div>
                    <p className="text-xs text-gray-500 m-0">Dates</p>
                    <p className="text-sm text-gray-900 m-0">
                      {parsedFields.dates ? (
                        `${formatDateString(parsedFields.dates.start_date)} – ${formatDateString(parsedFields.dates.end_date)}`
                      ) : (
                        <span className="text-amber-600">Not detected</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <div>
                    <p className="text-xs text-gray-500 m-0">Travelers</p>
                    <p className="text-sm text-gray-900 m-0">
                      {parsedFields.travelers_count ? `${parsedFields.travelers_count} traveler${parsedFields.travelers_count > 1 ? 's' : ''}` : '1 traveler'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={handleSubmit}
                  disabled={!intent.trim() || isCreating || isMissingCriticalFields}
                  className="w-full bg-[#916AF5] hover:bg-[#7c5dd4] text-white rounded-full py-[22px] px-[12px]"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate options
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Suggestion Cards */}
        <div className="flex gap-3 justify-center mb-12">
          {INTENT_SUGGESTIONS.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion.text)}
              className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm hover:shadow-md hover:bg-white/80 transition-all p-4 w-[254px] text-left"
            >
              <p className="text-xs font-medium text-[#101828] m-0 mb-1">{suggestion.label}</p>
              <p className="text-xs text-[#4a5565] m-0 line-clamp-2">{suggestion.text}</p>
            </button>
          ))}
        </div>

        {/* My Itinerary Section (matching Figma design) */}
        <div className="max-w-[1088px] mx-auto">
          <h2 className="text-[#1f2933] text-base font-semibold mb-4">My Itinerary</h2>
          
          {/* Trip Card 1 */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6 mb-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[#1f2933] text-base font-semibold m-0">Sales Kickoff 2026</h3>
                  <Badge className="bg-[#d1f4e0] text-[#52c93f] border border-[rgba(31,157,85,0.36)] rounded-full px-3 py-1 text-xs">
                    ✓ Booked
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#4a5565]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Las Vegas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>2026-01-20 - 2026-01-25</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>1 traveler</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>Sales kickoff</span>
                  </div>
                </div>
              </div>
              <Button className="bg-[#F2F1F8] text-[#916AF5] border border-[#916AF5] hover:bg-[#ddd0ff] rounded-lg px-4 py-2 text-sm self-center">
                View
              </Button>
            </div>
          </div>

          {/* Trip Card 2 */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[#1f2933] text-base font-semibold m-0">Client Visit - Acme Corp</h3>
                  <Badge className="bg-[#d1f4e0] text-[#52c93f] border border-[rgba(31,157,85,0.36)] rounded-full px-3 py-1 text-xs">
                    ✓ Booked
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#4a5565]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Chicago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>2026-02-10 - 2026-02-12</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>3 travelers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>Client meeting</span>
                  </div>
                </div>
              </div>
              <Button className="bg-[#F2F1F8] text-[#916AF5] border border-[#916AF5] hover:bg-[#ddd0ff] rounded-lg px-4 py-2 text-sm self-center">
                View
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}