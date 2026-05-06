'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Shield, CheckCircle2, Clock } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Logo from '@/components/ui/Logo'

const brandPoints = [
  { icon: Shield,       text: 'IA licensed & regulated insurers only' },
  { icon: CheckCircle2, text: 'DHA & HAAD compliant certificates' },
  { icon: Clock,        text: 'Claims tracked in real-time' },
]

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, user } = useAuthStore()
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (user) router.replace('/dashboard')
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = await login(email, password)
    if (!result.success) {
      setError(result.error ?? 'Login failed. Please check your credentials.')
    } else {
      router.push('/dashboard')
    }
  }

  const fillDemo = (type: 'customer' | 'admin') => {
    setEmail(type === 'customer' ? 'customer@demo.com' : 'admin@demo.com')
    setPassword('demo1234')
    setError('')
  }

  const inputBase = "w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none transition-all"

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--page-bg)' }}>

      {/* ── Left brand panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[400px] xl:w-[460px] shrink-0 p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, var(--navy-950) 0%, var(--navy-800) 60%, #0B3D6B 100%)' }}
      >
        {/* Background circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, var(--teal-400), transparent 70%)' }} />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, var(--gold-400), transparent 70%)' }} />
        </div>

        {/* Logo */}
        <Logo size={36} textColor="white" />

        {/* Copy */}
        <div className="relative">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-sans font-semibold text-[11px] mb-5"
            style={{ backgroundColor: 'rgba(212,162,75,0.2)', color: 'var(--gold-400)' }}
          >
            UAE's #1 health insurance platform
          </div>
          <h2 className="font-display font-extrabold text-white text-[34px] leading-[1.1] tracking-tight mb-4">
            Your insurance,<br />all in one place.
          </h2>
          <p className="font-sans text-[14px] leading-relaxed mb-8" style={{ color: 'var(--navy-200)' }}>
            View policies, track claims, download DHA-compliant certificates, and renew cover — all without a single phone call.
          </p>
          <div className="space-y-3.5">
            {brandPoints.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(13,148,136,0.25)' }}>
                  <Icon className="w-4 h-4" style={{ color: 'var(--teal-400)' }} />
                </div>
                <span className="font-sans text-[13.5px]" style={{ color: 'var(--navy-200)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative font-sans text-[11px]" style={{ color: 'var(--navy-500)' }}>
          © {new Date().getFullYear()} InsureAE Technologies LLC · IA Lic. No. LIC/INS/2024/0042
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Logo size={32} />
          </div>

          <h1 className="font-display font-extrabold text-[28px] tracking-tight mb-1" style={{ color: 'var(--navy-900)' }}>
            Welcome back
          </h1>
          <p className="font-sans text-[14px] mb-7" style={{ color: 'var(--text-muted)' }}>
            Sign in to your InsureAE account
          </p>

          {/* Demo accounts */}
          <div
            className="mb-6 p-3.5 rounded-xl border"
            style={{ backgroundColor: 'var(--navy-50)', borderColor: 'var(--navy-100)' }}
          >
            <p className="font-sans font-semibold text-[11.5px] mb-2.5" style={{ color: 'var(--navy-700)' }}>
              Demo accounts — click to autofill
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemo('customer')}
                className="flex-1 py-2 rounded-lg border font-sans font-semibold text-[12px] transition-all hover:bg-white hover:shadow-sm"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--navy-700)' }}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="flex-1 py-2 rounded-lg border font-sans font-semibold text-[12px] transition-all hover:bg-white hover:shadow-sm"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--navy-700)' }}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Google SSO */}
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
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
            <span className="font-sans text-[12px]" style={{ color: 'var(--text-subtle)' }}>or sign in with email</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className={inputBase}
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal-600)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.12)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-sans font-semibold text-[12px]" style={{ color: 'var(--text-secondary)' }}>Password</label>
                <Link href="/forgot-password" className="font-sans text-[12px] hover:underline" style={{ color: 'var(--teal-600)' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className={`${inputBase} pr-12`}
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal-600)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.12)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-sans text-[13px] px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error)' }}
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-sans font-bold text-[14px] text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60 hover:opacity-90 hover:shadow-lg mt-1"
              style={{ background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--teal-600) 100%)' }}
            >
              {isLoading ? (
                <motion.span
                  className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="font-sans text-[13px] text-center mt-5" style={{ color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: 'var(--teal-600)' }}>
              Create one free
            </Link>
          </p>
          <div className="mt-3 text-center">
            <Link href="/" className="font-sans text-[12px] hover:underline" style={{ color: 'var(--text-subtle)' }}>
              ← Continue without account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
