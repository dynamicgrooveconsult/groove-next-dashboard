import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { code } = await req.json()

  if (code === process.env.ADMIN_ACCESS_CODE) {
    const response = NextResponse.json({ success: true })

    response.cookies.set('admin_auth', 'granted', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
    })

    return response
  }

  return NextResponse.json({ success: false }, { status: 401 })
}
