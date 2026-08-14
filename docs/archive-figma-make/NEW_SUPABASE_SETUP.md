# 🚀 Complete New Supabase Project Setup

**Your Situation**: 
- ✅ Created new Supabase project (uynzzsvnjviopyazkrzc)
- ✅ Connected your app to it
- ❌ But the project is empty - no tables, no functions, no data

**What We Need To Do**:
1. Create database tables (expenses, etc.)
2. Deploy Edge Functions
3. Set environment variables
4. Test everything

**Time**: ~15 minutes

---

## 📋 **Step 1: Install & Setup Supabase CLI** (2 minutes)

### Install CLI

**On Mac:**
```bash
brew install supabase/tap/supabase
```

**On Windows (with Scoop):**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Or npm (any OS):**
```bash
npm install -g supabase
```

**Verify installation:**
```bash
supabase --version
```

### Login & Link

```bash
# Login to Supabase
supabase login

# Navigate to your project folder
cd /path/to/your/worktrip-autopilot

# Link to YOUR new project
supabase link --project-ref uynzzsvnjviopyazkrzc
```

**You'll be asked for your database password:**
- This is the password you set when creating the Supabase project
- If you forgot it: Supabase Dashboard → Settings → Database → Reset Password

---

## 🗄️ **Step 2: Create Database Tables** (2 minutes)

Eric created a migration file for the `expenses` table. Let's apply it.

### Check if Migration Exists

```bash
ls supabase/migrations/
```

You should see: `create_expenses_table.sql` or similar

### Apply Migrations

```bash
# Push migrations to your Supabase project
supabase db push
```

**Expected output:**
```
✓ Applying migration create_expenses_table.sql...
✓ Finished supabase db push
```

This creates the `expenses` table with:
- id (uuid, primary key)
- trip_id (text)
- merchant (text)
- amount (numeric)
- date (date)
- category (text)
- traveler (text)
- receipt_url (text)
- policy_status (text)
- created_at (timestamp)

### Verify Tables Were Created

Go to your Supabase Dashboard:
1. https://supabase.com/dashboard
2. Select project: uynzzsvnjviopyazkrzc
3. Click "Table Editor" in sidebar
4. You should see: `expenses` table

---

## 🚀 **Step 3: Deploy Edge Functions** (3 minutes)

Your app has 3 Edge Functions that need to be deployed:

### Deploy All Functions

```bash
# Deploy the main server (handles trips, itineraries, bookings)
supabase functions deploy server

# Deploy receipt processing
supabase functions deploy processReceipt

# Deploy expense setup
supabase functions deploy setupExpenses
```

**Expected output for each:**
```
✓ Deployed Function [name] on project uynzzsvnjviopyazkrzc
Function URL: https://uynzzsvnjviopyazkrzc.supabase.co/functions/v1/[name]
```

### Verify Functions Were Deployed

Go to Supabase Dashboard:
1. Click "Edge Functions" in sidebar
2. You should see 3 functions listed:
   - `server`
   - `processReceipt`
   - `setupExpenses`
3. Each should show "Deployed" status

---

## 🔑 **Step 4: Set Environment Variables** (3 minutes)

Your Edge Functions need environment variables (secrets) to work.

### Required Secrets

You'll need to set these for full functionality. For now, we can skip the Flowise ones (app will use mock data fallback).

### Set Secrets (Optional - For Flowise AI)

If you have Flowise configured:
```bash
supabase secrets set FLOWISE_API_URL="your_flowise_url"
supabase secrets set FLOWISE_API_KEY="your_flowise_key"
supabase secrets set FLOWISE_FLOW_ID="your_flow_id"
supabase secrets set EXPENSE_FLOWISE_API_URL="your_expense_flowise_url"
supabase secrets set EXPENSE_FLOWISE_FLOW_ID="your_expense_flow_id"
supabase secrets set EXPENSE_FLOWISE_API_KEY="your_expense_flowise_key"
```

**Don't have Flowise?** That's okay! The app will automatically use mock data fallback. You can set these up later.

### Verify Secrets

```bash
supabase secrets list
```

You'll see a list of all set secrets.

---

## 🧪 **Step 5: Test Your Setup** (2 minutes)

Now let's verify everything works!

### Test 1: Check Function Health

Open your browser and go to:
```
https://uynzzsvnjviopyazkrzc.supabase.co/functions/v1/server/make-server-97df1df1/health
```

**Expected response:**
```json
{"status":"ok"}
```

### Test 2: Run Backend Tests

Open your app in browser, press F12, and run:
```javascript
backendTests.quickCheck()
```

**Expected output:**
```
✅ SUCCESS: API is accessible
Trip ID: [some-uuid]
Trip Name: API Connection Test
```

