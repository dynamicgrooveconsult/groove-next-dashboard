-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  service_interest TEXT,
  message TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public INSERT only (anyone can submit the form)
CREATE POLICY "Allow public insert"
  ON public.contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow admin SELECT only (only authenticated users can view submissions)
CREATE POLICY "Allow admin select"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);
