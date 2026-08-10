'use client'

export default function CategoryFilter({
  categories,
  selected,
  setSelected,
}: any) {
  return (
    <section className="py-12 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap gap-4 justify-center">

        {categories.map((cat: string) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              selected === cat
                ? 'bg-yellow-500 text-black'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-yellow-500/40'
            }`}
          >
            {cat}
          </button>
        ))}

      </div>
    </section>
  )
}
