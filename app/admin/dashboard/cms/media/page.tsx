'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabaseClient'

interface MediaItem {
  name: string
  bucket: string
  url: string
  created_at: string
}

export default function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadBucket, setUploadBucket] = useState('Groove-media')
  const { toast, showToast, hideToast, ToastComponent } = useToast()

  useEffect(() => { fetchMedia() }, [])

  const fetchMedia = async () => {
    const r = await fetch('/api/cms/media')
    if (r.ok) setItems(await r.json())
    setLoading(false)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('bucket', uploadBucket)
      const r = await fetch('/api/cms/media', { method: 'POST', body: form })
      if (!r.ok) throw new Error('Upload failed')
      showToast('File uploaded successfully')
      fetchMedia()
    } catch (err: any) { showToast(err.message, 'error') }
    setUploading(false)
  }

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.name}"?`)) return
    const r = await fetch('/api/cms/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bucket: item.bucket, path: item.name }) })
    if (r.ok) { showToast('File deleted'); fetchMedia() }
    else showToast('Failed to delete', 'error')
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    showToast('URL copied to clipboard')
  }

  if (loading) return <div className="p-8 text-zinc-400">Loading...</div>

  return (
    <div className="p-8">
      {ToastComponent}
      <h1 className="text-2xl font-bold mb-1">Media Library</h1>
      <p className="text-zinc-400 text-sm mb-8">Upload, browse, and manage media files</p>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <select value={uploadBucket} onChange={e => setUploadBucket(e.target.value)} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50">
            <option value="Groove-media">Groove-media</option>
            <option value="portfolio-images">portfolio-images</option>
            <option value="ceo-images">ceo-images</option>
          </select>
          <label className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-black rounded-full font-semibold text-sm cursor-pointer hover:bg-yellow-400 transition">
            <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
            <input type="file" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-500">No media files yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item, i) => (
            <div key={`${item.bucket}-${item.name}`} className="group bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="aspect-square bg-zinc-800 relative">
                {item.url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-600 text-2xl">🎬</div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button onClick={() => copyUrl(item.url)} className="px-2 py-1 text-[10px] bg-white/20 rounded hover:bg-white/30 transition">Copy URL</button>
                  <button onClick={() => handleDelete(item)} className="px-2 py-1 text-[10px] bg-red-500/30 rounded hover:bg-red-500/50 transition">Delete</button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-[10px] text-zinc-500 truncate">{item.bucket}</p>
                <p className="text-[10px] text-zinc-600 truncate">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
