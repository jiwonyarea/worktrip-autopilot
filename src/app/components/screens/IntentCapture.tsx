import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Mic, MapPin, Calendar, Users, Briefcase, Sparkles, Loader2, Plane, Hotel, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Trip, createTrip, updateTrip, parseIntentText } from "../../utils/tripApi";
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
  purpose?: string;
}

// Helper function to format date string without timezone conversion
function formatDateString(dateStr: string, format: 'short' | 'long' = 'short'): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const monthNames = format === 'short' 
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${monthNames[month - 1]} ${day}, ${year}`;
}

// Suggestion cards. Dates are generated relative to today rather than written
// in, so the examples never drift into the past — a past date makes flight
// search return nothing and the trip fail to generate.
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function exampleDates(startOffsetDays: number, tripLengthDays: number) {
  const start = new Date();
  start.setDate(start.getDate() + startOffsetDays);
  const end = new Date(start);
  end.setDate(end.getDate() + tripLengthDays);

  const phrase = (d: Date) => `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
  return `from ${phrase(start)} to ${phrase(end)} of ${end.getFullYear()}`;
}

const INTENT_SUGGESTIONS = [
  {
    label: "Conference trip",
    text: `Book me a trip from San Francisco to Seattle ${exampleDates(30, 3)} for 3 passengers. The purpose of this trip is a conference.`,
  },
  {
    label: "Client visit",
    text: `Book me a trip from Boston to New York City ${exampleDates(21, 2)} for 2 passengers. The purpose of this trip is a client meeting.`,
  },
  {
    label: "Team offsite",
    text: `Book me a trip from Los Angeles to Austin ${exampleDates(45, 4)} for 10 passengers. The purpose of this trip is an offsite.`,
  },
];

export function IntentCapture({ onStartPlanning, tripId }: IntentCaptureProps) {
  const [intent, setIntent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [serverTrip, setServerTrip] = useState<Trip | null>(null);
  const [parsedFields, setParsedFields] = useState<ParsedFields | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const parseTimeoutRef = useRef<NodeJS.Timeout>();

  // Intent parsing runs server-side (Claude), so phrasings and relative dates
  // that a regex can't handle — "next Tuesday", "the week of the 12th" — work.
  // Debounced while typing; the result also gates the Generate button.
  useEffect(() => {
    if (parseTimeoutRef.current) clearTimeout(parseTimeoutRef.current);

    const text = intent.trim();
    if (text.length < 12) {
      setParsedFields(null);
      setIsParsing(false);
      setParseError(null);
      return;
    }

    setIsParsing(true);
    setParseError(null);

    // Only the newest request may write state — earlier ones are stale.
    let cancelled = false;
    parseTimeoutRef.current = setTimeout(async () => {
      try {
        const parsed = await parseIntentText(text);
        if (cancelled) return;
        setParsedFields({
          origin_city: parsed.origin_city || undefined,
          destination: parsed.destination_city || undefined,
          dates:
            parsed.start_date && parsed.end_date
              ? { start_date: parsed.start_date, end_date: parsed.end_date }
              : undefined,
          travelers_count: parsed.travelers_count || 1,
          trip_name: parsed.trip_name || undefined,
          purpose: parsed.purpose || undefined,
        });
      } catch (error) {
        if (cancelled) return;
        setParsedFields(null);
        setParseError(
          error instanceof Error ? error.message : "Could not read those details",
        );
      } finally {
        if (!cancelled) setIsParsing(false);
      }
    }, 700);

    return () => {
      cancelled = true;
      if (parseTimeoutRef.current) clearTimeout(parseTimeoutRef.current);
    };
  }, [intent]);

  const handleSuggestionClick = (suggestionText: string) => {
    setIntent(suggestionText);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const isMissingCriticalFields =
    parsedFields && (!parsedFields.destination || !parsedFields.dates || !parsedFields.origin_city);

  const handleSubmit = async () => {
    if (!intent.trim()) {
      toast.error("Tell me about the trip first");
      return;
    }
    if (!parsedFields?.destination) {
      toast.error("Which city is the trip to?");
      return;
    }

    setIsCreating(true);

    try {
      const trip = serverTrip
        ? await updateTrip(serverTrip.id, {
            intent_text: intent,
            destination: parsedFields.destination,
            origin_city: parsedFields.origin_city,
            start_date: parsedFields.dates?.start_date,
            end_date: parsedFields.dates?.end_date,
            trip_name: parsedFields.trip_name,
            purpose: parsedFields.purpose,
          })
        : await createTrip({
            intentText: intent,
            destination: parsedFields.destination,
            origin_city: parsedFields.origin_city,
            start_date: parsedFields.dates?.start_date,
            end_date: parsedFields.dates?.end_date,
            travelers_count: parsedFields.travelers_count,
            trip_name: parsedFields.trip_name,
            purpose: parsedFields.purpose,
            organizer_name: "Sarah Chen",
            organizer_email: "sarah.chen@company.com",
          });

      setServerTrip(trip);
      onStartPlanning(trip.id, trip);
    } catch (error) {
      // Surface the real failure rather than substituting placeholder data —
      // a fake trip here just moves the error to a later, more confusing screen.
      console.error("Trip creation failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not start planning this trip",
      );
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
              placeholder={`Try: Book me a trip from Pittsburgh to New York City ${exampleDates(30, 3)} for 2 passengers`}
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

        {/* Reading state — the parse round-trips to the agent, so say so. */}
        {isParsing && !parsedFields && (
          <div className="max-w-[710px] mx-auto mb-6">
            <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm p-5 flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-[#916AF5]" />
              <span className="text-sm text-gray-700">Reading your trip details…</span>
            </div>
          </div>
        )}

        {parseError && !isParsing && (
          <div className="max-w-[710px] mx-auto mb-6">
            <div className="bg-white/60 backdrop-blur-sm border border-amber-200 rounded-2xl shadow-sm p-5 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">{parseError}</span>
            </div>
          </div>
        )}

        {/* Parsed Fields Preview (appears under search when text is filled) */}
        {parsedFields && intent.trim() && (
          <div className="max-w-[710px] mx-auto mb-6">
            <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isParsing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#916AF5]" />
                      <span className="text-sm text-gray-700 font-medium">Updating…</span>
                    </>
                  ) : isMissingCriticalFields ? (
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
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#4a5565]" />
                  <div>
                    <p className="text-xs text-gray-500 m-0">From</p>
                    <p className="text-sm text-gray-900 m-0">
                      {parsedFields.origin_city || (
                        <span className="text-amber-600">Not detected</span>
                      )}
                    </p>
                  </div>
                </div>
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
                  disabled={!intent.trim() || isCreating || isParsing || !!isMissingCriticalFields}
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