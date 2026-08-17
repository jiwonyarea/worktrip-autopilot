import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, MapPin, Calendar, CalendarCheck, Users, Briefcase, Plane, Hotel, Car, Utensils, Loader2, Sparkles } from "lucide-react";
import imgImageHotel from "figma:asset/3a7194d0c070824d982b80f6a329057d5ed3025a.png";
import bgImage from "figma:asset/68491a71f021c38c1c7368d77b05b5434580c49f.png";
import { Trip, getTrip } from "../../utils/tripApi";
import { TripSummaryCard } from "../TripSummaryCard";
import { TripTotalsCard } from "../TripTotalsCard";
import { AirlineLogo } from "../AirlineLogo";
import {
  parseFlight,
  flightDuration,
  formatDayHeading,
  formatDate,
  formatMoney,
  nightsBetween,
  pickItinerary,
  travelerCount,
  type ParsedFlight,
} from "../../utils/itinerary";

interface EditItineraryinDetailProps {
  onBack?: () => void;
  onConfirm?: () => void;
  onComplete?: () => void;
  onBackToHome?: () => void;
  tripId?: string | null;
  selectedItineraryId?: string | null;
}

/** One flight leg, rendered from the agent's flight string. */
function FlightCard({ flight, raw }: { flight: ParsedFlight | null; raw?: string }) {
  // Unparseable strings still show their content rather than an empty card.
  if (!flight) {
    return (
      <div className="bg-[#fafafa] rounded-xl p-4 border border-[#e5e7eb]">
        <p className="text-sm text-[#101828]">{raw || "Flight details pending"}</p>
      </div>
    );
  }

  const carrierLine = flight.segments
    .map((s) => `${s.airline} · ${s.flightNumber}`)
    .join("  →  ");

  return (
    <div className="bg-[#fafafa] rounded-xl p-4 border border-[#e5e7eb]">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 flex items-center justify-center">
          <AirlineLogo flight={flight.raw} alt={flight.airline} size={24} />
        </div>

        <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0 mr-0 lg:mr-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-[#101828]">{flight.departTime}</p>
            <p className="text-xs text-[#6a7282]">{flight.from}</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <p className="text-[10px] text-[#6a7282] mb-1">
              {flightDuration(flight.departTime, flight.arriveTime)}
            </p>
            <div className="w-full h-px bg-[#d1d5db]"></div>
            <p className="text-[10px] text-[#6a7282] mt-1">
              {flight.stops === 0
                ? "Nonstop"
                : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#101828]">{flight.arriveTime}</p>
            <p className="text-xs text-[#6a7282]">{flight.to}</p>
          </div>
        </div>

        {/* Baggage allowance is not in the flight data we get back, so stating
            "x1 checked bag" here would be inventing a booking detail. Cabin
            class is real, so show that instead. */}
        <div className="hidden sm:flex flex-col items-end text-[10px] text-[#6a7282] gap-1 flex-shrink-0">
          <span className="capitalize">{"Economy"}</span>
          <span>
            {flight.stops === 0
              ? "Nonstop"
              : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
          </span>
        </div>
      </div>
      <p className="text-xs text-[#6a7282]">{carrierLine}</p>
    </div>
  );
}

export function EditItineraryinDetail({
  onBack,
  onConfirm,
  onComplete,
  onBackToHome,
  tripId,
  selectedItineraryId,
}: EditItineraryinDetailProps) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!tripId) {
      setLoading(false);
      setError("No trip selected");
      return;
    }

    let cancelled = false;
    getTrip(tripId)
      .then((data) => {
        if (!cancelled) setTrip(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load this trip");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tripId]);

  const itinerary = pickItinerary(trip, selectedItineraryId);

  const handleConfirm = () => {
    if (!tripId || !itinerary) return;

    // The booking call itself belongs to the tracker screen, so the progress
    // it shows is the real request rather than a replay of one already done.
    setBooking(true);
    if (onComplete) onComplete();
    else if (onConfirm) onConfirm();
  };

  if (loading) {
    return (
      <div
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#916af5]" />
          <p className="text-gray-700">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (error || !trip || !itinerary) {
    return (
      <div
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 text-center max-w-md">
          <p className="text-gray-700 mb-4">
            {error || "This trip has no itinerary options yet."}
          </p>
          <button
            onClick={onBack}
            className="bg-[#916af5] hover:bg-[#7c5dd4] text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-colors"
          >
            Back to options
          </button>
        </div>
      </div>
    );
  }

  const details = itinerary.details ?? {};
  const travelers = travelerCount(trip);
  const nights = nightsBetween(trip.start_date, trip.end_date);
  const outbound = parseFlight(details.outbound_flight);
  const inbound = parseFlight(details.return_flight);
  // The organiser chose a direction on the previous screen; name it here so
  // the two screens agree on what was picked.
  const DIRECTIONS: Record<string, string> = {
    balanced: "Balanced",
    time_saver: "Time Saver",
    cost_saver: "Cost Saver",
  };
  const directionLabel = DIRECTIONS[itinerary.option_label] ?? itinerary.title;

  // Per-diems are policy, shared by every option.
  const policyExtras = (trip as any).policy_extras;

  // Flights and hotel are what the organiser is approving; the per-diems are
  // allowances, which the totals card presents as drawn against budget.
  const bookableTotal = (details.flight_cost ?? 0) + (details.hotel_cost ?? 0);

  // Features are the agent's reasons for this option; fall back to its rationale.
  // Same bullets the option card showed, so the choice carries forward.
  const highlights: { text: string; type: string }[] =
    itinerary.highlights?.length > 0
      ? itinerary.highlights
      : (itinerary.features ?? []).map((f: string) => ({ text: f, type: "pro" }));

  return (
    <div
      className="relative min-h-screen pb-12 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Main Content - Max Width 1088px */}
      <div className="relative max-w-[1088px] mx-auto px-4 sm:px-6 pt-[60px] z-10">
        {/* Header — same shape as the selection screen, so the two read as one
            flow rather than two different products. */}
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
              Edit and finalize your itinerary
            </h1>
            <p className="text-[14px] font-normal text-[#4a5565] m-0 mt-1">
              Adjust your trip itinerary in detail before booking
            </p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 mb-6 text-[#9095a1] hover:text-[#6d6788] transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to options
        </button>

        {/* Same trip card as every other screen, with a way back to the
            wording that produced it. */}
        <TripSummaryCard
          className="mb-6"
          name={trip.trip_name || trip.inferred_trip_name || "Work Trip"}
          destination={trip.destination || trip.inferred_destination}
          startDate={trip.start_date || trip.inferred_dates?.start_date}
          endDate={trip.end_date || trip.inferred_dates?.end_date}
          travelers={travelers}
          purpose={trip.purpose}
          actions={
            <button
              onClick={onBack}
              className="min-w-[54px] h-[28px] px-3 rounded-[8px] border border-[#D8D3E5] bg-[#F2F1F8] text-[#916AF5] text-[14px] font-medium hover:bg-[#ddd0ff] transition-colors"
            >
              Edit
            </button>
          }
        />

        {/* Main Content - 3 Separate Cards */}
        {/* White Container Card */}
        <div className="bg-white/90 rounded-[24px] p-3 sm:p-[18px] shadow-sm">
          <div className="flex flex-col lg:flex-row gap-[18px]">
            {/* LEFT CARD - Schedule (Largest) */}
            <div className="w-full lg:flex-1 lg:min-w-0 bg-white rounded-2xl border border-[#e5e7eb] p-4 sm:p-6">
              {/* Selected Option Header */}
              <div className="mb-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1f2933] mb-1">
                    {directionLabel}
                  </h3>
                  <p className="text-sm text-[#4a5565]">
                    {itinerary.summary || itinerary.title}
                  </p>
                </div>
              </div>

              {/* Total Cost */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e6e6e6]">
                <p className="text-sm text-[#364153]">
                  Total cost ({travelers} traveler{travelers === 1 ? "" : "s"})
                </p>
                <p className="text-2xl sm:text-[30px] font-semibold text-[#0a0a0a] leading-tight sm:leading-9">
                  {formatMoney(bookableTotal)}
                </p>
              </div>

              {/* Departure day. A single rail runs the full height of the day
                  and the content is indented past it, so no card covers it. */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-[#1f2933] mb-4">
                  {formatDayHeading(trip.start_date)}
                </h4>

                <div className="relative pl-8">
                  <span
                    className="absolute left-[9px] top-1 bottom-0 w-px bg-[#D8D3E5]"
                    aria-hidden
                  />

                {/* Outbound flight */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 relative">
                      <Plane
                        className="w-5 h-5 text-[#4a5565] absolute -left-8 bg-white py-0.5"
                        strokeWidth={1.75}
                      />
                      <span className="text-base text-[#1f2933]">Flight to {trip.destination}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded-md border border-[#e5e7eb]">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                          <path d="M2 4h12M5.5 4V2.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V4m1.5 0v9a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 13V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="border border-[#d1d5db] rounded-md px-3 py-1.5 text-sm text-[#1f2933] hover:bg-gray-50">
                        Edit
                      </button>
                    </div>
                  </div>

                  <FlightCard flight={outbound} raw={details.outbound_flight} />
                </div>

                {/* Hotel Stay */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 relative">
                      <Hotel
                        className="w-5 h-5 text-[#4a5565] absolute -left-8 bg-white py-0.5"
                        strokeWidth={1.75}
                      />
                      <span className="text-base text-[#1f2933]">
                        {nights}-night stay in {trip.destination}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded-md border border-[#e5e7eb]">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                          <path d="M2 4h12M5.5 4V2.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V4m1.5 0v9a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 13V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="border border-[#d1d5db] rounded-md px-3 py-1.5 text-sm text-[#1f2933] hover:bg-gray-50">
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Hotel Card */}
                  <div className="bg-[#fafafa] rounded-xl p-4 border border-[#e5e7eb]">
                    <div className="flex gap-3 mb-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={imgImageHotel} alt={details.hotel_name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#101828] mb-1">
                          {details.hotel_name}
                        </p>
                        <p className="text-xs text-[#6a7282] mb-1">
                          {details.hotel_rating > 0 && <>{details.hotel_rating}★ · </>}
                          {details.hotel_distance_mi > 0 && (
                            <>
                              {details.hotel_distance_mi} mi to{" "}
                              {trip.purpose?.toLowerCase().includes("conference")
                                ? "venue"
                                : "downtown"}{" "}
                              ·{" "}
                            </>
                          )}
                          {trip.destination}
                        </p>
                        <p className="text-xs text-[#6a7282]">
                          {details.hotel_summary}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#e5e7eb]">
                      <p className="text-xs text-[#6a7282] flex items-start gap-1.5 m-0">
                        <CalendarCheck
                          className="w-3.5 h-3.5 mt-px flex-shrink-0"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                        <span>Free cancellation up to 24 hours before check-in</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ground Transport */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2 relative">
                    <Car
                      className="w-5 h-5 text-[#4a5565] absolute -left-8 bg-white py-0.5"
                      strokeWidth={1.75}
                    />
                    <span className="text-base text-[#1f2933]">Ground Transport</span>
                  </div>
                  <p className="text-sm text-[#6a7282]">
                    {policyExtras
                      ? `${formatMoney(policyExtras.ground_transport_per_day)}/day × ${nights} days = ${formatMoney(details.ground_transport_cost)}`
                      : details.ground_transport_summary}
                  </p>
                </div>

                {/* Food */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2 relative">
                    <Utensils
                      className="w-5 h-5 text-[#4a5565] absolute -left-8 bg-white py-0.5"
                      strokeWidth={1.75}
                    />
                    <span className="text-base text-[#1f2933]">Food</span>
                  </div>
                  <p className="text-sm text-[#6a7282]">
                    {policyExtras
                      ? `${formatMoney(policyExtras.food_per_day)}/day × ${nights} days = ${formatMoney(details.food_cost)}`
                      : details.food_summary}
                  </p>
                </div>
                </div>
              </div>

              {/* Return day */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-[#1f2933] mb-4">
                  {formatDayHeading(trip.end_date)}
                </h4>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Plane className="w-5 h-5 text-[#4a5565]" strokeWidth={1.75} />
                      <span className="text-base text-[#1f2933]">
                        Flight to {trip.origin_city || "home"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded-md border border-[#e5e7eb]">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                          <path d="M2 4h12M5.5 4V2.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V4m1.5 0v9a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 13V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="border border-[#d1d5db] rounded-md px-3 py-1.5 text-sm text-[#1f2933] hover:bg-gray-50">
                        Edit
                      </button>
                    </div>
                  </div>

                  <FlightCard flight={inbound} raw={details.return_flight} />
                </div>
              </div>

              {/* Why the agent built it this way */}
              <div className="mb-6">
                <div className="space-y-2">
                  {highlights.map((point, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-[#4a5565]">
                      {point.type === "con" ? (
                        <svg className="w-4 h-4 text-[#b45309] flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-[#52c93f] flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                          <path d="M13.3 4L6 11.3 2.7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      <span>{point.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <div>
                <button
                  onClick={handleConfirm}
                  disabled={booking}
                  className="w-full bg-[#916af5] hover:bg-[#7c5dd4] disabled:opacity-60 text-white rounded-xl px-8 py-4 text-base font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {booking && <Loader2 className="w-4 h-4 animate-spin" />}
                  {booking ? "Confirming..." : "Confirm & Complete Booking"}
                </button>
                <p className="text-center text-sm text-[#1f2933] mt-3 italic">
                  Don't worry! All reservations can be cancelled within 24 hours.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN - 2 Separate Cards */}
            <div className="w-full lg:w-[397px] lg:flex-shrink-0 flex flex-col gap-[18px]">
              {/* RIGHT TOP CARD - Budget & Spend */}

              <TripTotalsCard trip={trip} itinerary={itinerary} />

              {/* RIGHT BOTTOM CARD - Payment Method */}
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
                <h3 className="text-base font-semibold text-[#1f2933] mb-4">
                  Payment method
                </h3>
                <div className="flex items-center justify-between p-4 border border-[#e5e7eb] rounded-xl mb-4 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#1246a5]" viewBox="0 0 20 20" fill="none">
                        <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.67"/>
                        <line x1="2" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="1.67"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-[#1f2933] mb-0.5">
                        Corporate card
                      </p>
                      <p className="text-xs text-[#6a7282]">
                        Visa •••• 4242
                      </p>
                    </div>
                  </div>
                  <button className="bg-[#f5f7fa] border border-[#e5e7eb] text-[#1f2933] rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors">
                    Change
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#e8f9fb] border border-[#b8e9f0] rounded-xl">
                  <p className="text-sm text-[#1f2933] flex-1 pr-3">
                    Auto-fill purchase card forms and draft expense reports
                  </p>
                  <div className="relative inline-block w-10 h-6 flex-shrink-0">
                    <input type="checkbox" defaultChecked className="peer sr-only" id="auto-fill-toggle-edit" />
                    <label
                      htmlFor="auto-fill-toggle-edit"
                      className="block w-10 h-6 bg-[#1f2933] rounded-full cursor-pointer relative after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-0"
                    ></label>
                  </div>
                </div>
              </div>

              {/* View Policy Details - Separate Button */}
              <button className="w-full bg-[rgb(233,246,238)] border border-[rgba(31,157,85,0.2)] hover:bg-[rgba(31,157,85,0.15)] text-[#1f2933] rounded-xl px-4 py-3 text-sm transition-colors text-left flex items-center justify-between font-normal h-14">
                <span>View Policy Details</span>
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
