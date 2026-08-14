# 🚀 WorkTrip Autopilot - Backend Integration Plan

**Status**: In Progress  
**Last Updated**: January 21, 2026  
**Created By**: AI Assistant based on Eric's implementation

---

## 📊 Current Status Assessment

### ✅ What's Working (Backend Already Connected)

#### 1. **Supabase Connection** ✅
- **Status**: ACTIVE and WORKING
- **Project**: `uynzzsvnjviopyazkrzc.supabase.co`
- **Location**: `/utils/supabase/info.tsx`
- **Keys**: Both project ID and anon key configured

#### 2. **Backend API Server** ✅
- **Framework**: Hono (Edge Functions)
- **Location**: `/supabase/functions/server/index.tsx`
- **Status**: Fully functional with comprehensive endpoints

**Available Endpoints:**
```
POST   /make-server-97df1df1/trips                              - Create trip
GET    /make-server-97df1df1/trips/:tripId                      - Get trip details
PUT    /make-server-97df1df1/trips/:tripId                      - Update trip
DELETE /make-server-97df1df1/trips/:tripId                      - Delete trip
POST   /make-server-97df1df1/trips/:tripId/generate-itineraries - Generate options
POST   /make-server-97df1df1/trips/:tripId/confirm-booking      - Confirm booking
GET    /make-server-97df1df1/trips/:tripId/preferences          - Get all preferences
GET    /make-server-97df1df1/trips/:tripId/preferences/:id      - Get traveler pref
PUT    /make-server-97df1df1/trips/:tripId/preferences/:id      - Save traveler pref
GET    /make-server-97df1df1/trips/:tripId/expenses             - Get expenses
POST   /make-server-97df1df1/trips/:tripId/expenses             - Create expense
POST   /make-server-97df1df1/trips/:tripId/expenses/upload-receipt - OCR receipt
```

#### 3. **Data Storage** ✅
- **KV Store**: Storing trip data (key-value storage in Supabase)
  - Format: `trip:{tripId}` → Full trip object with itineraries
  - Format: `preferences:{tripId}:{travelerId}` → Traveler preferences
  - **Note**: KV Store is in-memory, not persistent long-term storage

- **Supabase Table**: `expenses` table (PERSISTENT)
  - Columns: id, trip_id, merchant, amount, date, category, traveler, receipt_url, policy_status
  - Has RLS (Row Level Security) enabled
  - Migration: `/supabase/migrations/create_expenses_table.sql`

#### 4. **AI Integration (Flowise)** ✅
- **Itinerary Generation**: Flowise API for creating 3 booking options
- **Receipt OCR**: Flowise API for extracting receipt data
- **Smart Fallback**: Automatically uses `generateMockItineraries()` when Flowise unavailable
- **Environment Variables Required**:
  - `FLOWISE_API_URL` - Flowise API endpoint
  - `FLOWISE_API_KEY` - Authorization key
  - `FLOWISE_FLOW_ID` - Chatflow ID for itinerary generation
  - `EXPENSE_FLOWISE_API_URL` - Receipt processing endpoint
  - `EXPENSE_FLOWISE_FLOW_ID` - Chatflow ID for receipt OCR
  - `EXPENSE_FLOWISE_API_KEY` - Receipt processing auth key

#### 5. **Current User Flow Working** ✅
- Intent Capture → Parse user text → Create trip in KV
- Agent Working → Call Flowise to generate 3 itinerary options (OR use mock)
- Review & Approve → Display 3 options with dynamic switching
- Edit Itinerary → (UI complete, needs backend integration)
- Confirm & Book → Store selected itinerary ID + generate confirmation codes
- Trip Overview → Display booked trip details
- Expenses → Upload receipts, OCR with Flowise, store in Supabase table

---

## ❌ What's NOT Implemented (Your Work)

### 1. **Real Flight APIs** ❌
**Current State**: Using mock data in `generateMockItineraries()`
- Mock flight summaries: "Economy flights with layovers", "Direct flights", etc.
- No actual flight search
- No real pricing
- No real availability

**What's Needed**:
- Flight search API integration
- Real-time pricing
- Seat availability
- Booking capabilities
- Fare rules and restrictions

### 2. **Real Hotel APIs** ❌
**Current State**: Using mock data in `generateMockItineraries()`
- Mock hotel summaries: "Budget-friendly hotels", "Moderate hotels", etc.
- No actual hotel search
- No real pricing
- No room availability

**What's Needed**:
- Hotel search API integration
- Real-time pricing
- Room availability
- Amenities and ratings
- Booking capabilities

### 3. **Persistent Trip Database** ⚠️
**Current State**: Using KV Store (temporary, in-memory)
- Trips stored as `trip:{tripId}` in KV
- Works for demos but NOT production-ready
- Data can be lost on server restart
- Cannot query/filter trips easily

