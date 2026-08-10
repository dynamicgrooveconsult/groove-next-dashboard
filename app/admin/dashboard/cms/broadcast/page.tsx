'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/Toast'

export default function BroadcastSettings() {
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({ offline_message: '', stream_title: '', stream_description: '', lower_third: '', cta_message: '' })
  const { toast, showToast, hideToast, ToastComponent } = useToast()

  useEffect(() => {
    fetch('/api/cms/content?section=broadcast').then(r => r.json()).then(data => {
      if (Array.isArray(data)) data.forEach((i: any) => setSettings(p => ({ ...p, [i.key]: i.value })))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    try {
      await fetch('/api/cms/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'broadcast', updates: settings }) })
      showToast('Broadcast settings updated successfully.')
    } catch { showToast('Failed to save', 'error') }
  }

  if (loading) return <div className="p-8 text-zinc-400">Loading...</div>

  return (
    <div className="p-8 max-w-4xl">
      {ToastComponent}
      <h1 className="text-2xl font-bold mb-1">Broadcast Settings</h1>
      <p className="text-zinc-400 text-sm mb-8">Manage live broadcast messages and display text</p>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="space-y-4">
          {[
            { key: 'offline_message', label: 'Offline Message', desc: 'Displayed when stream is offline (e.g. "We Will Be Live Shortly")', rows: 1 },
            { key: 'stream_title', label: 'Stream Title', desc: 'Default title shown on the live broadcast page', rows: 1 },
            { key: 'stream_description', label: 'Stream Description', desc: 'Short description of the current broadcast', rows: 2 },
            { key: 'lower_third', label: 'Lower Third Message', desc: 'Overlay text shown during live broadcast', rows: 1 },
            { key: 'cta_message', label: 'Broadcast CTA Message', desc: 'Call-to-action shown during or after broadcast', rows: 2 },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs text-zinc-500 mb-1">{f.label}</label>
              <p className="text-[10px] text-zinc-600 mb-1.5">{f.desc}</p>
              {f.rows > 1 ? (
                <textarea value={(settings as any)[f.key]} onChange={e => setSettings(p => ({ ...p, [f.key]: e.target.value }))} rows={f.rows} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 resize-none" />
              ) : (
                <input value={(settings as any)[f.key]} onChange={e => setSettings(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
              )}
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className="mt-6 bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold text-sm hover:bg-yellow-400 transition">Save Changes</button>
    </div>
  )
}
