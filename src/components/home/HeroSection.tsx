'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Star } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const emirates = [
  { id: 'dubai',    label: 'Dubai',     abbr: 'DXB', note: 'DHA mandatory' },
  { id: 'abudhabi', label: 'Abu Dhabi', abbr: 'AUH', note: '' },
  { id: 'sharjah',  label: 'Sharjah',  abbr: 'SHJ', note: '' },
  { id: 'ajman',    label: 'Ajman',    abbr: 'AJM', note: '' },
  { id: 'rak',      label: 'RAK',      abbr: 'RKT', note: '' },
  { id: 'fujairah', label: 'Fujairah', abbr: 'FJR', note: '' },
  { id: 'uaq',      label: 'UAQ',      abbr: 'UAQ', note: '' },
]

// Live quote feed (mock)
const LIVE_QUOTES = [
  { name: 'Rajesh M.', plan: 'Enhanced · Dubai',    price: 'AED 1,840/yr', time: '2m ago' },
  { name: 'Fatima A.', plan: 'Basic DHA · Sharjah', price: 'AED 762/yr',  time: '5m ago' },
  { name: 'John B.',   plan: 'Family · Abu Dhabi',  price: 'AED 4,320/yr', time: '8m ago' },
]

const INSURERS = ['AXA', 'Daman', 'ADNIC', 'GIG', 'Cigna', 'Allianz', 'RSA', 'Neuron']

function cn(...cls: (string | boolean | undefined | null)[]) {
  return cls.filter(Boolean).join(' ')
}

