'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const EMIRATES = [
  { id: 'dubai',    label: 'Dubai',     abbr: 'DXB', note: 'DHA mandatory' },
  { id: 'abudhabi', label: 'Abu Dhabi', abbr: 'AUH', note: 'HAAD rules' },
  { id: 'sharjah',  label: 'Sharjah',  abbr: 'SHJ', note: '' },
  { id: 'ajman',    label: 'Ajman',    abbr: 'AJM', note: '' },
  { id: 'rak',      label: 'RAK',      abbr: 'RKT', note: '' },
  { id: 'fujairah', label: 'Fujairah', abbr: 'FJR', note: '' },
  { id: 'uaq',      label: 'UAQ',      abbr: 'UAQ', note: '' },
]

const LIVE_QUOTES = [
  { name: 'Rajesh M.',   plan: 'Enhanced · Dubai',       price: 'AED 1,840/yr', time: '2m ago' },
  { name: 'Fatima A.',   plan: 'Basic DHA · Sharjah',    price: 'AED 762/yr',   time: '4m ago' },
  { name: 'John B.',     plan: 'Comprehensive · AUH',    price: 'AED 4,320/yr', time: '7m ago' },
  { name: 'Sara K.',     plan: 'Enhanced · Dubai',       price: 'AED 2,100/yr', time: '9m ago' },
  { name: 'Priya S.',    plan: 'Essential · Sharjah',    price: 'AED 890/yr',   time: '11m ago' },
  { name: 'Mohammed R.', plan: 'Family · Abu Dhabi',     price: 'AED 5,640/yr', time: '13m ago' },
  { name: 'Lisa T.',     plan: 'Basic DHA · Dubai',      price: 'AED 620/yr',   time: '15m ago' },
  { name: 'Ahmed N.',    plan: 'Standard · RAK',         price: 'AED 1,350/yr', time: '17m ago' },
]

const INSURERS = ['AXA Gulf', 'Daman', 'ADNIC', 'GIG Gulf', 'Cigna', 'Allianz', 'RSA', 'Neuron']

function cn(...cls: (string | boolean | undefined | null)[]) {
  return cls.filter(Boolean).join(' ')
}

