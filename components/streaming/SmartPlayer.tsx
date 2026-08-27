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

export default function SmartPlayer({ lowQuality = false }: SmartPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)
  const [localLive, setLocalLive] = useState(false)

  const { activeSource, setIsLive, hlsUrl } = useStreamStore()
  const activeHlsUrl = hlsUrl || DEFAULT_HLS_URL

  useEffect(() => {
    if (activeSource !== 'hls') return
    if (!containerRef.current) return

    if (playerRef.current) {
      playerRef.current.dispose()
      playerRef.current = null
    }

    const videoElement = document.createElement('video')
    // ✅ Updated layout sizing classes to prevent mobile cropping and distortion
    videoElement.className =
      'video-js vjs-big-play-centered object-contain w-full h-full bg-black'
    videoElement.setAttribute('playsinline', 'true')
    videoElement.setAttribute('webkit-playsinline', 'true')

    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(videoElement)

    const player = videojs(videoElement, {
      autoplay: true,
      muted: false,
      controls: true,
      preload: 'auto',
      liveui: true,
      fluid: false, // Ensures layout container handles scaling smoothly
      html5: {
        vhs: {
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
          overrideNative: true,
          ...(lowQuality && { bandwidth: 1000000 }),
        },
      },
      sources: [
        {
          src: activeHlsUrl + '?t=' + Date.now(),
          type: 'application/x-mpegURL',
        },
      ],
    })

    playerRef.current = player

    player.ready(() => {
      player.muted(false)
      player.volume(1.0)
    })

    player.on('playing', () => {
      setLocalLive(true)
      setIsLive(true)
    })

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
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div ref={containerRef} className="w-full h-full relative" />
      {!localLive && <StandbyOverlay label="Direct Stream" />}
    </div>
  )
}