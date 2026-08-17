// Airline marks, shared by the option cards and the itinerary detail screen so
// the logo always follows the airline actually on the itinerary.

const AIRLINE_LOGOS: Record<string, string> = {
  delta: "https://logo.clearbit.com/delta.com",
  united: "https://logo.clearbit.com/united.com",
  american: "https://logo.clearbit.com/aa.com",
  southwest: "https://logo.clearbit.com/southwest.com",
  jetblue: "https://logo.clearbit.com/jetblue.com",
  alaska: "https://logo.clearbit.com/alaskaair.com",
  spirit: "https://logo.clearbit.com/spirit.com",
  frontier: "https://logo.clearbit.com/flyfrontier.com",
};

const FALLBACK = AIRLINE_LOGOS.delta;

/** Pick a logo from the airline named in a flight string. */
export function getAirlineLogo(flightDetails?: string | null): string {
  if (!flightDetails) return FALLBACK;
  const text = flightDetails.toLowerCase();

  for (const [name, url] of Object.entries(AIRLINE_LOGOS)) {
    if (text.includes(name)) return url;
  }
  if (text.includes("jet blue")) return AIRLINE_LOGOS.jetblue;
  return FALLBACK;
}
