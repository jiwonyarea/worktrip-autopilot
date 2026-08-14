import { useEffect, useState } from "react";
import { ChevronLeft, MapPin, Calendar, Users, Briefcase, Plane, Hotel, Car, Utensils, Loader2 } from "lucide-react";
import { toast } from "sonner";
import imgImageAirline from "figma:asset/50ba81ee3baed0d032549253a352c5d27d54adb9.png";
import imgImageHotel from "figma:asset/3a7194d0c070824d982b80f6a329057d5ed3025a.png";
import bgImage from "figma:asset/68491a71f021c38c1c7368d77b05b5434580c49f.png";
import { Trip, getTrip, confirmBooking } from "../../utils/tripApi";
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
          <img src={imgImageAirline} alt={flight.airline} className="w-6 h-6 object-contain" />
        </div>

        <div className="flex items-center gap-6 flex-1 p-[0px] mt-[0px] mr-[100px] mb-[0px] ml-[0px]">
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

        <div className="flex flex-col items-end text-[10px] text-[#6a7282] gap-1">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
              <rect x="3" y="2" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1"/>
            </svg>
            <span>x1 Checked bag</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
              <rect x="3" y="2" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1"/>
            </svg>
            <span>x1 Carry-on bag</span>
          </div>
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

  const handleConfirm = async () => {
    if (!tripId || !itinerary) return;

    setBooking(true);
    try {
      // Record the choice before advancing — Trip Overview reads it back.
      await confirmBooking(tripId, itinerary.id);
      toast.success("Trip confirmed");
      if (onComplete) onComplete();
      else if (onConfirm) onConfirm();
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error(err instanceof Error ? err.message : "Could not confirm this trip");
    } finally {
      setBooking(false);
    }
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
  const inPolicy = itinerary.policy_compliant !== false;

  // Features are the agent's reasons for this option; fall back to its rationale.
  const highlights: string[] =
    itinerary.features?.length > 0
      ? itinerary.features
      : [itinerary.rationale].filter(Boolean);

  return (
    <div
      className="relative min-h-screen pb-12 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Main Content - Max Width 1088px */}
      <div className="relative max-w-[1088px] mx-auto px-6 pt-8 z-10">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-b from-[#916af5] to-[#b2a5fb] rounded-2xl shadow-md w-12 h-12 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#0a0a0a]">
              Edit and confirm your itinerary
            </h1>
            <p className="text-base text-[#4a5565]">
              Confirm your itinerary
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

        {/* Trip Header Card */}

        <div className="bg-white rounded-2xl shadow-sm mb-6 p-[20px] px-[22px] py-[20px]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h3 className="text-base font-semibold text-[#1f2933]">
                  {trip.trip_name}
                </h3>
                <div className="bg-[#D4E9FF] rounded-full px-3 py-1 flex items-center justify-center">
                  <span className="font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[16px] text-[#1246A5]">
                    {trip.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#4a5565]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{trip.destination}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{trip.start_date} - {trip.end_date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{travelers} traveler{travelers === 1 ? "" : "s"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>{trip.purpose}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Main Content - 3 Separate Cards */}
        {/* White Container Card */}
        <div className="bg-[#ffffff] rounded-[24px] p-[18px] shadow-sm">
          <div className="flex flex-col lg:flex-row gap-[18px]">
            {/* LEFT CARD - Schedule (Largest) */}
            <div className="w-full lg:w-[625px] flex-shrink-0 bg-white rounded-2xl border border-[#e5e7eb] p-6">
              {/* Selected Option Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="pr-4">
                  <h3 className="text-base font-semibold text-[#1f2933] mb-1">
                    {itinerary.title}
                  </h3>
                  <p className="text-sm text-[#4a5565]">
                    {itinerary.rationale || details.flight_summary}
                  </p>
                </div>
                <div
                  className={`${
                    inPolicy ? "bg-[#d0f4e0]" : "bg-[#ffe9cc]"
                  } px-3 py-1 rounded-full flex-shrink-0`}
                >
                  <p
                    className={`text-[12px] font-medium m-0 leading-[16px] font-['Inter:Medium',sans-serif] ${
                      inPolicy ? "text-[#44ad33]" : "text-[#b45309]"
                    }`}
                  >
                    {inPolicy ? "In policy" : "Over budget"}
                  </p>
                </div>
              </div>

              {/* Total Cost */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e6e6e6]">
                <p className="text-sm text-[#364153]">
                  Total cost ({travelers} traveler{travelers === 1 ? "" : "s"})
                </p>
                <p className="text-[30px] font-semibold text-[#0a0a0a] leading-9">
                  {formatMoney(itinerary.total_cost)}
                </p>
              </div>

              {/* Departure day */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-[#1f2933] mb-4">
                  {formatDayHeading(trip.start_date)}
                </h4>

                {/* Outbound flight */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Plane className="w-5 h-5 text-[#4a5565]" />
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
                    <div className="flex items-center gap-2">
                      <Hotel className="w-5 h-5 text-[#4a5565]" />
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
                          📍 {trip.destination}
                        </p>
                        <p className="text-xs text-[#6a7282]">
                          {details.hotel_summary}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-[#6a7282] mb-3">
                      <div>Check-in: {formatDate(trip.start_date)}, 4:00PM</div>
                      <div>Check-out: {formatDate(trip.end_date)}, 11:00AM</div>
                    </div>

                    <div className="pt-3 border-t border-[#e5e7eb]">
                      <p className="text-xs text-[#6a7282] flex items-start gap-1.5">
                        <svg className="w-3 h-3 mt-0.5" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1"/>
                        </svg>
                        <span>{formatMoney(details.hotel_cost)} total for {nights} night{nights === 1 ? "" : "s"}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ground Transport */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="w-5 h-5 text-[#4a5565]" />
                    <span className="text-base text-[#1f2933]">Ground Transport</span>
                  </div>
                  <p className="text-sm text-[#6a7282] ml-7">
                    {details.ground_transport_summary}
                  </p>
                </div>

                {/* Food */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils className="w-5 h-5 text-[#4a5565]" />
                    <span className="text-base text-[#1f2933]">Food</span>
                  </div>
                  <p className="text-sm text-[#6a7282] ml-7">
                    {details.food_summary}
                  </p>
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
                      <Plane className="w-5 h-5 text-[#4a5565]" />
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
                  {highlights.map((point: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-[#4a5565]">
                      <svg className="w-4 h-4 text-[#52c93f] flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4L6 11.3 2.7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{point}</span>
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
            <div className="w-full lg:w-[397px] flex flex-col gap-[18px]">
              {/* RIGHT TOP CARD - Budget & Spend */}

              <div className="bg-[rgb(255,255,255)] backdrop-blur-sm border border-[#e5e7eb] rounded-xl p-6">
                        <h3 className="text-base font-semibold text-[#1f2933] mb-4">Trip total & Compliance</h3>

                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-3xl font-normal text-[#0a0a0a]">
                            {formatMoney(itinerary.total_cost)}
                          </span>
                          {trip.total_budget ? (
                            <span className="text-sm text-[#6a7282]">
                              of {formatMoney(trip.total_budget)}
                            </span>
                          ) : null}
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-2.5 bg-[rgba(3,2,19,0.2)] rounded-full mb-2 overflow-hidden">
                          <div
                            className={`h-full ${
                              inPolicy
                                ? "bg-gradient-to-r from-[#52c93f] to-[#18a0a6]"
                                : "bg-gradient-to-r from-[#f5a623] to-[#e5484d]"
                            }`}
                            style={{
                              width: `${Math.min(
                                trip.total_budget
                                  ? (itinerary.total_cost / trip.total_budget) * 100
                                  : 100,
                                100,
                              )}%`,
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className={`text-xs ${inPolicy ? "text-[#1F9D55]" : "text-[#b45309]"}`}>
                            {itinerary.policy_note ||
                              (inPolicy
                                ? "Your trip is fully compliant with policy"
                                : "This option exceeds the stated budget")}
                          </span>
                          <div
                            className={`${
                              inPolicy
                                ? "bg-[#d1f4e0] text-[#52c93f]"
                                : "bg-[#ffe9cc] text-[#b45309]"
                            } rounded-full px-3 py-1 text-xs font-medium flex-shrink-0`}
                          >
                            {inPolicy ? "In policy" : "Review"}
                          </div>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#4a5565]">Flights</span>
                            <span className="font-normal text-[#1f2933]">{formatMoney(details.flight_cost)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#4a5565]">Hotels</span>
                            <span className="font-normal text-[#1f2933]">{formatMoney(details.hotel_cost)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#4a5565]">Ground transportation</span>
                            <span className="font-normal text-[#1f2933]">{formatMoney(details.ground_transport_cost)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#4a5565]">Food</span>
                            <span className="font-normal text-[#1f2933]">{formatMoney(details.food_cost)}</span>
                          </div>
                        </div>
                      </div>

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