function LiveQuotesTicker() {
  const [idx, setIdx] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1)
      setIdx(i => (i + 1) % LIVE_QUOTES.length)
    }, 2800)
    return () => clearInterval(t)
  }, [])

  const q = LIVE_QUOTES[idx]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="hidden lg:block mt-8 pb-8"
    >
      <p className="font-sans font-semibold text-[10.5px] uppercase tracking-widest mb-3"
        style={{ color: 'rgba(255,255,255,0.38)' }}>
        Live recent quotes
      </p>

      {/* Animated single-row ticker */}
      <div
        className="relative overflow-hidden rounded-xl"
        style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', height: '52px' }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={idx}
            custom={direction}
            initial={{ y: 38, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            exit={{   y: -38, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] }}
            className="absolute inset-0 flex items-center gap-3 px-4"
          >
            <span className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: '#2DD4BF' }} />
            <span className="font-sans font-semibold text-[12.5px] text-white shrink-0">{q.name}</span>
            <span className="font-sans text-[12px] truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{q.plan}</span>
            <span className="ml-auto font-display font-bold text-[13px] shrink-0" style={{ color: '#2DD4BF' }}>{q.price}</span>
            <span className="font-sans text-[10px] shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>{q.time}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Static queue — 2 older quotes below */}
      <div className="mt-2 space-y-1.5">
        {[LIVE_QUOTES[(idx + 1) % LIVE_QUOTES.length], LIVE_QUOTES[(idx + 2) % LIVE_QUOTES.length]].map((q2, i) => (
          <div key={i}
            className="flex items-center gap-3 px-4 py-2 rounded-xl opacity-50"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
            <span className="font-sans font-semibold text-[11.5px] text-white shrink-0">{q2.name}</span>
            <span className="font-sans text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{q2.plan}</span>
            <span className="ml-auto font-display font-bold text-[11.5px] shrink-0" style={{ color: 'rgba(45,212,191,0.7)' }}>{q2.price}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function HeroSection() {
  const [selected, setSelected] = useState<string | null>(null)
  const router = useRouter()

  return (
    <section className="relative">
      {/* Full-width navy top band */}
      <div
        className="absolute inset-x-0 top-0"
        style={{ height: '480px', background: 'linear-gradient(155deg, #060F1E 0%, #0B2545 55%, #0B3D6B 100%)' }}
      >
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hgrid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hgrid)" />
        </svg>
        <div className="absolute right-0 top-0 w-[500px] h-full opacity-[0.08] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at right top, #2DD4BF, transparent 60%)' }} />
      </div>

      <div className="relative max-w-[1320px] mx-auto px-5 lg:px-8 pt-14 pb-0">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* ── LEFT ── */}
          <div className="pt-2">
            {/* Award pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-1.5 mb-5 px-3.5 py-1.5 rounded-full border"
              style={{ backgroundColor: 'rgba(212,162,75,0.14)', borderColor: 'rgba(212,162,75,0.35)', color: '#F5CC72' }}
            >
              <Star className="w-3 h-3 fill-current" />
              <span className="font-sans font-bold text-[11.5px] tracking-wide">UAE&apos;s #1 Health Insurance Platform</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06 }}
              className="mb-5"
            >
              <h1 className="font-display font-extrabold text-white leading-[1.06] tracking-tight"
                style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
                Compare <span style={{ color: '#2DD4BF' }}>14+ health</span><br />
                insurance plans<br />
                <span className="text-white">in 3 minutes.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, delay: 0.12 }}
              className="font-sans text-[15px] leading-relaxed mb-7"
              style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '440px' }}
            >
              DHA &amp; HAAD compliant health plans for every UAE resident.
              IA-licensed. No broker fees. Certificate in minutes.
            </motion.p>

            {/* Insurer logo strip */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, delay: 0.18 }}
              className="mb-8"
            >
              <p className="font-sans font-semibold text-[10.5px] uppercase tracking-widest mb-3"
                style={{ color: 'rgba(255,255,255,0.42)' }}>
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
                      color: 'rgba(255,255,255,0.78)',
                    }}
                  >
                    {ins}
                  </motion.span>
                ))}
                <span className="px-3 py-1.5 rounded-lg font-sans text-[11px] border"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.38)' }}>
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
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: '#2DD4BF' }} />
                  <span className="font-sans text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{t}</span>
                </div>
              ))}
            </motion.div>

            <LiveQuotesTicker />
          </div>

          {/* ── RIGHT: Quote form card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Card header */}
            <div
              className="px-6 py-4 border-b"
              style={{ background: 'linear-gradient(135deg, #EBF2FA 0%, #F0FDFA 100%)', borderColor: 'var(--border-subtle)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-[17px]" style={{ color: 'var(--navy-900)' }}>Get your free health quote</h2>
                  <p className="font-sans text-[12.5px]" style={{ color: 'var(--text-muted)' }}>Select your emirate to begin</p>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-sans font-bold"
                  style={{ backgroundColor: '#CCFBF1', color: '#0A7A72' }}>
                  Free
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-5 rounded-full font-sans font-bold text-[10px] text-white flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#0D9488' }}>1</span>
                <span className="font-sans font-semibold text-[12px]" style={{ color: 'var(--text-secondary)' }}>Step 1 — Emirate of Visa Issuance</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {EMIRATES.map(({ id, label, abbr, note }) => {
                  const active = selected === id
                  return (
                    <button key={id} type="button" onClick={() => setSelected(id)}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-left transition-all',
                        active
                          ? 'border-[#0D9488] bg-[#F0FDFA]'
                          : 'border-[var(--border-default)] bg-white hover:border-[#2DD4BF] hover:bg-[#F0FDFA]'
                      )}
                    >
                      <span
                        className="w-9 h-9 rounded-lg font-display font-extrabold text-[10px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: active ? '#0D9488' : '#EBF2FA', color: active ? '#fff' : '#133B6E' }}
                      >
                        {abbr}
                      </span>
                      <div className="min-w-0">
                        <div className="font-sans font-bold text-[13px] truncate"
                          style={{ color: active ? '#0A7A72' : 'var(--text-primary)' }}>{label}</div>
                        {note && <div className="font-sans text-[10px]" style={{ color: '#0D9488' }}>{note}</div>}
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
                    ? 'linear-gradient(135deg, #0F2D55 0%, #0D9488 100%)'
                    : 'var(--border-default)',
                  color: selected ? 'white' : 'var(--text-subtle)',
                }}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>

              <p className="mt-3 text-center font-sans text-[11px]" style={{ color: 'var(--text-subtle)' }}>
                No spam · No commitment · Results in 3 minutes
              </p>
            </div>

            <div className="px-5 py-3 border-t flex items-center justify-center gap-4"
              style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
              {['14+ Insurers', 'IA Licensed', '75,000+ Customers'].map(label => (
                <div key={label} className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" style={{ color: '#0D9488' }} />
                  <span className="font-sans text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="h-12 relative" style={{ background: 'linear-gradient(to bottom, #0B2545, var(--page-bg))' }} />
    </section>
  )
}
