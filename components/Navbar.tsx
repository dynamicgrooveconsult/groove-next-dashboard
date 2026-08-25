'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/live-broadcast', label: 'Live Broadcast' },
  { href: '/contact', label: 'Contact' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMenu = useCallback(() => setMobileOpen(false), [])

  return (
    <nav className="bg-[#050505] text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 md:px-6">
        <div className="font-bold text-lg md:text-xl tracking-tight">
          Dynamic Groove Media
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-gray-300 transition-colors text-sm">
              {l.label}
            </Link>
          ))}
          <Link
            href="/live-broadcast"
            className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold hover:bg-yellow-400 transition-all text-sm"
          >
            Watch Live
          </Link>
        </div>

        {/* Hamburger button */}
        <button
          type="button"
          className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${
              mobileOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-opacity duration-200 ${
              mobileOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${
              mobileOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-6 pt-2 border-t border-zinc-800 flex flex-col gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={closeMenu}
              className="block px-3 py-3 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/live-broadcast"
            onClick={closeMenu}
            className="mt-2 block text-center bg-yellow-500 text-black px-4 py-3 rounded-full font-bold hover:bg-yellow-400 transition-all text-sm"
          >
            Watch Live
          </Link>
        </div>
      </div>
    </nav>
  )
}
