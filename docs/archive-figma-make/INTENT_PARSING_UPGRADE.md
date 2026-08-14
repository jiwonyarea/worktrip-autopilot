# Intent Parsing Enhancement

## Summary
Enhanced the regex-based natural language parser in `IntentCapture.tsx` to extract **origin city** and **traveler count** from user input, in addition to the existing destination, dates, and trip name extraction. The parser is now **hardened for production** with validation, clamping, error handling, and dev-only logging.

## What Changed

### 1. Origin City Extraction (NEW ✨)
The parser now extracts the origin/departure city from natural language patterns:

**Supported Patterns:**
- `"from Boston to Seattle"` → origin: Boston, destination: Seattle
- `"flying out of SFO to NYC"` → origin: SFO, destination: NYC  
- `"departing LAX for Tokyo"` → origin: LAX, destination: Tokyo
- `"from New York to San Francisco"` → origin: New York, destination: San Francisco

**Implementation:**
- Three regex patterns with priority order (from...to, flying out of...to, departing...for)
- **Priority Logic**: Origin+destination patterns are tried FIRST to prevent destination-only regex from incorrectly parsing
- **Validation**: Filters out non-city words ("home", "office", "work") to avoid false positives
- **Length Check**: Requires at least 2 characters for valid city names
- Falls back to destination-only extraction if no origin pattern is found
- Supports both city names (multi-word like "New York") and airport codes (SFO, LAX, JFK)
- Stored in trip object as `origin_city` field

### 2. Traveler Count Extraction (NEW ✨)
The parser now extracts the number of travelers and creates the appropriate number of traveler records:

**Supported Patterns:**
- Direct numbers: `"3 teammates"`, `"5 people"`, `"4 travelers"`, `"2 coworkers"`
- Team/group of N: `"team of 5"`, `"group of 4"`
- Word numbers: `"solo trip"`, `"three colleagues"`, `"five people"`
- Generic team: `"with my team"` → defaults to 3 travelers
- No mention: defaults to 1 traveler (organizer only)

**Implementation:**
- Four regex patterns with priority fallback logic
- Word number mapping for "solo", "one" through "ten"
- **Smart Number Preference**: When multiple numbers appear (e.g., "3 teammates for a 2 day trip"), prefers number near traveler keywords
- **Normalization**: Ensures positive integer using `Math.max(1, Math.floor())`
- **Clamping**: Limits traveler count between 1-20 to avoid nonsense inputs ("1000 people")
- Backend automatically generates N traveler records (first is organizer, rest are placeholder "Traveler 2", "Traveler 3", etc.)
- Stored in trip object as `travelers_count` and populates `travelers` array

### 3. Backend Integration
Updated `/supabase/functions/server/index.tsx` to:
- Accept and store `origin_city` from parsed overrides
- Accept `travelers_count` and generate N traveler records automatically
- Store both inferred fields (new flow) and traditional fields (backward compatibility)
- Log origin, destination, and traveler count in server console

### 4. Production Hardening (NEW 🛡️)
Added robustness features for real-world usage:

**Error Handling:**
- Wrapped parsing logic in try-catch to prevent crashes on malformed input
- Non-fatal error logging: parsing failures are logged but don't break the flow
- Graceful fallback: if parsing fails, defaults to minimal valid state

**Validation & Normalization:**
- City name validation (min 2 chars, starts with capital letter, not in non-city word list)
- Traveler count normalization (positive integer, clamped 1-20)
- Priority-based pattern matching to avoid conflicts

**Development Logging:**
- Structured console output only in development mode (`process.env.NODE_ENV !== 'production'`)
- Formatted with emoji prefix for easy scanning: `🔍 Intent Parser Output:`
- Shows all parsed fields including fallback indicators like `(not parsed)` and `(defaulting to 1)`
- Suppressed in production builds to avoid console noise

## Test Examples

### Example 1: Full Context
**Input:** `"Book a team of 5 from Boston to Seattle Dec 5-8"`

**Parsed Output:**
```javascript
{
  origin_city: "Boston",
  destination: "Seattle",
  travelers_count: 5,
  dates: { start_date: "2025-12-05", end_date: "2025-12-08" },
  trip_name: "Trip to Seattle"
}
```

**Result:** Creates trip with 5 travelers (Sarah Chen + Traveler 2-5), origin Boston, destination Seattle

---

### Example 2: Client Visit with Airport Codes
**Input:** `"Client visit from SFO to JFK next month for 3 teammates"`

**Parsed Output:**
```javascript
{
  origin_city: "SFO",
  destination: "JFK",
  travelers_count: 3,
  dates: { start_date: "2026-01-15", end_date: "2026-01-17" },
  trip_name: "Client Visit"
}
```

**Result:** Creates trip with 3 travelers, origin SFO, destination JFK, dates in January

---

### Example 3: Generic Team Mention
**Input:** `"Schedule a conference trip to Seattle with my team in January"`

**Parsed Output:**
```javascript
{
  destination: "Seattle",
  travelers_count: 3, // inferred from "team"
  dates: { start_date: "2026-01-15", end_date: "2026-01-17" },
  trip_name: "Conference Trip"
}
```

**Result:** Creates trip with 3 travelers (assumed team size), no origin specified

---

### Example 4: Flying Out Pattern
**Input:** `"Flying out of LAX for Tokyo Dec 10-15 with 4 people"`

