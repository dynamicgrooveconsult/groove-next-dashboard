CREATE TABLE IF NOT EXISTS public.bookings (
  id BIGSERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  event_type TEXT NOT NULL,
  event_date DATE,
  total_amount NUMERIC(10,2) DEFAULT 0,
  commitment_paid BOOLEAN DEFAULT FALSE,
  mobilization_paid BOOLEAN DEFAULT FALSE,
  final_balance_paid BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'Pending',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service_role all" ON public.bookings
  FOR ALL USING (true) WITH CHECK (true);
