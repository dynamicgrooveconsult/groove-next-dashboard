'use client'

import { motion } from 'framer-motion'

export default function StandbyOverlay({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-[#050505] to-black">
      <div className="text-center space-y-6">
        <motion.div
          className="flex items-center justify-center gap-2"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
            Standby
          </span>
        </motion.div>

        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            We Will Be Live
          </h1>
          <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-500 mt-2">
            Shortly
          </h2>
        </div>

        <p className="text-zinc-500 text-sm tracking-wider uppercase">
          {label} broadcast starting soon
        </p>
      </div>
    </div>
  )
}