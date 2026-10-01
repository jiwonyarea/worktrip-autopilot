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
      `Today is ${today}; resolve relative dates ("next Tuesday", "the week of the 12th") against it. ` +
      "People rarely say the year, so never treat a missing year as a missing " +
      "date: when only a month and day are given, assume the current year, and " +
      "roll to the next year only if that date has already passed. " +
      "Expand airport codes and " +
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
    destination_center_lat: {
      type: "number",
      description: "Latitude of the destination's downtown/city centre",
    },
    destination_center_lon: {
      type: "number",
      description: "Longitude of the destination's downtown/city centre",
    },
    long_haul: {
      type: "boolean",
      description:
        "True when the route crosses an ocean or normally takes more than " +
        "about six hours in the air. Sets which standard airfare cap applies.",
    },
  },
  required: [
    "origin_iata",
    "destination_iata",
    "origin_confident",
    "destination_confident",
    "destination_center_lat",
    "destination_center_lon",
    "long_haul",
  ],
  additionalProperties: false,
} as const;

export interface ResolvedAirports {
  origin_iata: string;
  destination_iata: string;
  origin_confident: boolean;
  destination_confident: boolean;
  destination_center_lat: number;
  destination_center_lon: number;
  long_haul: boolean;
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
      "looking code. Also give the destination's downtown coordinates, used " +
      "to measure how far each hotel actually is.",
    content: `Origin: ${originCity}\nDestination: ${destinationCity}`,
    schema: AIRPORTS_SCHEMA,
  });
}

// ---------------------------------------------------------------------------
// Itinerary synthesis
// ---------------------------------------------------------------------------

export interface Highlight {
  text: string;
  type: "pro" | "con";
}

export type ComplianceState = "compliant" | "review_required" | "out_of_policy";

