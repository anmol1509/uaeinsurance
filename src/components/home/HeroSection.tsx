'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, CheckCircle2, Clock, Star } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const emirates = [
  { id: 'dubai',     label: 'Dubai',      flag: '🏙️' },
  { id: 'abudhabi',  label: 'Abu Dhabi',  flag: '🏛️' },
  { id: 'sharjah',   label: 'Sharjah',    flag: '🏘️' },
  { id: 'ajman',     label: 'Ajman',      flag: '🌊' },
  { id: 'rak',       label: 'RAK',        flag: '⛰️' },
  { id: 'fujairah',  label: 'Fujairah',   flag: '🌿' },
  { id: 'uaq',       label: 'UAQ',        flag: '🏝️' },
]

const stats = [
  { value: '75,000+', label: 'Insured residents' },
  { value: '3 min',   label: 'Avg. quote time' },
  { value: '97%',     label: 'Claims settled' },
  { value: '14+',     label: 'Insurer partners' },
]

const badges = [
  { icon: Shield,        text: 'IA Licensed & Regulated' },
  { icon: CheckCircle2,  text: 'DHA & HAAD Compliant' },
  { icon: Clock,         text: 'Certificate in 3 minutes' },
]

export default function HeroSection() {
  const [selectedEmirate, setSelectedEmirate] = useState<string | null>(null)
  const router = useRouter()

  const handleProceed = () => {
    if (!selectedEmirate) return
    router.push(`/quote/health?emirate=${selectedEmirate}`)
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(150deg, var(--navy-950) 0%, var(--navy-900) 50%, #0C2A4A 100%)' }}
    >
      {/* Geometric background pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-0 right-0 w-[55%] h-full opacity-[0.04]" viewBox="0 0 600 700" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,0 600,0 600,700" fill="white" />
        </svg>
        <div className="absolute top-20 right-[8%] w-72 h-72 rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, var(--teal-400) 0%, transparent 70%)' }} />
        <div className="absolute bottom-10 left-[5%] w-48 h-48 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, var(--gold-400) 0%, transparent 70%)' }} />
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-[1320px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_440px] gap-12 lg:gap-16 items-center">

          {/* Left: Content */}
          <div>
            {/* Award tag */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border"
              style={{
                backgroundColor: 'rgba(212,162,75,0.12)',
                borderColor: 'rgba(212,162,75,0.35)',
                color: 'var(--gold-400)',
              }}
            >
              <Star className="w-3 h-3 fill-current" />
              <span className="font-sans font-semibold text-[12px] tracking-wide">
                UAE&apos;s #1 Health Insurance Comparison Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06 }}
              className="font-display font-extrabold leading-[1.07] tracking-tight text-white mb-5"
              style={{ fontSize: 'clamp(36px, 4.8vw, 58px)' }}
            >
              Health insurance
              <br />
              built for the{' '}
              <span
                className="relative"
                style={{ color: 'var(--teal-400)' }}
              >
                UAE
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 8" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path d="M2 6 Q25 2 50 5 Q75 8 98 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"/>
                </svg>
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="font-sans text-[16px] leading-relaxed mb-8 max-w-[460px]"
              style={{ color: 'var(--navy-200)' }}
            >
              Instant DHA-compliant quotes from 14+ licensed insurers.
              Coverage for individuals, families, and businesses across all 7 emirates.
            </motion.p>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              {badges.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 shrink-0" style={{ color: 'var(--teal-400)' }} />
                  <span className="font-sans text-[13px]" style={{ color: 'var(--navy-200)' }}>
                    {text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.24 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center sm:text-left">
                  <div className="font-display font-extrabold text-2xl text-white leading-none mb-1">
                    {value}
                  </div>
                  <div className="font-sans text-[12px]" style={{ color: 'var(--navy-400)' }}>
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Quote form card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Card header */}
            <div className="px-6 pt-6 pb-4 border-b border-[var(--border-subtle)]">
              <h2 className="font-display font-bold text-[18px] text-[var(--navy-900)] mb-0.5">
                Get your free quote
              </h2>
              <p className="font-sans text-[13px] text-[var(--text-muted)]">
                Select your emirate of visa issuance to start
              </p>
            </div>

            <div className="p-5">
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center font-sans font-bold text-[10px] text-white shrink-0"
                  style={{ backgroundColor: 'var(--teal-600)' }}
                >
                  1
                </div>
                <span className="font-sans font-semibold text-[12px] text-[var(--text-secondary)]">
                  Step 1 — Select Emirate of Visa Issuance
                </span>
              </div>

              {/* Emirates grid */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {emirates.map(({ id, label, flag }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedEmirate(id)}
                    className={cn(
                      'flex items-center gap-2.5 px-3.5 py-3 rounded-xl border-2 text-left transition-all duration-150',
                      selectedEmirate === id
                        ? 'border-[var(--teal-600)] bg-[var(--teal-50)]'
                        : 'border-[var(--border-default)] hover:border-[var(--border-medium)] bg-white hover:bg-[var(--surface-raised)]'
                    )}
                  >
                    <span className="text-lg leading-none">{flag}</span>
                    <div>
                      <span
                        className={cn(
                          'font-sans font-semibold text-[13px] block leading-none mb-0.5',
                          selectedEmirate === id ? 'text-[var(--teal-700)]' : 'text-[var(--text-primary)]'
                        )}
                      >
                        {label}
                      </span>
                      {id === 'dubai' && (
                        <span className="font-sans text-[10px]" style={{ color: 'var(--teal-600)' }}>
                          Mandatory DHA
                        </span>
                      )}
                    </div>
                    {selectedEmirate === id && (
                      <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" style={{ color: 'var(--teal-600)' }} />
                    )}
                  </button>
                ))}
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={handleProceed}
                disabled={!selectedEmirate}
                className={cn(
                  'w-full h-12 rounded-xl font-sans font-bold text-[14px] flex items-center justify-center gap-2 transition-all duration-200',
                  selectedEmirate
                    ? 'text-white hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5'
                    : 'text-[var(--text-subtle)] cursor-not-allowed'
                )}
                style={{
                  background: selectedEmirate
                    ? 'linear-gradient(135deg, var(--navy-800) 0%, var(--teal-600) 100%)'
                    : 'var(--border-default)',
                }}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Footer note */}
              <p className="mt-3.5 text-center font-sans text-[11px] text-[var(--text-subtle)]">
                No spam · No commitment · Quotes in under 3 minutes
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade into page */}
      <div
        className="h-10"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--page-bg))' }}
      />
    </section>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
