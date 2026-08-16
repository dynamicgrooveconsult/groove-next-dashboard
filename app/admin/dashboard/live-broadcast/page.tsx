'use client'

import { useEffect, useState } from 'react'
import StreamTabs from '@/components/streaming/StreamTabs'
import VideoPlayer from '@/components/streaming/VideoPlayer'
import StreamStats from '@/components/streaming/StreamStats'
import StreamSettingsPanel from '@/components/streaming/StreamSettingsPanel'
import { useStreamStore } from '@/lib/store'

export default function LiveBroadcastAdminPage() {
  const {
    setActiveSource,
    youtubeId,
    setYoutubeId,
    isChannel,
    setIsChannel,
    facebookInput,
    setFacebookInput,
    hlsUrl,
    setHlsUrl,
  } = useStreamStore()

  const [isEditing, setIsEditing] = useState(false)

  // Default to the native HLS source so the player shows immediately
  useEffect(() => {
    setActiveSource('hls')
  }, [setActiveSource])

  /* ================= LOCAL STORAGE ================= */

  useEffect(() => {
    const savedYT = localStorage.getItem('yt-channel-id')
    const savedFB = localStorage.getItem('fb-video-input')
    const savedHLS = localStorage.getItem('hls-url')

    if (savedYT) setYoutubeId(savedYT)
    if (savedFB) setFacebookInput(savedFB)
    if (savedHLS) setHlsUrl(savedHLS)
  }, [setYoutubeId, setFacebookInput, setHlsUrl])

  useEffect(() => {
    localStorage.setItem('yt-channel-id', youtubeId)
  }, [youtubeId])

  useEffect(() => {
    localStorage.setItem('fb-video-input', facebookInput)
  }, [facebookInput])

  useEffect(() => {
    localStorage.setItem('hls-url', hlsUrl)
  }, [hlsUrl])

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Live Broadcast Monitor</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Monitor and manage the current broadcast.
          </p>
        </div>

        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <StreamTabs />

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-zinc-500 hover:text-yellow-500 underline"
          >
            {isEditing ? 'Hide Settings' : 'Edit Stream Settings'}
          </button>
        </div>

        {/* SETTINGS PANEL */}
        {isEditing && <StreamSettingsPanel />}

        {/* VIDEO PANEL */}
        <VideoPlayer />

        {/* MONITORING PANEL */}
        <StreamStats />
      </div>
    </div>
  )
}
