import type { ReactNode } from "react";
import { MapPin, Calendar, Users, Briefcase } from "lucide-react";
import { formatDateRange } from "../utils/itinerary";

// The one trip card. Used on the home screen, the planning screen, and above
// the itinerary options, so those three cannot drift apart — a change to the
// trip's visual language happens here once.

interface TripSummaryCardProps {
  name: string;
  destination?: string | null;
  /** Where the trip actually happens — the venue, not the city. */
  venue?: string | null;
  /** Street address for that venue, shown under the row. */
  venueAddress?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  travelers?: number | null;
  purpose?: string | null;
  /** Status pill beside the title, e.g. a D-3 countdown. */
  chip?: ReactNode;
  /** Buttons on the right. Omitted where the card is purely informational. */
  actions?: ReactNode;
  /** Width and height belong to the caller — this screen is wider than that one. */
  className?: string;
}

export function TripSummaryCard({
  name,
  destination,
  venue,
  venueAddress,
  startDate,
  endDate,
  travelers,
  purpose,
  chip,
  actions,
  className = "",
}: TripSummaryCardProps) {
  return (
    <div
      className={`bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.06)] w-full p-[18px] flex items-center justify-between gap-4 ${className}`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-[9px]">
          <h3 className="text-[16px] font-semibold text-[#1f2933] m-0 truncate">
            {name}
          </h3>
          {chip}
        </div>

        <div className="flex items-center gap-4 text-[14px] font-normal text-[#4a5565] flex-wrap">
          {/* The venue where there is one. "Austin" says which airport to fly
              into; "Austin Convention Center" says where you are going. */}
          {(venue || destination) && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              {venue || destination}
            </span>
          )}
          {startDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              {formatDateRange(startDate, endDate)}
            </span>
          )}
          {travelers != null && (
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 flex-shrink-0" />
              {travelers} traveler{travelers === 1 ? "" : "s"}
            </span>
          )}
          {purpose && (
            <span className="flex items-center gap-1.5 capitalize">
              <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
              {purpose}
            </span>
          )}
        </div>

        {venueAddress && (
          <p className="mt-1.5 text-[13px] text-[#9095a1] m-0 truncate">{venueAddress}</p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}
