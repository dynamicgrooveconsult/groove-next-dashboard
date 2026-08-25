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
  const [showPreview, setShowPreview] = useState(false)

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

        {/* VIDEO PANEL — on-demand to avoid splitting upload bandwidth */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-zinc-300">Video Preview</h3>
            <button
              onClick={() => setShowPreview((prev) => !prev)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                showPreview
                  ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                  : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
              }`}
            >
              {showPreview ? 'Stop Preview' : 'Load Preview'}
            </button>
          </div>

          {showPreview ? (
            <VideoPlayer lowQuality />
          ) : (
            <div className="relative w-auto mx-auto aspect-video max-h-[70vh] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <div className="text-center space-y-3 px-4">
                <svg className="w-10 h-10 text-zinc-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-zinc-500 text-sm">Preview paused to save bandwidth.</p>
                <p className="text-zinc-600 text-xs">Click &quot;Load Preview&quot; above to start.</p>
              </div>
            </div>
          )}

          <p className="text-[11px] text-zinc-600 mt-2">
            Preview shares upload bandwidth with public viewers — use sparingly during live events.
            It loads at reduced quality to minimise impact.
          </p>
        </div>

        {/* MONITORING PANEL */}
        <StreamStats />
      </div>
    </div>
  )
}
