import { getServiceClient } from '@/lib/supabaseAdmin'

const CACHE_TTL_MS = 10_000

let cache: { value: boolean; fetchedAt: number } | null = null

export async function getBroadcastIsPrivate(): Promise<boolean> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.value
  }

  try {
    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('cms_content')
      .select('value')
      .eq('section', 'broadcast')
      .eq('key', 'broadcast_is_private')
      .maybeSingle()

    if (error) {
      console.error('[broadcastPrivacy] Query error — failing closed (private):', error.message)
      return cache?.value ?? true
    }

    if (!data) {
      console.warn('[broadcastPrivacy] Setting row missing — defaulting to public')
      cache = { value: false, fetchedAt: Date.now() }
      return false
    }

    const value = data.value === 'true'
    cache = { value, fetchedAt: Date.now() }
    return value
  } catch (err) {
    console.error('[broadcastPrivacy] Query threw — failing closed (private):', err)
    return cache?.value ?? true
  }
}
