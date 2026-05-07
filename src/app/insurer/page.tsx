'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, AlertCircle, Users,
  Settings, LogOut, TrendingUp, TrendingDown, Menu, Shield, Download, Bell, X, Search,
  Plus, Copy, CheckCircle2, Eye, EyeOff,
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

/* ─── Mock Data ──────────────────────────────────────────── */
const KPI = [
  { label: 'Policies via Platform', value: '312',      sub: '+28 this month',    trend: 'up',  icon: '📋', color: '#0D9488' },
  { label: 'Monthly Premium',       value: 'AED 486K', sub: 'May 2026',          trend: 'up',  icon: '💰', color: '#0F2D55' },
  { label: 'Pending Claims',        value: '18',       sub: '3 escalated',       trend: 'down',icon: '🏥', color: '#EF4444' },
  { label: 'Claims Loss Ratio',     value: '72%',      sub: 'Industry avg 68%',  trend: 'down',icon: '📊', color: '#D4A24B' },
]

const PLANS = [
  { id: 'essential', name: 'Essential',  network: 'Standard',  annualLimit: 'AED 150,000',  premium_lsb: 620,   premium_nlsb: 0,     active: true,  policies: 89  },
  { id: 'silk',      name: 'Silk Road',  network: 'Standard+', annualLimit: 'AED 300,000',  premium_lsb: 890,   premium_nlsb: 1_180, active: true,  policies: 74  },
  { id: 'pearl',     name: 'Pearl',      network: 'Wide UAE',  annualLimit: 'AED 500,000',  premium_lsb: 1_240, premium_nlsb: 1_680, active: true,  policies: 102 },
  { id: 'gold',      name: 'Gold',       network: 'Wide+Int.', annualLimit: 'AED 1,000,000', premium_lsb: 1_680, premium_nlsb: 2_240, active: true,  policies: 47  },
]

const INITIAL_POLICIES = [
  { id: 'POL-2026-4821', client: 'Ahmed Al Mansoori', broker: 'Omar Al Rashidi',  plan: 'Pearl',     premium: 1_240, status: 'active',  start: '07-May-26', end: '06-May-27' },
  { id: 'POL-2026-4818', client: 'Fatima Al Zaabi',   broker: 'Omar Al Rashidi',  plan: 'Essential', premium: 620,   status: 'active',  start: '04-May-26', end: '03-May-27' },
  { id: 'POL-2026-4809', client: 'Sara Mohammed',     broker: 'Layla Hassan',     plan: 'Gold',      premium: 1_680, status: 'active',  start: '01-May-26', end: '30-Apr-27' },
  { id: 'POL-2026-4801', client: 'John Thomas',       broker: 'Ravi Sharma',      plan: 'Pearl',     premium: 1_240, status: 'active',  start: '28-Apr-26', end: '27-Apr-27' },
  { id: 'POL-2026-4792', client: 'Nour Al Amin',      broker: 'Layla Hassan',     plan: 'Silk Road', premium: 890,   status: 'lapsed',  start: '15-Apr-26', end: '14-Apr-27' },
  { id: 'POL-2026-4780', client: 'Raj Kumar',         broker: 'Ravi Sharma',      plan: 'Pearl',     premium: 1_050, status: 'renewal', start: '10-Apr-26', end: '09-Apr-27' },
]
type PolicyRow = typeof INITIAL_POLICIES[0]

const INITIAL_BROKERS = [
  { name: 'Omar Al Rashidi',  company: 'Al Rashidi Brokers',   license: 'BR-DXB-0247', email: 'omar@alrashidi.ae',  policies: 142, revenue: 186_000, rate: '8%', status: 'active' },
  { name: 'Layla Hassan',     company: 'Gulf Shield Insurance', license: 'BR-DXB-0189', email: 'layla@gulfshield.ae', policies: 98,  revenue: 124_000, rate: '8%', status: 'active' },
  { name: 'Ravi Sharma',      company: 'Emirates Cover Co.',   license: 'BR-DXB-0312', email: 'ravi@emiratescover.ae',policies: 72,  revenue: 96_000,  rate: '8%', status: 'active' },
]
type BrokerRow = typeof INITIAL_BROKERS[0]

