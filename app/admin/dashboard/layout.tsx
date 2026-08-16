'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/admin/dashboard', label: 'Broadcast Codes', icon: '🔐' },
  { href: '/admin/dashboard/live-broadcast', label: 'Live Broadcast', icon: '📺' },
  { href: '/admin/dashboard/bookings', label: 'Bookings', icon: '📅' },
  { href: '/admin/dashboard/portfolio', label: 'Portfolio Gallery', icon: '🖼️' },
  { href: '/admin/dashboard/ceo', label: 'CEO Profile', icon: '👤' },
  { href: '/admin/dashboard/cms/home', label: 'Home Page', icon: '🏠' },
  { href: '/admin/dashboard/cms/services', label: 'Services', icon: '⚙️' },
  { href: '/admin/dashboard/cms/testimonials', label: 'Testimonials', icon: '⭐' },
  { href: '/admin/dashboard/cms/contact', label: 'Contact', icon: '📧' },
  { href: '/admin/dashboard/cms/broadcast', label: 'Broadcast', icon: '📡' },
  { href: '/admin/dashboard/cms/media', label: 'Media Library', icon: '📁' },
  { href: '/admin/dashboard/site-settings', label: 'Site Settings', icon: '⚙️' },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    fetch('/api/check-admin-auth')
      .then((r) => {
        if (!r.ok) throw new Error('Unauthorized')
        setAuthed(true)
      })
      .catch(() => router.push('/admin'))
  }, [router])

  if (!authed) return null

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-yellow-500">DGM Admin</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === '/admin/dashboard'
              ? pathname === '/admin/dashboard'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={async () => {
              await fetch('/api/admin-logout', { method: 'POST' })
              window.location.href = '/admin'
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-500 hover:text-zinc-300 transition w-full"
          >
            ← Back to Login
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
