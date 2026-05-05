'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Users, Car, Plane, ArrowRight, CheckCircle2, Star } from 'lucide-react'

const plans = [
  {
    id: 'individual',
    icon: Heart,
    label: 'Individual Health',
    price: 'From AED 750',
    period: '/ year',
    badge: 'Mandatory in Dubai',
    badgeColor: '#0D9488',
    href: '/medical',
    accent: '#0D9488',
    bg: 'linear-gradient(145deg, #F0FDFA 0%, #CCFBF1 100%)',
    features: ['DHA & HAAD Compliant', 'Outpatient & Inpatient', 'Emergency cover'],
    popular: false,
  },
  {
    id: 'enhanced',
    icon: Star,
    label: 'Enhanced Plan',
    price: 'From AED 2,200',
    period: '/ year',
    badge: 'Most Popular',
    badgeColor: '#FFFFFF',
    href: '/quote/health',
    accent: '#0B2545',
    bg: 'linear-gradient(145deg, #0F2D55 0%, #0B3D6B 100%)',
    features: ['Customisable co-pays', 'Higher medicine limits', 'Specialist cover'],
    popular: true,
  },
  {
    id: 'family',
    icon: Users,
    label: 'Family Plan',
    price: 'From AED 4,200',
    period: '/ year',
    badge: 'HAAD Approved',
    badgeColor: '#D97706',
    href: '/medical',
    accent: '#D97706',
    bg: 'linear-gradient(145deg, #FFFBEB 0%, #FDE68A 100%)',
    features: ['Spouse + children', 'Maternity cover option', 'Dental add-on'],
    popular: false,
  },
  {
    id: 'group',
    icon: Car,
    label: 'Group / Corporate',
    price: 'From AED 900',
    period: '/ employee / yr',
    badge: 'For Employers',
    badgeColor: '#1A4F8A',
    href: '/business',
    accent: '#1A4F8A',
    bg: 'linear-gradient(145deg, #EBF2FA 0%, #D6E4F4 100%)',
    features: ['Workforce-wide cover', 'Dedicated account manager', 'IA Group license'],
    popular: false,
  },
  {
    id: 'travel',
    icon: Plane,
    label: 'Travel Insurance',
    price: 'From AED 75',
    period: '/ trip',
    badge: 'Worldwide cover',
    badgeColor: '#7C3AED',
    href: '/travel',
    accent: '#7C3AED',
    bg: 'linear-gradient(145deg, #F5F3FF 0%, #EDE9FE 100%)',
    features: ['Medical evacuation', 'Trip cancellation', 'Baggage loss'],
    popular: false,
  },
]

export default function ProductBentoGrid() {
  return (
    <section className="py-20" style={{ backgroundColor: 'var(--surface)' }} id="products">
      <div className="max-w-[1320px] mx-auto px-5 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-sans font-semibold text-[12px] mb-4"
            style={{ backgroundColor: 'var(--navy-50)', color: 'var(--navy-700)' }}
          >
            Insurance Products
          </div>
          <h2
            className="font-display font-extrabold leading-tight text-[var(--navy-900)] mb-3"
            style={{ fontSize: 'clamp(26px, 3.2vw, 38px)' }}
          >
            The right cover for every need
          </h2>
          <p className="font-sans text-[15px] text-[var(--text-muted)] max-w-xl mx-auto">
            Compare plans from 14+ IA-licensed insurers. Get your certificate in under 3 minutes.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {plans.slice(0, 3).map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} delay={i * 0.06} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plans.slice(3).map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} delay={(i + 3) * 0.06} wide />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <Link
            href="/quote/health"
            className="inline-flex items-center gap-2.5 h-12 px-8 rounded-xl font-sans font-bold text-[14px] text-white transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--teal-600) 100%)' }}
          >
            Compare all plans <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-3 font-sans text-[12px] text-[var(--text-subtle)]">
            IA-licensed · No commitment · Free comparison
          </p>
        </div>
      </div>
    </section>
  )
}

function PlanCard({ plan, delay, wide }: { plan: typeof plans[0]; delay: number; wide?: boolean }) {
  const { icon: Icon, label, price, period, badge, badgeColor, href, accent, bg, features, popular } = plan

  const isInverted = popular

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={href}
        className="block h-full rounded-2xl p-6 transition-shadow hover:shadow-xl"
        style={{ background: bg }}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: isInverted ? 'rgba(255,255,255,0.15)' : `${accent}18`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: isInverted ? '#FFFFFF' : accent }} />
          </div>
          {badge && (
            <span
              className="font-sans font-bold text-[10px] px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: isInverted ? 'rgba(255,255,255,0.2)' : `${badgeColor}18`,
                color: isInverted ? '#FFFFFF' : badgeColor,
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <h3
          className="font-display font-bold text-[17px] mb-1"
          style={{ color: isInverted ? '#FFFFFF' : 'var(--navy-900)' }}
        >
          {label}
        </h3>

        <div className="flex items-baseline gap-1 mb-4">
          <span
            className="font-display font-extrabold text-[22px]"
            style={{ color: isInverted ? '#FFFFFF' : accent }}
          >
            {price}
          </span>
          <span
            className="font-sans text-[12px]"
            style={{ color: isInverted ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}
          >
            {period}
          </span>
        </div>

        <ul className="space-y-1.5 mb-5">
          {features.map(f => (
            <li key={f} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: isInverted ? 'rgba(255,255,255,0.7)' : accent }} />
              <span
                className="font-sans text-[12.5px]"
                style={{ color: isInverted ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>

        <div
          className="flex items-center gap-1 font-sans font-semibold text-[13px]"
          style={{ color: isInverted ? '#FFFFFF' : accent }}
        >
          Get a quote <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </Link>
    </motion.div>
  )
}
