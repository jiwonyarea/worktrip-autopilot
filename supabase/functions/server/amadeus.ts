// Amadeus Self-Service API client.
//
// Covers the three calls the trip planner needs: resolving a free-text city to
// an IATA code, searching flight offers, and searching hotel offers. The test
// environment (test.api.amadeus.com) returns real schedules and realistic
// pricing but is not bookable — see AMADEUS_ENV below.

const TEST_BASE = "https://test.api.amadeus.com";
const PROD_BASE = "https://api.amadeus.com";

function baseUrl(): string {
  return Deno.env.get("AMADEUS_ENV") === "production" ? PROD_BASE : TEST_BASE;
}

export function amadeusConfigured(): boolean {
  return Boolean(
    Deno.env.get("AMADEUS_API_KEY") && Deno.env.get("AMADEUS_API_SECRET"),
  );
}

// Amadeus access tokens last ~30 minutes. Cache in module scope so warm
// invocations of the edge function reuse one instead of re-authenticating.
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const key = Deno.env.get("AMADEUS_API_KEY");
  const secret = Deno.env.get("AMADEUS_API_SECRET");
  if (!key || !secret) {
    throw new Error("AMADEUS_API_KEY / AMADEUS_API_SECRET are not set");
  }

  const res = await fetch(`${baseUrl()}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: key,
      client_secret: secret,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Amadeus auth failed (${res.status}): ${(await res.text()).slice(0, 300)}`,
    );
  }

  const data = await res.json();
  cachedToken = {
    value: data.access_token,
    // Refresh 60s early so a token never expires mid-request.
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

async function amadeusGet(path: string, params: Record<string, string>) {
  const token = await getAccessToken();
  const url = `${baseUrl()}${path}?${new URLSearchParams(params)}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const body = await res.text();
    // 400s from Amadeus are usually "no results for this route/date", which is
    // an expected outcome rather than a failure — surface it as an empty set.
    if (res.status === 400 || res.status === 404) {
      console.warn(`Amadeus ${path} returned ${res.status}: ${body.slice(0, 300)}`);
      return { data: [] };
    }
    throw new Error(`Amadeus ${path} failed (${res.status}): ${body.slice(0, 300)}`);
  }

  return res.json();
}

export interface FlightOffer {
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  stops: number;
  durationMinutes: number;
  pricePerTraveler: number;
  currency: string;
  cabin: string;
}

export interface HotelOffer {
  name: string;
  hotelId: string;
  ratingStars: number | null;
  pricePerNight: number;
  totalPrice: number;
  currency: string;
  distanceKm: number | null;
}

/** Resolve a free-text city name ("New York City") to an IATA code ("NYC"). */
export async function resolveCityCode(cityName: string): Promise<string | null> {
  if (!cityName?.trim()) return null;

  // Already an IATA code.
  if (/^[A-Z]{3}$/.test(cityName.trim())) return cityName.trim();

  const json = await amadeusGet("/v1/reference-data/locations", {
    keyword: cityName.trim(),
    subType: "CITY,AIRPORT",
    "page[limit]": "5",
  });

  const locations = json.data ?? [];
  // Prefer a CITY match — it covers all airports serving the metro area.
  const city = locations.find((l: any) => l.subType === "CITY");
  return (city ?? locations[0])?.iataCode ?? null;
}

function isoDurationToMinutes(iso: string): number {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?$/.exec(iso ?? "");
  if (!m) return 0;
  return Number(m[1] ?? 0) * 60 + Number(m[2] ?? 0);
}

function formatTime(dateTime: string): string {
  // "2026-03-02T09:00:00" -> "09:00"
  return dateTime?.slice(11, 16) ?? "";
}

/**
 * Search round-trip flight offers. Returns offers sorted cheapest-first;
 * an empty array means Amadeus had no inventory for the route/date.
 */
export async function searchFlights(opts: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string | null;
  adults: number;
  travelClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS";
  max?: number;
}): Promise<FlightOffer[]> {
  const params: Record<string, string> = {
    originLocationCode: opts.origin,
    destinationLocationCode: opts.destination,
    departureDate: opts.departureDate,
    adults: String(Math.min(opts.adults, 9)),
    currencyCode: "USD",
    max: String(opts.max ?? 10),
  };
  if (opts.returnDate) params.returnDate = opts.returnDate;
  if (opts.travelClass) params.travelClass = opts.travelClass;

  const json = await amadeusGet("/v2/shopping/flight-offers", params);
  const carriers: Record<string, string> = json.dictionaries?.carriers ?? {};

  return (json.data ?? []).map((offer: any): FlightOffer => {
    const itinerary = offer.itineraries?.[0];
    const segments = itinerary?.segments ?? [];
    const first = segments[0] ?? {};
    const last = segments[segments.length - 1] ?? {};
    const carrierCode = first.carrierCode ?? "";

    return {
      airline: carriers[carrierCode] ?? carrierCode,
      flightNumber: `${carrierCode} ${first.number ?? ""}`.trim(),
      from: first.departure?.iataCode ?? opts.origin,
      to: last.arrival?.iataCode ?? opts.destination,
      departureTime: formatTime(first.departure?.at),
      arrivalTime: formatTime(last.arrival?.at),
      stops: Math.max(segments.length - 1, 0),
      durationMinutes: isoDurationToMinutes(itinerary?.duration),
      // Amadeus grandTotal covers all travelers on the offer.
      pricePerTraveler: Number(offer.price?.grandTotal ?? 0) / Math.max(opts.adults, 1),
      currency: offer.price?.currency ?? "USD",
      cabin:
        offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin ??
        "ECONOMY",
    };
  });
}

/**
 * Search hotel offers in a city. Amadeus splits this into two calls: list
 * hotels in the city, then price the ones you care about.
 */
export async function searchHotels(opts: {
  cityCode: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  rooms: number;
}): Promise<HotelOffer[]> {
  const list = await amadeusGet("/v1/reference-data/locations/hotels/by-city", {
    cityCode: opts.cityCode,
    radius: "20",
    radiusUnit: "KM",
    hotelSource: "ALL",
  });

  const hotels = (list.data ?? []).slice(0, 20);
  if (hotels.length === 0) return [];

  const offers = await amadeusGet("/v3/shopping/hotel-offers", {
    hotelIds: hotels.map((h: any) => h.hotelId).join(","),
    adults: String(Math.min(opts.adults, 9)),
    checkInDate: opts.checkIn,
    checkOutDate: opts.checkOut,
    roomQuantity: String(Math.max(opts.rooms, 1)),
    currency: "USD",
    bestRateOnly: "true",
  });

  const nights = Math.max(
    Math.round(
      (Date.parse(opts.checkOut) - Date.parse(opts.checkIn)) / 86_400_000,
    ),
    1,
  );

  return (offers.data ?? [])
    .map((entry: any): HotelOffer => {
      const offer = entry.offers?.[0];
      const total = Number(offer?.price?.total ?? 0);
      return {
        name: entry.hotel?.name ?? "Hotel",
        hotelId: entry.hotel?.hotelId ?? "",
        ratingStars: entry.hotel?.rating ? Number(entry.hotel.rating) : null,
        pricePerNight: total / nights,
        totalPrice: total,
        currency: offer?.price?.currency ?? "USD",
        distanceKm: entry.hotel?.distance?.value ?? null,
      };
    })
    .filter((h: HotelOffer) => h.totalPrice > 0)
    .sort((a: HotelOffer, b: HotelOffer) => a.totalPrice - b.totalPrice);
}
