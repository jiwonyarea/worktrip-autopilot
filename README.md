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
| Travel data | Amadeus Self-Service API (flight offers, hotel offers) |

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
| `AMADEUS_API_KEY` / `AMADEUS_API_SECRET` | [developers.amadeus.com](https://developers.amadeus.com) | Test tier free |

### 4. Deploy the API

```bash
supabase link --project-ref YOUR_PROJECT_REF

supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set AMADEUS_API_KEY=...
supabase secrets set AMADEUS_API_SECRET=...

supabase functions deploy server
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically —
don't set them yourself.

Verify:

```bash
curl "$VITE_SUPABASE_URL/functions/v1/server/health" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY"
# {"status":"ok","integrations":{"anthropic":true,"amadeus":true}}
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
                 ├─ Amadeus: resolve PIT / NYC
                 ├─ Amadeus: flight offers (economy + business)
                 ├─ Amadeus: hotel offers
                 └─ Claude: assemble balanced / premium / budget
                            against travelers' preferences and the budget policy
```

The agent may only use inventory Amadeus returned — it is instructed never to
invent an airline, flight number, hotel, or price, and totals are recomputed
server-side rather than trusted from the model.

## Current limitations

- **Booking is simulated.** `confirm-booking` records the choice and returns
  `simulated: true` confirmation codes. No reservation is held and no payment
  is taken. Real ticketing needs an Amadeus production contract and a payment
  processor.
- **Amadeus test environment** returns real schedules and realistic prices, but
  is not live inventory. Set `AMADEUS_ENV=production` once you have production
  credentials.
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
