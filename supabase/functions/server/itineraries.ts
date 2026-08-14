// Itinerary generation: real Amadeus inventory -> Claude synthesis -> 3 options.
//
// Replaces the previous Flowise chatflow. The flow is:
//   1. Validate the trip has the fields a search needs.
//   2. Resolve origin/destination to IATA codes.
//   3. Pull flight + hotel inventory from Amadeus (economy and business fares).
//   4. Hand that inventory, the travelers, and the policy to Claude.
//   5. Persist the three options on the trip.

import * as kv from "./kv_store.ts";
import {
  searchFlights,
  searchHotels,
  serpapiConfigured,
  type HotelOffer,
} from "./serpapi.ts";
import {
  claudeConfigured,
  resolveAirports,
  synthesizeItineraries,
} from "./claude.ts";

const DEFAULT_PREFERENCES = {
  airport_flexibility: "home_only",
  departure_time_pref: "morning",
  arrival_time_pref: "afternoon",
  comfort_vs_cost: 50,
  hotel_distance_pref: "walking",
  room_sharing_willing: false,
  accessibility_needs: [] as string[],
  accessibility_notes: "",
  dietary_restrictions: [] as string[],
  explore_restaurants: false,
};

export class GenerationError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 404 | 500 | 503,
    readonly extra: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

