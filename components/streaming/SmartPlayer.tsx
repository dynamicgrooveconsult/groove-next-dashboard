'use client'

import { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { useStreamStore } from '@/lib/store'
import StandbyOverlay from './StandbyOverlay'

const HLS_STREAM_URL = 'http://127.0.0.1:8585/hls/stream.m3u8'

export default function SmartPlayer() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)
  const [localLive, setLocalLive] = useState(false)

  const { activeSource, setIsLive } = useStreamStore()

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
      'video-js vjs-big-play-centered w-full h-full'
    videoElement.setAttribute('playsinline', 'true')
    videoElement.setAttribute('muted', 'true') // ✅ helps autoplay instantly

    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(videoElement)

    const player = videojs(videoElement, {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      preload: 'metadata', // ✅ Faster startup
      liveui: true,
      html5: {
        vhs: {
          enableLowInitialPlaylist: true, // ✅ Faster initial segment
          smoothQualityChange: true,
          overrideNative: true,
        },
      },
      sources: [
        {
          src: HLS_STREAM_URL + '?t=' + Date.now(), // ✅ Avoid cache delay
          type: 'application/x-mpegURL',
        },
      ],
    })

    playerRef.current = player

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
          src: HLS_STREAM_URL + '?t=' + Date.now(),
          type: 'application/x-mpegURL',
        })
      }, 2000) // ✅ Faster retry
    })

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [activeSource, setIsLive])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {!localLive && <StandbyOverlay label="Native HLS" />}
    </div>
  )
}