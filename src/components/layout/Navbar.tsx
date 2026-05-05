'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, ChevronDown, Heart, Users, X, Shield, CheckCircle2, Star, UserCheck } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const products = [
  {
    name: 'Basic DHA Plan',
    href: '/quote/health?plan=basic',
    color: '#0D9488',
    bgColor: '#F0FDFA',
    icon: Heart,
    badge: 'Mandatory in Dubai',
    desc: 'DHA minimum — from AED 750/yr',
  },
  {
    name: 'Enhanced Plan',
    href: '/quote/health?plan=enhanced',
    color: '#0F2D55',
    bgColor: '#EBF2FA',
    icon: UserCheck,
    badge: 'Most Popular',
    desc: 'Configurable benefits — from AED 1,800/yr',
  },
  {
    name: 'Family Plan',
    href: '/quote/health?plan=family',
    color: '#D4A24B',
    bgColor: '#FFFBEB',
    icon: Users,
    badge: 'HAAD Approved',
    desc: 'Spouse + children — from AED 4,200/yr',
  },
  {
    name: 'VIP Platinum',
    href: '/quote/health?plan=vip',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    icon: Star,
    badge: 'Premium',
    desc: 'Worldwide cover — from AED 8,500/yr',
  },
]

const navLinks = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Claims',       href: '/claims'         },
  { label: 'Renewals',     href: '/renewals'        },
  { label: 'Blog',         href: '/blog'            },
]

export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false)
  const [drawerOpen, setDrawerOpen]     = useState(false)
  const [plansOpen, setPlansOpen]       = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* ── Top announcement bar ── */}
      <div
        className="w-full text-center py-2 px-4 text-[12px] font-sans font-medium"
        style={{ backgroundColor: 'var(--navy-900)', color: 'var(--navy-300)' }}
      >
        <span className="hidden sm:inline">
          IA Licensed &amp; Regulated &nbsp;·&nbsp; DHA &amp; HAAD Compliant &nbsp;·&nbsp;
        </span>
        <a
          href="tel:+97180047867"
          className="font-semibold transition-colors hover:text-white"
          style={{ color: 'var(--gold-400)' }}
        >
          📞 800-INSURE (467873)
        </a>
        <span className="hidden sm:inline">
          &nbsp;·&nbsp; Mon – Sat, 8 AM – 8 PM
        </span>
      </div>

      {/* ── Main header ── */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full bg-white transition-shadow duration-200',
          scrolled
            ? 'shadow-[0_2px_20px_rgba(11,31,58,0.12)]'
            : 'border-b border-[var(--border-default)]'
        )}
      >
        <div className="max-w-[1320px] mx-auto px-5 lg:px-8 h-[66px] flex items-center justify-between gap-6">

          {/* Logo */}
          <Logo size={34} />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">

            {/* Plans dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPlansOpen(true)}
              onMouseLeave={() => setPlansOpen(false)}
            >
              <button
                type="button"
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg font-sans font-semibold text-[13.5px] transition-colors',
                  plansOpen
                    ? 'text-[var(--navy-800)] bg-[var(--navy-50)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]'
                )}
              >
                Health Plans
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', plansOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {plansOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.14 }}
                    className="absolute top-full left-0 mt-1 w-[500px] bg-white rounded-2xl shadow-xl border border-[var(--border-default)] p-3 z-50 grid grid-cols-2 gap-1.5"
                  >
                    {products.map(({ name, href, color, bgColor, icon: Icon, badge, desc }) => (
                      <Link
                        key={name}
                        href={href}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--surface-raised)] transition-colors group"
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: bgColor }}
                        >
                          <Icon className="w-4 h-4" style={{ color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                            <span className="font-sans font-bold text-[13px] text-[var(--text-primary)]">{name}</span>
                            <span
                              className="font-sans font-semibold text-[9.5px] px-1.5 py-0.5 rounded-full"
                              style={{ backgroundColor: `${color}18`, color }}
                            >
                              {badge}
                            </span>
                          </div>
                          <span className="font-sans text-[12px] text-[var(--text-muted)]">{desc}</span>
                        </div>
                      </Link>
                    ))}

                    <div className="col-span-2 mt-1 pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between px-1">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" style={{ color: 'var(--teal-600)' }} />
                        <span className="font-sans text-[11.5px] text-[var(--text-subtle)]">IA-licensed · 14+ insurer partners</span>
                      </div>
                      <Link
                        href="/quote/health"
                        className="font-sans font-bold text-[12px] hover:underline"
                        style={{ color: 'var(--teal-600)' }}
                      >
                        Compare all plans →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  'px-4 py-2 rounded-lg font-sans font-semibold text-[13.5px] transition-colors',
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
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="hidden lg:flex h-10 px-5 items-center border border-[var(--border-medium)] rounded-lg font-sans font-semibold text-[13.5px] text-[var(--text-secondary)] hover:border-[var(--navy-400)] hover:bg-[var(--navy-50)] transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/quote/health"
              className="h-10 px-5 flex items-center gap-2 rounded-lg font-sans font-bold text-[13.5px] text-white transition-all hover:opacity-90 hover:shadow-md hover:-translate-y-px"
              style={{ background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--teal-600) 100%)' }}
            >
              Get a Quote
              <span
                className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                Free
              </span>
            </Link>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--surface-raised)] text-[var(--text-primary)] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.26, ease: [0.32, 0, 0.67, 0] }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl flex flex-col overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="p-5 flex items-center justify-between border-b border-[var(--border-default)] shrink-0">
                <Logo size={30} />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[var(--surface-raised)] transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              <div className="flex-1 p-5 overflow-y-auto">
                <p className="font-sans font-bold text-[10px] uppercase tracking-widest text-[var(--text-subtle)] mb-3">
                  Health Plans
                </p>
                <div className="space-y-1 mb-5">
                  {products.map(({ name, href, color, bgColor, icon: Icon, badge }) => (
                    <Link
                      key={name}
                      href={href}
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-raised)] transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bgColor }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div>
                        <span className="font-sans font-semibold text-[13.5px] text-[var(--text-primary)] block">{name}</span>
                        <span className="font-sans text-[11px]" style={{ color }}>{badge}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="border-t border-[var(--border-subtle)] pt-4 space-y-0.5 mb-6">
                  {navLinks.map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setDrawerOpen(false)}
                      className="block px-3 py-2.5 rounded-lg font-sans text-[14px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>

                <div className="space-y-2.5">
                  <Link
                    href="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="h-12 flex items-center justify-center border border-[var(--border-medium)] rounded-xl font-sans font-semibold text-[14px] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/quote/health"
                    onClick={() => setDrawerOpen(false)}
                    className="h-12 flex items-center justify-center rounded-xl font-sans font-bold text-[14px] text-white"
                    style={{ background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--teal-600) 100%)' }}
                  >
                    Get Free Quote
                  </Link>
                </div>
              </div>

              {/* Compliance badge */}
              <div className="p-5 border-t border-[var(--border-default)] shrink-0">
                <div className="p-3.5 rounded-xl space-y-2" style={{ backgroundColor: 'var(--navy-50)' }}>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--teal-600)' }} />
                    <span className="font-sans font-semibold text-[12px]" style={{ color: 'var(--navy-800)' }}>IA Licensed &amp; Regulated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--teal-600)' }} />
                    <span className="font-sans font-semibold text-[12px]" style={{ color: 'var(--navy-800)' }}>DHA &amp; HAAD Compliant</span>
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
