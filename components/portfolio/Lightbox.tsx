'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface LightboxItem {
  id: string | number
  type: 'image' | 'video'
  src: string
  title?: string
}

interface LightboxProps {
  items: LightboxItem[]
  activeIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function Lightbox({ items, activeIndex, onClose, onNavigate }: LightboxProps) {
  const item = items[activeIndex]
  if (!item) return null

  const hasMultiple = items.length > 1
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const isPanning = useRef(false)
  const panStart = useRef({ x: 0, y: 0 })
  const posAtPanStart = useRef({ x: 0, y: 0 })
  const scaleRef = useRef(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const pinchDistRef = useRef(0)
  const pinchScaleRef = useRef(1)

  scaleRef.current = scale

  const resetView = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  useEffect(() => { resetView() }, [activeIndex, resetView])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (!hasMultiple) return
      if (e.key === 'ArrowLeft') onNavigate(activeIndex - 1 < 0 ? items.length - 1 : activeIndex - 1)
      if (e.key === 'ArrowRight') onNavigate((activeIndex + 1) % items.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeIndex, hasMultiple, onClose, onNavigate, items.length])

  useEffect(() => {
    const scrollY = window.scrollY
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

  const zoomIn = () => setScale(s => Math.min(s + 0.5, 5))
  const zoomOut = () => setScale(s => {
    const next = Math.max(1, s - 0.5)
    if (next === 1) setPosition({ x: 0, y: 0 })
    return next
  })

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.25 : 0.25
    const newScale = Math.max(1, Math.min(5, scaleRef.current + delta))
    if (newScale === 1) setPosition({ x: 0, y: 0 })
    setScale(newScale)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scaleRef.current <= 1) return
    isPanning.current = true
    panStart.current = { x: e.clientX, y: e.clientY }
    posAtPanStart.current = { ...position }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return
    setPosition({
      x: posAtPanStart.current.x + (e.clientX - panStart.current.x),
      y: posAtPanStart.current.y + (e.clientY - panStart.current.y),
    })
  }

  const handleMouseUp = () => { isPanning.current = false }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      if (scaleRef.current <= 1) return
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      posAtPanStart.current = { ...position }
      isPanning.current = true
    } else if (e.touches.length === 2) {
      isPanning.current = false
      pinchDistRef.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
      pinchScaleRef.current = scaleRef.current
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning.current && touchStartRef.current) {
      setPosition({
        x: posAtPanStart.current.x + (e.touches[0].clientX - touchStartRef.current.x),
        y: posAtPanStart.current.y + (e.touches[0].clientY - touchStartRef.current.y),
      })
    } else if (e.touches.length === 2) {
      e.preventDefault()
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
      const newScale = Math.max(1, Math.min(5, pinchScaleRef.current * (dist / pinchDistRef.current)))
      if (newScale === 1) setPosition({ x: 0, y: 0 })
      setScale(newScale)
    }
  }

  const handleTouchEnd = () => {
    isPanning.current = false
    touchStartRef.current = null
  }

  const nav = (dir: number) => {
    const len = items.length
    onNavigate((activeIndex + dir + len) % len)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center select-none"
      onClick={(e) => { if (e.target === e.currentTarget) { e.preventDefault(); onClose() } }}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Counter */}
      {hasMultiple && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 bg-black/70 rounded-full px-4 py-1.5 text-xs text-zinc-400">
          {activeIndex + 1} / {items.length}
        </div>
      )}

      {/* Previous */}
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); nav(-1) }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-black/60 hover:bg-white/20 rounded-full text-white text-3xl transition"
          aria-label="Previous"
        >‹</button>
      )}

      {/* Next */}
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); nav(1) }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-black/60 hover:bg-white/20 rounded-full text-white text-3xl transition"
          aria-label="Next"
        >›</button>
      )}

      {/* Image container with close button */}
      <div className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center">

        {/* Prominent close button at top-right of image */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
          className="absolute -top-3 -right-3 z-40 w-11 h-11 flex items-center justify-center bg-black/80 hover:bg-red-500/80 rounded-full text-white text-xl shadow-lg transition"
          aria-label="Close lightbox"
        >✕</button>

        <div
          ref={containerRef}
          className="max-w-[95vw] max-h-[95vh] flex items-center justify-center overflow-hidden rounded-lg"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={handleMouseDown}
        >
          <div
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: 'center center',
              cursor: scale > 1 ? 'grab' : 'default',
              transition: isPanning.current ? 'none' : undefined,
            }}
          >
            {item.type === 'image' ? (
              <Image
                src={item.src}
                alt={item.title || ''}
                width={1920}
                height={1080}
                className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg"
                style={{ width: 'auto', height: 'auto' }}
                draggable={false}
                unoptimized
              />
            ) : (
              <video
                src={item.src}
                controls
                autoPlay
                className="max-w-[95vw] max-h-[95vh] rounded-lg"
              />
            )}
          </div>
        </div>
      </div>

      {/* Zoom controls bar */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-black/70 rounded-full px-4 py-2 text-white text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={zoomOut}
          className="hover:text-yellow-500 w-8 h-8 flex items-center justify-center text-lg"
          aria-label="Zoom out"
        >−</button>
        <button
          type="button"
          onClick={resetView}
          className="min-w-[48px] text-center text-xs hover:text-yellow-500 transition"
          title="Reset zoom"
        >{Math.round(scale * 100)}%</button>
        <button
          type="button"
          onClick={zoomIn}
          className="hover:text-yellow-500 w-8 h-8 flex items-center justify-center text-lg"
          aria-label="Zoom in"
        >+</button>
      </div>
    </motion.div>
  )
}
