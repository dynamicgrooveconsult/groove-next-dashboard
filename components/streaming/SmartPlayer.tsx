'use client'

import { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { useStreamStore } from '@/lib/store'
import StandbyOverlay from './StandbyOverlay'

interface SmartPlayerProps {
  lowQuality?: boolean
}

const DEFAULT_HLS_URL = 'https://stream.dynamicgrooveconsult.com/hls/stream.m3u8'

// Reconnect attempts back off exponentially instead of hammering the
// Cloudflare tunnel / origin with a new request every 2s on each error.
const BASE_RETRY_MS = 3000
const MAX_RETRY_MS = 15000

export default function SmartPlayer({ lowQuality = false }: SmartPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [localLive, setLocalLive] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  const activeSource = useStreamStore((s) => s.activeSource)
  const hlsUrl = useStreamStore((s) => s.hlsUrl)
  const setIsLive = useStreamStore((s) => s.setIsLive)

  const activeHlsUrl = hlsUrl || DEFAULT_HLS_URL

  useEffect(() => {
    if (activeSource !== 'hls') return
    if (!containerRef.current) return

    const cancelRetry = () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
        retryTimerRef.current = null
      }
    }

    cancelRetry()
    if (playerRef.current) {
      playerRef.current.dispose()
      playerRef.current = null
    }
    containerRef.current.innerHTML = ''
    setLocalLive(false)
    setIsMuted(true)

    const videoElement = document.createElement('video')
    videoElement.className = 'video-js vjs-big-play-centered w-full h-full bg-black'
    videoElement.setAttribute('playsinline', 'true')
    videoElement.setAttribute('webkit-playsinline', 'true')

    videoElement.style.width = '100%'
    videoElement.style.height = '100%'
    videoElement.style.objectFit = 'contain'

    containerRef.current.appendChild(videoElement)

    const player = videojs(videoElement, {
      // Start muted so Chrome/most browsers allow instant autoplay —
      // sound is enabled via the "Tap to unmute" overlay below, which
      // counts as a user gesture Chrome requires for audible playback.
      autoplay: true,
      muted: true,
      controls: true,
      preload: 'auto',
      liveui: true,
      fluid: false,
      aspectRatio: '16:9',
      html5: {
        vhs: {
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
          overrideNative: true,
          brokenManifestMaxRetry: 2,
          playlistExclusionDuration: 180,
          ...(lowQuality && { bandwidth: 1000000 }),
        },
      },
      sources: [{ src: activeHlsUrl, type: 'application/x-mpegURL' }],
    })

    playerRef.current = player

    let retryAttempts = 0

    const scheduleRetry = () => {
      cancelRetry()

      const backoff = Math.min(
        BASE_RETRY_MS * Math.pow(2, retryAttempts),
        MAX_RETRY_MS
      )
      retryAttempts += 1

      retryTimerRef.current = setTimeout(() => {
        retryTimerRef.current = null
        const current = playerRef.current
        if (!current || current.isDisposed()) return

        setLocalLive(false)
        setIsLive(false)
        current.src({ src: activeHlsUrl, type: 'application/x-mpegURL' })
        current.load()
      }, backoff)
    }

    player.ready(() => {
      player.muted(true)
      player.volume(1.0)

      const techEl = player.el().querySelector('video') as HTMLVideoElement | null
      if (techEl) {
        techEl.style.width = '100%'
        techEl.style.height = '100%'
        techEl.style.objectFit = 'contain'
      }
      const wrapperEl = player.el() as HTMLElement
      wrapperEl.style.width = '100%'
      wrapperEl.style.height = '100%'
    })

    player.on('playing', () => {
      cancelRetry()
      retryAttempts = 0
      setLocalLive(true)
      setIsLive(true)
    })

    // Keep our unmute-button state in sync if the viewer uses video.js's
    // own built-in mute control in the control bar.
    player.on('volumechange', () => {
      setIsMuted(player.muted() ?? true)
    })

    player.on('error', scheduleRetry)

    return () => {
      cancelRetry()
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [activeSource, activeHlsUrl, setIsLive, lowQuality])

  const handleUnmute = () => {
    const player = playerRef.current
    if (!player) return
    player.muted(false)
    player.volume(1.0)
    setIsMuted(false)
    // Some browsers need an explicit play() call right after the
    // gesture-driven unmute to keep playback going smoothly.
    const playPromise = player.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If it still fails, leave state as-is — control bar's own
        // play/mute buttons remain available as a fallback.
      })
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div ref={containerRef} className="w-full h-full relative" />

      {localLive && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-red-600 pl-2 pr-3 py-1 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <span className="text-white text-xs font-bold tracking-wide">
            LIVE
          </span>
        </div>
      )}

      {localLive && isMuted && (
        <button
          onClick={handleUnmute}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <span className="flex items-center gap-2 rounded-full bg-black/70 hover:bg-black/85 text-white px-6 py-3 text-base font-semibold backdrop-blur-sm border border-white/20 transition-colors shadow-lg">
            🔇 Tap to unmute
          </span>
        </button>
      )}

      {!localLive && <StandbyOverlay label="Direct Stream" />}
    </div>
  )
}