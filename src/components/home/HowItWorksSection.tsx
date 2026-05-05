'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, FileText, CreditCard, Download, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: MapPin,
    title: 'Select your emirate',
    desc: 'Choose the emirate that issued your UAE visa. Dubai follows DHA rules; other emirates follow different IA guidelines.',
    color: '#0D9488',
    bg: '#F0FDFA',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Tell us about yourself',
    desc: 'Your Emirates ID, salary band, and member type. Takes under 2 minutes — no medical questions for basic DHA plans.',
    color: '#1A4F8A',
    bg: '#EBF2FA',
  },
  {
    number: '03',
    icon: CreditCard,
    title: 'Compare & choose your plan',
    desc: 'We instantly compare 14+ licensed insurers. Filter by price, network, or benefit level. No broker commission inflating costs.',
    color: '#D4A24B',
    bg: '#FFFBEB',
  },
  {
    number: '04',
    icon: Download,
    title: 'Pay & receive your certificate',
    desc: 'DHA/HAAD-compliant insurance certificate delivered to your email the moment payment clears. Under 3 minutes total.',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
]

export default function HowItWorksSection() {
  return (
    <section
      className="py-20"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      <div className="max-w-[1320px] mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-sans font-semibold text-[12px] mb-4"
            style={{ backgroundColor: 'var(--teal-50)', color: 'var(--teal-700)' }}
          >
            How it works
          </div>
          <h2
            className="font-display font-extrabold leading-tight text-[var(--navy-900)] mb-3"
            style={{ fontSize: 'clamp(26px, 3.2vw, 38px)' }}
          >
            Health insurance in under 3 minutes
          </h2>
          <p className="font-sans text-[15px] text-[var(--text-muted)] max-w-lg mx-auto">
            No paperwork. No broker meetings. Fully online — from quote to DHA-compliant certificate.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative bg-white rounded-2xl p-6 border border-[var(--border-default)] hover:shadow-lg transition-shadow"
            >
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-10 left-full w-4 h-0.5 z-10"
                  style={{ backgroundColor: 'var(--border-medium)' }}
                />
              )}

              {/* Step number */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: step.bg }}
                >
                  <step.icon className="w-5 h-5" style={{ color: step.color }} />
                </div>
                <span
                  className="font-display font-extrabold text-[28px] leading-none"
                  style={{ color: step.bg === '#F0FDFA' ? '#B2F0E8' : step.bg === '#EBF2FA' ? '#C8DAEA' : step.bg === '#FFFBEB' ? '#FDE68A' : '#DDD6FE' }}
                >
                  {step.number}
                </span>
              </div>

              <h3 className="font-display font-bold text-[15px] text-[var(--navy-900)] mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="font-sans text-[13px] text-[var(--text-muted)] leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/quote/health"
            className="inline-flex items-center gap-2.5 h-12 px-8 rounded-xl font-sans font-bold text-[14px] text-white transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--teal-600) 100%)' }}
          >
            Start your free quote
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
