'use client'

import { useEffect, useState } from 'react'

const FIELDS = [
  { key: 'facebook_url', label: 'Facebook URL', type: 'url' },
  { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
  { key: 'youtube_url', label: 'YouTube URL', type: 'url' },
  { key: 'tiktok_url', label: 'TikTok URL', type: 'url' },
  { key: 'twitter_url', label: 'Twitter / X URL', type: 'url' },
  { key: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
  { key: 'whatsapp_number', label: 'WhatsApp Number', type: 'text' },
  { key: 'contact_email', label: 'Contact Email', type: 'email' },
  { key: 'contact_phone', label: 'Contact Phone', type: 'tel' },
  { key: 'office_address', label: 'Office Address', type: 'text' },
  { key: 'map_embed_url', label: 'Google Map Embed URL', type: 'url' },
]

export default function SiteSettingsPage() {
  const [form, setForm] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    fetch('/api/site-settings')
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          const init: Record<string, string> = {}
          FIELDS.forEach(f => { init[f.key] = data[f.key] || '' })
          setForm(init)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    setToast(null)
    try {
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save')
      }
      setToast({ type: 'success', message: 'Settings saved successfully!' })
    } catch (e: any) {
      setToast({ type: 'error', message: e.message || 'Something went wrong' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-zinc-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Site Settings</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Manage social media links, contact details, and the Google Map embed.
      </p>

      {toast && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-green-900/50 border border-green-700 text-green-300'
              : 'bg-red-900/50 border border-red-700 text-red-300'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-yellow-500 border-b border-zinc-800 pb-3">
            Social Media Links
          </h2>
          {FIELDS.slice(0, 6).map(field => (
            <div key={field.key}>
              <label className="block text-zinc-400 text-sm font-medium mb-1.5">
                {field.label}
              </label>
              <input
                type={field.type}
                value={form[field.key] || ''}
                onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={`https://`}
                className="w-full p-3 rounded-lg bg-[#111111] text-white border border-zinc-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition text-sm"
              />
            </div>
          ))}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-yellow-500 border-b border-zinc-800 pb-3">
            Contact Information
          </h2>
          {FIELDS.slice(6).map(field => (
            <div key={field.key}>
              <label className="block text-zinc-400 text-sm font-medium mb-1.5">
                {field.label}
              </label>
              {field.key === 'office_address' ? (
                <textarea
                  value={form[field.key] || ''}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  rows={3}
                  className="w-full p-3 rounded-lg bg-[#111111] text-white border border-zinc-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition text-sm resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  value={form[field.key] || ''}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={
                    field.key === 'map_embed_url'
                      ? 'https://www.google.com/maps/embed?pb=...'
                      : field.key === 'whatsapp_number'
                        ? '+2348000000000'
                        : ''
                  }
                  className="w-full p-3 rounded-lg bg-[#111111] text-white border border-zinc-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition text-sm"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
