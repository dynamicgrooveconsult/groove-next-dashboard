'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  visible: boolean
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = 'success', visible, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [visible, onClose, duration])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium ${
            type === 'success'
              ? 'bg-green-900/80 border-green-700/50 text-green-300 backdrop-blur-md'
              : 'bg-red-900/80 border-red-700/50 text-red-300 backdrop-blur-md'
          }`}
        >
          <span className="text-lg">
            {type === 'success' ? '✓' : '⚠'}
          </span>
          <span>{message}</span>
          <button onClick={onClose} className="ml-3 opacity-60 hover:opacity-100 transition">
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
  }

  const hideToast = () => setToast(null)

  return {
    toast,
    showToast,
    hideToast,
    ToastComponent: toast ? (
      <Toast
        message={toast.message}
        type={toast.type}
        visible={!!toast}
        onClose={hideToast}
      />
    ) : null,
  }
}
