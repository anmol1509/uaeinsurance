'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Shield, Building2, Users, Heart } from 'lucide-react'
import Tag from '@/components/ui/Tag'

const coverageItems = [
  { title: 'Inpatient & surgery', desc: 'Full hospitalisation cover including surgery, ward, and specialist fees at DHA-accredited hospitals.' },
  { title: 'Outpatient & consultations', desc: 'GP visits, specialist referrals, diagnostic tests, and lab work — all cashless.' },
  { title: 'Maternity cover', desc: 'Antenatal, delivery, and postnatal care. Newborn cover from day 1.' },
  { title: 'Dental & vision', desc: 'Optional dental treatment and optical cover included in Enhanced and VIP tiers.' },
  { title: 'Emergency evacuation', desc: 'Air ambulance and emergency medical evacuation covered worldwide.' },
  { title: '1,500+ network hospitals', desc: 'Cashless treatment across our accredited hospital network in Dubai, Abu Dhabi, and across UAE.' },
  { title: 'Chronic disease management', desc: 'Ongoing treatment for diabetes, hypertension, and other chronic conditions fully covered.' },
  { title: 'Mental health support', desc: 'Psychiatric consultations, therapy sessions, and mental wellness support included.' },
  { title: 'Repatriation cover', desc: 'Medical repatriation to home country if required. Mandatory for Dubai visa compliance.' },
]

const plans = [
  {
    name: 'Basic DHA',
    price: 'AED 750',
    period: '/year',
    badge: 'Mandatory',
    badgeColor: 'var(--medical-600)',
    badgeBg: 'var(--medical-50)',
    features: [
      'Inpatient cover up to AED 150,000',
      'Emergency care',
      'DHA-compliant certificate',
      'Approved for Dubai visa',
      'E-card + digital certificate',
    ],
    cta: 'Get Basic Plan',
    highlight: false,
  },
  {
    name: 'Enhanced',
    price: 'AED 2,400',
    period: '/year',
    badge: 'Most Popular',
    badgeColor: 'var(--orange-600)',
    badgeBg: 'var(--orange-50)',
    features: [
      'All Basic DHA benefits',
      'Inpatient cover up to AED 500,000',
      'Outpatient & specialist visits',
      'Dental (basic) included',
      'Maternity cover (AED 10,000)',
      'Worldwide emergency cover',
    ],
    cta: 'Get Enhanced Plan',
    highlight: true,
  },
  {
    name: 'VIP Platinum',
    price: 'AED 8,500',
    period: '/year',
    badge: 'Premium',
    badgeColor: '#7C3AED',
    badgeBg: '#F5F3FF',
    features: [
      'All Enhanced benefits',
      'Unlimited inpatient cover',
      'Full dental & vision',
      'Mental health cover',
      'International treatment',
      'Dedicated relationship manager',
    ],
    cta: 'Get VIP Plan',
    highlight: false,
  },
]

const steps = [
  { title: 'Choose your plan tier', desc: 'Basic DHA, Enhanced, or VIP Platinum', icon: Heart },
  { title: 'Fill in your details', desc: 'Emirates ID, visa type, and dependants', icon: Shield },
  { title: 'Compare & customise', desc: 'Side-by-side quotes from IA-licensed insurers', icon: Users },
  { title: 'Pay & get covered', desc: 'DHA certificate issued instantly on payment', icon: Building2 },
]

const complianceItems = [
  { label: 'Dubai Health Authority', abbr: 'DHA' },
  { label: 'Health Authority Abu Dhabi', abbr: 'HAAD' },
  { label: 'Insurance Authority UAE', abbr: 'IA' },
  { label: 'Mandatory Dubai Health Cover', abbr: 'DHC' },
]

