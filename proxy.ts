import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getBroadcastIsPrivate } from '@/lib/broadcastPrivacy'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect live broadcast route (only when privacy mode is on)
  if (pathname === '/live-broadcast') {
    const isPrivate = await getBroadcastIsPrivate()

    if (isPrivate) {
      const auth = request.cookies.get('broadcast_auth')
      if (!auth || auth.value !== 'granted') {
        return NextResponse.redirect(new URL('/access', request.url))
      }
    }
  }

  // Already-authenticated visitors should never see the access gate again
  if (pathname === '/access') {
    const isPrivate = await getBroadcastIsPrivate()
    if (!isPrivate) {
      // Broadcast is public: there is nothing to unlock, go straight to the stream
      return NextResponse.redirect(new URL('/live-broadcast', request.url))
    }

    const auth = request.cookies.get('broadcast_auth')
    if (auth && auth.value === 'granted') {
      return NextResponse.redirect(new URL('/live-broadcast', request.url))
    }
  }

  // Protect admin dashboard routes
  if (pathname.startsWith('/admin/dashboard')) {
    const adminAuth = request.cookies.get('admin_auth')
    if (!adminAuth || adminAuth.value !== 'granted') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/live-broadcast', '/access', '/admin/dashboard/:path*'],
}
