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
  amadeusConfigured,
  resolveCityCode,
  searchFlights,
  searchHotels,
  type FlightOffer,
  type HotelOffer,
} from "./amadeus.ts";
import { claudeConfigured, synthesizeItineraries } from "./claude.ts";

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
  if (!amadeusConfigured()) {
    throw new GenerationError(
      "Flight and hotel search is not configured. Set AMADEUS_API_KEY and AMADEUS_API_SECRET.",
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

  // --- Resolve cities to IATA codes -----------------------------------------
  const [originCode, destinationCode] = await Promise.all([
    resolveCityCode(origin),
    resolveCityCode(destination),
  ]);

  if (!originCode || !destinationCode) {
    throw new GenerationError(
      `Could not find an airport for ${!originCode ? origin : destination}. Try a nearby major city.`,
      400,
      { unresolved_city: !originCode ? origin : destination },
    );
  }

  // --- Pull real inventory ---------------------------------------------------
  const travelerCount = travelers.length;

  const [economy, business, hotels] = await Promise.all([
    searchFlights({
      origin: originCode,
      destination: destinationCode,
      departureDate: startDate,
      returnDate: endDate,
      adults: travelerCount,
      travelClass: "ECONOMY",
      max: 12,
    }),
    searchFlights({
      origin: originCode,
      destination: destinationCode,
      departureDate: startDate,
      returnDate: endDate,
      adults: travelerCount,
      travelClass: "BUSINESS",
      max: 4,
    }).catch(() => [] as FlightOffer[]), // business inventory is often absent in test
    searchHotels({
      cityCode: destinationCode,
      checkIn: startDate,
      checkOut: endDate,
      adults: travelerCount,
      rooms: travelerCount,
    }).catch(() => [] as HotelOffer[]),
  ]);

  const flights = [...economy, ...business];

  if (flights.length === 0) {
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
    available_flights: flights,
    available_hotels: hotels.slice(0, 15),
    inventory_notes: [
      hotels.length === 0
        ? "No hotel inventory was returned for this city; estimate lodging and say so."
        : null,
      business.length === 0
        ? "No business-class inventory was available; build the premium option from the best economy fares."
        : null,
    ].filter(Boolean),
  };

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
    data_source: "amadeus",
  }));

  await kv.set(`trip:${tripId}`, {
    ...trip,
    itineraries,
    status: "awaiting_selection",
    updated_at: new Date().toISOString(),
  });

  console.log(
    `Generated ${itineraries.length} itineraries for ${tripId} ` +
      `(${originCode}->${destinationCode}, ${flights.length} flights, ${hotels.length} hotels)`,
  );

  return { itineraries };
}
