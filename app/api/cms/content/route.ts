import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServiceClient } from '@/lib/supabaseAdmin'

const supabase = getServiceClient()

async function isAdmin() {
  const s = await cookies()
  return s.get('admin_auth')?.value === 'granted'
}

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get('section')
  let query = supabase.from('cms_content').select('*')
  if (section) query = query.eq('section', section)
  const { data, error } = await query.order('key')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { section, updates } = body
  if (!section || !updates) return NextResponse.json({ error: 'section and updates required' }, { status: 400 })

  const results = []
  for (const [key, value] of Object.entries(updates)) {
    const { data, error } = await supabase
      .from('cms_content')
      .upsert({ section, key, value, updated_at: new Date().toISOString() }, { onConflict: 'section,key' })
      .select()
      .single()
    if (error) results.push({ key, error: error.message })
    else results.push({ key, success: true })
  }

  return NextResponse.json({ results })
}
