import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/server/make-server-97df1df1`;

interface CreateTripPayload {
  intentText: string;
  overrides?: {
    trip_name?: string;
    destination?: string;
    dates?: {
      start_date?: string;
      end_date?: string;
    };
  };
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

/**
 * Create a new trip from intent
 */
export async function createTrip(payload: CreateTripPayload): Promise<Trip> {
  const response = await fetch(`${API_BASE_URL}/trips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to create trip: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get a trip by ID
 */
export async function getTrip(tripId: string): Promise<Trip> {
  const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch trip: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update an existing trip
 */
export async function updateTrip(tripId: string, updates: UpdateTripPayload): Promise<Trip> {
  const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to update trip: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Generate itineraries for a trip
 */
export async function generateItineraries(tripId: string): Promise<{ itineraries: any[] }> {
  const response = await fetch(`${API_BASE_URL}/trips/${tripId}/generate-itineraries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ tripId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to generate itineraries: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Confirm booking for a trip
 */
export async function confirmBooking(tripId: string, selectedItineraryId: string): Promise<{ trip: Trip; confirmations: any }> {
  const response = await fetch(`${API_BASE_URL}/trips/${tripId}/confirm-booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ selected_itinerary_id: selectedItineraryId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to confirm booking: ${response.statusText}`);
  }

  return response.json();
}