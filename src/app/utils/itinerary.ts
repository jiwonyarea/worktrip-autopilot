// Helpers for rendering a generated itinerary.
//
// The agent returns each flight as a display string in a fixed shape:
//   "Delta · DL 5788 · PIT to JFK · 07:23 - 09:00"
// and a connecting flight joins segments with ", then ":
//   "JetBlue · B6 1118 · JFK to BOS · 13:00 - 14:27, then JetBlue · B6 1785 · ..."
//
// The screens need the pieces separately (times, airport codes, carrier), so
// parse it here once. Every parser returns null rather than throwing — callers
// fall back to showing the raw string, so an unexpected format degrades to
// slightly plainer output instead of a blank screen.

export interface FlightSegment {
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departTime: string;
  arriveTime: string;
}

export interface ParsedFlight {
  segments: FlightSegment[];
  /** Connecting airports, e.g. ["ATL"] for "PIT to AUS via ATL". */
  via: string[];
  /** First segment's origin and last segment's destination. */
  from: string;
  to: string;
  departTime: string;
  arriveTime: string;
  airline: string;
  flightNumber: string;
  stops: number;
  raw: string;
}

function parseSegment(text: string): FlightSegment | null {
  const parts = text.split("·").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 3) return null;

  const route = parts.find((p) => /\b[A-Z]{3}\b\s*(?:to|→|-)\s*\b[A-Z]{3}\b/i.test(p));
  const times = parts.find((p) => /\d{1,2}:\d{2}\s*[-–—]\s*\d{1,2}:\d{2}/.test(p));

  const routeMatch = route?.match(/\b([A-Z]{3})\b\s*(?:to|→|-)\s*\b([A-Z]{3})\b/i);
  const timeMatch = times?.match(/(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})/);

  if (!routeMatch || !timeMatch) return null;

  return {
    airline: parts[0] ?? "",
    flightNumber: parts[1] ?? "",
    from: routeMatch[1].toUpperCase(),
    to: routeMatch[2].toUpperCase(),
    departTime: timeMatch[1],
    arriveTime: timeMatch[2],
  };
}

export function parseFlight(raw?: string | null): ParsedFlight | null {
  if (!raw?.trim()) return null;

  const segments = raw
    .split(/,\s*then\s*/i)
    .map(parseSegment)
    .filter((s): s is FlightSegment => s !== null);

  if (segments.length === 0) return null;

  const first = segments[0];
  const last = segments[segments.length - 1];

  // Connections arrive in two shapes: separate segments joined by ", then",
  // or a single segment reading "PIT to AUS via ATL". Counting only the first
  // reported a connecting flight as nonstop.
  const viaMatch = raw.match(/\bvia\s+([A-Z]{3}(?:\s*[,/&]\s*[A-Z]{3})*)/i);
  const via = viaMatch
    ? viaMatch[1].split(/[,/&]/).map((code) => code.trim().toUpperCase()).filter(Boolean)
    : [];

  return {
    segments,
    via,
    from: first.from,
    to: last.to,
    departTime: first.departTime,
    arriveTime: last.arriveTime,
    airline: first.airline,
    flightNumber: first.flightNumber,
    stops: Math.max(segments.length - 1, via.length),
    raw,
  };
}

/** "07:23" + "09:00" -> "1h 37m". Assumes an arrival before departure crosses midnight. */
export function flightDuration(departTime: string, arriveTime: string): string {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  let minutes = toMinutes(arriveTime) - toMinutes(departTime);
  if (minutes < 0) minutes += 24 * 60;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Parse YYYY-MM-DD as a local date — `new Date(str)` treats it as UTC and can shift the day. */
function localDate(iso?: string | null): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/** "2026-08-18" -> "Tuesday, Aug 18" */
export function formatDayHeading(iso?: string | null): string {
  const date = localDate(iso);
  if (!date) return "";
  return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

/** "2026-08-18" -> "Aug 18, 2026" */
export function formatDate(iso?: string | null): string {
  const date = localDate(iso);
  if (!date) return "";
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function nightsBetween(start?: string | null, end?: string | null): number {
  const a = localDate(start);
  const b = localDate(end);
  if (!a || !b) return 0;
  return Math.max(Math.round((b.getTime() - a.getTime()) / 86_400_000), 0);
}

export function formatMoney(value?: number | null): string {
  return `$${Math.round(Number(value ?? 0)).toLocaleString()}`;
}

/**
 * Find the itinerary a screen should display: the explicitly selected one,
 * then whatever the trip was booked with, then the balanced default.
 */
export function pickItinerary(trip: any, selectedId?: string | null): any | null {
  const itineraries: any[] = trip?.itineraries ?? [];
  if (itineraries.length === 0) return null;

  return (
    itineraries.find((i) => i.id === selectedId) ??
    itineraries.find((i) => i.id === trip?.selected_itinerary_id) ??
    itineraries.find((i) => i.option_label === "balanced") ??
    itineraries[0]
  );
}

export function travelerCount(trip: any): number {
  return trip?.travelers?.length || trip?.inferred_travelers_count || 1;
}

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Compact date range: "September 4-8, 2026". Repeating the month and year on
 * both ends reads as noise, so only the parts that actually differ are shown.
 */
export function formatDateRange(start?: string | null, end?: string | null): string {
  const parse = (iso?: string | null) => {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    return y && m && d ? { y, m, d } : null;
  };

  const a = parse(start);
  const b = parse(end);
  if (!a) return "";
  if (!b) return `${MONTHS_LONG[a.m - 1]} ${a.d}, ${a.y}`;

  if (a.y === b.y && a.m === b.m) {
    return `${MONTHS_LONG[a.m - 1]} ${a.d}-${b.d}, ${a.y}`;
  }
  if (a.y === b.y) {
    return `${MONTHS_LONG[a.m - 1]} ${a.d} - ${MONTHS_LONG[b.m - 1]} ${b.d}, ${a.y}`;
  }
  return `${MONTHS_LONG[a.m - 1]} ${a.d}, ${a.y} - ${MONTHS_LONG[b.m - 1]} ${b.d}, ${b.y}`;
}
