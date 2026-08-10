-- =============================================
-- CMS: Content settings (key-value for simple fields)
-- =============================================
CREATE TABLE IF NOT EXISTS public.cms_content (
  id BIGSERIAL PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cms_content" ON public.cms_content
  FOR SELECT USING (true);
CREATE POLICY "Admin insert cms_content" ON public.cms_content
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update cms_content" ON public.cms_content
  FOR UPDATE USING (true);
CREATE POLICY "Admin delete cms_content" ON public.cms_content
  FOR DELETE USING (true);

-- Seed homepage content
INSERT INTO public.cms_content (section, key, value) VALUES
  ('home_hero', 'title', 'Premium Multimedia Production'),
  ('home_hero', 'subtitle', 'Bringing Events to Life Through Cinematic Media & Live Broadcasting'),
  ('home_hero', 'description', 'Professional multimedia production, live streaming, photography, and event technology solutions designed to connect experiences with global audiences.'),
  ('home_hero', 'cta_text', 'Book Consultation'),
  ('home_hero', 'cta_link', '/contact'),
  ('home_hero', 'background_image', ''),
  ('home_stats', 'events_covered', '100+'),
  ('home_stats', 'projects_completed', '500+'),
  ('home_stats', 'clients_served', '200+'),
  ('home_stats', 'years_experience', '10+'),
  ('home_cta', 'title', 'Let''s Create Something Exceptional'),
  ('home_cta', 'description', 'Ready to elevate your next event or media project? Partner with Dynamic Groove Media.'),
  ('home_cta', 'button_text', 'Contact Us Today'),
  ('home_cta', 'button_link', '/contact'),
  ('about_company', 'story', 'Dynamic Groove Media is a premier multimedia production and live broadcasting company dedicated to delivering world-class media experiences for events, organizations, brands, and institutions.'),
  ('about_company', 'mission', 'To elevate events, brands, and experiences through innovative multimedia production, live broadcasting excellence, and creative storytelling that connects audiences globally.'),
  ('about_company', 'vision', 'To become Africa''s leading multimedia and live production brand, recognized for transforming ordinary moments into globally impactful digital experiences through innovation, professionalism, and excellence.'),
  ('contact_info', 'phone', '09153870151'),
  ('contact_info', 'whatsapp', '08086148671'),
  ('contact_info', 'email', 'hello@dynamicgroove.media'),
  ('contact_info', 'address', '9, Oluniyi-Fayinto, Off Pipeline, Fagba, Lagos'),
  ('contact_info', 'map_link', ''),
  ('contact_social', 'facebook', ''),
  ('contact_social', 'instagram', ''),
  ('contact_social', 'youtube', ''),
  ('contact_social', 'linkedin', ''),
  ('contact_social', 'tiktok', ''),
  ('broadcast', 'offline_message', 'We Will Be Live Shortly'),
  ('broadcast', 'stream_title', 'Live Broadcast'),
  ('broadcast', 'stream_description', ''),
  ('broadcast', 'lower_third', 'Subscribe to our channel and click the like button'),
  ('broadcast', 'cta_message', ''),
  -- About page: Core Values
  ('about_core_values', 'value_1_title', 'Excellence'),
  ('about_core_values', 'value_1_text', 'We are committed to delivering high-quality multimedia experiences with precision and professionalism.'),
  ('about_core_values', 'value_2_title', 'Innovation'),
  ('about_core_values', 'value_2_text', 'We embrace modern technology and creative solutions to enhance every production.'),
  ('about_core_values', 'value_3_title', 'Integrity'),
  ('about_core_values', 'value_3_text', 'We build lasting client relationships through honesty, reliability, and accountability.'),
  ('about_core_values', 'value_4_title', 'Creativity'),
  ('about_core_values', 'value_4_text', 'We transform ordinary moments into visually compelling experiences.'),
  ('about_core_values', 'value_5_title', 'Impact'),
  ('about_core_values', 'value_5_text', 'We strive to create meaningful content and memorable audience experiences.'),
  -- About page: Technology / Equipment
  ('about_technology', 'tech_1_name', 'Multi-Camera Live Production Systems'),
  ('about_technology', 'tech_1_desc', 'Seamless switching and real-time direction for professional multi-angle broadcasts.'),
  ('about_technology', 'tech_2_name', 'Professional Mirrorless Cameras'),
  ('about_technology', 'tech_2_desc', 'High-resolution cinema-grade capture for stunning visual fidelity.'),
  ('about_technology', 'tech_3_name', '4K Drone Cinematography'),
  ('about_technology', 'tech_3_desc', 'Aerial perspectives that elevate event coverage and branding.'),
  ('about_technology', 'tech_4_name', 'HD Projection Systems'),
  ('about_technology', 'tech_4_desc', 'Large-format visual delivery for immersive audience experiences.'),
  ('about_technology', 'tech_5_name', 'Live Streaming Infrastructure'),
  ('about_technology', 'tech_5_desc', 'End-to-end encoding, distribution, and CDN delivery for global reach.'),
  ('about_technology', 'tech_6_name', 'Studio-Grade Audio Systems'),
  ('about_technology', 'tech_6_desc', 'Crystal-clear sound engineering with professional mixing and monitoring.'),
  ('about_technology', 'tech_7_name', 'Real-Time Broadcast Monitoring'),
  ('about_technology', 'tech_7_desc', 'Multi-view production dashboards for quality assurance and live switching.'),
  ('about_technology', 'tech_8_name', 'Professional Lighting Solutions'),
  ('about_technology', 'tech_8_desc', 'Designed lighting setups for stage, studio, and event environments.'),
  -- About page: Industries Served
  ('about_industries', 'industry_1', 'Churches & Ministries'),
  ('about_industries', 'industry_2', 'Corporate Organizations'),
  ('about_industries', 'industry_3', 'Educational Institutions'),
  ('about_industries', 'industry_4', 'Government Agencies'),
  ('about_industries', 'industry_5', 'Brands & Entrepreneurs'),
  ('about_industries', 'industry_6', 'Weddings & Celebrations')
ON CONFLICT (section, key) DO NOTHING;

-- =============================================
-- CMS: Services
-- =============================================
CREATE TABLE IF NOT EXISTS public.cms_services (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cms_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cms_services" ON public.cms_services
  FOR SELECT USING (true);
CREATE POLICY "Admin insert cms_services" ON public.cms_services
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update cms_services" ON public.cms_services
  FOR UPDATE USING (true);
CREATE POLICY "Admin delete cms_services" ON public.cms_services
  FOR DELETE USING (true);

INSERT INTO public.cms_services (title, description, short_description, display_order, is_featured) VALUES
  ('Live Streaming', 'Professional multi-camera live streaming with real-time switching, RTMP distribution, monitoring dashboards, and multi-platform streaming delivery.', 'Reliable multi-camera broadcast solutions.', 1, true),
  ('Cinematography', 'From pre-production planning to post-production editing, we deliver cinematic-quality storytelling for brands and events.', 'High-end storytelling production.', 2, true),
  ('Drone Services', 'Licensed drone cinematography capturing stunning aerial visuals for branding, events, and documentaries.', 'Cinematic 4K aerial production.', 3, true),
  ('Photography', 'Professional photography services for events, portraits, corporate branding, and commercial projects.', 'Capturing moments that matter.', 4, false),
  ('Event Management', 'End-to-end event planning and coordination for corporate events, weddings, and special occasions.', 'Seamless event execution.', 5, false),
  ('Website Development', 'Custom website development with modern frameworks and responsive design for businesses and organizations.', 'Digital presence that stands out.', 6, false)
ON CONFLICT DO NOTHING;

-- =============================================
-- CMS: Testimonials
-- =============================================
CREATE TABLE IF NOT EXISTS public.cms_testimonials (
  id BIGSERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  company TEXT DEFAULT '',
  position TEXT DEFAULT '',
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  image_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cms_testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cms_testimonials" ON public.cms_testimonials
  FOR SELECT USING (true);
CREATE POLICY "Admin insert cms_testimonials" ON public.cms_testimonials
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update cms_testimonials" ON public.cms_testimonials
  FOR UPDATE USING (true);
CREATE POLICY "Admin delete cms_testimonials" ON public.cms_testimonials
  FOR DELETE USING (true);

INSERT INTO public.cms_testimonials (client_name, company, position, content, rating, display_order) VALUES
  ('Dr. Adebayo O.', 'TechVault NG', 'CEO', 'Dynamic Groove Media transformed our annual conference into a globally accessible event. The production quality was world-class.', 5, 1),
  ('Mr. & Mrs. Daniels', NULL, 'Wedding Clients', 'The professionalism and attention to detail were outstanding. Our wedding livestream reached family across four continents flawlessly.', 5, 2),
  ('Pastor Emmanuel', 'Victory Chapel', 'Senior Pastor', 'We''ve worked with several production companies, but none match the technical expertise and creative vision Dynamic Groove brings.', 5, 3)
ON CONFLICT DO NOTHING;
