'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface CeoData {
  full_name: string
  position: string
  short_bio: string
  full_biography: string
  photo_url: string
  facebook_link: string
  instagram_link: string
  linkedin_link: string
  youtube_link: string
  email_address: string
  phone_number: string
}

const socialIcons: Record<string, string> = {
  facebook_link: '📘',
  instagram_link: '📷',
  linkedin_link: '💼',
  youtube_link: '▶️',
}

export default function CeoBio() {
  const [ceo, setCeo] = useState<CeoData | null>(null)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    fetch('/api/ceo')
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setCeo(data)
          setImgError(false)
        }
      })
      .catch(() => {})
  }, [])

  const name = ceo?.full_name || 'Oluwanise Israel Tope'
  const title = ceo?.position || 'Principal Multimedia Consultant & Event Specialist'
  const shortBio = ceo?.short_bio || 'Oluwanise Israel Tope is a passionate multimedia consultant, live broadcast specialist, and creative technology strategist with extensive experience in professional media production, event coverage, and digital broadcasting.'
  const fullBio = ceo?.full_biography || 'Through Dynamic Groove Media, he bridges the gap between physical experiences and global digital audiences using modern broadcasting technologies and creative storytelling.'
  const photoUrl = ceo?.photo_url
  const showPhoto = photoUrl && !imgError

  const handleImgError = useCallback(() => setImgError(true), [])

  const socialLinks = [
    { key: 'facebook_link', url: ceo?.facebook_link, label: 'Facebook' },
    { key: 'instagram_link', url: ceo?.instagram_link, label: 'Instagram' },
    { key: 'linkedin_link', url: ceo?.linkedin_link, label: 'LinkedIn' },
    { key: 'youtube_link', url: ceo?.youtube_link, label: 'YouTube' },
  ].filter((s) => s.url)

  return (
    <section className="py-32 border-b border-zinc-800 relative">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`${showPhoto ? '' : 'bg-zinc-900'} border border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center`}
          style={showPhoto ? {} : { height: '420px' }}
        >
          {showPhoto ? (
            <img
              src={photoUrl}
              alt={name}
              onError={handleImgError}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-zinc-600">CEO Portrait</span>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-yellow-500 text-xs tracking-widest uppercase mb-4">
            Leadership
          </p>

          <h2 className="text-4xl font-bold mb-2">
            {name}
          </h2>

          <p className="text-yellow-500 mb-6">
            {title}
          </p>

          <p className="text-zinc-400 leading-relaxed mb-6">
            {shortBio}
          </p>

          <p className="text-zinc-400 leading-relaxed mb-8">
            {fullBio}
          </p>

          {socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-sm text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/30 transition"
                >
                  <span>{socialIcons[s.key] || '🔗'}</span>
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  )
}
