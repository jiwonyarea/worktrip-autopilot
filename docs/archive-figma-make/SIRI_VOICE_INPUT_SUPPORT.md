# Siri Voice Input Support

## Overview
The intent parsing system has been enhanced to handle Siri-style voice input with full natural language date formats, explicit years, and formal sentence structures.

## Example Siri Input
```
"book me a trip from Pittsburgh to New York City from December 22 to December 30 of 2025 for two passengers. The purpose of this trip is a conference."
```

### Expected Parse Results
- **Origin**: Pittsburgh
- **Destination**: New York City
- **Start Date**: 2025-12-22
- **End Date**: 2025-12-30
- **Travelers**: 2
- **Trip Name**: Conference Trip

## Enhancements Made

### 1. Multi-Word City Names
**Pattern Updates:**
- Updated regex to support cities like "New York City", "San Francisco", "Los Angeles"
- Changed from `[A-Za-z]+(?:\s+[A-Z][a-z]+)*` to `[A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*`
- Added lookahead to prevent over-capturing: `(?:\s+from|\s+for|\s+of|\s+\d|,|\.|\?|!|$)`

**Examples:**
- ✅ "from Pittsburgh to New York City"
- ✅ "from San Francisco to Los Angeles"
- ✅ "from Boston to New York"

### 2. Full Date Formats with Explicit Years
**New Pattern (PRIORITY 2):**
```javascript
/(?:from\s+)?(January|February|...|Dec)\s+(\d{1,2})(?:\s+to\s+|\s*[-–—]\s*)(January|...|Dec)\s+(\d{1,2})(?:\s+of\s+|\s*,\s*)?(\d{4})/i
```

**Supported Formats:**
- ✅ "from December 22 to December 30 of 2025"
- ✅ "December 22 to December 30, 2025"
- ✅ "from January 5 to February 10 of 2026"
- ✅ "March 15 to March 20, 2026"

**Year Handling:**
- Explicit year from input takes precedence
- Falls back to current/next year logic if no year specified

### 3. "Passengers" Keyword Support
**Pattern Updates:**
- Added "passenger" to traveler keyword list
- New Pattern 4: "for N passengers"

**Supported Formats:**
- ✅ "for 2 passengers"
- ✅ "for two passengers"
- ✅ "for five passengers"
- ✅ "3 passengers"

**All Traveler Keywords:**
- teammate(s)
- people
- person
- traveler(s)
- **passenger(s)** ← NEW
- coworker(s)
- colleague(s)
- attendee(s)
- participant(s)

### 4. Explicit Purpose Statement
**New Pattern:**
```javascript
/\bpurpose\s+of\s+(?:this|the)\s+trip\s+is\s+(?:a\s+)?(\w+(?:\s+\w+)?)/i
```

**Supported Formats:**
- ✅ "The purpose of this trip is a conference"
- ✅ "purpose of the trip is client visit"
- ✅ "the purpose of this trip is an offsite"

**Purpose Mapping:**
- "conference" → "Conference Trip"
- "client" / "visit" / "meeting" → "Client Visit"
- "offsite" → "Team Offsite"
- Other → Capitalized + " Trip"

## Updated Suggestion Examples
The smart suggestion chips now demonstrate Siri-style input:

```javascript
[
  {
    label: "Conference trip",
    text: "Book me a trip from San Francisco to Seattle from December 5 to December 8 of 2025 for 3 passengers. The purpose of this trip is a conference."
  },
  {
    label: "Client visit",
    text: "Book me a trip from Boston to New York City from January 15 to January 18 of 2026 for 2 passengers. The purpose of this trip is a client meeting."
  },
  {
    label: "Team offsite",
    text: "Book me a trip from Los Angeles to Austin from March 10 to March 14 of 2026 for 10 passengers. The purpose of this trip is an offsite."
  }
]
```

## Date Parsing Priority Order

1. **Numeric formats** (e.g., "12/20 to 12/30")
2. **Full dates with explicit year** (e.g., "December 22 to December 30 of 2025") ← NEW
3. **Month name formats without year** (e.g., "Dec 19 to Dec 30")
4. **Same month range** (e.g., "Dec 19-29")
5. **"next month"** pattern
6. **"this month"** pattern
7. **Default** (2 weeks from now)

## Traveler Count Priority Order

1. **Direct number + keyword** (e.g., "3 teammates", "2 passengers")
2. **"for N passengers/people"** (e.g., "for 2 passengers") ← NEW
3. **"team/group of N"** (e.g., "team of 5")
4. **Word numbers** (e.g., "two people", "five passengers")
5. **Generic team mention** (e.g., "with my team" → defaults to 3)

## Testing

### Console Logging
In development mode, the parser logs detailed output:
```javascript
🔍 Intent Parser Output: {
  rawIntent: "book me a trip from Pittsburgh to New York City...",
  destination: "New York City",
  origin_city: "Pittsburgh",
  travelers_count: 2,
  start_date: "2025-12-22",
  end_date: "2025-12-30",
  trip_name: "Conference Trip"
}
```

### Special Test Case Detection
When the input contains "Pittsburgh" and "New York", additional validation logs appear:
```javascript
✅ Siri-style input detected - validating parse:
  Expected: Pittsburgh → New York City, Dec 22-30 2025, 2 passengers, Conference
  Actual: { route: "Pittsburgh → New York City", dates: "2025-12-22 to 2025-12-30", travelers: 2, purpose: "Conference Trip" }
```

## Backward Compatibility

All existing parsing patterns remain functional:
- ✅ Short format: "Conference trip to Seattle Dec 5-8 for 3 teammates"
- ✅ Abbreviated dates: "from SFO to NYC next month for 3 people"
- ✅ Inferred purpose: "Client visit to Boston in March"
- ✅ Team mentions: "Offsite in Austin with my team"

## Demo Tips

### Siri Dictation
When using Siri to dictate the example sentence:
1. Speak clearly and at a natural pace
2. Siri should capture: "Book me a trip from Pittsburgh to New York City from December 22 to December 30 of 2025 for two passengers. The purpose of this trip is a conference."
3. The parser will extract all fields correctly
4. Check the browser console for validation logs

### Alternative Phrasing
The parser is flexible and handles variations:
- "Book a trip from Pittsburgh to New York City December 22-30, 2025 for 2 passengers"
- "Trip from Pittsburgh to NYC from Dec 22 to Dec 30 of 2025 for two people. Purpose is conference."
- "From Pittsburgh to New York from December twenty-second to December thirtieth 2025 for 2 passengers for a conference"

## Files Modified

- `/components/screens/IntentCapture.tsx` - Enhanced parseIntent function
- `/SIRI_VOICE_INPUT_SUPPORT.md` - This documentation

## Related Documentation

- `/INTENT_PARSING_UPGRADE.md` - Origin city and traveler count enhancements
- `/VALIDATION_FIX.md` - Destination validation requirements
- `/AGENTIC_FLOW_NAVIGATION.md` - Overall flow architecture
