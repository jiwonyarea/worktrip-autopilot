// Airline marks, shared by the option cards and the itinerary detail screen so
// the logo always follows the airline actually on the itinerary.
//
// Keyed on the IATA carrier code rather than a name lookup, because the agent
// already hands us the code inside the flight number ("DL 5788" -> DL). A
// carrier nobody hardcoded still resolves that way.
//
// This previously pointed at Clearbit, which shut its logo API down — every
// request now fails to connect, which is why the logos went blank. Callers
// should render through <AirlineLogo>, which falls back to an icon.

// Google's own airline marks — the same square icons Google Flights shows, and
// our flight data comes from Google Flights via SerpApi, so the logo always
// matches the source. Kiwi is kept as a second try: it has a handful of
// carriers Google lacks, but it answers for a carrier it does not have with its
// own "K" placeholder, which is how Southwest ended up wearing Kiwi's logo.
const SOURCES = [
  (code: string) => `https://www.gstatic.com/flights/airline_logos/70px/${code}.png`,
  (code: string) => `https://images.kiwi.com/airlines/128/${code}.png`,
];

// Only reached when a flight string names the airline but carries no code.
const CODE_BY_NAME: Record<string, string> = {
  "jet blue": "B6",
  jetblue: "B6",
  "air canada": "AC",
  "sun country": "SY",
  "british airways": "BA",
  "air france": "AF",
  delta: "DL",
  united: "UA",
  american: "AA",
  southwest: "WN",
  alaska: "AS",
  spirit: "NK",
  frontier: "F9",
  hawaiian: "HA",
  allegiant: "G4",
  westjet: "WS",
  lufthansa: "LH",
  klm: "KL",
  emirates: "EK",
  qatar: "QR",
};

/** "Delta · DL 5788 · PIT to JFK · 07:23 - 09:00" -> "DL" */
export function airlineCode(flightDetails?: string | null): string | null {
  if (!flightDetails) return null;

  // The code heads the flight number, which sits in its own · delimited field.
  const fromNumber = flightDetails.match(/(?:^|·)\s*([A-Z][A-Z0-9])\s*\d{1,4}\b/);
  if (fromNumber) return fromNumber[1].toUpperCase();

  const text = flightDetails.toLowerCase();
  for (const [name, code] of Object.entries(CODE_BY_NAME)) {
    if (text.includes(name)) return code;
  }
  return null;
}

/** Null when the carrier can't be identified — render the fallback instead. */
export function getAirlineLogo(flightDetails?: string | null): string | null {
  return getAirlineLogos(flightDetails)[0] ?? null;
}

/** Every URL worth trying, best first. Empty when the carrier is unknown. */
export function getAirlineLogos(flightDetails?: string | null): string[] {
  const code = airlineCode(flightDetails);
  return code ? SOURCES.map((url) => url(code)) : [];
}