export async function generateItineraries(tripId: string) {
  if (!claudeConfigured()) {
    throw new GenerationError(
      "The planning agent is not configured. Set ANTHROPIC_API_KEY on the edge function.",
      503,
    );
  }
  if (!serpapiConfigured()) {
    throw new GenerationError(
      "Flight and hotel search is not configured. Set SERPAPI_API_KEY.",
      503,
    );
  }

  const trip = await kv.get(`trip:${tripId}`);
  if (!trip) throw new GenerationError("Trip not found", 404);

  // Intent-based trips populate the inferred_* fields; older trips use the flat ones.
  const destination = trip.destination || trip.inferred_destination || "";
  const origin = trip.origin_city || trip.inferred_origin_city || "";
  const startDate = trip.start_date || trip.inferred_dates?.start_date || "";
  const endDate = trip.end_date || trip.inferred_dates?.end_date || "";
  const travelers = trip.travelers ?? [];

  const missing: string[] = [];
  if (!destination) missing.push("destination");
  if (!origin) missing.push("origin_city");
  if (!startDate) missing.push("start_date");
  if (!endDate) missing.push("end_date");
  if (travelers.length === 0) missing.push("travelers");

  if (missing.length > 0) {
    throw new GenerationError(
      `Add the missing trip details before generating options: ${missing.join(", ")}`,
      400,
      { missing_fields: missing },
    );
  }

  // Flight search can only look forward. Catch this here so a past date reads
  // as "those dates have passed" rather than "no flights on this route".
  const today = new Date().toISOString().slice(0, 10);
  if (startDate < today) {
    throw new GenerationError(
      `Those dates have already passed (${startDate}). Pick dates in the future.`,
      400,
      { start_date: startDate, today },
    );
  }
  if (endDate < startDate) {
    throw new GenerationError(
      `The return date (${endDate}) is before the departure date (${startDate}).`,
      400,
      { start_date: startDate, end_date: endDate },
    );
  }

  // --- Resolve cities to IATA codes -----------------------------------------
  const airports = await resolveAirports(origin, destination);

  if (!airports.origin_confident || !airports.destination_confident) {
    const unclear = !airports.origin_confident ? origin : destination;
    throw new GenerationError(
      `Could not find an airport serving ${unclear}. Try a nearby major city.`,
      400,
      { unresolved_city: unclear },
    );
  }

  const originCode = airports.origin_iata;
  const destinationCode = airports.destination_iata;

  // --- Pull real inventory ---------------------------------------------------
  const travelerCount = travelers.length;

  const [flights, hotels] = await Promise.all([
    searchFlights({
      originCode,
      destinationCode,
      departureDate: startDate,
      returnDate: endDate,
      adults: travelerCount,
    }),
    // Hotels are a nice-to-have: if the search fails the agent estimates
    // lodging and says so, rather than failing the whole request.
    searchHotels({
      city: destination,
      checkIn: startDate,
      checkOut: endDate,
      adults: travelerCount,
    }).catch((error) => {
      console.warn("Hotel search failed:", error);
      return [] as HotelOffer[];
    }),
  ]);

  if (flights.outboundOptions.length === 0) {
    throw new GenerationError(
      `No flights found from ${originCode} to ${destinationCode} on ${startDate}. ` +
        "Try different dates or a nearby airport.",
      404,
      { origin: originCode, destination: destinationCode },
    );
  }

  // --- Assemble the planning payload ----------------------------------------
  const preferencesByTraveler = await kv.getByPrefix(`preferences:${tripId}:`);

  const travelersWithPreferences = travelers.map((traveler: any) => {
    const prefs = preferencesByTraveler.find(
      (p: any) =>
        p.traveler_identifier === traveler.email ||
        p.traveler_email === traveler.email,
    );
    return {
      name: traveler.name,
      email: traveler.email,
      role: traveler.role,
      attendance: traveler.attendance,
      preferences: prefs ?? DEFAULT_PREFERENCES,
      preferences_source: prefs ? "traveler_provided" : "default",
    };
  });

  const nights = Math.max(
    Math.round((Date.parse(endDate) - Date.parse(startDate)) / 86_400_000),
    1,
  );

  const payload = {
    trip: {
      name: trip.trip_name || trip.inferred_trip_name || "Work Trip",
      purpose: trip.purpose || "business",
      origin_city: origin,
      destination_city: destination,
      origin_airport: originCode,
      destination_airport: destinationCode,
      start_date: startDate,
      end_date: endDate,
      nights,
      traveler_count: travelerCount,
      original_request: trip.intent_text ?? null,
    },
    policy: {
      total_budget: trip.total_budget ?? null,
      budget_per_person: trip.budget_per_person ?? null,
      guidelines: trip.policy_guidelines ?? null,
      autonomy_level: trip.autonomy_level ?? "suggest_only",
    },
    travelers: travelersWithPreferences,
    available_outbound_flights: flights.outboundOptions,
    available_return_flights: flights.returnOptions,
    available_hotels: hotels.slice(0, 15),
    inventory_notes: [
      "Each outbound option's roundTripPrice is the TOTAL round-trip fare for " +
        "all travelers combined. Use it as flight_cost directly; do not multiply " +
        "it by the traveler count.",
      "Pair each outbound option with one of the return options.",
      hotels.length === 0
        ? "No hotel inventory came back for this city; estimate lodging and say so in the summary."
        : "Hotel prices are per room; multiply by rooms and nights as appropriate.",
      flights.returnOptions.length === 0
        ? "No return legs were returned; describe the return as 'to be confirmed' rather than inventing one."
        : null,
    ].filter(Boolean),
  };

  // What the search actually returned. Surfaced so a flat set of prices across
  // the three options can be told apart from the agent collapsing them.
  const prices = flights.outboundOptions.map((o) => o.roundTripPrice).filter((p) => p > 0);
  const inventory = {
    outbound_options: flights.outboundOptions.length,
    return_options: flights.returnOptions.length,
    hotels: hotels.length,
    flight_price_low: prices.length ? Math.min(...prices) : 0,
    flight_price_high: prices.length ? Math.max(...prices) : 0,
    distinct_flight_prices: [...new Set(prices)].sort((a, b) => a - b),
    hotel_price_low: hotels.length ? Math.round(hotels[0].pricePerNight) : 0,
    hotel_price_high: hotels.length
      ? Math.round(hotels[hotels.length - 1].pricePerNight)
      : 0,
  };
  console.log("Inventory:", JSON.stringify(inventory));

  const options = await synthesizeItineraries(payload);

  const itineraries = options.map((option, index) => ({
    id: `opt-${option.option_label ?? index}`,
    ...option,
    // Recompute rather than trusting the model's arithmetic.
    total_cost: Math.round(
      option.details.flight_cost +
        option.details.hotel_cost +
        option.details.ground_transport_cost +
        option.details.food_cost,
    ),
    budget_percentage: trip.total_budget
      ? Math.round((option.total_cost / trip.total_budget) * 100)
      : 0,
    data_source: "serpapi",
  }));

  await kv.set(`trip:${tripId}`, {
    ...trip,
    itineraries,
    status: "awaiting_selection",
    updated_at: new Date().toISOString(),
  });

  console.log(
    `Generated ${itineraries.length} itineraries for ${tripId} ` +
      `(${originCode}->${destinationCode}, ${flights.outboundOptions.length} outbound options, ${hotels.length} hotels)`,
  );

  return { itineraries, inventory };
}
