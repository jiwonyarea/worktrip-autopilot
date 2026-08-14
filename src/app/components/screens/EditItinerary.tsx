import { useState } from "react";
import { 
  MapPin,
  Calendar,
  Users,
  Briefcase,
  CheckCircle2,
  Share2,
  FileUp,
  ChevronRight,
  CreditCard,
  Wifi
} from "lucide-react";
import { Switch } from "../ui/switch";
import svgPaths from "../../imports/svg-ldge2ag7mm";
import svgPathsExpenses from "../../imports/svg-9wx89hlv58";
import imgDelta from "figma:asset/50ba81ee3baed0d032549253a352c5d27d54adb9.png";
import imgBackground from "figma:asset/68491a71f021c38c1c7368d77b05b5434580c49f.png";
import { ExpensesTable } from "./EditItineraryExpensesTable";

interface EditItineraryProps {
  onBack?: () => void;
  onContinue?: () => void;
  tripId?: string | null;
  onComplete?: () => void;
  onBackToHome?: () => void;
}

export function EditItinerary({ onBack, onContinue, tripId, onComplete, onBackToHome }: EditItineraryProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "expenses">("overview");
  const [autoFillExpense, setAutoFillExpense] = useState(true);
  const [selectedOption, setSelectedOption] = useState<"balanced" | "cost-saver" | "time-saver">("balanced");

  // Mock data for different booking options - ordered: Balanced, Cost Saver, Time Saver
  const bookingOptions = {
    "balanced": {
      total: 1847,
      flights: 420,
      hotels: 1200,
      ground: 227,
      food: 0,
      outboundFlight: {
        time: "7:30-9:15",
        route: "PIT-LGA",
        airline: "Delta Airlines",
        flightNumber: "DL 3891",
        departureTime: "7:30 AM",
        arrivalTime: "9:15 AM",
        duration: "1h 45m",
        cabinClass: "Economy"
      },
      returnFlight: {
        time: "18:45-20:30",
        route: "LGA-PIT",
        airline: "United Airlines", 
        flightNumber: "UA 1652",
        departureTime: "6:45 PM",
        arrivalTime: "8:30 PM",
        duration: "1h 45m",
        cabinClass: "Economy"
      },
      hotel: "Hampton Inn Manhattan Times Square",
      hotelAddress: "851 8th Avenue, Midtown Manhattan",
      hotelStars: 4,
      hotelImage: "https://images.unsplash.com/photo-1662841540530-2f04bb3291e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      nights: 3,
      cancellationPolicy: "Free cancellation before Feb 28, 2026 at 11:59 PM (stay's local time)"
    },
    "cost-saver": {
      total: 1523,
      flights: 298,
      hotels: 975,
      ground: 250,
      food: 0,
      outboundFlight: {
        time: "5:45-7:45",
        route: "PIT-EWR",
        airline: "Spirit Airlines",
        flightNumber: "NK 624",
        departureTime: "5:45 AM",
        arrivalTime: "7:45 AM",
        duration: "2h 00m",
        cabinClass: "Economy"
      },
      returnFlight: {
        time: "21:30-23:25",
        route: "EWR-PIT",
        airline: "Spirit Airlines",
        flightNumber: "NK 713",
        departureTime: "9:30 PM",
        arrivalTime: "11:25 PM",
        duration: "1h 55m",
        cabinClass: "Economy"
      },
      hotel: "Holiday Inn Express Midtown West",
      hotelAddress: "538 W 48th Street, Hell's Kitchen",
      hotelStars: 3,
      hotelImage: "https://images.unsplash.com/photo-1631048835184-3f0ceda91b75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      nights: 3,
      cancellationPolicy: "Free cancellation before Feb 28, 2026 at 11:59 PM (stay's local time)"
    },
    "time-saver": {
      total: 2340,
      flights: 685,
      hotels: 1425,
      ground: 230,
      food: 0,
      outboundFlight: {
        time: "6:00-7:30",
        route: "PIT-LGA",
        airline: "Delta Airlines",
        flightNumber: "DL 2156",
        departureTime: "6:00 AM",
        arrivalTime: "7:30 AM",
        duration: "1h 30m",
        cabinClass: "First Class"
      },
      returnFlight: {
        time: "20:00-21:30",
        route: "LGA-PIT",
        airline: "Delta Airlines",
        flightNumber: "DL 3284",
        departureTime: "8:00 PM",
        arrivalTime: "9:30 PM",
        duration: "1h 30m",
        cabinClass: "First Class"
      },
      hotel: "Marriott Marquis Times Square",
      hotelAddress: "1535 Broadway, Times Square",
      hotelStars: 5,
      hotelImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      checkIn: "4:00 PM",
      checkOut: "12:00 PM",
      nights: 3,
      cancellationPolicy: "Free cancellation before Feb 28, 2026 at 11:59 PM (stay's local time)"
    }
  };

  const currentOption = bookingOptions[selectedOption];
  const secondaryOptions = Object.keys(bookingOptions).filter(key => key !== selectedOption) as Array<"balanced" | "cost-saver" | "time-saver">;

  const getOptionLabel = (option: string) => {
    switch(option) {
      case "balanced": return "Balanced option";
      case "cost-saver": return "Cost saver";
      case "time-saver": return "Time saver";
      default: return option;
    }
  };

  const totalBudget = 2500;
  const percentUsed = Math.round((currentOption.total / totalBudget) * 100);

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          <img alt="" className="absolute h-full left-[-7.62%] max-w-none top-0 w-[107.67%]" src={imgBackground} />
        </div>
        <div className="absolute bg-[rgba(255,255,255,0.39)] inset-0" />
      </div>
      <div className="fixed bg-[rgba(243,229,255,0.4)] blur-[64px] left-[392.73px] rounded-[15252000px] size-[383.999px] top-0" />
      <div className="fixed bg-[rgba(255,232,214,0.4)] blur-[64px] left-[794.18px] rounded-[15252000px] size-[383.999px] top-[859.47px]" />

      {/* Content */}
      <div className="relative z-10 pt-[81px] pb-[100px] pr-[0px] pl-[0px]">
        {/* Green Success Banner */}
        <div 
          className="absolute content-stretch flex flex-col h-[104.901px] items-start left-1/2 -translate-x-1/2 pb-[0.909px] pt-[23.999px] px-[31.996px] rounded-[24px] top-[128.9px] w-[1086.193px]" 
          style={{ backgroundImage: "linear-gradient(90deg, rgb(218, 250, 232) 0%, rgb(218, 250, 232) 100%), linear-gradient(90deg, rgba(209, 244, 224, 0.8) 0%, rgba(212, 233, 255, 0.8) 100%)" }}
        >
          <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.5)] border-b-[0.909px] border-solid inset-0 pointer-events-none rounded-[24px]" />
          <div className="content-stretch flex gap-[15.994px] h-[55.994px] items-center relative shrink-0 w-full">
            <div className="bg-[#42be5b] relative rounded-[15252000px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[55.994px]">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                <CheckCircle2 className="w-[27.997px] h-[27.997px] text-white" strokeWidth={2.3331} />
              </div>
            </div>
            <div className="h-[47.99px] relative shrink-0">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-px items-start relative size-full">
                <div className="h-[23.999px] relative shrink-0 w-full">
                  <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-0.73px] tracking-[-0.3125px] whitespace-nowrap">Your agent has completed the booking!</p>
                </div>
                <div className="h-[19.993px] relative shrink-0 w-full">
                  <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[0.36px] tracking-[-0.1504px] whitespace-nowrap">Flights, hotel, and ground transportation are locked in.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Header Card */}
        <div className="absolute bg-white border-[1.8px] border-[rgba(138,116,195,0.32)] border-solid h-[117px] left-1/2 -translate-x-1/2 rounded-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.17)] top-[254px] w-[1088px]">
          <div className="p-6 h-full flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] leading-[24px] tracking-[-0.3125px] text-[#1f2933] m-0">
                  AWS: re:Invent 2026
                </h3>
                <div className="bg-[#d0f4e0] rounded-full px-3 py-1 h-6 flex items-center justify-center">
                  <span className="font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[16px] text-[#42be5b]">
                    Booked
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[14px] text-[#4a5565]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-['Inter:Regular',sans-serif]">New York City</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-['Inter:Regular',sans-serif]">
                    2026-03-02 - 2026-03-05
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="font-['Inter:Regular',sans-serif]">1 traveler</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="font-['Inter:Regular',sans-serif]">Conference</span>
                </div>
              </div>
            </div>
            <button className="bg-[#F2F1F8] text-[#916AF5] border-[1.5px] border-[#916AF5] hover:bg-[#ddd0ff] rounded-lg px-4 py-2 font-['Inter:Regular',sans-serif] text-[14px] flex-shrink-0">
              View
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="absolute bg-white border-[1.8px] border-[rgba(138,116,195,0.32)] border-solid h-[790px] left-1/2 -translate-x-1/2 rounded-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.17)] top-[388px] w-[1088px]" />
        
        {/* Tab Navigation */}
        <div className="absolute border-[#e5e7eb] border-b-[0.674px] border-solid h-[53px] left-1/2 -translate-x-1/2 top-[390px] w-[1087px]">
          <button
            onClick={() => setActiveTab("overview")}
            className={`absolute h-[53px] left-[0.33px] top-0 w-[543px] content-stretch flex items-center justify-center pb-[5.8px] pt-[4px] px-[8px] rounded-tl-[24px] ${
              activeTab === "overview" ? "bg-[#f2f1f8]" : ""
            }`}
          >
            {activeTab === "overview" && (
              <div aria-hidden="true" className="absolute border-[#b9afd3] border-b-[1.8px] border-solid inset-0 pointer-events-none rounded-tl-[24px]" />
            )}
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#1f2933] text-[16px] text-center tracking-[-0.1504px]">Overview</p>
          </button>
          <button
            onClick={() => setActiveTab("expenses")}
            className={`absolute h-[53px] left-[543.33px] top-[0.0px] w-[544px] content-stretch flex items-center justify-center pb-[5.348px] pt-[4.674px] px-[8.674px] ${
              activeTab === "expenses" ? "bg-[#f2f1f8] rounded-tr-[24px]" : ""
            }`}
          >
            {activeTab === "expenses" && (
              <div aria-hidden="true" className="absolute border-[#b9afd3] border-b-[1.348px] border-l-[0.674px] border-r-[0.674px] border-solid border-t-[0.674px] inset-0 pointer-events-none rounded-tr-[24px]" />
            )}
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#1f2933] text-[16px] text-center tracking-[-0.1504px]">Expenses</p>
          </button>
        </div>

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <>
            {/* Left Column - Overview Content */}
            <div className="absolute content-stretch flex flex-col gap-[23.997px] items-start left-1/2 -translate-x-1/2 ml-[-208px] top-[467px] w-[624px] mt-[0px] mr-[0px] mb-[0px]">
              {/* Status Cards */}
              <div className="h-[105.31px] relative shrink-0 w-full">
                {/* All bookings confirmed */}
                <div className="absolute bg-[rgba(31,157,85,0.1)] content-stretch flex flex-col gap-[7.995px] h-[106px] items-start left-0 pb-[0.674px] pt-[16.665px] px-[16.665px] rounded-[10px] top-[-0.32px] w-[299px]">
                  <div aria-hidden="true" className="absolute border-[0.674px] border-[rgba(31,157,85,0.2)] border-solid inset-0 pointer-events-none rounded-[10px]" />
                  <div className="content-stretch flex gap-[7.995px] h-[23.997px] items-center relative shrink-0 w-full">
                    <div className="relative shrink-0 size-[19.994px]">
                      <CheckCircle2 className="w-full h-full text-[#1F9D55]" strokeWidth={1.66616} />
                    </div>
                    <div className="h-[23.997px] relative shrink-0">
                      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic text-[#1f2933] text-[16px] tracking-[-0.3125px] whitespace-nowrap">All bookings confirmed</p>
                    </div>
                  </div>
                  <div className="h-[40px] relative shrink-0 w-[255px]">
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic text-[#4a5565] text-[14px] tracking-[-0.1504px]">Flights, hotels, and ground transportation are secured</p>
                  </div>
                </div>

                {/* Next event */}
                <div className="absolute bg-[rgba(18,70,165,0.1)] content-stretch flex flex-col gap-[7.995px] h-[106px] items-start left-[319px] pb-[0.674px] pt-[16.665px] px-[16.665px] rounded-[10px] top-[-0.32px] w-[305px]">
                  <div aria-hidden="true" className="absolute border-[0.674px] border-[rgba(18,70,165,0.2)] border-solid inset-0 pointer-events-none rounded-[10px]" />
                  <div className="content-stretch flex gap-[7.995px] h-[23.997px] items-center relative shrink-0 w-full">
                    <div className="relative shrink-0 size-[19.994px]">
                      <Calendar className="w-full h-full text-[#1246A5]" strokeWidth={1.66616} />
                    </div>
                    <div className="h-[23.997px] relative shrink-0">
                      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic text-[#1f2933] text-[16px] tracking-[-0.3125px] whitespace-nowrap">Next event</p>
                    </div>
                  </div>
                  <div className="h-[19.994px] relative shrink-0 w-full">
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic text-[#4a5565] text-[14px] tracking-[-0.1504px]">Departure flight in 7 days</p>
                  </div>
                </div>
              </div>

              {/* My Schedule */}
              <div className="h-[557.164px] relative rounded-[10px] shrink-0 w-full">
                <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.674px] border-solid inset-0 pointer-events-none rounded-[10px]" />
                <div className="content-stretch flex flex-col gap-[15.991px] items-start pb-[0.674px] pt-[20.668px] px-[20.668px] relative size-full">
                  {/* Header */}
                  <div className="h-[23.997px] relative shrink-0 w-full">
                    <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#1f2933] text-[16px] top-[-0.98px] tracking-[-0.3125px]">My schedule</p>
                  </div>

                  {/* Timeline */}
                  <div className="content-stretch flex flex-col gap-[15.991px] h-[475.84px] items-start relative shrink-0 w-full overflow-y-auto">
                    {/* Mar 2 - Sunday */}
                    <div className="relative shrink-0 w-full">
                      <div className="content-stretch flex gap-[15.991px] items-start relative w-full">
                        {/* Date Badge */}
                        <div className="relative shrink-0 w-[56px]">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.995px] items-center relative">
                            <div className="bg-[#916af5] h-[38px] relative rounded-[22622000px] shrink-0 w-full">
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.1504px]">Mar 2</p>
                              </div>
                            </div>
                            <div className="bg-[#e5e7eb] h-[136.839px] shrink-0 w-[1.991px]" />
                          </div>
                        </div>

                        {/* Events */}
                        <div className="flex-1 relative">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[11.998px] items-start relative">
                            <div className="h-[19.994px] relative shrink-0 w-full">
                              <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#1f2933] text-[14px] top-[0.35px] tracking-[-0.1504px]">Sunday</p>
                            </div>

                            <div className="content-stretch flex flex-col gap-[7.995px] items-start relative shrink-0 w-full">
                              {/* Enhanced Flight Card */}
                              <div className="bg-[#f7f6f8] relative rounded-[10px] shrink-0 w-full p-3">
                                <div aria-hidden="true" className="absolute border border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[10px]" />
                                <div className="flex items-start gap-3 relative">
                                  {/* Airline Logo */}
                                  <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                                    <img src={imgDelta} alt="Airline" className="w-6 h-6 object-contain" />
                                  </div>
                                  
                                  <div className="flex-1">
                                    {/* Flight Times and Route */}
                                    <div className="flex items-center gap-3 mb-1">
                                      <div>
                                        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[18px] text-[#101828]">
                                          {currentOption.outboundFlight.departureTime}
                                        </p>
                                        <p className="font-['Inter:Regular',sans-serif] text-[11px] leading-[14px] text-[#6a7282]">
                                          {currentOption.outboundFlight.route.split('-')[0]}
                                        </p>
                                      </div>
                                      <div className="flex-1 flex items-center">
                                        <div className="h-[1px] bg-[#E5E7EB] flex-1" />
                                        <span className="font-['Inter:Regular',sans-serif] text-[10px] text-[#6a7282] mx-2">
                                          {currentOption.outboundFlight.duration}
                                        </span>
                                        <div className="h-[1px] bg-[#E5E7EB] flex-1" />
                                      </div>
                                      <div className="text-right">
                                        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[18px] text-[#101828]">
                                          {currentOption.outboundFlight.arrivalTime}
                                        </p>
                                        <p className="font-['Inter:Regular',sans-serif] text-[11px] leading-[14px] text-[#6a7282]">
                                          {currentOption.outboundFlight.route.split('-')[1]}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <p className="font-['Inter:Regular',sans-serif] text-[12px] leading-[16px] text-[#6a7282] mb-2">
                                      {currentOption.outboundFlight.airline} · {currentOption.outboundFlight.flightNumber} · {currentOption.outboundFlight.cabinClass}
                                    </p>
                                    
                                    {/* Bag Options */}
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-1">
                                        <svg className="w-3 h-3 text-[#0a0a0a]" viewBox="0 0 16 16" fill="none">
                                          <rect x="5" y="4" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                                          <path d="M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.2"/>
                                        </svg>
                                        <span className="font-['Inter:Regular',sans-serif] text-[10px] text-[#6a7282]">
                                          Underseat
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <svg className="w-3 h-3 text-[#0a0a0a]" viewBox="0 0 16 16" fill="none">
                                          <rect x="4" y="3" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                                          <path d="M6 3V2a1 1 0 011-1h2a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.2"/>
                                        </svg>
                                        <span className="font-['Inter:Regular',sans-serif] text-[10px] text-[#6a7282]">
                                          Carry-on
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced Hotel Check-in Card */}
                              <div className="bg-[#f7f6f8] relative rounded-[10px] shrink-0 w-full p-3">
                                <div aria-hidden="true" className="absolute border border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[10px]" />
                                <div className="flex items-start gap-3 relative">
                                  {/* Hotel Image */}
                                  <div className="w-[60px] h-[45px] rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={currentOption.hotelImage} alt="Hotel" className="w-full h-full object-cover" />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center gap-1 mb-0.5">
                                      {[...Array(currentOption.hotelStars)].map((_, i) => (
                                        <span key={i} className="text-[#F5A623] text-[9px]">★</span>
                                      ))}
                                    </div>
                                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] leading-[16px] text-[#101828] mb-0.5">
                                      {currentOption.hotel}
                                    </p>
                                    <div className="flex items-start gap-1 mb-1">
                                      <MapPin className="w-2.5 h-2.5 text-[#6a7282] mt-0.5 flex-shrink-0" />
                                      <p className="font-['Inter:Regular',sans-serif] text-[10px] leading-[13px] text-[#6a7282]">
                                        {currentOption.hotelAddress}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-[#6a7282]">
                                      <span className="font-['Inter:Regular',sans-serif]">Check-in {currentOption.checkIn}</span>
                                      <Wifi className="w-3 h-3 text-[#18A0A6]" />
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Cancellation policy */}
                                <div className="mt-2 pt-2 border-t border-[rgba(179,173,196,0.28)]">
                                  <div className="flex items-start gap-1.5">
                                    <Calendar className="w-3 h-3 text-[#6a7282] mt-0.5 flex-shrink-0" />
                                    <p className="font-['Inter:Regular',sans-serif] text-[9px] leading-[12px] text-[#6a7282]">
                                      {currentOption.cancellationPolicy}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conference Days 3-4 */}
                    <div className="relative shrink-0 w-full">
                      <div className="content-stretch flex gap-[15.991px] items-start relative w-full">
                        <div className="relative shrink-0 w-[56px]">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.995px] items-center relative">
                            <div className="bg-[#e5e7eb] h-[38px] relative rounded-[22622000px] shrink-0 w-full">
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#6a7282] text-[14px] tracking-[-0.1504px]">Mar 3-4</p>
                              </div>
                            </div>
                            <div className="bg-[#e5e7eb] h-[68.849px] shrink-0 w-[1.991px]" />
                          </div>
                        </div>

                        <div className="flex-1 relative">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.995px] items-start relative">
                            <div className="h-[19.994px] relative shrink-0 w-full">
                              <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#1f2933] text-[14px] top-[0.35px] tracking-[-0.1504px]">Mon - Tue</p>
                            </div>
                            <div className="bg-[#f7f6f8] h-[59.982px] relative rounded-[10px] shrink-0 w-full">
                              <div aria-hidden="true" className="absolute border border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[10px]" />
                              <div className="flex flex-col items-start px-[12.998px] py-[12px] relative size-full justify-center">
                                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[18px] text-[#101828]">Conference days</p>
                                <p className="font-['Inter:Regular',sans-serif] text-[12px] leading-[16px] text-[#6a7282]">AWS re:Invent 2026</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mar 5 - Wednesday - Return */}
                    <div className="relative shrink-0 w-full">
                      <div className="content-stretch flex gap-[15.991px] items-start relative w-full">
                        <div className="relative shrink-0 w-[56px]">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.995px] items-center relative">
                            <div className="bg-[#916af5] h-[38px] relative rounded-[22622000px] shrink-0 w-full">
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.1504px]">Mar 5</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 relative">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[11.998px] items-start relative">
                            <div className="h-[19.994px] relative shrink-0 w-full">
                              <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#1f2933] text-[14px] top-[0.35px] tracking-[-0.1504px]">Wednesday</p>
                            </div>

                            <div className="content-stretch flex flex-col gap-[7.995px] items-start relative shrink-0 w-full">
                              {/* Hotel Check-out */}
                              <div className="bg-[#f7f6f8] relative rounded-[10px] shrink-0 w-full p-3">
                                <div aria-hidden="true" className="absolute border border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[10px]" />
                                <div className="flex items-start gap-3 relative">
                                  <div className="w-[60px] h-[45px] rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={currentOption.hotelImage} alt="Hotel" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] leading-[16px] text-[#101828] mb-1">
                                      {currentOption.hotel}
                                    </p>
                                    <p className="font-['Inter:Regular',sans-serif] text-[11px] leading-[14px] text-[#6a7282]">
                                      Check out {currentOption.checkOut}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Return Flight - Enhanced */}
                              <div className="bg-[#f7f6f8] relative rounded-[10px] shrink-0 w-full p-3">
                                <div aria-hidden="true" className="absolute border border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[10px]" />
                                <div className="flex items-start gap-3 relative">
                                  <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                                    <img src={imgDelta} alt="Airline" className="w-6 h-6 object-contain" />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                      <div>
                                        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[18px] text-[#101828]">
                                          {currentOption.returnFlight.departureTime}
                                        </p>
                                        <p className="font-['Inter:Regular',sans-serif] text-[11px] leading-[14px] text-[#6a7282]">
                                          {currentOption.returnFlight.route.split('-')[0]}
                                        </p>
                                      </div>
                                      <div className="flex-1 flex items-center">
                                        <div className="h-[1px] bg-[#E5E7EB] flex-1" />
                                        <span className="font-['Inter:Regular',sans-serif] text-[10px] text-[#6a7282] mx-2">
                                          {currentOption.returnFlight.duration}
                                        </span>
                                        <div className="h-[1px] bg-[#E5E7EB] flex-1" />
                                      </div>
                                      <div className="text-right">
                                        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[18px] text-[#101828]">
                                          {currentOption.returnFlight.arrivalTime}
                                        </p>
                                        <p className="font-['Inter:Regular',sans-serif] text-[11px] leading-[14px] text-[#6a7282]">
                                          {currentOption.returnFlight.route.split('-')[1]}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <p className="font-['Inter:Regular',sans-serif] text-[12px] leading-[16px] text-[#6a7282] mb-2">
                                      {currentOption.returnFlight.airline} · {currentOption.returnFlight.flightNumber} · {currentOption.returnFlight.cabinClass}
                                    </p>
                                    
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-1">
                                        <svg className="w-3 h-3 text-[#0a0a0a]" viewBox="0 0 16 16" fill="none">
                                          <rect x="5" y="4" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                                          <path d="M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.2"/>
                                        </svg>
                                        <span className="font-['Inter:Regular',sans-serif] text-[10px] text-[#6a7282]">
                                          Underseat
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <svg className="w-3 h-3 text-[#0a0a0a]" viewBox="0 0 16 16" fill="none">
                                          <rect x="4" y="3" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                                          <path d="M6 3V2a1 1 0 011-1h2a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.2"/>
                                        </svg>
                                        <span className="font-['Inter:Regular',sans-serif] text-[10px] text-[#6a7282]">
                                          Carry-on
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Change booking link */}
                  <div className="absolute content-stretch flex gap-[5px] items-center left-[452px] top-[20.3px]">
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#8f8ba5] text-[14px] text-right tracking-[-0.1504px] w-[130px]">Change booking</p>
                    <div className="relative shrink-0 size-[15.994px]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9943 15.9943">
                        <g>
                          <path d={svgPaths.p673d800} stroke="#8F8BA5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Budget & Spend */}
            <div className="absolute content-stretch flex flex-col gap-[23.997px] items-start left-1/2 -translate-x-1/2 ml-[322px] top-[467px] w-[397px] mt-[0px] mr-[0px] mb-[0px]">
              {/* Budget & Spend Card */}
              <div className="relative bg-white content-stretch flex flex-col gap-[15.991px] items-start pb-[42px] pt-[24px] px-[24.671px] rounded-[14px] shrink-0 w-full mt-[0px] mr-[0px] mb-[-7px] ml-[0px] pr-[24px] pl-[24px]">
                <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.674px] border-solid inset-0 pointer-events-none rounded-[14px]" />
                
                <div className="h-[23.997px] relative shrink-0 w-full">
                  <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#1f2933] text-[16px] top-[-0.98px] tracking-[-0.3125px]">Budget & Spend</p>
                </div>

                <div className="content-stretch flex flex-col gap-[7.997px] h-[89.986px] items-start relative shrink-0 w-full">
                  <div className="h-[35.994px] relative shrink-0 w-full">
                    <div className="absolute h-[36px] left-[0.01px] top-[0.1px] w-[107px]">
                      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[#0a0a0a] text-[30px] top-0 tracking-[0.3955px] w-[107px]">${currentOption.total.toLocaleString()}</p>
                    </div>
                    <div className="absolute h-[19.993px] left-[106.74px] top-[14.09px] w-[63.182px]">
                      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.36px] tracking-[-0.1504px] w-[64px]">of ${totalBudget.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-[rgba(3,2,19,0.2)] content-stretch flex flex-col h-[10px] items-start overflow-clip pl-[-16.495px] pr-[16.495px] py-0 relative rounded-[15252000px] shrink-0 w-full">
                    <div 
                      className="absolute bg-gradient-to-r from-[#916af5] h-full left-0 rounded-[15252000px] to-[#b2a5fb] top-0" 
                      style={{ width: `${percentUsed}%` }}
                    />
                  </div>

                  <div className="h-[35.995px] relative shrink-0 w-full">
                    <div className="absolute h-[36px] left-0 top-0 w-full">
                      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[#4a5565] text-[12px] top-[8px] tracking-[-0.1504px]">{percentUsed}% of budget spent</p>
                    </div>
                  </div>
                </div>

                <div className="h-[159.958px] relative shrink-0 w-full">
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[#4a5565]">Flights</span>
                      <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[#0a0a0a]">${currentOption.flights}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[#4a5565]">Hotels</span>
                      <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[#0a0a0a]">${currentOption.hotels}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[#4a5565]">Ground</span>
                      <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[#0a0a0a]">${currentOption.ground}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[#4a5565]">Food</span>
                      <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[#0a0a0a]">${currentOption.food}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 w-full">
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-white border border-[#e5e7eb] hover:bg-gray-50 text-[#1f2933] rounded-lg px-4 py-2.5 font-['Inter:Regular',sans-serif] text-[14px] flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button className="flex-1 bg-white border border-[#e5e7eb] hover:bg-gray-50 text-[#1f2933] rounded-lg px-4 py-2.5 font-['Inter:Regular',sans-serif] text-[14px] flex items-center justify-center gap-2">
                    <FileUp className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Expenses Tab Content */}
        {activeTab === "expenses" && (
          <div className="absolute left-1/2 -translate-x-1/2 top-[467px] w-[1040px] px-6">
            <div className="content-stretch flex gap-6 items-start w-full">
              {/* Left Column - Expenses Table */}
              <div className="flex-1">
                <ExpensesTable />
              </div>
              
              {/* Right Column - Expense Settings */}
              <div className="w-[397px] flex-shrink-0">
                <div className="relative bg-white content-stretch flex flex-col gap-[15.991px] items-start pb-[24px] pt-[24px] px-[24px] rounded-[14px]">
                  <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.674px] border-solid inset-0 pointer-events-none rounded-[14px]" />
                  
                  <div className="h-[23.997px] relative shrink-0 w-full">
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] text-[#1f2933] text-[16px] tracking-[-0.3125px]">Expense settings</p>
                  </div>
                  
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full py-3 border-b border-[#e5e7eb]">
                    <div>
                      <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#1f2933] mb-1">Auto-fill expense reports</p>
                      <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#6a7282]">Automatically extract receipt data</p>
                    </div>
                    <Switch checked={autoFillExpense} onCheckedChange={setAutoFillExpense} />
                  </div>
                  
                  <div className="w-full pt-3">
                    <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#1f2933] mb-2">Total expenses</p>
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[24px] text-[#0a0a0a]">$2,400.00</p>
                    <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#6a7282] mt-1">2 receipts uploaded</p>
                  </div>
                  
                  <div className="w-full pt-3 border-t border-[#e5e7eb]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[#4a5565]">Flights</span>
                      <span className="font-['Inter:Medium',sans-serif] text-[14px] text-[#0a0a0a]">$1,200.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[#4a5565]">Hotels</span>
                      <span className="font-['Inter:Medium',sans-serif] text-[14px] text-[#0a0a0a]">$1,200.00</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-white border border-[#e5e7eb] hover:bg-gray-50 text-[#1f2933] rounded-lg px-4 py-2.5 font-['Inter:Medium',sans-serif] text-[14px] flex items-center justify-center gap-2 mt-3">
                    <FileUp className="w-4 h-4" />
                    Upload Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Action Buttons - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e7eb] py-4 z-20">
          <div className="max-w-[1088px] mx-auto px-6 flex items-center justify-between">
            <button 
              onClick={onBack}
              className="bg-white border border-[#e5e7eb] hover:bg-gray-50 text-[#1f2933] rounded-lg px-6 py-3 font-['Inter:Regular',sans-serif] text-[16px] transition-colors"
            >
              Back to options
            </button>
            <button 
              onClick={onComplete}
              className="bg-[#916af5] hover:bg-[#7c5dd4] text-white rounded-lg px-8 py-3 font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] transition-colors"
            >
              Continue to Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}