import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServiceClient } from '@/lib/supabaseAdmin'

const supabase = getServiceClient()

const TABLE = 'site_settings'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'granted'
}

export async function GET() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? {})
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const { data: existing } = await supabase
    .from(TABLE)
    .select('id')
    .limit(1)
    .maybeSingle()

  const payload = { ...body, updated_at: new Date().toISOString() }

  let result
  if (existing) {
    result = await supabase
      .from(TABLE)
      .update(payload)
      .eq('id', existing.id)
      .select()
      .single()
  } else {
    result = await supabase
      .from(TABLE)
      .insert(payload)
      .select()
      .single()
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 })
  }

  return NextResponse.json(result.data)
}
