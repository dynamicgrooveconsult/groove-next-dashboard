-- Add missing columns to existing portfolio_items table
ALTER TABLE public.portfolio_items
  ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'image';

-- RLS policies (if not already present)
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
