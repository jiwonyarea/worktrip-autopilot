// Travel inventory via SerpApi (Google Flights + Google Hotels).
//
// Replaces the Amadeus Self-Service API, which Amadeus decommissioned on
// 2026-07-17. SerpApi returns real airlines, schedules, and market prices,
// which is what makes the generated itineraries worth user-testing.
//
// Search budget matters: the free plan allows 100 searches/month and one trip
// costs 3 (round-trip flights, return legs, hotels). Keep that in mind before
// adding more calls per trip.

const BASE = "https://serpapi.com/search.json";

export function serpapiConfigured(): boolean {
  return Boolean(Deno.env.get("SERPAPI_API_KEY"));
}

async function serpapiGet(params: Record<string, string>) {
  const key = Deno.env.get("SERPAPI_API_KEY");
  if (!key) throw new Error("SERPAPI_API_KEY is not set");

  const url = `${BASE}?${new URLSearchParams({ ...params, api_key: key })}`;
  const res = await fetch(url);
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      `SerpApi ${params.engine} failed (${res.status}): ${
        json.error ?? "unknown error"
      }`,
    );
  }
  // SerpApi reports "no results" as a 200 with an error string.
  if (json.error) {
    console.warn(`SerpApi ${params.engine}: ${json.error}`);
    return null;
  }

  return json;
}

export interface FlightLeg {
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  stops: number;
  durationMinutes: number;
  cabin: string;
}

export interface OutboundOption {
  /** Total round-trip price for the whole party, USD. */
  roundTripPrice: number;
  legs: FlightLeg[];
  totalDurationMinutes: number;
  stops: number;
}

export interface FlightSearchResult {
  outboundOptions: OutboundOption[];
  returnOptions: FlightLeg[][];
  priceIsPartyTotal: boolean;
}

export interface HotelOffer {
  name: string;
  ratingStars: number | null;
  guestRating: number | null;
  pricePerNight: number;
  totalPrice: number;
  currency: string;
  amenities: string[];
  /** Used to compute a real distance rather than describing one vaguely. */
  latitude: number | null;
  longitude: number | null;
}

/** "2026-08-18 09:00" -> "09:00" */
function timeOf(dateTime: string): string {
  return dateTime?.split(" ")[1]?.slice(0, 5) ?? "";
}

function toLegs(flights: any[]): FlightLeg[] {
  return (flights ?? []).map((f: any) => ({
    airline: f.airline ?? "",
    flightNumber: f.flight_number ?? "",
    from: f.departure_airport?.id ?? "",
    to: f.arrival_airport?.id ?? "",
    departureTime: timeOf(f.departure_airport?.time),
    arrivalTime: timeOf(f.arrival_airport?.time),
    stops: 0,
    durationMinutes: f.duration ?? 0,
    cabin: f.travel_class ?? "Economy",
  }));
}

function toOutbound(entry: any): OutboundOption {
  const legs = toLegs(entry.flights);
  return {
    roundTripPrice: Number(entry.price ?? 0),
    legs,
    totalDurationMinutes: entry.total_duration ?? 0,
    stops: Math.max(legs.length - 1, 0),
  };
}

// Carriers a corporate travel policy does not put people on: ultra-low-cost
// and leisure airlines whose fares exclude the bag, the seat assignment and the
// change that a work trip needs. Matched on name and on the code heading the
// flight number, since SerpApi gives both.
const LEISURE_CARRIERS = [
  { code: "NK", name: "spirit" },
  { code: "F9", name: "frontier" },
  { code: "G4", name: "allegiant" },
  { code: "WN", name: "southwest" },
  { code: "SY", name: "sun country" },
  { code: "MX", name: "breeze" },
  { code: "XP", name: "avelo" },
  { code: "FR", name: "ryanair" },
  { code: "W6", name: "wizz" },
  { code: "U2", name: "easyjet" },
  { code: "VY", name: "vueling" },
];

function isLeisureCarrier(leg: FlightLeg): boolean {
  const name = (leg.airline ?? "").toLowerCase();
  const code = (leg.flightNumber ?? "").trim().slice(0, 2).toUpperCase();
  return LEISURE_CARRIERS.some((c) => name.includes(c.name) || code === c.code);
}

/**
 * Drop itineraries flown by a leisure carrier — unless that would leave the
 * route with nothing. Some city pairs are served by one of these and little
 * else, and no flights at all is worse for the organiser than a flight they
 * would rather not take.
 */
