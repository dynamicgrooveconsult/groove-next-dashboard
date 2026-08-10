import Link from 'next/link'
import TeamSection from '@/components/team-section'
import HomeGalleryCarousel from '@/components/home/GalleryCarousel'
import SiteFooter from '@/components/SiteFooter'
import { supabase } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

const stats = [
  { value: '100+', label: 'Successful Events Covered' },
  { value: 'Multi-Platform', label: 'Live Streaming Solutions' },
  { value: 'Trusted', label: 'Churches, Schools & Organizations' },
  { value: 'Pro Setup', label: 'Multi-Camera Broadcast' },
  { value: 'Lagos-Based', label: 'Multimedia & Event Specialists' },
]

const whyChooseUs = [
  { title: 'Professional Excellence', description: 'Every project is handled with the highest standards of quality and professionalism from start to finish.' },
  { title: 'Reliable Live Broadcasting', description: 'Redundant systems, backup power, and failover streaming ensure your event never goes offline.' },
  { title: 'Creative Storytelling', description: 'We don\'t just capture events — we craft compelling narratives that resonate with your audience.' },
  { title: 'Client-Focused Approach', description: 'Your vision guides every decision. We collaborate closely to bring your creative brief to life.' },
  { title: 'Modern Production Technology', description: 'Industry-leading cameras, audio equipment, and streaming infrastructure for pristine production value.' },
]

const processSteps = [
  { title: 'Consultation', description: 'We discuss your vision, goals, and technical requirements to craft a tailored production plan.' },
  { title: 'Planning & Strategy', description: 'Our team designs the technical workflow, shot list, and timeline for seamless execution.' },
  { title: 'Production & Coverage', description: 'On the day, we execute with precision — multi-camera capture, live switching, and real-time monitoring.' },
  { title: 'Delivery & Support', description: 'You receive polished deliverables — edited content, stream recordings, and broadcast-ready assets.' },
]

const equipment = [
  'Multi-camera live production systems',
  'Professional mirrorless cameras',
  '4K drone cinematography',
  'HD projection systems',
  'Live streaming infrastructure',
  'Studio-grade audio systems',
  'Real-time broadcast monitoring',
  'Professional lighting solutions',
]

export default async function HomePage() {
  const { data: testimonialsRaw } = await supabase
    .from('cms_testimonials')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  const testimonials = (testimonialsRaw || []).map(t => ({
    quote: t.content,
    author: t.client_name,
    role: [t.position, t.company].filter(Boolean).join(', '),
    image_url: t.image_url,
  }))



  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/background/vid one.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/40 to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.12),transparent_70%)]" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="inline-flex items-center gap-2 text-yellow-500 text-sm uppercase tracking-[0.25em] mb-4">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            Premium Multimedia Production
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Bringing Events to Life Through{' '}
            <span className="text-yellow-500">Cinematic Media & Live Broadcasting</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Professional multimedia production, live streaming, photography, and event technology
            solutions designed to connect experiences with global audiences.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-full transition-all duration-300"
            >
              Book Consultation
            </Link>
            <Link
              href="/live-broadcast"
              className="inline-flex items-center gap-2 border border-zinc-600 hover:border-yellow-500 text-white font-bold px-8 py-3 rounded-full transition-all duration-300"
            >
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              Watch Live
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-zinc-500 text-xs uppercase tracking-[0.2em]">
          <span>Scroll</span>
          <div className="w-px h-8 bg-zinc-600 mx-auto mt-2 animate-pulse" />
        </div>
      </section>

      {/* Gallery Carousel */}
      <HomeGalleryCarousel />

      {/* Page Background Video (non-hero sections) */}
      <div className="relative">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-40">
          <source src="/background/vid two.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#050505]/60 z-[1]" />
        <div className="relative z-10">

      {/* Brand Intro */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-yellow-500 mb-4">About</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Dynamic Groove Media</h2>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl mx-auto">
            Dynamic Groove Media is a Lagos-based multimedia production and live broadcasting company
            dedicated to delivering world-class media experiences. We specialize in combining advanced
            production technology with creative storytelling to elevate events, brands, and experiences.
          </p>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 px-6 border-t border-yellow-500/10 border-b border-yellow-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-yellow-500 mb-2">By the Numbers</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Impact</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 bg-[#111111] rounded-lg border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300">
                <p className="text-2xl md:text-3xl font-bold text-yellow-500 mb-2">{stat.value}</p>
                <p className="text-sm text-zinc-400 uppercase tracking-[0.05em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services / Why Choose Us */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-yellow-500 mb-4">Why Choose Us</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Built for Excellence</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">What sets Dynamic Groove Media apart from the rest.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, i) => (
              <div
                key={i}
                className="p-8 bg-[#111111] rounded-lg border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 group"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-500 text-lg font-bold mb-5 group-hover:bg-yellow-500/20 transition-all duration-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Broadcasting Section */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-yellow-500 mb-4">Broadcasting</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Multi-Camera Streaming & Connectivity</h2>
            <p className="text-zinc-400 max-w-3xl mx-auto">
              Our live broadcasting infrastructure delivers reliable, high-quality streams to any platform.
              From multi-camera switching to real-time monitoring, we ensure your event reaches the world without interruption.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Multi-Camera Switching', desc: 'Seamless live switching between 3–8 camera angles for dynamic, professional broadcasts.' },
              { title: 'Real-Time Monitoring', desc: 'Live preview, audio metering, and signal monitoring to ensure flawless delivery.' },
              { title: 'Global Streaming', desc: 'Stream to YouTube, Facebook, Vimeo, or custom HLS endpoints with adaptive bitrate.' },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-[#111111] rounded-lg border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* Our Process */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-yellow-500 mb-4">How We Work</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Process</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">From first conversation to final delivery — a proven workflow.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div key={i} className="text-center p-6 bg-[#111111] rounded-lg border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-[#050505] font-bold text-lg mx-auto mb-4 shadow-lg shadow-yellow-500/20">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment & Technology */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-yellow-500 mb-4">Equipment</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Equipment & Technology</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">We use industry-leading gear to deliver production value that stands out.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {equipment.map((item, i) => (
              <div key={i} className="p-5 bg-[#111111] rounded-lg border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 text-center">
                <p className="text-yellow-500 text-xl mb-1">✓</p>
                <p className="text-white text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-yellow-500 mb-4">Testimonials</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">What Our Clients Say</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Don't take our word for it — hear from those we've served.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-8 bg-[#111111] rounded-lg border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300">
                <svg className="w-8 h-8 text-yellow-500/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                </svg>
                {t.image_url && (
                  <img src={t.image_url} alt={t.author || 'Client photo'} className="w-14 h-14 rounded-full object-cover border border-yellow-500 mb-4" />
                )}
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">{t.quote}</p>
                <div>
                  <p className="text-white font-bold text-sm">{t.author}</p>
                  <p className="text-yellow-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Let's Create Something Exceptional
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
            Ready to elevate your next event or media project? Partner with Dynamic Groove Media.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-10 py-4 rounded-full transition-all duration-300 text-lg"
          >
            Contact Us Today
          </Link>
        </div>
      </section>

      <SiteFooter />
        </div>
      </div>
    </>
  )
}
