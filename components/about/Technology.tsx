'use client'

import { motion } from 'framer-motion'

const equipment = [
  { name: 'Multi-Camera Live Production Systems', description: 'Seamless switching and real-time direction for professional multi-angle broadcasts.' },
  { name: 'Professional Mirrorless Cameras', description: 'High-resolution cinema-grade capture for stunning visual fidelity.' },
  { name: '4K Drone Cinematography', description: 'Aerial perspectives that elevate event coverage and branding.' },
  { name: 'HD Projection Systems', description: 'Large-format visual delivery for immersive audience experiences.' },
  { name: 'Live Streaming Infrastructure', description: 'End-to-end encoding, distribution, and CDN delivery for global reach.' },
  { name: 'Studio-Grade Audio Systems', description: 'Crystal-clear sound engineering with professional mixing and monitoring.' },
  { name: 'Real-Time Broadcast Monitoring', description: 'Multi-view production dashboards for quality assurance and live switching.' },
  { name: 'Professional Lighting Solutions', description: 'Designed lighting setups for stage, studio, and event environments.' },
]

export default function Technology() {
  return (
    <section className="py-32 border-b border-zinc-800 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-yellow-500 text-xs tracking-widest uppercase mb-4">
            Production Technology
          </p>
          <h2 className="text-4xl font-bold text-white">
            Our Equipment &amp; Capabilities
          </h2>
          <p className="text-lg text-zinc-400 mt-4 max-w-3xl">
            We utilize professional-grade multimedia equipment and modern broadcasting systems to deliver flawless production quality.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {equipment.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition-all duration-300"
            >
              <h3 className="text-base font-semibold text-white mb-2 leading-snug">
                {item.name}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
