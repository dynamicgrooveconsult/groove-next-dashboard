import Link from 'next/link'
import TeamSection from '@/components/team-section'
import HomeGalleryCarousel from '@/components/home/GalleryCarousel'
import SiteFooter from '@/components/SiteFooter'
import FeaturedEventSection from '@/components/home/FeaturedEventSection'
import { supabase } from '@/utils/supabase/server'
import {
  Award,
  ShieldCheck,
  Sparkles,
  Users,
  Cpu,
  Video,
  MonitorPlay,
  Globe2,
  Quote,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const stats = [
  { value: '100+', label: 'Successful Events Covered' },
  { value: 'Multi-Platform', label: 'Live Streaming Solutions' },
  { value: 'Trusted', label: 'Churches, Schools & Organizations' },
  { value: 'Pro Setup', label: 'Multi-Camera Broadcast' },
  { value: 'Lagos-Based', label: 'Multimedia & Event Specialists' },
]

const whyChooseUs = [
  { icon: Award, title: 'Professional Excellence', description: 'Every project is handled with the highest standards of quality and professionalism from start to finish.' },
  { icon: ShieldCheck, title: 'Reliable Live Broadcasting', description: 'Redundant systems, backup power, and failover streaming ensure your event never goes offline.' },
  { icon: Sparkles, title: 'Creative Storytelling', description: 'We don\'t just capture events — we craft compelling narratives that resonate with your audience.' },
  { icon: Users, title: 'Client-Focused Approach', description: 'Your vision guides every decision. We collaborate closely to bring your creative brief to life.' },
  { icon: Cpu, title: 'Modern Production Technology', description: 'Industry-leading cameras, audio equipment, and streaming infrastructure for pristine production value.' },
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

const broadcastFeatures = [
  { icon: Video, title: 'Multi-Camera Switching', desc: 'Seamless live switching between 3–8 camera angles for dynamic, professional broadcasts.' },
  { icon: MonitorPlay, title: 'Real-Time Monitoring', desc: 'Live preview, audio metering, and signal monitoring to ensure flawless delivery.' },
  { icon: Globe2, title: 'Global Streaming', desc: 'Stream to YouTube, Facebook, Vimeo, or custom HLS endpoints with adaptive bitrate.' },
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

      {/* Featured Homepage Event */}
      <FeaturedEventSection />

      {/* Gallery Carousel */}
      <HomeGalleryCarousel />

      {/* Page Background Video (non-hero sections) */}
      <div className="relative overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-40">
          <source src="/background/vid two.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#050505]/60 z-[1]" />
        <div className="relative z-10">

      {/* Brand Intro */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-yellow-500 mb-4">
            <span className="w-6 h-px bg-yellow-500" />
            About
            <span className="w-6 h-px bg-yellow-500" />
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Dynamic Groove Media</h2>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl mx-auto">
            Dynamic Groove Media is a Lagos-based multimedia production and live broadcasting company
            dedicated to delivering world-class media experiences. We specialize in combining advanced
            production technology with creative storytelling to elevate events, brands, and experiences.
          </p>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 px-6 border-t border-yellow-500/10 border-b border-yellow-500/10 bg-gradient-to-b from-transparent via-yellow-500/[0.02] to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-yellow-500 mb-2">By the Numbers</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Impact</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="group relative text-center p-6 bg-gradient-to-b from-[#141414] to-[#0d0d0d] rounded-xl border border-yellow-500/10 hover:border-yellow-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_-8px_rgba(234,179,8,0.35)]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-b from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">{stat.value}</p>
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
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-yellow-500 mb-4">
              <span className="w-6 h-px bg-yellow-500" />
              Why Choose Us
              <span className="w-6 h-px bg-yellow-500" />
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Built for Excellence</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">What sets Dynamic Groove Media apart from the rest.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={i}
                  className="relative p-8 bg-gradient-to-b from-[#141414] to-[#0d0d0d] rounded-xl border border-yellow-500/10 hover:border-yellow-500/40 transition-all duration-300 group overflow-hidden hover:-translate-y-1 hover:shadow-[0_0_30px_-8px_rgba(234,179,8,0.3)]"
                >
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/15 transition-all duration-500" />
                  <span className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 mb-5 group-hover:bg-yellow-500/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Broadcasting Section */}
      <section className="relative py-24 px-6 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-yellow-500 mb-4">
              <span className="w-6 h-px bg-yellow-500" />
              Broadcasting
              <span className="w-6 h-px bg-yellow-500" />
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Multi-Camera Streaming & Connectivity</h2>
            <p className="text-zinc-400 max-w-3xl mx-auto">
              Our live broadcasting infrastructure delivers reliable, high-quality streams to any platform.
              From multi-camera switching to real-time monitoring, we ensure your event reaches the world without interruption.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {broadcastFeatures.map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={i}
                  className="relative p-8 bg-gradient-to-b from-[#151515] to-[#0a0a0a] rounded-xl border border-yellow-500/10 hover:border-yellow-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_-8px_rgba(234,179,8,0.3)]"
                >
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 mb-5">
                    <Icon className="w-6 h-6" />
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* Our Process */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-yellow-500 mb-4">
              <span className="w-6 h-px bg-yellow-500" />
              How We Work
              <span className="w-6 h-px bg-yellow-500" />
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Process</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">From first conversation to final delivery — a proven workflow.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div
                key={i}
                className="relative text-center p-6 bg-gradient-to-b from-[#141414] to-[#0d0d0d] rounded-xl border border-yellow-500/10 hover:border-yellow-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                {i < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-3 w-6 h-px bg-yellow-500/20" />
                )}
                <div className="w-12 h-12 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 flex items-center justify-center text-[#050505] font-bold text-lg mx-auto mb-4 shadow-lg shadow-yellow-500/30">
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
      <section className="relative py-24 px-6 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-yellow-500 mb-4">
              <span className="w-6 h-px bg-yellow-500" />
              Equipment
              <span className="w-6 h-px bg-yellow-500" />
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Equipment & Technology</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">We use industry-leading gear to deliver production value that stands out.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {equipment.map((item, i) => (
              <div
                key={i}
                className="group p-5 bg-gradient-to-b from-[#151515] to-[#0d0d0d] rounded-xl border border-yellow-500/10 hover:border-yellow-500/40 transition-all duration-300 text-center hover:-translate-y-1"
              >
                <p className="text-yellow-500 text-xl mb-1 group-hover:scale-125 transition-transform duration-300 inline-block">✓</p>
                <p className="text-white text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-yellow-500/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-yellow-500 mb-4">
              <span className="w-6 h-px bg-yellow-500" />
              Testimonials
              <span className="w-6 h-px bg-yellow-500" />
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">What Our Clients Say</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Don't take our word for it — hear from those we've served.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="relative p-8 bg-gradient-to-b from-[#151515] to-[#0d0d0d] rounded-xl border border-yellow-500/10 hover:border-yellow-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_-8px_rgba(234,179,8,0.3)]"
              >
                <Quote className="w-8 h-8 text-yellow-500/25 mb-4" fill="currentColor" />
                {t.image_url && (
                  <img src={t.image_url} alt={t.author || 'Client photo'} className="w-14 h-14 rounded-full object-cover border-2 border-yellow-500 mb-4" />
                )}
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">{t.quote}</p>
                <div className="pt-4 border-t border-yellow-500/10">
                  <p className="text-white font-bold text-sm">{t.author}</p>
                  <p className="text-yellow-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.08),transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Let's Create Something Exceptional
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
            Ready to elevate your next event or media project? Partner with Dynamic Groove Media.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-bold px-10 py-4 rounded-full transition-all duration-300 text-lg shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40"
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