export interface ItineraryOption {
  option_label: "balanced" | "time_saver" | "cost_saver";
  title: string;
  summary: string;
  compliance: ComplianceState;
  total_cost: number;
  policy_compliant: boolean;
  policy_note: string;
  features: string[];
  highlights: Highlight[];
  rationale: string;
  details: {
    flight_summary: string;
    hotel_summary: string;
    ground_transport_summary: string;
    food_summary: string;
    outbound_flight: string;
    return_flight: string;
    hotel_name: string;
    hotel_rating: number;
    hotel_distance_mi: number;
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
          option_label: { type: "string", enum: ["balanced", "time_saver", "cost_saver"] },
          title: { type: "string" },
          summary: {
            type: "string",
            description:
              "ONE sentence, under 15 words, on what this option optimises for " +
              "and what that costs. Shown directly under the option name, so it " +
              "must stand alone — no paragraphs.",
          },
          compliance: {
            type: "string",
            enum: ["compliant", "review_required", "out_of_policy"],
            description:
              "You only propose options you consider bookable, so the default " +
              "is compliant — including when no budget was stated, since " +
              "nothing has been exceeded. Use review_required only for a " +
              "concrete reason the organiser must weigh: within about 10% of a " +
              "stated limit, a cost the traveller must claim back, or a rule " +
              "the trip strains. Use out_of_policy only when a stated limit is " +
              "actually exceeded. An absent budget is not grounds for review.",
          },
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
          highlights: {
            type: "array",
            description:
              "1-3 bullets, each under 10 words, specific to THIS option.\n" +
              "The card already shows: price, airline, flight number, departure " +
              "and arrival times, stop count, hotel name, star rating, distance, " +
              "and nights. A bullet that only restates one of those is wasted — " +
              "every bullet must add something the card cannot show, by tying a " +
              "detail to a traveler preference or to a practical consequence.\n" +
              "Good: 'Arrives 16:01, matches afternoon arrival preference' — it " +
              "reads a number the card shows and says what it means.\n" +
              "Good: '4am wake-up for the return connection'.\n" +
              "Bad: '$376 cheaper than time saver' (price is on the card).\n" +
              "Bad: 'Hotel rated 4.1' (rating is on the card).\n" +
              "Bad: '0.5 miles from downtown' (distance is on the card).\n" +
              "Never repeat a bullet across options, and never state something " +
              "true of all three.",
            items: {
              type: "object",
              properties: {
                text: { type: "string" },
                type: {
                  type: "string",
                  enum: ["pro", "con"],
                  description: "pro: a real advantage over the others. con: the trade-off accepted.",
                },
              },
              required: ["text", "type"],
              additionalProperties: false,
            },
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
              hotel_rating: {
                type: "number",
                description: "Guest rating out of 5 as given in the inventory; 0 if unrated",
              },
              hotel_distance_mi: {
                type: "number",
                description: "Miles from the destination centre, as given in the inventory",
              },
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
              "hotel_rating",
              "hotel_distance_mi",
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
          "summary",
          "compliance",
          "total_cost",
          "policy_compliant",
          "policy_note",
          "features",
          "highlights",
          "rationale",
          "details",
        ],
        additionalProperties: false,
      },
    },
    policy: {
      type: "object",
      description:
        "Per-diems apply to every option equally — they are company policy, " +
        "not a difference between the three.",
      properties: {
        ground_transport_per_day: { type: "number" },
        food_per_day: { type: "number" },
        rationale: {
          type: "string",
          description:
            "The 'Why these options?' note under the three cards. Two " +
            "sentences, 45 words at the very most, written to the organiser " +
            "as 'you'.\n" +
            "Say what actually shaped this set: the one constraint that drove " +
            "the search (a stated preference, the dates, what inventory " +
            "existed on the route) and the trade-off it forced across the " +
            "three. Open on the specific thing — a time, a price gap, a " +
            "preference someone gave.\n" +
            "Good: 'Every non-stop out of PIT lands after 18:00, so the " +
            "cheaper two both cost you the first evening. Time Saver buys " +
            "that evening back for $340.'\n" +
            "Bad: 'Based on your preferences and the available inventory, " +
            "these three options balance cost and convenience.' — it says " +
            "nothing this trip could not.\n" +
            "Never mention what was missing, unstated, unavailable, or " +
            "assumed: the organiser cannot act on it and it reads as an " +
            "excuse. Never name the budget figure — the cards already carry " +
            "the numbers.",
        },
      },
      required: ["ground_transport_per_day", "food_per_day", "rationale"],
      additionalProperties: false,
    },
  },
  required: ["itineraries", "policy"],
  additionalProperties: false,
} as const;

export interface PolicyExtras {
  ground_transport_per_day: number;
  food_per_day: number;
  rationale: string;
}

export async function synthesizeItineraries(
  payload: unknown,
): Promise<{ itineraries: ItineraryOption[]; policy: PolicyExtras }> {
  const result = await structured<{
    itineraries: ItineraryOption[];
    policy: PolicyExtras;
  }>({
    effort: "medium",
    maxTokens: 16000,
    system:
      "You are the planning agent for Worktrip Autopilot, a corporate travel tool. " +
      "You are given real flight and hotel inventory plus the trip's travelers, " +
      "preferences, and budget policy. Assemble exactly three itineraries the " +
      "organizer can compare side by side:\n" +
      "- balanced: the best overall tradeoff of cost, travel time, and comfort\n" +
      "- premium: prioritizes time and comfort (direct flights, closer hotel)\n" +
      "- budget: minimizes cost while staying workable — a 2 or 3 star hotel, " +
      "never a hostel, shared room, or unrated property\n\n" +
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
      "- A budget is ALWAYS present. When policy.budget_source is " +
      "'company_standard' it is Worktrip's own travel policy rather than a " +
      "figure the organiser typed — plan against it exactly as you would a " +
      "stated one. Never write that no budget, cap, or limit was given, in " +
      "any field.\n" +
      "- Honor traveler preferences (departure time, comfort-vs-cost, hotel " +
      "distance, accessibility, dietary needs) and reflect them in " +
      "preference_satisfaction_score (0-100).",
    content: JSON.stringify(payload, null, 2),
    schema: ITINERARY_SCHEMA,
  });

  return { itineraries: result.itineraries, policy: result.policy };
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
