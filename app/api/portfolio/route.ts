import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServiceClient } from '@/lib/supabaseAdmin'

const supabase = getServiceClient()

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'granted'
}

export async function GET() {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
      'Surrogate-Control': 'no-store',
    },
  })
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, category, description, image_url, video_url, type } = body

  if (!title || !category || !image_url) {
    return NextResponse.json({ error: 'title, category, and image_url are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('portfolio_items')
    .insert([{ title, category, description, image_url, video_url, type: type || 'image' }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
