-- ==========================================================
-- Storage Bucket RLS Policies
-- Run this in the Supabase SQL Editor after creating buckets
-- via the Dashboard or API.
-- ==========================================================

-- Allow uploads to portfolio-images bucket (client-side admin uploads)
DROP POLICY IF EXISTS "Allow portfolio-image uploads" ON storage.objects;
CREATE POLICY "Allow portfolio-image uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "Allow portfolio-image reads" ON storage.objects;
CREATE POLICY "Allow portfolio-image reads" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "Allow portfolio-image deletes" ON storage.objects;
CREATE POLICY "Allow portfolio-image deletes" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'portfolio-images');

-- Allow uploads to ceo-images bucket (client-side admin uploads)
DROP POLICY IF EXISTS "Allow ceo-image uploads" ON storage.objects;
CREATE POLICY "Allow ceo-image uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'ceo-images');

DROP POLICY IF EXISTS "Allow ceo-image reads" ON storage.objects;
CREATE POLICY "Allow ceo-image reads" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'ceo-images');

DROP POLICY IF EXISTS "Allow ceo-image deletes" ON storage.objects;
CREATE POLICY "Allow ceo-image deletes" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'ceo-images');

-- Allow operations on Groove-media bucket (general media)
DROP POLICY IF EXISTS "Allow Groove-media uploads" ON storage.objects;
CREATE POLICY "Allow Groove-media uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'Groove-media');

DROP POLICY IF EXISTS "Allow Groove-media reads" ON storage.objects;
CREATE POLICY "Allow Groove-media reads" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'Groove-media');

DROP POLICY IF EXISTS "Allow Groove-media deletes" ON storage.objects;
CREATE POLICY "Allow Groove-media deletes" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'Groove-media');