function preferBusinessCarriers<T>(options: T[], legsOf: (option: T) => FlightLeg[]): T[] {
  const kept = options.filter((option) => !legsOf(option).some(isLeisureCarrier));
  return kept.length > 0 ? kept : options;
}

/**
 * Search round-trip flights.
 *
 * Google Flights models a round trip in two steps: the first response lists
 * outbound itineraries carrying the *total* round-trip price, and each one
 * holds a `departure_token` you exchange for that itinerary's return options.
 * We spend one extra search on the best outbound so the agent has real return
 * legs to pair, rather than inventing them.
 */
export async function searchFlights(opts: {
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  travelClass?: 1 | 2 | 3 | 4; // 1 economy, 2 premium economy, 3 business, 4 first
}): Promise<FlightSearchResult> {
  const common = {
    engine: "google_flights",
    departure_id: opts.originCode,
    arrival_id: opts.destinationCode,
    outbound_date: opts.departureDate,
    return_date: opts.returnDate,
    adults: String(Math.max(opts.adults, 1)),
    currency: "USD",
    hl: "en",
    type: "1", // round trip
    ...(opts.travelClass ? { travel_class: String(opts.travelClass) } : {}),
  };

  const first = await serpapiGet(common);
  if (!first) return { outboundOptions: [], returnOptions: [], priceIsPartyTotal: true };

  const entries = [
    ...(first.best_flights ?? []),
    ...(first.other_flights ?? []),
  ].slice(0, 12);

  const outboundOptions = preferBusinessCarriers(
    entries.map(toOutbound).filter((o) => o.legs.length > 0),
    (o) => o.legs,
  );

  // Exchange the best outbound's token for real return itineraries.
  let returnOptions: FlightLeg[][] = [];
  const token = entries[0]?.departure_token;
  if (token) {
    const second = await serpapiGet({ ...common, departure_token: token });
    if (second) {
      returnOptions = [
        ...(second.best_flights ?? []),
        ...(second.other_flights ?? []),
      ]
        .slice(0, 6)
        .map((e: any) => toLegs(e.flights))
        .filter((legs) => legs.length > 0);
      returnOptions = preferBusinessCarriers(returnOptions, (legs) => legs);
    }
  }

  return {
    outboundOptions,
    returnOptions,
    // Google Flights prices a search for the whole party, so this is already
    // the total — do not multiply by traveler count.
    priceIsPartyTotal: true,
  };
}

/** Search hotels in the destination city for the trip's dates. */
export async function searchHotels(opts: {
  city: string;
  checkIn: string;
  checkOut: string;
  adults: number;
}): Promise<HotelOffer[]> {
  const json = await serpapiGet({
    engine: "google_hotels",
    q: opts.city,
    check_in_date: opts.checkIn,
    check_out_date: opts.checkOut,
    adults: String(Math.max(opts.adults, 1)),
    currency: "USD",
    hl: "en",
    // Business travelers don't stay in hostels or unrated rooms, so only ask
    // for star-classed hotels. 2-3 star is the floor the budget option uses.
    hotel_class: "2,3,4,5",
  });

  if (!json) return [];

  return (json.properties ?? [])
    // Backstop for the class filter: vacation rentals and anything that calls
    // itself a hostel still slip through occasionally.
    .filter((p: any) => (p.type ?? "hotel") === "hotel" && !/hostel/i.test(p.name ?? ""))
    .slice(0, 20)
    .map((p: any): HotelOffer => ({
      name: p.name ?? "Hotel",
      ratingStars: p.hotel_class ? Number(String(p.hotel_class).charAt(0)) : null,
      guestRating: p.overall_rating ?? null,
      pricePerNight: Number(p.rate_per_night?.extracted_lowest ?? 0),
      totalPrice: Number(p.total_rate?.extracted_lowest ?? 0),
      currency: "USD",
      amenities: (p.amenities ?? []).slice(0, 6),
      latitude: p.gps_coordinates?.latitude ?? null,
      longitude: p.gps_coordinates?.longitude ?? null,
    }))
    .filter((h: HotelOffer) => h.pricePerNight > 0 || h.totalPrice > 0)
    .sort((a: HotelOffer, b: HotelOffer) => a.pricePerNight - b.pricePerNight);
}
