'use client'

import { motion } from 'framer-motion'

const values = [
  {
    title: 'Excellence',
    text: 'We are committed to delivering high-quality multimedia experiences with precision and professionalism.',
  },
  {
    title: 'Innovation',
    text: 'We embrace modern technology and creative solutions to enhance every production.',
  },
  {
    title: 'Integrity',
    text: 'We build lasting client relationships through honesty, reliability, and accountability.',
  },
  {
    title: 'Creativity',
    text: 'We transform ordinary moments into visually compelling experiences.',
  },
  {
    title: 'Impact',
    text: 'We strive to create meaningful content and memorable audience experiences.',
  },
]

export default function CoreValues() {
  return (
    <section className="py-32 border-b border-zinc-800 relative">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="text-yellow-500 text-xs tracking-widest uppercase mb-6">
            Our Core Values
          </p>

          <h2 className="text-4xl font-bold mb-14">
            What Drives Us
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl hover:border-yellow-500/50 transition-all"
            >
              <h3 className="text-xl font-semibold mb-4 text-white">
                {value.title}
              </h3>

              <p className="text-zinc-400 leading-relaxed">
                {value.text}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
