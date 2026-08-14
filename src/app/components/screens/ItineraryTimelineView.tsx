import { useState } from "react";
import { 
  Plane, 
  Hotel, 
  Car,
  Calendar,
  MapPin,
  Wifi,
  X,
  Edit2,
  Trash2,
  Plus
} from "lucide-react";
import { Button } from "../ui/button";
import exampleImage from 'figma:asset/e8a7e342a34cff82093c30ed98a68c6b2fa1f5f4.png';

interface Flight {
  departure_time: string;
  arrival_time: string;
  departure_airport: string;
  arrival_airport: string;
  airline: string;
  flight_number: string;
  cabin_class: string;
  duration: string;
  underseat_bag: boolean;
  carry_on_bag: boolean;
  airline_logo?: string;
}

interface Hotel {
  name: string;
  address: string;
  star_rating: number;
  room_type: string;
  check_in_date: string;
  check_in_time: string;
  check_out_date: string;
  check_out_time: string;
  amenities: string[];
  image_url?: string;
  cancellation_policy?: string;
  nights: number;
}

interface DayItem {
  type: 'flight' | 'hotel' | 'car';
  data: Flight | Hotel | any;
}

interface TimelineDay {
  date: string;
  dayOfWeek: string;
  items: DayItem[];
}

interface ItineraryTimelineViewProps {
  tripName: string;
  tripId: string;
  startDate: string;
  endDate: string;
  origin: string;
  destination: string;
  travelers: any[];
  itinerary: any;
  totalCost: number;
  onEdit?: (type: string, id: string) => void;
  onDelete?: (type: string, id: string) => void;
  compact?: boolean;
}

// Helper function to parse flight summary into structured data
function parseFlightSummary(summary: string, date: string): Flight | null {
  if (!summary) return null;
  
  // Example: "7:19 AM PIT → 8:56 AM EWR United Airlines • UA3599 • Economy"
  // Or: "Roundtrip economy PIT-JFK on Spirit Airlines"
  // Or: "PIT-LGA · Delta Airlines · DL 3891 · 7:30-9:15"
  
  // Try to extract structured data from summary
  const timeMatch = summary.match(/(\d{1,2}:\d{2})\s*(?:AM|PM|am|pm)?[\s-·→]*(\d{1,2}:\d{2})\s*(?:AM|PM|am|pm)?/);
  const airportMatch = summary.match(/([A-Z]{3})[\s-·→]+([A-Z]{3})/);
  const airlineMatch = summary.match(/(United Airlines|Delta Airlines|Delta|Spirit Airlines|Spirit|JetBlue Airways|JetBlue|American Airlines|American|Southwest)/i);
  const flightNumMatch = summary.match(/([A-Z]{1,2})\s*(\d{3,4})/);
  const classMatch = summary.match(/(Economy|Business|First Class|Premium Economy)/i);
  const directMatch = summary.match(/(Direct|Nonstop)/i);
  
  // Determine airline from summary
  let airline = "United Airlines";
  let airlineLogo = "https://images.unsplash.com/photo-1761371717764-ad2328bba66f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml0ZWQlMjBhaXJsaW5lcyUyMGxvZ298ZW58MXx8fHwxNzY5MDM5MjU2fDA&ixlib=rb-4.1.0&q=80&w=1080";
  
  if (airlineMatch) {
    const airlineName = airlineMatch[0];
    if (airlineName.toLowerCase().includes('delta')) {
      airline = "Delta Airlines";
    } else if (airlineName.toLowerCase().includes('spirit')) {
      airline = "Spirit Airlines";
    } else if (airlineName.toLowerCase().includes('jetblue')) {
      airline = "JetBlue Airways";
    } else if (airlineName.toLowerCase().includes('american')) {
      airline = "American Airlines";
    } else if (airlineName.toLowerCase().includes('southwest')) {
      airline = "Southwest Airlines";
    } else {
      airline = airlineName;
    }
  }
  
  return {
    departure_time: timeMatch?.[1] ? `${timeMatch[1]} ${summary.includes('AM') || summary.includes('am') ? 'AM' : 'PM'}` : "7:19 AM",
    arrival_time: timeMatch?.[2] ? `${timeMatch[2]} ${summary.includes('AM') || summary.includes('am') ? 'AM' : 'PM'}` : "8:56 AM",
    departure_airport: airportMatch?.[1] || "PIT",
    arrival_airport: airportMatch?.[2] || "EWR",
    airline: airline,
    flight_number: flightNumMatch ? `${flightNumMatch[1]}${flightNumMatch[2]}` : "UA3599",
    cabin_class: classMatch?.[1] || "Economy",
    duration: directMatch ? "1h 37m" : "1h 37m",
    underseat_bag: true,
    carry_on_bag: true,
    airline_logo: airlineLogo,
  };
}

