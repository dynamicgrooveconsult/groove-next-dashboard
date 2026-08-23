'use client'

import { useEffect } from 'react'
import StreamTabs from '@/components/streaming/StreamTabs'
import VideoPlayer from '@/components/streaming/VideoPlayer'
import { useStreamStore } from '@/lib/store'

export default function LiveBroadcastPage() {
  const { setActiveSource } = useStreamStore()

  // Default to the native HLS source so the player shows immediately
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
      </div>
    </div>
  )
}