const CLAIMS = [
  { id: 'CLM-2026-1021', policy: 'POL-2026-4821', member: 'Ahmed Al Mansoori', type: 'Outpatient',  amount: 450,   status: 'approved', date: '05-May-26', tpa: 'Inayah' },
  { id: 'CLM-2026-1019', policy: 'POL-2026-4809', member: 'Sara Mohammed',     type: 'Inpatient',   amount: 8_200, status: 'pending',  date: '03-May-26', tpa: 'Inayah' },
  { id: 'CLM-2026-1015', policy: 'POL-2026-4818', member: 'Fatima Al Zaabi',   type: 'Pharmacy',    amount: 180,   status: 'approved', date: '01-May-26', tpa: 'Inayah' },
  { id: 'CLM-2026-1012', policy: 'POL-2026-4801', member: 'John Thomas',       type: 'Dental',      amount: 750,   status: 'pending',  date: '29-Apr-26', tpa: 'Inayah' },
  { id: 'CLM-2026-1008', policy: 'POL-2026-4792', member: 'Nour Al Amin',      type: 'Outpatient',  amount: 320,   status: 'rejected', date: '25-Apr-26', tpa: 'Inayah' },
  { id: 'CLM-2026-1001', policy: 'POL-2026-4780', member: 'Raj Kumar',         type: 'Specialist',  amount: 600,   status: 'approved', date: '20-Apr-26', tpa: 'Inayah' },
]


type Tab = 'overview' | 'plans' | 'policies' | 'claims' | 'brokers' | 'settings'
const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview',      icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'plans',    label: 'My Plans',      icon: <Shield className="w-4 h-4" /> },
  { id: 'policies', label: 'Policies Sold', icon: <FileText className="w-4 h-4" /> },
  { id: 'claims',   label: 'Claims',        icon: <AlertCircle className="w-4 h-4" /> },
  { id: 'brokers',  label: 'Broker Network',icon: <Users className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings',      icon: <Settings className="w-4 h-4" /> },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    active:  ['#DCFCE7','#166534'], pending: ['#FEF3C7','#92400E'],
    lapsed:  ['#FEE2E2','#991B1B'], renewal: ['#EFF6FF','#1D4ED8'],
    approved:['#DCFCE7','#166534'], rejected:['#FEE2E2','#991B1B'],
  }
  const [bg, text] = map[status] ?? ['#F1F5F9','#475569']
  return <span className="px-2.5 py-0.5 rounded-full font-sans font-semibold text-[11px] capitalize" style={{ backgroundColor: bg, color: text }}>{status}</span>
}

function ClaimTypeBadge({ type }: { type: string }) {
  const map: Record<string, [string, string]> = {
    Inpatient:  ['#EFF6FF','#1D4ED8'],
    Outpatient: ['#F0FDFA','#0A7A72'],
    Pharmacy:   ['#DCFCE7','#166534'],
    Dental:     ['#F5F3FF','#6D28D9'],
    Specialist: ['#FEF3C7','#92400E'],
    Maternity:  ['#FDF2F8','#9D174D'],
  }
  const [bg, text] = map[type] ?? ['#F1F5F9','#475569']
  return <span className="px-2.5 py-0.5 rounded-full font-sans font-semibold text-[11px]" style={{ backgroundColor: bg, color: text }}>{type}</span>
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="h-9 pl-9 pr-4 rounded-xl border font-sans text-[13px] outline-none w-full sm:w-56 transition-all"
        style={{ borderColor: '#E5EAF0', backgroundColor: '#F8FAFC' }}
        onFocus={e => e.currentTarget.style.borderColor = '#0D9488'}
        onBlur={e => e.currentTarget.style.borderColor = '#E5EAF0'} />
    </div>
  )
}

