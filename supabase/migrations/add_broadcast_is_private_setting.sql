-- =============================================
-- Broadcast privacy toggle (public vs access-code required)
-- Stored in cms_content under the existing 'broadcast' section.
-- Default: 'false' (public — anyone can watch).
-- =============================================
INSERT INTO public.cms_content (section, key, value) VALUES
  ('broadcast', 'broadcast_is_private', 'false')
ON CONFLICT (section, key) DO NOTHING;
