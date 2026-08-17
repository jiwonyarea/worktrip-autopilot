import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  Sparkles,
  Loader2,
  ChevronLeft,
  Plane,
  Hotel,
  Car,
  Utensils,
  Check,
  Minus,
} from "lucide-react";
import { Trip, getTrip } from "../../utils/tripApi";
import { TripSummaryCard } from "../TripSummaryCard";
import { getAirlineLogo } from "../../utils/airlineLogos";
import { parseFlight, formatMoney, nightsBetween } from "../../utils/itinerary";
import svgPaths from "../../imports/svg-26i6mfklc7";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import bgImage from "figma:asset/68491a71f021c38c1c7368d77b05b5434580c49f.png";

interface ReviewAndApproveProps {
  onApprove: () => void;
  onEditItinerary?: (itineraryId: string) => void;
  onBack?: () => void;
  /** Return to the search screen with the original wording intact. */
  onEditTrip?: () => void;
  tripId?: string | null;
}


export function ReviewAndApprove({ onApprove, onEditItinerary, onBack, onEditTrip, tripId }: ReviewAndApproveProps) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedItineraryId, setSelectedItineraryId] = useState<string | null>(null);
  const [hotelImages, setHotelImages] = useState<string[]>([]);
  const reduceMotion = useReducedMotion();

  // Function to switch itinerary option and navigate
  const handleSwitchOption = (optionId: string) => {
    setSelectedItineraryId(optionId);

    // Hand the choice to the next screen — it renders this exact option.
    if (onEditItinerary) {
      onEditItinerary(optionId);
    }
  };

  // Fetch random hotel images on mount
  useEffect(() => {
    const hotelImageUrls = [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzY5MTE0Mjc5fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1572177215152-32f247303126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGJlZHJvb218ZW58MXx8fHwxNzY5MTE5MzQ5fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1662841540530-2f04bb3291e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHN1aXRlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY5MDkwOTA5fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral"
    ];
    setHotelImages(hotelImageUrls);
  }, []);

  // Fetch trip data on mount
  useEffect(() => {
    if (tripId) {
      setLoading(true);
      getTrip(tripId)
        .then((data) => {
          setTrip(data);
          
          // Find the recommended itinerary (prefer balanced option, then middle, then first)
          if (data.itineraries && data.itineraries.length > 0) {
            const balancedOption = data.itineraries.find((itin: any) => itin.option_label === 'balanced');
            const defaultItinerary = balancedOption || data.itineraries[1] || data.itineraries[0];
            const selectedId = defaultItinerary.id || defaultItinerary.label || '0';
            setSelectedItineraryId(selectedId);
          }
        })
        .catch((error) => {
          // Surface the real failure. Substituting a demo trip here is what
          // made backend problems look like the app "working with mock data".
          console.error("Could not load trip:", error);
          setLoadError(
            error instanceof Error ? error.message : "Could not load this trip",
          );
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setLoadError("No trip selected");
    }
  }, [tripId]);

  const handleConfirmBooking = async () => {
    if (!tripId || !selectedItineraryId) {
      toast.error("Please select an itinerary");
      return;
    }

    // Review happens on the detail screen; booking is confirmed there.
    if (onEditItinerary) {
      onEditItinerary(selectedItineraryId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl mb-4">
            <Loader2 className="w-8 h-8 text-[#916AF5] animate-spin" />
          </div>
          <p className="text-gray-700">Loading itineraries...</p>
        </div>
      </div>
    );
  }

  if (loadError || !trip) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <p className="text-gray-700 mb-4">{loadError || "No trip data available"}</p>
          <Button
            onClick={onBack}
            className="bg-[#916AF5] hover:bg-[#7c5dd4] text-white"
          >
            Start over
          </Button>
        </div>
      </div>
    );
  }

  const itineraries = trip.itineraries || [];

  if (itineraries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No itineraries available. Please try generating again.</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#916AF5] hover:bg-[#7c5dd4] text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const order: Record<string, number> = { balanced: 0, time_saver: 1, cost_saver: 2 };
  const LABELS: Record<string, string> = {
    balanced: "Balanced",
    time_saver: "Time Saver",
    cost_saver: "Cost Saver",
  };
  const sortedItineraries = [...itineraries].sort(
    (a: any, b: any) => (order[a.option_label] ?? 9) - (order[b.option_label] ?? 9),
  );

  const policy = (trip as any).policy_extras;
  const nights = policy?.nights ?? nightsBetween(trip.start_date, trip.end_date);

  /** "Tue, Mar 3" — the year is already in the trip header. */
  const flightDate = (iso?: string | null) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-no-repeat pb-16"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="relative z-10 max-w-[1088px] mx-auto px-4 sm:px-6 pt-[60px]">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <motion.div
            animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], rotate: [0, 8, 0, -8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex-shrink-0"
          >
            <Sparkles className="w-10 h-10 text-[#916AF5] fill-[#916AF5]" aria-hidden />
          </motion.div>
          <div>
            <h1 className="font-display font-medium text-[20px] leading-tight text-[#0a0a0a] m-0">
              Choose your itinerary
            </h1>
            <p className="text-[14px] font-normal text-[#4a5565] m-0 mt-1">
              WorkTrip Autopilot found {sortedItineraries.length} options that match your
              preferences and policy
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-1.5 mb-6 text-[#9095a1] hover:text-[#6d6788] transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to search</span>
        </button>

        {/* The trip, with a way back to the wording that produced it. */}
        <TripSummaryCard
          className="mb-6"
          name={trip.trip_name || trip.inferred_trip_name || "Work Trip"}
          destination={trip.destination || trip.inferred_destination}
          startDate={trip.start_date || trip.inferred_dates?.start_date}
          endDate={trip.end_date || trip.inferred_dates?.end_date}
          travelers={trip.travelers?.length || 1}
          purpose={trip.purpose}
          actions={
            <button
              onClick={onEditTrip}
              className="min-w-[54px] h-[28px] px-3 rounded-[8px] border border-[#D8D3E5] bg-[#F2F1F8] text-[#916AF5] text-[14px] font-medium hover:bg-[#ddd0ff] transition-colors"
            >
              Edit
            </button>
          }
        />

        {/* The three directions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedItineraries.map((option: any, index: number) => {
            const d = option.details ?? {};
            const bookable = (d.flight_cost || 0) + (d.hotel_cost || 0);
            const outbound = parseFlight(d.outbound_flight);
            const inbound = parseFlight(d.return_flight);
            return (
              <div
                key={option.id}
                className="bg-white/70 backdrop-blur-xl rounded-[24px] border border-white/50 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.08)] p-5 flex flex-col"
              >
                {/* Direction, then price. The direction is what this page asks
                    the organiser to choose between. */}
                <div className="mb-3">
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-semibold text-[#1f2933] m-0">
                      {LABELS[option.option_label] ?? option.title}
                    </h3>
                    <p className="text-[24px] font-semibold text-[#101828] m-0 leading-[32px]">
                      {formatMoney(bookable)}
                    </p>
                  </div>
                </div>

                {/* Flights */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-[#4a5565]" strokeWidth={1.75} />
                    <p className="text-[16px] text-[#1f2933] m-0">Flights</p>
                  </div>
                  <p className="text-[18px] text-[#0a0a0a] m-0">{formatMoney(d.flight_cost)}</p>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  {[
                    { leg: outbound, raw: d.outbound_flight, date: trip.start_date },
                    { leg: inbound, raw: d.return_flight, date: trip.end_date },
                  ].map(({ leg, raw, date }, i) => (
                    <div
                      key={i}
                      className="bg-[rgba(179,173,196,0.11)] border border-[rgba(179,173,196,0.28)] rounded-[16px] p-3"
                    >
                      {leg ? (
                        <div className="flex items-center gap-3">
                          <div className="bg-white rounded-[8px] w-10 h-10 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img
                              src={getAirlineLogo(raw)}
                              alt={leg.airline}
                              className="w-[30px] h-[30px] object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="text-[14px] font-bold text-[#101828] m-0 leading-[20px]">
                              {leg.departTime} - {leg.arriveTime}
                            </p>
                            <p className="text-[14px] text-[#101828] m-0 leading-[20px]">
                              {flightDate(date)}
                            </p>
                          </div>
                          <p className="text-[14px] text-[#364153] m-0 leading-[20px] truncate">
                            {leg.airline} · {leg.flightNumber} ·{" "}
                            {leg.stops === 0
                              ? "Direct"
                              : `${leg.stops} stop${leg.stops > 1 ? "s" : ""}`}
                          </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[14px] text-[#364153] m-0">{raw || "Flight pending"}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Hotel */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Hotel className="w-5 h-5 text-[#4a5565]" strokeWidth={1.75} />
                    <p className="text-[16px] text-[#1f2933] m-0">Hotel</p>
                  </div>
                  <p className="text-[18px] text-[#0a0a0a] m-0">{formatMoney(d.hotel_cost)}</p>
                </div>

                <div className="bg-[rgba(179,173,196,0.11)] border border-[rgba(179,173,196,0.28)] rounded-[16px] p-3 mb-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-[8px] overflow-hidden flex-shrink-0 bg-white">
                      <ImageWithFallback
                        src={hotelImages[index] || ""}
                        alt={d.hotel_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-[#101828] m-0 leading-[20px] truncate">
                        {d.hotel_name}
                      </p>
                      <p className="text-[14px] text-[#364153] m-0 leading-[20px]">
                        {d.hotel_rating > 0 && <>{d.hotel_rating}★ · </>}
                        {d.hotel_distance_mi > 0 && (
                          <>
                            {d.hotel_distance_mi} mi to{" "}
                            {trip.purpose?.toLowerCase().includes("conference")
                              ? "venue"
                              : "downtown"}{" "}
                            ·{" "}
                          </>
                        )}
                        {nights} night{nights === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* What actually separates this option from the others. */}
                <div className="flex flex-col gap-2 mb-[48px]">
                  {(option.highlights ?? []).map((h: any, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      {h.type === "con" ? (
                        <Minus className="w-4 h-4 text-[#b45309] flex-shrink-0 mt-0.5" strokeWidth={2} />
                      ) : (
                        <Check className="w-4 h-4 text-[#52c93f] flex-shrink-0 mt-0.5" strokeWidth={2} />
                      )}
                      <span className="text-[14px] text-[#4a5565] leading-snug">{h.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSwitchOption(option.id)}
                  className="mt-auto w-full h-[44px] rounded-[8px] bg-[#E9E7EF] text-[#1f2933] text-[18px] font-normal hover:bg-[#ddd0ff] transition-colors"
                >
                  Continue
                </button>
              </div>
            );
          })}
        </div>

        {/* Per-diems are company policy, identical in every option, so they sit
            outside the comparison rather than repeating three times. */}
        {policy && (
          <div className="mt-10">
            <h2 className="text-[14px] font-semibold text-[#1f2933] m-0 mb-[14px]">
              Included in all options (set by company policy)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  Icon: Car,
                  label: "Ground Transport",
                  perDay: policy.ground_transport_per_day,
                  unit: "per day",
                },
                {
                  Icon: Utensils,
                  label: "Food",
                  perDay: policy.food_per_day,
                  unit: "per day",
                },
              ].map(({ Icon, label, perDay, unit }) => (
                <div
                  key={label}
                  className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.06)] p-[18px] flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-[9px]">
                      <Icon className="w-5 h-5 text-[#4a5565]" strokeWidth={1.75} />
                      <p className="text-[16px] font-semibold text-[#1f2933] m-0">{label}</p>
                    </div>
                    <p className="text-[14px] text-[#4a5565] m-0">
                      {formatMoney(perDay)}/day × {nights} days ={" "}
                      {formatMoney(perDay * nights)}
                    </p>
                  </div>
                  <p className="text-[18px] font-normal text-[#0a0a0a] m-0 whitespace-nowrap">
                    {formatMoney(perDay)}{" "}
                    <span className="text-[12px] font-normal text-[#9095a1]">{unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* The agent explaining itself. */}
        {policy?.rationale && (
          <div className="mt-10">
            <h2 className="text-[14px] font-semibold text-[#1f2933] m-0 mb-[14px]">
              Why these options?
            </h2>
            <p className="text-[14px] text-[#4a5565] leading-relaxed m-0">
              {policy.rationale}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
