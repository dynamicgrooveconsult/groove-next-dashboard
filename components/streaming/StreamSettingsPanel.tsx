'use client'

import { useStreamStore } from '@/lib/store'

export default function StreamSettingsPanel() {
  const {
    hlsUrl,
    setHlsUrl,
    youtubeId,
    setYoutubeId,
    isChannel,
    setIsChannel,
    facebookInput,
    setFacebookInput,
  } = useStreamStore()

  return (
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
          The .m3u8 playlist URL your media server serves (e.g. your LAN IP so
          mobile &amp; remote viewers can connect).
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
  )
}
