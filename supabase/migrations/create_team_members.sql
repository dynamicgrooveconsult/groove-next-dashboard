-- Create team_members table (for TeamSection on homepage)
CREATE TABLE IF NOT EXISTS public.team_members (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT,
  bio TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0
);

-- Add columns if table already exists (idempotent)
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.team_members;
CREATE POLICY "Allow public read access" ON public.team_members
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all" ON public.team_members;
CREATE POLICY "Allow admin all" ON public.team_members
  FOR ALL USING (true);

-- Seed initial team members (only if table is empty)
INSERT INTO public.team_members (name, role, bio, display_order)
SELECT 'Tunde Adebayo', 'Lead Producer', '15+ years in broadcast and live event production.', 1
WHERE NOT EXISTS (SELECT 1 FROM public.team_members);

INSERT INTO public.team_members (name, role, bio, display_order)
SELECT 'Simi Ogunlade', 'Director of Photography', 'Cinematographer with a passion for storytelling through the lens.', 2
WHERE (SELECT COUNT(*) FROM public.team_members) < 2;

INSERT INTO public.team_members (name, role, bio, display_order)
SELECT 'Kunle Davies', 'Audio Engineer', 'Expert in live sound reinforcement and studio recording.', 3
WHERE (SELECT COUNT(*) FROM public.team_members) < 3;
