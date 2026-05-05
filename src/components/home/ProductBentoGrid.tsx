'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Tag from '@/components/ui/Tag'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const, delay: i * 0.1 },
  }),
}

const HealthIllustration = () => (
  <svg viewBox="0 0 180 90" width="180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="90" cy="45" r="42" fill="#A7F3D0" opacity="0.5" />
    <rect x="66" y="12" width="48" height="66" rx="6" fill="#6EE7B7" />
    <rect x="18" y="36" width="144" height="18" rx="6" fill="#6EE7B7" />
    <rect x="78" y="20" width="24" height="50" rx="3" fill="#059669" />
    <rect x="26" y="42" width="128" height="6" rx="2" fill="#059669" />
  </svg>
)

const GroupIllustration = () => (
  <svg viewBox="0 0 160 80" width="160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="45" cy="28" r="16" fill="#C4B5FD" />
    <circle cx="80" cy="22" r="20" fill="#A78BFA" />
    <circle cx="115" cy="28" r="16" fill="#C4B5FD" />
    <path d="M18 72 Q18 52 45 52 Q62 52 80 52 Q98 52 115 52 Q142 52 142 72" fill="#DDD6FE" />
  </svg>
)

const FamilyIllustration = () => (
  <svg viewBox="0 0 100 60" width="100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="18" r="12" fill="#FDE68A" />
    <circle cx="70" cy="18" r="12" fill="#FDE68A" />
    <circle cx="50" cy="14" r="10" fill="#FCD34D" />
    <path d="M8 56 Q8 42 30 42 Q50 42 50 42 Q50 42 70 42 Q92 42 92 56" fill="#FDE68A" />
  </svg>
)

const TravelIllustration = () => (
  <svg viewBox="0 0 100 60" width="100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 40 L60 10 L90 30 L60 35 Z" fill="#FDE68A" />
    <path d="M30 50 L60 35 L70 45 Z" fill="#FCD34D" />
    <path d="M60 10 L65 40" stroke="#D97706" strokeWidth="2" />
    <circle cx="58" cy="12" r="8" fill="#FCD34D" />
  </svg>
)

const products = [
  {
    id: 'A',
    tag: 'medical' as const,
    tagLabel: 'Individual Health Insurance',
    title: 'Health cover for you',
    valueProp: 'DHA & HAAD compliant plans',
    sub: 'Mandatory in Dubai for all residents.',
    priceLabel: 'Starting at AED 750/yr',
    color: 'var(--medical-600)',
    colorBg: 'var(--medical-50)',
    colorCheck: 'var(--medical-100)',
    href: '/medical',
    illustration: <HealthIllustration />,
    gridClass: 'col-span-1 row-span-2 min-h-[320px]',
  },
  {
    id: 'B',
    tag: 'business' as const,
    tagLabel: 'Group Health Insurance',
    title: 'Group & Corporate cover',
    valueProp: 'Fully compliant employee health benefits',
    sub: 'Tailored plans for teams of 2 to 2,000+',
    priceLabel: 'From AED 900/employee/yr',
    color: 'var(--business-600)',
    colorBg: 'var(--business-50)',
    colorCheck: 'var(--business-100)',
    href: '/business',
    illustration: <GroupIllustration />,
    gridClass: 'col-span-1 row-span-2 min-h-[320px]',
  },
  {
    id: 'C',
    tag: 'travel' as const,
    tagLabel: 'Family Health Insurance',
    title: 'Family protection',
    valueProp: 'One plan covers the whole family',
    sub: '',
    priceLabel: 'Starting at AED 4,200/yr',
    color: 'var(--travel-600)',
    colorBg: 'var(--travel-50)',
    colorCheck: 'var(--travel-100)',
    href: '/medical',
    illustration: <FamilyIllustration />,
    gridClass: 'col-span-1 row-span-1 min-h-[160px]',
  },
  {
    id: 'D',
    tag: 'motor' as const,
    tagLabel: 'Travel Insurance',
    title: 'Travel insurance',
    valueProp: 'International medical emergencies covered',
    sub: '',
    priceLabel: 'Starting at AED 99/trip',
    color: 'var(--motor-600)',
    colorBg: 'var(--motor-50)',
    colorCheck: 'var(--motor-100)',
    href: '/travel',
    illustration: <TravelIllustration />,
    gridClass: 'col-span-1 row-span-1 min-h-[160px]',
  },
]

export default function ProductBentoGrid() {
  return (
    <section id="products" style={{ backgroundColor: 'var(--page-bg)' }} className="px-5 lg:px-20 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p
          className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2"
          style={{ color: 'var(--green-700)' }}
        >
          Our Plans
        </p>
        <h2
          className="font-display font-extrabold text-4xl tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          The right health cover for every need
        </h2>
      </motion.div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto] gap-3.5">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            whileHover={{ scale: 1.01, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={p.gridClass}
          >
            <Link
              href={p.href}
              className="relative block bg-white border border-[var(--border-default)] rounded-4xl p-7 h-full overflow-visible cursor-pointer"
              style={{ backgroundColor: p.colorBg }}
            >
              <Tag variant={p.tag}>{p.tagLabel}</Tag>

              <h3
                className="font-display font-bold text-2xl mt-3"
                style={{ color: 'var(--text-primary)' }}
              >
                {p.title}
              </h3>
              <p className="font-sans font-medium text-[15px] mt-1" style={{ color: p.color }}>
                {p.valueProp}
              </p>
              {p.sub && (
                <p className="font-sans text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {p.sub}
                </p>
              )}

              {/* Price badge */}
              <div
                className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border"
                style={{ backgroundColor: p.colorBg, borderColor: p.colorCheck }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7 L6 10 L11 4"
                    stroke={p.color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-sans font-medium text-xs" style={{ color: p.color }}>
                  {p.priceLabel}
                </span>
              </div>

              {/* Circle arrow CTA */}
              <div className="absolute bottom-6 left-7">
                <div
                  className="w-11 h-11 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-200 hover:bg-[var(--green-700)] hover:border-[var(--green-700)] group"
                  style={{ borderColor: 'var(--border-medium)' }}
                >
                  <ArrowRight
                    className="w-[18px] h-[18px] group-hover:text-white transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  />
                </div>
              </div>

              {/* Illustration — bleeds out of card */}
              <div className="absolute bottom-0 right-0 pointer-events-none" style={{ overflow: 'visible' }}>
                {p.illustration}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
