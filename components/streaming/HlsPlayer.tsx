'use client'

import { useEffect, useRef } from 'react'
import { useStreamStore } from '@/lib/store'

export default function HlsPlayer() {
  const videoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const hlsUrl = useStreamStore((s) => s.hlsUrl)

  useEffect(() => {
    if (!hlsUrl) return
    let cancelled = false

    import('video.js').then((vjsModule) => {
      if (cancelled) return
      const videojs = vjsModule.default

      if (videoRef.current && !playerRef.current) {
        const videoElement = document.createElement('video-js')
        videoElement.className =
          'video-js vjs-big-play-centered object-contain w-full h-full'
        videoRef.current.appendChild(videoElement)

        playerRef.current = videojs(videoElement, {
          autoplay: true,
          controls: true,
          sources: [
            {
              src: hlsUrl,
              type: 'application/x-mpegURL',
            },
          ],
        })
      }
    })

    return () => {
      cancelled = true
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
      if (videoRef.current) {
        videoRef.current.innerHTML = ''
      }
    }
  }, [hlsUrl])

  return (
    <div
      ref={videoRef}
      className="relative w-full max-w-6xl mx-auto aspect-video max-h-[60vh] bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 flex items-center justify-center"
    />
  )
}
