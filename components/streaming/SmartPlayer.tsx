'use client'

import { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { useStreamStore } from '@/lib/store'
import StandbyOverlay from './StandbyOverlay'

interface SmartPlayerProps {
  lowQuality?: boolean
}

// Fallback default stream URL pointing to your working NGINX Cloudflare tunnel
const DEFAULT_HLS_URL = 'https://stream.dynamicgrooveconsult.com/hls/stream.m3u8'

export default function SmartPlayer({ lowQuality = false }: SmartPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)
  const [localLive, setLocalLive] = useState(false)

  const { activeSource, setIsLive, hlsUrl } = useStreamStore()

  // Use store url if available, otherwise fallback to default working stream
  const activeHlsUrl = hlsUrl || DEFAULT_HLS_URL

  useEffect(() => {
    if (activeSource !== 'hls') return
    if (!containerRef.current) return

    // ✅ Clean previous instance safely
    if (playerRef.current) {
      playerRef.current.dispose()
      playerRef.current = null
    }

    const videoElement = document.createElement('video')
    videoElement.className =
      'video-js vjs-big-play-centered object-contain w-full h-full'
    videoElement.setAttribute('playsinline', 'true')

    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(videoElement)

    const player = videojs(videoElement, {
      autoplay: true,
      muted: false, // ✅ Explicitly unmuted so audio outputs immediately
      controls: true,
      preload: 'auto',
      liveui: true,
      html5: {
        vhs: {
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
          overrideNative: true,
          // Only cap bandwidth if explicitly requested for low-quality admin preview
          ...(lowQuality && { bandwidth: 1000000 }),
        },
      },
      sources: [
        {
          src: activeHlsUrl + '?t=' + Date.now(), // ✅ Avoid cache delay
          type: 'application/x-mpegURL',
        },
      ],
    })

    playerRef.current = player

    // ✅ Ensure volume is up once player is ready
    player.ready(() => {
      player.muted(false)
      player.volume(1.0)
    })

    // ✅ When stream starts
    player.on('playing', () => {
      setLocalLive(true)
      setIsLive(true)
    })

    // ✅ Auto-retry quickly if playlist not ready
    player.on('error', () => {
      setLocalLive(false)
      setIsLive(false)

      setTimeout(() => {
        if (!playerRef.current) return

        playerRef.current.src({
          src: activeHlsUrl + '?t=' + Date.now(),
          type: 'application/x-mpegURL',
        })
        playerRef.current.load()
      }, 2000)
    })

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [activeSource, activeHlsUrl, setIsLive, lowQuality])

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="w-full h-full" />
      {!localLive && <StandbyOverlay label="Direct Stream" />}
    </div>
  )
}