# Flowise Setup Guide for WorkTrip Autopilot

## Overview

WorkTrip Autopilot uses Flowise AI to power two main features:
1. **Trip Itinerary Generation** - Creates 3 travel options based on user preferences
2. **Expense Receipt Processing** - Extracts expense data from receipt images

This guide will help you set up your own Flowise account with free OpenRouter models.

---

## Prerequisites

- A Flowise account (Cloud or Self-hosted)
- An OpenRouter account for free AI models
- Access to Eric's Supabase project (uynzzsvnjviopyazkrzc)

---

## Part 1: Get OpenRouter API Key (FREE)

### Step 1: Create OpenRouter Account

1. Go to [https://openrouter.ai/](https://openrouter.ai/)
2. Click "Sign Up" and create an account
3. Navigate to "Keys" in the dashboard
4. Click "Create Key" and copy your API key

### Step 2: Add Free Credits (Optional)

OpenRouter offers several **FREE** models you can use:
- `google/gemini-flash-1.5-8b` (FREE)
- `google/gemini-2.0-flash-exp:free` (FREE)
- `meta-llama/llama-3.2-3b-instruct:free` (FREE)
- `qwen/qwen-2-7b-instruct:free` (FREE)

**Note:** These models are completely free and don't require credits!

---

## Part 2: Set Up Flowise Account

### Option A: Flowise Cloud (Recommended - Easiest)

1. Go to [https://flowiseai.com/](https://flowiseai.com/)
2. Click "Get Started" or "Sign Up"
3. Choose a plan:
   - **Free Tier**: Limited chatflows
   - **Pro Tier**: Recommended for production use
4. Complete registration and verify your email

### Option B: Self-Hosted Flowise (Advanced)

If you prefer to self-host:
```bash
npm install -g flowise
npx flowise start
```

Access at `http://localhost:3000`

---

## Part 3: Create Chatflow #1 - Trip Itinerary Generator

### Step 1: Create New Chatflow

1. Log into your Flowise dashboard
2. Click **"+ Add New"** to create a new chatflow
3. Name it: `WorkTrip Itinerary Generator`

### Step 2: Add OpenRouter Chat Model

1. From the left panel, search for **"ChatOpenRouter"** or **"OpenRouter"**
2. Drag it onto the canvas
3. Configure:
   - **Model Name**: `google/gemini-2.0-flash-exp:free` (or any free model)
   - **OpenRouter API Key**: Paste your OpenRouter API key
   - **Temperature**: `0.7`
   - **Max Tokens**: `4096`

### Step 3: Add Conversation Chain

1. Search for **"Conversation Chain"** or **"LLM Chain"**
2. Drag it onto the canvas
3. Connect the OpenRouter model to the chain

### Step 4: Create System Prompt

Add a **"Prompt Template"** node with this system prompt:

```
You are a corporate travel planning AI assistant for WorkTrip Autopilot.

Your task is to generate 3 travel itinerary options based on the trip details and traveler preferences provided.

INPUT FORMAT:
You will receive a JSON payload with:
- trip_basics: destination, dates, purpose
- constraints: budget, policy guidelines
- travelers: array of travelers with their preferences

OUTPUT REQUIREMENTS:
Return ONLY a valid JSON object with this exact structure:

{
  "itineraries": [
    {
      "option": "Cost Saver",
      "total_cost": 1500,
      "budget_percentage": 50,
      "policy_compliant": true,
      "features": ["Economy flights", "Budget hotels", "Public transport"],
      "flight_summary": "Detailed flight options with times and airlines",
      "hotel_summary": "Hotel recommendations with amenities",
      "ground_transport_summary": "Transportation options",
      "food_summary": "Meal recommendations and costs",
      "preference_satisfaction_score": 85
    },
    {
      "option": "Balanced",
      "total_cost": 2500,
      "budget_percentage": 75,
      "policy_compliant": true,
      "features": ["Direct flights", "Mid-range hotels", "Rental car"],
      "flight_summary": "...",
      "hotel_summary": "...",
      "ground_transport_summary": "...",
      "food_summary": "...",
      "preference_satisfaction_score": 90
    },
    {
      "option": "Time Saver",
      "total_cost": 3500,
      "budget_percentage": 100,
      "policy_compliant": true,
      "features": ["Premium flights", "Business hotels", "Private car"],
      "flight_summary": "...",
      "hotel_summary": "...",
      "ground_transport_summary": "...",
      "food_summary": "...",
      "preference_satisfaction_score": 95
    }
  ]
}

IMPORTANT:
- Return ONLY valid JSON, no markdown code blocks
- Include all 3 options: Cost Saver, Balanced, Time Saver
- Calculate costs based on the number of travelers
- Consider traveler preferences when scoring satisfaction
- Ensure policy compliance for all options
```

### Step 5: Test the Chatflow

1. Click the **"Test"** button (chat icon)
2. Send a test payload:

```json
{
  "trip_id": "test-123",
  "trip_basics": {
    "trip_name": "Q1 Sales Conference",
    "destination_city": "New York",
    "start_date": "2025-03-15",
    "end_date": "2025-03-18",
    "trip_purpose": "conference"
  },
  "constraints": {
    "budget_per_person": 2000,
    "total_budget": 4000,
    "autonomy_level": "guided_flexibility"
  },
  "travelers": [
    {
      "name": "Sarah Chen",
      "email": "sarah@company.com",
      "role": "Organizer",
      "preferences": {
        "departure_time_pref": "morning",
        "comfort_vs_cost": 70
      }
    }
  ]
}
```

3. Verify the AI returns valid JSON with 3 itineraries

### Step 6: Save and Deploy

1. Click **"Save"** in the top right
2. Click **"Deploy"** or **"Get API Endpoint"**
3. **Copy these values**:
   - **API Endpoint URL**: `https://flowiseai-abc123.com/api/v1`
   - **Chatflow ID**: The ID from the URL (e.g., `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)
   - **API Key** (if required): Found in Settings

---

## Part 4: Create Chatflow #2 - Expense Receipt Processor

### Step 1: Create New Chatflow

1. Create another new chatflow
2. Name it: `WorkTrip Receipt Extractor`

### Step 2: Add OpenRouter Vision Model

1. Add **"ChatOpenRouter"** node
2. Configure:
   - **Model Name**: `google/gemini-2.0-flash-exp:free` (supports vision)
   - **OpenRouter API Key**: Your API key
   - **Temperature**: `0.3` (lower for accuracy)
   - **Max Tokens**: `2048`

### Step 3: Create Receipt Extraction Prompt

Add a **"Prompt Template"** with:

```
You are an expense receipt data extraction AI.

Extract ALL expense items from the provided receipt image.

INPUT: A receipt image URL

OUTPUT: Return a CSV format with this structure:

merchant_name,category,amount,date,description
"Starbucks","Food & Beverage",15.50,"2025-01-15","Coffee and breakfast"
"Uber","Transportation",28.00,"2025-01-15","Airport to hotel"

RULES:
1. Extract every line item from the receipt
2. Use these categories: Food & Beverage, Transportation, Lodging, Entertainment, Office Supplies, Other
3. Format dates as YYYY-MM-DD
4. Include merchant name, category, amount, date, and brief description
5. Return ONLY the CSV data, no markdown code blocks
6. If multiple items from same merchant, list separately

Example output:
merchant_name,category,amount,date,description
"Whole Foods","Food & Beverage",45.23,"2025-01-15","Groceries for team dinner"
"Shell Gas Station","Transportation",52.00,"2025-01-15","Fuel for rental car"
```

### Step 4: Configure Image Input

1. Add a **"Document Loader"** or **"URL Loader"** node
2. Connect it to handle the receipt image URL from the payload

### Step 5: Test with Sample Receipt

Test payload:
```json
{
  "trip_id": "test-456",
  "receipt_url": "https://example.com/receipt.jpg"
}
```

### Step 6: Save and Deploy

1. Save the chatflow
2. Deploy and copy the **Chatflow ID**

---

## Part 5: Configure Supabase Secrets

Now that you have your Flowise endpoints, you need to add them to Supabase.

### For Trip Itinerary Generation:

1. Go to Eric's Supabase Dashboard: [https://supabase.com/dashboard/project/uynzzsvnjviopyazkrzc](https://supabase.com/dashboard/project/uynzzsvnjviopyazkrzc)
2. Navigate to **Settings** → **Edge Functions** → **Secrets**
3. Add these 3 secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `FLOWISE_API_URL` | Your Flowise API base URL | `https://flowiseai-abc123.com/api/v1` |
| `FLOWISE_FLOW_ID` | Your Trip Itinerary chatflow ID | `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6` |
| `FLOWISE_API_KEY` | Your Flowise API key (optional) | `sk-flowise-abc123...` |

### For Expense Receipt Processing:

Add these 3 additional secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `EXPENSE_FLOWISE_API_URL` | Your Flowise API base URL | `https://flowiseai-abc123.com/api/v1` |
| `EXPENSE_FLOWISE_FLOW_ID` | Your Receipt Extractor chatflow ID | `b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7` |
| `EXPENSE_FLOWISE_API_KEY` | Your Flowise API key (optional) | `sk-flowise-abc123...` |

### How to Add Secrets in Supabase:

1. Click **"Add new secret"**
2. Enter the **Name** (e.g., `FLOWISE_API_URL`)
3. Enter the **Value** (your Flowise URL)
4. Click **"Add secret"**
5. Repeat for all 6 secrets

---

## Part 6: Test the Integration

### Test Trip Itinerary Generation:

1. Open your WorkTrip Autopilot app
2. Navigate to Flow 1 - Trip Creation
3. Enter a trip intent like:
   ```
   Book me a trip from Pittsburgh to New York City from December 22 to December 30 of 2025 for two passengers. The purpose of this trip is a conference.
   ```
4. Click through to the Agent Working screen
5. Verify that 3 itinerary options are generated

### Test Expense Receipt Processing:

1. Go to Flow 5 - Expenses (if implemented)
2. Upload a receipt image
3. Verify expense data is extracted correctly

---

## Troubleshooting

### Error: "Flowise configuration is missing"

**Solution:** Check that all secrets are added in Supabase Edge Functions settings

### Error: "404 No endpoints found"

**Solution:** 
- Verify your OpenRouter model name is correct
- Use a free model like `google/gemini-2.0-flash-exp:free`
- Check that the model is connected in your Flowise chatflow

### Error: "Network error: Unable to reach Flowise API"

**Solution:**
- Verify your `FLOWISE_API_URL` is correct
- Ensure Flowise Cloud is accessible (not localhost if using cloud Supabase)
- Check firewall settings if self-hosting

### Error: "Invalid response format"

**Solution:**
- Test your chatflow in Flowise UI with the exact payload format
- Ensure the AI returns valid JSON (no markdown code blocks)
- Add instructions in the system prompt: "Return ONLY valid JSON, no markdown"

### Mock Data Appears Instead of AI Results

**Symptom:** App shows "Using Demo Data" toast

**Solution:**
- This means Flowise couldn't be reached or returned an error
- Check Supabase Edge Function logs for details
- Verify all secrets are set correctly
- Test your Flowise endpoint manually with curl:

```bash
curl -X POST "https://your-flowise-url/api/v1/prediction/your-flow-id" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{"question": "{\"trip_basics\":{\"destination_city\":\"New York\"}}"}'
```

---

## Cost Management Tips

### Using Free Models:

1. **Google Gemini Flash** (FREE)
   - Model: `google/gemini-2.0-flash-exp:free`
   - Best for: General itinerary generation
   - Limits: Rate limited but sufficient for testing

2. **Llama 3.2** (FREE)
   - Model: `meta-llama/llama-3.2-3b-instruct:free`
   - Best for: Simple text extraction
   - Limits: Smaller context window

### Monitoring Usage:

1. Check OpenRouter dashboard for usage stats
2. Set up alerts for credit usage
3. Use Flowise analytics to track API calls

---

## Next Steps

Once your Flowise is configured:

1. ✅ Test itinerary generation with various trip types
2. ✅ Test receipt processing with different receipt formats
3. ✅ Monitor Edge Function logs for errors
4. ✅ Optimize system prompts for better results
5. ✅ Consider upgrading to paid models for production use

---

## Additional Resources

- **Flowise Documentation**: [https://docs.flowiseai.com/](https://docs.flowiseai.com/)
- **OpenRouter Models**: [https://openrouter.ai/docs/models](https://openrouter.ai/docs/models)
- **Supabase Edge Functions**: [https://supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)

---

## Support

If you encounter issues:

1. Check the `/supabase/functions/server/generateItineraries.tsx` logs
2. Check the `/supabase/functions/processReceipt/index.ts` logs
3. Review the Flowise chatflow test results
4. Verify OpenRouter API key is valid

**Last Updated:** January 22, 2025
