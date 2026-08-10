import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getServiceClient } from '@/lib/supabaseAdmin'

const resendApiKey = process.env.RESEND_API_KEY

const supabase = getServiceClient()

const resend = resendApiKey ? new Resend(resendApiKey) : null

const BUSINESS_EMAIL = 'israel.tope@dynamicgroove.com'

async function sendNotificationEmail(data: {
  full_name: string
  email: string
  service_interest: string | null
  message: string
}) {
  if (!resend) {
    console.warn('RESEND_API_KEY not set — skipping email notification')
    return
  }

  try {
    await resend.emails.send({
      from: 'Dynamic Groove Contact <onboarding@resend.dev>',
      to: BUSINESS_EMAIL,
      subject: `New Contact Submission from ${data.full_name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px">
          <tr><td style="padding:8px;font-weight:bold">Full Name</td><td style="padding:8px">${data.full_name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${data.email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Service Interest</td><td style="padding:8px">${data.service_interest || 'Not specified'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${data.message}</td></tr>
        </table>
      `,
    })
  } catch (emailErr) {
    console.error('Failed to send email notification:', emailErr)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { full_name, email, service_interest, message } = body

    if (!full_name || !email || !message) {
      return NextResponse.json(
        { error: 'full_name, email, and message are required' },
        { status: 400 }
      )
    }

    const { error } = await supabase.from('contact_submissions').insert([
      {
        full_name,
        email,
        service_interest: service_interest || null,
        message,
      },
    ])

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    await sendNotificationEmail({ full_name, email, service_interest: service_interest || null, message })

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
