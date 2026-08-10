'use client'

import { motion } from 'framer-motion'

export default function LowerThird() {
  return (
    <motion.div
      className="absolute bottom-4 right-4 z-20 max-w-xs md:max-w-sm"
      initial={{ opacity: 0, x: 40, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, delay: 1, ease: 'easeOut' }}
    >
      <motion.div
        className="relative px-4 py-3 rounded-lg backdrop-blur-xl bg-white/[0.06] border border-white/[0.1] shadow-2xl overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative flex items-center gap-3">
          <motion.div
            className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center"
            animate={{ boxShadow: ['0 0 0 0 rgba(220,38,38,0.6)', '0 0 0 8px rgba(220,38,38,0)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
            </svg>
          </motion.div>

          <div className="min-w-0">
            <p className="text-white text-xs md:text-sm font-medium leading-tight truncate">
              Subscribe to our channel and click the like button
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                Live
              </span>
            </div>
          </div>

          <motion.div
            className="flex-shrink-0 w-6 h-6 rounded-full bg-white/[0.08] flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <svg className="w-3 h-3 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
