'use client'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    quote: 'Got my DHA-compliant certificate in under 3 minutes. My previous insurer took 3 days for the same thing.',
    name: 'Aisha Al Mansouri',
    role: 'Marketing Manager, Dubai',
    initials: 'AA',
    plan: 'Enhanced Health Plan',
    color: '#0D9488',
    rating: 5,
  },
  {
    quote: 'InsureAE saved me AED 1,200 on my annual health premium compared to renewing directly with my old insurer. Identical coverage.',
    name: 'Priya Nair',
    role: 'Software Engineer, Abu Dhabi',
    initials: 'PN',
    plan: 'Individual Health Plan',
    color: '#1A4F8A',
    rating: 5,
  },
  {
    quote: 'We insure 45 employees through InsureAE. The group dashboard makes adding new joiners effortless.',
    name: 'Khalid Al Rashidi',
    role: 'HR Director, Sharjah',
    initials: 'KA',
    plan: 'Group Health Plan',
    color: '#D4A24B',
    rating: 5,
  },
  {
    quote: 'My hospital bill was settled directly with AXA Gulf. I didn\'t pay a dirham out of pocket. Real claims support.',
    name: 'Maria Santos',
    role: 'Teacher, Dubai',
    initials: 'MS',
    plan: 'Basic DHA Plan',
    color: '#7C3AED',
    rating: 5,
  },
  {
    quote: 'The multilingual support team helped me file my claim in Hindi. The entire process was seamless.',
    name: 'Rajesh Kumar',
    role: 'Accountant, Ajman',
    initials: 'RK',
    plan: 'Enhanced Health Plan',
    color: '#0A7A72',
    rating: 5,
  },
  {
    quote: 'Transparent pricing, clear plan comparisons, and instant policy documents. This is what insurance should be.',
    name: 'Omar Al Farsi',
    role: 'Business Owner, RAK',
    initials: 'OA',
    plan: 'Family Health Plan',
    color: '#B45309',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="max-w-[1320px] mx-auto px-5 lg:px-8">

        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-sans font-semibold text-[12px] mb-4"
            style={{ backgroundColor: 'var(--gold-50)', color: 'var(--gold-700)' }}
          >
            Customer stories
          </div>
          <h2
            className="font-display font-extrabold leading-tight text-[var(--navy-900)] mb-3"
            style={{ fontSize: 'clamp(26px, 3.2vw, 38px)' }}
          >
            Real people. Real savings.
          </h2>
          <p className="font-sans text-[15px] text-[var(--text-muted)] max-w-lg mx-auto">
            Over 75,000 UAE residents trust InsureAE for their health insurance needs.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="break-inside-avoid bg-white rounded-2xl p-5 border border-[var(--border-default)] hover:shadow-md transition-shadow inline-block w-full"
            >
              {/* Rating */}
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: '#FBBF24' }} />
                ))}
              </div>

              {/* Quote icon */}
              <Quote className="w-5 h-5 mb-2 opacity-20" style={{ color: t.color }} />

              {/* Text */}
              <p className="font-sans text-[13.5px] leading-relaxed text-[var(--text-secondary)] mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-[12px] text-white shrink-0"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sans font-semibold text-[13px] text-[var(--text-primary)] truncate">{t.name}</div>
                  <div className="font-sans text-[11px] text-[var(--text-muted)] truncate">{t.role}</div>
                </div>
                <span
                  className="font-sans font-semibold text-[10px] px-2 py-0.5 rounded-full shrink-0"
                  style={{ backgroundColor: `${t.color}15`, color: t.color }}
                >
                  {t.plan}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
