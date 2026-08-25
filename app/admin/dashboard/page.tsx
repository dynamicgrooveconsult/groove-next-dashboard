'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/Toast'

const PRIVACY_KEY = 'broadcast_is_private'

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 8000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export default function AdminDashboard() {
  const [broadcastCode, setBroadcastCodeState] = useState('')
  const [guestCode, setGuestCodeState] = useState('')
  const [isPrivate, setIsPrivate] = useState<boolean | null>(null)
  const [savingPrivacy, setSavingPrivacy] = useState(false)
  const { showToast, ToastComponent } = useToast()

  useEffect(() => {
    fetchWithTimeout('/api/cms/content?section=broadcast')
      .then((r) => r.json())
      .then((data: { key?: string; value?: string }[]) => {
        if (Array.isArray(data)) {
          const privacy = data.find((i) => i.key === PRIVACY_KEY)
          setIsPrivate(privacy?.value === 'true')
        } else {
          setIsPrivate(false)
        }
      })
      .catch(() => setIsPrivate(false))
  }, [])

  const updatePrivacy = async (nextPrivate: boolean) => {
    if (isPrivate === null || savingPrivacy) return

    const previous = isPrivate
    setIsPrivate(nextPrivate)
    setSavingPrivacy(true)

    try {
      const res = await fetchWithTimeout('/api/cms/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'broadcast',
          updates: { [PRIVACY_KEY]: nextPrivate ? 'true' : 'false' },
        }),
      })

      if (!res.ok) throw new Error(`Save failed with status ${res.status}`)

      showToast(
        nextPrivate
          ? 'Broadcast is now private — an access code is required to watch.'
          : 'Broadcast is now public — anyone can watch without a code.'
      )
    } catch {
      setIsPrivate(previous)
      showToast('Failed to update broadcast privacy.', 'error')
    } finally {
      setSavingPrivacy(false)
    }
  }

  const updateCodes = async () => {
    try {
      await fetchWithTimeout('/api/update-broadcast-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newCode: broadcastCode }),
      })

      await fetchWithTimeout('/api/update-guest-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newCode: guestCode }),
      })

      showToast('Codes updated successfully.')
    } catch {
      showToast('Failed to update codes.', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      {ToastComponent}
      <div className="max-w-xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">
          Broadcast Access Control
        </h1>

        {/* BROADCAST PRIVACY */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Broadcast Privacy</h2>
              <p className="text-xs text-zinc-500 mt-1">
                Choose who can watch the live broadcast.
              </p>
            </div>
            {isPrivate !== null && (
              <span
                className={`shrink-0 px-3 py-1 rounded-full border text-xs font-semibold ${
                  isPrivate
                    ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                    : 'bg-green-500/10 text-green-300 border-green-500/30'
                }`}
              >
                {isPrivate ? '🔒 Private' : '🌍 Public'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updatePrivacy(false)}
              disabled={isPrivate === null || savingPrivacy}
              aria-pressed={isPrivate === false}
              className={`rounded-lg border px-4 py-4 text-left transition ${
                isPrivate === false
                  ? 'border-green-500/60 bg-green-500/10'
                  : 'border-zinc-700 bg-black hover:border-zinc-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <p className="font-semibold text-sm">🌍 Public</p>
              <p className="text-xs text-zinc-400 mt-1">
                Anyone can watch — no access code required.
              </p>
            </button>

            <button
              onClick={() => updatePrivacy(true)}
              disabled={isPrivate === null || savingPrivacy}
              aria-pressed={isPrivate === true}
              className={`rounded-lg border px-4 py-4 text-left transition ${
                isPrivate === true
                  ? 'border-cyan-500/60 bg-cyan-500/10'
                  : 'border-zinc-700 bg-black hover:border-zinc-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <p className="font-semibold text-sm">🔒 Private</p>
              <p className="text-xs text-zinc-400 mt-1">
                Visitors must enter the access code to watch.
              </p>
            </button>
          </div>

          <p className="text-[11px] text-zinc-600">
            Switching to Private immediately requires the event access code for anyone
            without a previously granted code. Changes take effect within ~10 seconds.
          </p>
        </div>

        <input
          value={broadcastCode}
          onChange={(e) => setBroadcastCodeState(e.target.value)}
          className="w-full bg-black border border-zinc-700 px-4 py-2 rounded"
          placeholder="New broadcast access code"
        />

        <input
          value={guestCode}
          onChange={(e) => setGuestCodeState(e.target.value)}
          className="w-full bg-black border border-zinc-700 px-4 py-2 rounded"
          placeholder="New guest access code"
        />

        <button
          onClick={updateCodes}
          className="bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold"
        >
          Update Codes
        </button>

      </div>
    </div>
  )
}
