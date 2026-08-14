# Flowise Response Format (NEW - December 3, 2025)

## Overview
This document describes the **current** Flowise response format with string-based summaries.

## Flowise Response Structure

Flowise returns JSON with an `itineraries` array (either directly or inside a `text` field):

```json
{
  "itineraries": [
    {
      "option": "Cost Saver",
      "total_cost": 2500,
      "budget_percentage": 83.3,
      "policy_compliant": true,
      "flight_summary": "Roundtrip economy PIT-JFK on Spirit Airlines, estimated $180 total (direct flights).",
      "hotel_summary": "Pod Times Square – 43 nights, about $90/night with long-term discount, Midtown Manhattan, near subway.",
      "ground_transport_summary": "NYC subway MetroCard ($34/week), walking where possible.",
      "food_summary": "Budget meals at food trucks and delis, ~$30/day.",
      "features": [
        "Prices estimated – real-time flight API unavailable",
        "Max budget efficiency",
        "Basic amenities"
      ],
      "preference_satisfaction_score": 8
    }
  ]
}
```

## Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `option` | string | Option name (e.g., "Cost Saver", "Balanced", "Time Saver") |
| `total_cost` | number | Total cost for the trip |
| `budget_percentage` | number | Percentage of budget used |
| `policy_compliant` | boolean | Whether this option is policy compliant |
| `flight_summary` | **string** | Human-readable flight summary |
| `hotel_summary` | **string** | Human-readable hotel summary |
| `ground_transport_summary` | **string** | Human-readable ground transport summary |
| `food_summary` | **string** | Human-readable food summary |
| `features` | string[] | Array of feature highlights |
| `preference_satisfaction_score` | number | Score from 0-10 |

## Important: Summaries are STRINGS

All summary fields (`flight_summary`, `hotel_summary`, `ground_transport_summary`, `food_summary`) are **strings**, not objects.

## How the Backend Maps This

The Edge Function maps Flowise responses to the Supabase storage format:

```typescript
{
  id: "opt-0",                    // Generated from index
  option_label: "cost_saver",     // Snake_case version of "option"
  title: "Cost Saver",            // Display title from "option"
  total_cost: 2500,
  budget_percentage: 83.3,
  policy_compliant: true,
  features: [...],
  details: {
    flight_summary: "Roundtrip economy PIT-JFK...",
    hotel_summary: "Pod Times Square – 43 nights...",
    ground_transport_summary: "NYC subway MetroCard...",
    food_summary: "Budget meals at food trucks...",
    preference_satisfaction_score: 8
  }
}
```

## Complete Example

### Flowise Response
```json
{
  "itineraries": [
    {
      "option": "Cost Saver",
      "total_cost": 2500,
      "budget_percentage": 83.3,
      "policy_compliant": true,
      "flight_summary": "Roundtrip economy PIT-JFK on Spirit Airlines, estimated $180 total (direct flights).",
      "hotel_summary": "Pod Times Square – 43 nights, about $90/night with long-term discount, Midtown Manhattan, near subway.",
      "ground_transport_summary": "NYC subway MetroCard ($34/week), walking where possible.",
      "food_summary": "Budget meals at food trucks and delis, ~$30/day.",
      "features": [
        "Prices estimated – real-time flight API unavailable",
        "Max budget efficiency",
        "Basic amenities"
      ],
      "preference_satisfaction_score": 8
    },
    {
      "option": "Balanced",
      "total_cost": 3000,
      "budget_percentage": 100.0,
      "policy_compliant": true,
      "flight_summary": "Roundtrip economy PIT-JFK on Delta, estimated $250 total (1 stop each way).",
      "hotel_summary": "Moxy NYC Times Square – 43 nights, about $110/night, Chelsea neighborhood, vibrant area.",
      "ground_transport_summary": "Unlimited subway + occasional Uber, ~$200 total.",
      "food_summary": "Mix of casual dining and groceries, ~$40/day.",
      "features": [
        "Prices estimated – real-time flight API unavailable",
        "Comfortable mid-range",
        "Good location balance"
      ],
      "preference_satisfaction_score": 9
    },
    {
      "option": "Time Saver",
      "total_cost": 4200,
      "budget_percentage": 140.0,
      "policy_compliant": false,
      "flight_summary": "Direct flights PIT-JFK roundtrip: $500 (estimated).",
      "hotel_summary": "Hyatt Place New York/Midtown-South – 43 nights, about $140/night, near Penn Station.",
      "ground_transport_summary": "Private transfers + Uber Black, ~$300 total.",
      "food_summary": "Delivered meals and mid-range spots, ~$50/day.",
      "features": [
        "Prices estimated – real-time flight API unavailable",
        "Priority boarding & lounge",
        "Minimal hassle"
      ],
      "preference_satisfaction_score": 9.5
    }
  ]
}
```

