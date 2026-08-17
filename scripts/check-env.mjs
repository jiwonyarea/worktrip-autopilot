// Build-time check for the two public Supabase vars.
//
// Vite inlines import.meta.env.* at build time, so a variable missing from the
// build environment compiles to an empty string and the app ships unable to
// reach its own API — with no build error to show for it. That is exactly how
// the first Vercel deploy went out. Fail the build instead.
//
// loadEnv is Vite's own resolver, so this sees precisely what the build will:
// .env files locally, injected variables on a host like Vercel.

import { loadEnv } from "vite";

const required = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];
const env = loadEnv("production", process.cwd(), "");
const missing = required.filter((k) => !env[k]);

for (const k of required) {
  // Presence and length only — never the value, which would land in build logs.
  console.log(`  ${k}: ${env[k] ? `set (${env[k].length} chars)` : "MISSING"}`);
}

if (missing.length > 0) {
  console.error(
    `\nBuild aborted: ${missing.join(", ")} not set.\n` +
      "On Vercel: Settings > Environment Variables, tick Production, redeploy.\n",
  );
  process.exit(1);
}
