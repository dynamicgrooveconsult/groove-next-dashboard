'use client'

import { useState } from 'react'

export default function AdminDashboard() {
  const [broadcastCode, setBroadcastCodeState] = useState('')
  const [guestCode, setGuestCodeState] = useState('')
  const [message, setMessage] = useState('')

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

      </div>
    </div>
  )
}
