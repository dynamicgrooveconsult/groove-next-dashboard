'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface PortfolioItem {
  id: string
  title: string
  category: string
  description: string
  image_url: string
  video_url: string | null
  type: string
  created_at: string
}

export default function PortfolioList() {
  const router = useRouter()
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = async () => {
    const res = await fetch('/api/portfolio')
    if (res.ok) {
      const data = await res.json()
      setItems(data)
    }
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-zinc-400">Loading portfolio items...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Gallery</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => router.push('/admin/dashboard/portfolio/new')}
          className="bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold text-sm hover:bg-yellow-400 transition"
        >
          + Add New Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-500 text-lg mb-2">No portfolio items yet</p>
          <p className="text-zinc-600 text-sm">Click &quot;Add New Item&quot; to upload your first project.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-5"
            >
              <div className="w-20 h-16 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                {item.type === 'video' ? (
                  <video src={item.video_url || item.image_url} className="w-full h-full object-cover" />
                ) : (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.title || 'Untitled'}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{item.category}</p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => router.push(`/admin/dashboard/portfolio/edit/${item.id}`)}
                  className="px-4 py-1.5 text-xs font-medium bg-zinc-800 border border-zinc-700 rounded-full hover:bg-zinc-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="px-4 py-1.5 text-xs font-medium bg-red-900/30 text-red-400 border border-red-900/50 rounded-full hover:bg-red-900/50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
