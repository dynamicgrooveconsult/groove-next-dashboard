import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getBroadcastIsPrivate } from '@/lib/broadcastPrivacy'

export default async function LiveBroadcastLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (await getBroadcastIsPrivate()) {
    const cookieStore = await cookies()
    if (cookieStore.get('broadcast_auth')?.value !== 'granted') {
      redirect('/access')
    }
  }

  return children
}
