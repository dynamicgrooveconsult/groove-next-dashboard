'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Lightbox from '@/components/portfolio/Lightbox'

interface CarouselItem {
  id: string | number
  type: 'image' | 'video'
  src: string
  title?: string
}

export default function HomeGalleryCarousel() {
  const [items, setItems] = useState<CarouselItem[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    supabase
      .from('portfolio_items')
      .select('id, title, type, image_url, video_url')
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) {
          setItems(
            data.map((item: any) => ({
              id: item.id,
              type: item.type || (item.video_url ? 'video' : 'image'),
              src: item.video_url || item.image_url,
              title: item.title,
            }))
          )
        }
      })
  }, [])

  if (!items.length) return null

  const allItems = [...items, ...items]

  return (
    <section className="py-20 bg-black overflow-hidden">
      <div className="container mx-auto px-4 mb-10 text-center md:text-left">
        <h2 className="text-4xl font-bold text-white">Our Gallery</h2>
        <p className="text-zinc-400 mt-2">A glimpse into our creative world.</p>
      </div>

      <div className="relative flex w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex gap-4 animate-marquee"
          style={{ animationDuration: '18s', width: 'max-content' }}
          onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = 'paused' }}
          onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = 'running' }}
        >
          {allItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="relative min-w-[280px] md:min-w-[320px] h-[300px] md:h-[380px] rounded-2xl overflow-hidden group cursor-pointer border border-zinc-800"
              onClick={() => {
                const originalIdx = items.findIndex(p => p.id === item.id)
                if (originalIdx !== -1) setActiveIndex(originalIdx)
              }}
            >
              <img
                src={item.src}
                alt={item.title || ''}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-yellow-500 font-bold">{item.title}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
      </div>

      <AnimatePresence>
        {activeIndex !== null && activeIndex >= 0 && activeIndex < items.length && (
          <Lightbox
            items={items}
            activeIndex={activeIndex}
            onClose={() => setActiveIndex(null)}
            onNavigate={setActiveIndex}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
