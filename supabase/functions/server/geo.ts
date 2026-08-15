// Departure-city detection from the caller's IP address.
//
// Flight search UIs (Skyscanner, Google Flights) prefill the origin so people
// only state a destination. Saying "from where I am" out loud is unnatural, so
// we resolve it instead and let anything the traveler actually says override it.
//
// IP geolocation is city-accurate at best and wrong behind a VPN, so the
// result is always presented as a changeable suggestion, never a fact.

import * as kv from "./kv_store.ts";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export interface DetectedLocation {
  detected: boolean;
  city: string;
  region: string;
  country: string;
  /** Why detection failed, when it did. */
  reason?: string;
}

const UNDETECTED: DetectedLocation = {
  detected: false,
  city: "",
  region: "",
  country: "",
};

/**
 * The client address as seen by the edge runtime. `x-forwarded-for` is a
 * comma-separated chain appended to by each proxy, so the original client is
 * the first entry.
 */
export function clientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  const candidate = forwarded?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim();

  if (!candidate) return null;

  // Loopback and private ranges resolve to nothing useful — typically local
  // development rather than a real visitor.
  if (
    candidate === "127.0.0.1" ||
    candidate === "::1" ||
    /^10\./.test(candidate) ||
    /^192\.168\./.test(candidate) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(candidate)
  ) {
    return null;
  }

  return candidate;
}

export async function detectLocation(ip: string | null): Promise<DetectedLocation> {
  if (!ip) {
    return { ...UNDETECTED, reason: "No public address for this request" };
  }

  // One lookup per address per day keeps us well inside the free tier.
  const cacheKey = `geo:${ip}`;
  const cached = await kv.get(cacheKey).catch(() => null);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.location;
  }

  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return { ...UNDETECTED, reason: `Lookup failed (${res.status})` };
    }

    const data = await res.json();
    if (!data.success || !data.city) {
      return { ...UNDETECTED, reason: "Address could not be placed" };
    }

    const location: DetectedLocation = {
      detected: true,
      city: data.city,
      region: data.region ?? "",
      country: data.country ?? "",
    };

    // Cache failures are irrelevant to the caller — the answer is already good.
    await kv.set(cacheKey, { at: Date.now(), location }).catch(() => {});

    return location;
  } catch (error) {
    console.warn("Location lookup failed:", error);
    return { ...UNDETECTED, reason: "Location service unavailable" };
  }
}
