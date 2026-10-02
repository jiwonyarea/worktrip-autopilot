// A hand-written trip for looking at the booking screens without spending a
// generation. Opening the real thing costs three SerpApi searches and a model
// call, which is a lot to pay to check a chip's colour.
//
// Reached from the dev button on the landing page. Nothing else references it,
// and no screen falls back to it — a screen showing this instead of a real trip
// would be lying, so it is only ever used when the id matches exactly.

export const DEV_TRIP_ID = "dev-preview";

/** Real-shaped, not real: the figures are plausible and internally consistent. */
export function devTrip(): any {
  return {
    id: DEV_TRIP_ID,
    organizer_name: "Jiwon Park",
    trip_name: "SXSW Austin",
    destination: "Austin, TX",
    venue: "Austin Convention Center",
    origin_city: "Pittsburgh, PA",
    start_date: "2027-03-12",
    end_date: "2027-03-15",
    purpose: "Conference",
    status: "planned",
    total_budget: 5400,
    travelers: [
      { id: "t1", name: "Jiwon Park", role: "Organizer" },
      { id: "t2", name: "Alex Mercer", role: "Engineer" },
      { id: "t3", name: "Dana Oyelaran", role: "Designer" },
    ],
    policy_extras: {
      nights: 3,
      ground_transport_per_day: 80,
      food_per_day: 133,
      rationale:
        "Every non-stop out of PIT lands after 18:00, so the two cheaper " +
        "options cost you the first evening. Downtown buys that evening back " +
        "for $212.",
    },
    itineraries: [
      {
        id: "dev-balanced",
        option_label: "balanced",
        title: "Balanced",
        compliance: "compliant",
        policy_compliant: true,
        policy_note: "Within the $1,800 per-person standard.",
        policy_flags: { flights: "pass", hotel: "pass", details: [] },
        highlights: [
          { type: "pro", text: "Lands 16:01, in time for the opening keynote" },
          { type: "pro", text: "Hotel is a 9-minute walk to the convention centre" },
          { type: "con", text: "06:40 departure to make the return connection" },
        ],
        details: {
          outbound_flight: "Delta · DL 1363 · PIT to AUS · 11:45 - 16:01",
          return_flight: "Delta · DL 1397 · AUS to PIT · 06:40 - 12:08",
          flight_cost: 1794,
          hotel_cost: 1941,
          hotel_name: "Hilton Austin",
          hotel_rating: 4,
          hotel_distance_mi: 0.4,
          ground_transport_cost: 720,
          food_cost: 1197,
        },
      },
      {
        id: "dev-time-saver",
        option_label: "time_saver",
        title: "Time Saver",
        compliance: "compliant",
        policy_compliant: true,
        policy_note: "Within the $1,800 per-person standard.",
        policy_flags: { flights: "pass", hotel: "pass", details: [] },
        highlights: [
          { type: "pro", text: "Non-stop both ways, no connection to miss" },
          { type: "pro", text: "Across the street from the venue" },
          { type: "con", text: "$492 more than the balanced option" },
        ],
        details: {
          outbound_flight: "American · AA 2291 · PIT to AUS · 08:15 - 10:48",
          return_flight: "American · AA 1846 · AUS to PIT · 17:20 - 21:35",
          flight_cost: 2286,
          hotel_cost: 1620,
          hotel_name: "Fairmont Austin",
          hotel_rating: 5,
          hotel_distance_mi: 0.1,
          ground_transport_cost: 480,
          food_cost: 1197,
        },
      },
      {
        id: "dev-cost-saver",
        option_label: "cost_saver",
        title: "Cost Saver",
        compliance: "compliant",
        policy_compliant: true,
        policy_note: "$612 under the per-person standard.",
        policy_flags: { flights: "pass", hotel: "pass", details: [] },
        highlights: [
          { type: "pro", text: "$612 under budget, enough for a fourth traveller" },
          { type: "con", text: "One stop in Dallas each way, 3h longer" },
          { type: "con", text: "25-minute bus to the venue each morning" },
        ],
        details: {
          outbound_flight: "United · UA 4078 · PIT to AUS via ORD · 06:00 - 11:52",
          return_flight: "United · UA 3310 · AUS to PIT via ORD · 13:10 - 20:44",
          flight_cost: 1308,
          hotel_cost: 1446,
          hotel_name: "Hyatt Place Austin Downtown",
          hotel_rating: 3,
          hotel_distance_mi: 1.3,
          ground_transport_cost: 720,
          food_cost: 1197,
        },
      },
    ],
  };
}
