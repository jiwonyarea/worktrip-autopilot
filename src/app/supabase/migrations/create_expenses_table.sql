-- Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id TEXT NOT NULL,
  merchant TEXT,
  amount NUMERIC,
  date TEXT,
  category TEXT,
  traveler TEXT,
  receipt_url TEXT,
  policy_status TEXT DEFAULT 'compliant',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on trip_id for faster queries
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON public.expenses(trip_id);

-- Enable Row Level Security
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated read" ON public.expenses;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.expenses;
DROP POLICY IF EXISTS "Allow service role all" ON public.expenses;
DROP POLICY IF EXISTS "Allow anon read" ON public.expenses;
DROP POLICY IF EXISTS "Allow anon insert" ON public.expenses;

-- Allow anyone to read expenses (for demo purposes)
CREATE POLICY "Allow public read" ON public.expenses
  FOR SELECT
  USING (true);

-- Allow anyone to insert expenses (for demo purposes)
CREATE POLICY "Allow public insert" ON public.expenses
  FOR INSERT
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role all" ON public.expenses
  FOR ALL
  USING (auth.role() = 'service_role');

-- Note: For production, you should restrict these policies based on user authentication
-- Example:
-- CREATE POLICY "Users can read their trip expenses" ON public.expenses
--   FOR SELECT
--   USING (auth.uid() IS NOT NULL);