### Test 3: Create a Real Trip

In your app:
1. Go to Intent Capture screen
2. Enter: "Book me a trip from Pittsburgh to New York from March 2 to March 5 of 2026 for 1 passenger"
3. Wait for Agent Working screen
4. You should see 3 itinerary options on Review & Approve

**Expected**: App works, shows 3 options with mock data

---

## ✅ **Success Checklist**

After completing all steps, verify:

- [ ] Supabase CLI installed and logged in
- [ ] Project linked: `supabase link --project-ref uynzzsvnjviopyazkrzc`
- [ ] Migrations applied: `expenses` table exists in dashboard
- [ ] Functions deployed: 3 functions visible in dashboard
- [ ] Health check works: `/health` endpoint returns `{"status":"ok"}`
- [ ] Backend test passes: `backendTests.quickCheck()` succeeds
- [ ] Can create trip through UI
- [ ] See 3 options on Review & Approve screen

---

## 🎯 **What You Now Have**

After this setup:

✅ **Database**:
- `expenses` table (for receipt tracking)
- KV Store (for trip data - built into Supabase)

✅ **Backend API** (12 endpoints):
- POST `/trips` - Create trip
- GET `/trips/:id` - Get trip
- POST `/trips/:id/generate-itineraries` - Generate options
- POST `/trips/:id/confirm-booking` - Confirm booking
- GET/POST `/trips/:id/expenses` - Expense tracking
- And more!

✅ **AI Integration**:
- Flowise for itinerary generation (or mock fallback)
- Flowise for receipt OCR (or manual entry)

✅ **Fully Functional App**:
- Can create trips
- Can generate 3 booking options
- Can switch between options
- Can book trips
- Can track expenses

---

## 🚀 **Next Steps: Amadeus Integration**

Now that your backend is set up, you're ready to add real flight/hotel data!

### This Week: Amadeus Setup (30 minutes)
1. Sign up at https://developers.amadeus.com/
2. Create app, get API credentials
3. Test authentication
4. Test flight search
5. Test hotel search

Follow: `/AMADEUS_SETUP_GUIDE.md`

### Next Week: Integration (2-3 hours)
1. Create `/utils/amadeusApi.ts` helper
2. Modify itinerary generation to use real data
3. Test end-to-end
4. Ready for user testing!

---

## 🆘 **Troubleshooting**

### Error: "Failed to push migrations"
**Check**:
1. Database password is correct
2. Project is linked: `supabase link --project-ref uynzzsvnjviopyazkrzc`
3. Migration file exists: `supabase/migrations/create_expenses_table.sql`

**Fix**: Try running `supabase db reset` (warning: destroys all data) then `supabase db push`

### Error: "Function deployment failed"
**Check**:
1. Project is linked
2. You're logged in: `supabase login`
3. Function folder exists: `supabase/functions/server/`

**View logs**:
```bash
supabase functions logs server
```

### Error: "Access token expired" during deployment
**Fix**:
```bash
supabase logout
supabase login
supabase functions deploy server
```

### Backend test still fails after deployment
**Check**:
1. Function is deployed: Go to Supabase Dashboard → Edge Functions
2. Health check works: Visit the `/health` URL in browser
3. Check browser console for actual error message
4. Check function logs: `supabase functions logs server`

**Common issue**: CORS errors
- Make sure you deployed the latest version of the functions
- The server function has CORS enabled for all origins (`origin: "*"`)

---

## 📊 **What's Different From Eric's Setup**

### What You Have (New Project):
- ✅ Clean slate - no old test data
- ✅ YOU have admin access
- ✅ YOU control billing
- ✅ Same codebase, your infrastructure

### What's The Same:
- ✅ All the same code Eric wrote
- ✅ Same functionality
- ✅ Same database schema
- ✅ Same API endpoints

### What You'll Add (This Week):
- 🆕 Amadeus API credentials
- 🆕 Real flight/hotel data
- 🆕 Production-ready configuration

---

## 🎉 **You're In Control Now!**

This is actually BETTER than being connected to Eric's database because:
- ✅ You own all the data
- ✅ You can test freely without breaking Eric's work
- ✅ You can deploy updates anytime
- ✅ You're ready for production when the time comes

---

## ⚡ **Quick Command Summary**

```bash
# One-time setup
supabase login
supabase link --project-ref uynzzsvnjviopyazkrzc

# Deploy everything
supabase db push
supabase functions deploy server
supabase functions deploy processReceipt
supabase functions deploy setupExpenses

# Verify
supabase secrets list
```

Then test in browser console:
```javascript
backendTests.quickCheck()
```

---

**Ready?** Run the commands above and tell me how it goes! 🚀
