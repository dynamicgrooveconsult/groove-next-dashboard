'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface FeaturedEvent {
  youtube_url: string
  event_type: string
  celebrant_name: string
  event_date: string | null
  is_active: boolean
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=0`
  }
  return null
}

export default function FeaturedEventSection() {
  const [event, setEvent] = useState<FeaturedEvent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('featured_event')
      .select('youtube_url, event_type, celebrant_name, event_date, is_active')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setEvent(data)
        setLoading(false)
      })
  }, [])

  if (loading) return null
  if (!event || !event.is_active) return null

  const embedUrl = getYouTubeEmbedUrl(event.youtube_url)
  if (!embedUrl) return null

  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            Featured Broadcast
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Watch Our Latest Event
          </h2>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="aspect-video w-full bg-black">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="inline-block bg-cyan-400/20 text-cyan-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                {event.event_type}
              </span>
              {event.celebrant_name && (
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {event.celebrant_name}
                </h3>
              )}
            </div>
            {formattedDate && (
              <div className="text-zinc-400 text-sm">
                📅 {formattedDate}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}