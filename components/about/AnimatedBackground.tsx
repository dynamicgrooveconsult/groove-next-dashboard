'use client'

import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Soft moving gradient */}
      <motion.div
        className="absolute w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-3xl"
        animate={{ x: [0, 200, 0], y: [0, 100, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '-200px', left: '-200px' }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"
        animate={{ x: [0, -150, 0], y: [0, 120, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
        style={{ bottom: '-150px', right: '-150px' }}
      />

    </div>
  )
}
