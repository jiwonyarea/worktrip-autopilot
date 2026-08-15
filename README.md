# Worktrip Autopilot

An AI agent that plans group business trips within company policy: you describe
the trip in your own words, it searches real flights and hotels, and it returns
three itineraries to compare and approve.

Originally designed in Figma Make; this repo is the working application.

## Stack

| Layer | What it is |
| --- | --- |
| Frontend | React 18 + Vite + Tailwind v4 + Radix UI |
| API | Supabase Edge Function (Deno + Hono), one function named `server` |
| Data | Supabase Postgres — `kv_store` (trips, preferences) + `expenses` |
| Agent | Anthropic Claude (`claude-opus-5`) with structured outputs |
| Travel data | SerpApi — Google Flights + Google Hotels |

## Setup

### 1. Frontend

```bash
npm install
cp .env.example .env     # fill in your Supabase URL + anon key
npm run dev              # http://localhost:5173
```

### 2. Database

Create a Supabase project, then apply the schema — either
`supabase db push`, or paste `supabase/migrations/0001_init.sql` into the
SQL editor. This creates `kv_store`, `expenses`, and the `receipts`
storage bucket.

### 3. API keys

| Key | Where to get it | Cost |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | Pay per token |
| `SERPAPI_API_KEY` | [serpapi.com](https://serpapi.com) | 100 searches/mo free |

Optional, for a public demo:

| Secret | Purpose | Default |
| --- | --- | --- |
| `DAILY_GENERATION_LIMIT` | Live generations allowed per day. `0` serves only pre-generated trips. | 20 |
| `DEMO_BYPASS_TOKEN` | Sent as `x-demo-bypass`; skips the cap and authorizes curating the demo catalog. | none |

### 4. Deploy the API

```bash
supabase link --project-ref YOUR_PROJECT_REF

supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set SERPAPI_API_KEY=...

supabase functions deploy server
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically —
don't set them yourself.

Verify:

```bash
curl "$VITE_SUPABASE_URL/functions/v1/server/health" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY"
# {"status":"ok","integrations":{"anthropic":true,"serpapi":true}}
```

Both integrations must report `true`. The API returns a clear 503 rather than
falling back to fake data when either is missing.

## API

Base: `{SUPABASE_URL}/functions/v1/server`

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Status + which integrations are configured |
| `POST` | `/parse-intent` | Free text → structured trip fields |
| `POST` | `/trips` | Create a trip |
| `GET·PUT·DELETE` | `/trips/:id` | Read / update / delete |
| `GET·PUT` | `/trips/:id/preferences[/:travelerId]` | Traveler survey responses |
| `POST` | `/trips/:id/generate-itineraries` | Search inventory, build 3 options |
| `POST` | `/trips/:id/confirm-booking` | Record the selected option |
| `GET·POST` | `/trips/:id/expenses` | List / add expenses |
| `POST` | `/trips/:id/expenses/upload-receipt` | Read a receipt image, file the expense |

## How planning works

```
"Book me a trip from Pittsburgh to New York, March 2-5, 3 people"
        │
        ├─ POST /parse-intent ────────► Claude → {origin, destination, dates, travelers}
        │
        ├─ POST /trips ──────────────► stored in kv_store
        │
        └─ POST /generate-itineraries
                 ├─ Claude: resolve city names -> PIT / JFK
                 ├─ SerpApi: Google Flights (round trip + return legs)
                 ├─ SerpApi: Google Hotels
                 └─ Claude: assemble balanced / premium / budget
                            against travelers' preferences and the budget policy
```

The agent may only use inventory SerpApi returned — it is instructed never to
invent an airline, flight number, hotel, or price, and totals are recomputed
server-side rather than trusted from the model.

## Public demo mode

Running the agent costs travel-API searches and model tokens, so the public
demo is free by default and metered only where it has to be.

- **Pre-generated trips** are served straight from the database — real
  airlines, real prices, no API calls. `GET /demo-trips` lists them and
  `?demo=<tripId>` opens one at the options screen. This path costs nothing
  and works even if the travel API is down.
- **Live generation** is capped per day (`DAILY_GENERATION_LIMIT`). Past the
  cap the API returns 429 with `rate_limited: true`, and the UI offers a
  pre-generated trip instead of a retry that cannot succeed.
- **Curating the catalog** is owner-only, gated on `DEMO_BYPASS_TOKEN`:

```bash
curl -X POST "$VITE_SUPABASE_URL/functions/v1/server/demo-trips" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  -H "x-demo-bypass: $DEMO_BYPASS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"trip_id":"...","label":"Conference trip","summary":"SFO to SEA"}'
```

The same header on `generate-itineraries` skips the daily cap, so you can
still generate on a day the public quota is spent.

### Keeping the demo awake

Supabase pauses free-tier projects after ~7 days idle, which would leave the
demo dead for anyone opening it during a quiet stretch.
`.github/workflows/keep-supabase-awake.yml` pings `/health` every 3 days —
that endpoint reads the quota counter from Postgres, so it registers as real
database activity. Push the repo to GitHub and add two repository secrets
(`SUPABASE_URL`, `SUPABASE_ANON_KEY`). Without GitHub, any external cron
service hitting the same URL works.

## Current limitations

- **Booking is simulated.** `confirm-booking` records the choice and returns
  `simulated: true` confirmation codes. No reservation is held and no payment
  is taken. Real ticketing needs an Amadeus production contract and a payment
  processor.
- **Search budget.** SerpApi's free plan allows 100 searches/month and one
  trip costs 3 (round-trip flights, return legs, hotels) — roughly 33 trips.
  Paid plans start at $25/mo for 1,000 searches.
- **Amadeus is no longer an option.** Amadeus decommissioned its Self-Service
  API on 2026-07-17; only Enterprise access remains. That is why this uses
  SerpApi. The provider lives in one module (`serpapi.ts`), so swapping it
  again means rewriting that file only.
- **No authentication.** Every visitor sees the same trips, and the expenses
  RLS policies are open (see the DEMO POSTURE comments in the migration). Add
  auth before this handles anyone's real spend.
- **Trip list on the home screen is hardcoded** placeholder cards, not real data.

## Repo layout

```
src/app/
  components/screens/   the 9 product screens
  components/ui/        Radix + Tailwind primitives (from Figma Make)
  imports/              generated Figma vector/SVG assets
  utils/tripApi.ts      typed frontend API client
supabase/
  functions/server/     the API — index, amadeus, claude, itineraries, kv_store
  migrations/           schema
docs/archive-figma-make/  superseded Figma Make status docs, kept for history
```