**What's Needed**:
- Create `trips` table in Supabase
- Create `itineraries` table in Supabase
- Create `travelers` table in Supabase
- Migrate from KV Store to proper database
- Add indexes for performance
- Add RLS policies for security

### 4. **Real Booking Integration** ❌
**Current State**: Generates fake confirmation codes
```typescript
confirmations = {
  flight: `FLT-${crypto.randomUUID().substring(0, 8).toUpperCase()}`,
  hotel: `HTL-${crypto.randomUUID().substring(0, 8).toUpperCase()}`,
}
```

**What's Needed**:
- Actual flight booking API calls
- Actual hotel booking API calls
- Real confirmation numbers
- Payment processing
- Booking cancellation/modification

---

## 🎯 Phase 1: Test Current Setup (DO THIS NOW)

### Test 1: Verify Supabase Connection
**Goal**: Confirm backend is accessible

**Steps**:
1. Create a new trip through the UI
2. Check browser Network tab for API calls
3. Verify response from `/make-server-97df1df1/trips`
4. Expected: Trip created with ID returned

**Success Criteria**: 
- ✅ API call returns 200 status
- ✅ Trip object returned with id, trip_name, destination
- ✅ No CORS errors

### Test 2: Verify Itinerary Generation
**Goal**: Confirm Flowise is working OR mock data is being used

**Steps**:
1. Complete trip creation flow
2. Wait for "Agent Working" screen to finish
3. Check Network tab for `/generate-itineraries` call
4. On "Review & Approve" screen, verify 3 options appear

**Success Criteria**:
- ✅ 3 itinerary options displayed
- ✅ Each has title, cost, features
- ✅ Can switch between options
- ✅ Check console for Flowise error OR mock data warning

### Test 3: Verify Expense Tracking
**Goal**: Confirm Supabase table is working

**Steps**:
1. Navigate to Expenses screen
2. Upload a receipt (or create manual expense)
3. Check Network tab for `/expenses` POST call
4. Verify expense appears in table

**Success Criteria**:
- ✅ Expense saved to database
- ✅ Receipt URL stored
- ✅ Can view expense in table

### Test 4: Data Persistence Check
**Goal**: See if trips are being saved to KV Store

**Steps**:
1. Create a trip and note the Trip ID from Network tab
2. Refresh the page
3. Try to navigate to that trip (if possible)

**Expected Behavior**:
- ⚠️ Trip data may be lost on refresh (KV Store limitation)
- ⚠️ This confirms we need database migration

---

## 🔍 Phase 2: Choose Your APIs (NEXT STEP)

### Recommended Flight APIs

#### Option A: **Amadeus API** (RECOMMENDED) ⭐
**Why Choose This**:
- Most comprehensive corporate travel API
- Excellent documentation
- Free tier available (test mode)
- Used by major travel companies
- Includes flights, hotels, car rentals

**Pricing**:
- Free Test Environment (1,000 requests/month)
- Production: Pay-as-you-go (varies by endpoint)
- Flight Search: ~$0.03 per search
- Flight Booking: ~$2.50 per booking

**Setup Complexity**: Medium
**Integration Time**: 2-3 days

**Links**:
- Website: https://developers.amadeus.com/
- Flight Search API: https://developers.amadeus.com/self-service/category/flights
- Hotel Search API: https://developers.amadeus.com/self-service/category/hotels

---

#### Option B: **Duffel API** (MODERN CHOICE)
**Why Choose This**:
- Modern, developer-friendly API
- Excellent TypeScript/JavaScript SDKs
- Clear pricing
- Great for startups
- Good for NDC (New Distribution Capability) content

**Pricing**:
- Free testing in sandbox
- Production: Commission-based (3-5% of booking value)
- More expensive than Amadeus but simpler integration

**Setup Complexity**: Low
**Integration Time**: 1-2 days

**Links**:
- Website: https://duffel.com/
- Docs: https://duffel.com/docs

---

#### Option C: **Skyscanner API** (LIMITED)
**Why Choose This**:
- Great for flight search/comparison
- Consumer-focused (not specifically corporate)
- No booking capabilities (search only)

**Pricing**:
- Requires partnership/approval
- Not always available for new developers

**Setup Complexity**: Medium
**Integration Time**: 2 days

**NOT RECOMMENDED** because you need booking, not just search.

---

### Recommended Hotel APIs

#### Option A: **Amadeus Hotel APIs** (RECOMMENDED) ⭐
**Why Choose This**:
- Same platform as flights (unified integration)
- Hotel search, booking, and management
- Excellent coverage worldwide

