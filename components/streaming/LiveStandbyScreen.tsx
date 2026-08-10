'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const PARTICLE_COUNT = 40

export default function LiveStandbyScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
      life: number
      maxLife: number
    }

    const particles: Particle[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        life: 0,
        maxLife: Math.random() * 200 + 100,
      })
    }

    let lightStreaks: { x: number; y: number; vx: number; vy: number; alpha: number; length: number; width: number }[] = []
    for (let i = 0; i < 5; i++) {
      lightStreaks.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        alpha: Math.random() * 0.15 + 0.05,
        length: Math.random() * 80 + 40,
        width: Math.random() * 1.5 + 0.5,
      })
    }

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.life++

        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        if (p.life > p.maxLife) {
          p.x = Math.random() * w
          p.y = Math.random() * h
          p.life = 0
          p.maxLife = Math.random() * 200 + 100
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
        ctx.fill()
      }

      for (const s of lightStreaks) {
        s.x += s.vx
        s.y += s.vy

        if (s.x < -s.length || s.x > w + s.length) {
          s.vx *= -1
          s.x = Math.random() * w
        }
        if (s.y < -s.length || s.y > h + s.length) {
          s.vy *= -1
          s.y = Math.random() * h
        }

        const angle = Math.atan2(s.vy, s.vx)
        ctx.save()
        ctx.translate(s.x, s.y)
        ctx.rotate(angle)
        const gradient = ctx.createLinearGradient(0, 0, s.length, 0)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
        gradient.addColorStop(0.5, `rgba(234, 179, 8, ${s.alpha})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, -s.width / 2, s.length, s.width)
        ctx.restore()
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050505]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505]/80"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.06)_0%,transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full gap-6 p-8">
        <motion.div
          className="flex items-center gap-3 px-5 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 backdrop-blur-sm"
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.02, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.span
            className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-red-400 font-bold text-sm tracking-[0.2em] uppercase">
            Standby
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-black text-center tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <span className="bg-gradient-to-r from-white via-yellow-200 to-yellow-500 bg-clip-text text-transparent">
            WE WILL BE LIVE
          </span>
          <br />
          <motion.span
            className="text-5xl md:text-7xl lg:text-8xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent"
            animate={{ opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            SHORTLY
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-zinc-400 text-sm md:text-base tracking-[0.3em] uppercase font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Live Broadcast Starting Soon
        </motion.p>

        <motion.div
          className="mt-4 px-8 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] backdrop-blur-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <p className="text-yellow-500/60 text-xs tracking-[0.15em] uppercase font-mono">
            Dynamic Groove Media
          </p>
        </motion.div>
      </div>
    </div>
  )
}
