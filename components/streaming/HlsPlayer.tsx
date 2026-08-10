'use client'

import { useEffect, useRef } from 'react'

const HLS_STREAM_URL = 'http://localhost:8585/hls/stream.m3u8'

export default function HlsPlayer() {
  const videoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false

    import('video.js').then((vjsModule) => {
      if (cancelled) return
      const videojs = vjsModule.default

      if (videoRef.current && !playerRef.current) {
        const videoElement = document.createElement('video-js')
        videoElement.className = 'vjs-big-play-centered w-full h-full'
        videoRef.current.appendChild(videoElement)

        playerRef.current = videojs(videoElement, {
          autoplay: true,
          controls: true,
          responsive: true,
          fluid: true,
          sources: [
            {
              src: HLS_STREAM_URL,
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
  }, [])

  return <div ref={videoRef} className="w-full h-full" />
}
