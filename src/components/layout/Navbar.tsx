'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Heart, Users, X, Shield, CheckCircle2, Star, UserCheck, PhoneCall } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const plans = [
  { id: 'basic',    name: 'Basic DHA',      href: '/quote/health?plan=basic',    price: 'From AED 750/yr',   badge: 'Mandatory Dubai', color: '#0D9488', bg: '#F0FDFA', icon: Heart    },
  { id: 'enhanced', name: 'Enhanced Plan',  href: '/quote/health?plan=enhanced', price: 'From AED 1,800/yr', badge: 'Most Popular',     color: '#0F2D55', bg: '#EBF2FA', icon: UserCheck},
  { id: 'family',   name: 'Family Plan',    href: '/quote/health?plan=family',   price: 'From AED 4,200/yr', badge: 'HAAD Approved',    color: '#D4A24B', bg: '#FFFBEB', icon: Users   },
  { id: 'vip',      name: 'VIP Platinum',   href: '/quote/health?plan=vip',      price: 'From AED 8,500/yr', badge: 'Worldwide',        color: '#7C3AED', bg: '#F5F3FF', icon: Star    },
]

const navLinks = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Claims',       href: '/claims'         },
  { label: 'Renewals',     href: '/renewals'        },
  { label: 'About',        href: '/about'           },
]

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [plansOpen, setPlansOpen]   = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* ─── Header ─── */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full bg-white transition-all duration-200',
          scrolled ? 'shadow-[0_2px_20px_rgba(11,31,58,0.12)]' : 'border-b border-[var(--border-default)]'
        )}
      >
        {/* Top micro-bar */}
        <div
          className="w-full border-b text-center py-1.5 px-4 text-[11.5px] font-sans font-medium"
          style={{ backgroundColor: 'var(--navy-950)', borderColor: 'rgba(255,255,255,0.06)', color: 'var(--navy-400)' }}
        >
          <span className="hidden sm:inline">IA Licensed · DHA &amp; HAAD Compliant · </span>
          <a href="tel:+97180047867" className="font-bold transition-colors hover:text-white" style={{ color: 'var(--gold-400)' }}>
            📞 800-INSURE (467873)
          </a>
          <span className="hidden sm:inline"> · Mon – Sat 8 AM – 8 PM</span>
        </div>

        {/* Main bar */}
        <div className="max-w-[1320px] mx-auto px-5 lg:px-8 h-[62px] flex items-center gap-6">

          {/* Logo + tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <Logo size={34} />
            <div className="hidden xl:block h-7 w-px" style={{ backgroundColor: 'var(--border-default)' }} />
            <span className="hidden xl:block font-sans text-[11px] font-semibold leading-tight" style={{ color: 'var(--text-muted)', maxWidth: '120px' }}>
              UAE&apos;s health<br />insurance platform
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1">
            {/* Plans mega dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPlansOpen(true)}
              onMouseLeave={() => setPlansOpen(false)}
            >
              <button
                type="button"
                className={cn(
                  'flex items-center gap-1.5 h-9 px-4 rounded-lg font-sans font-semibold text-[13.5px] transition-colors',
                  plansOpen ? 'text-[var(--navy-800)] bg-[var(--navy-50)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]'
                )}
              >
                Health Plans
                <svg className={cn('w-3 h-3 transition-transform', plansOpen && 'rotate-180')} viewBox="0 0 12 8" fill="none">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <AnimatePresence>
                {plansOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.14 }}
                    className="absolute top-full left-0 mt-1.5 w-[520px] bg-white rounded-2xl shadow-2xl border border-[var(--border-default)] overflow-hidden z-50"
                  >
                    <div className="p-2 grid grid-cols-2 gap-1">
                      {plans.map(({ id, name, href, price, badge, color, bg, icon: Icon }) => (
                        <Link key={id} href={href}
                          className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-[var(--surface-raised)] transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                            <Icon className="w-4.5 h-4.5" style={{ color }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="font-sans font-bold text-[13px] text-[var(--text-primary)]">{name}</span>
                              <span className="font-sans font-bold text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${color}18`, color }}>{badge}</span>
                            </div>
                            <span className="font-sans text-[12px] font-medium" style={{ color }}>{price}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--navy-50)' }}>
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" style={{ color: 'var(--teal-600)' }} />
                        <span className="font-sans text-[11.5px] text-[var(--text-subtle)]">All plans IA-licensed &amp; DHA/HAAD compliant</span>
                      </div>
                      <Link href="/quote/health" className="font-sans font-bold text-[12px] hover:underline" style={{ color: 'var(--teal-600)' }}>
                        Compare all →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map(({ label, href }) => (
              <Link key={label} href={href}
                className={cn(
                  'h-9 px-4 flex items-center rounded-lg font-sans font-semibold text-[13.5px] transition-colors',
                  pathname === href
                    ? 'text-[var(--navy-800)] bg-[var(--navy-50)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            <a
              href="tel:+97180047867"
              className="hidden xl:flex items-center gap-1.5 h-9 px-3.5 rounded-lg border font-sans font-semibold text-[13px] transition-all hover:bg-[var(--navy-50)]"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
            >
              <PhoneCall className="w-3.5 h-3.5" style={{ color: 'var(--teal-600)' }} />
              800-INSURE
            </a>
            <Link href="/login"
              className="hidden lg:flex h-9 px-4 items-center border rounded-lg font-sans font-semibold text-[13.5px] transition-all hover:bg-[var(--navy-50)]"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
            >
              Sign In
            </Link>
            <Link href="/quote/health"
              className="h-9 px-5 flex items-center gap-1.5 rounded-lg font-sans font-bold text-[13.5px] text-white transition-all hover:opacity-90 hover:shadow-md hover:-translate-y-px"
              style={{ background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--teal-600) 100%)' }}
            >
              Get a Quote
            </Link>
            <button type="button" onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--surface-raised)] transition-colors"
            >
              <Menu className="w-5 h-5 text-[var(--text-primary)]" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile drawer ─── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.26, ease: [0.32, 0, 0.67, 0] }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-5 flex items-center justify-between border-b border-[var(--border-default)] shrink-0">
                <Logo size={30} />
                <button type="button" onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[var(--surface-raised)] transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <p className="font-sans font-bold text-[10px] uppercase tracking-widest text-[var(--text-subtle)] mb-3">Health Plans</p>
                <div className="space-y-1 mb-5">
                  {plans.map(({ id, name, href, color, bg, icon: Icon, badge }) => (
                    <Link key={id} href={href} onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-raised)] transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div>
                        <span className="font-sans font-bold text-[13.5px] text-[var(--text-primary)] block">{name}</span>
                        <span className="font-sans text-[11px]" style={{ color }}>{badge}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="border-t border-[var(--border-subtle)] pt-4 space-y-0.5 mb-6">
                  {navLinks.map(({ label, href }) => (
                    <Link key={label} href={href} onClick={() => setDrawerOpen(false)}
                      className="block px-3 py-2.5 rounded-lg font-sans text-[14px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>

                <div className="space-y-2.5">
                  <Link href="/login" onClick={() => setDrawerOpen(false)}
                    className="h-12 flex items-center justify-center border border-[var(--border-medium)] rounded-xl font-sans font-semibold text-[14px] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] transition-colors"
                  >Sign In</Link>
                  <Link href="/quote/health" onClick={() => setDrawerOpen(false)}
                    className="h-12 flex items-center justify-center rounded-xl font-sans font-bold text-[14px] text-white"
                    style={{ background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--teal-600) 100%)' }}
                  >Get Free Quote</Link>
                </div>
              </div>

              <div className="p-4 border-t border-[var(--border-default)] shrink-0">
                <div className="p-3 rounded-xl space-y-2" style={{ backgroundColor: 'var(--navy-50)' }}>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" style={{ color: 'var(--teal-600)' }} />
                    <span className="font-sans font-semibold text-[11.5px]" style={{ color: 'var(--navy-800)' }}>IA Licensed &amp; Regulated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--teal-600)' }} />
                    <span className="font-sans font-semibold text-[11.5px]" style={{ color: 'var(--navy-800)' }}>DHA &amp; HAAD Compliant</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
