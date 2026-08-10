import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServiceClient } from '@/lib/supabaseAdmin'

const supabase = getServiceClient()

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'granted'
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('event_date', { ascending: false })

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
  try {
    const body = await request.json()
    const { client_name, client_phone, client_email, event_type, event_date, total_amount, notes } = body

    if (!client_name || !client_phone || !event_type) {
      return NextResponse.json(
        { error: 'client_name, client_phone, and event_type are required' },
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          client_name,
          client_phone,
          client_email: client_email || null,
          event_type,
          event_date: event_date || null,
          total_amount: total_amount ? Number(total_amount) : 0,
          notes: notes || '',
          status: 'Pending',
          commitment_paid: false,
          mobilization_paid: false,
          final_balance_paid: false,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Booking request sent!', booking: data }, { status: 201 })
  } catch (err) {
    console.error('Booking API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
