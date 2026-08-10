import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServiceClient } from '@/lib/supabaseAdmin'

const supabase = getServiceClient()

async function isAdmin() {
  const s = await cookies()
  return s.get('admin_auth')?.value === 'granted'
}

export async function GET() {
  const buckets = ['ceo-images', 'portfolio-images', 'Groove-media']
  const all: any[] = []
  for (const bucket of buckets) {
    const { data, error } = await supabase.storage.from(bucket).list('', { limit: 100 })
    if (!error && data) {
      data.forEach(f => all.push({ name: f.name, bucket, url: supabase.storage.from(bucket).getPublicUrl(f.name).data.publicUrl, created_at: f.created_at, updated_at: f.updated_at }))
    }
  }
  all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  return NextResponse.json(all)
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const form = await req.formData()
  const file = form.get('file') as File
  const bucket = (form.get('bucket') as string) || 'Groove-media'
  if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 })

  const ext = file.name.split('.').pop()
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: upErr } = await supabase.storage.from(bucket).upload(path, file)
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
  return NextResponse.json({ url: urlData.publicUrl, path, bucket })
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { bucket, path } = await req.json()
  if (!bucket || !path) return NextResponse.json({ error: 'bucket and path required' }, { status: 400 })
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
