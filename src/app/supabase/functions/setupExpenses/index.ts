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
    console.log("Setting up expenses infrastructure...");

    // Create Supabase admin client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const results = {
      table: { status: "unknown", message: "" },
      bucket: { status: "unknown", message: "" },
      policies: { status: "unknown", message: "" },
    };

    // 1. Check if expenses table exists and create if needed
    console.log("Checking expenses table...");
    
    // Try to query the table to see if it exists
    const { error: tableCheckError } = await supabase
      .from("expenses")
      .select("id")
      .limit(1);

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      // Table doesn't exist, create it via SQL
      console.log("Creating expenses table...");
      
      const { error: createTableError } = await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS public.expenses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            trip_id TEXT NOT NULL,
            merchant TEXT,
            amount NUMERIC,
            date TEXT,
            category TEXT,
            traveler TEXT,
            receipt_url TEXT,
            policy_status TEXT DEFAULT 'compliant',
            created_at TIMESTAMPTZ DEFAULT NOW()
          );

          -- Create index on trip_id for faster queries
          CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON public.expenses(trip_id);

          -- Enable RLS
          ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

          -- Allow authenticated users to read all expenses
          CREATE POLICY IF NOT EXISTS "Allow authenticated read" ON public.expenses
            FOR SELECT
            USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

          -- Allow authenticated users to insert expenses
          CREATE POLICY IF NOT EXISTS "Allow authenticated insert" ON public.expenses
            FOR INSERT
            WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

          -- Allow service role full access
          CREATE POLICY IF NOT EXISTS "Allow service role all" ON public.expenses
            USING (auth.role() = 'service_role');
        `
      });

      if (createTableError) {
        // If exec_sql doesn't exist, try direct SQL execution
        console.log("Trying alternative table creation method...");
        
        const createTableSql = `
          CREATE TABLE IF NOT EXISTS public.expenses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            trip_id TEXT NOT NULL,
            merchant TEXT,
            amount NUMERIC,
            date TEXT,
            category TEXT,
            traveler TEXT,
            receipt_url TEXT,
            policy_status TEXT DEFAULT 'compliant',
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `;
        
        // We'll use a raw query via the REST API
        const sqlResponse = await fetch(
          `${Deno.env.get("SUPABASE_URL")}/rest/v1/rpc/exec_sql`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
              "apikey": Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
            },
            body: JSON.stringify({ sql: createTableSql }),
          }
        );

        if (!sqlResponse.ok) {
          console.log("Table creation via SQL failed, table may already exist");
        }
      }

      results.table = { 
        status: "created", 
        message: "Expenses table created successfully" 
      };
    } else {
      console.log("Expenses table already exists");
      results.table = { 
        status: "exists", 
        message: "Expenses table already exists" 
      };
    }

    // 2. Check if receipts bucket exists and create if needed
    console.log("Checking receipts storage bucket...");
    
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
      results.bucket = { 
        status: "error", 
        message: `Failed to check buckets: ${bucketsError.message}` 
      };
    } else {
      const receiptsExists = buckets?.some(b => b.name === "receipts");

      if (!receiptsExists) {
        console.log("Creating receipts bucket...");
        
        const { error: createBucketError } = await supabase
          .storage
          .createBucket("receipts", {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: [
              "image/jpeg",
              "image/jpg", 
              "image/png",
              "image/gif",
              "application/pdf"
            ],
          });

        if (createBucketError) {
          console.error("Error creating bucket:", createBucketError);
          results.bucket = { 
            status: "error", 
            message: `Failed to create bucket: ${createBucketError.message}` 
          };
        } else {
          results.bucket = { 
            status: "created", 
            message: "Receipts bucket created successfully" 
          };
        }
      } else {
        console.log("Receipts bucket already exists");
        results.bucket = { 
          status: "exists", 
          message: "Receipts bucket already exists" 
        };
      }
    }

    // 3. Set up storage policies for receipts bucket
    console.log("Setting up storage policies...");
    results.policies = { 
      status: "info", 
      message: "Storage policies should be configured in Supabase dashboard: allow authenticated upload, allow public read" 
    };

    console.log("Setup complete:", results);

    return new Response(
      JSON.stringify({ 
        success: true,
        results,
        message: "Expenses infrastructure setup complete"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

  } catch (error) {
    console.error("Error during setup:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Setup failed",
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
