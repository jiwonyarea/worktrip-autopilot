import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // Parse request body
    const { tripId, receiptUrl } = await req.json();

    // Validate inputs
    if (!tripId || !receiptUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: tripId and receiptUrl" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    console.log(`Processing receipt for trip ${tripId}: ${receiptUrl}`);

    // Get Flowise API configuration from environment
    const flowiseApiUrl = Deno.env.get("EXPENSE_FLOWISE_API_URL");
    const flowiseFlowId = Deno.env.get("EXPENSE_FLOWISE_FLOW_ID");
    const flowiseApiKey = Deno.env.get("EXPENSE_FLOWISE_API_KEY");

    if (!flowiseApiUrl || !flowiseFlowId) {
      console.error("Missing Flowise configuration");
      return new Response(
        JSON.stringify({ 
          error: "Server configuration error: Flowise settings not found. Please configure EXPENSE_FLOWISE_API_URL and EXPENSE_FLOWISE_FLOW_ID." 
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Build payload for Flowise
    const payload = {
      trip_id: tripId,
      receipt_url: receiptUrl,
    };

    console.log("Calling Flowise API with payload:", payload);

    // Call Flowise Prediction API
    const flowiseUrl = `${flowiseApiUrl}/prediction/${flowiseFlowId}`;
    const flowiseHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add Authorization header if API key is provided
    if (flowiseApiKey) {
      flowiseHeaders["Authorization"] = `Bearer ${flowiseApiKey}`;
    }

    const flowiseResponse = await fetch(flowiseUrl, {
      method: "POST",
      headers: flowiseHeaders,
      body: JSON.stringify({
        question: JSON.stringify(payload),
        streaming: false,
      }),
    });

    if (!flowiseResponse.ok) {
      const errorText = await flowiseResponse.text();
      console.error("Flowise API error:", errorText);
      return new Response(
        JSON.stringify({ 
          error: "Failed to extract receipt data from Flowise",
          details: errorText 
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const flowiseData = await flowiseResponse.json();
    console.log("Flowise response:", JSON.stringify(flowiseData, null, 2));

    // Extract fields from response
    let fields: string[];

    // First check if response has a json array (new format)
    if (Array.isArray(flowiseData.json)) {
      console.log("Using JSON array format from Flowise");
      fields = flowiseData.json.map(f => String(f).trim());
    } 
    // Fall back to CSV text format (legacy)
    else if (flowiseData.text || flowiseData.response) {
      console.log("Using CSV text format from Flowise");
      let csvLine = flowiseData.text || flowiseData.response || "";
      
      // Remove any markdown code blocks if present
      const codeBlockMatch = csvLine.match(/```(?:csv)?\s*([^\n]+)\s*```/);
      if (codeBlockMatch) {
        csvLine = codeBlockMatch[1];
      }

      csvLine = csvLine.trim();

      if (!csvLine) {
        console.error("No CSV data in Flowise response:", flowiseData);
        return new Response(
          JSON.stringify({ 
            error: "Receipt extraction returned empty data",
            details: "The AI could not extract information from this receipt",
            flowiseResponse: flowiseData
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      console.log("Extracted CSV line:", csvLine);
      
      // Parse CSV line: date,merchant,category,traveler,amount,policy_status
      fields = csvLine.split(",").map(f => f.trim());
    }
    // Neither format found
    else {
      console.error("Invalid Flowise response format - expected json array or text field:", flowiseData);
      return new Response(
        JSON.stringify({ 
          error: "Invalid response format from Flowise",
          details: "Expected either a 'json' array or 'text' field in response",
          flowiseResponse: flowiseData
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
    
    if (fields.length < 6) {
      console.error("Invalid field count - expected 6 fields, got:", fields.length, fields);
      return new Response(
        JSON.stringify({ 
          error: "Invalid receipt data format",
          details: `Expected 6 fields but got ${fields.length}` 
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const [date, merchant, category, traveler, amountStr, policyStatus] = fields;
    const amount = parseFloat(amountStr) || 0;

    console.log("Parsed fields:", { date, merchant, category, traveler, amount, policyStatus });

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Insert expense into database
    const expenseData = {
      trip_id: tripId,
      date,
      merchant,
      category,
      traveler,
      amount,
      policy_status: policyStatus,
      receipt_url: receiptUrl,
    };

    console.log("Inserting expense:", expenseData);

    const { data: expense, error: insertError } = await supabase
      .from("expenses")
      .insert(expenseData)
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to save expense to database",
          details: insertError.message 
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    console.log("Expense saved successfully:", expense);

    // Return success response
    return new Response(
      JSON.stringify({ expense }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

  } catch (error) {
    console.error("Error processing receipt:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error) 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});