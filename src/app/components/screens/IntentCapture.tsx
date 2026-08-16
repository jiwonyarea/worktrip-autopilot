import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Mic, MicOff, Square, MapPin, Calendar, Users, Briefcase, Sparkles, Loader2, Plane, Hotel, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Trip, DemoTrip, DemoCatalog, createTrip, updateTrip, parseIntentText, getDemoCatalog, detectLocation, DetectedLocation } from "../../utils/tripApi";
import { motion } from "motion/react";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { formatDateRange } from "../../utils/itinerary";
import heroLogo from "../../../assets/brand/worktrip-autopilot-mark.svg";

interface IntentCaptureProps {
  onStartPlanning: (tripId: string, trip: Trip) => void;
  tripId?: string | null;
  /** Open a pre-generated trip without running the agent. */
  onOpenDemoTrip?: (tripId: string) => void;
  /** Jump straight to a finished trip's expenses to file receipts. */
  onOpenTripExpenses?: (tripId: string) => void;
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

// Suggestion cards. Dates are generated relative to today rather than written
// in, so the examples never drift into the past — a past date makes flight
// search return nothing and the trip fail to generate.
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** A date `offsetDays` from today, as "Month D" — no year needed. */
function dayPhrase(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
}

/** Whole days from today to a YYYY-MM-DD date; null when unset. */
function daysUntil(iso?: string | null): number | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  const target = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

// Pills submit what they say. The agent infers the year and, where no origin
// is given, the departure city comes from location detection — so these read
// the way someone would actually type. The middle one needs a concrete start
// date, since "5 days" on its own has nothing to anchor to.
const INTENT_SUGGESTIONS = [
  {
    label: "Flying to Austin for SXSW, March 8-11",
    text: "Flying to Austin for SXSW, March 8-11",
  },
  {
    label: "NYC to London, 5 days, quarterly review",
    text: `NYC to London for 5 days starting ${dayPhrase(35)}, quarterly review`,
  },
  {
    label: "Pittsburgh to Chicago, Nov 10-12, client meeting",
    text: "Pittsburgh to Chicago, Nov 10-12, client meeting",
  },
];

export function IntentCapture({ onStartPlanning, tripId, onOpenDemoTrip, onOpenTripExpenses }: IntentCaptureProps) {
  const [intent, setIntent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [serverTrip, setServerTrip] = useState<Trip | null>(null);
  const [parsedFields, setParsedFields] = useState<ParsedFields | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [demoTrips, setDemoTrips] = useState<DemoTrip[]>([]);
  const [quota, setQuota] = useState<DemoCatalog["live_generation"] | null>(null);
  const [loadingDemos, setLoadingDemos] = useState(true);
  const [detectedOrigin, setDetectedOrigin] = useState<DetectedLocation | null>(null);

  // Resolve the departure city up front so people can say just a destination,
  // the way flight search sites behave. Failure is silent — the traveler can
  // always state an origin themselves.
  useEffect(() => {
    let cancelled = false;
    detectLocation()
      .then((location) => {
        if (!cancelled && location.detected) setDetectedOrigin(location);
      })
      .catch((error) => console.error("Location detection failed:", error));
    return () => {
      cancelled = true;
    };
  }, []);

  // Dictation. Finalised phrases append to `intent`; the in-progress phrase
  // lives in `interim` and is only displayed, so the parse never runs against
  // a half-spoken sentence.
  const appendTranscript = useCallback((transcript: string) => {
    setIntent((current) => {
      const trimmed = current.trimEnd();
      if (!trimmed) return transcript;
      // Speech results arrive without leading spaces or sentence punctuation.
      const separator = /[.!?]$/.test(trimmed) ? " " : " ";
      return `${trimmed}${separator}${transcript}`;
    });
  }, []);

  const speech = useSpeechRecognition({ onResult: appendTranscript });

  // Surface a blocked microphone once, rather than silently doing nothing.
  useEffect(() => {
    if (speech.error) toast.error(speech.error);
  }, [speech.error]);

  const displayedIntent = speech.interim
    ? `${intent}${intent && !intent.endsWith(" ") ? " " : ""}${speech.interim}`
    : intent;

  // Example trips are pre-generated, so this is a plain read.
  useEffect(() => {
    let cancelled = false;
    getDemoCatalog()
      .then((catalog) => {
        if (cancelled) return;
        setDemoTrips(catalog.trips);
        setQuota(catalog.live_generation);
      })
      .catch((error) => {
        console.error("Could not load example trips:", error);
      })
      .finally(() => {
        if (!cancelled) setLoadingDemos(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const inputRef = useRef<HTMLInputElement>(null);
  const parseTimeoutRef = useRef<NodeJS.Timeout>();

  // Intent parsing runs server-side (Claude), so phrasings and relative dates
  // that a regex can't handle — "next Tuesday", "the week of the 12th" — work.
  // Debounced while typing; the result also gates the Generate button.
  useEffect(() => {
    if (parseTimeoutRef.current) clearTimeout(parseTimeoutRef.current);

    // Hold off while someone is still speaking. Each finalised phrase would
    // otherwise fire its own parse against a half-finished sentence; this runs
    // once, on the whole thing, when they stop.
    if (speech.listening) return;

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
  }, [intent, speech.listening]);

  const handleSuggestionClick = (suggestionText: string) => {
    if (speech.listening) speech.stop();
    setIntent(suggestionText);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Detection supplies the origin only when the traveler did not state one.
  const effectiveOrigin = parsedFields?.origin_city || detectedOrigin?.city || "";
  const originWasDetected = Boolean(!parsedFields?.origin_city && detectedOrigin?.city);

  const isMissingCriticalFields =
    parsedFields && (!parsedFields.destination || !parsedFields.dates || !effectiveOrigin);

  const handleSubmit = async () => {
    if (speech.listening) speech.stop();

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
            origin_city: originWasDetected
              ? [detectedOrigin?.city, detectedOrigin?.region].filter(Boolean).join(", ")
              : parsedFields.origin_city,
            start_date: parsedFields.dates?.start_date,
            end_date: parsedFields.dates?.end_date,
            trip_name: parsedFields.trip_name,
            purpose: parsedFields.purpose,
          })
        : await createTrip({
            intentText: intent,
            destination: parsedFields.destination,
            origin_city: originWasDetected
              ? [detectedOrigin?.city, detectedOrigin?.region].filter(Boolean).join(", ")
              : parsedFields.origin_city,
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
      <div className="relative z-10 max-w-[1088px] mx-auto px-4 sm:px-6 pt-16 sm:pt-[112px]">
        {/* Centered Worktrip Autopilot Logo */}
        <div className="text-center mb-8">
          <img
            src={heroLogo}
            alt="Worktrip Autopilot"
            className="inline-block w-[244px] max-w-full h-auto"
          />
          <p className="mt-4 text-[14px] font-normal text-[#4a5565] m-0">
            Plan itineraries that fit your company's travel policy
          </p>
        </div>

        {/* Main Search Bar */}
        <div className="max-w-[710px] mx-auto mb-6">
          {/* The stroke is a wrapper rather than a border or ring, so the field
              and its outline are one shape and the shadow wraps both. */}
          <div className="bg-white/50 rounded-[57px] p-[6px] shadow-[0px_-4px_24px_rgba(0,0,0,0.06)]">
          <div className="relative bg-white/80 backdrop-blur-xl rounded-[51px] h-[56px] sm:h-[64px] flex items-center px-4 sm:px-6 gap-3 sm:gap-4">
            <input
              ref={inputRef}
              value={displayedIntent}
              onChange={(e) => setIntent(e.target.value)}
              // While dictating the field mirrors the live transcript, so it is
              // not a normal editable value until recording stops.
              readOnly={speech.listening}
              placeholder={
                speech.listening
                  ? "Listening — start describing the trip…"
                  : "Tell me about your next trip"
              }
              className="flex-1 bg-transparent border-none outline-none text-[#717182] text-[16px] tracking-[-0.15px] placeholder:text-[#717182] min-w-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />

            {speech.supported ? (
              <button
                type="button"
                onClick={() => (speech.listening ? speech.stop() : speech.start())}
                aria-label={speech.listening ? "Stop dictating" : "Dictate your trip"}
                aria-pressed={speech.listening}
                title={
                  speech.listening
                    ? "Stop dictating"
                    : speech.embedded
                      ? "Voice input usually needs a real browser window — open this in Chrome, Edge, or Safari"
                      : "Dictate your trip"
                }
                className={`flex-shrink-0 relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  speech.listening
                    ? "bg-[#916AF5] text-white"
                    : "text-[#767676] hover:bg-black/5"
                }`}
              >
                {speech.listening ? (
                  <>
                    {/* Pulse conveys that audio is being captured right now. */}
                    <span className="absolute inset-0 rounded-full bg-[#916AF5] opacity-60 animate-ping" />
                    <Square className="w-4 h-4 relative z-10 fill-current" />
                  </>
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
            ) : (
              <span
                title="Voice input needs Chrome, Edge, or Safari"
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[#c4c7ce] cursor-not-allowed"
              >
                <MicOff className="w-5 h-5" />
              </span>
            )}
          </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#4a5565]" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 m-0">From</p>
                    <p className="text-sm text-gray-900 m-0 flex items-center gap-1.5 flex-wrap">
                      {effectiveOrigin || (
                        <span className="text-amber-600">Not detected</span>
                      )}
                      {originWasDetected && (
                        // Say where this came from, so an IP-based guess is
                        // never mistaken for something the traveler said.
                        <span className="text-[11px] text-[#916AF5] bg-[#EDE7FD] rounded-full px-2 py-0.5 whitespace-nowrap">
                          your location
                        </span>
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
                        formatDateRange(parsedFields.dates.start_date, parsedFields.dates.end_date)
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

        {/* Example prompts. Each pill shows a shortened label but submits the
            full sentence, so the agent still gets dates and traveler counts. */}
        <div className="flex flex-wrap justify-center gap-3 mb-[60px]">
          {INTENT_SUGGESTIONS.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion.text)}
              title={suggestion.text}
              className="bg-white/60 backdrop-blur-sm border border-[#D8D3E5] rounded-full hover:bg-white/80 transition-all w-full sm:w-[280px] h-[40px] px-[18px] py-[10px] flex items-center gap-2 text-left"
            >
              <Sparkles className="w-[18px] h-[18px] text-[#916AF5] flex-shrink-0" />
              <span className="text-[12px] font-normal text-[#4a5565] truncate">
                {suggestion.label}
              </span>
            </button>
          ))}
        </div>

        {/* Recent Trips. These are the pre-generated demo trips, so opening
            one costs nothing and works even when the daily quota is spent. */}
        <div className="max-w-[700px] mx-auto">
          <div className="flex items-baseline justify-between gap-4 mb-[14px]">
            <h2 className="text-[14px] font-semibold text-[#1f2933] m-0">Recent Trips</h2>
            {quota && !quota.available && (
              <span className="text-[12px] text-[#4a5565]">
                Today's live runs are used up
              </span>
            )}
          </div>

          {loadingDemos && (
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm h-[90px] px-6 flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-[#916AF5]" />
              <span className="text-[14px] text-[#4a5565]">Loading trips…</span>
            </div>
          )}

          {!loadingDemos && demoTrips.length === 0 && (
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm h-[90px] px-6 flex items-center">
              <p className="text-[14px] text-[#4a5565] m-0">
                No trips yet — describe one above and the agent will plan it.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-[14px]">
            {demoTrips.slice(0, 2).map((demo) => {
              // A trip that has finished is only kept for its expense record:
              // no countdown to show, and the action is filing receipts.
              const daysAway = daysUntil(demo.start_date);
              const hasEnded = (daysUntil(demo.end_date) ?? 0) < 0;
              return (
                <div
                  key={demo.trip_id}
                  className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.06)] w-full h-[90px] p-[18px] flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-[9px]">
                      <h3 className="text-[16px] font-semibold text-[#1f2933] m-0 truncate">
                        {demo.label}
                      </h3>
                      {!hasEnded && daysAway !== null && daysAway >= 0 && (
                        <span className="min-w-[40px] h-[22px] px-[8px] rounded-full bg-[#EEE9FD] border border-[#916AF5] text-[#916AF5] text-[11px] font-medium flex items-center justify-center flex-shrink-0">
                          D-{daysAway}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-[14px] font-normal text-[#4a5565] flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {demo.destination}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDateRange(demo.start_date, demo.end_date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {demo.travelers} traveler{demo.travelers === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onOpenDemoTrip?.(demo.trip_id)}
                      className="min-w-[54px] h-[28px] px-3 rounded-[8px] border border-[#D8D3E5] bg-[#F2F1F8] text-[#916AF5] text-[14px] font-medium hover:bg-[#ddd0ff] transition-colors"
                    >
                      View
                    </button>
                    {hasEnded ? (
                      <button
                        onClick={() => onOpenTripExpenses?.(demo.trip_id)}
                        className="min-w-[54px] h-[28px] px-3 rounded-[8px] bg-[#916AF5] text-white text-[14px] font-medium hover:bg-[#7c5dd4] transition-colors whitespace-nowrap"
                      >
                        Upload Receipt
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenDemoTrip?.(demo.trip_id)}
                        className="min-w-[54px] h-[28px] px-3 rounded-[8px] border border-[#D8D3E5] bg-[#F2F1F8] text-[#916AF5] text-[14px] font-medium hover:bg-[#ddd0ff] transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
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