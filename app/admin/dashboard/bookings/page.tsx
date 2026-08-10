'use client'

import { useEffect, useState, useCallback } from 'react'
import { useToast } from '@/components/Toast'

interface Booking {
  id: number
  client_name: string
  client_phone: string
  client_email: string | null
  event_type: string
  event_date: string | null
  total_amount: number
  commitment_paid: boolean
  mobilization_paid: boolean
  final_balance_paid: boolean
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

const statusSteps = ['Pending', 'Confirmed', 'Completed']

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    Confirmed: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    Completed: 'bg-green-500/15 text-green-400 border-green-500/30',
  }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors[status] || colors.Pending}`}>
      {status}
    </span>
  )
}

function PaymentDot({ paid }: { paid: boolean }) {
  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full ${paid ? 'bg-green-400' : 'bg-zinc-600'}`} />
  )
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const { toast, showToast, hideToast, ToastComponent } = useToast()

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch('/api/bookings')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setBookings(data)
    } catch {
      showToast('Failed to load bookings', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const handleSave = async (booking: Booking) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      })
      if (!res.ok) throw new Error('Failed to update')
      setBookings(prev => prev.map(b => b.id === booking.id ? booking : b))
      setEditingId(null)
      showToast('Booking updated')
    } catch {
      showToast('Failed to save changes', 'error')
    }
  }

  const togglePayment = (booking: Booking, field: 'commitment_paid' | 'mobilization_paid' | 'final_balance_paid') => {
    const updated = { ...booking, [field]: !booking[field] }
    if (editingId === booking.id) {
      setBookings(prev => prev.map(b => b.id === booking.id ? updated : b))
    }
  }

  const advanceStatus = (booking: Booking) => {
    const idx = statusSteps.indexOf(booking.status)
    if (idx < statusSteps.length - 1) {
      const updated = { ...booking, status: statusSteps[idx + 1] }
      setBookings(prev => prev.map(b => b.id === booking.id ? updated : b))
    }
  }

  const formatDate = (d: string | null) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {ToastComponent}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage client booking requests</p>
        </div>
        <span className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
          {bookings.length} total
        </span>
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm py-20 text-center">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-zinc-600 text-sm py-20 text-center border border-dashed border-zinc-800 rounded-xl">
          No bookings yet.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isEditing = editingId === booking.id
            return (
              <div
                key={booking.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 transition hover:border-zinc-700"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">

                  {/* Client Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-white truncate">{booking.client_name}</h3>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-zinc-500">
                      <span>{booking.client_phone}</span>
                      {booking.client_email && <span className="truncate">{booking.client_email}</span>}
                      <span className="text-zinc-400 font-medium">{booking.event_type}</span>
                      <span>{formatDate(booking.event_date)}</span>
                      {booking.total_amount > 0 && (
                        <span className="text-yellow-400/80">₦{Number(booking.total_amount).toLocaleString()}</span>
                      )}
                    </div>
                    {booking.notes && (
                      <p className="text-xs text-zinc-600 mt-1.5 italic truncate">{booking.notes}</p>
                    )}
                  </div>

                  {/* Payment Status */}
                  <div className="flex items-center gap-4 shrink-0">
                    {isEditing ? (
                      <div className="flex items-center gap-3">
                        {([
                          ['commitment_paid', 'Commit'],
                          ['mobilization_paid', 'Mobil'],
                          ['final_balance_paid', 'Final'],
                        ] as const).map(([field, label]) => (
                          <button
                            key={field}
                            type="button"
                            onClick={() => togglePayment(booking, field)}
                            className={`text-xs px-2.5 py-1.5 rounded-full border transition ${
                              booking[field]
                                ? 'bg-green-500/15 border-green-500/40 text-green-400'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-600'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="flex items-center gap-1"><PaymentDot paid={booking.commitment_paid} /> C</span>
                        <span className="flex items-center gap-1"><PaymentDot paid={booking.mobilization_paid} /> M</span>
                        <span className="flex items-center gap-1"><PaymentDot paid={booking.final_balance_paid} /> F</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => booking.status !== 'Completed' && advanceStatus(booking)}
                          disabled={booking.status === 'Completed'}
                          className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20
                                     hover:bg-cyan-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {booking.status === 'Pending' && 'Confirm →'}
                          {booking.status === 'Confirmed' && 'Complete →'}
                          {booking.status === 'Completed' && '✓ Done'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSave(booking)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20
                                     hover:bg-yellow-500/20 transition"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditingId(null); fetchBookings() }}
                          className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700
                                     hover:bg-zinc-700 transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingId(booking.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700
                                   hover:bg-zinc-700 hover:text-white transition"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