function Sidebar({ tab, setTab, user, onLogout, open, onClose }: {
  tab: Tab; setTab: (t: Tab) => void; user: { name: string; initials: string; company?: string } | null
  onLogout: () => void; open: boolean; onClose: () => void
}) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'linear-gradient(180deg,#05181E 0%,#082A2A 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-5 py-5 border-b flex items-center gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-sans font-bold text-[12px] text-white shrink-0"
            style={{ background: 'linear-gradient(135deg,#0D9488,#0A7A72)' }}>
            {user?.initials}
          </div>
          <div>
            <div className="font-sans font-bold text-[10px] text-white/40 uppercase tracking-widest">Insurer Portal</div>
            <div className="font-display font-extrabold text-[13px] text-white truncate max-w-[130px]">{user?.company ?? 'Daman Health'}</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(n => (
            <button key={n.id} onClick={() => { setTab(n.id); onClose() }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans font-semibold text-[13px] transition-all text-left"
              style={{ backgroundColor: tab === n.id ? 'rgba(13,148,136,0.2)' : 'transparent', color: tab === n.id ? '#2DD4BF' : 'rgba(255,255,255,0.5)' }}>
              <span style={{ color: tab === n.id ? '#2DD4BF' : 'rgba(255,255,255,0.35)' }}>{n.icon}</span>
              {n.label}
              {n.id === 'claims' && <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#EF444422', color: '#FCA5A5' }}>18</span>}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="font-sans font-semibold text-[12px] text-white truncate">{user?.name}</p>
          <button onClick={onLogout} className="flex items-center gap-2 mt-2 font-sans text-[12px] transition-all hover:text-white/60" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

/* ─── Add Policy Modal ───────────────────────────────────── */
const PLAN_OPTIONS = ['Essential', 'Silk Road', 'Pearl', 'Gold', 'Platinum', 'Diamond']
const PREMIUM_MAP: Record<string, number> = { Essential: 620, 'Silk Road': 890, Pearl: 1_240, Gold: 1_680, Platinum: 3_150, Diamond: 4_200 }

function AddPolicyModal({ brokers, onSave, onClose }: {
  brokers: BrokerRow[]
  onSave: (p: PolicyRow) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({ client: '', email: '', eid: '', mobile: '', broker: '', plan: 'Pearl', start: '' })
  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const valid = form.client && form.email && form.broker && form.plan && form.start

  function handleSave() {
    const id = `POL-2026-${4822 + Math.floor(Math.random() * 1000)}`
    const startD = new Date(form.start)
    const endD = new Date(startD); endD.setFullYear(endD.getFullYear() + 1)
    const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'2-digit' }).replace(/ /g, '-')
    onSave({ id, client: form.client, broker: form.broker, plan: form.plan, premium: PREMIUM_MAP[form.plan] ?? 1_240, status: 'active', start: fmt(startD), end: fmt(endD) })
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-x-4 top-8 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxWidth: '520px', margin: '0 auto', maxHeight: 'calc(100vh - 64px)' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E5EAF0' }}>
          <div>
            <h2 className="font-display font-bold text-[18px]" style={{ color: '#0F2D55' }}>Add New Policy</h2>
            <p className="font-sans text-[12px]" style={{ color: '#64748B' }}>Manually issue a policy on behalf of a broker</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F4F7FB]">
            <X className="w-4 h-4 text-[#64748B]" />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {[
            { label: 'Client Full Name *', key: 'client', type: 'text', placeholder: 'e.g. Ahmed Al Mansoori' },
            { label: 'Client Email *', key: 'email', type: 'email', placeholder: 'client@email.com' },
            { label: 'Emirates ID', key: 'eid', type: 'text', placeholder: '784-XXXX-XXXXXXX-X' },
            { label: 'Mobile', key: 'mobile', type: 'tel', placeholder: '+971 50 XXX XXXX' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: '#475569' }}>{label}</label>
              <input type={type} placeholder={placeholder} value={form[key as keyof typeof form]}
                onChange={e => f(key, e.target.value)}
                className="w-full h-10 px-3 rounded-xl border font-sans text-[13px] outline-none transition-all"
                style={{ borderColor: '#E5EAF0' }}
                onFocus={e => e.currentTarget.style.borderColor = '#0D9488'}
                onBlur={e => e.currentTarget.style.borderColor = '#E5EAF0'} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: '#475569' }}>Plan *</label>
              <select value={form.plan} onChange={e => f('plan', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border font-sans text-[13px] outline-none appearance-none"
                style={{ borderColor: '#E5EAF0', backgroundColor: 'white' }}>
                {PLAN_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: '#475569' }}>Broker *</label>
              <select value={form.broker} onChange={e => f('broker', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border font-sans text-[13px] outline-none appearance-none"
                style={{ borderColor: '#E5EAF0', backgroundColor: 'white' }}>
                <option value="">Select broker</option>
                {brokers.map(b => <option key={b.license} value={b.name}>{b.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: '#475569' }}>Policy Start Date *</label>
            <input type="date" value={form.start} onChange={e => f('start', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border font-sans text-[13px] outline-none"
              style={{ borderColor: '#E5EAF0' }} />
          </div>
          <div className="pt-1 rounded-xl p-4" style={{ backgroundColor: '#F0FDFA', border: '1px solid #CCFBF1' }}>
            <p className="font-sans font-semibold text-[12px]" style={{ color: '#0A7A72' }}>Premium estimate</p>
            <p className="font-display font-extrabold text-[22px]" style={{ color: '#0F2D55' }}>
              AED {(PREMIUM_MAP[form.plan] ?? 1240).toLocaleString()} <span className="font-sans font-normal text-[12px] text-[#94A3B8]">/year</span>
            </p>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex gap-3" style={{ borderColor: '#E5EAF0' }}>
          <button type="button" onClick={onClose}
            className="flex-1 h-11 rounded-xl border font-sans font-semibold text-[13.5px] transition-colors hover:bg-[#F4F7FB]"
            style={{ borderColor: '#E5EAF0', color: '#475569' }}>Cancel</button>
          <button type="button" onClick={handleSave} disabled={!valid}
            className="flex-1 h-11 rounded-xl font-sans font-bold text-[13.5px] text-white transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
            Issue Policy
          </button>
        </div>
      </motion.div>
    </>
  )
}

/* ─── Add Broker Modal ───────────────────────────────────── */
function generateBrokerCredentials(name: string) {
  const num = String(Math.floor(Math.random() * 900) + 100)
  const license = `BR-DXB-${num.padStart(4, '0')}`
  const firstWord = name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')
  const password = `${firstWord}@${Math.floor(Math.random() * 9000) + 1000}`
  const email = `${firstWord}.broker@${['gmail.com', 'outlook.com', 'insureae.ae'][Math.floor(Math.random() * 3)]}`
  return { license, password, email }
}

function AddBrokerModal({ onSave, onClose }: { onSave: (b: BrokerRow & { genEmail: string; genPassword: string }) => void; onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'credentials'>('form')
  const [form, setForm] = useState({ name: '', company: '', phone: '', emailOverride: '' })
  const [creds, setCreds] = useState<{ license: string; password: string; email: string } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)
  const valid = form.name && form.company
  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  function handleGenerate() {
    const generated = generateBrokerCredentials(form.name)
    const finalEmail = form.emailOverride || generated.email
    setCreds({ ...generated, email: finalEmail })
    setStep('credentials')
    onSave({ name: form.name, company: form.company, license: generated.license, email: finalEmail, policies: 0, revenue: 0, rate: '8%', status: 'active', genEmail: finalEmail, genPassword: generated.password })
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60" onClick={step === 'form' ? onClose : undefined} />
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-x-4 top-8 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E5EAF0' }}>
          <div>
            <h2 className="font-display font-bold text-[18px]" style={{ color: '#0F2D55' }}>
              {step === 'form' ? 'Add Broker' : '🎉 Broker Registered!'}
            </h2>
            <p className="font-sans text-[12px]" style={{ color: '#64748B' }}>
              {step === 'form' ? 'Register a new broker on your network' : 'Share these login credentials with the broker'}
            </p>
          </div>
          {step === 'form' && (
            <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F4F7FB]">
              <X className="w-4 h-4 text-[#64748B]" />
            </button>
          )}
        </div>

        {step === 'form' ? (
          <>
            <div className="p-6 space-y-4">
              {[
                { label: 'Broker Full Name *', key: 'name', placeholder: 'e.g. Khalid Al Rashidi' },
                { label: 'Company / Brokerage Name *', key: 'company', placeholder: 'e.g. Al Rashidi Insurance Brokers' },
                { label: 'Broker Email (auto-generated if blank)', key: 'emailOverride', placeholder: 'broker@company.ae' },
                { label: 'Mobile Number', key: 'phone', placeholder: '+971 50 XXX XXXX' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: '#475569' }}>{label}</label>
                  <input type="text" placeholder={placeholder} value={form[key as keyof typeof form]}
                    onChange={e => f(key, e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border font-sans text-[13px] outline-none transition-all"
                    style={{ borderColor: '#E5EAF0' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#0D9488'}
                    onBlur={e => e.currentTarget.style.borderColor = '#E5EAF0'} />
                </div>
              ))}
              <div className="rounded-xl p-4" style={{ backgroundColor: '#FEF9EE', border: '1px solid #FDE68A' }}>
                <p className="font-sans text-[12px]" style={{ color: '#92400E' }}>
                  A unique <strong>Broker License ID</strong> and <strong>login password</strong> will be auto-generated. Share these with the broker so they can log into the platform.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3" style={{ borderColor: '#E5EAF0' }}>
              <button type="button" onClick={onClose}
                className="flex-1 h-11 rounded-xl border font-sans font-semibold text-[13.5px]"
                style={{ borderColor: '#E5EAF0', color: '#475569' }}>Cancel</button>
              <button type="button" onClick={handleGenerate} disabled={!valid}
                className="flex-1 h-11 rounded-xl font-sans font-bold text-[13.5px] text-white disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
                Generate Credentials
              </button>
            </div>
          </>
        ) : creds && (
          <>
            <div className="p-6 space-y-3">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg,#0D9488,#0F2D55)' }}>
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <p className="font-sans font-bold text-[14px]" style={{ color: '#0F2D55' }}>{form.name}</p>
                <p className="font-sans text-[12px]" style={{ color: '#64748B' }}>{form.company}</p>
              </div>
              {[
                { label: 'Broker License ID', value: creds.license, key: 'license' },
                { label: 'Login Email', value: creds.email, key: 'email' },
                { label: 'Temporary Password', value: creds.password, key: 'password', secret: true },
              ].map(({ label, value, key, secret }) => (
                <div key={key} className="rounded-xl p-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E5EAF0' }}>
                  <p className="font-sans font-semibold text-[11px] uppercase tracking-wide mb-1" style={{ color: '#94A3B8' }}>{label}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-sans font-bold text-[14px]" style={{ color: '#0F2D55', fontFamily: secret ? 'monospace' : undefined }}>
                      {secret && !showPass ? '•'.repeat(value.length) : value}
                    </span>
                    <div className="flex gap-1.5">
                      {secret && (
                        <button type="button" onClick={() => setShowPass(s => !s)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#E5EAF0]">
                          {showPass ? <EyeOff className="w-3.5 h-3.5 text-[#94A3B8]" /> : <Eye className="w-3.5 h-3.5 text-[#94A3B8]" />}
                        </button>
                      )}
                      <button type="button" onClick={() => copyToClipboard(value, key)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#E5EAF0] transition-colors"
                        title="Copy">
                        {copied === key
                          ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#0D9488' }} />
                          : <Copy className="w-3.5 h-3.5 text-[#94A3B8]" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="rounded-xl p-3" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}>
                <p className="font-sans text-[12px]" style={{ color: '#991B1B' }}>
                  ⚠️ Save these credentials now. The password cannot be recovered after closing this dialog.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t" style={{ borderColor: '#E5EAF0' }}>
              <button type="button" onClick={onClose}
                className="w-full h-11 rounded-xl font-sans font-bold text-[13.5px] text-white"
                style={{ background: 'linear-gradient(135deg,#0D9488,#0F2D55)' }}>
                Done — Broker Added
              </button>
            </div>
          </>
        )}
      </motion.div>
    </>
  )
}

export default function InsurerDashboard() {
  const [tab, setTab] = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchPolicies, setSearchPolicies] = useState('')
  const [searchClaims, setSearchClaims] = useState('')
  const [policies, setPolicies] = useState(INITIAL_POLICIES)
  const [brokers, setBrokers] = useState(INITIAL_BROKERS)
  const [showAddPolicy, setShowAddPolicy] = useState(false)
  const [showAddBroker, setShowAddBroker] = useState(false)
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const handleLogout = () => { logout(); router.push('/login') }

  const filteredPolicies = useMemo(() =>
    policies.filter(p => p.client.toLowerCase().includes(searchPolicies.toLowerCase()) ||
      p.plan.toLowerCase().includes(searchPolicies.toLowerCase()) ||
      p.id.toLowerCase().includes(searchPolicies.toLowerCase())), [policies, searchPolicies])

  const filteredClaims = useMemo(() =>
    CLAIMS.filter(c => c.member.toLowerCase().includes(searchClaims.toLowerCase()) ||
      c.type.toLowerCase().includes(searchClaims.toLowerCase()) ||
      c.id.toLowerCase().includes(searchClaims.toLowerCase())), [searchClaims])

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F4F7FB' }}>
      <Sidebar tab={tab} setTab={setTab} user={user} onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Modals */}
      <AnimatePresence>
        {showAddPolicy && (
          <AddPolicyModal
            brokers={brokers}
            onSave={p => { setPolicies(prev => [p, ...prev]); setTab('policies') }}
            onClose={() => setShowAddPolicy(false)}
          />
        )}
        {showAddBroker && (
          <AddBrokerModal
            onSave={b => setBrokers(prev => [{ name: b.name, company: b.company, license: b.license, email: b.email, policies: 0, revenue: 0, rate: '8%', status: 'active' }, ...prev])}
            onClose={() => setShowAddBroker(false)}
          />
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="h-14 px-5 flex items-center justify-between border-b bg-white shrink-0" style={{ borderColor: '#E5EAF0' }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-[#F4F7FB]" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-[#475569]" />
            </button>
            <h1 className="font-display font-bold text-[16px]" style={{ color: '#0F2D55' }}>
              {NAV.find(n => n.id === tab)?.label}
            </h1>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full font-sans font-semibold text-[11px]"
            style={{ backgroundColor: '#F0FDFA', color: '#0D9488', border: '1px solid #CCFBF1' }}>
            🏥 Insurer Portal · {user?.company}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>

              {tab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {KPI.map(k => (
                      <div key={k.label} className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E5EAF0' }}>
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-2xl">{k.icon}</span>
                          {k.trend === 'up' ? <TrendingUp className="w-4 h-4 text-[#0D9488]" /> : k.trend === 'down' ? <TrendingDown className="w-4 h-4 text-[#EF4444]" /> : null}
                        </div>
                        <div className="font-display font-extrabold text-[22px]" style={{ color: k.color }}>{k.value}</div>
                        <div className="font-sans font-semibold text-[11px] mt-0.5" style={{ color: '#64748B' }}>{k.label}</div>
                        <div className="font-sans text-[11px] mt-1" style={{ color: '#94A3B8' }}>{k.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="bg-white rounded-2xl border" style={{ borderColor: '#E5EAF0' }}>
                      <div className="px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
                        <p className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>Plan Performance</p>
                      </div>
                      <div className="p-5 space-y-4">
                        {PLANS.map(p => (
                          <div key={p.id}>
                            <div className="flex justify-between mb-1">
                              <span className="font-sans font-semibold text-[12.5px]" style={{ color: '#0F2D55' }}>{p.name}</span>
                              <span className="font-sans text-[12px]" style={{ color: '#64748B' }}>{p.policies} policies</span>
                            </div>
                            <div className="h-2 rounded-full" style={{ backgroundColor: '#F1F5F9' }}>
                              <div className="h-2 rounded-full" style={{ width: `${Math.round(p.policies/102*100)}%`, background: 'linear-gradient(90deg,#0D9488,#2DD4BF)' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl border" style={{ borderColor: '#E5EAF0' }}>
                      <div className="px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
                        <p className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>Recent Claims</p>
                      </div>
                      <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                        {CLAIMS.slice(0,5).map(c => (
                          <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                            <div>
                              <p className="font-sans font-semibold text-[12.5px]" style={{ color: '#0F2D55' }}>{c.member}</p>
                              <p className="font-sans text-[11px]" style={{ color: '#94A3B8' }}>{c.id} · {c.type}</p>
                            </div>
                            <div className="text-right">
                              <StatusBadge status={c.status} />
                              <p className="font-sans text-[11px] mt-1" style={{ color: '#94A3B8' }}>AED {c.amount.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'plans' && (
                <div className="space-y-4">
                  {PLANS.map(p => (
                    <div key={p.id} className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E5EAF0' }}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display font-bold text-[18px]" style={{ color: '#0F2D55' }}>{p.name}</h3>
                            <span className="px-2 py-0.5 rounded font-sans text-[11px] font-semibold" style={{ backgroundColor: '#F0FDFA', color: '#0D9488' }}>{p.network}</span>
                            {p.active && <span className="px-2 py-0.5 rounded-full font-sans text-[11px] font-semibold" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>Active</span>}
                          </div>
                          <p className="font-sans text-[13px]" style={{ color: '#64748B' }}>Annual Limit: {p.annualLimit}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-sans text-[11px]" style={{ color: '#94A3B8' }}>Active policies</p>
                          <p className="font-display font-extrabold text-[24px]" style={{ color: '#0D9488' }}>{p.policies}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4" style={{ borderColor: '#F1F5F9' }}>
                        {[
                          ['LSB Premium', p.premium_lsb > 0 ? `AED ${p.premium_lsb.toLocaleString()} / yr` : 'N/A'],
                          ['NLSB Premium', p.premium_nlsb > 0 ? `AED ${p.premium_nlsb.toLocaleString()} / yr` : 'N/A'],
                        ].map(([l, v]) => (
                          <div key={l}>
                            <p className="font-sans text-[11px]" style={{ color: '#94A3B8' }}>{l}</p>
                            <p className="font-sans font-bold text-[14px]" style={{ color: '#0F2D55' }}>{v}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button className="h-8 px-4 rounded-xl font-sans font-semibold text-[12px]" style={{ backgroundColor: '#EBF2FA', color: '#0F2D55' }}>Edit Pricing</button>
                        <button className="h-8 px-4 rounded-xl font-sans font-semibold text-[12px]" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>View TOB</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'policies' && (
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#E5EAF0' }}>
                  <div className="px-5 py-4 border-b flex items-center justify-between gap-3 flex-wrap" style={{ borderColor: '#F1F5F9' }}>
                    <p className="font-sans font-bold text-[14px]" style={{ color: '#0F2D55' }}>Policies Sold via InsureAE ({filteredPolicies.length})</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <SearchInput value={searchPolicies} onChange={setSearchPolicies} placeholder="Search policies…" />
                      <button onClick={() => setShowAddPolicy(true)}
                        className="flex items-center gap-1.5 h-9 px-4 rounded-xl font-sans font-bold text-[12.5px] text-white transition-all hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
                        <Plus className="w-3.5 h-3.5" /> Add Policy
                      </button>
                      <button className="flex items-center gap-1.5 h-9 px-4 rounded-xl font-sans font-semibold text-[12.5px]" style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>
                        <Download className="w-3.5 h-3.5" /> Export
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead><tr style={{ backgroundColor: '#F8FAFC' }}>
                        {['Policy ID','Client','Broker','Plan','Premium (AED)','Status','Start','End'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-sans font-bold text-[11px] uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                        {filteredPolicies.map(p => (
                          <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-4 py-3 font-sans font-semibold text-[12px]" style={{ color: '#0D9488' }}>{p.id}</td>
                            <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{p.client}</td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{p.broker}</td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{p.plan}</td>
                            <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{p.premium.toLocaleString()}</td>
                            <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#94A3B8' }}>{p.start}</td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#94A3B8' }}>{p.end}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === 'claims' && (
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#E5EAF0' }}>
                  <div className="px-5 py-4 border-b flex items-center justify-between gap-3 flex-wrap" style={{ borderColor: '#F1F5F9' }}>
                    <div className="flex items-center gap-3">
                      <p className="font-sans font-bold text-[14px]" style={{ color: '#0F2D55' }}>Claims ({filteredClaims.length})</p>
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full font-sans text-[11px] font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                        <AlertCircle className="w-3 h-3" /> {CLAIMS.filter(c=>c.status==='pending').length} pending
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SearchInput value={searchClaims} onChange={setSearchClaims} placeholder="Search claims…" />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead><tr style={{ backgroundColor: '#F8FAFC' }}>
                        {['Claim ID','Policy','Member','Type','Amount (AED)','TPA','Status','Date'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-sans font-bold text-[11px] uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                        {filteredClaims.map(c => (
                          <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-4 py-3 font-sans font-semibold text-[12px]" style={{ color: '#0D9488' }}>{c.id}</td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{c.policy}</td>
                            <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{c.member}</td>
                            <td className="px-4 py-3"><ClaimTypeBadge type={c.type} /></td>
                            <td className="px-4 py-3 font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>{c.amount.toLocaleString()}</td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{c.tpa}</td>
                            <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#94A3B8' }}>{c.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === 'brokers' && (
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#E5EAF0' }}>
                  <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                    <p className="font-sans font-bold text-[14px]" style={{ color: '#0F2D55' }}>Broker Network ({brokers.length})</p>
                    <button onClick={() => setShowAddBroker(true)}
                      className="flex items-center gap-1.5 h-9 px-4 rounded-xl font-sans font-bold text-[12.5px] text-white transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
                      <Plus className="w-3.5 h-3.5" /> Add Broker
                    </button>
                  </div>
                  <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                    {brokers.map(b => (
                      <div key={b.name} className="px-5 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-sans font-bold text-[12px] text-white shrink-0"
                            style={{ background: 'linear-gradient(135deg,#D4A24B,#B87C1E)' }}>
                            {b.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                          </div>
                          <div>
                            <p className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>{b.name}</p>
                            <p className="font-sans text-[11px]" style={{ color: '#94A3B8' }}>{b.company} · {b.license}</p>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-8">
                          <div className="text-center"><p className="font-display font-bold text-[18px]" style={{ color: '#0D9488' }}>{b.policies}</p><p className="font-sans text-[10px]" style={{ color: '#94A3B8' }}>Policies</p></div>
                          <div className="text-center"><p className="font-display font-bold text-[18px]" style={{ color: '#0F2D55' }}>AED {(b.revenue/1000).toFixed(0)}K</p><p className="font-sans text-[10px]" style={{ color: '#94A3B8' }}>Revenue</p></div>
                          <div className="text-center"><p className="font-display font-bold text-[18px]" style={{ color: '#D4A24B' }}>{b.rate}</p><p className="font-sans text-[10px]" style={{ color: '#94A3B8' }}>Comm. Rate</p></div>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'settings' && (
                <div className="max-w-xl space-y-4">
                  {[
                    { label: 'Company Name', value: user?.company ?? 'Daman Health' },
                    { label: 'IA License', value: user?.licenseNo ?? 'IC-DXB-0012' },
                    { label: 'TPA Partner', value: 'Inayah Health' },
                    { label: 'Broker Commission Rate', value: '8%' },
                    { label: 'Contact Email', value: user?.email ?? '—' },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border p-5 flex items-center justify-between" style={{ borderColor: '#E5EAF0' }}>
                      <div>
                        <p className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>{s.label}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-sans font-semibold text-[13px]" style={{ color: '#0D9488' }}>{s.value}</span>
                        <button className="h-7 px-3 rounded-lg font-sans text-[11px] font-semibold" style={{ backgroundColor: '#EBF2FA', color: '#0F2D55' }}>Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
