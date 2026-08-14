// Supabase connection details, read from Vite env vars at build time.
// Copy .env.example to .env and fill these in — see README.md.
//
// The anon key is a public, RLS-scoped credential and is meant to ship in the
// browser bundle. The service role key must never appear here.

const url = import.meta.env.VITE_SUPABASE_URL ?? "";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

if (!url || !anonKey) {
  console.error(
    "Supabase is not configured. Copy .env.example to .env and set " +
      "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart `npm run dev`.",
  );
}

export const supabaseUrl = url;
export const publicAnonKey = anonKey;

/** Legacy export — some screens build URLs from the bare project ref. */
export const projectId = url.replace(/^https?:\/\//, "").split(".")[0] ?? "";

export const isSupabaseConfigured = Boolean(url && anonKey);
