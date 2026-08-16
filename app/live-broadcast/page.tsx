'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import StreamTabs from '@/components/streaming/StreamTabs'
import VideoPlayer from '@/components/streaming/VideoPlayer'
import { useStreamStore } from '@/lib/store'

const ACCESS_CODE = 'DGM2024'

export default function LiveBroadcastPage() {
  const { setActiveSource } = useStreamStore()

  const [authorized, setAuthorized] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  /* ================= ACCESS CONTROL ================= */

  useEffect(() => {
    const saved = sessionStorage.getItem('dgm-access')
    if (saved === 'granted') {
      setAuthorized(true)
    }
  }, [])

  // Default to the native HLS source so the player shows immediately
  useEffect(() => {
    setActiveSource('hls')
  }, [setActiveSource])

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
        <div className="border-b border-zinc-800 pb-4">
          <StreamTabs />
        </div>

        {/* VIDEO PANEL */}
        <VideoPlayer />
      </div>
    </div>
  )
}
