'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AccessPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  const submit = async () => {
    const res = await fetch('/api/broadcast-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })

    if (res.ok) {
      router.push('/live-broadcast')
    } else {
      setError(true)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden flex items-center justify-center">

      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none">

        <motion.div
          className="absolute w-[800px] h-[800px] bg-yellow-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 200, 0], y: [0, 100, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-300px', left: '-300px' }}
        />

        <motion.div
          className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -150, 0], y: [0, 120, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
          style={{ bottom: '-250px', right: '-250px' }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,0,0.08),transparent_60%)]" />

      </div>

      {/* Access Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 p-10 rounded-2xl w-[420px] text-center shadow-2xl"
      >

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-yellow-500 text-3xl mb-4"
        >
          🔒
        </motion.div>

        <h2 className="text-2xl font-bold mb-3">
          Private Broadcast Access
        </h2>

        <p className="text-zinc-400 text-sm mb-8">
          Enter secure access code to continue.
        </p>

        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-black/70 border border-zinc-700 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-yellow-500 transition-colors"
          placeholder="Enter access code"
        />

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm mt-4"
          >
            Invalid access code
          </motion.p>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={submit}
          className="mt-8 bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-400 transition"
        >
          Unlock
        </motion.button>

      </motion.div>

    </div>
  )
}
