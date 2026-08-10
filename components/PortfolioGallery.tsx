"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (Use your own keys from .env.local)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PortfolioGallery() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function fetchData() {
      let query = supabase.from('portfolio_items').select('*');
      if (filter !== 'All') {
        query = query.eq('category', filter.toLowerCase());
      }
      const { data } = await query;
      setItems(data || []);
    }
    fetchData();
  }, [filter]);

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex gap-4 mb-8">
        {['All', 'Weddings', 'Corporate', 'Livestream'].map(cat => (
          <button 
            key={cat} 
            onClick={() => setFilter(cat)}
            className="px-4 py-2 bg-zinc-800 rounded hover:bg-cyan-600 transition"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group overflow-hidden rounded-lg">
            <img 
              src={item.image_url} 
              alt={item.title} 
              className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
            />
            <p className="mt-2 text-sm text-zinc-400">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}