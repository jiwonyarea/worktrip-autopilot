import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { generateItineraries } from "./generateItineraries.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-97df1df1/health", (c) => {
  return c.json({ status: "ok" });
});

// Create a new trip
app.post("/make-server-97df1df1/trips", async (c) => {
  try {
    const tripId = crypto.randomUUID();
    const body = await c.req.json();
    
    console.log(`========================================`);
    console.log(`CREATE TRIP: Received payload`);
    console.log(`Intent text: ${body.intentText || 'none'}`);
    console.log(`Overrides:`, body.overrides);
    console.log(`========================================`);
    
    // Extract travelers count from overrides (if provided)
    const travelersCount = body.overrides?.travelers_count || 1;
    
    // Create default travelers based on count
    const defaultTravelers = [];
    for (let i = 0; i < travelersCount; i++) {
      if (i === 0) {
        // First traveler is the organizer
        defaultTravelers.push({
          id: crypto.randomUUID(),
          name: body.organizer_name || "Sarah Chen",
          email: body.organizer_email || "sarah.chen@company.com",
          role: "Organizer",
          attendance: "Must attend",
          preferences_completed: false,
        });
      } else {
        // Additional travelers are placeholders
        defaultTravelers.push({
          id: crypto.randomUUID(),
          name: `Traveler ${i + 1}`,
          email: `traveler${i + 1}@company.com`,
          role: "Attendee",
          attendance: "Must attend",
          preferences_completed: false,
        });
      }
    }
    
    // Support both traditional trip creation and intent-based creation
    // IMPORTANT: Populate BOTH inferred and traditional fields from overrides
    const tripName = body.overrides?.trip_name || body.trip_name || body.inferred_trip_name || "Work Trip";
    const destination = body.overrides?.destination || body.destination || body.inferred_destination || "";
    const originCity = body.overrides?.origin_city || body.origin_city || null;
    const startDate = body.overrides?.dates?.start_date || body.start_date || null;
    const endDate = body.overrides?.dates?.end_date || body.end_date || null;
    
    // VALIDATION: Ensure we have at minimum a destination before saving
    // This should be caught by frontend, but double-check here
    if (!destination || destination.trim() === "") {
      console.error("CREATE TRIP ERROR: No destination provided");
      return c.json({ 
        error: "Destination is required",
        details: "Please specify a destination city for the trip"
      }, 400);
    }
    
    const trip = {
      id: tripId,
      organizer_id: body.organizer_id || null,
      organizer_name: body.organizer_name || "Sarah Chen",
      organizer_email: body.organizer_email || "sarah.chen@company.com",
      
      // Intent-based fields (new agentic flow)
      intent_text: body.intentText || body.intent_text || null,
      inferred_trip_name: tripName,
      inferred_destination: destination,
      inferred_origin_city: originCity,
      inferred_dates: body.overrides?.dates || body.inferred_dates || { start_date: startDate, end_date: endDate },
      inferred_travelers_count: travelersCount,
      
      // Traditional fields (backward compatible) - populate with SAME values
      trip_name: tripName,
      destination: destination,
      origin_city: originCity,
      start_date: startDate,
      end_date: endDate,
      purpose: body.purpose || "business",
      
      budget_per_person: body.budget_per_person || null,
      total_budget: body.total_budget || null,
      autonomy_level: body.autonomy_level || "suggest_only",
      travelers: defaultTravelers, // Create N travelers based on parsed count
      survey_config: body.survey_config || {
        flight_times: true,
        seat_mobility: false,
        hotel: true,
        room_sharing: false,
        accessibility: true,
        food_dietary: true,
        free_time: false,
      },
      
      // Status management
      status: body.status || "draft",
      selected_itinerary_id: null,
      confirmations: null,
      booked_at: null,
      itineraries: null,
      
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log(`========================================`);
    console.log(`CREATE TRIP: Saving trip data`);
    console.log(`Trip name: ${trip.trip_name}`);
    console.log(`Origin: ${trip.origin_city || 'not specified'}`);
    console.log(`Destination: ${trip.destination}`);
    console.log(`Start date: ${trip.start_date}`);
    console.log(`End date: ${trip.end_date}`);
    console.log(`Travelers count: ${travelersCount}`);
    console.log(`========================================`);

    await kv.set(`trip:${tripId}`, trip);
    console.log(`Created trip ${tripId} with status: ${trip.status}`);
    return c.json(trip);
  } catch (error) {
    console.error("Error creating trip:", error);
    return c.json({ error: "Failed to create trip" }, 500);
  }
});

// Get a trip by ID
app.get("/make-server-97df1df1/trips/:tripId", async (c) => {
  try {
    const tripId = c.req.param("tripId");
    console.log(`GET /trips/${tripId} - Fetching trip from KV`);
    
    const trip = await kv.get(`trip:${tripId}`);
    
    if (!trip) {
      console.error(`GET /trips/${tripId} - Trip not found`);
      return c.json({ error: "Trip not found" }, 404);
    }
    
    console.log(`GET /trips/${tripId} - Trip found:`, trip.trip_name);
    console.log(`GET /trips/${tripId} - Has itineraries:`, !!trip.itineraries);
    console.log(`GET /trips/${tripId} - Number of itineraries:`, trip.itineraries?.length || 0);
    
    return c.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    return c.json({ error: "Failed to fetch trip" }, 500);
  }
});

// Update a trip
app.put("/make-server-97df1df1/trips/:tripId", async (c) => {
  try {
    const tripId = c.req.param("tripId");
    const body = await c.req.json();
    
    // Get existing trip
    const existingTrip = await kv.get(`trip:${tripId}`);
    
    if (!existingTrip) {
      return c.json({ error: "Trip not found" }, 404);
    }
    
    // Merge updates
    const updatedTrip = {
      ...existingTrip,
      ...body,
      id: tripId, // Ensure ID doesn't change
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(`trip:${tripId}`, updatedTrip);
    return c.json(updatedTrip);
  } catch (error) {
    console.error("Error updating trip:", error);
    return c.json({ error: "Failed to update trip" }, 500);
  }
});

// Delete a trip
app.delete("/make-server-97df1df1/trips/:tripId", async (c) => {
  try {
    const tripId = c.req.param("tripId");
    await kv.del(`trip:${tripId}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting trip:", error);
    return c.json({ error: "Failed to delete trip" }, 500);
  }
});

// ============================================
// TRAVELER PREFERENCES ENDPOINTS
// ============================================

// Get preferences for a specific traveler on a trip
app.get("/make-server-97df1df1/trips/:tripId/preferences/:travelerId", async (c) => {
  try {
    const tripId = c.req.param("tripId");
    const travelerId = c.req.param("travelerId");
    
    const preferences = await kv.get(`preferences:${tripId}:${travelerId}`);
    
    if (!preferences) {
      return c.json({ error: "Preferences not found" }, 404);
    }
    
    return c.json(preferences);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return c.json({ error: "Failed to fetch preferences" }, 500);
  }
});

// Save or update preferences for a traveler
app.put("/make-server-97df1df1/trips/:tripId/preferences/:travelerId", async (c) => {
  try {
    const tripId = c.req.param("tripId");
    const travelerId = c.req.param("travelerId");
    const body = await c.req.json();
    
    const preferences = {
      trip_id: tripId,
      traveler_identifier: travelerId,
      airport_flexibility: body.airport_flexibility || "home_only",
      departure_time_pref: body.departure_time_pref || "flexible",
      arrival_time_pref: body.arrival_time_pref || "flexible",
      comfort_vs_cost: body.comfort_vs_cost || 50,
      hotel_distance_pref: body.hotel_distance_pref || "flexible",
      room_sharing_willing: body.room_sharing_willing || false,
      roommate_preference_id: body.roommate_preference_id || null,
      accessibility_needs: body.accessibility_needs || [],
      accessibility_notes: body.accessibility_notes || "",
      dietary_restrictions: body.dietary_restrictions || [],
      explore_restaurants: body.explore_restaurants || false,
      preferences_completed: true,
      created_at: body.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Save preferences
    await kv.set(`preferences:${tripId}:${travelerId}`, preferences);
    
    // Update the trip's traveler record to mark preferences as completed
    const trip = await kv.get(`trip:${tripId}`);
    if (trip && trip.travelers) {
      const updatedTravelers = trip.travelers.map((traveler: any) => {
        if (traveler.email === travelerId || traveler.id === travelerId) {
          return { ...traveler, preferences_completed: true };
        }
        return traveler;
      });
      
      await kv.set(`trip:${tripId}`, {
        ...trip,
        travelers: updatedTravelers,
        updated_at: new Date().toISOString(),
      });
    }
    
    return c.json(preferences);
  } catch (error) {
    console.error("Error saving preferences:", error);
    return c.json({ error: "Failed to save preferences" }, 500);
  }
});

// Get all preferences for a trip (for organizer view)
app.get("/make-server-97df1df1/trips/:tripId/preferences", async (c) => {
  try {
    const tripId = c.req.param("tripId");
    
    // Get the trip to find all travelers
    const trip = await kv.get(`trip:${tripId}`);
    
    if (!trip) {
      return c.json({ error: "Trip not found" }, 404);
    }
    
    // Fetch preferences for each traveler
    const preferencesPromises = (trip.travelers || []).map(async (traveler: any) => {
      const travelerId = traveler.email || traveler.id;
      const prefs = await kv.get(`preferences:${tripId}:${travelerId}`);
      return {
        traveler_id: travelerId,
        traveler_name: traveler.name,
        preferences: prefs,
        completed: traveler.preferences_completed || false,
      };
    });
    
    const allPreferences = await Promise.all(preferencesPromises);
    
    return c.json({
      trip_id: tripId,
      travelers: allPreferences,
    });
  } catch (error) {
    console.error("Error fetching all preferences:", error);
    return c.json({ error: "Failed to fetch preferences" }, 500);
  }
});

// ============================================
// ITINERARY GENERATION ENDPOINT
// ============================================

// Generate itineraries using Flowise AI
app.post("/make-server-97df1df1/trips/:tripId/generate-itineraries", async (c) => {
  try {
    const tripId = c.req.param("tripId");
    
    // Create a new request with tripId in the body
    const requestBody = JSON.stringify({ tripId });
    const request = new Request(c.req.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    });
    
    return await generateItineraries(request);
  } catch (error) {
    console.error("Error in generate-itineraries route:", error);
    return c.json({ 
      error: "Failed to generate itineraries",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Confirm booking - select an itinerary and mark trip as booked
app.post("/make-server-97df1df1/trips/:tripId/confirm-booking", async (c) => {
  try {
    const tripId = c.req.param("tripId");
    const body = await c.req.json();
    const { selected_itinerary_id } = body;
    
    if (!selected_itinerary_id) {
      return c.json({ error: "selected_itinerary_id is required" }, 400);
    }
    
    // Get existing trip
    const trip = await kv.get(`trip:${tripId}`);
    
    if (!trip) {
      return c.json({ error: "Trip not found" }, 404);
    }
    
    // Verify the selected itinerary exists
    const selectedItinerary = trip.itineraries?.find((itin: any) => itin.id === selected_itinerary_id);
    
    if (!selectedItinerary) {
      return c.json({ 
        error: "Selected itinerary not found",
        details: `Itinerary with id ${selected_itinerary_id} does not exist in this trip`
      }, 404);
    }
    
    // Generate simple confirmation codes
    const confirmations = {
      flight: `FLT-${crypto.randomUUID().substring(0, 8).toUpperCase()}`,
      hotel: `HTL-${crypto.randomUUID().substring(0, 8).toUpperCase()}`,
      trip_id: tripId,
      itinerary_id: selected_itinerary_id,
      confirmed_at: new Date().toISOString(),
    };
    
    // Update trip with booking confirmation
    const updatedTrip = {
      ...trip,
      selected_itinerary_id,
      status: "booked",
      confirmations,
      booked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(`trip:${tripId}`, updatedTrip);
    
    console.log(`Trip ${tripId} booked with itinerary ${selected_itinerary_id}`);
    console.log(`Confirmation codes: Flight ${confirmations.flight}, Hotel ${confirmations.hotel}`);
    
    return c.json({
      trip: updatedTrip,
      confirmations,
      message: "Trip successfully booked"
    });
  } catch (error) {
    console.error("Error confirming booking:", error);
    return c.json({ 
      error: "Failed to confirm booking",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// ============================================
// EXPENSE ENDPOINTS
// ============================================

// Get all expenses for a trip
app.get("/make-server-97df1df1/trips/:tripId/expenses", async (c) => {
  try {
    const tripId = c.req.param("tripId");
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("trip_id", tripId)
      .order("date", { ascending: false });
    
    if (error) {
      console.error("Error fetching expenses:", error);
      return c.json({ error: "Failed to fetch expenses" }, 500);
    }
    
    return c.json(data || []);
  } catch (error) {
    console.error("Error in expenses endpoint:", error);
    return c.json({ error: "Failed to fetch expenses" }, 500);
  }
});

// Create a new expense
app.post("/make-server-97df1df1/trips/:tripId/expenses", async (c) => {
  try {
    const tripId = c.req.param("tripId");
    const body = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    
    const expense = {
      trip_id: tripId,
      merchant: body.merchant,
      amount: body.amount,
      date: body.date,
      category: body.category,
      traveler: body.traveler || "Unknown",
      receipt_url: body.receipt_url || null,
      policy_status: body.policy_status || "compliant",
      created_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from("expenses")
      .insert(expense)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating expense:", error);
      return c.json({ error: "Failed to create expense" }, 500);
    }
    
    return c.json(data);
  } catch (error) {
    console.error("Error in create expense endpoint:", error);
    return c.json({ error: "Failed to create expense" }, 500);
  }
});

// Process receipt upload with Flowise extraction
app.post("/make-server-97df1df1/trips/:tripId/expenses/upload-receipt", async (c) => {
  try {
    const tripId = c.req.param("tripId");
    const body = await c.req.json();
    const { receiptUrl } = body;
    
    if (!receiptUrl) {
      return c.json({ error: "Receipt URL is required" }, 400);
    }
    
    // Get Flowise API credentials from environment
    const flowiseApiUrl = Deno.env.get("EXPENSE_FLOWISE_API_URL");
    const flowiseFlowId = Deno.env.get("EXPENSE_FLOWISE_FLOW_ID");
    const flowiseApiKey = Deno.env.get("EXPENSE_FLOWISE_API_KEY");
    
    if (!flowiseApiUrl || !flowiseFlowId || !flowiseApiKey) {
      console.error("Missing Flowise environment variables");
      return c.json({ 
        error: "Flowise configuration missing. Please set EXPENSE_FLOWISE_API_URL, EXPENSE_FLOWISE_FLOW_ID, and EXPENSE_FLOWISE_API_KEY" 
      }, 500);
    }
    
    console.log("Calling Flowise receipt extraction API...");
    
    // Call Flowise API for receipt extraction
    const flowiseUrl = `${flowiseApiUrl}/api/v1/prediction/${flowiseFlowId}`;
    const flowiseResponse = await fetch(flowiseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${flowiseApiKey}`,
      },
      body: JSON.stringify({
        question: receiptUrl, // Send the receipt URL as the question
      }),
    });
    
    if (!flowiseResponse.ok) {
      const errorText = await flowiseResponse.text();
      console.error("Flowise API error:", errorText);
      return c.json({ 
        error: "Failed to extract receipt data",
        details: errorText
      }, 500);
    }
    
    let flowiseData = await flowiseResponse.json();
    console.log("Flowise raw response:", JSON.stringify(flowiseData, null, 2));
    
    // Extract the text response
    let responseText = flowiseData.text || flowiseData.response || JSON.stringify(flowiseData);
    
    // Remove markdown code blocks if present
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      responseText = jsonMatch[1];
    }
    
    // Parse the extracted data
    let extractedData;
    try {
      extractedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Flowise response as JSON:", parseError);
      console.error("Response text:", responseText);
      return c.json({ 
        error: "Failed to parse receipt data",
        details: "Invalid JSON response from Flowise"
      }, 500);
    }
    
    console.log("Parsed receipt data:", extractedData);
    
    // Create expense record in Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    
    const expense = {
      trip_id: tripId,
      merchant: extractedData.merchant || "Unknown",
      amount: parseFloat(extractedData.amount) || 0,
      date: extractedData.date || new Date().toISOString().split('T')[0],
      category: extractedData.category || "Other",
      traveler: extractedData.traveler || "Unknown",
      receipt_url: receiptUrl,
      policy_status: "compliant", // Default, can be calculated based on policy
      created_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from("expenses")
      .insert(expense)
      .select()
      .single();
    
    if (error) {
      console.error("Error saving expense to database:", error);
      return c.json({ error: "Failed to save expense" }, 500);
    }
    
    console.log("Expense saved successfully:", data);
    return c.json(data);
  } catch (error) {
    console.error("Error in upload receipt endpoint:", error);
    return c.json({ 
      error: "Failed to process receipt",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

Deno.serve(app.fetch);