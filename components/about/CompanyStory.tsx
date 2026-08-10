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

export default function CompanyStory() {
  const about = useCmsSection('about_company')
  const story = about.story || 'Dynamic Groove Media is a premier multimedia production and live broadcasting company dedicated to delivering world-class media experiences for events, organizations, brands, and institutions.'

  return (
    <section className="py-32 border-b border-zinc-800 relative">
      <div className="max-w-5xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-yellow-500 text-xs tracking-widest uppercase mb-6">
            About Dynamic Groove Media
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-8">
            Premier Multimedia <br />
            <span className="text-yellow-500">
              Production & Broadcasting
            </span>
          </h1>

          <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
            <p>{story}</p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
