'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, ArrowRight, CheckCircle2, Building2 } from 'lucide-react'

const partnerLogos = [
  { name: 'AXA Gulf',      abbr: 'AXA' },
  { name: 'Daman',         abbr: 'DAM' },
  { name: 'ADNIC',         abbr: 'ADN' },
  { name: 'GIG Gulf',      abbr: 'GIG' },
  { name: 'Neuron',        abbr: 'NEU' },
  { name: 'RSA',           abbr: 'RSA' },
  { name: 'Oman Ins.',     abbr: 'OIC' },
]

const certBadges = [
  { label: 'IA Licensed',         icon: Shield },
  { label: 'DHA Compliant',       icon: CheckCircle2 },
  { label: 'HAAD Approved',       icon: CheckCircle2 },
  { label: '14+ Insurer Network', icon: Building2 },
]

export default function TrustBannerSection() {
  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(150deg, var(--navy-950) 0%, var(--navy-800) 60%, #0B3D6B 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03]">
          <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
            <circle cx="200" cy="200" r="180" stroke="white" strokeWidth="1"/>
            <circle cx="200" cy="200" r="140" stroke="white" strokeWidth="0.5"/>
            <circle cx="200" cy="200" r="100" stroke="white" strokeWidth="0.5"/>
          </svg>
        </div>
      </div>

      <div className="relative max-w-[1320px] mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: CTA */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {certBadges.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans font-semibold text-[11px]"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}
                >
                  <Icon className="w-3 h-3" style={{ color: 'var(--teal-400)' }} />
                  {label}
                </span>
              ))}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
              className="font-display font-extrabold text-white mb-4 leading-tight"
              style={{ fontSize: 'clamp(26px, 3.2vw, 38px)' }}
            >
              Ready to get covered?
              <br />
              <span style={{ color: 'var(--teal-400)' }}>It only takes 3 minutes.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-sans text-[15px] mb-8"
              style={{ color: 'var(--navy-200)' }}
            >
              Compare IA-licensed health plans from 14+ UAE insurers. No broker. No hidden fees.
              DHA-compliant certificate issued instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/quote/health"
                className="h-12 px-7 inline-flex items-center gap-2 rounded-xl font-sans font-bold text-[14px] text-white transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, var(--teal-600) 0%, var(--teal-400) 100%)' }}
              >
                Get free quote <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="tel:+97180047867"
                className="h-12 px-7 inline-flex items-center gap-2 rounded-xl font-sans font-bold text-[14px] border transition-all hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.85)' }}
              >
                📞 800-INSURE
              </Link>
            </motion.div>
          </div>

          {/* Right: Insurer logos */}
          <div>
            <p className="font-sans font-semibold text-[11px] uppercase tracking-widest mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Our insurer partners
            </p>
            <div className="grid grid-cols-4 gap-3">
              {partnerLogos.map(({ name, abbr }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <span className="font-display font-extrabold text-[13px] text-white">{abbr}</span>
                  <span className="font-sans text-[9px] text-center leading-snug" style={{ color: 'rgba(255,255,255,0.45)' }}>{name}</span>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.28 }}
                className="aspect-square rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.15)' }}
              >
                <span className="font-sans text-[11px] text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>+7 more</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
