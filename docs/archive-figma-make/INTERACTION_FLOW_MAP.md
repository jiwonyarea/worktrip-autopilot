# WorkTrip Autopilot - Interaction Flow Map

## Current Application State

Based on your screenshot, you're viewing the **IntentCapture** (home) page which shows:
- Voice/text input field
- Quick suggestion cards (Conference trip, Client visit, Team offsite)
- "My Itinerary" section with booked trips

---

## Navigation Structure

### Top Navigation (AppShell)
Located in: `/components/AppShell.tsx`

**Header Items:**
- Logo: "WorkTrip Autopilot" (Poppins font)
- Nav tabs: Trips | Policies | Expenses
- User profile icon (top right)

**Current Behavior:**
- All nav clicks currently reset to "intent-capture" screen
- No separate Policies or Expenses landing pages implemented yet

---

## Main Trip Booking Flow (6 Steps)

### Step 1: Intent Capture
**File:** `/components/screens/IntentCapture.tsx`
**Route:** `currentScreen = "intent-capture"`

**Features:**
- Voice input support (Siri/microphone)
- Text input field with placeholder example
- 3 quick suggestion cards with pre-filled trip examples
- "My Itinerary" section showing existing booked trips
- View button for each trip

**User Actions:**
- Enter trip details via voice/text (e.g., "book me a trip from Pittsburgh to New York City...")
- Click suggestion card to auto-fill
- Click "Create Trip" button

**Navigation Out:**
- ✅ `onStartPlanning()` → **AgentWorkingSimple**

**State Passed:**
- `tripId` (newly created)
- `trip` object with parsed intent

---

### Step 2: Agent Working
**File:** `/components/screens/AgentWorkingSimple.tsx`
**Route:** `currentScreen = "agent-working-simple"`

**Features:**
- AI processing animation/loading state
- Shows what the agent is doing (parsing intent, searching flights, etc.)
- Auto-progresses when complete

**User Actions:**
- Wait for agent to process (simulated or real AI processing)

**Navigation Out:**
- ✅ `onComplete()` → **ReviewAndApprove**

**State Passed:**
- Continues with `tripId` and `currentTrip`

---

### Step 3: Review & Approve
**File:** `/components/screens/ReviewAndApprove.tsx`
**Route:** `currentScreen = "review-approve"`

**Features:**
- Shows 3 itinerary options (Balanced, Cost-Saver, Time-Saver)
- Flight details with airline logos
- Hotel information with images
- Total cost breakdown
- Option selection cards

**User Actions:**
- Review generated itinerary options
- Select preferred option (Balanced/Cost-Saver/Time-Saver)
- Click "Approve & Continue" or similar button

**Navigation Out:**
- ✅ `onApprove()` → **EditItinerary**
- ✅ `onEditItinerary()` → **EditItinerary** (same destination)
- ✅ `onBack()` → **IntentCapture**

**State Passed:**
- Selected itinerary option ID
- `tripId` continues

---

### Step 4: Edit Itinerary
**File:** `/components/screens/EditItinerary.tsx`
**Route:** `currentScreen = "edit-itinerary"`

**Features:**
- Timeline view with detailed flight/hotel schedule
- Tab navigation: Overview | Expenses
- Option to switch between Balanced/Cost-Saver/Time-Saver
- Flight details (times, airlines, durations)
- Hotel details with check-in/check-out
- Ground transportation details
- WiFi toggle options
- Auto-fill expense toggle

**Sub-component:**
- `EditItineraryExpensesTable.tsx` - Shows expense breakdown when on Expenses tab

**User Actions:**
- Review detailed timeline
- Toggle WiFi/expense options
- Switch between booking options
- Click "Continue to Booking" or similar

**Navigation Out:**
- ✅ `onComplete()` → **ConfirmAndBook**
- ✅ `onBack()` → **ReviewAndApprove**
- ✅ `onBackToHome()` → **IntentCapture**

**State Passed:**
- Selected booking option (balanced/cost-saver/time-saver)
- Expense auto-fill preference
- WiFi selections

---

### Step 5: Confirm and Book
**File:** `/components/screens/ConfirmAndBook.tsx`
**Route:** `currentScreen = "confirm-and-book"`

**Features:**
- Final confirmation page
- Payment details/summary
- Booking confirmation button
- Back to options link

**User Actions:**
- Review final details
- Click "Confirm & Complete Booking"
- Or go back to edit options

**Navigation Out:**
- ✅ `onComplete()` → **TripOverview**
- ✅ `onBack()` → **EditItinerary**

**State Passed:**
- Finalizes booking in database
- Marks trip as "Booked"

---

### Step 6: Trip Overview
**File:** `/components/screens/TripOverview.tsx`
**Route:** `currentScreen = "trip-overview"`

**Features:**
- Completed trip summary
- Booked status badge
- Itinerary details
- Expense tracking widget
- Share trip option
- Budget/spend progress bars

**User Actions:**
- View booked trip details
- Click "View Expenses" 
- Click "New Trip" to start over
- Share trip with team

**Navigation Out:**
- ✅ `onViewExpenses()` → **ExpensesReport**
- ✅ `onNewTrip()` → **IntentCapture**

**State Passed:**
- Completed `tripId` for reference

---

## Additional Screens

### Expenses Report
**File:** `/components/screens/ExpensesReport.tsx`
**Route:** `currentScreen = "expenses"`

**Features:**
- Full expense management view
- Receipt upload capability
- AI-powered receipt processing (Flowise integration)
- Expense categorization
- Budget tracking

