'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import CinematicBackground from '@/components/services/CinematicBackground'

const serviceCategories = [
  {
    title: 'Production Services',
    items: [
      'Photography',
      'Cinematography',
      'Aerial Drone Services',
      '360° Motion Photography',
    ],
  },
  {
    title: 'Broadcasting',
    items: [
      'Live Streaming',
      'Virtual Production',
      'Broadcast Infrastructure',
    ],
  },
  {
    title: 'Digital & Web',
    items: [
      'Website Development',
      'Social Media Management',
    ],
  },
  {
    title: 'Event & Education',
    items: [
      'Red Carpet Setup',
      'Visual Displays',
      'Event Management',
      'Vocational Training',
    ],
  },
]

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

export default function ServicesPage() {
  const [selected, setSelected] = useState<Service | null>(null)
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    fetch('/api/cms/services')
      .then(r => r.json())
      .then((data) => {
        if (Array.isArray(data)) setServices(data)
      })
      .catch(() => {})
  }, [])

  const featured = services.filter(s => s.is_featured).length > 0
    ? services.filter(s => s.is_featured).sort((a, b) => a.display_order - b.display_order)
    : services.sort((a, b) => a.display_order - b.display_order)

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden">
      <CinematicBackground />
      <div className="relative z-10">

      {/* HERO */}
      <section className="py-28 border-b border-zinc-800 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-yellow-500 text-xs tracking-widest uppercase mb-6">
            Our Services
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Multimedia Production
            <br />
            <span className="text-yellow-500">
              & Live Broadcasting Excellence
            </span>
          </h1>

          <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
            Delivering professional multimedia and event production solutions tailored to elevate your brand.
          </p>
        </div>
      </section>

      {/* SERVICE CATEGORIES */}
      <section className="py-28 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {serviceCategories.map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl hover:border-yellow-500/40 transition-all"
            >
              <h3 className="text-xl font-semibold mb-6">
                {category.title}
              </h3>

              <ul className="space-y-3 text-zinc-400 text-sm">
                {category.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

        </div>
      </section>

      {/* FEATURED SERVICES WITH MODAL */}
      {featured.length > 0 && (
        <section className="py-28 border-b border-zinc-800">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">

            {featured.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ scale: 1.05 }}
                className="relative bg-zinc-900 border border-zinc-800 p-8 rounded-xl cursor-pointer"
                onClick={() => setSelected(service)}
              >
                <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 blur-xl pointer-events-none" />

                <h3 className="text-xl font-semibold mb-4">
                  {service.title}
                </h3>

                <p className="text-zinc-400 text-sm">
                  {service.short_description || service.description}
                </p>
              </motion.div>
            ))}

          </div>
        </section>
      )}

      {/* PRICING TIERS */}
      <section className="py-28 border-b border-zinc-800 text-center">
        <div className="max-w-6xl mx-auto px-6">

          <p className="text-yellow-500 text-xs tracking-widest uppercase mb-6">
            Pricing Plans
          </p>

          <h2 className="text-4xl font-bold mb-16">
            Flexible Packages for Every Event
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            {[
              {
                name: 'Basic',
                price: '₦150,000',
                features: ['Single Camera', 'HD Streaming', 'Basic Setup'],
              },
              {
                name: 'Professional',
                price: '₦350,000',
                features: ['Multi-Camera', 'Live Switching', 'Pro Audio'],
              },
              {
                name: 'Premium',
                price: 'Custom Quote',
                features: ['Full Production', 'Drone Coverage', 'Studio Setup'],
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl"
              >
                <h3 className="text-2xl font-semibold mb-4">
                  {plan.name}
                </h3>

                <p className="text-yellow-500 text-3xl font-bold mb-6">
                  {plan.price}
                </p>

                <ul className="space-y-3 text-zinc-400 text-sm mb-8">
                  {plan.features.map((f, idx) => (
                    <li key={idx}>• {f}</li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className="bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition"
                >
                  Get Started
                </Link>
              </motion.div>
            ))}

          </div>

        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="py-16 bg-zinc-900 border-t border-zinc-800 text-center">
        <div className="max-w-6xl mx-auto px-6">

          <h3 className="text-2xl font-semibold mb-4">
            Dynamic Groove Media
          </h3>

          <p className="text-zinc-400 mb-6">
            Elevating brands and events through multimedia excellence.
          </p>

          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} Dynamic Groove Media. All rights reserved.
          </p>

        </div>
      </footer>

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-zinc-900 p-8 rounded-xl max-w-lg w-full border border-zinc-800"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-4">
                {selected.title}
              </h3>

              <p className="text-zinc-400 mb-6">
                {selected.description || selected.short_description}
              </p>

              <button
                onClick={() => setSelected(null)}
                className="bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>
    </div>
  )
}
