-- Create CEO profile table (single-row table)
CREATE TABLE IF NOT EXISTS public.ceo_profile (
  id BIGINT PRIMARY KEY DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT NOT NULL DEFAULT 'Oluwanise Israel Tope',
  position TEXT NOT NULL DEFAULT 'Principal Multimedia Consultant & Event Specialist',
  short_bio TEXT DEFAULT '',
  full_biography TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  facebook_link TEXT DEFAULT '',
  instagram_link TEXT DEFAULT '',
  linkedin_link TEXT DEFAULT '',
  youtube_link TEXT DEFAULT '',
  email_address TEXT DEFAULT '',
  phone_number TEXT DEFAULT '',
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE public.ceo_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.ceo_profile;
CREATE POLICY "Allow public read access" ON public.ceo_profile
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin insert" ON public.ceo_profile;
CREATE POLICY "Allow admin insert" ON public.ceo_profile
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin update" ON public.ceo_profile;
CREATE POLICY "Allow admin update" ON public.ceo_profile
  FOR UPDATE USING (true);

-- Insert initial row
INSERT INTO public.ceo_profile (id, full_name, position, short_bio, full_biography)
VALUES (
  1,
  'Oluwanise Israel Tope',
  'Principal Multimedia Consultant & Event Specialist',
  'Oluwanise Israel Tope is a passionate multimedia consultant, live broadcast specialist, and creative technology strategist with extensive experience in professional media production, event coverage, and digital broadcasting.',
  'Through Dynamic Groove Media, he bridges the gap between physical experiences and global digital audiences using modern broadcasting technologies and creative storytelling.'
)
ON CONFLICT (id) DO NOTHING;
