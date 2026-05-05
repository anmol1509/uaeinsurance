'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ArrowRight, CheckCircle2, Star, UserCheck, Users } from 'lucide-react'

const plans = [
  {
    id: 'basic',
    icon: Heart,
    label: 'Basic DHA Plan',
    price: 'From AED 750',
    period: '/ year',
    badge: 'DHA Mandatory',
    href: '/quote/health',
    accent: '#0D9488',
    bg: 'linear-gradient(145deg, #F0FDFA 0%, #CCFBF1 100%)',
    features: ['DHA minimum benefits', 'In & outpatient cover', 'Emergency & repatriation'],
    note: 'Required for all Dubai visa holders',
  },
  {
    id: 'enhanced',
    icon: UserCheck,
    label: 'Enhanced Plan',
    price: 'From AED 1,800',
    period: '/ year',
    badge: 'Most Popular',
    href: '/quote/health',
    accent: '#fff',
    textAccent: '#0B2545',
    bg: 'linear-gradient(145deg, #0F2D55 0%, #0B3D6B 100%)',
    features: ['Customisable co-pays', 'Higher medicine limit', 'Specialist referral cover'],
    note: 'Build your own benefit levels',
    inverted: true,
  },
  {
    id: 'family',
    icon: Users,
    label: 'Family Plan',
    price: 'From AED 4,200',
    period: '/ year',
    badge: 'HAAD Approved',
    href: '/quote/health',
    accent: '#D4A24B',
    bg: 'linear-gradient(145deg, #FFFBEB 0%, #FDE68A 100%)',
    features: ['Spouse + children', 'Maternity cover option', 'Dental add-on available'],
    note: 'One policy, whole family covered',
  },
  {
    id: 'vip',
    icon: Star,
    label: 'VIP Platinum',
    price: 'From AED 8,500',
    period: '/ year',
    badge: 'Premium',
    href: '/quote/health',
    accent: '#7C3AED',
    bg: 'linear-gradient(145deg, #F5F3FF 0%, #EDE9FE 100%)',
    features: ['Worldwide cover incl. USA', 'Private hospital rooms', 'Dental & optical included'],
    note: 'No network restrictions, no referrals',
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
            Health Insurance Plans
          </div>
          <h2
            className="font-display font-extrabold leading-tight text-[var(--navy-900)] mb-3"
            style={{ fontSize: 'clamp(26px, 3.2vw, 38px)' }}
          >
            The right health cover for every need
          </h2>
          <p className="font-sans text-[15px] text-[var(--text-muted)] max-w-xl mx-auto">
            Compare plans from 14+ IA-licensed insurers. DHA &amp; HAAD compliant. Certificate in under 3 minutes.
          </p>
        </div>

        {/* Plans grid — 2×2 */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {plans.map((plan, i) => {
            const { icon: Icon, label, price, period, badge, href, accent, bg, features, note, inverted } = plan
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={href}
                  className="block h-full rounded-2xl p-6 transition-shadow hover:shadow-xl"
                  style={{ background: bg }}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: inverted ? 'rgba(255,255,255,0.15)' : `${accent}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: inverted ? '#fff' : accent }} />
                    </div>
                    {badge && (
                      <span
                        className="font-sans font-bold text-[10px] px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: inverted ? 'rgba(255,255,255,0.18)' : `${accent}18`,
                          color: inverted ? '#fff' : accent,
                        }}
                      >
                        {badge}
                      </span>
                    )}
                  </div>

                  {/* Title & price */}
                  <h3
                    className="font-display font-bold text-[18px] mb-1"
                    style={{ color: inverted ? '#fff' : 'var(--navy-900)' }}
                  >
                    {label}
                  </h3>
                  <p
                    className="font-sans text-[12px] mb-3"
                    style={{ color: inverted ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)' }}
                  >
                    {note}
                  </p>
                  <div className="flex items-baseline gap-1 mb-5">
                    <span
                      className="font-display font-extrabold text-[24px]"
                      style={{ color: inverted ? '#fff' : accent }}
                    >
                      {price}
                    </span>
                    <span
                      className="font-sans text-[12px]"
                      style={{ color: inverted ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)' }}
                    >
                      {period}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-5">
                    {features.map(f => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle2
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: inverted ? 'rgba(255,255,255,0.6)' : accent }}
                        />
                        <span
                          className="font-sans text-[13px]"
                          style={{ color: inverted ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)' }}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div
                    className="flex items-center gap-1.5 font-sans font-semibold text-[13px]"
                    style={{ color: inverted ? '#fff' : accent }}
                  >
                    Get a quote <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            href="/quote/health"
            className="inline-flex items-center gap-2.5 h-12 px-8 rounded-xl font-sans font-bold text-[14px] text-white transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--teal-600) 100%)' }}
          >
            Compare all health plans <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-3 font-sans text-[12px] text-[var(--text-subtle)]">
            IA-licensed · No commitment · Free comparison · 14+ insurer partners
          </p>
        </div>
      </div>
    </section>
  )
}
