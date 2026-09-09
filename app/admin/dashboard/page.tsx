'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminDashboard() {
  const [broadcastCode, setBroadcastCodeState] = useState('')
  const [guestCode, setGuestCodeState] = useState('')
  const [message, setMessage] = useState('')

  // Featured event state
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [eventType, setEventType] = useState('')
  const [celebrantName, setCelebrantName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [eventMessage, setEventMessage] = useState('')
  const [loadingEvent, setLoadingEvent] = useState(true)

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

  const updateCodes = async () => {
    await fetch('/api/update-broadcast-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newCode: broadcastCode }),
    })

    await fetch('/api/update-guest-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newCode: guestCode }),
    })

    setMessage('Codes updated successfully.')
  }

  const updateFeaturedEvent = async () => {
    setEventMessage('')

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

    if (error) {
      setEventMessage(`Error: ${error.message}`)
    } else {
      setEventMessage('Featured event updated successfully.')
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">
          Broadcast Access Control
        </h1>

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

        {message && <p className="text-green-400">{message}</p>}

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
          <>
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
              className="bg-cyan-400 text-black px-6 py-2 rounded-full font-semibold"
            >
              Save Featured Event
            </button>

            {eventMessage && (
              <p className={eventMessage.startsWith('Error') ? 'text-red-400' : 'text-green-400'}>
                {eventMessage}
              </p>
            )}
          </>
        )}

      </div>
    </div>
  )
}