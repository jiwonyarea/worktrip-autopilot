# Expense Receipt Processing Setup Guide

This guide will help you set up the complete backend infrastructure for expense receipt processing with AI-powered data extraction.

## Prerequisites

You need to configure three Edge Function secrets in your Supabase project:

1. `EXPENSE_FLOWISE_API_URL` - Your Flowise API base URL (e.g., `https://cloud.flowiseai.com/api/v1`)
2. `EXPENSE_FLOWISE_FLOW_ID` - The chatflow ID for receipt extraction (e.g., `4636f7ed-4899-4c93-adb1-4a9d3ed58b3`)
3. `EXPENSE_FLOWISE_API_KEY` - Your Flowise API key (optional, used as Bearer token)

### Setting Secrets in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions** → **Manage Secrets** (or **Project Settings** → **Edge Functions**)
3. Add the three secrets listed above

## Automatic Setup

The infrastructure will be set up automatically when you deploy the Edge Functions. However, you may need to manually configure storage policies.

## Manual Setup Steps

### 1. Create the Expenses Table

Run the migration SQL in the Supabase SQL Editor:

```bash
# Navigate to SQL Editor in Supabase Dashboard and run:
/supabase/migrations/create_expenses_table.sql
```

Or use the Supabase CLI:

```bash
supabase db push
```

### 2. Create the Receipts Storage Bucket

1. Go to **Storage** in your Supabase Dashboard
2. Click **Create a new bucket**
3. Name it `receipts`
4. Check **Public bucket** (so receipt URLs are publicly accessible)
5. Set **File size limit** to `10485760` (10MB)
6. Set **Allowed MIME types**:
   - `image/jpeg`
   - `image/jpg`
   - `image/png`
   - `image/gif`
   - `application/pdf`

### 3. Configure Storage Policies

In the Storage section, add these policies for the `receipts` bucket:

**Policy 1: Allow public read**
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'receipts');
```

**Policy 2: Allow authenticated upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'receipts' AND
  (auth.role() = 'authenticated' OR auth.role() = 'anon')
);
```

## Deployed Edge Functions

### 1. `processReceipt`

Processes uploaded receipts using Flowise AI extraction.

**Endpoint**: `/functions/v1/processReceipt`

**Method**: POST

**Body**:
```json
{
  "tripId": "trip-uuid",
  "receiptUrl": "https://your-project.supabase.co/storage/v1/object/public/receipts/..."
}
```

**Response**:
```json
{
  "expense": {
    "id": "uuid",
    "trip_id": "trip-uuid",
    "merchant": "Starbucks",
    "amount": 12.50,
    "date": "2024-10-05",
    "category": "Food",
    "traveler": "John Doe",
    "policy_status": "compliant",
    "receipt_url": "https://...",
    "created_at": "2024-10-05T10:30:00Z"
  }
}
```

### 2. `setupExpenses`

One-time setup function to create tables and buckets (optional).

**Endpoint**: `/functions/v1/setupExpenses`

**Method**: POST

## Flowise Configuration

Your Flowise chatflow should:

1. Accept a JSON payload with:
   ```json
   {
     "trip_id": "string",
     "receipt_url": "string"
   }
   ```

2. Download the receipt from the URL
3. Extract receipt data using OCR/AI
4. Return a single CSV line (no header) in this format:
   ```
   date,merchant,category,traveler,amount,policy_status
   ```

Example output:
```
2024-10-05,Starbucks,Food,John Doe,12.50,compliant
```

## Testing

1. Upload a test receipt through the Expense Report UI
2. Check the browser console for detailed logs
3. Verify the expense appears in the table
4. Check the `expenses` table in Supabase to confirm data was saved

## Troubleshooting

### "Failed to upload to storage"
- Verify the `receipts` bucket exists and is public
- Check storage policies allow upload

### "Failed to process receipt"
- Verify Flowise secrets are set correctly
- Check the Edge Function logs in Supabase Dashboard
- Ensure Flowise API is accessible from Supabase Edge Functions

### "No expense data returned"
- Check Flowise is returning data in the correct CSV format
- Review the `processReceipt` Edge Function logs for parsing errors

## Production Considerations

1. **Row Level Security**: Update RLS policies to restrict access based on user authentication
2. **Storage Policies**: Restrict upload access to authenticated users only
3. **Error Handling**: Add retry logic for failed Flowise API calls
4. **Validation**: Add more robust validation for extracted expense data
5. **Rate Limiting**: Implement rate limiting on the Edge Function
