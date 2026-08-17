-- Who filed an expense.
--
-- The agent books the flight and the hotel, so it files those two itself the
-- moment a trip is confirmed. Everything a traveller uploads afterwards is
-- 'manual'. The column exists so the expenses table can say which is which
-- rather than presenting the agent's own bookings as someone's receipts.

alter table public.expenses
  add column if not exists source text not null default 'manual';