**Parsed Output:**
```javascript
{
  origin_city: "LAX",
  destination: "Tokyo",
  travelers_count: 4,
  dates: { start_date: "2025-12-10", end_date: "2025-12-15" },
  trip_name: "Trip to Tokyo"
}
```

**Result:** Creates trip with 4 travelers, origin LAX, destination Tokyo

---

### Example 5: Minimal Input (Backward Compatible)
**Input:** `"Offsite in Austin next month"`

**Parsed Output:**
```javascript
{
  destination: "Austin",
  trip_name: "Team Offsite",
  dates: { start_date: "2026-01-15", end_date: "2026-01-17" }
  // travelers_count: undefined → defaults to 1
  // origin_city: undefined
}
```

**Result:** Creates trip with 1 traveler (organizer only), no origin, destination Austin

## Backward Compatibility

✅ All existing parsing logic remains intact  
✅ Origin and traveler count are optional - defaults work if not provided  
✅ Existing test cases still work (destination-only, dates, trip name)  
✅ No breaking changes to backend schema  
✅ Frontend-only enhancement, no new network calls

## Files Modified

1. `/components/screens/IntentCapture.tsx`
   - Enhanced `parseIntent()` function with origin and traveler extraction
   - Added comprehensive inline test examples in comments
   
2. `/supabase/functions/server/index.tsx`
   - Updated trip creation endpoint to handle `origin_city` and `travelers_count`
   - Auto-generate N traveler records based on parsed count
   - Store origin in both `origin_city` and `inferred_origin_city` fields

## Limitations Still Present

The regex parser still does NOT extract:
- ❌ Budget constraints ("under $2000 per person")
- ❌ Flight preferences ("need direct flights", "prefer morning departures")  
- ❌ Named travelers ("with John and Sarah")
- ❌ Numeric date formats ("12/5-12/8")
- ❌ Ordinal dates ("December 5th-8th")
- ❌ Multi-city itineraries ("Boston to Seattle then Portland")

For these more complex patterns, consider implementing AI-powered parsing via Flowise in the future.

## How to Test

1. Open the app and navigate to the Intent Capture screen
2. Try these test inputs:
   - `"Book a team of 5 from Boston to Seattle Dec 5-8"`
   - `"Client visit from SFO to JFK next month for 3 teammates"`
   - `"Flying out of LAX for Tokyo with 4 people"`
   - `"Conference in Austin with my team"`
3. Check browser console for "Parsed overrides:" output
4. Verify trip is created with correct traveler count and origin
5. Check server logs for confirmation of parsed fields

## Production Hardening Test Cases

These inputs validate the parser's robustness and error handling:

### ✅ Edge Case 1: Solo Trip
**Input:** `"Solo trip to San Diego this month"`

**Expected:**
- destination: "San Diego"
- travelers_count: 1 (from "solo" word number)
- dates: this month (7 days from now)
- origin_city: undefined

---

### ✅ Edge Case 2: Multiple Numbers (Should Prefer Traveler Count)
**Input:** `"3 teammates to Seattle for 2 days"`

**Expected:**
- destination: "Seattle"
- travelers_count: 3 (prefers number near "teammates", ignores "2 days")
- dates: default (2 weeks from now)
- origin_city: undefined

---

### ✅ Edge Case 3: Non-City Words (Should Be Filtered)
**Input:** `"from home to office next week"`

**Expected:**
- destination: undefined (both "home" and "office" filtered out)
- travelers_count: 1 (default)
- dates: default (2 weeks from now, since "next week" not supported)
- origin_city: undefined

---

### ✅ Edge Case 4: Large Number Clamping
**Input:** `"Conference to NYC with 1000 people"`

**Expected:**
- destination: "NYC"
- travelers_count: 20 (clamped from 1000)
- dates: default
- trip_name: "Conference Trip"

---

### ✅ Edge Case 5: Destination-Only (Backward Compatible)
**Input:** `"Trip to Seattle Dec 2-6"`

**Expected:**
- destination: "Seattle"
- travelers_count: 1 (default)
- dates: { start_date: "2025-12-02", end_date: "2025-12-06" }
- origin_city: undefined
- trip_name: "Trip to Seattle"

**Result:** ✅ Original behavior preserved

---

### ✅ Edge Case 6: Conference from Origin to Destination
**Input:** `"Conference from Boston to NYC next month"`

**Expected:**
- origin_city: "Boston"
- destination: "NYC"
- travelers_count: 1 (default)
- dates: next month (mid-month)
- trip_name: "Conference Trip"

---

### ✅ Edge Case 7: Team of N Visiting Clients
**Input:** `"Team of 5 visiting clients in LA Jan 15-16"`

**Expected:**
- destination: "LA"
- travelers_count: 5 (from "team of 5")
- dates: { start_date: "2026-01-15", end_date: "2026-01-16" }
- trip_name: "Client Visit" (from "clients" → "client visit" pattern)
- origin_city: undefined

---

### 🔍 Development Logging Example
When running in development mode, you'll see structured output like:

```javascript
🔍 Intent Parser Output: {
  rawIntent: "Book a team of 5 from Boston to Seattle Dec 5-8",
  destination: "Seattle",
  origin_city: "Boston",
  travelers_count: 5,
  start_date: "2025-12-05",
  end_date: "2025-12-08",
  trip_name: "Trip to Seattle"
}
```

In production, this logging is suppressed.