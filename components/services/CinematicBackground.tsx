'use client'

import { motion } from 'framer-motion'

export default function CinematicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Soft spotlight center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,0,0.06),transparent_60%)]" />

      {/* Moving yellow glow */}
      <motion.div
        className="absolute w-[900px] h-[900px] bg-yellow-500/10 rounded-full blur-3xl"
        animate={{ x: [0, 200, 0], y: [0, 120, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '-300px', left: '-300px' }}
      />

      {/* Moving blue glow */}
      <motion.div
        className="absolute w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-3xl"
        animate={{ x: [0, -150, 0], y: [0, 100, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
        style={{ bottom: '-250px', right: '-250px' }}
      />

      {/* Subtle grain texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

    </div>
  )
}