// Helper function to parse hotel summary into structured data
function parseHotelSummary(summary: string, startDate: string, endDate: string, nights: number): Hotel | null {
  if (!summary) return null;
  
  // Example: "Pod Times Square – 43 nights, about $90/night with long-term discount, Midtown Manhattan, near subway"
  // Or: "Hampton Inn Manhattan Times Square"
  
  const nameMatch = summary.match(/^([^–—-]+)/);
  const addressMatch = summary.match(/(Midtown|Times Square|Chelsea|Manhattan|Downtown)/);
  
  return {
    name: nameMatch?.[1]?.trim() || "New York Marriott Downtown",
    address: addressMatch?.[0] ? `85 West Street at Albany Street, ${addressMatch[0]}` : "85 West Street at Albany Street",
    star_rating: 4,
    room_type: "1x Deluxe King Room",
    check_in_date: startDate,
    check_in_time: "4:00 PM",
    check_out_date: endDate,
    check_out_time: "11:00 AM",
    amenities: ["wifi", "parking"],
    image_url: "https://images.unsplash.com/photo-1662841540530-2f04bb3291e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3Njg5Mzk2MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    nights: nights,
    cancellation_policy: `Free cancellation before ${new Date(new Date(startDate).getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at 11:59 PM (stay's local time)`
  };
}

// Helper to format date
function formatDate(dateStr: string): { date: string; dayOfWeek: string } {
  const date = new Date(dateStr);
  return {
    date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' })
  };
}

