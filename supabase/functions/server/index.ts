// Worktrip Autopilot API — Supabase Edge Function (Deno).
//
// Deploy:  supabase functions deploy server
// Secrets: ANTHROPIC_API_KEY, AMADEUS_API_KEY, AMADEUS_API_SECRET
//          (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically)

import { Hono } from "npm:hono@4";
import { cors } from "npm:hono@4/cors";
import { logger } from "npm:hono@4/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";

import * as kv from "./kv_store.ts";
import { generateItineraries, GenerationError } from "./itineraries.ts";
import {
  claudeConfigured,
  extractReceipt,
  parseIntent,
} from "./claude.ts";
import { serpapiConfigured } from "./serpapi.ts";

const api = new Hono();

api.use("*", logger(console.log));
api.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    maxAge: 600,
  }),
);

function serviceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

api.get("/health", (c) =>
  c.json({
    status: "ok",
    // Surfaces which integrations are wired up without leaking key values.
    integrations: {
      anthropic: claudeConfigured(),
      serpapi: serpapiConfigured(),
    },
  }),
);

// ---------------------------------------------------------------------------
// Intent parsing
// ---------------------------------------------------------------------------

api.post("/parse-intent", async (c) => {
  try {
    const { intentText } = await c.req.json();
    if (!intentText?.trim()) {
      return c.json({ error: "intentText is required" }, 400);
    }
    if (!claudeConfigured()) {
      return c.json(
        { error: "The planning agent is not configured (ANTHROPIC_API_KEY missing)." },
        503,
      );
    }

    return c.json(await parseIntent(intentText, today()));
  } catch (error) {
    console.error("parse-intent failed:", error);
    return c.json(
      { error: "Could not read those trip details", details: String(error) },
      500,
    );
  }
});

// ---------------------------------------------------------------------------
// Trips
// ---------------------------------------------------------------------------

