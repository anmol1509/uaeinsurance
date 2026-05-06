'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

/* Floating background blobs */
function Blobs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full opacity-[0.18]"
        style={{ background: 'radial-gradient(circle, #0D9488 0%, transparent 70%)' }} />
      <div className="absolute top-1/3 -right-24 w-[380px] h-[380px] rounded-full opacity-[0.12]"
        style={{ background: 'radial-gradient(circle, #D4A24B 0%, transparent 70%)' }} />
      <div className="absolute -bottom-20 left-1/4 w-[440px] h-[440px] rounded-full opacity-[0.10]"
        style={{ background: 'radial-gradient(circle, #0F2D55 0%, transparent 70%)' }} />
      {/* Grid overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
}

const TRUST_POINTS = [
  'IA licensed & regulated insurers only',
  'DHA & HAAD compliant certificates',
  'Claims tracked in real-time',
  'Instant digital policy issuance',
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
      setError(result.error ?? 'Invalid email or password.')
    } else {
      router.push('/dashboard')
    }
  }

  const fillDemo = (type: 'customer' | 'admin') => {
    setEmail(type === 'customer' ? 'customer@demo.com' : 'admin@demo.com')
    setPassword('demo1234')
    setError('')
  }

  const inp = "w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white/5 text-white outline-none transition-all placeholder:text-white/30"

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative"
      style={{ background: 'linear-gradient(135deg, #060F1E 0%, #0A1A30 50%, #0B2540 100%)' }}>
      <Blobs />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Logo mark */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#0D9488,#0F7A72)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <div>
            <span className="font-display font-extrabold text-[20px] text-white tracking-tight">InsureAE</span>
            <span className="block font-sans text-[11px]" style={{ color: '#0D9488' }}>UAE&rsquo;s health insurance platform</span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border p-8"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>

          <h1 className="font-display font-extrabold text-[28px] text-white leading-tight mb-1">
            Welcome back
          </h1>
          <p className="font-sans text-[14px] mb-7" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Sign in to manage your policies
          </p>

          {/* Demo autofill */}
          <div className="flex gap-2 mb-6">
            {(['customer', 'admin'] as const).map(type => (
              <button key={type} type="button" onClick={() => fillDemo(type)}
                className="flex-1 py-2 rounded-lg font-sans font-semibold text-[12px] transition-all hover:opacity-80"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.55)' }}>
                Demo {type}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Email address
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="you@example.com"
                className={inp}
                style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#0D9488'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.20)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-sans font-semibold text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Password</label>
                <Link href="/forgot-password" className="font-sans text-[12px] transition-colors hover:text-white" style={{ color: '#0D9488' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  required placeholder="Enter your password"
                  className={`${inp} pr-12`}
                  style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#0D9488'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.20)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="font-sans text-[13px] px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.20)' }}>
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full h-12 rounded-xl font-sans font-bold text-[14px] text-white flex items-center justify-center gap-2 transition-all mt-1 disabled:opacity-60 hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #0D9488 0%, #0A7A72 100%)' }}>
              {isLoading ? (
                <motion.span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <p className="font-sans text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
              No account?{' '}
              <Link href="/register" className="font-semibold transition-colors hover:text-white" style={{ color: '#0D9488' }}>
                Register free
              </Link>
            </p>
            <Link href="/" className="font-sans text-[12px] transition-colors hover:text-white"
              style={{ color: 'rgba(255,255,255,0.25)' }}>
              ← Home
            </Link>
          </div>
        </div>

        {/* Trust points below card */}
        <div className="mt-6 grid grid-cols-2 gap-2.5">
          {TRUST_POINTS.map(pt => (
            <div key={pt} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#0D9488' }} />
              <span className="font-sans text-[11.5px] leading-snug" style={{ color: 'rgba(255,255,255,0.35)' }}>{pt}</span>
            </div>
          ))}
        </div>

        <p className="text-center mt-6 font-sans text-[11px]" style={{ color: 'rgba(255,255,255,0.18)' }}>
          © {new Date().getFullYear()} InsureAE Technologies LLC · IA Lic. No. LIC/INS/2024/0042
        </p>
      </motion.div>
    </div>
  )
}