export function ItineraryTimelineView({
  tripName,
  tripId,
  startDate,
  endDate,
  origin,
  destination,
  travelers,
  itinerary,
  totalCost,
  onEdit,
  onDelete,
  compact = false
}: ItineraryTimelineViewProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  
  // Build timeline from itinerary data
  const timeline: TimelineDay[] = [];
  
  // Parse the itinerary details to build the timeline
  const details = itinerary?.details || {};
  
  // Outbound flight day
  if (details.flight_summary || details.outbound_flight) {
    const outboundSummary = details.flight_summary || details.outbound_flight || "";
    const flight = parseFlightSummary(outboundSummary, startDate);
    
    if (flight) {
      const { date, dayOfWeek } = formatDate(startDate);
      timeline.push({
        date,
        dayOfWeek,
        items: [
          { type: 'flight', data: flight }
        ]
      });
    }
  }
  
  // Hotel stay (middle days)
  if (details.hotel_summary || details.hotel_name) {
    const hotelSummary = details.hotel_summary || details.hotel_name || "";
    const nights = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    const hotel = parseHotelSummary(hotelSummary, startDate, endDate, nights);
    
    if (hotel) {
      const { date, dayOfWeek } = formatDate(startDate);
      
      // Add hotel to the same day as outbound flight or create new day
      const existingDay = timeline.find(d => d.date === date);
      if (existingDay) {
        existingDay.items.push({ type: 'hotel', data: hotel });
      } else {
        timeline.push({
          date,
          dayOfWeek,
          items: [
            { type: 'hotel', data: hotel }
          ]
        });
      }
    }
  }
  
  // Return flight day
  if (details.return_flight) {
    const returnSummary = details.return_flight;
    const flight = parseFlightSummary(returnSummary, endDate);
    
    if (flight) {
      const { date, dayOfWeek } = formatDate(endDate);
      timeline.push({
        date,
        dayOfWeek,
        items: [
          { type: 'flight', data: flight }
        ]
      });
    }
  }
  
  return (
    <div className="relative">
      {/* Header Section */}
      {!compact && (
        <div className="bg-white rounded-[24px] border-[1.8px] border-[rgba(138,116,195,0.32)] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.15)] p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] leading-[24px] tracking-[-0.3125px] text-[#1f2933] m-0">
                  {tripName}
                </h3>
                <button className="text-[#4a5565] hover:text-[#1f2933]">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#4a5565] m-0">
                {startDate} - {endDate}
              </p>
            </div>
            <div className="bg-[#D4E9FF] rounded-full px-3 py-1">
              <span className="font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[16px] text-[#1246A5]">
                Draft
              </span>
            </div>
          </div>
          
          {/* Travelers */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM4 14a4 4 0 018 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#1f2933] m-0">
                Travelers
              </p>
            </div>
            <div className="flex items-center gap-2 pl-7">
              <div className="w-8 h-8 rounded-full bg-[#916AF5] flex items-center justify-center">
                <span className="font-['Inter:Medium',sans-serif] font-medium text-[12px] text-white">
                  JP
                </span>
              </div>
              <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#364153]">
                {travelers?.[0]?.name || "Jiwon Park"}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* What would you like to add? */}
      {!compact && (
        <div className="mb-6">
          <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] leading-[24px] tracking-[-0.3125px] text-[#1f2933] mb-3">
            What would you like to add?
          </h3>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#E6E6E6] hover:border-[#916AF5] transition-colors">
              <Plane className="w-4 h-4" />
              <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#1f2933]">Flights</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#E6E6E6] hover:border-[#916AF5] transition-colors">
              <Hotel className="w-4 h-4" />
              <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#1f2933]">Stays</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#E6E6E6] hover:border-[#916AF5] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#1f2933]">Trains</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#E6E6E6] hover:border-[#916AF5] transition-colors">
              <Car className="w-4 h-4" />
              <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#1f2933]">Cars</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Timeline */}
      <div className="space-y-6">
        {timeline.map((day, dayIndex) => (
          <div key={dayIndex}>
            {/* Day Header */}
            <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[18px] leading-[24px] text-[#0a0a0a] mb-4">
              {day.dayOfWeek}, {day.date}
            </h3>
            
            {/* Day Items */}
            <div className="relative pl-10 space-y-4">
              {/* Timeline vertical line */}
              <div className="absolute left-[15px] top-0 bottom-0 w-[1px] bg-[#E6E6E6]" />
              
              {day.items.map((item, itemIndex) => (
                <div key={itemIndex} className="relative">
                  {/* Timeline dot with icon */}
                  <div className="absolute left-[-25px] top-4 w-[30px] h-[30px] bg-white border-[2px] border-[#E6E6E6] rounded-full flex items-center justify-center">
                    {item.type === 'flight' && <Plane className="w-4 h-4 text-[#4a5565]" />}
                    {item.type === 'hotel' && <Hotel className="w-4 h-4 text-[#4a5565]" />}
                    {item.type === 'car' && <Car className="w-4 h-4 text-[#4a5565]" />}
                  </div>
                  
                  {/* Item Card */}
                  {item.type === 'flight' && <FlightCard flight={item.data} onEdit={onEdit} onDelete={onDelete} />}
                  {item.type === 'hotel' && <HotelCard hotel={item.data} onEdit={onEdit} onDelete={onDelete} />}
                  {item.type === 'car' && <CarCard car={item.data} onEdit={onEdit} onDelete={onDelete} />}
                </div>
              ))}
              
              {/* Add button at the end of day */}
              {!compact && (
                <div className="relative">
                  <div className="absolute left-[-25px] top-4 w-[30px] h-[30px] bg-white border-[2px] border-[#916AF5] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#916AF5] hover:text-white transition-colors group">
                    <Plus className="w-4 h-4 text-[#916AF5] group-hover:text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Rental car suggestion */}
      {!compact && (
        <div className="mt-6 bg-white rounded-[16px] border border-[#E6E6E6] p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[20px] text-[#1f2933] mb-1">
                Rent a car now, decide later
              </h4>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#4a5565]">
                With free cancelation and unlimited mileage, you have total flexibility if plans change
              </p>
            </div>
            <Button className="bg-black hover:bg-gray-800 text-white rounded-lg px-4 py-2 flex items-center gap-2">
              <Car className="w-4 h-4" />
              <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px]">Search cars</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Total Price (if compact mode, show in footer) */}
      {!compact && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-[16px] border-[1.8px] border-[rgba(138,116,195,0.32)] p-6">
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] leading-[24px] tracking-[-0.3125px] text-[#1f2933] m-0">
            Total price of trip
          </p>
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[32px] leading-[40px] text-[#0a0a0a] m-0">
            ${totalCost.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

// Flight Card Component
function FlightCard({ flight, onEdit, onDelete }: { flight: Flight; onEdit?: (type: string, id: string) => void; onDelete?: (type: string, id: string) => void }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E6E6E6] p-6 hover:border-[#916AF5] transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Plane className="w-5 h-5 text-[#4a5565]" />
          <h4 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] leading-[24px] text-[#1f2933] m-0">
            Flight to {flight.arrival_airport}
          </h4>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg" onClick={() => onDelete?.('flight', flight.flight_number)}>
            <Trash2 className="w-4 h-4 text-[#4a5565]" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg" onClick={() => onEdit?.('flight', flight.flight_number)}>
            <Edit2 className="w-4 h-4 text-[#4a5565]" />
          </button>
        </div>
      </div>
      
      <div className="flex items-start gap-4">
        {/* Airline Logo */}
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          {flight.airline_logo ? (
            <img src={flight.airline_logo} alt={flight.airline} className="w-8 h-8 object-contain" />
          ) : (
            <Plane className="w-6 h-6 text-[#4a5565]" />
          )}
        </div>
        
        {/* Flight Details */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <p className="font-['Inter:Bold',sans-serif] font-bold text-[16px] leading-[24px] text-[#101828] m-0">
              {flight.departure_time}
            </p>
            <div className="h-[1px] bg-[#E6E6E6] flex-1" />
            <p className="font-['Inter:Bold',sans-serif] font-bold text-[16px] leading-[24px] text-[#101828] m-0">
              {flight.arrival_time}
            </p>
          </div>
          
          <div className="flex items-center gap-4 mb-3">
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] text-[#4a5565] m-0">
              {flight.departure_airport}
            </p>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-[#8f8ba5] m-0">
              {flight.duration}
            </p>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] text-[#4a5565] m-0">
              {flight.arrival_airport}
            </p>
          </div>
          
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] text-[#364153] mb-3">
            {flight.airline} • {flight.flight_number} • {flight.cabin_class}
          </p>
          
          {/* Bag Options */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="4" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-[#4a5565]">
                Underseat bag
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <rect x="4" y="3" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 3V2a1 1 0 011-1h2a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-[#4a5565]">
                Carry-on bag
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hotel Card Component
function HotelCard({ hotel, onEdit, onDelete }: { hotel: Hotel; onEdit?: (type: string, id: string) => void; onDelete?: (type: string, id: string) => void }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E6E6E6] p-6 hover:border-[#916AF5] transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Hotel className="w-5 h-5 text-[#4a5565]" />
          <h4 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] leading-[24px] text-[#1f2933] m-0">
            {hotel.nights}-night stay in {hotel.name.includes('New York') ? 'New York' : 'destination'}
          </h4>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg" onClick={() => onDelete?.('hotel', hotel.name)}>
            <Trash2 className="w-4 h-4 text-[#4a5565]" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg" onClick={() => onEdit?.('hotel', hotel.name)}>
            <Edit2 className="w-4 h-4 text-[#4a5565]" />
          </button>
        </div>
      </div>
      
      <div className="flex gap-4">
        {/* Hotel Image */}
        <div className="w-[140px] h-[105px] rounded-lg overflow-hidden flex-shrink-0">
          {hotel.image_url ? (
            <img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <Hotel className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Hotel Details */}
        <div className="flex-1">
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center">
                {[...Array(hotel.star_rating)].map((_, i) => (
                  <span key={i} className="text-[#F5A623] text-[12px]">★</span>
                ))}
              </div>
            </div>
            <h5 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] leading-[24px] text-[#101828] m-0 mb-1">
              {hotel.name}
            </h5>
            <div className="flex items-start gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#4a5565] mt-0.5 flex-shrink-0" />
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[13px] leading-[18px] text-[#4a5565] m-0">
                {hotel.address}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 mb-3">
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] text-[#364153] m-0">
              {hotel.room_type}
            </p>
            {hotel.amenities.includes('wifi') && (
              <div className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-[#18A0A6]" />
              </div>
            )}
          </div>
          
          {/* Check-in/out times */}
          <div className="flex items-center gap-6 mb-3">
            <div>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[11px] leading-[14px] text-[#8f8ba5] mb-1">
                Check-in
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[13px] leading-[18px] text-[#1f2933] m-0">
                {hotel.check_in_date && formatDate(hotel.check_in_date).dayOfWeek.slice(0, 3)}, {hotel.check_in_date && formatDate(hotel.check_in_date).date.split(' ')[1]}
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[13px] leading-[18px] text-[#4a5565] m-0">
                {hotel.check_in_time}
              </p>
            </div>
            <div>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[11px] leading-[14px] text-[#8f8ba5] mb-1">
                Check-out
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[13px] leading-[18px] text-[#1f2933] m-0">
                {hotel.check_out_date && formatDate(hotel.check_out_date).dayOfWeek.slice(0, 3)}, {hotel.check_out_date && formatDate(hotel.check_out_date).date.split(' ')[1]}
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[13px] leading-[18px] text-[#4a5565] m-0">
                {hotel.check_out_time}
              </p>
            </div>
          </div>
          
          {/* Cancellation Policy */}
          {hotel.cancellation_policy && (
            <div className="flex items-start gap-2 bg-[#F8F9FA] rounded-lg p-3">
              <Calendar className="w-4 h-4 text-[#4a5565] mt-0.5 flex-shrink-0" />
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-[#4a5565] m-0">
                {hotel.cancellation_policy}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Car Card Component (placeholder)
function CarCard({ car, onEdit, onDelete }: { car: any; onEdit?: (type: string, id: string) => void; onDelete?: (type: string, id: string) => void }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E6E6E6] p-6 hover:border-[#916AF5] transition-colors group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-[#4a5565]" />
          <h4 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] leading-[24px] text-[#1f2933] m-0">
            Car rental
          </h4>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg" onClick={() => onDelete?.('car', 'car-1')}>
            <Trash2 className="w-4 h-4 text-[#4a5565]" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg" onClick={() => onEdit?.('car', 'car-1')}>
            <Edit2 className="w-4 h-4 text-[#4a5565]" />
          </button>
        </div>
      </div>
    </div>
  );
}