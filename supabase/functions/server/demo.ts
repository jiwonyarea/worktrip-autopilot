// Demo-mode support for the public portfolio build.
//
// The goal: a visitor should see a real generated trip — real airlines, real
// prices — without costing anything. Two mechanisms:
//
//   1. A curated catalog of already-generated trips, served straight from the
//      database. Free, instant, and works even if the upstream travel API is
//      down.
//   2. A daily cap on live generation, so the small number of visitors who
//      want to run the agent themselves can, without an unbounded bill.

import * as kv from "./kv_store.ts";

const CATALOG_KEY = "demo:catalog";
const DEFAULT_DAILY_LIMIT = 20;

export interface DemoEntry {
  trip_id: string;
  label: string;
  summary: string;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

export async function getCatalog(): Promise<DemoEntry[]> {
  return (await kv.get(CATALOG_KEY)) ?? [];
}

export async function addToCatalog(entry: DemoEntry): Promise<DemoEntry[]> {
  const catalog = await getCatalog();
  const next = [
    ...catalog.filter((e) => e.trip_id !== entry.trip_id),
    entry,
  ];
  await kv.set(CATALOG_KEY, next);
  return next;
}

export async function removeFromCatalog(tripId: string): Promise<DemoEntry[]> {
  const next = (await getCatalog()).filter((e) => e.trip_id !== tripId);
  await kv.set(CATALOG_KEY, next);
  return next;
}

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------

export interface RateLimitState {
  allowed: boolean;
  used: number;
  limit: number;
  resets: string;
}

function dailyLimit(): number {
  const raw = Deno.env.get("DAILY_GENERATION_LIMIT");
  if (raw === undefined || raw.trim() === "") return DEFAULT_DAILY_LIMIT;

  const configured = Number(raw);
  // 0 is meaningful — it turns live generation off and leaves only the
  // pre-generated trips — so accept it rather than treating it as unset.
  return Number.isFinite(configured) && configured >= 0
    ? configured
    : DEFAULT_DAILY_LIMIT;
}

/**
 * A request carrying the bypass token skips the cap entirely, so the owner can
 * still generate trips on a day the public quota is spent.
 */
export function hasBypass(req: Request): boolean {
  const token = Deno.env.get("DEMO_BYPASS_TOKEN");
  if (!token) return false;
  return req.headers.get("x-demo-bypass") === token;
}

export async function checkRateLimit(): Promise<RateLimitState> {
  const limit = dailyLimit();
  const used = Number((await kv.get(`ratelimit:generate:${today()}`)) ?? 0);

  return {
    allowed: used < limit,
    used,
    limit,
    // Quota is per UTC day.
    resets: `${today()}T24:00:00Z`,
  };
}

/**
 * Count one generation against today's quota.
 *
 * Read-modify-write, so two requests landing in the same instant can share a
 * slot. At this volume that is not worth a Postgres function — the cap is a
 * spend guard, not a security control.
 */
export async function recordGeneration(): Promise<void> {
  const key = `ratelimit:generate:${today()}`;
  const used = Number((await kv.get(key)) ?? 0);
  await kv.set(key, used + 1);
}
