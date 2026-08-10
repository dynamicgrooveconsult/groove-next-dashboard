-- Create portfolio_items table (idempotent - safe to run multiple times)
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  video_url TEXT,
  type TEXT DEFAULT 'image'
);

-- Add columns if table already exists
ALTER TABLE public.portfolio_items ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE public.portfolio_items ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.portfolio_items ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'image';
ALTER TABLE public.portfolio_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.portfolio_items;
CREATE POLICY "Allow public read access" ON public.portfolio_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin insert" ON public.portfolio_items;
CREATE POLICY "Allow admin insert" ON public.portfolio_items
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin update" ON public.portfolio_items;
CREATE POLICY "Allow admin update" ON public.portfolio_items
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow admin delete" ON public.portfolio_items;
CREATE POLICY "Allow admin delete" ON public.portfolio_items
  FOR DELETE USING (true);
