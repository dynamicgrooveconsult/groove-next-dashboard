'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

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

export default function MissionVision() {
  const about = useCmsSection('about_company')
  const mission = about.mission || 'To elevate events, brands, and experiences through innovative multimedia production, live broadcasting excellence, and creative storytelling that connects audiences globally.'
  const vision = about.vision || "To become Africa's leading multimedia and live production brand, recognized for transforming ordinary moments into globally impactful digital experiences through innovation, professionalism, and excellence."

  return (
    <section className="py-32 border-b border-zinc-800 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-yellow-500 text-xs tracking-widest uppercase mb-4">
            Mission Statement
          </p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-snug max-w-5xl">
            {mission}
          </p>
          <p className="text-lg text-zinc-400 mt-6 max-w-3xl leading-relaxed">
            At Dynamic Groove Media, we combine technology, creativity, and precision to deliver immersive visual experiences that leave lasting impressions.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-yellow-500 text-xs tracking-widest uppercase mb-4">
            Vision Statement
          </p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-snug max-w-5xl">
            {vision}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
