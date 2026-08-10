'use client'

import { motion } from 'framer-motion'

const industries = [
  'Churches & Ministries',
  'Corporate Organizations',
  'Educational Institutions',
  'Government Agencies',
  'Brands & Entrepreneurs',
  'Weddings & Celebrations',
]

export default function IndustriesServed() {
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
            Industries We Serve
          </p>
          <h2 className="text-4xl font-bold text-white">
            Who We Serve
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {industries.map((industry, i) => (
            <motion.div
              key={industry}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 hover:border-yellow-500/30 rounded-lg p-6 md:p-8 transition-all duration-300 group"
            >
              <span className="text-yellow-500 text-lg mr-3">&check;</span>
              <span className="text-lg md:text-xl font-medium text-zinc-300 group-hover:text-white transition-colors duration-300">
                {industry}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
