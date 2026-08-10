import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect live broadcast route
  if (pathname === '/live-broadcast') {
    const auth = request.cookies.get('broadcast_auth')
    if (!auth || auth.value !== 'granted') {
      return NextResponse.redirect(new URL('/access', request.url))
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
  matcher: ['/live-broadcast', '/admin/dashboard/:path*'],
}
