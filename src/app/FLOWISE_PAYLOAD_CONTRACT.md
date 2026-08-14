# Flowise Payload Contract

## Overview
This document describes the exact payload structure sent to the Flowise itinerary generation API.

## Endpoint
The Edge Function sends requests to:
```
POST ${FLOWISE_API_URL}/prediction/${FLOWISE_FLOW_ID}
```

## Request Structure
The request body contains a single field `question` which is a **JSON string**:

```json
{
  "question": "<JSON string>",
  "streaming": false
}
```

## The "question" Field Content
When the `question` field is parsed as JSON, it has the following structure:

```json
{
  "trip_id": "string (UUID or trip identifier)",
  "trip_basics": {
    "trip_name": "string",
    "destination_city": "string",
    "destination_venue": "string | null",
    "start_date": "string (YYYY-MM-DD)",
    "end_date": "string (YYYY-MM-DD)",
    "trip_purpose": "string (e.g., 'business', 'conference', 'client visit')",
    "intent_text": "string | null (original natural language input from user)"
  },
  "constraints": {
    "total_budget": "number | null",
    "budget_per_person": "number | null",
    "autonomy_level": "string (e.g., 'suggest_only', 'auto_book')",
    "policy_guidelines": "object | null"
  },
  "survey_config": {},
  "travelers": [
    {
      "name": "string",
      "email": "string",
      "role": "string | null",
      "attendance": "string | null",
      "preferences": {
        "airport_flexibility": "string (e.g., 'home_only', 'any_nearby')",
        "departure_time_pref": "string (e.g., 'morning', 'afternoon', 'evening')",
        "arrival_time_pref": "string",
        "comfort_vs_cost": "number (0-100 scale)",
        "hotel_distance_pref": "string (e.g., 'walking', 'short_commute')",
        "room_sharing_willing": "boolean",
        "roommate_preference_id": "string | null",
        "accessibility_needs": "array",
        "accessibility_notes": "string",
        "dietary_restrictions": "array",
        "explore_restaurants": "boolean"
      },
      "preferences_source": "string ('user_provided' | 'default')"
    }
  ]
}
```

## Example Payload

### Complete NYC Example
```json
{
  "trip_id": "demo-123",
  "trip_basics": {
    "trip_name": "Client visit in NYC",
    "destination_city": "New York, NY",
    "destination_venue": "Roosevelt Island Convention Center",
    "start_date": "2025-01-15",
    "end_date": "2025-01-17",
    "trip_purpose": "business",
    "intent_text": "Need to visit client in NYC next month"
  },
  "constraints": {
    "total_budget": 3000,
    "budget_per_person": 1500,
    "autonomy_level": "suggest_only",
    "policy_guidelines": null
  },
  "survey_config": {},
  "travelers": [
    {
      "name": "Eric Wong",
      "email": "eric@company.com",
      "role": "Account Manager",
      "attendance": "required",
      "preferences": {
        "airport_flexibility": "home_only",
        "departure_time_pref": "morning",
        "arrival_time_pref": "afternoon",
        "comfort_vs_cost": 50,
        "hotel_distance_pref": "walking",
        "room_sharing_willing": false,
        "roommate_preference_id": null,
        "accessibility_needs": [],
        "accessibility_notes": "",
        "dietary_restrictions": [],
        "explore_restaurants": false
      },
      "preferences_source": "default"
    }
  ]
}
```

## Validation Rules

The Edge Function validates the following required fields before calling Flowise:

1. **destination** - Must be present and not "TBD"
2. **start_date** - Must be present
3. **end_date** - Must be present
4. **travelers** - Array must have at least one traveler

If any required field is missing, the Edge Function returns a `400` error with details:
```json
{
  "error": "Please complete trip basics before generating itineraries",
  "missing_fields": ["destination", "start_date"],
  "details": "The following required fields are missing: destination, start_date. Please provide these details before generating itineraries."
}
```

## Expected Flowise Response

Flowise should return itineraries in one of these formats:

### Format 1: Direct itineraries field
```json
{
  "itineraries": [...]
}
```

### Format 2: Text field with JSON
```json
{
  "text": "{\"itineraries\": [...]}"
}
```

### Format 3: Other fields
```json
{
  "json": { "itineraries": [...] }
}
```
or
```json
{
  "output": { "itineraries": [...] }
}
```

## Itinerary Response Format

Each itinerary object should have:

```json
{
  "id": "option-1",
  "option_label": "Cost Saver",
  "title": "Budget Friendly Option",
  "total_cost": 1250,
  "budget_percentage": 83,
  "policy_compliant": true,
  "features": ["Direct flights", "Walking distance to venue"],
  "flight_summary": {
    "airline": "Delta",
    "departure": "SFO",
    "arrival": "JFK",
    "departure_time": "6:00 AM",
    "arrival_time": "2:30 PM",
    "duration": "5h 30m",
    "stops": 0,
    "flight_number": "DL123",
    "cost": 450
  },
  "hotel_summary": {
    "name": "Hilton Manhattan East",
    "distance_to_venue_miles": "0.5 mi",
    "rating": "4.2",
    "cost_per_night": 220,
    "num_nights": 2,
    "num_rooms": 1,
    "total_cost": 440,
    "amenities": ["WiFi", "Breakfast", "Gym"]
  }
}
```

## Logging

The Edge Function provides comprehensive logging:

1. **FLOWISE REQUEST PAYLOAD STRUCTURE** - Summary of payload fields
2. **FLOWISE API REQUEST** - Exact request being sent to Flowise
3. **RAW ITINERARIES FROM FLOWISE** - Raw response from Flowise
4. **MAPPED ITINERARIES** - Processed itineraries with all fields

Check the Edge Function logs to verify the exact payload being sent and received.

## Testing

To test with the NYC example:
1. Create a trip with:
   - Destination: "New York, NY"
   - Dates: "2025-01-15" to "2025-01-17"
   - 1 traveler
2. Trigger itinerary generation
3. Check logs for the complete payload structure
4. Verify Flowise receives and processes the JSON correctly

## Last Updated
December 3, 2025