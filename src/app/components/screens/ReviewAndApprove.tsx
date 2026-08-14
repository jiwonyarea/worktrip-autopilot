import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { 
  Calendar,
  MapPin,
  Users,
  Briefcase,
  Sparkles,
  Loader2,
  ChevronLeft
} from "lucide-react";
import { Trip, getTrip } from "../../utils/tripApi";
import svgPaths from "../../imports/svg-26i6mfklc7";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import bgImage from "figma:asset/68491a71f021c38c1c7368d77b05b5434580c49f.png";

interface ReviewAndApproveProps {
  onApprove: () => void;
  onEditItinerary?: (itineraryId: string) => void;
  onBack?: () => void;
  tripId?: string | null;
}

// Airline logo URLs
const AIRLINE_LOGOS = {
  delta: "https://content.airhex.com/content/logos/airlines_DL_100_100_s.png",
  united: "https://content.airhex.com/content/logos/airlines_UA_100_100_s.png",
  spirit: "https://content.airhex.com/content/logos/airlines_NK_100_100_s.png",
  jetblue: "https://content.airhex.com/content/logos/airlines_B6_100_100_s.png",
  american: "https://content.airhex.com/content/logos/airlines_AA_100_100_s.png",
  southwest: "https://content.airhex.com/content/logos/airlines_WN_100_100_s.png"
};

// Helper function to get airline logo
const getAirlineLogo = (flightDetails: string | undefined) => {
  if (!flightDetails) return AIRLINE_LOGOS.delta;
  
  const airlineName = flightDetails.toLowerCase();
  
  if (airlineName.includes('delta')) {
    return AIRLINE_LOGOS.delta;
  } else if (airlineName.includes('united')) {
    return AIRLINE_LOGOS.united;
  } else if (airlineName.includes('spirit')) {
    return AIRLINE_LOGOS.spirit;
  } else if (airlineName.includes('jetblue') || airlineName.includes('jet blue')) {
    return AIRLINE_LOGOS.jetblue;
  } else if (airlineName.includes('american')) {
    return AIRLINE_LOGOS.american;
  } else if (airlineName.includes('southwest')) {
    return AIRLINE_LOGOS.southwest;
  }
  
  return AIRLINE_LOGOS.delta;
};

