'use client'

import { useState, useEffect, useCallback, RefObject } from 'react'

function isIOSSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /iP(ad|hone|od)/.test(ua) && /WebKit/.test(ua) && !/CriOS|FxiOS/.test(ua)
}

function isFullscreen(el: Element): boolean {
  return (
    document.fullscreenElement === el ||
    (document as any).webkitFullscreenElement === el
  )
}

function requestFS(el: Element) {
  if (el.requestFullscreen) {
    el.requestFullscreen()
  } else if ((el as any).webkitRequestFullscreen) {
    ;(el as any).webkitRequestFullscreen()
  }
}

function exitFS() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if ((document as any).webkitExitFullscreen) {
    ;(document as any).webkitExitFullscreen()
  }
}

interface FullscreenButtonProps {
  containerRef: RefObject<HTMLDivElement | null>
}

export default function FullscreenButton({ containerRef }: FullscreenButtonProps) {
  const [isFS, setIsFS] = useState(false)
  const [iosFallback, setIosFallback] = useState(false)

  const syncState = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    setIsFS(isFullscreen(el))
  }, [containerRef])

  useEffect(() => {
    const onFSChange = () => syncState()

    document.addEventListener('fullscreenchange', onFSChange)
    document.addEventListener('webkitfullscreenchange', onFSChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFSChange)
      document.removeEventListener('webkitfullscreenchange', onFSChange)
    }
  }, [syncState])

  const toggle = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    if (isIOSSafari()) {
      if (iosFallback) {
        el.style.position = ''
        el.style.inset = ''
        el.style.zIndex = ''
        el.style.width = ''
        el.style.height = ''
        el.style.borderRadius = ''
        setIosFallback(false)
        setIsFS(false)
      } else {
        el.style.position = 'fixed'
        el.style.inset = '0'
        el.style.zIndex = '99999'
        el.style.width = '100vw'
        el.style.height = '100vh'
        el.style.borderRadius = '0'
        setIosFallback(true)
        setIsFS(true)
      }
      return
    }

    if (isFullscreen(el)) {
      exitFS()
    } else {
      requestFS(el)
    }
  }, [containerRef, iosFallback])

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isFS ? 'Exit fullscreen' : 'Enter fullscreen'}
      title={isFS ? 'Exit fullscreen' : 'Enter fullscreen'}
      className="absolute bottom-3 right-3 z-20 p-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-black/80 hover:border-white/20 transition-all duration-200 opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
    >
      {isFS ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3v3a2 2 0 01-2 2H3" />
          <path d="M21 8h-3a2 2 0 01-2-2V3" />
          <path d="M3 16h3a2 2 0 012 2v3" />
          <path d="M16 21v-3a2 2 0 012-2h3" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 00-2 2v3" />
          <path d="M21 8V5a2 2 0 00-2-2h-3" />
          <path d="M3 16v3a2 2 0 002 2h3" />
          <path d="M16 21h3a2 2 0 002-2v-3" />
        </svg>
      )}
    </button>
  )
}
