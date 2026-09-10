'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabaseClient'

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

  // Featured event state
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [eventType, setEventType] = useState('')
  const [celebrantName, setCelebrantName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [savingEvent, setSavingEvent] = useState(false)

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

  useEffect(() => {
    supabase
      .from('featured_event')
      .select('youtube_url, event_type, celebrant_name, event_date, is_active')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setYoutubeUrl(data.youtube_url || '')
          setEventType(data.event_type || '')
          setCelebrantName(data.celebrant_name || '')
          setEventDate(data.event_date || '')
          setIsActive(data.is_active || false)
        }
        setLoadingEvent(false)
      })
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

  const updateFeaturedEvent = async () => {
    if (savingEvent) return
    setSavingEvent(true)

    try {
      const { data: existing } = await supabase
        .from('featured_event')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      const payload = {
        youtube_url: youtubeUrl,
        event_type: eventType,
        celebrant_name: celebrantName,
        event_date: eventDate || null,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      }

      const { error } = existing
        ? await supabase.from('featured_event').update(payload).eq('id', existing.id)
        : await supabase.from('featured_event').insert([payload])

      if (error) throw error

      showToast('Featured event saved successfully.')
    } catch (err: any) {
      showToast(`Failed to save featured event: ${err.message || 'unknown error'}`, 'error')
    } finally {
      setSavingEvent(false)
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

        <hr className="border-zinc-800 my-10" />

        <h1 className="text-3xl font-bold">
          Featured Homepage Event
        </h1>
        <p className="text-zinc-400 text-sm">
          This YouTube embed shows on the homepage even when Direct Stream isn't live.
        </p>

        {loadingEvent ? (
          <p className="text-zinc-500 text-sm">Loading current event...</p>
        ) : (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">YouTube Link</label>
              <input
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full bg-black border border-zinc-700 px-4 py-2 rounded"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Event Type</label>
              <input
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-black border border-zinc-700 px-4 py-2 rounded"
                placeholder="e.g. Wedding, Birthday, Corporate Event"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Celebrant / Host Name</label>
              <input
                value={celebrantName}
                onChange={(e) => setCelebrantName(e.target.value)}
                className="w-full bg-black border border-zinc-700 px-4 py-2 rounded"
                placeholder="e.g. John & Sarah"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Event Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-black border border-zinc-700 px-4 py-2 rounded"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4"
              />
              Show this event on the homepage
            </label>

            <button
              onClick={updateFeaturedEvent}
              disabled={savingEvent}
              className="bg-cyan-400 text-black px-6 py-2 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingEvent ? 'Saving...' : 'Save Featured Event'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}