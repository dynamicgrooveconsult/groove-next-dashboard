import { NextResponse } from 'next/server'
import { setBroadcastCode } from '@/lib/broadcastConfig'

export async function POST(req: Request) {
  const { newCode } = await req.json()

  if (!newCode) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }

  setBroadcastCode(newCode)

  return NextResponse.json({ success: true })
}
