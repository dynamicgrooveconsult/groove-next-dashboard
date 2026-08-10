'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'

function thumbnailUrl(src: string): string {
  try {
    const url = new URL(src)
    url.searchParams.set('width', '600')
    url.searchParams.set('quality', '75')
    return url.toString()
  } catch {
    return src
  }
}

export default function MasonryGallery({ items, onClickItem }: any) {
  const [loaded, setLoaded] = useState<Set<string | number>>(new Set())

  const handleLoad = useCallback((id: string | number) => {
    setLoaded((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {items.map((item: any, index: number) => (
          <div
            key={item.id}
            className="group cursor-pointer relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 aspect-[4/5] opacity-0 animate-fadeIn"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onClickItem(item)}
          >
            {item.type === 'image' ? (
              <div className="absolute inset-0">
                <Image
                  src={thumbnailUrl(item.src)}
                  alt={item.title || ''}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                  className={`transition-all duration-700 ease-out group-hover:scale-105 ${
                    loaded.has(item.id) ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ objectFit: 'cover' }}
                  onLoad={() => handleLoad(item.id)}
                />
              </div>
            ) : (
              <video
                src={item.src}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                autoPlay
                loop
                playsInline
              />
            )}

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center z-10">
              <span className="text-yellow-500 font-semibold">
                View Project
              </span>
            </div>
          </div>
        ))}

      </div>
    </section>
  )
}
