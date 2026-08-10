'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import CategoryFilter from '@/components/portfolio/CategoryFilter'
import MasonryGallery from '@/components/portfolio/MasonryGallery'
import Lightbox from '@/components/portfolio/Lightbox'

const categories = [
  'All',
  'Weddings',
  'Church Programs',
  'Corporate Events',
  'Livestream Productions',
  'School Events',
  'Others',
]

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch portfolio')
        return r.json()
      })
      .then((data) => {
        const mapped = (data || []).map((item: any) => ({
          id: item.id,
          category: item.category,
          type: item.type || (item.video_url ? 'video' : 'image'),
          src: item.video_url || item.image_url,
          title: item.title,
        }))
        setProjects(mapped)
      })
      .catch((err) => {
        setFetchError(err.message)
        setProjects([])
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* HERO */}
      <section className="py-28 border-b border-zinc-800 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-yellow-500 text-xs tracking-widest uppercase mb-6">
            Featured Projects
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Our Work Speaks
            <br />
            <span className="text-yellow-500">
              For Itself
            </span>
          </h1>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        setSelected={setSelectedCategory}
      />

      {/* MASONRY GALLERY */}
      {loading ? (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6 text-center text-zinc-500">
            Loading projects...
          </div>
        </section>
      ) : fetchError ? (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-red-400 text-sm mb-2">Failed to load portfolio</p>
            <p className="text-zinc-600 text-xs">{fetchError}</p>
          </div>
        </section>
      ) : filtered.length === 0 ? (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6 text-center text-zinc-500">
            No projects found in this category.
          </div>
        </section>
      ) : (
        <MasonryGallery
          items={filtered}
          onClickItem={(item: any) => {
            const idx = filtered.findIndex(p => p.id === item.id)
            setActiveIndex(idx)
          }}
        />
      )}

      {/* LIGHTBOX */}
      <AnimatePresence>
        {activeIndex !== null && activeIndex >= 0 && activeIndex < filtered.length && (
          <Lightbox
            items={filtered}
            activeIndex={activeIndex}
            onClose={() => setActiveIndex(null)}
            onNavigate={setActiveIndex}
          />
        )}
      </AnimatePresence>

    </div>
  )
}