api.post("/trips", async (c) => {
  try {
    const body = await c.req.json();

    const destination = body.destination ?? body.overrides?.destination ?? "";
    if (!destination.trim()) {
      return c.json(
        {
          error: "Destination is required",
          details: "Tell the agent which city the trip is to.",
        },
        400,
      );
    }

    const travelersCount = Math.max(
      Number(body.travelers_count ?? body.overrides?.travelers_count ?? 1),
      1,
    );

    // The organizer is traveler 1; the rest are placeholders the organizer fills in.
    const travelers = Array.from({ length: travelersCount }, (_, i) =>
      i === 0
        ? {
            id: crypto.randomUUID(),
            name: body.organizer_name ?? "Organizer",
            email: body.organizer_email ?? "organizer@company.com",
            role: "Organizer",
            attendance: "Must attend",
            preferences_completed: false,
          }
        : {
            id: crypto.randomUUID(),
            name: `Traveler ${i + 1}`,
            email: `traveler${i + 1}@company.com`,
            role: "Attendee",
            attendance: "Must attend",
            preferences_completed: false,
          },
    );

    const tripId = crypto.randomUUID();
    const tripName = body.trip_name ?? body.overrides?.trip_name ?? "Work Trip";
    const originCity = body.origin_city ?? body.overrides?.origin_city ?? "";
    const startDate =
      body.start_date ?? body.overrides?.dates?.start_date ?? null;
    const endDate = body.end_date ?? body.overrides?.dates?.end_date ?? null;

    const trip = {
      id: tripId,
      organizer_name: body.organizer_name ?? "Organizer",
      organizer_email: body.organizer_email ?? "organizer@company.com",

      intent_text: body.intentText ?? body.intent_text ?? null,

      trip_name: tripName,
      destination,
      origin_city: originCity,
      start_date: startDate,
      end_date: endDate,
      purpose: body.purpose ?? "business",

      // Kept in sync with the flat fields so either read path works.
      inferred_trip_name: tripName,
      inferred_destination: destination,
      inferred_origin_city: originCity,
      inferred_dates: { start_date: startDate, end_date: endDate },
      inferred_travelers_count: travelersCount,

      budget_per_person: body.budget_per_person ?? null,
      total_budget: body.total_budget ?? null,
      policy_guidelines: body.policy_guidelines ?? null,
      autonomy_level: body.autonomy_level ?? "suggest_only",
      travelers,
      survey_config: body.survey_config ?? {},

      status: "draft",
      selected_itinerary_id: null,
      confirmations: null,
      booked_at: null,
      itineraries: null,

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await kv.set(`trip:${tripId}`, trip);
    return c.json(trip);
  } catch (error) {
    console.error("create trip failed:", error);
    return c.json({ error: "Failed to create trip", details: String(error) }, 500);
  }
});

api.get("/trips/:tripId", async (c) => {
  try {
    const trip = await kv.get(`trip:${c.req.param("tripId")}`);
    if (!trip) return c.json({ error: "Trip not found" }, 404);
    return c.json(trip);
  } catch (error) {
    console.error("get trip failed:", error);
    return c.json({ error: "Failed to fetch trip" }, 500);
  }
});

api.put("/trips/:tripId", async (c) => {
  try {
    const tripId = c.req.param("tripId");
    const existing = await kv.get(`trip:${tripId}`);
    if (!existing) return c.json({ error: "Trip not found" }, 404);

    const updated = {
      ...existing,
      ...(await c.req.json()),
      id: tripId,
      updated_at: new Date().toISOString(),
    };
    await kv.set(`trip:${tripId}`, updated);
    return c.json(updated);
  } catch (error) {
    console.error("update trip failed:", error);
    return c.json({ error: "Failed to update trip" }, 500);
  }
});

api.delete("/trips/:tripId", async (c) => {
  try {
    await kv.del(`trip:${c.req.param("tripId")}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("delete trip failed:", error);
    return c.json({ error: "Failed to delete trip" }, 500);
  }
});

// ---------------------------------------------------------------------------
// Traveler preferences
// ---------------------------------------------------------------------------

api.get("/trips/:tripId/preferences/:travelerId", async (c) => {
  const prefs = await kv.get(
    `preferences:${c.req.param("tripId")}:${c.req.param("travelerId")}`,
  );
  if (!prefs) return c.json({ error: "Preferences not found" }, 404);
  return c.json(prefs);
});

api.put("/trips/:tripId/preferences/:travelerId", async (c) => {
  try {
    const tripId = c.req.param("tripId");
    const travelerId = c.req.param("travelerId");
    const body = await c.req.json();

    const preferences = {
      trip_id: tripId,
      traveler_identifier: travelerId,
      airport_flexibility: body.airport_flexibility ?? "home_only",
      departure_time_pref: body.departure_time_pref ?? "flexible",
      arrival_time_pref: body.arrival_time_pref ?? "flexible",
      comfort_vs_cost: body.comfort_vs_cost ?? 50,
      hotel_distance_pref: body.hotel_distance_pref ?? "flexible",
      room_sharing_willing: body.room_sharing_willing ?? false,
      roommate_preference_id: body.roommate_preference_id ?? null,
      accessibility_needs: body.accessibility_needs ?? [],
      accessibility_notes: body.accessibility_notes ?? "",
      dietary_restrictions: body.dietary_restrictions ?? [],
      explore_restaurants: body.explore_restaurants ?? false,
      preferences_completed: true,
      updated_at: new Date().toISOString(),
    };

    await kv.set(`preferences:${tripId}:${travelerId}`, preferences);

    // Mirror completion onto the trip's traveler list for the roster UI.
    const trip = await kv.get(`trip:${tripId}`);
    if (trip?.travelers) {
      await kv.set(`trip:${tripId}`, {
        ...trip,
        travelers: trip.travelers.map((t: any) =>
          t.email === travelerId || t.id === travelerId
            ? { ...t, preferences_completed: true }
            : t,
        ),
        updated_at: new Date().toISOString(),
      });
    }

    return c.json(preferences);
  } catch (error) {
    console.error("save preferences failed:", error);
    return c.json({ error: "Failed to save preferences" }, 500);
  }
});

api.get("/trips/:tripId/preferences", async (c) => {
  const tripId = c.req.param("tripId");
  const trip = await kv.get(`trip:${tripId}`);
  if (!trip) return c.json({ error: "Trip not found" }, 404);

  const travelers = await Promise.all(
    (trip.travelers ?? []).map(async (traveler: any) => {
      const id = traveler.email ?? traveler.id;
      return {
        traveler_id: id,
        traveler_name: traveler.name,
        preferences: await kv.get(`preferences:${tripId}:${id}`),
        completed: traveler.preferences_completed ?? false,
      };
    }),
  );

  return c.json({ trip_id: tripId, travelers });
});

// ---------------------------------------------------------------------------
// Itinerary generation + booking
// ---------------------------------------------------------------------------

api.post("/trips/:tripId/generate-itineraries", async (c) => {
  try {
    return c.json(await generateItineraries(c.req.param("tripId")));
  } catch (error) {
    if (error instanceof GenerationError) {
      console.warn(`generate-itineraries: ${error.message}`);
      return c.json({ error: error.message, ...error.extra }, error.status);
    }
    console.error("generate-itineraries failed:", error);
    return c.json(
      { error: "Could not build itineraries", details: String(error) },
      500,
    );
  }
});

api.post("/trips/:tripId/confirm-booking", async (c) => {
  try {
    const tripId = c.req.param("tripId");
    const { selected_itinerary_id } = await c.req.json();

    if (!selected_itinerary_id) {
      return c.json({ error: "selected_itinerary_id is required" }, 400);
    }

    const trip = await kv.get(`trip:${tripId}`);
    if (!trip) return c.json({ error: "Trip not found" }, 404);

    const selected = trip.itineraries?.find(
      (i: any) => i.id === selected_itinerary_id,
    );
    if (!selected) {
      return c.json({ error: "That itinerary is not part of this trip" }, 404);
    }

    // NOTE: this records an intent to book. No reservation is held and no
    // payment is taken — issuing real tickets needs an Amadeus production
    // contract plus a payment processor.
    const confirmations = {
      flight: `FLT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      hotel: `HTL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      trip_id: tripId,
      itinerary_id: selected_itinerary_id,
      confirmed_at: new Date().toISOString(),
      simulated: true,
    };

    const updated = {
      ...trip,
      selected_itinerary_id,
      status: "booked",
      confirmations,
      booked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await kv.set(`trip:${tripId}`, updated);

    return c.json({ trip: updated, confirmations, message: "Trip confirmed" });
  } catch (error) {
    console.error("confirm-booking failed:", error);
    return c.json({ error: "Failed to confirm booking", details: String(error) }, 500);
  }
});

// ---------------------------------------------------------------------------
// Expenses
// ---------------------------------------------------------------------------

api.get("/trips/:tripId/expenses", async (c) => {
  const { data, error } = await serviceClient()
    .from("expenses")
    .select("*")
    .eq("trip_id", c.req.param("tripId"))
    .order("date", { ascending: false });

  if (error) {
    console.error("list expenses failed:", error);
    return c.json({ error: "Failed to fetch expenses" }, 500);
  }
  return c.json(data ?? []);
});

api.post("/trips/:tripId/expenses", async (c) => {
  try {
    const body = await c.req.json();
    const { data, error } = await serviceClient()
      .from("expenses")
      .insert({
        trip_id: c.req.param("tripId"),
        merchant: body.merchant,
        amount: body.amount,
        date: body.date,
        category: body.category,
        traveler: body.traveler ?? "Unknown",
        receipt_url: body.receipt_url ?? null,
        policy_status: body.policy_status ?? "compliant",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return c.json(data);
  } catch (error) {
    console.error("create expense failed:", error);
    return c.json({ error: "Failed to create expense", details: String(error) }, 500);
  }
});

// Reads a receipt image with Claude vision and files the expense.
// Accepts either a public receipt URL or a base64 image payload.
api.post("/trips/:tripId/expenses/upload-receipt", async (c) => {
  try {
    const tripId = c.req.param("tripId");
    const body = await c.req.json();
    const { receiptUrl, imageBase64, mediaType } = body;

    if (!claudeConfigured()) {
      return c.json(
        { error: "Receipt reading is not configured (ANTHROPIC_API_KEY missing)." },
        503,
      );
    }
    if (!receiptUrl && !imageBase64) {
      return c.json({ error: "Provide receiptUrl or imageBase64" }, 400);
    }

    let base64 = imageBase64;
    let type = mediaType;

    if (!base64) {
      const imageRes = await fetch(receiptUrl);
      if (!imageRes.ok) {
        return c.json(
          { error: `Could not download the receipt (${imageRes.status})` },
          400,
        );
      }
      type = imageRes.headers.get("content-type") ?? "image/jpeg";
      const bytes = new Uint8Array(await imageRes.arrayBuffer());
      // Chunked to avoid blowing the argument limit on large images.
      let binary = "";
      for (let i = 0; i < bytes.length; i += 8192) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
      }
      base64 = btoa(binary);
    }

    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(type)) type = "image/jpeg";

    const extracted = await extractReceipt({
      imageBase64: base64,
      mediaType: type,
      today: new Date().toISOString().slice(0, 10),
    });

    const { data, error } = await serviceClient()
      .from("expenses")
      .insert({
        trip_id: tripId,
        merchant: extracted.merchant || "Unknown",
        amount: extracted.amount,
        date: extracted.date || new Date().toISOString().slice(0, 10),
        category: extracted.category || "Other",
        traveler: extracted.traveler || "Unknown",
        receipt_url: receiptUrl ?? null,
        // Flag anything the model could not read cleanly for human review.
        policy_status: extracted.notes ? "needs_review" : "compliant",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return c.json({ expense: data, notes: extracted.notes });
  } catch (error) {
    console.error("upload-receipt failed:", error);
    return c.json({ error: "Failed to read that receipt", details: String(error) }, 500);
  }
});

// ---------------------------------------------------------------------------
// Mount
// ---------------------------------------------------------------------------
// Supabase routes requests to this function as /<function-name>/<path>, but
// local `supabase functions serve` and direct invocations can omit the prefix.
// Mounting at both keeps either form working.
const app = new Hono();
app.route("/server", api);
app.route("/", api);

Deno.serve(app.fetch);
