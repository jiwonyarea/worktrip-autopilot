import { supabaseUrl, publicAnonKey } from './supabase/info';

const API_BASE_URL = `${supabaseUrl}/functions/v1/server`;

/** Shared fetch wrapper: attaches auth and surfaces the API's error message. */
async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(data.error || `Request failed: ${response.statusText}`);
    // Carry the API's structured fields so callers can branch on them
    // (e.g. a rate-limited demo run offers the pre-generated trips instead).
    Object.assign(error, data, { status: response.status });
    throw error;
  }

  return response.json();
}

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

/**
 * Parse a traveler's free-text request into trip fields.
 * Runs server-side via Claude, so it handles phrasings and relative dates
 * ("next Tuesday", "the week of the 12th") that a regex cannot.
 */
export async function parseIntentText(intentText: string): Promise<ParsedIntent> {
  return apiFetch<ParsedIntent>('/parse-intent', {
    method: 'POST',
    body: JSON.stringify({ intentText }),
  });
}

interface CreateTripPayload {
  intentText: string;
  destination: string;
  origin_city?: string;
  start_date?: string;
  end_date?: string;
  travelers_count?: number;
  trip_name?: string;
  purpose?: string;
  budget_per_person?: number;
  total_budget?: number;
  organizer_name?: string;
  organizer_email?: string;
}

interface UpdateTripPayload {
  trip_name?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  inferred_trip_name?: string;
  inferred_destination?: string;
  inferred_dates?: {
    start_date?: string;
    end_date?: string;
  };
  [key: string]: any;
}

export interface Trip {
  id: string;
  organizer_id: string | null;
  organizer_name: string;
  organizer_email: string;
  
  // Intent-based fields
  intent_text: string | null;
  inferred_trip_name: string | null;
  inferred_destination: string | null;
  inferred_dates: {
    start_date?: string;
    end_date?: string;
  } | null;
  
  // Traditional fields
  trip_name: string;
  destination: string;
  origin_city: string | null;
  inferred_origin_city: string | null;
  inferred_travelers_count: number | null;
  policy_guidelines: string | null;
  start_date: string | null;
  end_date: string | null;
  purpose: string;
  
  budget_per_person: number | null;
  total_budget: number | null;
  autonomy_level: string;
  travelers: any[];
  survey_config: any;
  
  // Status management
  status: 'draft' | 'planning' | 'awaiting_selection' | 'awaiting_approval' | 'booked';
  selected_itinerary_id: string | null;
  confirmations: any | null;
  booked_at: string | null;
  itineraries: any[] | null;
  
  created_at: string;
  updated_at: string;
}

/** Create a new trip from a parsed intent. */
export async function createTrip(payload: CreateTripPayload): Promise<Trip> {
  return apiFetch<Trip>('/trips', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Get a trip by ID. */
export async function getTrip(tripId: string): Promise<Trip> {
  return apiFetch<Trip>(`/trips/${tripId}`);
}

/** Update an existing trip. */
export async function updateTrip(tripId: string, updates: UpdateTripPayload): Promise<Trip> {
  return apiFetch<Trip>(`/trips/${tripId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

/**
 * Generate itineraries for a trip.
 * Searches real flight and hotel inventory, then has the agent assemble three
 * comparable options — this can take 20-60s.
 */
export async function generateItineraries(tripId: string): Promise<{ itineraries: any[] }> {
  return apiFetch<{ itineraries: any[] }>(`/trips/${tripId}/generate-itineraries`, {
    method: 'POST',
  });
}

/** Confirm the selected itinerary. Records the choice; takes no payment. */
export async function confirmBooking(
  tripId: string,
  selectedItineraryId: string,
): Promise<{ trip: Trip; confirmations: any }> {
  return apiFetch<{ trip: Trip; confirmations: any }>(`/trips/${tripId}/confirm-booking`, {
    method: 'POST',
    body: JSON.stringify({ selected_itinerary_id: selectedItineraryId }),
  });
}

export interface Expense {
  id: string;
  trip_id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  traveler: string;
  receipt_url: string | null;
  policy_status: string;
}

/** List expenses filed against a trip, newest first. */
export async function getExpenses(tripId: string): Promise<Expense[]> {
  return apiFetch<Expense[]>(`/trips/${tripId}/expenses`);
}

export interface DemoTrip {
  trip_id: string;
  label: string;
  summary: string;
  destination: string;
  origin_city: string;
  start_date: string;
  end_date: string;
  travelers: number;
  option_count: number;
}

export interface DemoCatalog {
  trips: DemoTrip[];
  live_generation: {
    available: boolean;
    used: number;
    limit: number;
    resets: string;
  };
}

/**
 * Pre-generated trips anyone can explore for free, plus how much of today's
 * live-generation quota is left. Serving these costs no API credit.
 */
export async function getDemoCatalog(): Promise<DemoCatalog> {
  return apiFetch<DemoCatalog>('/demo-trips');
}
