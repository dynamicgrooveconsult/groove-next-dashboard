'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Toast, { useToast } from '@/components/Toast'

const categories = [
  'Weddings', 'Church Programs', 'Corporate Events',
  'Livestream Productions', 'School Events', 'Others',
]

const STORAGE_BUCKET = 'portfolio-images'

export default function NewPortfolioItem() {
  const router = useRouter()
  const { showToast, ToastComponent } = useToast()
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Weddings')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Title is required'); return }
    if (!imageFile) { setError('Image is required'); return }
    setError('')
    setSaving(true)

    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, imageFile)

      if (uploadError) throw new Error(uploadError.message)

      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName)

      const imageUrl = urlData.publicUrl
      let videoUrl = ''
      let itemType = 'image'

      if (videoFile) {
        const vidExt = videoFile.name.split('.').pop()
        const vidName = `portfolio/videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${vidExt}`

        const { error: vidError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(vidName, videoFile)

        if (vidError) throw new Error(vidError.message)

        const { data: vidUrlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(vidName)

        videoUrl = vidUrlData.publicUrl
        itemType = 'video'
      }

      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
          image_url: imageUrl,
          video_url: videoUrl || null,
          type: itemType,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save')
      }

      router.push('/admin/dashboard/portfolio')
    } catch (err: any) {
      setError(err.message)
      showToast(err.message, 'error')
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      {ToastComponent}
      <h1 className="text-2xl font-bold mb-1">Add Portfolio Item</h1>
      <p className="text-zinc-400 text-sm mb-8">Upload a new project to the gallery</p>

      {error && (
        <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Project Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50"
            placeholder="Enter project title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Category *</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                  category === cat
                    ? 'bg-yellow-500 text-black'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-yellow-500/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 resize-none"
            placeholder="Brief description of the project"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Image *</label>
          <label className="flex items-center gap-3 px-4 py-3 bg-black border border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-600 transition">
            <span className="text-yellow-500 text-lg">📷</span>
            <span className="text-sm text-zinc-400">
              {imageFile ? imageFile.name : 'Choose image file...'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
          {imagePreview && (
            <div className="mt-3 rounded-lg overflow-hidden border border-zinc-800">
              <img src={imagePreview} alt="Preview" className="max-h-48 object-contain bg-zinc-900" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Video (optional)</label>
          <label className="flex items-center gap-3 px-4 py-3 bg-black border border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-600 transition">
            <span className="text-yellow-500 text-lg">🎬</span>
            <span className="text-sm text-zinc-400">
              {videoFile ? videoFile.name : 'Choose video file...'}
            </span>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-yellow-500 text-black px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Item'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-full font-medium text-sm border border-zinc-700 text-zinc-400 hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
