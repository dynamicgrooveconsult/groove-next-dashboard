import { NextResponse } from 'next/server'
import { getGuestCode } from '@/lib/broadcastConfig'

export async function POST(req: Request) {
  const { code } = await req.json()

  if (code === getGuestCode()) {
    const response = NextResponse.json({ success: true })

    response.cookies.set('guest_auth', 'granted', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
    })

    return response
  }

  return NextResponse.json({ success: false }, { status: 401 })
}
