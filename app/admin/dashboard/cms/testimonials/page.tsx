'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabaseClient'

const STORAGE_BUCKET = 'testimonials'

interface Testimonial {
  id: number
  client_name: string
  company: string
  position: string
  content: string
  rating: number
  image_url: string
  display_order: number
  is_visible: boolean
}

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<Testimonial>>({})
  const [showNew, setShowNew] = useState(false)
  const [newForm, setNewForm] = useState<Partial<Testimonial>>({ client_name: '', company: '', position: '', content: '', rating: 5, image_url: '', display_order: 0, is_visible: true })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { toast, showToast, hideToast, ToastComponent } = useToast()

  useEffect(() => { fetchTestimonials() }, [])

  const fetchTestimonials = async () => {
    const r = await fetch('/api/cms/testimonials')
    if (r.ok) setTestimonials(await r.json())
    setLoading(false)
  }

  const uploadImage = async (file: File) => {
    const path = `testimonials/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file)
    if (error) throw new Error(error.message)
    return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl
  }

  const handleCreate = async () => {
    if (!newForm.client_name?.trim() || !newForm.content?.trim()) { showToast('Name and content are required', 'error'); return }
    try {
      let image_url = ''
      if (imageFile) image_url = await uploadImage(imageFile)
      const r = await fetch('/api/cms/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newForm, image_url, display_order: testimonials.length + 1 }) })
      if (!r.ok) throw new Error('Failed to create')
      showToast('Testimonial created successfully')
      setShowNew(false)
      setNewForm({ client_name: '', company: '', position: '', content: '', rating: 5, image_url: '', display_order: 0, is_visible: true })
      setImageFile(null)
      fetchTestimonials()
    } catch (err: any) { showToast(err.message, 'error') }
  }

  const startEdit = (t: Testimonial) => { setEditingId(t.id); setEditForm(t) }

  const handleUpdate = async () => {
    if (!editingId) return
    try {
      let image_url = editForm.image_url || ''
      if (imageFile) image_url = await uploadImage(imageFile)
      const r = await fetch('/api/cms/testimonials', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...editForm, image_url }) })
      if (!r.ok) throw new Error('Failed to update')
      showToast('Testimonial updated successfully')
      setEditingId(null)
      setImageFile(null)
      fetchTestimonials()
    } catch (err: any) { showToast(err.message, 'error') }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete testimonial from "${name}"?`)) return
    const r = await fetch(`/api/cms/testimonials?id=${id}`, { method: 'DELETE' })
    if (r.ok) { showToast('Testimonial deleted'); fetchTestimonials() }
    else showToast('Failed to delete', 'error')
  }

  if (loading) return <div className="p-8 text-zinc-400">Loading...</div>

  return (
    <div className="p-8 max-w-4xl">
      {ToastComponent}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Testimonials Manager</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage client testimonials</p>
        </div>
        <button onClick={() => setShowNew(true)} className="bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold text-sm hover:bg-yellow-400 transition">+ Add Testimonial</button>
      </div>

      {showNew && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => { setShowNew(false); setImageFile(null); setNewForm({ client_name: '', company: '', position: '', content: '', rating: 5, image_url: '', display_order: 0, is_visible: true }) }}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">New Testimonial</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Client Name *" value={newForm.client_name} onChange={e => setNewForm(p => ({ ...p, client_name: e.target.value }))} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
                <input placeholder="Company" value={newForm.company} onChange={e => setNewForm(p => ({ ...p, company: e.target.value }))} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
              </div>
              <input placeholder="Position" value={newForm.position} onChange={e => setNewForm(p => ({ ...p, position: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
              <textarea placeholder="Testimonial *" value={newForm.content} onChange={e => setNewForm(p => ({ ...p, content: e.target.value }))} rows={3} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 resize-none" />
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Rating (1-5)</label>
                  <select value={newForm.rating} onChange={e => setNewForm(p => ({ ...p, rating: Number(e.target.value) }))} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50">
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer mt-5">
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                  <span className="px-4 py-2.5 bg-black border border-zinc-700 rounded-lg hover:border-zinc-600 transition">{imageFile ? imageFile.name : 'Upload Photo'}</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleCreate} className="bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold text-sm hover:bg-yellow-400 transition">Create</button>
                <button onClick={() => { setShowNew(false); setImageFile(null); setNewForm({ client_name: '', company: '', position: '', content: '', rating: 5, image_url: '', display_order: 0, is_visible: true }) }} className="px-5 py-2 rounded-full text-sm border border-zinc-700 text-zinc-400 hover:text-white transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {testimonials.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-500">No testimonials yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map(t => (
            <div key={t.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              {editingId === t.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input value={editForm.client_name || ''} onChange={e => setEditForm(p => ({ ...p, client_name: e.target.value }))} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
                    <input value={editForm.company || ''} onChange={e => setEditForm(p => ({ ...p, company: e.target.value }))} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
                  </div>
                  <input value={editForm.position || ''} onChange={e => setEditForm(p => ({ ...p, position: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
                  <textarea value={editForm.content || ''} onChange={e => setEditForm(p => ({ ...p, content: e.target.value }))} rows={3} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 resize-none" />
                  <div className="flex gap-4 items-center">
                    <select value={editForm.rating} onChange={e => setEditForm(p => ({ ...p, rating: Number(e.target.value) }))} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm">
                      {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</option>)}
                    </select>
                    <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                      <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                      <span className="px-4 py-2 bg-black border border-zinc-700 rounded-lg hover:border-zinc-600 transition">{t.image_url ? 'Replace Photo' : 'Upload Photo'}</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                      <input type="checkbox" checked={editForm.is_visible ?? true} onChange={e => setEditForm(p => ({ ...p, is_visible: e.target.checked }))} className="accent-yellow-500" />
                      Visible
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleUpdate} className="bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold text-sm hover:bg-yellow-400 transition">Save</button>
                    <button onClick={() => { setEditingId(null); setImageFile(null) }} className="px-5 py-2 rounded-full text-sm border border-zinc-700 text-zinc-400 hover:text-white transition">Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start gap-4">
                    {t.image_url && <img src={t.image_url} alt="" className="w-12 h-12 object-cover rounded-full" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{t.client_name}</h3>
                        <span className="text-yellow-500 text-xs">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
                      </div>
                      {(t.company || t.position) && <p className="text-xs text-zinc-500">{[t.position, t.company].filter(Boolean).join(' · ')}</p>}
                      <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{t.content}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => startEdit(t)} className="px-3 py-1.5 text-xs bg-zinc-800 border border-zinc-700 rounded-full hover:bg-zinc-700 transition">Edit</button>
                      <button onClick={() => handleDelete(t.id, t.client_name)} className="px-3 py-1.5 text-xs bg-red-900/30 text-red-400 border border-red-900/50 rounded-full hover:bg-red-900/50 transition">Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