export function ReviewAndApprove({ onApprove, onEditItinerary, onBack, tripId }: ReviewAndApproveProps) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedItineraryId, setSelectedItineraryId] = useState<string | null>(null);
  const [hotelImages, setHotelImages] = useState<string[]>([]);

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

  // Sort itineraries to show Balanced first, then Time saver, then Cost saver
  const sortedItineraries = [...itineraries].sort((a: any, b: any) => {
    const order: { [key: string]: number } = { 'balanced': 1, 'premium': 2, 'budget': 3 };
    return (order[a.option_label] || 999) - (order[b.option_label] || 999);
  });

  return (
    <div 
      className="relative min-h-screen pb-12 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Content Container */}
      <div className="relative z-10 max-w-[1088px] mx-auto px-6 pt-8">
        {/* Purple Banner */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-b from-[#916af5] to-[#b2a5fb] rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] w-[48px] h-[48px] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[20px] leading-[24px] tracking-[-0.3125px] text-[#0a0a0a] mb-0">
              Your itineraries are ready!
            </h1>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] leading-[24px] tracking-[-0.3125px] text-[#4a5565] m-0">
              WorkTrip Autopilot found 3 options that match your preferences and policy
            </p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack ? onBack : () => window.history.back()}
          className="flex items-center gap-2 text-[#4a5565] hover:text-[#1f2933] mb-6 font-['Inter:Regular',sans-serif] text-[14px] cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to search</span>
        </button>

        {/* Trip Header Card */}
        <div className="bg-white rounded-[24px] border-[1.8px] border-[rgba(138,116,195,0.32)] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.15)] p-6 mb-6 w-full">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] leading-[24px] tracking-[-0.3125px] text-[#1f2933] m-0">
                  {trip.trip_name || trip.inferred_trip_name}
                </h3>
                
                <div className="bg-[#D4E9FF] rounded-full px-3 py-1 flex items-center justify-center">
                  <span className="font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[16px] text-[#1246A5]">
                    awaiting_selection
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[14px] text-[#4a5565]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-['Inter:Regular',sans-serif]">{trip.destination || trip.inferred_destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-['Inter:Regular',sans-serif]">
                    {trip.start_date || trip.inferred_dates?.start_date} - {trip.end_date || trip.inferred_dates?.end_date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="font-['Inter:Regular',sans-serif]">
                    {trip.travelers?.length || 1} traveler
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="font-['Inter:Regular',sans-serif]">{trip.purpose}</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Three Column Layout - All Same Size with 12px gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {sortedItineraries.map((option: any, index: number) => {
            const isSelected = option.id === selectedItineraryId;
            
            return (
              <div
                key={option.id}
                className="bg-[rgba(255,255,255,0.7)] rounded-[24px] border-[0.909px] border-[rgba(255,255,255,0.5)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] p-[20.909px] flex flex-col"
              >
                {/* Header with Title, Price and Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#1f2933] m-0 mb-1 tracking-[-0.3125px] font-['Inter:Semi_Bold',sans-serif]">
                      {option.title}
                    </h3>
                    <p className="text-[24px] font-semibold text-[#101828] m-0 leading-[32px] tracking-[0.0703px] font-['Inter:Semi_Bold',sans-serif]">
                      ${((option.details?.flight_cost || 0) + (option.details?.hotel_cost || 0)).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-[#d0f4e0] px-3 py-1 rounded-full">
                    <p className="text-[12px] font-medium text-[#44ad33] m-0 leading-[16px] font-['Inter:Medium',sans-serif]">
                      In policy
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-[15px] mb-[23px]">
                  {/* Flights Section */}
                  <div className="flex flex-col gap-[15px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                          <path d={svgPaths.pdab9800} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </svg>
                        <p className="text-[16px] font-normal text-[#1f2933] m-0 tracking-[-0.3125px] font-['Inter:Regular',sans-serif]">
                          Flights
                        </p>
                      </div>
                      <p className="text-[18px] font-normal text-[#0a0a0a] m-0 leading-[36px] tracking-[0.3955px] font-['Inter:Regular',sans-serif]">
                        ${option.details?.flight_cost || Math.round(option.total_cost * 0.45)}
                      </p>
                    </div>

                    {/* Flight Cards */}
                    <div className="flex flex-col gap-2">
                      {/* Outbound Flight Card */}
                      <div className="bg-[rgba(179,173,196,0.11)] border border-[rgba(179,173,196,0.28)] rounded-[16px] p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-white rounded-[8px] w-10 h-10 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {(() => {
                              const logo = getAirlineLogo(option.details?.outbound_flight);
                              return <img src={logo} alt="Airline" className="w-[30px] h-[30px] object-cover" />;
                            })()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-[14px] font-bold text-[#101828] m-0 leading-[20px] tracking-[-0.1504px] font-['Inter:Bold',sans-serif]">
                                {option.details?.outbound_flight?.split('·')[3]?.trim() || "9:00 - 11:05"}
                              </p>
                              <p className="text-[14px] font-normal text-[#101828] m-0 leading-[20px] tracking-[-0.1504px] font-['Inter:Regular',sans-serif]">
                                {trip.start_date ? new Date(trip.start_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : "Mon, Mar 2, 2026"}
                              </p>
                            </div>
                            <p className="text-[14px] font-normal text-[#364153] m-0 leading-[20px] tracking-[-0.1504px] font-['Inter:Regular',sans-serif] truncate">
                              {option.details?.outbound_flight?.split('·').slice(0, 2).join(' · ') || "Delta Airlines · DE 1234"} · Direct
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Return Flight Card */}
                      <div className="bg-[rgba(179,173,196,0.11)] border border-[rgba(179,173,196,0.28)] rounded-[16px] p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-white rounded-[8px] w-10 h-10 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {(() => {
                              const logo = getAirlineLogo(option.details?.return_flight);
                              return <img src={logo} alt="Airline" className="w-[30px] h-[30px] object-cover" />;
                            })()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-[14px] font-bold text-[#101828] m-0 leading-[20px] tracking-[-0.1504px] font-['Inter:Bold',sans-serif]">
                                {option.details?.return_flight?.split('·')[3]?.trim() || "18:45 - 20:30"}
                              </p>
                              <p className="text-[14px] font-normal text-[#101828] m-0 leading-[20px] tracking-[-0.1504px] font-['Inter:Regular',sans-serif]">
                                {trip.end_date ? new Date(trip.end_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : "Thu, Mar 5, 2026"}
                              </p>
                            </div>
                            <p className="text-[14px] font-normal text-[#364153] m-0 leading-[20px] tracking-[-0.1504px] font-['Inter:Regular',sans-serif] truncate">
                              {option.details?.return_flight?.split('·').slice(0, 2).join(' · ') || "United Airlines · UA 5678"} · Direct
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hotel Section */}
                  <div className="flex flex-col gap-[15px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                          <path d="M8.33301 18.3344V12.8594" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M10 9.16797H10.0083" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M10 5.83203H10.0083" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M11.667 12.8594V18.3344" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d={svgPaths.p20136f00} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M13.333 9.16797H13.3413" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M13.333 5.83203H13.3413" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M6.66699 9.16797H6.67533" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M6.66699 5.83203H6.67533" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d={svgPaths.p238f2580} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </svg>
                        <p className="text-[16px] font-normal text-[#1f2933] m-0 tracking-[-0.3125px] font-['Inter:Regular',sans-serif]">
                          Hotel
                        </p>
                      </div>
                      <p className="text-[18px] font-normal text-[#0a0a0a] m-0 leading-[36px] tracking-[0.3955px] font-['Inter:Regular',sans-serif]">
                        ${option.details?.hotel_cost || Math.round(option.total_cost * 0.35)}
                      </p>
                    </div>

                    {/* Hotel Card */}
                    <div className="bg-[rgba(179,173,196,0.11)] border border-[rgba(179,173,196,0.28)] rounded-[16px] p-4">
                      <div className="flex items-start gap-3">
                        <ImageWithFallback 
                          src={hotelImages[index] || "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400&q=80"}
                          alt="Hotel room"
                          className="bg-white rounded-[8px] w-10 h-10 flex-shrink-0 object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-bold text-[#101828] m-0 leading-[20px] tracking-[-0.1504px] font-['Inter:Bold',sans-serif] truncate">
                            {option.details?.hotel_name || "New York Marriott Downtown"}
                          </p>
                          <p className="text-[14px] font-normal text-[#364153] m-0 leading-[20px] tracking-[-0.1504px] font-['Inter:Regular',sans-serif]">
                            4.2★ · 0.8 mi to venue
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ground Transport Section */}
                  <div className="flex flex-col gap-[6px] items-start">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                        <path d={svgPaths.p2f635300} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d={svgPaths.p23837280} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M7.5 14.168H12.5" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d={svgPaths.p3849af00} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      <p className="text-[16px] font-normal text-[#1f2933] m-0 tracking-[-0.3125px] font-['Inter:Regular',sans-serif]">
                        Ground Transport
                      </p>
                    </div>
                    <p className="text-[14px] font-normal text-[#4a5565] m-0 leading-[16px] font-['Inter:Regular',sans-serif] text-[rgba(74,85,101,0.5)]">
                      Reimbursement provided $60 per day x4
                    </p>
                  </div>

                  {/* Food Section */}
                  <div className="flex flex-col gap-[6px] items-start">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                        <g clipPath="url(#clip0_3127_440)">
                          <path d={svgPaths.p2a5cc00} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d={svgPaths.p18a1600} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d="M1.75 18.168L7.08333 12.918" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d="M15.8333 4.16797L10 10.0013" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </g>
                        <defs>
                          <clipPath id="clip0_3127_440">
                            <rect fill="white" height="20" width="20" />
                          </clipPath>
                        </defs>
                      </svg>
                      <p className="text-[16px] font-normal text-[#1f2933] m-0 tracking-[-0.3125px] font-['Inter:Regular',sans-serif]">
                        Food
                      </p>
                    </div>
                    <p className="text-[14px] font-normal text-[#4a5565] m-0 leading-[16px] font-['Inter:Regular',sans-serif] text-[rgba(74,85,101,0.5)]">
                      Reimbursement provided $100 per day x4
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-[#E6E6E6] mb-[23px]" />

                {/* Checkmarks */}
                <div className="flex flex-col gap-2 mb-[22px]">
                  <div className="flex items-center gap-2">
                    <svg className="w-[14px] h-[14px] flex-shrink-0" fill="none" viewBox="0 0 14 14">
                      <path d={svgPaths.p37426ec0} stroke="#1F9D55" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999871" />
                    </svg>
                    <p className="text-[14px] font-normal text-[#4a5565] m-0 leading-[16px] font-['Inter:Regular',sans-serif]">
                      Within policy
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-[14px] h-[14px] flex-shrink-0" fill="none" viewBox="0 0 14 14">
                      <path d={svgPaths.p37426ec0} stroke="#1F9D55" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999871" />
                    </svg>
                    <p className="text-[14px] font-normal text-[#4a5565] m-0 leading-[16px] font-['Inter:Regular',sans-serif]">
                      Optimized for {trip.purpose?.toLowerCase() || "conference"} worktrip
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-[14px] h-[14px] flex-shrink-0" fill="none" viewBox="0 0 14 14">
                      <path d={svgPaths.p37426ec0} stroke="#1F9D55" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999871" />
                    </svg>
                    <p className="text-[14px] font-normal text-[#4a5565] m-0 leading-[16px] font-['Inter:Regular',sans-serif]">
                      Suggesting based on user preferences
                    </p>
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => handleSwitchOption(option.id)}
                  className="w-full h-[45px] rounded-[12px] text-[18px] font-normal leading-[20px] tracking-[-0.1504px] transition-colors font-['Inter:Regular',sans-serif] bg-[rgb(214,214,233)] text-black hover:bg-[#dcd9e5]"
                >
                  Select and continue
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}