**Pricing**:
- Included with Amadeus account
- Hotel Search: ~$0.015 per search
- Hotel Booking: ~$1.50 per booking

---

#### Option B: **Booking.com API**
**Why Choose This**:
- Largest hotel inventory
- Requires partnership program
- More complex approval process

**NOT RECOMMENDED** for MVP due to approval requirements.

---

## ✅ My Recommendation: AMADEUS

**Use Amadeus for BOTH flights and hotels**

**Reasons**:
1. ✅ Single API integration (flights + hotels)
2. ✅ Free test environment
3. ✅ Corporate travel focus
4. ✅ Excellent documentation
5. ✅ Used by enterprise companies
6. ✅ Booking capabilities included
7. ✅ Fair pricing

**Next Steps**:
1. Sign up at https://developers.amadeus.com/
2. Get API credentials (Client ID + Client Secret)
3. Test in sandbox environment
4. Integrate flight search endpoint
5. Integrate hotel search endpoint
6. Replace mock data in `generateItineraries.tsx`

---

## 📋 Phase 3: Integration Roadmap

### Week 1: Setup & Testing
- [ ] Sign up for Amadeus API
- [ ] Get test credentials
- [ ] Test authentication
- [ ] Test flight search endpoint
- [ ] Test hotel search endpoint

### Week 2: Flight Integration
- [ ] Create `/utils/amadeusApi.ts` helper
- [ ] Implement flight search function
- [ ] Implement flight pricing function
- [ ] Implement flight booking function
- [ ] Update `generateItineraries.tsx` to use real data
- [ ] Test with real searches

### Week 3: Hotel Integration
- [ ] Implement hotel search function
- [ ] Implement hotel booking function
- [ ] Update `generateItineraries.tsx` to use real data
- [ ] Test combined flight + hotel searches

### Week 4: Database Migration
- [ ] Create `trips` table migration
- [ ] Create `itineraries` table migration
- [ ] Create `travelers` table migration
- [ ] Migrate code from KV Store to tables
- [ ] Test data persistence

### Week 5: Polish & Testing
- [ ] Handle API errors gracefully
- [ ] Add loading states
- [ ] User testing with real data
- [ ] Fix any issues

---

## 🧪 Testing Checklist

### Before Real API Integration
- [ ] All UI flows work with mock data
- [ ] Can create trips successfully
- [ ] Can view 3 itinerary options
- [ ] Can switch between options
- [ ] Can book a trip
- [ ] Can view booked trip
- [ ] Can add expenses

### After Real API Integration
- [ ] Flight search returns real results
- [ ] Pricing matches market rates
- [ ] Hotel search returns real results
- [ ] Can handle API errors (no results, timeout, etc.)
- [ ] Loading states display properly
- [ ] Booking confirmation codes are real
- [ ] Data persists after refresh

---

## 📝 Environment Variables Needed

### Current (Already Set)
```bash
SUPABASE_URL=https://uynzzsvnjviopyazkrzc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[your-key]
FLOWISE_API_URL=[your-flowise-url]
FLOWISE_API_KEY=[your-flowise-key]
FLOWISE_FLOW_ID=[your-flow-id]
EXPENSE_FLOWISE_API_URL=[your-flowise-url]
EXPENSE_FLOWISE_FLOW_ID=[your-expense-flow-id]
EXPENSE_FLOWISE_API_KEY=[your-flowise-key]
```

### To Add (For Amadeus)
```bash
AMADEUS_API_KEY=[your-client-id]
AMADEUS_API_SECRET=[your-client-secret]
AMADEUS_ENVIRONMENT=test  # or 'production'
```

---

## 🎯 Summary: Your Action Plan

### TODAY (Phase 1 - Testing)
1. ✅ Read this document
2. ✅ Test trip creation in the UI
3. ✅ Verify 3 options appear on Review & Approve
4. ✅ Check if Flowise is working or using mock data
5. ✅ Test expense tracking

### THIS WEEK (Phase 2 - API Selection)
1. 📝 Sign up for Amadeus API account
2. 🔑 Get test credentials
3. 📖 Read Amadeus documentation
4. 🧪 Test authentication endpoint
5. 🧪 Test flight search endpoint

### NEXT WEEK (Phase 3 - Integration)
1. 🔧 Create Amadeus helper functions
2. 🔧 Replace mock data with real API calls
3. 🧪 Test with real searches
4. 🐛 Debug and refine

---

## 🆘 Support

If you encounter issues:
1. Check Supabase logs (Supabase Dashboard → Logs → Edge Functions)
2. Check browser console for errors
3. Check Network tab for failed API calls
4. Review this document for troubleshooting

---

**Ready to proceed?** Let me know when you've tested the current setup and I'll help you integrate Amadeus!
