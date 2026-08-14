import { Plane, Hotel, Car } from "lucide-react";

interface ItinerarySummaryCardProps {
  itinerary: any;
  tripDates: {
    start_date: string;
    end_date: string;
  };
}

// Helper to parse flight summary
function parseFlightSummary(summary: string) {
  if (!summary) return null;
  
  const timeMatch = summary.match(/(\d{1,2}:\d{2})\s*(?:AM|PM|am|pm)?[\s-·→]*(\d{1,2}:\d{2})\s*(?:AM|PM|am|pm)?/);
  const airportMatch = summary.match(/([A-Z]{3})[\s-·→]+([A-Z]{3})/);
  const airlineMatch = summary.match(/(United Airlines|Delta Airlines|Delta|Spirit Airlines|Spirit|JetBlue Airways|JetBlue|American Airlines|American|Southwest)/i);
  const flightNumMatch = summary.match(/([A-Z]{1,2})\s*(\d{3,4})/);
  
  return {
    time: timeMatch ? `${timeMatch[1]} - ${timeMatch[2]}` : "7:30 - 9:15",
    route: airportMatch ? `${airportMatch[1]}-${airportMatch[2]}` : "PIT-LGA",
    airline: airlineMatch?.[0] || "Delta Airlines",
    flightNumber: flightNumMatch ? `${flightNumMatch[1]} ${flightNumMatch[2]}` : "DL 3891"
  };
}

export function ItinerarySummaryCard({ itinerary, tripDates }: ItinerarySummaryCardProps) {
  const details = itinerary?.details || {};
  
  // Parse flight and hotel data
  const outboundFlight = parseFlightSummary(details.flight_summary || details.outbound_flight || "");
  const returnFlight = parseFlightSummary(details.return_flight || "");
  const hotelName = details.hotel_summary?.split('–')?.[0]?.trim() || details.hotel_name || "Hampton Inn Times Square";
  
  // Calculate nights
  const nights = tripDates.start_date && tripDates.end_date 
    ? Math.ceil((new Date(tripDates.end_date).getTime() - new Date(tripDates.start_date).getTime()) / (1000 * 60 * 60 * 24))
    : 3;

  return (
    <div className="space-y-4">
      {/* Flights Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Plane className="w-4 h-4 text-[#4a5565]" />
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#1f2933] m-0">
            Flights
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] tracking-[-0.1504px] text-[#927ad9] m-0">
            From Google Flights
          </p>
        </div>
        
        {/* Outbound Flight */}
        {outboundFlight && (
          <div className="bg-[rgba(179,173,196,0.11)] border-[0.909px] border-[rgba(179,173,196,0.28)] rounded-[12px] px-4 py-3 mb-2">
            <div className="flex items-center justify-between mb-1">
              <p className="font-['Inter:Bold',sans-serif] font-bold text-[13px] leading-[18px] text-[#101828] m-0">
                {outboundFlight.time}
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-[#4a5565] m-0">
                {outboundFlight.route}
              </p>
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-[#364153] m-0">
              {outboundFlight.airline} · {outboundFlight.flightNumber}
            </p>
          </div>
        )}
        
        {/* Return Flight */}
        {returnFlight && (
          <div className="bg-[rgba(179,173,196,0.11)] border-[0.909px] border-[rgba(179,173,196,0.28)] rounded-[12px] px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <p className="font-['Inter:Bold',sans-serif] font-bold text-[13px] leading-[18px] text-[#101828] m-0">
                {returnFlight.time}
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-[#4a5565] m-0">
                {returnFlight.route}
              </p>
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-[#364153] m-0">
              {returnFlight.airline} · {returnFlight.flightNumber}
            </p>
          </div>
        )}
      </div>
      
      {/* Hotel Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Hotel className="w-4 h-4 text-[#4a5565]" />
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#1f2933] m-0">
            Hotel
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] tracking-[-0.1504px] text-[#927ad9] m-0">
            From Booking.com
          </p>
        </div>
        
        <div className="bg-[rgba(179,173,196,0.11)] border-[0.909px] border-[rgba(179,173,196,0.28)] rounded-[12px] px-4 py-3">
          <p className="font-['Inter:Bold',sans-serif] font-bold text-[13px] leading-[18px] text-[#101828] mb-1">
            {hotelName}
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-[#364153] m-0">
            {nights} nights · Check-in 4:00 PM · Check-out 11:00 AM
          </p>
        </div>
      </div>
      
      {/* Ground Transport Section */}
      {(details.ground_transport_summary || details.ground_transport_cost) && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Car className="w-4 h-4 text-[#4a5565]" />
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#1f2933] m-0">
              Ground Transport
            </p>
          </div>
          
          <div className="bg-[rgba(179,173,196,0.11)] border-[0.909px] border-[rgba(179,173,196,0.28)] rounded-[12px] px-4 py-3">
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-[#364153] m-0">
              {details.ground_transport_summary || "Uber vouchers and airport transfers"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
