'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const teamMembers = [
  { name: 'Tunde Adebayo', role: 'Lead Producer', photo: '/static/images/team/tunde.jpg', bio: '15+ years in broadcast and live event production.' },
  { name: 'Simi Ogunlade', role: 'Director of Photography', photo: '/static/images/team/simi.jpg', bio: 'Cinematographer with a passion for storytelling through the lens.' },
  { name: 'Kunle Davies', role: 'Audio Engineer', photo: '/static/images/team/kunle.jpg', bio: 'Expert in live sound reinforcement and studio recording.' },
  { name: 'Amara Eze', role: 'Streaming Engineer', photo: '/static/images/team/amara.jpg', bio: 'HLS and WebRTC infrastructure specialist.' },
  { name: 'Femi Balogun', role: 'Post-Production Lead', photo: '/static/images/team/femi.jpg', bio: 'DaVinci Resolve colorist and motion graphics designer.' },
]

const recentProductions = [
  { img: '/static/images/gallery/prod-01.jpg', tag: 'Corporate Event', caption: 'Annual Gala — Multi-cam live stream for 800 attendees' },
  { img: '/static/images/gallery/prod-02.jpg', tag: 'Wedding', caption: 'Luxury Wedding — 4K live stream with remote family access' },
  { img: '/static/images/gallery/prod-03.jpg', tag: 'Religious', caption: 'Sunday Service — Weekly broadcast reaching 2,000+ viewers' },
  { img: '/static/images/gallery/prod-04.jpg', tag: 'Memorial', caption: 'Celebration of Life — Private stream for diaspora family' },
  { img: '/static/images/gallery/prod-05.jpg', tag: 'Concert', caption: 'Live Music Night — 5-camera concert broadcast' },
]