### Stored in Supabase
```json
{
  "trip_id": "abc-123",
  "itineraries": [
    {
      "id": "opt-0",
      "option_label": "cost_saver",
      "title": "Cost Saver",
      "total_cost": 2500,
      "budget_percentage": 83.3,
      "policy_compliant": true,
      "features": [
        "Prices estimated – real-time flight API unavailable",
        "Max budget efficiency",
        "Basic amenities"
      ],
      "details": {
        "flight_summary": "Roundtrip economy PIT-JFK on Spirit Airlines, estimated $180 total (direct flights).",
        "hotel_summary": "Pod Times Square – 43 nights, about $90/night with long-term discount, Midtown Manhattan, near subway.",
        "ground_transport_summary": "NYC subway MetroCard ($34/week), walking where possible.",
        "food_summary": "Budget meals at food trucks and delis, ~$30/day.",
        "preference_satisfaction_score": 8
      }
    },
    {
      "id": "opt-1",
      "option_label": "balanced",
      "title": "Balanced",
      "total_cost": 3000,
      "budget_percentage": 100.0,
      "policy_compliant": true,
      "features": [
        "Prices estimated – real-time flight API unavailable",
        "Comfortable mid-range",
        "Good location balance"
      ],
      "details": {
        "flight_summary": "Roundtrip economy PIT-JFK on Delta, estimated $250 total (1 stop each way).",
        "hotel_summary": "Moxy NYC Times Square – 43 nights, about $110/night, Chelsea neighborhood, vibrant area.",
        "ground_transport_summary": "Unlimited subway + occasional Uber, ~$200 total.",
        "food_summary": "Mix of casual dining and groceries, ~$40/day.",
        "preference_satisfaction_score": 9
      }
    },
    {
      "id": "opt-2",
      "option_label": "time_saver",
      "title": "Time Saver",
      "total_cost": 4200,
      "budget_percentage": 140.0,
      "policy_compliant": false,
      "features": [
        "Prices estimated – real-time flight API unavailable",
        "Priority boarding & lounge",
        "Minimal hassle"
      ],
      "details": {
        "flight_summary": "Direct flights PIT-JFK roundtrip: $500 (estimated).",
        "hotel_summary": "Hyatt Place New York/Midtown-South – 43 nights, about $140/night, near Penn Station.",
        "ground_transport_summary": "Private transfers + Uber Black, ~$300 total.",
        "food_summary": "Delivered meals and mid-range spots, ~$50/day.",
        "preference_satisfaction_score": 9.5
      }
    }
  ]
}
```

## TypeScript Type Definition

```typescript
// Flowise response format
interface FlowiseItinerary {
  option: string;
  total_cost: number;
  budget_percentage: number;
  policy_compliant: boolean;
  flight_summary: string;
  hotel_summary: string;
  ground_transport_summary: string;
  food_summary: string;
  features: string[];
  preference_satisfaction_score: number;
}

// Stored in Supabase
interface StoredItinerary {
  id: string;
  option_label: string;
  title: string;
  total_cost: number;
  budget_percentage: number;
  policy_compliant: boolean;
  features: string[];
  details: {
    flight_summary: string;
    hotel_summary: string;
    ground_transport_summary: string;
    food_summary: string;
    preference_satisfaction_score: number;
  };
}
```

## Last Updated
December 3, 2025
