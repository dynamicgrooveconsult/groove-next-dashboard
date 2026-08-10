'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PremiumCTA() {
  return (
    <section className="py-32 bg-zinc-900 border-t border-zinc-800">
      <div className="max-w-5xl mx-auto px-6 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold mb-6"
        >
          Ready to Elevate Your Event?
        </motion.h2>

        <p className="text-zinc-400 text-lg mb-10">
          Partner with Dynamic Groove Media for professional multimedia production,
          live broadcasting excellence, and unforgettable audience experiences.
        </p>

        <div className="flex justify-center gap-6 flex-wrap">
          <Link
            href="/contact"
            className="bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 transition"
          >
            Get In Touch
          </Link>

          <Link
            href="/live-broadcast"
            className="border border-yellow-500 text-yellow-500 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500/10 transition"
          >
            Watch Live
          </Link>
        </div>

      </div>
    </section>
  )
}
