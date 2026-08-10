'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useStreamStore } from '@/lib/store'

function StatCard({
  label,
  value,
  unit,
  icon,
  status,
}: {
  label: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  status?: 'healthy' | 'warning' | 'error'
}) {
  const statusColor = {
    healthy: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  }

  return (
    <motion.div
      className="relative rounded-xl border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-sm p-4 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/30">
          {icon}
        </div>
        {status && (
          <span className={`w-2 h-2 rounded-full ${statusColor[status]} shadow-lg`} />
        )}
      </div>
      <p className="text-2xl md:text-3xl font-bold text-white font-mono">
        {value}
        {unit && <span className="text-sm text-zinc-500 ml-1">{unit}</span>}
      </p>
      <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1 font-mono">
        {label}
      </p>
    </motion.div>
  )
}

function PlatformBadge({
  name,
  status,
}: {
  name: string
  status: 'connected' | 'degraded' | 'offline'
}) {
  const colors = {
    connected: 'bg-green-500/20 text-green-400 border-green-500/30',
    degraded: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    offline: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  const dots = {
    connected: 'bg-green-500',
    degraded: 'bg-yellow-500',
    offline: 'bg-red-500',
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${colors[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {name}
    </div>
  )
}

export default function ProducerDashboard() {
  const {
    isLive,
    setIsLive,
    streamTitle,
    setStreamTitle,
    activeSource,
    setActiveSource,
    analytics,
    updateAnalytics,
  } = useStreamStore()

  const [showConfirmation, setShowConfirmation] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined)

  useEffect(() => {
    if (isLive) {
      timerRef.current = setInterval(() => {
        updateAnalytics({
          viewerCount: Math.floor(Math.random() * 150) + 20,
          bitrate: Math.floor(Math.random() * 2000) + 3000,
          uploadBandwidth: Math.floor(Math.random() * 500) + 2000,
          fps: Math.floor(Math.random() * 10) + 50,
          cpu: Math.floor(Math.random() * 30) + 20,
          duration: analytics.duration + 1,
          hlsSegments: Math.floor(Math.random() * 20) + 40,
          rtmpConnected: true,
          resolution: '1920x1080',
          platformStatus: {
            hls: 'connected',
            youtube: Math.random() > 0.2 ? 'connected' : 'degraded',
            facebook: Math.random() > 0.3 ? 'connected' : 'degraded',
          },
        })
      }, 2000)

      return () => clearInterval(timerRef.current)
    }
  }, [isLive, analytics.duration, updateAnalytics])

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Producer
              </span>{' '}
              Dashboard
            </h1>
            <p className="text-zinc-500 text-sm mt-1 font-mono">
              Broadcast Control Center
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              className={`px-6 py-2 rounded-full font-bold text-sm tracking-wider uppercase transition-all ${
                isLive
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'
                  : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/20'
              }`}
              onClick={() => {
                if (isLive) {
                  setShowConfirmation(true)
                } else {
                  setIsLive(true)
                }
              }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${isLive ? 'bg-white animate-pulse' : 'bg-white'}`}
                />
                {isLive ? 'End Stream' : 'Go Live'}
              </span>
            </motion.button>
          </div>
        </motion.div>

        {isLive && (
          <motion.div
            className="mb-6 p-4 rounded-xl border border-green-500/20 bg-green-500/5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-3">
              <motion.span
                className="w-3 h-3 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-green-400 font-bold text-sm uppercase tracking-wider">
                Live
              </span>
              <span className="text-zinc-500 text-sm font-mono">
                {formatDuration(analytics.duration)}
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400 text-sm">
                {analytics.viewerCount} watching
              </span>
            </div>
          </motion.div>
        )}

        {showConfirmation && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-sm mx-4 text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <div className="w-16 h-16 rounded-full bg-red-500/20 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">End Live Stream?</h3>
              <p className="text-zinc-400 text-sm mb-6">
                This will stop all active broadcasts and disconnect viewers.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  className="px-6 py-2 rounded-full bg-zinc-800 text-zinc-400 text-sm font-medium hover:bg-zinc-700 transition-colors"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                  onClick={() => {
                    setIsLive(false)
                    setShowConfirmation(false)
                  }}
                >
                  End Stream
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        <div className="mb-6">
          <label className="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-1 block">
            Stream Title
          </label>
          <input
            value={streamTitle}
            onChange={(e) => setStreamTitle(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
            placeholder="Enter stream title..."
          />
        </div>

        {isLive && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Viewers"
                value={analytics.viewerCount}
                icon={
                  <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                }
              />
              <StatCard
                label="Bitrate"
                value={analytics.bitrate}
                unit="kbps"
                status={analytics.bitrate > 4000 ? 'healthy' : 'warning'}
                icon={
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              />
              <StatCard
                label="FPS"
                value={analytics.fps}
                status={analytics.fps > 30 ? 'healthy' : 'error'}
                icon={
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                label="Duration"
                value={formatDuration(analytics.duration)}
                icon={
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Upload Bandwidth"
                value={analytics.uploadBandwidth}
                unit="kbps"
                icon={
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                }
              />
              <StatCard
                label="Resolution"
                value={analytics.resolution}
                icon={
                  <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              <StatCard
                label="CPU Usage"
                value={analytics.cpu}
                unit="%"
                status={analytics.cpu < 70 ? 'healthy' : 'warning'}
                icon={
                  <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              <StatCard
                label="HLS Segments"
                value={analytics.hlsSegments}
                icon={
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                }
              />
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-3 font-mono">
                Platform Status
              </h3>
              <div className="flex flex-wrap gap-3">
                <PlatformBadge name="HLS" status={analytics.platformStatus.hls} />
                <PlatformBadge name="YouTube" status={analytics.platformStatus.youtube} />
                <PlatformBadge name="Facebook" status={analytics.platformStatus.facebook} />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-3 font-mono">
                Stream Source
              </h3>
              <div className="flex flex-wrap gap-2">
                {(['hls', 'youtube', 'facebook'] as const).map((source) => (
                  <motion.button
                    key={source}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeSource === source
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                    }`}
                    onClick={() => setActiveSource(source)}
                    whileTap={{ scale: 0.95 }}
                  >
                    {source.toUpperCase()}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-sm p-4">
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-3 font-mono">
                RTMP Connection
              </h3>
              <div className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    analytics.rtmpConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span
                  className={`text-sm font-mono ${
                    analytics.rtmpConnected ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {analytics.rtmpConnected ? 'Connected' : 'Disconnected'}
                </span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-500 text-xs font-mono">
                  Ingest: rtmp://localhost:1935/live
                </span>
              </div>
            </div>
          </>
        )}

        {!isLive && (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-6 border border-zinc-700">
              <svg className="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-zinc-400 mb-2">Stream Offline</h2>
            <p className="text-zinc-600 text-sm mb-8 max-w-md text-center">
              Configure your stream settings and click &quot;Go Live&quot; to start broadcasting.
            </p>
            <motion.button
              className="px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-green-500/20"
              onClick={() => setIsLive(true)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >
              Go Live
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
