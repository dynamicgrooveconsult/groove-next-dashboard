'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/Toast'

export default function ContactManager() {
  const [loading, setLoading] = useState(true)
  const [info, setInfo] = useState({ phone: '', whatsapp: '', email: '', address: '', map_link: '' })
  const [social, setSocial] = useState({ facebook: '', instagram: '', youtube: '', linkedin: '', tiktok: '' })
  const { toast, showToast, hideToast, ToastComponent } = useToast()

  useEffect(() => {
    Promise.all([
      fetch('/api/cms/content?section=contact_info').then(r => r.json()),
      fetch('/api/cms/content?section=contact_social').then(r => r.json()),
    ]).then(([infoData, socialData]) => {
      if (Array.isArray(infoData)) infoData.forEach((i: any) => setInfo(p => ({ ...p, [i.key]: i.value })))
      if (Array.isArray(socialData)) socialData.forEach((i: any) => setSocial(p => ({ ...p, [i.key]: i.value })))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    try {
      await Promise.all([
        fetch('/api/cms/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'contact_info', updates: info }) }),
        fetch('/api/cms/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'contact_social', updates: social }) }),
      ])
      showToast('Contact information updated successfully.')
    } catch { showToast('Failed to save', 'error') }
  }

  if (loading) return <div className="p-8 text-zinc-400">Loading...</div>

  return (
    <div className="p-8 max-w-4xl">
      {ToastComponent}
      <h1 className="text-2xl font-bold mb-1">Contact Page Manager</h1>
      <p className="text-zinc-400 text-sm mb-8">Edit contact information and social media links</p>

      <div className="space-y-8">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'phone', label: 'Phone Number' },
              { key: 'whatsapp', label: 'WhatsApp Number' },
              { key: 'email', label: 'Email Address', type: 'email' },
              { key: 'address', label: 'Office Address' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-zinc-500 mb-1">{f.label}</label>
                <input value={(info as any)[f.key]} onChange={e => setInfo(p => ({ ...p, [f.key]: e.target.value }))} type={f.type || 'text'} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-xs text-zinc-500 mb-1">Google Map Link (Embed URL)</label>
              <input value={info.map_link} onChange={e => setInfo(p => ({ ...p, map_link: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" placeholder="https://maps.google.com/..." />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'facebook', label: 'Facebook', icon: '📘' },
              { key: 'instagram', label: 'Instagram', icon: '📷' },
              { key: 'youtube', label: 'YouTube', icon: '▶️' },
              { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
              { key: 'tiktok', label: 'TikTok', icon: '🎵' },
            ].map(s => (
              <div key={s.key}>
                <label className="block text-xs text-zinc-500 mb-1">{s.icon} {s.label}</label>
                <input value={(social as any)[s.key]} onChange={e => setSocial(p => ({ ...p, [s.key]: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" placeholder={`https://${s.key}.com/...`} />
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSave} className="bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold text-sm hover:bg-yellow-400 transition">Save Changes</button>
      </div>
    </div>
  )
}
