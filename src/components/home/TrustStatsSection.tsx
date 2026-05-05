'use client'
import { motion } from 'framer-motion'
import CountUpNumber from '@/components/ui/CountUpNumber'
import { Star, Shield, Zap, PhoneCall, Clock } from 'lucide-react'

const stats = [
  { value: 75000, label: 'Insured Residents', suffix: '+',   format: (n: number) => (n >= 1000 ? `${(n/1000).toFixed(0)}K` : String(n)) },
  { value: 97,    label: 'Claims Settled',    suffix: '%',   format: (n: number) => n.toFixed(0) },
  { value: 3,     label: 'Minutes to Quote',  suffix: ' min', format: (n: number) => n.toFixed(0) },
  { value: 14,    label: 'Insurer Partners',  suffix: '+',   format: (n: number) => n.toFixed(0) },
]

const testimonials = [
  {
    quote: 'Fastest insurance certificate I\'ve ever received. DHA-compliant and in my inbox in under 3 minutes.',
    name: 'Aisha Al Mansouri',
    role: 'Dubai resident',
    initials: 'AA',
    rating: 5,
  },
  {
    quote: 'Transparent pricing, no hidden fees. InsureAE found me a better plan at AED 400 less per year than my previous insurer.',
    name: 'Priya Nair',
    role: 'Abu Dhabi resident',
    initials: 'PN',
    rating: 5,
  },
  {
    quote: 'The claims team resolved my hospital bill in 2 days. Genuinely the best insurance experience I\'ve had in the UAE.',
    name: 'Omar Al Farsi',
    role: 'Sharjah resident',
    initials: 'OA',
    rating: 5,
  },
]

const trustPoints = [
  { icon: Shield,    title: 'IA Licensed',         desc: 'Insurance Authority of the UAE' },
  { icon: Zap,       title: 'DHA Compliant',        desc: 'Dubai Health Authority approved' },
  { icon: PhoneCall, title: '24/7 Support',         desc: 'Multilingual claims team' },
  { icon: Clock,     title: '< 3 Min',              desc: 'Quote to certificate' },
]

export default function TrustStatsSection() {
  return (
    <section className="py-20" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="max-w-[1320px] mx-auto px-5 lg:px-8">

        {/* Trust points row */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-px mb-16 rounded-2xl overflow-hidden border border-[var(--border-default)]"
        >
          {trustPoints.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white px-6 py-6 flex items-center gap-4"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--navy-50)' }}
              >
                <Icon className="w-5 h-5" style={{ color: 'var(--navy-700)' }} />
              </div>
              <div>
                <div className="font-display font-bold text-[15px] text-[var(--navy-900)]">{title}</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)]">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats + Testimonials two-column */}
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">

          {/* Left: Stats */}
          <div
            className="rounded-2xl p-8 flex flex-col justify-between"
            style={{ background: 'linear-gradient(145deg, var(--navy-900) 0%, var(--navy-950) 100%)' }}
          >
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-sans font-bold text-[11px] mb-4"
                style={{ backgroundColor: 'rgba(212,162,75,0.2)', color: 'var(--gold-400)' }}
              >
                By the numbers
              </div>
              <h2 className="font-display font-extrabold text-white mb-2" style={{ fontSize: 'clamp(22px, 2.8vw, 32px)', lineHeight: 1.15 }}>
                Trusted by 75,000+ UAE residents
              </h2>
              <p className="font-sans text-[14px] mb-8" style={{ color: 'var(--navy-200)' }}>
                InsureAE is the fastest-growing health insurance platform in the UAE.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ value, label, suffix, format }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
                >
                  <div className="font-display font-extrabold text-white leading-none mb-1" style={{ fontSize: '28px' }}>
                    <CountUpNumber target={value} suffix={suffix} format={format} />
                  </div>
                  <div className="font-sans text-[12px]" style={{ color: 'var(--navy-400)' }}>{label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Testimonials */}
          <div className="space-y-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 border border-[var(--border-default)]"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: '#FBBF24' }} />
                  ))}
                </div>
                <p className="font-sans text-[13.5px] leading-relaxed text-[var(--text-secondary)] mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-[12px] text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--navy-700) 0%, var(--teal-600) 100%)' }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-[13px] text-[var(--text-primary)]">{t.name}</div>
                    <div className="font-sans text-[11px] text-[var(--text-muted)]">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
