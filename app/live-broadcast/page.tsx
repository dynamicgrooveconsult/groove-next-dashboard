'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import SmartPlayer from '@/components/streaming/SmartPlayer'
import StandbyOverlay from '@/components/streaming/StandbyOverlay'
import { useStreamStore } from '@/lib/store'

const tabs = [
  { key: 'hls', label: 'NATIVE HLS' },
  { key: 'youtube', label: 'YOUTUBE LIVE' },
  { key: 'facebook', label: 'FACEBOOK LIVE' },
  { key: 'guest', label: 'GUEST INTERVIEW' },
] as const

const ACCESS_CODE = 'DGM2024'

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
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-center space-y-4">
          <h3 className="text-yellow-500 font-semibold">
            🔒 Guest Session Access
          </h3>

          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-black border border-zinc-700 px-4 py-2 rounded"
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
            className="bg-yellow-500 text-black px-6 py-2 rounded-full"
          >
            Unlock
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-center space-y-5">
        <h2 className="text-yellow-500 font-bold uppercase tracking-wider">
          🎛 Director Control Panel
        </h2>

        <div className="bg-zinc-900 p-3 rounded border border-zinc-800 break-all text-sm">
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

export default function LiveBroadcastPage() {
  const {
    activeSource,
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

  const [authorized, setAuthorized] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [bitrate, setBitrate] = useState<number | null>(null)
  const [clients, setClients] = useState<number | null>(null)

  /* ================= ACCESS CONTROL ================= */

  useEffect(() => {
    const saved = sessionStorage.getItem('dgm-access')
    if (saved === 'granted') {
      setAuthorized(true)
    }
  }, [])

  // Shake animation trigger for wrong code
  const triggerShake = () => {
    const el = cardRef.current
    if (!el) return
    el.classList.remove('shake')
    void el.offsetWidth
    el.classList.add('shake')
  }

  // After success, fade out then authorize
  useEffect(() => {
    if (leaving) {
      const t = setTimeout(() => setAuthorized(true), 500)
      return () => clearTimeout(t)
    }
  }, [leaving])

  const handleUnlock = () => {
    if (!code.trim()) {
      setError('Please enter your access code.')
      triggerShake()
      return
    }

    setLoading(true)
    setError('')

    // Simulate brief check delay for UX
    setTimeout(() => {
      if (code.trim() === ACCESS_CODE) {
        sessionStorage.setItem('dgm-access', 'granted')
        setLeaving(true)
      } else {
        setError('Invalid access code — please try again.')
        triggerShake()
      }
      setLoading(false)
    }, 300)
  }

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

  /* ================= RTMP STATS ================= */

  useEffect(() => {
    let origin: string | null = null
    try {
      origin = new URL(hlsUrl).origin
    } catch {
      origin = null
    }

    const fetchStats = async () => {
      if (!origin) {
        setBitrate(null)
        setClients(null)
        return
      }

      try {
        const res = await fetch(`${origin}/stat`)
        const text = await res.text()

        const bitrateMatch = text.match(/<bw_in>(\d+)<\/bw_in>/)
        const clientMatch = text.match(/<nclients>(\d+)<\/nclients>/)

        if (bitrateMatch) setBitrate(parseInt(bitrateMatch[1]))
        if (clientMatch) setClients(parseInt(clientMatch[1]))
      } catch {
        setBitrate(null)
        setClients(null)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 3000)
    return () => clearInterval(interval)
  }, [hlsUrl])

  /* ================= URL BUILDERS ================= */

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

  if (!authorized) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0f] flex items-center justify-center px-4">
        {/* Background glow layers */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/3 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[100px]" />

        {/* Access card */}
        <div
          ref={cardRef}
          className={`relative z-10 w-full max-w-md rounded-3xl border border-cyan-500/20 bg-zinc-900/70 p-8 sm:p-10 shadow-2xl backdrop-blur-xl transition-all duration-500 animate-fadeSlideUp ${
            leaving ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          {/* Lock icon */}
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>

          {/* Live badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
              Live Broadcast
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-3 text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
            Private Access Required
          </h1>

          {/* Helper text */}
          <p className="mb-8 text-sm leading-relaxed text-zinc-400">
            This live broadcast is private. Please enter the{' '}
            <span className="font-semibold text-zinc-200">Event Access Code</span> to watch.
          </p>

          {/* Input */}
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Event Access Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              if (error) setError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            placeholder="Enter your code..."
            className="w-full rounded-xl border border-zinc-700 bg-black/60 px-4 py-3 tracking-[0.15em] text-white placeholder-zinc-600 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
          />

          {/* Error message */}
          {error && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Unlock button */}
          <button
            onClick={handleUnlock}
            disabled={loading}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 py-3.5 font-bold uppercase tracking-wide text-black shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-400/50 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Verifying...
              </>
            ) : (
              <>
                Unlock Stream
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </>
            )}
          </button>

          {/* Contact link */}
          <p className="mt-6 text-center text-sm text-zinc-500">
            Don&apos;t have an access code?{' '}
            <Link
              href="/contact"
              className="font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Contact us to request one.
            </Link>
          </p>
        </div>

        {/* Animations */}
        <style jsx>{`
          @keyframes fadeSlideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          :global(.animate-fadeSlideUp) {
            animation: fadeSlideUp 0.6s ease-out;
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-8px); }
            40%, 80% { transform: translateX(8px); }
          }
          :global(.shake) {
            animation: shake 0.4s ease-in-out;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSource(tab.key)}
                className={`font-bold pb-1 ${
                  activeSource === tab.key
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-zinc-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-zinc-500 hover:text-yellow-500 underline"
          >
            {isEditing ? 'Hide Settings' : 'Edit Stream Settings'}
          </button>
        </div>

        {/* SETTINGS PANEL */}
        {isEditing && (
          <div className="bg-zinc-900 p-5 rounded-lg border border-zinc-800 space-y-4">

            <div>
              <label className="text-xs text-zinc-400 uppercase">
                Native HLS URL
              </label>
              <input
                value={hlsUrl}
                onChange={(e) => setHlsUrl(e.target.value)}
                placeholder="http://192.168.1.50:8585/hls/stream.m3u8"
                className="w-full bg-black border border-zinc-700 px-3 py-2 rounded text-sm mt-2"
              />
              <p className="text-xs text-zinc-600 mt-1">
                The .m3u8 playlist URL your media server serves (e.g. your LAN
                IP so mobile &amp; remote viewers can connect).
              </p>
            </div>

            <div>
              <label className="text-xs text-zinc-400 uppercase">
                YouTube Channel / Video ID
              </label>
              <div className="flex gap-3 mt-2">
                <input
                  value={youtubeId}
                  onChange={(e) => setYoutubeId(e.target.value)}
                  className="flex-1 bg-black border border-zinc-700 px-3 py-2 rounded text-sm"
                />
                <button
                  onClick={() => setIsChannel(!isChannel)}
                  className="bg-zinc-800 px-3 py-2 rounded text-xs"
                >
                  Mode: {isChannel ? 'Channel' : 'Video ID'}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-400 uppercase">
                Facebook Video URL / Embed
              </label>
              <input
                value={facebookInput}
                onChange={(e) => setFacebookInput(e.target.value)}
                className="w-full bg-black border border-zinc-700 px-3 py-2 rounded text-sm mt-2"
              />
            </div>

          </div>
        )}

        {/* VIDEO PANEL */}
        <div className="relative w-full max-w-full aspect-video max-h-[60vh] mx-auto bg-black rounded-lg border border-zinc-800 overflow-hidden">

          {activeSource === 'hls' && <SmartPlayer />}

          {activeSource === 'youtube' && (
            getYouTubeEmbed()
              ? <iframe className="w-full h-full" src={getYouTubeEmbed() || undefined} allowFullScreen />
              : <StandbyOverlay label="YouTube Live" />
          )}

          {activeSource === 'facebook' && (
            getFacebookEmbed()
              ? <iframe className="w-full h-full" src={getFacebookEmbed() || undefined} allowFullScreen />
              : <StandbyOverlay label="Facebook Live" />
          )}

          {activeSource === 'guest' && <GuestProtected />}

        </div>

        {/* MONITORING PANEL */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-zinc-900 p-4 rounded border border-zinc-800">
            <p className="text-xs text-zinc-500">Bitrate</p>
            <p className="text-lg font-bold text-green-400">
              {bitrate ? `${bitrate} kbps` : '—'}
            </p>
          </div>

          <div className="bg-zinc-900 p-4 rounded border border-zinc-800">
            <p className="text-xs text-zinc-500">Viewers</p>
            <p className="text-lg font-bold text-yellow-400">
              {clients ?? '—'}
            </p>
          </div>

          <div className="bg-zinc-900 p-4 rounded border border-zinc-800">
            <p className="text-xs text-zinc-500">Bandwidth</p>
            <p className="text-lg font-bold text-blue-400">
              {bitrate ? `${(bitrate / 1000).toFixed(2)} Mbps` : '—'}
            </p>
          </div>

          <div className="bg-zinc-900 p-4 rounded border border-zinc-800">
            <p className="text-xs text-zinc-500">Stream Strength</p>
            <p className={`text-lg font-bold ${
              bitrate && bitrate > 1500 ? 'text-green-400'
              : bitrate && bitrate > 800 ? 'text-yellow-400'
              : 'text-red-400'
            }`}>
              {bitrate && bitrate > 1500
                ? 'Excellent'
                : bitrate && bitrate > 800
                ? 'Good'
                : 'Weak'}
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
