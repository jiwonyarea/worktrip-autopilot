import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Share2, 
  Download, 
  MapPin, 
  Calendar, 
  Plane,
  Hotel,
  ChevronRight,
  Filter,
  Upload,
  Info,
  Paperclip,
  Sparkles
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "../ui/button";
import { TripSummaryCard } from "../TripSummaryCard";
import { Typewriter } from "../Typewriter";
import { TripTotalsCard } from "../TripTotalsCard";
import { StatusIcon } from "../StatusIcon";
import { AnimatedMoney } from "../AnimatedMoney";
import { PolicyDialog } from "../PolicyDialog";
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
  // Motion loops are JS-driven, so the CSS reduced-motion rule cannot reach them.
  const reduceMotion = useReducedMotion();
  const [policyOpen, setPolicyOpen] = useState(false);
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
    <>
      <div
        className="min-h-screen relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
      {/* Main content */}
      <div className="relative max-w-[1088px] mx-auto px-4 sm:px-6 lg:px-8 pt-[60px] pb-8">
        {/* The agent speaking, in the same voice it used while planning —
            a sparkle and two lines, not a green success box. */}
        {isBooked && (
          <div className="mb-6 flex items-start gap-3">
            <motion.div
              animate={
                reduceMotion ? undefined : { scale: [1, 1.12, 1], rotate: [0, 8, 0, -8, 0] }
              }
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="flex-shrink-0"
            >
              <Sparkles className="w-10 h-10 text-[#916AF5] fill-[#916AF5]" aria-hidden />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-medium text-[20px] leading-tight text-[#0a0a0a] m-0">
                Worktrip Autopilot has completed the booking
              </h2>
              <Typewriter
                className="block text-[14px] font-normal text-[#4a5565] mt-1"
                text="Your confirmation will be sent to your inbox"
              />
            </div>
          </div>
        )}

        {/* Header - removed old back button and share section */}

        {/* Same trip card as every other screen — this one used to print raw
            ISO dates and drift from the rest. */}
        <TripSummaryCard
          className="mb-4"
          name={trip.trip_name || trip.inferred_trip_name || "Work Trip"}
          destination={trip.destination || trip.inferred_destination}
          venue={(trip as any).venue}
          venueAddress={(trip as any).venue_address}
          startDate={trip.start_date}
          endDate={trip.end_date}
          travelers={travelers}
          purpose={trip.purpose}
          chip={
            // One chip style across the app: filled purple for a state the
            // agent reached itself, a quiet outline for anything else.
            <div
              className={`${
                isBooked
                  ? "bg-[#916AF5] border-transparent"
                  : "bg-white border-[#D8D3E5]"
              } border rounded-full px-2.5 py-[4px] flex items-center justify-center`}
            >
              <span
                className={`font-medium text-[11px] leading-none ${
                  isBooked ? "text-white" : "text-[#4a5565]"
                }`}
              >
                {isBooked ? "\u2713 Booked" : trip.status}
              </span>
            </div>
          }
          actions={
            <Button className="bg-[#916af5] hover:bg-[#7c59d4] text-white rounded-lg px-3 py-1.5 h-8 text-sm font-medium gap-2">
              <Share2 className="w-4 h-4" />
              Share itinerary
            </Button>
          }
        />

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
                        <StatusIcon size={18} />
                        <h3 className="font-normal text-sm text-[#1f2933]">
                          All bookings confirmed
                        </h3>
                      </div>
                      <p className="text-xs text-[#4a5565] leading-relaxed">
                        Flights, hotels, and ground transportation are secured
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

                    {/* My Schedule Section - Bordered Container. Grows to take
                      whatever height the money column needs, so the two sides
                      of the page end level instead of leaving the schedule
                      stranded short. */}
                  <div className="flex-1 bg-white/40 backdrop-blur-sm rounded-xl border border-[#e5e7eb] p-5">
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
                      <div className="flex items-center gap-1.5">
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[rgba(0,0,0,0.1)] bg-[#f5f7fa] text-[#1f2933] hover:bg-gray-100 transition-colors"
                          aria-label="Share schedule"
                        >
                          <Share2 className="w-4 h-4" strokeWidth={1.75} />
                        </button>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[rgba(0,0,0,0.1)] bg-[#f5f7fa] text-[#1f2933] hover:bg-gray-100 transition-colors"
                          aria-label="Download schedule"
                        >
                          <Download className="w-4 h-4" strokeWidth={1.75} />
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
                            <div className="w-0.5 h-full bg-[#e5e7eb] rounded-full"></div>
                          </div>

                          {/* Events. The padding below the last one is what
                              the timeline runs on into: a rail stopping flush
                              with the final card reads as the day being cut
                              off rather than running out. */}
                          <div className="flex-1 space-y-2 pb-7">
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
                            <div className="w-0.5 h-full bg-[#e5e7eb] rounded-full"></div>
                          </div>

                          {/* Events. The padding below the last one is what
                              the timeline runs on into: a rail stopping flush
                              with the final card reads as the day being cut
                              off rather than running out. */}
                          <div className="flex-1 space-y-2 pb-7">
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
                    {/* Identical to the approval screen — same component,
                        so the figure cannot drift between the two. Per-diems
                        show what has actually been filed by now. */}
                    <TripTotalsCard
                      trip={trip}
                      itinerary={itinerary}
                      groundSpent={expenseBy("ground transport")}
                      foodSpent={expenseBy("food")}
                    />

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
                            <div className="text-sm font-normal text-[#1f2933]">Amex Corporate Platinum</div>
                            <div className="text-xs text-[#6a7282]">•••• 3007 · exp 09/28</div>
                          </div>
                        </div>
                      </div>

                      {/* Auto-fill toggle */}
                      <div className="bg-[#F6F3FE] border border-[#DFD6FA] rounded-lg p-4 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#1f2933] leading-snug">
                            Auto-fill purchase card forms and draft expense reports
                          </div>
                        </div>
                        <div className="relative inline-block w-8 h-[18px] flex-shrink-0">
                          <input type="checkbox" defaultChecked className="peer sr-only" id="auto-fill-toggle" />
                          <label htmlFor="auto-fill-toggle" className="block w-8 h-[18px] bg-[#D8D3E5] peer-checked:bg-[#916AF5] rounded-full cursor-pointer transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#916AF5]/40 relative after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-[14px]"></label>
                        </div>
                      </div>
                    </div>

                    {/* View policy details */}
                    <button
                      onClick={() => setPolicyOpen(true)}
                      className="w-full bg-[rgba(31,157,85,0.1)] border border-[rgba(31,157,85,0.2)] hover:bg-[rgba(31,157,85,0.15)] text-[#1f2933] text-sm py-3 px-4 rounded-xl transition-colors text-left flex items-center justify-between font-normal h-14"
                    >
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
            <div className="p-6 min-h-[800px] flex flex-col">
              {/* Info banner */}
              <div className="mb-6 bg-[rgba(18,70,165,0.1)] border border-[rgba(18,70,165,0.2)] rounded-xl px-4 py-3 flex items-center gap-3">
                <Info className="w-4 h-4 text-[#1246a5] flex-shrink-0" />
                <p className="text-xs text-[#1f2933] m-0 min-w-0">
                  Upload a receipt and the agent reads the merchant, amount, and date, then categorises it.
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* Left Column - Expenses Table (624px). The panel takes the
                    full height of the row, the same way the schedule does on
                    the overview tab, so the two sides of the page end level
                    however few expenses have been filed. */}
                <div className="flex-1 lg:w-[624px] min-w-0 flex">
                  <div className="w-full bg-white/40 backdrop-blur-sm border border-[#e5e7eb] rounded-xl p-5 flex flex-col">
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

                    {/* Expenses Table — takes the slack, so the panel grows
                        downwards rather than stretching its header. */}
                    <div className="flex-1 bg-white border border-[#e5e7eb] rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px]">
                          <thead className="bg-[#f7f6f8] border-b border-[#e5e7eb]">
                            <tr>
                              <th className="text-left py-3 px-4 w-12">
                                
                              </th>
                              <th className="text-left py-2.5 px-4 text-xs font-medium text-[#4a5565]">Date</th>
                              <th className="text-left py-2.5 px-4 text-xs font-medium text-[#4a5565]">Merchant</th>
                              <th className="text-left py-2.5 px-4 text-xs font-medium text-[#4a5565]">Category</th>
                              <th className="text-left py-2.5 px-4 text-xs font-medium text-[#4a5565]">Amount</th>
                              <th className="text-left py-2.5 px-4 text-xs font-medium text-[#4a5565]">File</th>
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
                                  <td className="py-2.5 px-4">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                                  </td>
                                  <td className="py-2.5 px-4 text-sm text-[#1f2933] whitespace-nowrap">{formatDate(expense.date)}</td>
                                  <td className="py-2.5 px-4 text-sm text-[#1f2933]">{expense.merchant}</td>
                                  <td className="py-2.5 px-4 text-sm text-[#4a5565] whitespace-nowrap">
                                    {expense.category}
                                  </td>
                                  <td className="py-2.5 px-4 text-sm font-normal text-[#1f2933] whitespace-nowrap">
                                    ${Number(expense.amount ?? 0).toFixed(2)}
                                  </td>
                                  {/* Icon only. The label this used to carry
                                      ("Filed by Autopilot") wrapped onto its own
                                      lines and made every row three deep; the
                                      tooltip says the same thing in no space. */}
                                  <td className="py-2.5 px-4">
                                    {expense.source === "agent" ? (
                                      <span
                                        className="text-[#916AF5] inline-block"
                                        title="Booked and filed by Worktrip Autopilot"
                                      >
                                        <Paperclip className="w-4 h-4" />
                                      </span>
                                    ) : expense.receipt_url ? (
                                      <a
                                        href={expense.receipt_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        title="Receipt attached — open it"
                                        className="text-[#4a5565] hover:text-[#1f2933] inline-block"
                                      >
                                        <Paperclip className="w-4 h-4" />
                                      </a>
                                    ) : (
                                      <span className="text-[#c4c7ce]" title="No receipt yet">
                                        <Paperclip className="w-4 h-4" />
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
                        <AnimatedMoney
                          value={expenseTotal}
                          className="text-3xl font-semibold text-[#0a0a0a]"
                        />
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
                      <div className="flex items-center gap-1.5 text-sm text-[#1F9D55]">
                        <StatusIcon size={16} />
                        <span>Within policy</span>
                      </div>
                    </div>

                    {/* View policy details */}
                    <button
                      onClick={() => setPolicyOpen(true)}
                      className="w-full bg-[rgba(31,157,85,0.1)] border border-[rgba(31,157,85,0.2)] hover:bg-[rgba(31,157,85,0.15)] text-[#1f2933] text-sm py-3 px-4 rounded-xl transition-colors text-left flex items-center justify-between font-normal h-14"
                    >
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

      <PolicyDialog open={policyOpen} onClose={() => setPolicyOpen(false)} />
    </>
  );
}
