'use client'

import { useEffect, useState } from 'react'
import { useStreamStore } from '@/lib/store'
import { useToast } from '@/components/Toast'

interface StreamSettingsDraft {
  hlsUrl: string
  youtubeId: string
  facebookInput: string
  isChannel: boolean
}

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

  const { showToast, ToastComponent } = useToast()

  const [draft, setDraft] = useState<StreamSettingsDraft>({
    hlsUrl,
    youtubeId,
    facebookInput,
    isChannel,
  })
  const [saved, setSaved] = useState<StreamSettingsDraft>(draft)
  const [saving, setSaving] = useState(false)

  const isDirty =
    draft.hlsUrl !== saved.hlsUrl ||
    draft.youtubeId !== saved.youtubeId ||
    draft.facebookInput !== saved.facebookInput ||
    draft.isChannel !== saved.isChannel

  useEffect(() => {
    if (!isDirty) {
      setDraft({ hlsUrl, youtubeId, facebookInput, isChannel })
      setSaved({ hlsUrl, youtubeId, facebookInput, isChannel })
    }
  }, [hlsUrl, youtubeId, facebookInput, isChannel, isDirty])

  const handleSave = async () => {
    if (!isDirty || saving) return
    setSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      localStorage.setItem('hls-url', draft.hlsUrl)
      localStorage.setItem('yt-channel-id', draft.youtubeId)
      localStorage.setItem('fb-video-input', draft.facebookInput)
      setHlsUrl(draft.hlsUrl)
      setYoutubeId(draft.youtubeId)
      setIsChannel(draft.isChannel)
      setFacebookInput(draft.facebookInput)
      setSaved({ ...draft })
      showToast('Settings saved!')
    } catch {
      showToast('Failed to save settings, please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-zinc-900 p-5 rounded-lg border border-zinc-800 space-y-4">
      {ToastComponent}

      <div>
        <label className="text-xs text-zinc-400 uppercase">
          Native HLS URL
        </label>
        <input
          value={draft.hlsUrl}
          onChange={(e) => setDraft({ ...draft, hlsUrl: e.target.value })}
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
            value={draft.youtubeId}
            onChange={(e) => setDraft({ ...draft, youtubeId: e.target.value })}
            className="flex-1 bg-black border border-zinc-700 px-3 py-2 rounded text-sm"
          />
          <button
            onClick={() => setDraft({ ...draft, isChannel: !draft.isChannel })}
            className="bg-zinc-800 px-3 py-2 rounded text-xs"
          >
            Mode: {draft.isChannel ? 'Channel' : 'Video ID'}
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs text-zinc-400 uppercase">
          Facebook Video URL / Embed
        </label>
        <input
          value={draft.facebookInput}
          onChange={(e) =>
            setDraft({ ...draft, facebookInput: e.target.value })
          }
          className="w-full bg-black border border-zinc-700 px-3 py-2 rounded text-sm mt-2"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-1">
        {!isDirty && !saving && (
          <span className="text-xs text-zinc-600">No unsaved changes</span>
        )}
        {isDirty && !saving && (
          <span className="text-xs text-yellow-500/80">Unsaved changes</span>
        )}
        <button
          onClick={handleSave}
          disabled={!isDirty || saving}
          className={`flex items-center gap-2 bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold text-sm transition ${
            !isDirty || saving
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-yellow-400'
          }`}
        >
          {saving && (
            <svg
              className="animate-spin h-4 w-4"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
