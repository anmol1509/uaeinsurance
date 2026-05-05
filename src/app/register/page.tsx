'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Logo from '@/components/ui/Logo'

const perks = [
  'Compare plans from 14+ licensed insurers',
  'Digital DHA-compliant certificate on payment',
  'Track claims &amp; renewals in real-time',
  'Free — no broker mark-up or hidden fees',
]

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, user } = useAuthStore()
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [agreed, setAgreed]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (user) router.replace('/dashboard')
  }, [user, router])

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const pwLabels = ['', 'Weak', 'Good', 'Strong']
  const pwColors = ['', 'var(--error)', 'var(--warning)', 'var(--success)']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) { setError('Please accept the terms to continue.'); return }
    setError('')
    const result = await register(name, email, phone, password)
    if (!result.success) {
      setError(result.error ?? 'Registration failed.')
    } else {
      router.push('/dashboard')
    }
  }

  const inputBase = "w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none transition-all"
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'var(--teal-600)'
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.12)'
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'var(--border-medium)'
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--page-bg)' }}>

      {/* ── Left brand panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[400px] xl:w-[460px] shrink-0 p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, var(--navy-950) 0%, var(--navy-800) 60%, #0B3D6B 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, var(--teal-400), transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-52 h-52 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, var(--gold-400), transparent 70%)' }} />
        </div>

        <Logo size={36} textColor="white" />

        <div className="relative">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-sans font-semibold text-[11px] mb-5"
            style={{ backgroundColor: 'rgba(212,162,75,0.2)', color: 'var(--gold-400)' }}
          >
            Free account · No credit card needed
          </div>
          <h2 className="font-display font-extrabold text-white text-[34px] leading-[1.1] tracking-tight mb-4">
            Get covered in<br />under 3 minutes.
          </h2>
          <p className="font-sans text-[14px] leading-relaxed mb-8" style={{ color: 'var(--navy-200)' }}>
            Create your free InsureAE account to save quotes, manage policies, and file claims instantly.
          </p>
          <div className="space-y-3">
            {perks.map((text) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(13,148,136,0.25)' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--teal-400)' }} />
                </div>
                <span
                  className="font-sans text-[13.5px]"
                  style={{ color: 'var(--navy-200)' }}
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              </div>
            ))}
          </div>
        </div>

        <p className="relative font-sans text-[11px]" style={{ color: 'var(--navy-500)' }}>
          © {new Date().getFullYear()} InsureAE Technologies LLC
        </p>
      </div>

      {/* ── Right form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[400px]"
        >
          <div className="lg:hidden mb-8"><Logo size={32} /></div>

          <h1 className="font-display font-extrabold text-[28px] tracking-tight mb-1" style={{ color: 'var(--navy-900)' }}>
            Create your account
          </h1>
          <p className="font-sans text-[14px] mb-6" style={{ color: 'var(--text-muted)' }}>
            Free forever · No commitment required
          </p>

          {/* Google */}
          <button
            type="button"
            className="w-full h-12 rounded-xl border font-sans font-medium text-[14px] flex items-center justify-center gap-3 mb-4 hover:bg-[var(--surface-raised)] transition-colors"
            style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
            <span className="font-sans text-[12px]" style={{ color: 'var(--text-subtle)' }}>or with email</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Full name */}
            <div>
              <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)} required
                placeholder="Ahmed Al Mansoori"
                className={inputBase}
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                onFocus={onFocus} onBlur={onBlur}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                className={inputBase}
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                onFocus={onFocus} onBlur={onBlur}
              />
            </div>

            {/* UAE phone */}
            <div>
              <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>UAE mobile number</label>
              <div className="relative flex items-center">
                <div
                  className="absolute left-0 h-full flex items-center px-3.5 border-r font-sans font-semibold text-[13px] pointer-events-none rounded-l-xl"
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-raised)' }}
                >
                  🇦🇪 +971
                </div>
                <input
                  type="tel" value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  required placeholder="50 123 4567"
                  className={`${inputBase} pl-24`}
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                  onFocus={onFocus} onBlur={onBlur}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} required
                  placeholder="At least 8 characters"
                  className={`${inputBase} pr-12`}
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                  onFocus={onFocus} onBlur={onBlur}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all"
                        style={{ backgroundColor: pwStrength >= i ? pwColors[pwStrength] : 'var(--border-subtle)' }} />
                    ))}
                  </div>
                  <span className="font-sans text-[11px] font-semibold" style={{ color: pwColors[pwStrength] }}>
                    {pwLabels[pwStrength]}
                  </span>
                </div>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer mt-1">
              <input
                type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded shrink-0 accent-teal-600"
              />
              <span className="font-sans text-[12px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                I agree to InsureAE&apos;s{' '}
                <Link href="/terms" className="underline" style={{ color: 'var(--teal-600)' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="underline" style={{ color: 'var(--teal-600)' }}>Privacy Policy</Link>.
                My data is processed in compliance with UAE data protection regulations.
              </span>
            </label>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-sans text-[13px] px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error)' }}
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit" disabled={isLoading}
              className="w-full h-12 rounded-xl font-sans font-bold text-[14px] text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60 hover:opacity-90 hover:shadow-lg mt-1"
              style={{ background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--teal-600) 100%)' }}
            >
              {isLoading
                ? <motion.span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                : <>Create account <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <p className="font-sans text-[13px] text-center mt-5" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--teal-600)' }}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