**User Actions:**
- Upload receipts
- Review expenses
- Categorize expenses
- Return to trip overview

**Navigation Out:**
- ✅ `onBack()` → **TripOverview**

---

### Unused/Legacy Components

These files exist but are NOT in the current flow:

1. **PreferenceSetup.tsx**
   - Imported in App.tsx but no route defined
   - Was part of old wizard flow
   - Currently unused ❌

2. **TripBasics.tsx**
   - Old wizard step
   - Not in current agentic flow ❌

3. **PeopleAndPolicy.tsx**
   - Old wizard step  
   - Not in current agentic flow ❌

4. **AgentWorking.tsx** (different from AgentWorkingSimple)
   - May be older version ❌

5. **TravelerSurvey.tsx**
   - Has URL parameter support in App.tsx (lines 32-44)
   - But no component file exists
   - Likely for external traveler feedback ❌

---

## Helper Components (Not Standalone Pages)

These are used within other screens:

- **ItineraryDetail.tsx** - Detail view helper
- **ItineraryOptions.tsx** - Option selection cards
- **ItinerarySummaryCard.tsx** - Summary card component
- **ItineraryTimelineView.tsx** - Timeline visualization
- **WizardStepper.tsx** - Step indicator (legacy)
- **StatusBadge.tsx** - Status indicators
- **PolicyCard.tsx** - Policy compliance cards

---

## Flow Diagram

```
┌─────────────────┐
│  IntentCapture  │ (Home - you are here)
│   (Step 1)      │
└────────┬────────┘
         │ onStartPlanning()
         ↓
┌─────────────────┐
│ AgentWorking    │
│   (Step 2)      │
└────────┬────────┘
         │ onComplete()
         ↓
┌─────────────────┐
│ ReviewAndApprove│
│   (Step 3)      │ ←──────┐
└────────┬────────┘        │ onBack()
         │ onApprove()     │
         ↓                 │
┌─────────────────┐        │
│ EditItinerary   │────────┘
│   (Step 4)      │
└────────┬────────┘
         │ onComplete()
         ↓
┌─────────────────┐
│ ConfirmAndBook  │
│   (Step 5)      │
└────────┬────────┘
         │ onComplete()
         ↓
┌─────────────────┐        ┌──────────────┐
│  TripOverview   │───────→│   Expenses   │
│   (Step 6)      │        │    Report    │
└────────┬────────┘        └──────────────┘
         │ onNewTrip()
         ↓
    (Back to Step 1)
```

---

## Potential Issues / Disconnections

### ✅ Connected Properly:
1. Intent Capture → Agent Working → Review → Edit → Confirm → Overview
2. Trip Overview → Expenses Report
3. Back navigation works throughout

### ⚠️ Potential Issues:

1. **Top Navigation doesn't work fully:**
   - "Policies" tab has no destination
   - "Expenses" tab resets to IntentCapture instead of ExpensesReport
   - Clicking any nav item always goes to intent-capture

2. **PreferenceSetup screen orphaned:**
   - Imported but never used
   - Should this be part of onboarding?

3. **TravelerSurvey missing:**
   - URL parameter handler exists (lines 32-44 in App.tsx)
   - But no component file
   - Screen type "traveler-survey" mentioned but not in Screen type union

4. **Itinerary "View" buttons on home page:**
   - "View" buttons in "My Itinerary" section
   - Should these go directly to TripOverview?
   - Currently no click handler visible

---

## Recommended Fixes

### 1. Fix Top Navigation
```typescript
// In App.tsx, update onNavChange handler:
const handleNavChange = (nav: string) => {
  if (nav === "Trips") {
    setCurrentScreen("intent-capture");
  } else if (nav === "Expenses") {
    setCurrentScreen("expenses");
  } else if (nav === "Policies") {
    // Create a policies screen or show modal
  }
};

// Update AppShell call:
<AppShell currentNav="Trips" onNavChange={handleNavChange}>
```

### 2. Add "View" Trip Handler
In IntentCapture.tsx, add click handler for trip cards to navigate to TripOverview with that tripId.

### 3. Decide on PreferenceSetup
Either:
- Remove it if not needed
- Add it as an onboarding step before IntentCapture
- Add it to user settings

---

## Backend Integration Points

Based on your backend files:

1. **Supabase Collections:**
   - Trips table (managed via tripApi.ts)
   - Expenses table (expenses setup)
   - Itineraries stored as JSONB in trips

2. **API Functions:**
   - `createTrip()` - Called in IntentCapture
   - `updateTrip()` - Called when modifying trip
   - `getTrip()` - Called in ReviewAndApprove, TripOverview, etc.

3. **Edge Functions:**
   - `/supabase/functions/processReceipt` - Receipt OCR/AI processing
   - `/supabase/functions/server/generateItineraries` - AI itinerary generation
   - Flowise integration for AI parsing

4. **Intent Parsing:**
   - Voice/text → AI parsing → structured data
   - Extracts: origin, destination, dates, travelers, purpose

---

## Summary

**Total Active Screens: 7**
1. IntentCapture ✅
2. AgentWorkingSimple ✅
3. ReviewAndApprove ✅
4. EditItinerary ✅
5. ConfirmAndBook ✅
6. TripOverview ✅
7. ExpensesReport ✅

**Flow is connected:** All 6 booking steps flow properly with correct navigation handlers.

**Main gaps:**
- Top nav doesn't route to Expenses/Policies properly
- "View" buttons on trip cards need handlers
- PreferenceSetup is orphaned
- TravelerSurvey component missing

Let me know which issue you'd like me to fix first!
