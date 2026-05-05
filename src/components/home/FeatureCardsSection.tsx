'use client'
import { motion } from 'framer-motion'
import PhoneFrame from '@/components/ui/PhoneFrame'

function RenewalPhoneContent() {
  return (
    <div className="flex flex-col h-full p-4 bg-white">
      {/* Amber renewal banner */}
      <div className="rounded-xl p-3 mb-3" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
        <p className="font-sans font-semibold text-[11px]" style={{ color: '#92400E' }}>
          Policy expires in 14 days
        </p>
        <p className="font-sans text-[10px] mt-0.5" style={{ color: '#B45309' }}>
          Renew now to stay DHA compliant
        </p>
      </div>

      {/* Policy card */}
      <div className="rounded-xl border border-gray-100 overflow-hidden mb-3">
        <div className="bg-[var(--medical-600)] px-3 py-2.5">
          <p className="text-white font-sans font-semibold text-[11px]">Health Insurance</p>
          <p className="text-white/70 font-sans text-[9px] mt-0.5">IAE-2025-0087341</p>
        </div>
        <div className="bg-white px-3 py-2">
          <p className="font-sans text-[10px] text-gray-500">Enhanced Plan · Dubai</p>
          <p className="font-sans text-[11px] text-gray-700 mt-0.5">Active · Expires Soon</p>
        </div>
      </div>

      <div className="flex-1" />

      <button
        type="button"
        className="w-full py-2.5 rounded-xl font-sans font-semibold text-[12px]"
        style={{ backgroundColor: 'var(--orange-500)', color: 'white' }}
      >
        Renew policy →
      </button>
    </div>
  )
}

function DashboardPhoneContent() {
  const policies = [
    { name: 'Health', color: 'var(--medical-600)', status: 'Active', detail: 'Enhanced Plan' },
    { name: 'Family', color: 'var(--travel-600)', status: 'Active', detail: 'Family Plan' },
    { name: 'Travel', color: 'var(--motor-600)', status: 'Expired', detail: 'Single Trip' },
  ]

  return (
    <div className="flex flex-col h-full p-4 bg-white">
      <p className="font-display font-bold text-[13px] text-gray-800 mb-4">My Policies</p>
      <div className="flex flex-col gap-2.5">
        {policies.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-between rounded-xl p-3 border border-gray-100"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-[10px]"
                style={{ backgroundColor: p.color }}
              >
                {p.name[0]}
              </div>
              <div>
                <span className="font-sans font-medium text-[11px] text-gray-700 block">
                  {p.name} Insurance
                </span>
                <span className="font-sans text-[9px] text-gray-400">{p.detail}</span>
              </div>
            </div>
            <span
              className="font-sans text-[10px] px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: p.status === 'Active' ? '#DCFCE7' : '#FEE2E2',
                color: p.status === 'Active' ? '#166534' : '#991B1B',
              }}
            >
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FeatureCardsSection() {
  const cards = [
    {
      eyebrow: 'RENEWAL REMINDER',
      eyebrowColor: 'var(--orange-500)',
      title: 'Is your health insurance about to expire?',
      body: 'Stay DHA-compliant year-round. Check your renewal date and get the best price in under 60 seconds.',
      cta: 'Check renewal date →',
      phone: <RenewalPhoneContent />,
    },
    {
      eyebrow: 'POLICY DASHBOARD',
      eyebrowColor: 'var(--green-700)',
      title: 'Already covered? Manage everything here.',
      body: 'View your active policies, download DHA certificates, add dependants, and file claims — all in one place.',
      cta: 'Go to my dashboard →',
      phone: <DashboardPhoneContent />,
    },
  ]

  return (
    <section style={{ backgroundColor: 'var(--surface)' }} className="px-5 lg:px-20 pb-20">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.1 }}
            className="overflow-hidden rounded-4xl border border-[var(--border-default)] grid md:grid-cols-[55fr_45fr] min-h-[260px]"
            style={{ backgroundColor: 'var(--surface-raised)' }}
          >
            {/* Left */}
            <div className="p-12 flex flex-col justify-center">
              <p
                className="font-sans font-bold text-[11px] uppercase tracking-[0.1em] mb-3"
                style={{ color: card.eyebrowColor }}
              >
                {card.eyebrow}
              </p>
              <h3
                className="font-display font-bold text-3xl max-w-[360px] mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                {card.title}
              </h3>
              <p
                className="font-sans text-[15px] max-w-[380px] mb-6 leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                {card.body}
              </p>
              <button
                type="button"
                className="w-fit h-11 px-5 rounded-[var(--radius-xl)] border-[1.5px] border-[var(--border-medium)] font-sans font-medium text-sm hover:bg-white transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                {card.cta}
              </button>
            </div>

            {/* Right: phone overflowing */}
            <div className="relative flex items-end justify-center overflow-hidden pt-4">
              <div style={{ transform: 'translateY(-32px)' }}>
                <PhoneFrame animate={false}>
                  {card.phone}
                </PhoneFrame>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
