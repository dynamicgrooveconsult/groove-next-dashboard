'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabaseClient'

const STORAGE_BUCKET = 'Groove-media'

interface Service {
  id: number
  title: string
  description: string
  short_description: string
  image_url: string
  icon: string
  display_order: number
  is_featured: boolean
}

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<Service>>({})
  const [showNew, setShowNew] = useState(false)
  const [newForm, setNewForm] = useState<Partial<Service>>({ title: '', description: '', short_description: '', is_featured: false })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { toast, showToast, hideToast, ToastComponent } = useToast()

  useEffect(() => { fetchServices() }, [])

  const fetchServices = async () => {
    const r = await fetch('/api/cms/services')
    if (r.ok) setServices(await r.json())
    setLoading(false)
  }

  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop()
    const path = `services/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file)
    if (error) throw new Error(error.message)
    return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl
  }

  const handleCreate = async () => {
    if (!newForm.title?.trim()) { showToast('Title is required', 'error'); return }
    try {
      let image_url = ''
      if (imageFile) image_url = await uploadImage(imageFile)
      const r = await fetch('/api/cms/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newForm, image_url, display_order: services.length + 1 }) })
      if (!r.ok) throw new Error('Failed to create')
      showToast('Service created successfully')
      setShowNew(false)
      setNewForm({ title: '', description: '', short_description: '', is_featured: false })
      setImageFile(null)
      fetchServices()
    } catch (err: any) { showToast(err.message, 'error') }
  }

  const startEdit = (s: Service) => { setEditingId(s.id); setEditForm(s) }

  const handleUpdate = async () => {
    if (!editingId) return
    try {
      let image_url = editForm.image_url || ''
      if (imageFile) image_url = await uploadImage(imageFile)
      const r = await fetch('/api/cms/services', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...editForm, image_url }) })
      if (!r.ok) throw new Error('Failed to update')
      showToast('Service updated successfully')
      setEditingId(null)
      setImageFile(null)
      fetchServices()
    } catch (err: any) { showToast(err.message, 'error') }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    const r = await fetch(`/api/cms/services?id=${id}`, { method: 'DELETE' })
    if (r.ok) { showToast('Service deleted'); fetchServices() }
    else showToast('Failed to delete', 'error')
  }

  if (loading) return <div className="p-8 text-zinc-400">Loading...</div>

  return (
    <div className="p-8 max-w-4xl">
      {ToastComponent}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Services Manager</h1>
          <p className="text-zinc-400 text-sm mt-1">Add, edit, and manage services</p>
        </div>
        <button onClick={() => setShowNew(true)} className="bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold text-sm hover:bg-yellow-400 transition">+ Add Service</button>
      </div>

      {/* New Service Form */}
      {showNew && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">New Service</h3>
          <div className="space-y-4">
            <input placeholder="Title *" value={newForm.title} onChange={e => setNewForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
            <input placeholder="Short description" value={newForm.short_description} onChange={e => setNewForm(p => ({ ...p, short_description: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
            <textarea placeholder="Full description" value={newForm.description} onChange={e => setNewForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 resize-none" />
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="hidden" />
              <span className="px-4 py-2 bg-black border border-zinc-700 rounded-lg hover:border-zinc-600 transition">{imageFile ? imageFile.name : 'Upload Image'}</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
              <input type="checkbox" checked={newForm.is_featured} onChange={e => setNewForm(p => ({ ...p, is_featured: e.target.checked }))} className="accent-yellow-500" />
              Featured Service
            </label>
            <div className="flex gap-3">
              <button onClick={handleCreate} className="bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold text-sm hover:bg-yellow-400 transition">Create</button>
              <button onClick={() => { setShowNew(false); setImageFile(null) }} className="px-5 py-2 rounded-full text-sm border border-zinc-700 text-zinc-400 hover:text-white transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Services List */}
      {services.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-500">No services yet. Click "Add Service" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map(s => (
            <div key={s.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              {editingId === s.id ? (
                <div className="space-y-4">
                  <input value={editForm.title || ''} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
                  <input value={editForm.short_description || ''} onChange={e => setEditForm(p => ({ ...p, short_description: e.target.value }))} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50" />
                  <textarea value={editForm.description || ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 resize-none" />
                  {s.image_url && <img src={s.image_url} alt="" className="w-20 h-20 object-cover rounded-lg" />}
                  <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                    <span className="px-4 py-2 bg-black border border-zinc-700 rounded-lg hover:border-zinc-600 transition">Replace Image</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                    <input type="checkbox" checked={editForm.is_featured || false} onChange={e => setEditForm(p => ({ ...p, is_featured: e.target.checked }))} className="accent-yellow-500" />
                    Featured
                  </label>
                  <div className="flex gap-3">
                    <button onClick={handleUpdate} className="bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold text-sm hover:bg-yellow-400 transition">Save</button>
                    <button onClick={() => { setEditingId(null); setImageFile(null) }} className="px-5 py-2 rounded-full text-sm border border-zinc-700 text-zinc-400 hover:text-white transition">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {s.image_url && <img src={s.image_url} alt="" className="w-12 h-12 object-cover rounded-lg" />}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{s.title}</h3>
                      {s.is_featured && <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">Featured</span>}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">Order: {s.display_order}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(s)} className="px-3 py-1.5 text-xs bg-zinc-800 border border-zinc-700 rounded-full hover:bg-zinc-700 transition">Edit</button>
                    <button onClick={() => handleDelete(s.id, s.title)} className="px-3 py-1.5 text-xs bg-red-900/30 text-red-400 border border-red-900/50 rounded-full hover:bg-red-900/50 transition">Delete</button>
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
