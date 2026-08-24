const BROADCAST_SECTION = 'broadcast'
const PRIVACY_KEY = 'broadcast_is_private'
const CACHE_TTL_MS = 10_000

let cache: { value: boolean; fetchedAt: number } | null = null

export async function getBroadcastIsPrivate(): Promise<boolean> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.value
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    return true
  }

  try {
    const url =
      `${supabaseUrl}/rest/v1/cms_content` +
      `?select=value&section=eq.${BROADCAST_SECTION}&key=eq.${PRIVACY_KEY}&limit=1`

    const res = await fetch(url, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return cache?.value ?? true
    }

    const rows: { value?: string }[] = await res.json()
    const value = Array.isArray(rows) && rows[0]?.value === 'true'

    cache = { value, fetchedAt: Date.now() }
    return value
  } catch {
    return cache?.value ?? true
  }
}
