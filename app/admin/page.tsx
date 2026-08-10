'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  const submit = async () => {
    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })

    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
      <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 w-[400px] text-center space-y-6">
        <h2 className="text-xl font-bold">Admin Access</h2>

        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-black border border-zinc-700 px-4 py-2 rounded text-sm"
          placeholder="Enter admin code"
        />

        {error && <p className="text-red-400 text-sm">Invalid code</p>}

        <button
          onClick={submit}
          className="bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  )
}