export default function MedicalProductPage() {
  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Hero */}
      <section className="bg-white py-16 px-5 lg:px-20">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[55fr_45fr] gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Tag variant="medical">Health Insurance UAE</Tag>
            <h1 className="font-display font-extrabold mt-4 mb-4 tracking-tight" style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--text-primary)' }}>
              DHA-compliant health cover<br />for every resident.
            </h1>
            <p className="font-sans text-[17px] leading-relaxed max-w-[460px] mb-2" style={{ color: 'var(--text-muted)' }}>
              Instant quotes from IA-licensed insurers. Cashless treatment at 1,500+ hospitals. Mandatory Dubai health insurance made simple.
            </p>

            {/* Compliance badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {complianceItems.map((c) => (
                <span
                  key={c.abbr}
                  className="inline-flex items-center gap-1.5 font-sans font-semibold text-[11px] px-3 py-1.5 rounded-full border"
                  style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-100)', color: 'var(--green-700)' }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5 L4 7 L8 3" stroke="var(--green-700)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {c.abbr}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <Link href="/quote/medical" className="inline-flex items-center gap-2 w-fit h-14 px-8 rounded-[var(--radius-xl)] font-sans font-semibold text-base text-white transition-all hover:-translate-y-px hover:shadow-lg" style={{ backgroundColor: 'var(--medical-600)' }}>
                Get health quote <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>Compare plans from multiple IA-licensed insurers — free</p>
            </div>
          </motion.div>

          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--medical-50)' }}>
                <svg viewBox="0 0 160 160" width="140" fill="none">
                  <circle cx="80" cy="80" r="70" fill="var(--medical-100)" opacity="0.5" />
                  {/* Shield */}
                  <path d="M80 25 L115 42 L115 90 C115 118 98 138 80 148 C62 138 45 118 45 90 L45 42 Z"
                    fill="var(--medical-100)" />
                  <path d="M80 29 L112 45 L112 90 C112 116 96 135 80 144 C64 135 48 116 48 90 L48 45 Z"
                    fill="none" stroke="var(--medical-600)" strokeWidth="2" />
                  {/* Cross */}
                  <rect x="70" y="60" width="20" height="50" rx="4" fill="var(--medical-600)" />
                  <rect x="55" y="75" width="50" height="20" rx="4" fill="var(--medical-600)" />
                </svg>
              </div>
              {/* Floating stat */}
              <div className="absolute -bottom-2 -right-4 bg-white rounded-2xl px-4 py-3 border border-[var(--border-default)]">
                <p className="font-display font-bold text-[22px]" style={{ color: 'var(--medical-600)' }}>AED 750</p>
                <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>Starting price / year</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--page-bg)' }}>
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10">
            <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--green-700)' }}>
              Health Plans
            </p>
            <h2 className="font-display font-extrabold text-[34px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Choose the right plan for you
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-4xl border p-7 flex flex-col transition-all duration-200 ${plan.highlight ? 'border-[var(--medical-600)] ring-1 ring-[var(--medical-600)]' : 'border-[var(--border-default)] hover:border-[var(--medical-600)]'} bg-white`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
                  <span
                    className="font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: plan.badgeBg, color: plan.badgeColor }}
                  >
                    {plan.badge}
                  </span>
                </div>

                <div className="mb-5">
                  <span className="font-display font-bold text-[36px]" style={{ color: 'var(--text-primary)' }}>{plan.price}</span>
                  <span className="font-sans text-sm ml-1" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
                </div>

                <div className="flex flex-col gap-2.5 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'var(--medical-50)' }}>
                        <Check className="w-3 h-3" style={{ color: 'var(--medical-600)' }} strokeWidth={2.5} />
                      </div>
                      <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/quote/medical"
                  className="w-full h-11 flex items-center justify-center rounded-[var(--radius-xl)] font-sans font-semibold text-sm transition-all"
                  style={plan.highlight
                    ? { backgroundColor: 'var(--medical-600)', color: 'white' }
                    : { border: '1.5px solid var(--border-medium)', color: 'var(--text-secondary)' }
                  }
                >
                  {plan.cta} →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's covered */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[34px] tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>What&apos;s covered</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coverageItems.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-3xl border border-[var(--border-default)] p-6 hover:border-[var(--medical-600)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--medical-50)' }}>
                  <Check className="w-5 h-5" style={{ color: 'var(--medical-600)' }} strokeWidth={2.5} />
                </div>
                <h3 className="font-display font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[34px] tracking-tight mb-10 text-center" style={{ color: 'var(--text-primary)' }}>How to get covered</h2>
          <div className="grid md:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-3xl border border-[var(--border-default)] p-7"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--medical-50)' }}>
                  <step.icon className="w-5 h-5" style={{ color: 'var(--medical-600)' }} />
                </div>
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mb-3">
                  <span className="font-display font-bold text-sm text-white">{i + 1}</span>
                </div>
                <h3 className="font-display font-bold text-[17px] mb-1.5" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/quote/medical" className="inline-flex items-center h-[54px] px-9 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-sans font-semibold text-base transition-all hover:-translate-y-px hover:shadow-lg">
              Compare health plans →
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 px-5 lg:px-20 text-center" style={{ backgroundColor: 'var(--medical-600)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[36px] text-white tracking-tight mb-2">Protect your health. Stay DHA-compliant.</h2>
          <p className="font-sans text-base mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>Join 75,000+ UAE residents covered by InsureAE. Mandatory health insurance for Dubai — sorted in minutes.</p>
          <Link href="/quote/medical" className="inline-flex items-center h-12 px-7 bg-white rounded-xl font-sans font-bold text-[15px]" style={{ color: 'var(--medical-600)' }}>
            Get your health quote now →
          </Link>
        </div>
      </section>
    </div>
  )
}
