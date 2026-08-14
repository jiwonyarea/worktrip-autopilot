-- Worktrip Autopilot schema.
-- Apply with `supabase db push`, or paste into the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- kv_store: trips and traveler preferences
-- ---------------------------------------------------------------------------
-- Keys are namespaced: "trip:<uuid>", "preferences:<trip_id>:<traveler_id>".
create table if not exists public.kv_store (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

create index if not exists idx_kv_store_key_prefix
  on public.kv_store (key text_pattern_ops);

alter table public.kv_store enable row level security;

-- No anon policy: trips are reachable only through the edge function, which
-- uses the service role key. The service role bypasses RLS entirely, so
-- enabling RLS with no permissive policy makes this table private by default.

-- ---------------------------------------------------------------------------
-- expenses: queried directly by the frontend
-- ---------------------------------------------------------------------------
create table if not exists public.expenses (
  id            uuid primary key default gen_random_uuid(),
  trip_id       text not null,
  merchant      text,
  amount        numeric(12, 2),
  date          date,
  category      text,
  traveler      text,
  receipt_url   text,
  policy_status text not null default 'compliant',
  created_at    timestamptz not null default now()
);

create index if not exists idx_expenses_trip_id on public.expenses (trip_id);

alter table public.expenses enable row level security;

drop policy if exists "Allow public read" on public.expenses;
drop policy if exists "Allow public insert" on public.expenses;
drop policy if exists "demo read expenses" on public.expenses;
drop policy if exists "demo insert expenses" on public.expenses;

-- DEMO POSTURE: anyone holding the anon key can read and write expenses.
-- This matches the current prototype, where there is no sign-in. Before this
-- handles anyone's real spend, add auth and scope these policies to the
-- owning user (e.g. using auth.uid() against a trip_members table).
create policy "demo read expenses"
  on public.expenses for select
  using (true);

create policy "demo insert expenses"
  on public.expenses for insert
  with check (true);

-- ---------------------------------------------------------------------------
-- Receipt image storage
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', true)
on conflict (id) do nothing;

drop policy if exists "demo upload receipts" on storage.objects;
drop policy if exists "demo read receipts" on storage.objects;

-- Same demo posture as above: public receipt images so the edge function and
-- the browser can both fetch them without signed URLs.
create policy "demo upload receipts"
  on storage.objects for insert
  with check (bucket_id = 'receipts');

create policy "demo read receipts"
  on storage.objects for select
  using (bucket_id = 'receipts');
