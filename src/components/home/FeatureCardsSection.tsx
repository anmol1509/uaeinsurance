'use client'
import { motion } from 'framer-motion'
import { Bell, FileCheck, Users, Globe, Shield, CreditCard } from 'lucide-react'

const features = [
  {
    icon: Bell,
    title: 'Renewal reminders',
    desc: 'Auto-reminders before your DHA-compliant policy expires. Stay covered without gaps.',
    color: '#0D9488',
    bg: '#F0FDFA',
  },
  {
    icon: FileCheck,
    title: 'Instant certificate',
    desc: 'IA-compliant PDF delivered to your inbox the moment your payment clears. No waiting.',
    color: '#1A4F8A',
    bg: '#EBF2FA',
  },
  {
    icon: Users,
    title: 'Group management',
    desc: 'Add or remove employees from your group health policy in real-time through your dashboard.',
    color: '#D4A24B',
    bg: '#FFFBEB',
  },
  {
    icon: Globe,
    title: 'Multilingual support',
    desc: 'Claims and support available in English, Arabic, Hindi, Urdu, and Tagalog.',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    icon: Shield,
    title: 'DHA & HAAD compliant',
    desc: 'Every plan meets UAE regulatory minimums. Employer compliance guaranteed.',
    color: '#0A7A72',
    bg: '#ECFDF5',
  },
  {
    icon: CreditCard,
    title: 'Flexible payments',
    desc: 'Pay with Apple Pay, Visa, Mastercard, or UAE bank transfer. Monthly installments available.',
    color: '#B45309',
    bg: '#FEF3C7',
  },
]

export default function FeatureCardsSection() {
  return (
    <section className="py-20" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="max-w-[1320px] mx-auto px-5 lg:px-8">

        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-sans font-semibold text-[12px] mb-4"
            style={{ backgroundColor: 'var(--navy-50)', color: 'var(--navy-700)' }}
          >
            Platform features
          </div>
          <h2
            className="font-display font-extrabold leading-tight text-[var(--navy-900)] mb-3"
            style={{ fontSize: 'clamp(26px, 3.2vw, 38px)' }}
          >
            Everything built for UAE residents
          </h2>
          <p className="font-sans text-[15px] text-[var(--text-muted)] max-w-lg mx-auto">
            Purpose-built for the UAE market — not adapted from a foreign platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="bg-white rounded-2xl p-6 border border-[var(--border-default)] hover:shadow-lg transition-shadow"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: feature.bg }}
              >
                <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
              </div>
              <h3 className="font-display font-bold text-[16px] text-[var(--navy-900)] mb-2">
                {feature.title}
              </h3>
              <p className="font-sans text-[13.5px] text-[var(--text-muted)] leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
