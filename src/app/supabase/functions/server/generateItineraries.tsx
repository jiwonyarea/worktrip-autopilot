import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

// Edge Function for generating trip itineraries with Flowise integration
// Last updated: 2025-12-03 - Added mock data fallback for Flowise configuration errors

interface GenerateItinerariesRequest {
  tripId: string;
}

// Helper function to strip markdown code blocks from JSON strings
function stripMarkdownCodeBlocks(text: string): string {
  // Remove ```json, ```javascript, ```js, or plain ``` wrappers
  let cleaned = text.trim();
  
  // Match code blocks with optional language identifier
  const codeBlockRegex = /^```(?:json|javascript|js)?\s*\n?([\s\S]*?)\n?```$/;
  const match = cleaned.match(codeBlockRegex);
  
  if (match) {
    cleaned = match[1].trim();
    console.log("Stripped markdown code blocks from response");
  }
  
  return cleaned;
}

export async function generateItineraries(req: Request): Promise<Response> {
  try {
    // Parse request body
    const { tripId } = (await req.json()) as GenerateItinerariesRequest;

    if (!tripId) {
      return new Response(
        JSON.stringify({ error: "tripId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`========================================`);
    console.log(`ITINERARY GENERATION START`);
    console.log(`Trip ID: ${tripId}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`========================================`);

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Step 1: Load trip data
    const trip = await kv.get(`trip:${tripId}`);
    if (!trip) {
      console.error(`Trip not found: ${tripId}`);
      return new Response(
        JSON.stringify({ error: "Trip not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`Loaded trip: ${trip.trip_name}`);

    // Step 2: Load all traveler preferences for this trip
    const preferencesKeys = await kv.getByPrefix(`preferences:${tripId}:`);
    const travelerPreferences = preferencesKeys.map((item) => item.value);

    console.log(`Loaded ${travelerPreferences.length} traveler preferences`);

    // Default preferences to use when a traveler hasn't completed the survey
    const defaultPreferences = {
      airport_flexibility: "home_only",
      departure_time_pref: "morning",
      arrival_time_pref: "afternoon",
      comfort_vs_cost: 50,
      hotel_distance_pref: "walking",
      room_sharing_willing: false,
      roommate_preference_id: null,
      accessibility_needs: [],
      accessibility_notes: "",
      dietary_restrictions: [],
      explore_restaurants: false,
    };

    // Step 3: Build payload for Flowise
    const travelersWithPreferences = (trip.travelers || []).map((traveler: any) => {
      const prefs = travelerPreferences.find(
        (p: any) => p.traveler_identifier === traveler.email || p.traveler_email === traveler.email
      );
      
      // Use actual preferences if available, otherwise use defaults
      const effectivePreferences = prefs || {
        ...defaultPreferences,
        traveler_identifier: traveler.email,
        preferences_completed: false,
      };

      return {
        name: traveler.name,
        email: traveler.email,
        role: traveler.role,
        attendance: traveler.attendance,
        preferences: effectivePreferences,
        preferences_source: prefs ? "user_provided" : "default",
      };
    });

    // Support both traditional and intent-based trip creation
    // For intent-based trips, use inferred fields if traditional fields are empty
    const tripName = trip.trip_name || trip.inferred_trip_name || "Work Trip";
    const destination = trip.destination || trip.inferred_destination || "TBD";
    const startDate = trip.start_date || trip.inferred_dates?.start_date || trip.inferred_dates?.startDate || null;
    const endDate = trip.end_date || trip.inferred_dates?.end_date || trip.inferred_dates?.endDate || null;
    const purpose = trip.purpose || "business";

    // VALIDATION: Ensure critical fields are present before calling Flowise
    const missingFields: string[] = [];
    
    if (!destination || destination === "TBD") {
      missingFields.push("destination");
    }
    if (!startDate) {
      missingFields.push("start_date");
    }
    if (!endDate) {
      missingFields.push("end_date");
    }
    if (!trip.travelers || trip.travelers.length === 0) {
      missingFields.push("travelers");
    }
    
    if (missingFields.length > 0) {
      console.error(`========================================`);
      console.error(`❌ VALIDATION ERROR: Missing critical fields`);
      console.error(`Missing fields: ${missingFields.join(', ')}`);
      console.error(`Trip data:`, {
        trip_name: tripName,
        destination,
        start_date: startDate,
        end_date: endDate,
        travelers_count: trip.travelers?.length || 0,
      });
      console.error(`========================================`);
      
      return new Response(
        JSON.stringify({
          error: "Please complete trip basics before generating itineraries",
          missing_fields: missingFields,
          details: `The following required fields are missing: ${missingFields.join(', ')}. Please provide these details before generating itineraries.`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const payload = {
      trip_id: tripId,
      trip_basics: {
        trip_name: tripName,
        destination_city: destination,
        destination_venue: trip.venue || null,
        start_date: startDate,
        end_date: endDate,
        trip_purpose: purpose,
        // Include intent text for context if available
        intent_text: trip.intent_text || null,
      },
      constraints: {
        total_budget: trip.total_budget || null,
        budget_per_person: trip.budget_per_person || null,
        autonomy_level: trip.autonomy_level,
        policy_guidelines: trip.policy_guidelines || null,
      },
      survey_config: trip.survey_config || {},
      travelers: travelersWithPreferences,
    };

    console.log(`========================================`);
    console.log(`FLOWISE REQUEST PAYLOAD STRUCTURE`);
    console.log(`Trip ID: ${payload.trip_id}`);
    console.log(`Trip Name: ${payload.trip_basics.trip_name}`);
    console.log(`Destination: ${payload.trip_basics.destination_city}`);
    console.log(`Dates: ${payload.trip_basics.start_date} → ${payload.trip_basics.end_date}`);
    console.log(`Purpose: ${payload.trip_basics.trip_purpose}`);
    console.log(`Budget per person: $${payload.constraints.budget_per_person || 'not set'}`);
    console.log(`Total budget: $${payload.constraints.total_budget || 'not set'}`);
    console.log(`Autonomy level: ${payload.constraints.autonomy_level}`);
    console.log(`Travelers: ${payload.travelers.length}`);
    payload.travelers.forEach((traveler: any, idx: number) => {
      console.log(`  ${idx + 1}. ${traveler.name} (${traveler.email}) - Prefs: ${traveler.preferences_source}`);
    });
    console.log(`\nFull payload object:`);
    console.log(JSON.stringify(payload, null, 2));
    console.log(`========================================`);

    // Step 4: Call Flowise Prediction API
    const flowiseApiUrl = Deno.env.get("FLOWISE_API_URL");
    const flowiseApiKey = Deno.env.get("FLOWISE_API_KEY");
    const flowiseFlowId = Deno.env.get("FLOWISE_FLOW_ID");

    if (!flowiseApiUrl || !flowiseFlowId) {
      console.error("Missing Flowise configuration");
      return new Response(
        JSON.stringify({
          error: "Flowise configuration is missing. Please set FLOWISE_API_URL and FLOWISE_FLOW_ID.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const flowiseUrl = `${flowiseApiUrl}/prediction/${flowiseFlowId}`;
    console.log(`Calling Flowise API: ${flowiseUrl}`);

    const flowiseHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (flowiseApiKey && flowiseApiKey.trim() !== "") {
      flowiseHeaders["Authorization"] = `Bearer ${flowiseApiKey}`;
    }

    // Build the Flowise request body
    const flowiseRequestBody = {
      question: JSON.stringify(payload),
      streaming: false,
    };

    console.log(`========================================`);
    console.log(`FLOWISE API REQUEST`);
    console.log(`URL: ${flowiseUrl}`);
    console.log(`Method: POST`);
    console.log(`Headers:`, {
      "Content-Type": flowiseHeaders["Content-Type"],
      "Authorization": flowiseApiKey ? `Bearer ${flowiseApiKey.substring(0, 10)}...` : 'Not set',
    });
    console.log(`\nRequest Body Structure:`);
    console.log(`  - question: <JSON string of trip payload>`);
    console.log(`  - streaming: false`);
    console.log(`\nThe "question" field contains this JSON string:`);
    console.log(flowiseRequestBody.question);
    console.log(`\n(When parsed, the question field equals the payload shown above)`);
    console.log(`========================================`);

    let flowiseResponse;
    try {
      flowiseResponse = await fetch(flowiseUrl, {
        method: "POST",
        headers: flowiseHeaders,
        body: JSON.stringify(flowiseRequestBody),
      });
    } catch (fetchError) {
      console.error("Network error calling Flowise API:", fetchError);
      return new Response(
        JSON.stringify({
          error: "Network error: Unable to reach Flowise API. Please check your connection and try again.",
          error_type: "network_error",
          details: fetchError instanceof Error ? fetchError.message : String(fetchError),
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!flowiseResponse.ok) {
      const errorText = await flowiseResponse.text();
      console.error(
        `Flowise API error (${flowiseResponse.status}): ${errorText}`
      );
      
      // Check if this is a model configuration error (404 No endpoints found)
      const isModelConfigError = errorText.includes("404 No endpoints found") || 
                                  errorText.includes("No endpoints found for");
      
      if (isModelConfigError) {
        console.warn("⚠️ Flowise model configuration error detected. Using mock data fallback.");
        console.warn("To fix: Update your Flowise chatflow to use an available AI model.");
        
        // Generate mock itineraries as fallback
        const mockItineraries = generateMockItineraries(tripName, destination, startDate, endDate, trip.travelers?.length || 1);
        
        // Store mock itineraries in Supabase
        const { error: updateError } = await supabase
          .from("trips")
          .update({
            itineraries: mockItineraries,
            status: "awaiting_selection",
            updated_at: new Date().toISOString(),
          })
          .eq("id", tripId);

        if (updateError) {
          console.error("Error storing mock itineraries:", updateError);
        } else {
          console.log("✅ Mock itineraries stored successfully");
        }

        return new Response(
          JSON.stringify({
            itineraries: mockItineraries,
            warning: "Using demo itineraries. Flowise AI model is not configured. Please update your Flowise chatflow settings.",
            mock_data: true,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      
      // For other errors, return the error response
      return new Response(
        JSON.stringify({
          error: `Flowise API returned error ${flowiseResponse.status}: ${flowiseResponse.statusText}. ${errorText ? errorText.substring(0, 200) : ''}`,
          error_type: "flowise_api_error",
          status_code: flowiseResponse.status,
          details: errorText,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const flowiseData = await flowiseResponse.json();
    console.log("Flowise response:", JSON.stringify(flowiseData, null, 2));

    // Step 5: Parse the Flowise response
    let itinerariesData;

    if (flowiseData.itineraries) {
      // Direct itineraries field
      itinerariesData = flowiseData.itineraries;
      console.log("Found itineraries in direct field");
    } else if (flowiseData.text) {
      // Parse text field as JSON
      console.log("Flowise response text field:", flowiseData.text);
      console.log("Text field type:", typeof flowiseData.text);
      
      try {
        // Strip markdown code blocks before parsing
        const cleanedText = stripMarkdownCodeBlocks(flowiseData.text);
        console.log("Cleaned text (first 200 chars):", cleanedText.substring(0, 200));
        
        const parsedText = JSON.parse(cleanedText);
        itinerariesData = parsedText.itineraries || parsedText;
        console.log("Found itineraries in text field");
      } catch (e) {
        console.error("Failed to parse text field as JSON:", e);
        console.error("Text content (first 500 chars):", flowiseData.text.substring(0, 500));
        
        // Try to use the text as-is if it looks like markdown or plain text
        // Create a fallback itinerary structure
        console.log("Creating fallback itineraries from text response");
        itinerariesData = [{
          id: "option-1",
          option_label: "Generated Option",
          title: "AI Generated Itinerary",
          total_cost: trip.budget_per_person ? trip.budget_per_person * trip.travelers.length : 5000,
          policy_compliant: true,
          features: ["AI Generated", "Requires manual review"],
          details: {
            raw_response: flowiseData.text,
            note: "This response could not be parsed as structured JSON. Please review the raw response.",
          }
        }];
        console.log("Using fallback itinerary structure");
      }
    } else if (flowiseData.json) {
      // Some Flowise configurations return data in a 'json' field
      console.log("Found json field in Flowise response");
      itinerariesData = flowiseData.json.itineraries || flowiseData.json;
    } else if (flowiseData.output) {
      // Some Flowise configurations return data in an 'output' field
      console.log("Found output field in Flowise response");
      try {
        const parsedOutput = typeof flowiseData.output === 'string' 
          ? JSON.parse(flowiseData.output)
          : flowiseData.output;
        itinerariesData = parsedOutput.itineraries || parsedOutput;
      } catch (e) {
        console.error("Failed to parse output field:", e);
        itinerariesData = flowiseData.output;
      }
    } else {
      console.error("No recognized itineraries field in Flowise response");
      console.error("Available fields:", Object.keys(flowiseData));
      return new Response(
        JSON.stringify({
          error: `Invalid response format: Flowise returned data but no itineraries were found. Available fields: ${Object.keys(flowiseData).join(', ')}`,
          error_type: "invalid_response_format",
          available_fields: Object.keys(flowiseData),
          response_sample: JSON.stringify(flowiseData).substring(0, 500),
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Step 6: Map itinerary objects to our data structure
    const itineraries = Array.isArray(itinerariesData)
      ? itinerariesData
      : [itinerariesData];

    console.log(`========================================`);
    console.log(`RAW ITINERARIES FROM FLOWISE (count: ${itineraries.length})`);
    console.log(JSON.stringify(itineraries, null, 2));
    console.log(`========================================`);

    // Validate that we have at least one itinerary
    if (!itineraries || itineraries.length === 0) {
      console.error("No itineraries returned from Flowise");
      return new Response(
        JSON.stringify({
          error: "Failed to generate itineraries",
          details: "Flowise did not return any itineraries. Please try again or check your Flowise configuration.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const mappedItineraries = itineraries.map((itin: any, index: number) => {
      // Generate a stable ID if not provided
      const id = itin.id || `opt-${index}`;
      
      // Convert option field to snake_case for option_label
      // "Cost Saver" -> "cost_saver", "Balanced" -> "balanced", "Time Saver" -> "time_saver"
      const optionRaw = itin.option || itin.option_label || `Option ${index + 1}`;
      const option_label = optionRaw
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
      
      // Use option as the display title
      const title = itin.title || itin.option || optionRaw;

      // Extract features array
      const features: string[] = itin.features && Array.isArray(itin.features) 
        ? itin.features 
        : [];
      
      // Build details object with string summaries
      const details: any = {
        flight_summary: itin.flight_summary || '',
        hotel_summary: itin.hotel_summary || '',
        ground_transport_summary: itin.ground_transport_summary || '',
        food_summary: itin.food_summary || '',
        preference_satisfaction_score: itin.preference_satisfaction_score || 0,
      };

      return {
        id,
        option_label,
        title,
        total_cost: itin.total_cost || itin.cost || 0,
        budget_percentage: itin.budget_percentage || 0,
        policy_compliant: itin.policy_compliant !== undefined ? itin.policy_compliant : true,
        features,
        details,
        raw: itin, // Keep raw data for debugging
      };
    });

    console.log(`========================================`);
    console.log(`MAPPED ITINERARIES (count: ${mappedItineraries.length})`);
    mappedItineraries.forEach((itin, idx) => {
      console.log(`\nItinerary ${idx + 1}:`);
      console.log(`  - ID: ${itin.id}`);
      console.log(`  - Option Label: ${itin.option_label}`);
      console.log(`  - Title: ${itin.title}`);
      console.log(`  - Total Cost: $${itin.total_cost}`);
      console.log(`  - Budget %: ${itin.budget_percentage}%`);
      console.log(`  - Policy Compliant: ${itin.policy_compliant}`);
      console.log(`  - Features (${itin.features.length}): ${itin.features.join(', ')}`);
      console.log(`  - Details:`);
      console.log(`    • Flight Summary: ${itin.details.flight_summary}`);
      console.log(`    • Hotel Summary: ${itin.details.hotel_summary}`);
      console.log(`    • Ground Transport Summary: ${itin.details.ground_transport_summary}`);
      console.log(`    • Food Summary: ${itin.details.food_summary}`);
      console.log(`    • Preference Satisfaction Score: ${itin.details.preference_satisfaction_score}`);
    });
    console.log(`========================================`);

    // Step 7: Save itineraries to trip
    const updatedTrip = {
      ...trip,
      itineraries: mappedItineraries,
      status: "awaiting_selection",
      updated_at: new Date().toISOString(),
    };

    console.log(`========================================`);
    console.log(`SAVING TO KV STORE`);
    console.log(`Key: trip:${tripId}`);
    console.log(`Status: ${updatedTrip.status}`);
    console.log(`Itineraries count: ${updatedTrip.itineraries.length}`);
    console.log(`First itinerary total_cost: $${updatedTrip.itineraries[0]?.total_cost || 0}`);
    console.log(`========================================`);

    await kv.set(`trip:${tripId}`, updatedTrip);
    console.log(`✅ Successfully saved to KV store: trip:${tripId}`);
    console.log(`========================================`);

    // Step 8: Return itineraries
    return new Response(
      JSON.stringify({ itineraries: mappedItineraries }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("========================================");
    console.error("❌ ERROR GENERATING ITINERARIES");
    console.error("Error:", error);
    console.error("========================================");
    return new Response(
      JSON.stringify({
        error: "Failed to generate itineraries",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Helper function to generate mock itineraries
function generateMockItineraries(tripName: string, destination: string, startDate: string, endDate: string, travelerCount: number): any[] {
  return [
    {
      id: "option-1",
      option_label: "cost_saver",
      title: "Cost-Saving Itinerary",
      total_cost: travelerCount * 1000,
      budget_percentage: 50,
      policy_compliant: true,
      features: ["Cost-Effective", "Budget-Friendly"],
      details: {
        flight_summary: "Economy flights with layovers",
        hotel_summary: "Budget-friendly hotels with shared rooms",
        ground_transport_summary: "Public transportation and carpooling",
        food_summary: "Economic dining options and meal kits",
        preference_satisfaction_score: 75,
      },
    },
    {
      id: "option-2",
      option_label: "balanced",
      title: "Balanced Itinerary",
      total_cost: travelerCount * 2000,
      budget_percentage: 75,
      policy_compliant: true,
      features: ["Balanced Costs", "Moderate Comfort"],
      details: {
        flight_summary: "Direct flights with some layovers",
        hotel_summary: "Moderate hotels with private rooms",
        ground_transport_summary: "Rental cars and public transportation",
        food_summary: "Moderate dining options and some meal kits",
        preference_satisfaction_score: 85,
      },
    },
    {
      id: "option-3",
      option_label: "time_saver",
      title: "Time-Saving Itinerary",
      total_cost: travelerCount * 3000,
      budget_percentage: 100,
      policy_compliant: true,
      features: ["Time-Efficient", "High Comfort"],
      details: {
        flight_summary: "Direct flights with minimal layovers",
        hotel_summary: "Luxury hotels with private rooms",
        ground_transport_summary: "Private cars and airport transfers",
        food_summary: "High-end dining options and no meal kits",
        preference_satisfaction_score: 95,
      },
    },
  ];
}