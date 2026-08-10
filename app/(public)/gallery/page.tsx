'use client'

import { useState } from 'react'

const categories = [
  { id: 'all', label: 'All' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'burial', label: 'Burial' },
  { id: 'corporate', label: 'Corporate Event' },
  { id: 'others', label: 'Others' },
] as const

type CategoryId = typeof categories[number]['id']

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all')

  return (
    <>
      {/* Hero */}
      <section className="relative py-32 px-6 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-cyan-400 mb-3">Past Events</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Event <em className="text-cyan-400 not-italic">Gallery</em>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Browse our archive of live productions, organized by event type.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-12" role="tablist">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-cyan-400 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Categories */}
          {[
            { id: 'wedding' as CategoryId, title: 'Weddings', marker: 'bg-cyan-400', events: 3, tag: 'Wedding', tagColor: 'bg-cyan-400/20 text-cyan-400' },
            { id: 'burial' as CategoryId, title: 'Burials & Memorials', marker: 'bg-violet-500', events: 2, tag: 'Memorial', tagColor: 'bg-violet-500/20 text-violet-400' },
            { id: 'corporate' as CategoryId, title: 'Corporate Events', marker: 'bg-amber-400', events: 2, tag: 'Corporate', tagColor: 'bg-amber-400/20 text-amber-400' },
            { id: 'others' as CategoryId, title: 'Others', marker: 'bg-white', events: 1, tag: 'Other', tagColor: 'bg-zinc-500/20 text-zinc-400' },
          ].map(section => (
            <div key={section.id} className={`mb-16 ${activeCategory !== 'all' && activeCategory !== section.id ? 'hidden' : ''}`}>
              <div className="flex items-center gap-3 mb-6">
                <span className={`w-2 h-2 rounded-full ${section.marker}`} />
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                <span className="text-xs text-zinc-500">{section.events} events</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(section.events)].map((_, i) => (
                  <article key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-2 gap-1 p-1">
                      {[1, 2, 3, 4].map(j => (
                        <div key={j} className="aspect-square bg-zinc-800 rounded" />
                      ))}
                    </div>
                    <div className="aspect-video bg-zinc-800 m-1 rounded-lg flex items-center justify-center">
                      <span className="text-2xl text-zinc-600">▶</span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-bold text-sm mb-2">Event Title {i + 1}</h3>
                      <div className="flex flex-wrap gap-2 text-[10px]">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${section.tagColor}`}>{section.tag}</span>
                        <span className="text-zinc-500 font-mono">Jan 2025</span>
                        <span className="text-zinc-500 font-mono">Lagos, Nigeria</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
