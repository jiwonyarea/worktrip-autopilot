# Flowise Error Fix - Model Configuration Error

## Problem
The application was encountering a 500 Internal Server Error from Flowise with the message:
```
404 No endpoints found for x-ai/grok-4.1-fast:free
```

This error occurs when the Flowise chatflow is configured to use an AI model that is not available or properly configured.

## Root Cause
- The Flowise chatflow was configured to use `x-ai/grok-4.1-fast:free` model
- This model endpoint is either not available, not properly configured, or the API credentials are incorrect
- The application had no fallback mechanism for development/demo purposes

## Solution Implemented

### 1. Backend Error Detection
Updated `/supabase/functions/server/generateItineraries.tsx` to detect model configuration errors:

```typescript
if (!flowiseResponse.ok) {
  const errorText = await flowiseResponse.text();
  
  // Check if this is a model configuration error
  const isModelConfigError = errorText.includes("404 No endpoints found") || 
                              errorText.includes("No endpoints found for");
  
  if (isModelConfigError) {
    // Use mock data fallback
  }
}
```

### 2. Mock Data Fallback
When a model configuration error is detected, the system automatically generates mock itineraries:

```typescript
function generateMockItineraries(
  tripName: string, 
  destination: string, 
  startDate: string, 
  endDate: string, 
  travelerCount: number
): any[]
```

**Mock Itineraries Generated:**
1. **Cost-Saving Itinerary**
   - Economy flights with layovers
   - Budget-friendly hotels
   - Public transportation
   - Cost: $1000 per traveler

2. **Balanced Itinerary**
   - Direct flights with some layovers
   - Moderate hotels with private rooms
   - Mix of rental cars and public transport
   - Cost: $2000 per traveler

3. **Time-Saving Itinerary**
   - Direct flights with minimal layovers
   - Luxury hotels
   - Private cars and airport transfers
   - Cost: $3000 per traveler

### 3. Frontend Warning
Updated `/components/screens/AgentWorking.tsx` to show a user-friendly toast notification:

```typescript
if (data.mock_data && data.warning) {
  toast.info("Using Demo Data", {
    description: "AI model is not configured. Showing sample itineraries for demo purposes.",
    duration: 6000,
  });
}
```

### 4. Console Warnings
Added clear console warnings to help developers identify the issue:

```
⚠️ Flowise model configuration error detected. Using mock data fallback.
To fix: Update your Flowise chatflow to use an available AI model.
✅ Mock itineraries stored successfully
```

## How to Fix the Root Cause

### Option 1: Update Flowise Chatflow (Recommended)
1. Log into your Flowise instance
2. Open your chatflow (ID from `FLOWISE_FLOW_ID` env variable)
3. Update the LLM node to use an available model:
   - OpenAI models (requires API key): `gpt-4`, `gpt-3.5-turbo`
   - Anthropic models (requires API key): `claude-3-opus`, `claude-3-sonnet`
   - Local models: `ollama/llama2`, `ollama/mistral`
4. Save and deploy the chatflow

### Option 2: Use OpenRouter (Free Models Available)
1. Sign up for OpenRouter: https://openrouter.ai/
2. Get an API key
3. Update your Flowise LLM node to use OpenRouter
4. Select a free model like:
   - `mistralai/mistral-7b-instruct:free`
   - `google/gemma-7b-it:free`
   - `meta-llama/llama-3-8b-instruct:free`

### Option 3: Continue with Mock Data
The application will continue to work with mock data for demo purposes. This is useful for:
- Local development
- Demo presentations
- Testing UI/UX without AI costs

## Environment Variables
Make sure these are set in your Supabase Edge Function:

```
FLOWISE_API_URL=https://your-flowise-instance.com/api/v1
FLOWISE_API_KEY=your-api-key (optional, depends on your setup)
FLOWISE_FLOW_ID=your-chatflow-id
```

## Testing the Fix

### 1. Verify Mock Data Works
```bash
# Trigger itinerary generation
# Should see mock data with warning toast
```

### 2. Check Console Logs
Look for:
```
⚠️ Flowise model configuration error detected. Using mock data fallback.
✅ Mock itineraries stored successfully
```

### 3. Verify UI Shows Warning
User should see:
- Toast notification: "Using Demo Data"
- Itineraries display normally (3 options)
- Can proceed through the flow without errors

## Response Format

### Success with Mock Data
```json
{
  "itineraries": [
    {
      "id": "option-1",
      "option_label": "cost_saver",
      "title": "Cost-Saving Itinerary",
      "total_cost": 2000,
      "budget_percentage": 50,
      "policy_compliant": true,
      "features": ["Cost-Effective", "Budget-Friendly"],
      "details": {
        "flight_summary": "Economy flights with layovers",
        "hotel_summary": "Budget-friendly hotels with shared rooms",
        "ground_transport_summary": "Public transportation and carpooling",
        "food_summary": "Economic dining options and meal kits",
        "preference_satisfaction_score": 75
      }
    },
    // ... 2 more options
  ],
  "warning": "Using demo itineraries. Flowise AI model is not configured...",
  "mock_data": true
}
```

## Files Modified
- `/supabase/functions/server/generateItineraries.tsx` - Added error detection and mock data generation
- `/components/screens/AgentWorking.tsx` - Added warning toast for mock data
- `/FLOWISE_ERROR_FIX.md` - This documentation

## Related Documentation
- `/FLOWISE_PAYLOAD_CONTRACT.md` - Flowise API payload structure
- `/AGENTIC_FLOW_NAVIGATION.md` - Overall flow architecture
- `/BACKEND_INTEGRATION.md` - Backend integration guide

## Benefits of This Fix
✅ **No Breaking Errors**: Application continues to work even when AI model is misconfigured
✅ **Clear Feedback**: Users and developers get clear warnings about the issue
✅ **Demo Ready**: Can demo the application without requiring expensive AI API keys
✅ **Development Friendly**: Developers can work on UI/UX without backend dependencies
✅ **Easy to Fix**: Clear instructions on how to properly configure Flowise

## Limitations
- Mock data is static and doesn't consider actual trip preferences
- Mock itineraries use simplified cost calculations
- No real AI optimization or personalization
- Should only be used for development/demo, not production
