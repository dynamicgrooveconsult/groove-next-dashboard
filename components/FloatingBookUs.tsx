'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function FloatingBookUs() {
  return (
    <div className="fixed bottom-6 left-6 z-[9999]">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Link
          href="/contact"
          className="group relative flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-600/90 to-yellow-500/90 backdrop-blur-md border border-yellow-400/30 shadow-2xl overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(234,179,8,0.3)',
                '0 0 0 12px rgba(234,179,8,0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <motion.span
            className="relative w-2 h-2 rounded-full bg-white"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          <span className="relative text-white font-bold text-sm tracking-wider uppercase">
            Book Us
          </span>

          <motion.svg
            className="relative w-4 h-4 text-yellow-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </motion.svg>
        </Link>
      </motion.div>
    </div>
  )
}
