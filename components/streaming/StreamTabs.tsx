'use client'

import { useStreamStore } from '@/lib/store'

const tabs = [
  { key: 'hls', label: 'NATIVE HLS' },
  { key: 'youtube', label: 'YOUTUBE LIVE' },
  { key: 'facebook', label: 'FACEBOOK LIVE' },
  { key: 'guest', label: 'GUEST INTERVIEW' },
] as const

export default function StreamTabs() {
  const { activeSource, setActiveSource } = useStreamStore()

  return (
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
  )
}
