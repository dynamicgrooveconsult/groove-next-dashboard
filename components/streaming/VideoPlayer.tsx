'use client'

import { useState } from 'react'
import { useStreamStore } from '@/lib/store'
import SmartPlayer from './SmartPlayer'
import StandbyOverlay from './StandbyOverlay'

const ROOM_NAME = 'DYNAMIC_GROOVE'
const ROOM_PASSWORD = 'YOUR_PASSWORD'

function GuestProtected() {
  const [authorized, setAuthorized] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  const directorUrl = `https://vdo.ninja/?director=${ROOM_NAME}&pwd=${ROOM_PASSWORD}`
  const guestUrl = `https://vdo.ninja/?room=${ROOM_NAME}&pwd=${ROOM_PASSWORD}`

  if (!authorized) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div className="w-full max-w-sm bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-center space-y-4">
          <h3 className="text-yellow-500 font-semibold">🔒 Guest Session Access</h3>

          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-black border border-zinc-700 px-4 py-2 rounded"
            placeholder="Enter guest access code"
          />

          {error && <p className="text-red-400 text-sm">Invalid code</p>}

          <button
            onClick={async () => {
              const res = await fetch('/api/guest-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
              })

              if (res.ok) {
                setAuthorized(true)
              } else {
                setError(true)
              }
            }}
            className="w-full bg-yellow-500 text-black px-6 py-2 rounded-full"
          >
            Unlock
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="text-center space-y-5 px-4">
        <h2 className="text-yellow-500 font-bold uppercase tracking-wider">
          🎛 Director Control Panel
        </h2>

        <div className="bg-zinc-900 p-3 rounded border border-zinc-800 break-all text-sm max-w-md">
          {guestUrl}
        </div>

        <button
          onClick={() =>
            window.open(directorUrl, '_blank', 'noopener,noreferrer')
          }
          className="bg-yellow-500 text-black px-5 py-2 rounded font-semibold"
        >
          Launch Director Console
        </button>
      </div>
    </div>
  )
}

export default function VideoPlayer() {
  const { activeSource, youtubeId, isChannel, facebookInput } = useStreamStore()

  const getYouTubeEmbed = () => {
    if (!youtubeId) return null
    return isChannel
      ? `https://www.youtube.com/embed/live_stream?channel=${youtubeId}&autoplay=1`
      : `https://www.youtube.com/embed/${youtubeId}?autoplay=1`
  }

  const getFacebookEmbed = () => {
    if (!facebookInput) return null

    let videoUrl = facebookInput.trim()

    if (videoUrl.includes('<iframe')) {
      const match = videoUrl.match(/src="([^"]+)"/)
      if (match && match[1]) {
        return match[1]
      }
    }

    if (videoUrl.includes('/videos/')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        videoUrl
      )}&show_text=false&autoplay=1`
    }

    return null
  }

  const youtubeEmbed = getYouTubeEmbed()
  const facebookEmbed = getFacebookEmbed()

  return (
    <div
      className="relative w-auto mx-auto aspect-video max-h-[70vh] rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-2xl"
      style={{ maxWidth: 'min(72rem, 100%, calc(70vh * 16 / 9))' }}
    >
      {activeSource === 'hls' && <SmartPlayer />}

      {activeSource === 'youtube' &&
        (youtubeEmbed ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={youtubeEmbed}
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          />
        ) : (
          <StandbyOverlay label="YouTube Live" />
        ))}

      {activeSource === 'facebook' &&
        (facebookEmbed ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={facebookEmbed}
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          />
        ) : (
          <StandbyOverlay label="Facebook Live" />
        ))}

      {activeSource === 'guest' && <GuestProtected />}
    </div>
  )
}
