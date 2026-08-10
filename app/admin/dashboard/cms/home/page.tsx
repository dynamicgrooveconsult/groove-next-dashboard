'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabaseClient'

const STORAGE_BUCKET = 'Groove-media'

export default function HomePageManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hero, setHero] = useState({ title: '', subtitle: '', description: '', cta_text: '', cta_link: '', background_image: '' })
  const [stats, setStats] = useState({ events_covered: '', projects_completed: '', clients_served: '', years_experience: '' })
  const [cta, setCta] = useState({ title: '', description: '', button_text: '', button_link: '' })
  const [bgFile, setBgFile] = useState<File | null>(null)
  const [bgPreview, setBgPreview] = useState<string | null>(null)
  const { toast, showToast, hideToast, ToastComponent } = useToast()

  useEffect(() => {
    Promise.all([
      fetch('/api/cms/content?section=home_hero').then(r => r.json()),
      fetch('/api/cms/content?section=home_stats').then(r => r.json()),
      fetch('/api/cms/content?section=home_cta').then(r => r.json()),
    ]).then(([heroData, statsData, ctaData]) => {
      if (Array.isArray(heroData)) heroData.forEach((item: any) => setHero(p => ({ ...p, [item.key]: item.value })))
      if (Array.isArray(statsData)) statsData.forEach((item: any) => setStats(p => ({ ...p, [item.key]: item.value })))
      if (Array.isArray(ctaData)) ctaData.forEach((item: any) => setCta(p => ({ ...p, [item.key]: item.value })))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const uploadBg = async () => {
    if (!bgFile) return hero.background_image
    const ext = bgFile.name.split('.').pop()
    const path = `homepage/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, bgFile)
    if (error) throw new Error(error.message)
    return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const bgUrl = await uploadBg()
      const heroUpdates: any = { ...hero }
      if (bgUrl) heroUpdates.background_image = bgUrl

      await Promise.all([
        fetch('/api/cms/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'home_hero', updates: heroUpdates }) }),
        fetch('/api/cms/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'home_stats', updates: stats }) }),
        fetch('/api/cms/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'home_cta', updates: cta }) }),
      ])
      showToast('Home page updated successfully.')
      setBgFile(null)
    } catch (err: any) {
      showToast(err.message || 'Failed to save', 'error')
    }
    setSaving(false)
  }

  if (loading) return <div className="p-8 text-zinc-400">Loading...</div>

  return (
    <div className="p-8 max-w-4xl">
      {ToastComponent}
      <h1 className="text-2xl font-bold mb-1">Home Page Manager</h1>
      <p className="text-zinc-400 text-sm mb-8">Edit homepage hero, stats, and call-to-action sections</p>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Hero Title</label>
              <input value={hero.title} onChange={e => setHero(p => ({ ...p, title: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Hero Subtitle</label>
              <textarea value={hero.subtitle} onChange={e => setHero(p => ({ ...p, subtitle: e.target.value }))} rows={2} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 resize-none" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Hero Description</label>
              <textarea value={hero.description} onChange={e => setHero(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">CTA Button Text</label>
                <input value={hero.cta_text} onChange={e => setHero(p => ({ ...p, cta_text: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">CTA Button Link</label>
                <input value={hero.cta_link} onChange={e => setHero(p => ({ ...p, cta_link: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Background Image</label>
              {(bgPreview || hero.background_image) && (
                <div className="mb-2 w-48 h-28 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800">
                  <img src={bgPreview || hero.background_image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-black border border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-600 transition text-sm">
                <span className="text-yellow-500">📷</span>
                <span className="text-zinc-400">{bgFile ? bgFile.name : 'Upload Image'}</span>
                <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setBgFile(f); setBgPreview(URL.createObjectURL(f)) } }} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'events_covered', label: 'Events Covered' },
              { key: 'projects_completed', label: 'Projects Completed' },
              { key: 'clients_served', label: 'Clients Served' },
              { key: 'years_experience', label: 'Years of Experience' },
            ].map(s => (
              <div key={s.key}>
                <label className="block text-xs text-zinc-500 mb-1">{s.label}</label>
                <input value={(stats as any)[s.key]} onChange={e => setStats(p => ({ ...p, [s.key]: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Homepage Call-to-Action</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">CTA Title</label>
              <input value={cta.title} onChange={e => setCta(p => ({ ...p, title: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">CTA Description</label>
              <textarea value={cta.description} onChange={e => setCta(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Button Text</label>
                <input value={cta.button_text} onChange={e => setCta(p => ({ ...p, button_text: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Button Link</label>
                <input value={cta.button_link} onChange={e => setCta(p => ({ ...p, button_link: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold text-sm hover:bg-yellow-400 transition disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
