# Agentic Flow Navigation Guide

## Overview
The trip creation experience has been restructured into a 3-step agentic flow with the old wizard screens still accessible via "Advanced Setup".

## New Primary Flow (3 Steps)

### Step 1: Intent Capture (`intent-capture`)
**Component:** `IntentCapture.tsx`

**Entry Points:**
- Dashboard → "Plan work trip" button

**Features:**
- Natural language input field
- Template chips (Conference, Client visit, Team offsite)
- Shows interpreted brief with extracted details (event name, city, dates, travelers)

**Exit Points:**
- [Yes, that's right – start planning] → Step 2 (Agent Working Simple)
- [Adjust details] → Advanced Setup (Trip Basics wizard)
- "Or use the step-by-step form" link → Advanced Setup (Trip Basics wizard)

---

### Step 2: Agent Working (`agent-working-simple`)
**Component:** `AgentWorkingSimple.tsx`

**Entry Points:**
- Step 1 → After user confirms intent

**Features:**
- Visual-only status screen
- 4 planning steps with animations:
  1. Collecting preferences 📋
  2. Searching flights ✈️
  3. Finding hotels 🏨
  4. Combining options 🔄
- Automatically progresses to Step 3 after ~7 seconds

**Exit Points:**
- Auto-navigates → Step 3 (Review & Approve)

---

### Step 3: Review & Approve (`review-approve`)
**Component:** `ReviewAndApprove.tsx`

**Entry Points:**
- Step 2 → After agent planning completes

**Features:**
- Trip summary (name, destination, dates, travelers, purpose)
- Recommended itinerary card (left column, larger)
- 2 alternative options (right column, smaller cards)
- Each itinerary shows:
  - Total cost & savings
  - Policy compliance badge
  - Flight details
  - Hotel details

**Exit Points:**
- [Approve & Auto-book] → Trip Overview
- [View details] → Itinerary Detail
- [Adjust details] → Advanced Setup (Trip Basics wizard)

---

## Advanced Setup Flow (Old Wizard - Still Available)

### Access Points:
1. From Step 1 (Intent Capture):
   - "Adjust details" button
   - "Or use the step-by-step form" link
2. From Step 3 (Review & Approve):
   - "Adjust details" button

### Wizard Screens (Sequential):
1. **Trip Basics** (`trip-basics`) - F1.4 in nav
2. **People & Policy** (`people-policy`) - F1.5 in nav
3. **Preferences** (`preferences`) - F1.6 in nav
4. **Traveler Survey** (`traveler-survey`) - F1.7 in nav
5. **Agent Working** (`agent-working`) - F1.8 in nav (full version with traveler status)
6. **Itinerary Options** (`itinerary-options`) - F1.9 in nav
7. **Itinerary Detail** (`itinerary-detail`) - F1.10 in nav
8. **Confirm & Book** (`confirm-book`) - F1.11 in nav
9. **Trip Overview** (`trip-overview`) - F1.12 in nav

---

## Navigation Flow Diagram

```
Dashboard
    |
    v
[Intent Capture] ←──────────────┐
    |                           |
    v                           |
[Agent Working Simple]          |
    |                           |
    v                           |
[Review & Approve] ─────────────┘
    |
    v
Trip Overview
```

### Advanced Path
```
[Intent Capture] ──→ "Adjust details"
[Review & Approve] ─→ "Adjust details"
         |
         v
    Trip Basics
         |
         v
    People & Policy
         |
         v
    Preferences
         |
         v
    Traveler Survey
         |
         v
    Agent Working (Full)
         |
         v
    Itinerary Options
         |
         v
    Itinerary Detail
         |
         v
    Confirm & Book
         |
         v
    Trip Overview
```

---

## Component State Management

### App.tsx State:
- `currentScreen`: Which screen to display
- `currentTripId`: Active trip ID (from backend)
- `tripIntent`: User's natural language input (passed between steps)

### Key Navigation Props:
- **IntentCapture:** `onStartPlanning`, `onAdvancedSetup`
- **AgentWorkingSimple:** `onComplete`
- **ReviewAndApprove:** `onApprove`, `onViewDetails`, `onAdjustDetails`

---

## Quick Navigation Panel

The demo includes a quick navigation panel (bottom-right) with buttons for:
- New agentic flow: Intent, Simple Agent, Review
- Old wizard flow: Basics, People, Prefs, Mobile, Desktop, Traveler Survey, Agent, Options, Detail, Confirm, Overview, Expenses
- Flow 2 (Disruption): All disruption handling screens

---

## Testing the Flow

### Primary Flow Test:
1. Start at Dashboard
2. Click "Plan work trip"
3. Enter a trip description or select a template
4. Click "Continue"
5. Review the interpreted brief
6. Click "Yes, that's right – start planning"
7. Watch the agent planning animation (auto-progresses)
8. Review the recommended itinerary and alternatives
9. Click "Approve & Auto-book"
10. Arrive at Trip Overview

### Advanced Setup Test:
1. Start at Dashboard
2. Click "Plan work trip"
3. Click "Or use the step-by-step form"
4. Should navigate to Trip Basics (old wizard)
5. Progress through wizard steps normally

### Return to Simple Flow Test:
1. From Review & Approve, click "Adjust details"
2. Should navigate to Trip Basics
3. Fill in details and proceed through wizard
4. Complete wizard to return to Trip Overview

---

## Backend Integration Notes

**Current Status:** 
- Backend integration is NOT YET WIRED for the new agentic flow
- The flow is UI-only with mock data
- Existing Supabase backend and Flowise integration remain unchanged

**Future Integration Points:**
1. **Intent Capture:** 
   - POST intent to backend for AI parsing (instead of regex)
   - Store parsed trip details
   
2. **Agent Working Simple:**
   - Call existing `generate-itineraries` endpoint
   - Poll for completion status
   
3. **Review & Approve:**
   - Load itineraries from KV store
   - POST approval to create bookings

---

## Files Created/Modified

### New Files:
- `/components/screens/IntentCapture.tsx`
- `/components/screens/AgentWorkingSimple.tsx`
- `/components/screens/ReviewAndApprove.tsx`
- `/AGENTIC_FLOW_NAVIGATION.md` (this file)

### Modified Files:
- `/App.tsx` - Added new routes and state for agentic flow

### Unchanged Files (Still Available):
- `/components/screens/TripBasics.tsx`
- `/components/screens/PeopleAndPolicy.tsx`
- `/components/screens/PreferenceSetup.tsx`
- `/components/screens/TravelerSurvey.tsx`
- `/components/screens/AgentWorking.tsx` (full version)
- `/components/screens/ItineraryOptions.tsx`
- `/components/screens/ItineraryDetail.tsx`
- `/components/screens/ConfirmAndBook.tsx`
- All backend files (Supabase, Flowise integration)
