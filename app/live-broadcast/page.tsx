'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import StreamTabs from '@/components/streaming/StreamTabs'
import VideoPlayer from '@/components/streaming/VideoPlayer'
import { useStreamStore } from '@/lib/store'

export default function LiveBroadcastPage() {
  const { setActiveSource } = useStreamStore()

  // Default to the direct stream source so the player shows immediately
  useEffect(() => {
    setActiveSource('hls')
  }, [setActiveSource])

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="border-b border-zinc-800 pb-4">
          <StreamTabs />
        </div>

        {/* VIDEO PANEL */}
        <VideoPlayer />

        {/* HOME NAVIGATION */}
        <div className="flex justify-center pt-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-yellow-500 transition-colors"
            aria-label="Back to Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M11.47 3.22a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.97-6.97V21a.75.75 0 0 1-1.5 0V4.81l-6.97 6.97a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" />
            </svg>
            <span className="text-sm font-semibold uppercase">Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
