// Direct Anthropic API access, replacing the previous Flowise dependency.
//
// Everything the agent reasons about goes through here: parsing a traveler's
// free-text intent, turning raw Amadeus inventory into three comparable
// itineraries, and reading receipts. Structured outputs guarantee the JSON
// shape, so no markdown-fence stripping or reparse fallbacks are needed.

import Anthropic from "npm:@anthropic-ai/sdk@0.116.0";

const MODEL = "claude-opus-5";

export function claudeConfigured(): boolean {
  return Boolean(Deno.env.get("ANTHROPIC_API_KEY"));
}

function client(): Anthropic {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey });
}

type Effort = "low" | "medium" | "high";

/**
 * Run one structured-output completion and return the parsed object.
 * `schema` must be a JSON Schema object with additionalProperties:false.
 */
async function structured<T>(opts: {
  system: string;
  content: Anthropic.ContentBlockParam[] | string;
  schema: Record<string, unknown>;
  effort?: Effort;
  maxTokens?: number;
}): Promise<T> {
  const response = await client().messages.create({
    model: MODEL,
    max_tokens: opts.maxTokens ?? 8000,
    system: opts.system,
    output_config: {
      effort: opts.effort ?? "medium",
      format: { type: "json_schema", schema: opts.schema },
    },
    messages: [{ role: "user", content: opts.content as never }],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("Request was declined by safety classifiers");
  }
  if (response.stop_reason === "max_tokens") {
    throw new Error("Response was truncated — raise max_tokens");
  }

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  return JSON.parse(text) as T;
}

// ---------------------------------------------------------------------------
// Intent parsing
// ---------------------------------------------------------------------------

export interface ParsedIntent {
  origin_city: string;
  destination_city: string;
  start_date: string;
  end_date: string;
  travelers_count: number;
  trip_name: string;
  purpose: string;
  missing_fields: string[];
}

const INTENT_SCHEMA = {
  type: "object",
  properties: {
    origin_city: { type: "string", description: "Departure city, or empty string if not stated" },
    destination_city: { type: "string", description: "Destination city, or empty string if not stated" },
    start_date: { type: "string", description: "Departure date as YYYY-MM-DD, or empty string" },
    end_date: { type: "string", description: "Return date as YYYY-MM-DD, or empty string" },
    travelers_count: { type: "integer", description: "Number of travelers; 1 if not stated" },
    trip_name: { type: "string", description: "Short human-readable trip name" },
    purpose: { type: "string", description: "e.g. conference, client meeting, offsite" },
    missing_fields: {
      type: "array",
      items: { type: "string" },
      description: "Which of destination_city, start_date, end_date could not be determined",
    },
  },
  required: [
    "origin_city",
    "destination_city",
    "start_date",
    "end_date",
    "travelers_count",
    "trip_name",
    "purpose",
    "missing_fields",
  ],
  additionalProperties: false,
} as const;

export function parseIntent(
  intentText: string,
  today: string,
): Promise<ParsedIntent> {
  return structured<ParsedIntent>({
    effort: "low",
    maxTokens: 2000,
    system:
      "You extract structured business-trip details from a traveler's own words. " +
      `Today is ${today}; resolve relative dates ("next Tuesday", "the week of the 12th") against it, ` +
      "and assume a future date when the year is ambiguous. Expand airport codes and " +
      "informal names to full city names. Never invent a destination or dates that " +
      "were not stated or clearly implied — list anything you cannot determine in missing_fields.",
    content: intentText,
    schema: INTENT_SCHEMA,
  });
}

// ---------------------------------------------------------------------------
// Airport resolution
// ---------------------------------------------------------------------------

const AIRPORTS_SCHEMA = {
  type: "object",
  properties: {
    origin_iata: {
      type: "string",
      description: "3-letter IATA code for the origin's main commercial airport",
    },
    destination_iata: {
      type: "string",
      description: "3-letter IATA code for the destination's main commercial airport",
    },
    origin_confident: { type: "boolean" },
    destination_confident: { type: "boolean" },
  },
  required: [
    "origin_iata",
    "destination_iata",
    "origin_confident",
    "destination_confident",
  ],
  additionalProperties: false,
} as const;

export interface ResolvedAirports {
  origin_iata: string;
  destination_iata: string;
  origin_confident: boolean;
  destination_confident: boolean;
}

/**
 * Map city names to IATA airport codes. Google Flights needs codes, not names.
 * Where a metro area has several airports, pick the one with the widest
 * service (NYC -> JFK, London -> LHR) so the search returns useful inventory.
 */
export function resolveAirports(
  originCity: string,
  destinationCity: string,
): Promise<ResolvedAirports> {
  return structured<ResolvedAirports>({
    effort: "low",
    maxTokens: 1000,
    system:
      "You map places to IATA airport codes. For a metro area with several " +
      "airports, choose the primary international airport with the broadest " +
      "commercial service. Locations may arrive as a township, suburb, or " +
      "neighbourhood rather than a city — detected from an IP address — so " +
      "resolve to the nearest airport that actually serves that place " +
      "(e.g. 'North Fayette, Pennsylvania' is served by PIT). Set the " +
      "*_confident flag to false only if the place cannot be located at all " +
      "or has no reachable commercial airport — never guess a plausible " +
      "looking code.",
    content: `Origin: ${originCity}\nDestination: ${destinationCity}`,
    schema: AIRPORTS_SCHEMA,
  });
}

// ---------------------------------------------------------------------------
// Itinerary synthesis
// ---------------------------------------------------------------------------

export interface ItineraryOption {
  option_label: "balanced" | "premium" | "budget";
  title: string;
  total_cost: number;
  policy_compliant: boolean;
  policy_note: string;
  features: string[];
  rationale: string;
  details: {
    flight_summary: string;
    hotel_summary: string;
    ground_transport_summary: string;
    food_summary: string;
    outbound_flight: string;
    return_flight: string;
    hotel_name: string;
    flight_cost: number;
    hotel_cost: number;
    ground_transport_cost: number;
    food_cost: number;
    preference_satisfaction_score: number;
  };
}

const ITINERARY_SCHEMA = {
  type: "object",
  properties: {
    itineraries: {
      type: "array",
      description: "Exactly three options: one balanced, one premium, one budget",
      items: {
        type: "object",
        properties: {
          option_label: { type: "string", enum: ["balanced", "premium", "budget"] },
          title: { type: "string" },
          total_cost: { type: "number", description: "Total for ALL travelers, USD" },
          policy_compliant: { type: "boolean" },
          policy_note: {
            type: "string",
            description: "One sentence on how this sits against the budget/policy",
          },
          features: {
            type: "array",
            items: { type: "string" },
            description: "2-4 short tags, e.g. 'Direct flights', 'Walk to venue'",
          },
          rationale: {
            type: "string",
            description: "One or two sentences explaining why this option was assembled this way",
          },
          details: {
            type: "object",
            properties: {
              flight_summary: { type: "string" },
              hotel_summary: { type: "string" },
              ground_transport_summary: { type: "string" },
              food_summary: { type: "string" },
              outbound_flight: {
                type: "string",
                description: "Format: 'Delta Airlines · DL 1420 · PIT to LGA · 09:00 - 11:05'",
              },
              return_flight: {
                type: "string",
                description: "Same format as outbound_flight",
              },
              hotel_name: { type: "string" },
              flight_cost: { type: "number", description: "All travelers, USD" },
              hotel_cost: { type: "number", description: "All travelers, all nights, USD" },
              ground_transport_cost: { type: "number" },
              food_cost: { type: "number" },
              preference_satisfaction_score: { type: "integer" },
            },
            required: [
              "flight_summary",
              "hotel_summary",
              "ground_transport_summary",
              "food_summary",
              "outbound_flight",
              "return_flight",
              "hotel_name",
              "flight_cost",
              "hotel_cost",
              "ground_transport_cost",
              "food_cost",
              "preference_satisfaction_score",
            ],
            additionalProperties: false,
          },
        },
        required: [
          "option_label",
          "title",
          "total_cost",
          "policy_compliant",
          "policy_note",
          "features",
          "rationale",
          "details",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["itineraries"],
  additionalProperties: false,
} as const;

export async function synthesizeItineraries(
  payload: unknown,
): Promise<ItineraryOption[]> {
  const result = await structured<{ itineraries: ItineraryOption[] }>({
    effort: "medium",
    maxTokens: 16000,
    system:
      "You are the planning agent for Worktrip Autopilot, a corporate travel tool. " +
      "You are given real flight and hotel inventory plus the trip's travelers, " +
      "preferences, and budget policy. Assemble exactly three itineraries the " +
      "organizer can compare side by side:\n" +
      "- balanced: the best overall tradeoff of cost, travel time, and comfort\n" +
      "- premium: prioritizes time and comfort (direct flights, closer hotel)\n" +
      "- budget: minimizes cost while staying workable\n\n" +
      "Rules:\n" +
      "- Use ONLY the flights and hotels provided. Never invent an airline, flight " +
      "number, hotel, or price. If inventory is thin, reuse an option and say so " +
      "in the rationale.\n" +
      "- All costs are USD totals for ALL travelers. total_cost must equal the sum " +
      "of flight_cost, hotel_cost, ground_transport_cost, and food_cost.\n" +
      "- Estimate ground transport and food yourself; say in the summary that they " +
      "are estimates.\n" +
      "- Set policy_compliant false when total_cost exceeds the stated budget, and " +
      "explain the overage in policy_note.\n" +
      "- Honor traveler preferences (departure time, comfort-vs-cost, hotel " +
      "distance, accessibility, dietary needs) and reflect them in " +
      "preference_satisfaction_score (0-100).",
    content: JSON.stringify(payload, null, 2),
    schema: ITINERARY_SCHEMA,
  });

  return result.itineraries;
}

// ---------------------------------------------------------------------------
// Receipt extraction (vision)
// ---------------------------------------------------------------------------

export interface ExtractedReceipt {
  merchant: string;
  amount: number;
  date: string;
  category: string;
  traveler: string;
  notes: string;
}

const RECEIPT_SCHEMA = {
  type: "object",
  properties: {
    merchant: { type: "string" },
    amount: { type: "number", description: "Grand total including tax and tip" },
    date: { type: "string", description: "YYYY-MM-DD" },
    category: {
      type: "string",
      enum: ["Flights", "Hotel", "Ground Transport", "Food", "Other"],
    },
    traveler: { type: "string", description: "Empty string if not on the receipt" },
    notes: { type: "string", description: "Anything unclear or unreadable" },
  },
  required: ["merchant", "amount", "date", "category", "traveler", "notes"],
  additionalProperties: false,
} as const;

export function extractReceipt(opts: {
  imageBase64: string;
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  today: string;
}): Promise<ExtractedReceipt> {
  return structured<ExtractedReceipt>({
    effort: "low",
    maxTokens: 2000,
    system:
      "You read business travel expense receipts and return the totals. " +
      `Today is ${opts.today}. Read the grand total actually charged (including ` +
      "tax and tip), not the subtotal. If a field is unreadable, use an empty " +
      "string (or 0 for amount) and explain in notes — never guess a number.",
    content: [
      {
        type: "image",
        source: {
          type: "base64",
          media_type: opts.mediaType,
          data: opts.imageBase64,
        },
      },
      { type: "text", text: "Extract this receipt." },
    ],
    schema: RECEIPT_SCHEMA,
  });
}