function useCmsSection(section: string) {
  const [data, setData] = useState<Record<string, string>>({})
  useEffect(() => {
    fetch(`/api/cms/content?section=${section}`)
      .then(r => r.json())
      .then((arr) => {
        if (Array.isArray(arr)) {
          const map: Record<string, string> = {}
          arr.forEach((item: any) => { map[item.key] = item.value })
          setData(map)
        }
      })
      .catch(() => {})
  }, [section])
  return data
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const hero = useCmsSection('home_hero')
  const stats = useCmsSection('home_stats')
  const cta = useCmsSection('home_cta')

  function nextSlide() {
    setCurrentSlide(prev => (prev + 1) % recentProductions.length)
  }

  function prevSlide() {
    setCurrentSlide(prev => (prev - 1 + recentProductions.length) % recentProductions.length)
  }

  const heroTitle = hero.title || 'Premium Multimedia Production'
  const heroSubtitle = hero.subtitle || 'Bringing Events to Life Through Cinematic Media & Live Broadcasting'
  const heroDescription = hero.description || 'Professional multimedia production, live streaming, photography, and event technology solutions designed to connect experiences with global audiences.'
  const ctaText = hero.cta_text || 'Book Consultation'
  const ctaLink = hero.cta_link || '/contact'
  const bgImage = hero.background_image || ''

  return (
    <>
      {/* Hero */}
      <section className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-black ${bgImage ? '' : ''}`}>
        {bgImage && (
          <div className="absolute inset-0">
            <img src={bgImage} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,242,254,0.15),transparent_70%)]" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="inline-flex items-center gap-2 text-cyan-400 text-sm uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {heroSubtitle}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            {heroTitle}
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
            {heroDescription}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/live" className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-8 py-3 rounded-full transition-all">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              Watch Live Now
            </Link>
            <Link href={ctaLink} className="inline-flex items-center gap-2 border border-zinc-600 hover:border-cyan-400 text-white font-bold px-8 py-3 rounded-full transition-all">
              {ctaText}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-zinc-500 text-xs uppercase tracking-widest">
          <span>Scroll</span>
          <div className="w-px h-8 bg-zinc-600 mx-auto mt-2 animate-pulse" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-zinc-900">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { key: 'events_covered', label: 'Events Covered', default: '100+' },
            { key: 'projects_completed', label: 'Projects Completed', default: '500+' },
            { key: 'clients_served', label: 'Clients Served', default: '200+' },
            { key: 'years_experience', label: 'Years of Experience', default: '10+' },
          ].map(s => (
            <div key={s.key}>
              <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">{stats[s.key] || s.default}</div>
              <div className="text-sm text-zinc-500 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Marquee Ticker */}
      <section className="py-4 bg-zinc-900 border-y border-zinc-800 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-4 text-sm uppercase tracking-wider text-zinc-400">
              <span>▶ Live Multi-Cam Production</span>
              <span className="text-zinc-600">□</span>
              <span>▶ HLS White-Label Streaming</span>
              <span className="text-zinc-600">□</span>
              <span>▶ Corporate Event Coverage</span>
              <span className="text-zinc-600">□</span>
              <span>▶ Cinematic Documentary Work</span>
              <span className="text-zinc-600">□</span>
              <span>▶ Audio Reinforcement</span>
              <span className="text-zinc-600">□</span>
              <span>▶ Post-Production & Color</span>
              <span className="text-zinc-600">□</span>
            </div>
          ))}
        </div>
      </section>

      {/* Carousel */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-3">Recent Productions</h2>
            <p className="text-zinc-400">A selection of our most recent live & studio work.</p>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {recentProductions.map((prod, i) => (
                  <div key={i} className="min-w-full relative">
                    <div className="aspect-video bg-zinc-800 rounded-2xl flex items-center justify-center">
                      <div className="text-center p-8">
                        <span className="inline-block bg-cyan-400/20 text-cyan-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">{prod.tag}</span>
                        <p className="text-white text-xl md:text-2xl font-semibold">{prod.caption}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-zinc-900/80 hover:bg-zinc-800 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all" aria-label="Previous">←</button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-900/80 hover:bg-zinc-800 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all" aria-label="Next">→</button>
            <div className="flex justify-center gap-2 mt-6">
              {recentProductions.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-cyan-400 w-6' : 'bg-zinc-600'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Homepage CTA */}
      <section className="py-24 px-6 bg-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">{cta.title || "Let's Create Something Exceptional"}</h2>
          <p className="text-zinc-400 text-lg mb-8">{cta.description || 'Ready to elevate your next event or media project? Partner with Dynamic Groove Media.'}</p>
          <Link href={cta.button_link || '/contact'} className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-8 py-3 rounded-full transition-all">
            {cta.button_text || 'Contact Us Today'}
          </Link>
        </div>
      </section>

      {/* Advert Banner */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-5xl mx-auto bg-zinc-800/50 border border-zinc-700 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Featured Partner</p>
            <h3 className="text-3xl font-bold text-white mb-3">Your Brand. Our Platform.</h3>
            <p className="text-zinc-400 mb-6">Partner with Dynamic Groove for white-label live broadcasts reaching thousands on your custom domain — zero YouTube branding.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-6 py-2.5 rounded-full transition-all text-sm">Enquire About Partnership</Link>
          </div>
          <div className="flex-shrink-0 w-full md:w-72 aspect-[728/200] bg-zinc-700 rounded-xl flex items-center justify-center text-zinc-500 text-sm">
            <div className="text-center">
              <span className="block font-bold">CLIENT LOGO / BANNER</span>
              <span className="text-xs">728 × 200 recommended</span>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-3">Our Team</h2>
            <p className="text-zinc-400">The crew behind the lens — and behind the stream.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {teamMembers.map((member, i) => (
              <div key={i} className="group bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all" style={{ animationDelay: `${i}00ms` }}>
                <div className="aspect-[3/4] bg-zinc-800 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold">{member.name}</h3>
                    <p className="text-xs text-cyan-400">{member.role}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-zinc-400">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