export default function HeroSection() {
  const [selected, setSelected] = useState<string | null>(null)
  const router = useRouter()

  return (
    <section className="relative overflow-hidden">
      {/* Full-width navy top band */}
      <div
        className="absolute inset-x-0 top-0 h-[360px] lg:h-[420px]"
        style={{ background: 'linear-gradient(155deg, #060F1E 0%, #0B2545 55%, #0B3D6B 100%)' }}
      >
        {/* Subtle grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hgrid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hgrid)" />
        </svg>
        {/* Teal glow */}
        <div className="absolute right-0 top-0 w-[500px] h-full opacity-[0.08] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at right top, var(--teal-400), transparent 60%)' }} />
      </div>

      <div className="relative max-w-[1320px] mx-auto px-5 lg:px-8 pt-14 pb-0">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* ── LEFT: Brand + Visual ── */}
          <div className="pt-2">
            {/* Award pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-1.5 mb-5 px-3.5 py-1.5 rounded-full border"
              style={{ backgroundColor: 'rgba(212,162,75,0.14)', borderColor: 'rgba(212,162,75,0.35)', color: 'var(--gold-400)' }}
            >
              <Star className="w-3 h-3 fill-current" />
              <span className="font-sans font-bold text-[11.5px] tracking-wide">UAE&apos;s #1 Health Insurance Platform</span>
            </motion.div>

            {/* Headline — bold, different treatment */}
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06 }}
              className="mb-5"
            >
              <h1 className="font-display font-extrabold text-white leading-[1.06] tracking-tight"
                style={{ fontSize: 'clamp(34px, 4.5vw, 54px)' }}>
                Compare <span style={{ color: 'var(--teal-400)' }}>14+ health</span><br />
                insurance plans<br />
                <span className="text-white">in 3 minutes.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, delay: 0.12 }}
              className="font-sans text-[15px] leading-relaxed mb-7"
              style={{ color: 'var(--navy-200)', maxWidth: '440px' }}
            >
              DHA &amp; HAAD compliant health plans for every UAE resident.
              IA-licensed. No broker fees. Certificate in minutes.
            </motion.p>

            {/* Insurer logo strip */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, delay: 0.18 }}
              className="mb-8"
            >
              <p className="font-sans font-semibold text-[10.5px] uppercase tracking-widest mb-3" style={{ color: 'var(--navy-500)' }}>
                From these licensed insurers
              </p>
              <div className="flex flex-wrap gap-2">
                {INSURERS.map((ins, i) => (
                  <motion.span
                    key={ins}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    className="px-3 py-1.5 rounded-lg font-display font-extrabold text-[11px] border"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.07)',
                      borderColor: 'rgba(255,255,255,0.12)',
                      color: 'rgba(255,255,255,0.75)',
                    }}
                  >
                    {ins}
                  </motion.span>
                ))}
                <span className="px-3 py-1.5 rounded-lg font-sans text-[11px] border"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                  +6 more
                </span>
              </div>
            </motion.div>

            {/* Checkmarks */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-x-6 gap-y-2"
            >
              {['IA Licensed', 'DHA & HAAD Compliant', 'No broker fees', '3-min certificate'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--teal-400)' }} />
                  <span className="font-sans text-[13px]" style={{ color: 'var(--navy-300)' }}>{t}</span>
                </div>
              ))}
            </motion.div>

            {/* Live policy feed — only on lg */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="hidden lg:block mt-8 pb-8"
            >
              <p className="font-sans font-semibold text-[10.5px] uppercase tracking-widest mb-3" style={{ color: 'var(--navy-500)' }}>
                Live recent quotes
              </p>
              <div className="space-y-2">
                {LIVE_QUOTES.map((q, i) => (
                  <motion.div
                    key={q.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.1 }}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <div className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: 'var(--teal-400)' }} />
                    <span className="font-sans font-semibold text-[12.5px] text-white">{q.name}</span>
                    <span className="font-sans text-[12px]" style={{ color: 'var(--navy-400)' }}>{q.plan}</span>
                    <span className="ml-auto font-display font-bold text-[12px]" style={{ color: 'var(--teal-400)' }}>{q.price}</span>
                    <span className="font-sans text-[10px]" style={{ color: 'var(--navy-500)' }}>{q.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Quote form card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ marginTop: '0' }}
          >
            {/* Card header */}
            <div
              className="px-6 py-4 border-b border-[var(--border-subtle)]"
              style={{ background: 'linear-gradient(135deg, var(--navy-50) 0%, var(--teal-50) 100%)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-[17px] text-[var(--navy-900)]">Get your free health quote</h2>
                  <p className="font-sans text-[12.5px] text-[var(--text-muted)]">Select your emirate to begin</p>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-sans font-bold" style={{ backgroundColor: 'var(--teal-100)', color: 'var(--teal-700)' }}>
                  Free
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* Step label */}
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-5 rounded-full font-sans font-bold text-[10px] text-white flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--teal-600)' }}>1</span>
                <span className="font-sans font-semibold text-[12px] text-[var(--text-secondary)]">Step 1 — Emirate of Visa Issuance</span>
              </div>

              {/* Emirates grid */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {emirates.map(({ id, label, abbr, note }) => {
                  const active = selected === id
                  return (
                    <button key={id} type="button" onClick={() => setSelected(id)}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-left transition-all',
                        active
                          ? 'border-[var(--teal-600)] bg-[var(--teal-50)]'
                          : 'border-[var(--border-default)] bg-white hover:border-[var(--teal-400)] hover:bg-[var(--teal-50)]'
                      )}
                    >
                      <span
                        className="w-9 h-9 rounded-lg font-display font-extrabold text-[10px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: active ? 'var(--teal-600)' : 'var(--navy-50)', color: active ? '#fff' : 'var(--navy-700)' }}
                      >
                        {abbr}
                      </span>
                      <div className="min-w-0">
                        <div className="font-sans font-bold text-[13px] truncate" style={{ color: active ? 'var(--teal-700)' : 'var(--text-primary)' }}>{label}</div>
                        {note && <div className="font-sans text-[10px]" style={{ color: 'var(--teal-600)' }}>{note}</div>}
                      </div>
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                disabled={!selected}
                onClick={() => selected && router.push(`/quote/health?emirate=${selected}`)}
                className={cn(
                  'w-full h-12 rounded-xl font-sans font-bold text-[14.5px] flex items-center justify-center gap-2 transition-all',
                  selected ? 'text-white hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5' : 'cursor-not-allowed'
                )}
                style={{
                  background: selected
                    ? 'linear-gradient(135deg, var(--navy-800) 0%, var(--teal-600) 100%)'
                    : 'var(--border-default)',
                  color: selected ? 'white' : 'var(--text-subtle)',
                }}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>

              <p className="mt-3 text-center font-sans text-[11px] text-[var(--text-subtle)]">
                No spam · No commitment · Results in 3 minutes
              </p>
            </div>

            {/* Bottom trust bar */}
            <div className="px-5 py-3 border-t flex items-center justify-center gap-4" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
              {[
                { label: '14+ Insurers' },
                { label: 'IA Licensed' },
                { label: '75,000+ Customers' },
              ].map(({ label }) => (
                <div key={label} className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" style={{ color: 'var(--teal-600)' }} />
                  <span className="font-sans text-[11px] font-semibold text-[var(--text-muted)]">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to page-bg */}
      <div className="h-12 relative" style={{ background: 'linear-gradient(to bottom, #0B2545, var(--page-bg))' }} />
    </section>
  )
}
