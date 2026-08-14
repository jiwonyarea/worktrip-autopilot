// Minimal key-value store backed by a single Postgres table.
//
// Trips and traveler preferences live here rather than in typed tables — the
// shape is still moving, and one JSONB column keeps migrations out of the way.
// Expenses use a real table (see supabase/migrations) because they are queried
// and aggregated directly by the frontend.

import { createClient } from "jsr:@supabase/supabase-js@2";

const TABLE = "kv_store";

function client() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

export async function set(key: string, value: unknown): Promise<void> {
  const { error } = await client().from(TABLE).upsert({ key, value });
  if (error) throw new Error(`kv.set(${key}): ${error.message}`);
}

export async function get(key: string): Promise<any> {
  const { data, error } = await client()
    .from(TABLE)
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw new Error(`kv.get(${key}): ${error.message}`);
  return data?.value;
}

export async function del(key: string): Promise<void> {
  const { error } = await client().from(TABLE).delete().eq("key", key);
  if (error) throw new Error(`kv.del(${key}): ${error.message}`);
}

export async function getByPrefix(prefix: string): Promise<any[]> {
  const { data, error } = await client()
    .from(TABLE)
    .select("value")
    .like("key", `${prefix}%`);
  if (error) throw new Error(`kv.getByPrefix(${prefix}): ${error.message}`);
  return data?.map((row) => row.value) ?? [];
}
