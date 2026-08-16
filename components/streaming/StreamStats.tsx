'use client'

import { useEffect, useState } from 'react'
import { useStreamStore } from '@/lib/store'

export default function StreamStats() {
  const hlsUrl = useStreamStore((s) => s.hlsUrl)
  const [bitrate, setBitrate] = useState<number | null>(null)
  const [clients, setClients] = useState<number | null>(null)

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

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-zinc-900 p-4 rounded border border-zinc-800">
        <p className="text-xs text-zinc-500">Bitrate</p>
        <p className="text-lg font-bold text-green-400">
          {bitrate ? `${bitrate} kbps` : '—'}
        </p>
      </div>

      <div className="bg-zinc-900 p-4 rounded border border-zinc-800">
        <p className="text-xs text-zinc-500">Viewers</p>
        <p className="text-lg font-bold text-yellow-400">{clients ?? '—'}</p>
      </div>

      <div className="bg-zinc-900 p-4 rounded border border-zinc-800">
        <p className="text-xs text-zinc-500">Bandwidth</p>
        <p className="text-lg font-bold text-blue-400">
          {bitrate ? `${(bitrate / 1000).toFixed(2)} Mbps` : '—'}
        </p>
      </div>

      <div className="bg-zinc-900 p-4 rounded border border-zinc-800">
        <p className="text-xs text-zinc-500">Stream Strength</p>
        <p
          className={`text-lg font-bold ${
            bitrate && bitrate > 1500
              ? 'text-green-400'
              : bitrate && bitrate > 800
                ? 'text-yellow-400'
                : 'text-red-400'
          }`}
        >
          {bitrate && bitrate > 1500
            ? 'Excellent'
            : bitrate && bitrate > 800
              ? 'Good'
              : 'Weak'}
        </p>
      </div>
    </div>
  )
}
