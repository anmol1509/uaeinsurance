'use client'
import { motion } from 'framer-motion'
import WavyUnderline from '@/components/ui/WavyUnderline'

const stats = [
  { value: '75,000+', label: 'Policies issued' },
  { value: 'AED 480M+', label: 'Claims paid out' },
  { value: '40+', label: 'Insurance plans available' },
]

export default function TrustBannerSection() {
  return (
    <section
      className="py-20 px-5 lg:px-20 overflow-hidden relative"
      style={{ backgroundColor: 'var(--green-700)' }}
    >
      <div className="max-w-[1280px] mx-auto grid md:grid-cols-[40fr_60fr] gap-20 items-center">
        {/* Left: decorative visual */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden bg-[var(--green-800)] h-[400px] flex items-center justify-center">
            <svg
              viewBox="0 0 380 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <rect width="380" height="400" fill="var(--green-800)" />
              <circle cx="190" cy="200" r="160" fill="var(--green-700)" opacity="0.5" />
              <circle cx="190" cy="200" r="100" fill="var(--green-600)" opacity="0.4" />
              {/* Shield with cross */}
              <path
                d="M190 90 L240 115 L240 195 C240 235 215 265 190 280 C165 265 140 235 140 195 L140 115 Z"
                fill="var(--green-500)"
                opacity="0.4"
              />
              <path
                d="M190 95 L237 119 L237 194 C237 232 213 261 190 276 C167 261 143 232 143 194 L143 119 Z"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
              />
              {/* Cross symbol */}
              <rect x="176" y="155" width="28" height="70" rx="4" fill="rgba(255,255,255,0.7)" />
              <rect x="155" y="176" width="70" height="28" rx="4" fill="rgba(255,255,255,0.7)" />
            </svg>
          </div>

          {/* Compliance badges floating */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-3 flex items-center gap-3"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--green-50)' }}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2 L16 5 L16 11 C16 14.5 13.5 17.5 10 19 C6.5 17.5 4 14.5 4 11 L4 5 Z"
                  stroke="var(--green-700)"
                  strokeWidth="1.5"
                  fill="var(--green-50)"
                />
                <path d="M7 10 L9 12 L13 8" stroke="var(--green-700)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-sans font-bold text-[12px]" style={{ color: 'var(--text-primary)' }}>DHA Compliant</p>
              <p className="font-sans text-[10px]" style={{ color: 'var(--text-muted)' }}>Dubai Health Authority</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55 }}
            className="absolute -top-4 left-4 bg-white rounded-2xl px-4 py-3 flex items-center gap-3"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--business-50)' }}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="8" width="14" height="10" rx="2" stroke="var(--business-600)" strokeWidth="1.5" />
                <path d="M7 8 L7 5 C7 3.3 8.3 2 10 2 C11.7 2 13 3.3 13 5 L13 8" stroke="var(--business-600)" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <p className="font-sans font-bold text-[12px]" style={{ color: 'var(--text-primary)' }}>IA Licensed</p>
              <p className="font-sans text-[10px]" style={{ color: 'var(--text-muted)' }}>Insurance Authority UAE</p>
            </div>
          </motion.div>

          {/* Orange decorative SVG */}
          <svg
            className="absolute -top-6 -right-6 opacity-70"
            width="90"
            height="90"
            viewBox="0 0 120 120"
            fill="none"
          >
            <motion.path
              d="M10 60 C30 10, 90 10, 110 60 S90 110, 10 60"
              stroke="var(--orange-500)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="font-display font-extrabold text-5xl tracking-tight leading-[1.15] mb-4"
            style={{ color: 'white' }}
          >
            A{' '}
            <span className="relative inline-block">
              <em className="not-italic font-serif italic">trusted</em>
              <span className="absolute -bottom-2 left-0 w-full">
                <WavyUnderline color="rgba(255,255,255,0.7)" width={120} />
              </span>
            </span>{' '}
            name in
            <br />
            UAE health insurance.
          </h2>

          <p
            className="font-sans text-base leading-relaxed max-w-[460px] mb-10"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            InsureAE provides instant quotes backed by IA-licensed underwriters, offering
            DHA and HAAD compliant health plans so you stay covered and compliant across the UAE.
          </p>

          {/* Stats */}
          <div className="flex gap-12 flex-wrap">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="font-display font-bold text-[42px] text-white leading-none">{value}</p>
                <p className="font-sans text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
