import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Share2, 
  Download, 
  MapPin, 
  Calendar, 
  Users, 
  Briefcase,
  Plane,
  Hotel,
  CheckCircle,
  X,
  ChevronRight,
  Filter,
  Upload,
  FileText,
  Info
} from "lucide-react";
import { Button } from "../ui/button";
import svgPaths from "../../imports/svg-kxhvyi8xmt";
import bgImage from "figma:asset/68491a71f021c38c1c7368d77b05b5434580c49f.png";
import { Loader2 } from "lucide-react";
import { Trip, Expense, getTrip, getExpenses } from "../../utils/tripApi";
import {
  parseFlight,
  formatDayHeading,
  formatMoney,
  formatDate,
  pickItinerary,
  travelerCount,
} from "../../utils/itinerary";

interface TripOverviewProps {
  onViewExpenses?: () => void;
  onNewTrip?: () => void;
  onBack?: () => void;
  tripId?: string | null;
  selectedItineraryId?: string | null;
}

export function TripOverview({ onViewExpenses, onNewTrip, onBack, tripId, selectedItineraryId }: TripOverviewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "expenses">("overview");
  const [showSuccessBanner, setShowSuccessBanner] = useState(true);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) {
      setLoading(false);
      setError("No trip selected");
      return;
    }

    let cancelled = false;
    // Expenses are optional — a trip with none still renders the overview.
    Promise.all([getTrip(tripId), getExpenses(tripId).catch(() => [] as Expense[])])
      .then(([tripData, expenseData]) => {
        if (cancelled) return;
        setTrip(tripData);
        setExpenses(expenseData);
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

  if (loading) {
    return (
      <div
        className="min-h-screen relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#916af5]" />
          <p className="text-gray-700">Loading your trip...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div
        className="min-h-screen relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 text-center max-w-md">
          <p className="text-gray-700 mb-4">{error || "Trip not found"}</p>
          <button
            onClick={onNewTrip}
            className="bg-[#916af5] hover:bg-[#7c5dd4] text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-colors"
          >
            Plan a new trip
          </button>
        </div>
      </div>
    );
  }

  const itinerary = pickItinerary(trip, selectedItineraryId);
  const details = itinerary?.details ?? {};
  const travelers = travelerCount(trip);
  const outbound = parseFlight(details.outbound_flight);
  const inbound = parseFlight(details.return_flight);
  const isBooked = trip.status === "booked";
  const inPolicy = itinerary?.policy_compliant !== false;

  // Days until departure, for the "Next event" card.
  const daysToDeparture = trip.start_date
    ? Math.ceil(
        (new Date(`${trip.start_date}T00:00:00`).getTime() - Date.now()) / 86_400_000,
      )
    : null;

  const expenseTotal = expenses.reduce((sum, e) => sum + Number(e.amount ?? 0), 0);
  const expenseBy = (category: string) =>
    expenses
      .filter((e) => (e.category ?? "").toLowerCase() === category)
      .reduce((sum, e) => sum + Number(e.amount ?? 0), 0);

  return (
    <div 
      className="min-h-screen relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Main content */}
      <div className="relative max-w-[1088px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Success Banner */}
        {showSuccessBanner && (
          <div className="mb-6 bg-gradient-to-r from-[#d1f4e0] to-[#d4f9e2] rounded-2xl shadow-sm">
            <div className="p-4 sm:p-5 flex items-start gap-4 animate-in slide-in-from-top-2 duration-500 ease-out">
              <div className="flex-shrink-0 w-12 h-12 bg-[#42be5b] rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105 duration-200">
                <CheckCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="text-base font-semibold text-[#0a0a0a] mb-0.5 tracking-tight">
                  Your agent has completed the booking!
                </h3>
                <p className="text-sm text-[#364153] leading-relaxed">
                  Your confirmation will be sent to your inbox
                </p>
              </div>
              <button
                onClick={() => setShowSuccessBanner(false)}
                className="flex-shrink-0 text-[#4a5565] hover:text-[#1f2933] hover:bg-[rgba(0,0,0,0.05)] transition-all duration-200 p-1.5 rounded-md self-center group"
                aria-label="Close"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>
        )}

        {/* Header - removed old back button and share section */}

        {/* Trip Header Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 mb-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <h1 className="text-lg font-semibold text-[#1f2933]">
                  {trip.trip_name}
                </h1>

                <div className={`${isBooked ? "bg-[#dafbe8]" : "bg-[#D4E9FF]"} rounded-full px-3 py-1 flex items-center justify-center`}>
                  <span className={`font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[16px] ${isBooked ? "text-[#4dc13a]" : "text-[#1246A5]"}`}>
                    {isBooked ? "✓ Booked" : trip.status}
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

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="flex border-b border-[#e5e7eb]">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 py-3.5 px-6 text-base font-medium transition-all relative ${
                activeTab === "overview"
                  ? "bg-white text-[#1f2933]"
                  : "text-[#1f2933] hover:bg-gray-50"
              }`}
            >
              Overview
              {activeTab === "overview" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#916af5]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("expenses")}
              className={`flex-1 py-3.5 px-6 text-base font-medium transition-all relative ${
                activeTab === "expenses"
                  ? "bg-white text-[#1f2933]"
                  : "text-[#1f2933] hover:bg-gray-50"
              }`}
            >
              Expenses
              {activeTab === "expenses" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#916af5]" />
              )}
            </button>
          </div>

          {/* Overview Tab Content */}
          {activeTab === "overview" && (
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Schedule (624px) */}
                <div className="flex-1 lg:w-[624px] min-w-0 flex flex-col gap-6">
                  {/* Status Cards Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* All bookings confirmed */}
                    <div className="bg-[rgba(31,157,85,0.1)] rounded-xl p-4 border border-[rgba(31,157,85,0.2)]">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-[#1f9d55]" />
                        <h3 className="font-normal text-sm text-[#1f2933]">
                          All bookings confirmed
                        </h3>
                      </div>
                      <p className="text-xs text-[#4a5565] leading-relaxed">
                        {trip.confirmations
                          ? `Flight ${trip.confirmations.flight} · Hotel ${trip.confirmations.hotel}`
                          : "Flights, hotels, and ground transportation are secured"}
                      </p>
                    </div>

                    {/* Next event */}
                    <div className="bg-[rgba(18,70,165,0.1)] rounded-xl p-4 border border-[rgba(18,70,165,0.2)]">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-[#1246a5]" />
                        <h3 className="font-normal text-sm text-[#1f2933]">Next event</h3>
                      </div>
                      <p className="text-xs text-[#4a5565]">
                        {daysToDeparture === null
                          ? "Dates not set"
                          : daysToDeparture > 0
                            ? `Departure flight in ${daysToDeparture} day${daysToDeparture === 1 ? "" : "s"}`
                            : daysToDeparture === 0
                              ? "Departure flight today"
                              : "Trip underway"}
                      </p>
                    </div>
                  </div>

                  {/* My Schedule Section - Bordered Container */}
                  <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-[#e5e7eb] p-5">
                    {/* Header with title, button, and actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-4">
                        <h2 className="text-base font-semibold text-[#1f2933]">My schedule</h2>
                        <Button
                          variant="outline"
                          className="rounded-lg border-[rgba(0,0,0,0.1)] bg-[#f5f7fa] text-sm px-3 py-1.5 h-8 font-medium hover:bg-gray-50"
                        >
                          Edit booking
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Share2 className="w-[22px] h-[22px] text-[#1f2933]" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Download className="w-[22px] h-[22px] text-[#1f2933]" />
                        </button>
                      </div>
                    </div>

                    {/* Schedule Timeline */}
                    <div className="space-y-4">
                      {/* Tuesday, Mar 3 */}
                      <div>
                        <h3 className="text-base font-semibold text-[#1f2933] mb-4">{formatDayHeading(trip.start_date)}</h3>
                        <div className="flex gap-4">
                          {/* Timeline vertical line */}
                          <div className="flex flex-col items-center w-14 flex-shrink-0">
                            <div className="w-0.5 h-full bg-[#e5e7eb]"></div>
                          </div>

                          {/* Events */}
                          <div className="flex-1 space-y-2">
                            {/* Flight */}
                            <div className="bg-[#f7f6f8] border border-[rgba(179,173,196,0.28)] rounded-lg p-3 flex items-center gap-3 hover:border-gray-300 transition-colors cursor-pointer">
                              <div className="flex-shrink-0">
                                <Plane className="w-4 h-4 text-[#4a5565]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-[#1f2933] mb-0.5">
                                  {outbound ? `${outbound.departTime}-${outbound.arriveTime}` : "Flight"}
                                </div>
                                <div className="text-xs text-[#6a7282] truncate">
                                  {outbound
                                    ? `${outbound.from}-${outbound.to} · ${outbound.airline} · ${outbound.flightNumber}`
                                    : details.outbound_flight || "Details pending"}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-[#1f2933] flex-shrink-0" />
                            </div>

                            {/* Hotel */}
                            <div className="bg-[#f7f6f8] border border-[rgba(179,173,196,0.28)] rounded-lg p-3 flex items-center gap-3 hover:border-gray-300 transition-colors cursor-pointer">
                              <div className="flex-shrink-0">
                                <Hotel className="w-4 h-4 text-[#4a5565]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-[#1f2933] mb-0.5">
                                  {details.hotel_name || "Hotel"}
                                </div>
                                <div className="text-xs text-[#6a7282]">Check-in 4:00 PM</div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-[#1f2933] flex-shrink-0" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Conference days */}
                      <div>
                        <div className="flex gap-4">
                          {/* Timeline badge */}
                          <div className="flex flex-col items-center w-14 flex-shrink-0 gap-2">
                            <div className="bg-[#18a0a6] text-white text-xs font-semibold px-2.5 py-1.5 rounded-full">
                              {trip.start_date?.slice(8)}-{trip.end_date?.slice(8)}
                            </div>
                            <div className="w-0.5 flex-1 bg-[#e5e7eb]"></div>
                          </div>

                          {/* Event */}
                          <div className="flex-1">
                            <div className="mb-3">
                              <span className="text-sm font-normal text-[#1f2933] capitalize">{trip.purpose} days</span>
                            </div>
                            <div className="bg-[rgba(31,157,85,0.1)] border border-[rgba(31,157,85,0.2)] rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-[rgba(31,157,85,0.15)] transition-colors">
                              <div className="flex-shrink-0">
                                <MapPin className="w-4 h-4 text-[#18a0a6]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-[#1f2933]">{trip.trip_name}</div>
                                <div className="text-xs text-[#6a7282]">{trip.destination}</div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-[#1f2933] flex-shrink-0" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Thursday, Mar 5 */}
                      <div>
                        <h3 className="text-base font-semibold text-[#1f2933] mb-4">{formatDayHeading(trip.end_date)}</h3>
                        <div className="flex gap-4">
                          {/* Timeline vertical line */}
                          <div className="flex flex-col items-center w-14 flex-shrink-0">
                            <div className="w-0.5 h-full bg-[#e5e7eb]"></div>
                          </div>

                          {/* Events */}
                          <div className="flex-1 space-y-2">
                            {/* Hotel checkout */}
                            <div className="bg-[#f7f6f8] border border-[rgba(179,173,196,0.28)] rounded-lg p-3 flex items-center gap-3 hover:border-gray-300 transition-colors cursor-pointer">
                              <div className="flex-shrink-0">
                                <Hotel className="w-4 h-4 text-[#4a5565]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-[#1f2933] mb-0.5">
                                  {details.hotel_name || "Hotel"}
                                </div>
                                <div className="text-xs text-[#6a7282]">Check out 11:00 AM</div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-[#1f2933] flex-shrink-0" />
                            </div>

                            {/* Return Flight */}
                            <div className="bg-[#f7f6f8] border border-[rgba(179,173,196,0.28)] rounded-lg p-3 flex items-center gap-3 hover:border-gray-300 transition-colors cursor-pointer">
                              <div className="flex-shrink-0">
                                <Plane className="w-4 h-4 text-[#4a5565]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-[#1f2933] mb-0.5">
                                  {inbound ? `${inbound.departTime}-${inbound.arriveTime}` : "Return flight"}
                                </div>
                                <div className="text-xs text-[#6a7282] truncate">
                                  {inbound
                                    ? `${inbound.from}-${inbound.to} · ${inbound.airline} · ${inbound.flightNumber}`
                                    : details.return_flight || "Details pending"}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-[#1f2933] flex-shrink-0" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Budget & Spend (397px) */}
                <div className="w-full lg:w-[397px] flex-shrink-0">
                  <div className="space-y-[18px]">
                    {/* Budget & Spend Card */}
                    <div className="bg-[rgba(255,255,255,0.6)] backdrop-blur-sm border border-[#e5e7eb] rounded-xl p-6">
                      <h3 className="text-base font-semibold text-[#1f2933] mb-4">Trip total & Compliance</h3>
                      
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-normal text-[#0a0a0a]">
                          {formatMoney(itinerary?.total_cost)}
                        </span>
                        {trip.total_budget ? (
                          <span className="text-sm text-[#6a7282]">of {formatMoney(trip.total_budget)}</span>
                        ) : null}
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2.5 bg-[rgba(3,2,19,0.2)] rounded-full mb-2 overflow-hidden">
                        <div
                          className={`h-full ${inPolicy ? "bg-gradient-to-r from-[#52c93f] to-[#18a0a6]" : "bg-gradient-to-r from-[#f5a623] to-[#e5484d]"}`}
                          style={{
                            width: `${Math.min(
                              trip.total_budget && itinerary
                                ? (itinerary.total_cost / trip.total_budget) * 100
                                : 100,
                              100,
                            )}%`,
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className={`text-xs ${inPolicy ? "text-[#1F9D55]" : "text-[#b45309]"}`}>
                          {itinerary?.policy_note ||
                            (inPolicy ? "Your trip is fully compliant with policy" : "Review this trip against policy")}
                        </span>
                        <div className={`${inPolicy ? "bg-[#d1f4e0] text-[#52c93f]" : "bg-[#ffe9cc] text-[#b45309]"} rounded-full px-3 py-1 text-xs font-medium flex-shrink-0`}>
                          {inPolicy ? "In policy" : "Review"}
                        </div>
                      </div>

                      {/* Breakdown: planned cost, with filed expenses alongside */}
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
                          <span className="font-normal text-[#1f2933]">
                            {formatMoney(expenseBy("ground transport"))} / {formatMoney(details.ground_transport_cost)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#4a5565]">Food</span>
                          <span className="font-normal text-[#1f2933]">
                            {formatMoney(expenseBy("food"))} / {formatMoney(details.food_cost)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment method */}
                    <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
                      <h3 className="text-base font-semibold text-[#1f2933] mb-4">Payment method</h3>
                      
                      {/* Card info */}
                      <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[rgba(18,70,165,0.1)] rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                              <path d="M17.5 4.16667H2.5C1.57917 4.16667 0.833336 4.9125 0.833336 5.83333V14.1667C0.833336 15.0875 1.57917 15.8333 2.5 15.8333H17.5C18.4208 15.8333 19.1667 15.0875 19.1667 14.1667V5.83333C19.1667 4.9125 18.4208 4.16667 17.5 4.16667Z" stroke="#1246A5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M0.833336 8.33334H19.1667" stroke="#1246A5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-normal text-[#1f2933]">Corporate card</div>
                            <div className="text-xs text-[#6a7282]">Visa •••• 4242</div>
                          </div>
                        </div>
                      </div>

                      {/* Auto-fill toggle */}
                      <div className="bg-[rgba(24,160,166,0.05)] border border-[rgba(24,160,166,0.2)] rounded-lg p-4 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#1f2933] leading-snug">
                            Auto-fill purchase card forms and draft expense reports
                          </div>
                        </div>
                        <div className="relative inline-block w-8 h-[18px] flex-shrink-0">
                          <input type="checkbox" defaultChecked className="peer sr-only" id="auto-fill-toggle" />
                          <label htmlFor="auto-fill-toggle" className="block w-8 h-[18px] bg-[#030213] rounded-full cursor-pointer peer-focus:ring-2 peer-focus:ring-[#030213]/30 relative after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-[14px]"></label>
                        </div>
                      </div>
                    </div>

                    {/* View policy details */}
                    <button className="w-full bg-[rgba(31,157,85,0.1)] border border-[rgba(31,157,85,0.2)] hover:bg-[rgba(31,157,85,0.15)] text-[#1f2933] text-sm py-3 px-4 rounded-xl transition-colors text-left flex items-center justify-between font-normal h-14">
                      <span>View Policy Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Expenses Tab Content */}
          {activeTab === "expenses" && (
            <div className="p-6 min-h-[800px]">
              {/* Info banner */}
              <div className="mb-6 bg-[rgba(18,70,165,0.1)] border border-[rgba(18,70,165,0.2)] rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-[#1246a5] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#1f2933]">
                  Upload receipts to automatically extract expense details using AI. The system will capture merchant, amount, date, and categorize each expense.
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Expenses Table (624px) */}
                <div className="flex-1 lg:w-[624px] min-w-0">
                  <div className="bg-white/40 backdrop-blur-sm border border-[#e5e7eb] rounded-xl p-5">
                    {/* Header with title and buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                      <h3 className="text-base font-semibold text-[#1f2933]">Expenses ({expenses.length})</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          className="rounded-lg border-[rgba(0,0,0,0.1)] bg-[#f5f7fa] text-sm px-3 py-1.5 h-8 font-medium hover:bg-gray-50"
                        >
                          Select all
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-lg border-[rgba(0,0,0,0.1)] bg-[#f5f7fa] text-sm px-3 py-1.5 h-8 font-medium hover:bg-gray-50 gap-2"
                        >
                          <Filter className="w-4 h-4" />
                          Filter
                        </Button>
                        <Button
                          className="bg-[#916af5] hover:bg-[#7c59d4] text-white rounded-lg px-3 py-1.5 h-8 text-sm font-medium gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Receipt
                        </Button>
                      </div>
                    </div>

                    {/* Expenses Table */}
                    <div className="bg-white border border-[#e5e7eb] rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#f7f6f8] border-b border-[#e5e7eb]">
                            <tr>
                              <th className="text-left py-3 px-4 w-12">
                                
                              </th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-[#4a5565]">Date</th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-[#4a5565]">Merchant</th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-[#4a5565]">Category</th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-[#4a5565]">Amount</th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-[#4a5565]">File</th>
                            </tr>
                          </thead>
                          <tbody>
                            {expenses.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="py-10 px-4 text-center text-sm text-[#6a7282]">
                                  No expenses filed yet. Upload a receipt and the agent will read it.
                                </td>
                              </tr>
                            ) : (
                              expenses.map((expense) => (
                                <tr key={expense.id} className="border-b border-[#e5e7eb] hover:bg-gray-50/50">
                                  <td className="py-3 px-4">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                                  </td>
                                  <td className="py-3 px-4 text-sm text-[#1f2933]">{formatDate(expense.date)}</td>
                                  <td className="py-3 px-4 text-sm text-[#1f2933]">{expense.merchant}</td>
                                  <td className="py-3 px-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[rgba(18,70,165,0.1)] border border-[rgba(18,70,165,0.2)] text-xs text-[#1f2933]">
                                      {expense.category}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-sm font-normal text-[#1f2933]">
                                    ${Number(expense.amount ?? 0).toFixed(2)}
                                  </td>
                                  <td className="py-3 px-4">
                                    {expense.receipt_url ? (
                                      <a
                                        href={expense.receipt_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[#4a5565] hover:text-[#1f2933] inline-block"
                                      >
                                        <FileText className="w-4 h-4" />
                                      </a>
                                    ) : (
                                      <span className="text-[#c4c7ce]">
                                        <FileText className="w-4 h-4" />
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Expense Summary (397px) */}
                <div className="w-full lg:w-[397px] flex-shrink-0">
                  <div className="space-y-[18px]">
                    {/* Expense Summary Card */}
                    <div className="bg-[rgba(255,255,255,0.6)] backdrop-blur-sm border border-[#e5e7eb] rounded-xl p-6">
                      <h3 className="text-base font-semibold text-[#1f2933] mb-4">Expense summary</h3>
                      
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-sm text-[#4a5565]">Total expenses</span>
                        <span className="text-2xl font-normal text-[#0a0a0a]">{formatMoney(expenseTotal)}</span>
                      </div>

                      {/* Breakdown */}
                      <div className="space-y-3.5 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#4a5565]">Flights</span>
                          <span className="font-normal text-[#1f2933]">{formatMoney(expenseBy("flights"))}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#4a5565]">Hotels</span>
                          <span className="font-normal text-[#1f2933]">{formatMoney(expenseBy("hotel"))}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#4a5565]">Ground transportation</span>
                          <span className="font-normal text-[#1f2933]">{formatMoney(expenseBy("ground transport"))}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#4a5565]">Food </span>
                          <span className="font-normal text-[#1f2933]">{formatMoney(expenseBy("food"))}</span>
                        </div>
                      </div>

                      {/* Within policy indicator */}
                      <div className="flex items-center gap-2 text-sm text-[#52c93f]">
                        <CheckCircle className="w-4 h-4" />
                        <span>within policy</span>
                      </div>
                    </div>

                    {/* View policy details */}
                    <button className="w-full bg-[rgba(31,157,85,0.1)] border border-[rgba(31,157,85,0.2)] hover:bg-[rgba(31,157,85,0.15)] text-[#1f2933] text-sm py-3 px-4 rounded-xl transition-colors text-left flex items-center justify-between font-normal h-14">
                      <span>View Policy Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}