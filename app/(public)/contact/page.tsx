'use client'

import { useState, useEffect, useCallback } from 'react'

interface SiteSettings {
  facebook_url?: string
  instagram_url?: string
  youtube_url?: string
  tiktok_url?: string
  twitter_url?: string
  linkedin_url?: string
  whatsapp_number?: string
  contact_email?: string
  contact_phone?: string
  office_address?: string
  map_embed_url?: string
}

const socialConfig: { key: keyof SiteSettings; label: string }[] = [
  { key: 'facebook_url', label: 'Facebook' },
  { key: 'instagram_url', label: 'Instagram' },
  { key: 'youtube_url', label: 'YouTube' },
  { key: 'tiktok_url', label: 'TikTok' },
  { key: 'twitter_url', label: 'X (Twitter)' },
  { key: 'linkedin_url', label: 'LinkedIn' },
]

function getMapSrc(value: string | undefined): string {
  if (!value) return ''
  const match = value.match(/src=["']([^"']+)["']/)
  return match ? match[1] : value.trim()
}

function cleanPhone(raw: string) {
  return raw.replace(/[^0-9]/g, '').replace(/^0/, '')
}

function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  const cls = className || 'w-6 h-6'
  switch (platform) {
    case 'facebook_url':
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    case 'instagram_url':
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      )
    case 'youtube_url':
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    case 'tiktok_url':
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      )
    case 'twitter_url':
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    case 'linkedin_url':
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    default:
      return null
  }
}

function FloatingInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  isFocused,
  type = 'text',
  required = true,
  pattern,
  error,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  onBlur: () => void
  onFocus: () => void
  isFocused: boolean
  type?: string
  required?: boolean
  pattern?: string
  error?: string
}) {
  const float = isFocused || value.length > 0

  const borderColor = error
    ? 'border-red-500'
    : float && isFocused
      ? 'border-cyan-400'
      : 'border-zinc-700'

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        required={required}
        pattern={pattern}
        className={`w-full rounded-xl bg-[#111] text-white outline-none transition-all duration-200
                    px-4 pt-6 pb-2 text-base
                    border-2 ${borderColor}
                    focus:shadow-[0_0_0_1px_rgba(34,211,238,0.15)]
                    ${error ? 'focus:shadow-red-500/20' : ''}
                    ${!error && float && !isFocused ? 'border-green-500/60' : ''}
                    placeholder-transparent`}
        placeholder={label}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none select-none
                    ${float ? 'top-1.5 text-xs' : 'top-4 text-base'}
                    ${error ? 'text-red-400' : float ? 'text-cyan-400' : 'text-zinc-500'}`}
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {error && (
        <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>
      )}
    </div>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function BookingForm() {
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [eventType, setEventType] = useState('Wedding')
  const [eventDate, setEventDate] = useState('')
  const [budget, setBudget] = useState('')
  const [notes, setNotes] = useState('')
  const [bookFocused, setBookFocused] = useState<string | null>(null)
  const [bookTouched, setBookTouched] = useState<Set<string>>(new Set())
  const [submittingBooking, setSubmittingBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState('')

  const markBTouched = useCallback((field: string) => {
    setBookTouched(prev => new Set(prev).add(field))
  }, [])

  const bNameErr = bookTouched.has('bname') && clientName.trim().length === 0 ? 'Name is required' : undefined
  const bPhoneErr = bookTouched.has('bphone') && clientPhone.trim().length === 0 ? 'Phone is required' : undefined
  const bDateErr = bookTouched.has('bdate') && !eventDate ? 'Date is required' : undefined

  const bookingValid = clientName.trim().length > 0 && clientPhone.trim().length > 0

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookTouched(new Set(['bname', 'bphone']))

    if (!bookingValid) return

    setSubmittingBooking(true)
    setBookingError('')

    try {
      const formattedDate = eventDate
        ? new Date(eventDate + 'T00:00:00').toISOString().split('T')[0]
        : null

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName.trim(),
          client_phone: clientPhone.trim(),
          client_email: clientEmail.trim() || undefined,
          event_type: eventType,
          event_date: formattedDate,
          total_amount: budget ? Number(budget) : 0,
          notes: notes.trim(),
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to submit booking')
      }

      setBookingSuccess(true)
      setClientName('')
      setClientPhone('')
      setClientEmail('')
      setEventType('Wedding')
      setEventDate('')
      setBudget('')
      setNotes('')
      setBookTouched(new Set())

      setTimeout(() => setBookingSuccess(false), 5000)
    } catch (err: any) {
      console.error('Booking submission error:', err)
      setBookingError(err.message)
    } finally {
      setSubmittingBooking(false)
    }
  }

  return (
    <>
      {bookingSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-green-900/30 border border-green-700/40 flex items-center gap-3 animate-fadeIn">
          <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="text-green-300 text-sm font-medium">Booking Request Sent!</p>
            <p className="text-green-400/60 text-xs mt-0.5">We&apos;ll review and confirm your booking shortly.</p>
          </div>
        </div>
      )}

      {bookingError && (
        <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-700/40 flex items-center gap-3">
          <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-300 text-sm">{bookingError}</p>
        </div>
      )}

      <form onSubmit={handleBooking} noValidate className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FloatingInput
            id="bname"
            label="Full Name"
            value={clientName}
            onChange={setClientName}
            onFocus={() => setBookFocused('bname')}
            onBlur={() => { setBookFocused(null); markBTouched('bname') }}
            isFocused={bookFocused === 'bname'}
            error={bNameErr}
          />
          <FloatingInput
            id="bphone"
            label="Phone Number"
            type="tel"
            value={clientPhone}
            onChange={setClientPhone}
            onFocus={() => setBookFocused('bphone')}
            onBlur={() => { setBookFocused(null); markBTouched('bphone') }}
            isFocused={bookFocused === 'bphone'}
            error={bPhoneErr}
          />
        </div>

        <FloatingInput
          id="bemail"
          label="Email Address"
          type="email"
          value={clientEmail}
          onChange={setClientEmail}
          onFocus={() => setBookFocused('bemail')}
          onBlur={() => setBookFocused(null)}
          isFocused={bookFocused === 'bemail'}
          required={false}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="relative">
            <select
              id="bevent"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              onFocus={() => setBookFocused('bevent')}
              onBlur={() => setBookFocused(null)}
              className="w-full rounded-xl bg-[#111] text-white outline-none transition-all duration-200
                         px-4 pt-6 pb-2 text-base appearance-none cursor-pointer
                         border-2 border-zinc-700 focus:border-cyan-400
                         focus:shadow-[0_0_0_1px_rgba(34,211,238,0.15)]"
            >
              <option value="Wedding">Wedding</option>
              <option value="Birthday">Birthday</option>
              <option value="Corporate">Corporate Event</option>
              <option value="Live Stream">Live Stream</option>
              <option value="Other">Other</option>
            </select>
            <label
              htmlFor="bevent"
              className={`absolute left-4 transition-all duration-200 pointer-events-none select-none
                          ${bookFocused === 'bevent' || eventType ? 'top-1.5 text-xs text-cyan-400' : 'top-4 text-base text-zinc-500'}`}
            >
              Event Type
              <span className="text-red-400 ml-0.5">*</span>
            </label>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <input
              id="bdate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              onFocus={() => setBookFocused('bdate')}
              onBlur={() => { setBookFocused(null); markBTouched('bdate') }}
              className={`w-full rounded-xl bg-[#111] text-white outline-none transition-all duration-200
                          px-4 pt-6 pb-2 text-base
                          border-2 ${bDateErr ? 'border-red-500' : bookFocused === 'bdate' ? 'border-cyan-400' : 'border-zinc-700'}
                          focus:shadow-[0_0_0_1px_rgba(34,211,238,0.15)]
                          [color-scheme:dark]`}
            />
            <label
              htmlFor="bdate"
              className={`absolute left-4 transition-all duration-200 pointer-events-none select-none
                          ${bookFocused === 'bdate' || eventDate ? 'top-1.5 text-xs text-cyan-400' : 'top-4 text-base text-zinc-500'}`}
            >
              Event Date
              <span className="text-red-400 ml-0.5">*</span>
            </label>
            {bDateErr && <p className="text-red-400 text-xs mt-1 ml-1">{bDateErr}</p>}
          </div>
        </div>

        <FloatingInput
          id="bbudget"
          label="Estimated Budget (optional)"
          type="number"
          value={budget}
          onChange={setBudget}
          onFocus={() => setBookFocused('bbudget')}
          onBlur={() => setBookFocused(null)}
          isFocused={bookFocused === 'bbudget'}
          required={false}
        />

        <div className="relative">
          <textarea
            id="bnotes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onFocus={() => setBookFocused('bnotes')}
            onBlur={() => setBookFocused(null)}
            rows={3}
            placeholder="Additional Notes"
            className="w-full rounded-xl bg-[#111] text-white outline-none transition-all duration-200 resize-none
                        px-4 pt-6 pb-2 text-base
                        border-2 border-zinc-700 focus:border-cyan-400
                        focus:shadow-[0_0_0_1px_rgba(34,211,238,0.15)]
                        placeholder-transparent"
          />
          <label
            htmlFor="bnotes"
            className={`absolute left-4 transition-all duration-200 pointer-events-none select-none
                        ${bookFocused === 'bnotes' || notes.length > 0 ? 'top-1.5 text-xs text-cyan-400' : 'top-4 text-base text-zinc-500'}`}
          >
            Additional Notes
          </label>
        </div>

        <button
          type="submit"
          disabled={submittingBooking}
          className="relative w-full py-4 rounded-xl font-bold text-base transition-all duration-300
                     bg-gradient-to-r from-cyan-500 to-blue-600
                     hover:from-cyan-400 hover:to-blue-500
                     hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/25
                     active:translate-y-0
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                     text-white flex items-center justify-center gap-3 group"
        >
          <svg className={`w-5 h-5 ${submittingBooking ? 'animate-spin' : 'group-hover:scale-110'} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {submittingBooking ? (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            )}
          </svg>
          <span>{submittingBooking ? 'Submitting...' : 'Submit Booking Request'}</span>
        </button>
      </form>
    </>
  )
}

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings>({})

  useEffect(() => {
    fetch('/api/site-settings')
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) setSettings(data)
      })
      .catch(() => {})
  }, [])

  const phone = settings.contact_phone || '09153870151'
  const whatsapp = settings.whatsapp_number || '08086148671'
  const email = settings.contact_email || 'hello@dynamicgroove.media'
  const address = settings.office_address || '9, Oluniyi-Fayinto, Off Pipeline, Fagba, Lagos'
  const mapSrc = getMapSrc(settings.map_embed_url)

  const socialLinks = socialConfig
    .filter(s => settings[s.key])
    .map(s => ({ key: s.key, label: s.label, url: settings[s.key]! }))

  const [focused, setFocused] = useState<string | null>(null)
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [name, setName] = useState('')
  const [phoneVal, setPhoneVal] = useState('')
  const [service, setService] = useState('Live Streaming')
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' })
  const [submitting, setSubmitting] = useState(false)

  const markTouched = useCallback((field: string) => {
    setTouched(prev => new Set(prev).add(field))
  }, [])

  const nameError = touched.has('name') && name.trim().length === 0 ? 'Name is required' : undefined
  const phoneError = touched.has('phone') && phoneVal.trim().length === 0 ? 'Phone is required' : undefined
  const msgError = touched.has('message') && message.trim().length === 0 ? 'Message is required' : undefined

  const isValid = name.trim().length > 0 && phoneVal.trim().length > 0 && message.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(new Set(['name', 'phone', 'message']))

    if (!isValid) return

    setSubmitting(true)
    const clean = cleanPhone(whatsapp)
    const waUrl = `https://wa.me/234${clean}?text=New%20Inquiry%20from%20Dynamic%20Groove%20Media%20Website%0A%0AName%3A%20${encodeURIComponent(name)}%0APhone%3A%20${encodeURIComponent(phoneVal)}%0AService%3A%20${encodeURIComponent(service)}%0AMessage%3A%20${encodeURIComponent(message)}`

    setToast({ visible: true, message: 'Message ready! Redirecting to WhatsApp...' })

    setTimeout(() => {
      setToast({ visible: false, message: '' })
      setSubmitting(false)
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    }, 2000)
  }

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-[#050505] text-white">

      {/* ===== LEFT PANEL — Hero Image Area ===== */}
      <section className="relative w-full md:w-[40%] min-h-[50vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `
              linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.85) 100%),
              radial-gradient(ellipse at 20% 50%, rgba(6,182,212,0.15) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(234,179,8,0.1) 0%, transparent 50%),
              linear-gradient(180deg, #0a1628 0%, #0f2027 40%, #203a43 70%, #0a0a0a 100%)
            `,
          }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative z-10 px-8 md:px-12 text-center md:text-left">
          <p className="text-yellow-500 text-xs tracking-[0.2em] uppercase mb-4 font-medium">
            Dynamic Groove Media
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Let&apos;s Create{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-yellow-400">
              Something
            </span>{' '}
            <br />
            Exceptional
          </h1>
          <p className="mt-6 text-zinc-400 text-sm md:text-base max-w-md leading-relaxed">
            Ready to elevate your next project? Tell us about it and we&apos;ll get back to you within 2 hours.
          </p>
          <div className="mt-8 flex gap-2">
            <div className="w-12 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-yellow-400" />
            <div className="w-4 h-1 rounded-full bg-zinc-700" />
          </div>
        </div>
      </section>

      {/* ===== RIGHT PANEL — Form + Details ===== */}
      <section className="relative w-full md:w-[60%] bg-[#0a0a0a] overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-12 md:py-16 lg:py-20">

          {/* Section Title */}
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Get in Touch</h2>
            <p className="text-zinc-500 text-sm mt-2">Fill out the form and we&apos;ll reach out via WhatsApp</p>
          </div>

          {/* ===== FORM ===== */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <FloatingInput
              id="name"
              label="Full Name"
              value={name}
              onChange={setName}
              onFocus={() => setFocused('name')}
              onBlur={() => { setFocused(null); markTouched('name') }}
              isFocused={focused === 'name'}
              error={nameError}
            />

            <FloatingInput
              id="phone"
              label="Phone Number"
              type="tel"
              value={phoneVal}
              onChange={setPhoneVal}
              onFocus={() => setFocused('phone')}
              onBlur={() => { setFocused(null); markTouched('phone') }}
              isFocused={focused === 'phone'}
              error={phoneError}
            />

            <div className="relative">
              <select
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                onFocus={() => setFocused('service')}
                onBlur={() => setFocused(null)}
                className="w-full rounded-xl bg-[#111] text-white outline-none transition-all duration-200
                           px-4 pt-6 pb-2 text-base appearance-none cursor-pointer
                           border-2 border-zinc-700 focus:border-cyan-400
                           focus:shadow-[0_0_0_1px_rgba(34,211,238,0.15)]"
              >
                <option value="Live Streaming">Live Streaming</option>
                <option value="Multimedia">Multimedia Production</option>
                <option value="Event Management">Event Management</option>
                <option value="Other">Other</option>
              </select>
              <label
                htmlFor="service"
                className={`absolute left-4 transition-all duration-200 pointer-events-none select-none
                            ${focused === 'service' || service ? 'top-1.5 text-xs text-cyan-400' : 'top-4 text-base text-zinc-500'}`}
              >
                Service Interest
              </label>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() => setFocused('message')}
                onBlur={() => { setFocused(null); markTouched('message') }}
                required
                rows={5}
                placeholder="Message"
                className={`w-full rounded-xl bg-[#111] text-white outline-none transition-all duration-200 resize-none
                            px-4 pt-6 pb-2 text-base
                            border-2 ${msgError ? 'border-red-500' : focused === 'message' ? 'border-cyan-400' : touched.has('message') && message.trim().length > 0 ? 'border-green-500/60' : 'border-zinc-700'}
                            focus:shadow-[0_0_0_1px_rgba(34,211,238,0.15)]
                            ${msgError ? 'focus:shadow-red-500/20' : ''}
                            placeholder-transparent`}
              />
              <label
                htmlFor="message"
                className={`absolute left-4 transition-all duration-200 pointer-events-none select-none
                            ${focused === 'message' || message.length > 0 ? 'top-1.5 text-xs' : 'top-4 text-base'}
                            ${msgError ? 'text-red-400' : focused === 'message' ? 'text-cyan-400' : 'text-zinc-500'}`}
              >
                Message
                <span className="text-red-400 ml-0.5">*</span>
              </label>
              {msgError && (
                <p className="text-red-400 text-xs mt-1 ml-1">{msgError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="relative w-full py-4 rounded-xl font-bold text-base transition-all duration-300
                         bg-gradient-to-r from-green-500 to-emerald-600
                         hover:from-green-400 hover:to-emerald-500
                         hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/25
                         active:translate-y-0
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                         text-white flex items-center justify-center gap-3 group"
            >
              <WhatsAppIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{submitting ? 'Preparing...' : 'Send Message via WhatsApp'}</span>
            </button>
          </form>

          {/* ===== BOOK A SERVICE — New Booking Form ===== */}
          <div className="relative my-16">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0a0a0a] px-6 text-xs tracking-[0.15em] uppercase text-zinc-600 font-medium">
                Or Book a Service
              </span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Book a Service</h2>
            <p className="text-zinc-500 text-sm mt-2">Request a booking and we&apos;ll confirm availability</p>
          </div>

          <BookingForm />

          {/* ===== DIVIDER ===== */}
          <div className="my-12 border-t border-zinc-800" />

          {/* ===== CONTACT DETAILS — Glassmorphism Card ===== */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Contact Details</h3>
                <p className="text-xs text-zinc-500">Reach us directly</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-zinc-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-zinc-500">Email</p>
                  <a href={`mailto:${email}`} className="text-white text-sm hover:text-cyan-400 transition-colors">{email}</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-zinc-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-xs text-zinc-500">Address</p>
                  <p className="text-white text-sm">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-zinc-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs text-zinc-500">Office Line</p>
                  <a href={`tel:+234${cleanPhone(phone)}`} className="text-white text-sm hover:text-cyan-400 transition-colors">{phone}</a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={`https://wa.me/234${cleanPhone(whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300
                           bg-green-600 hover:bg-green-500 text-white
                           hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/30
                           active:translate-y-0"
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href={`tel:+234${cleanPhone(phone)}`}
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300
                           bg-yellow-500 hover:bg-yellow-400 text-black
                           hover:-translate-y-0.5 hover:shadow-lg hover:shadow-yellow-500/30
                           active:translate-y-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Us
              </a>
            </div>
          </div>

          {/* ===== TRUST ROW ===== */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center sm:justify-start">
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Response Time: <span className="text-white font-medium">&lt; 2 Hours</span></span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Available <span className="text-white font-medium">Mon-Sat: 9AM - 6PM</span></span>
            </div>
          </div>

          {/* ===== MAP ===== */}
          {mapSrc && (
            <div className="mt-8 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
              <iframe
                src={mapSrc}
                width="100%"
                height="240"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              />
            </div>
          )}

          {/* ===== SOCIAL LINKS ===== */}
          {socialLinks.length > 0 && (
            <div className="mt-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
              <h3 className="text-sm font-semibold text-zinc-400 mb-4 tracking-wide">Follow Us</h3>
              <div className="flex justify-center gap-6">
                {socialLinks.map(s => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-yellow-400 transition-all duration-300 hover:scale-110"
                    title={s.label}
                  >
                    <SocialIcon platform={s.key} className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Footer spacer */}
          <p className="mt-10 text-center text-xs text-zinc-700">
            &copy; {new Date().getFullYear()} Dynamic Groove Media. All rights reserved.
          </p>

        </div>
      </section>

      {/* ===== TOAST NOTIFICATION ===== */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-xl px-5 py-4 shadow-2xl
                          flex items-center gap-3 min-w-[280px]">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-medium">{toast.message}</p>
              <p className="text-zinc-500 text-xs mt-0.5">Opening WhatsApp...</p>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
