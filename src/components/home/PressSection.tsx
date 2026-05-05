'use client'
import { motion } from 'framer-motion'

const outlets = [
  { name: 'Gulf News',          quote: '"InsureAE is transforming how UAE residents buy health insurance"' },
  { name: 'Khaleej Times',      quote: '"The fastest DHA-compliant certificate issuance in the market"' },
  { name: 'Arabian Business',   quote: '"A new benchmark for health insurance technology in the GCC"' },
  { name: 'Forbes Middle East', quote: '"One of the UAE\'s most promising insurtech startups"' },
  { name: 'The National',       quote: '"Making mandatory health cover simple for Dubai\'s workforce"' },
]

export default function PressSection() {
  return (
    <section className="py-12 border-y border-[var(--border-default)]" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="max-w-[1320px] mx-auto px-5 lg:px-8">
        <p className="font-sans font-semibold text-[11px] uppercase tracking-widest text-center text-[var(--text-subtle)] mb-8">
          As featured in
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {outlets.map(({ name }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center justify-center py-4 px-4 rounded-xl border border-[var(--border-default)] bg-white"
            >
              <span className="font-display font-bold text-[13px] text-[var(--text-muted)] text-center leading-snug">
                {name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
