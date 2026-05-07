'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, FileText, DollarSign, FolderOpen,
  Settings, LogOut, ArrowRight, Menu, Download, RefreshCw,
  Bell, X, Search, MessageCircle, CheckCircle2, AlertCircle,
  TrendingUp,
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/* ─── Mock Data ──────────────────────────────────────────── */
const KPI = [
  { label: 'My Clients',           value: '47',       sub: '+3 this month',         icon: '👥', color: '#D4A24B' },
  { label: 'Active Policies',      value: '38',       sub: '6 due for renewal',     icon: '📋', color: '#0D9488' },
  { label: 'This Month Commission',value: 'AED 12,400',sub: '+AED 2,100 vs April',  icon: '💰', color: '#0F2D55' },
  { label: 'Pending Quotes',       value: '9',        sub: 'Awaiting client reply',  icon: '⏳', color: '#7C3AED' },
]

const CLIENTS = [
  { id: 'C001', name: 'Ahmed Al Mansoori', email: 'ahmed@example.com', mobile: '+971 50 123 4567', policy: 'POL-2026-4821', plan: 'Pearl · Daman',      premium: 1_240, status: 'active',  renewal: '07-May-27' },
  { id: 'C002', name: 'Sara Mohammed',     email: 'sara@example.com',  mobile: '+971 52 987 6543', policy: 'POL-2026-4809', plan: 'Gold · AXA',        premium: 2_240, status: 'active',  renewal: '01-May-27' },
  { id: 'C003', name: 'John Thomas',       email: 'john@example.com',  mobile: '+971 55 456 7890', policy: 'POL-2026-4801', plan: 'Platinum · GIG',    premium: 3_150, status: 'active',  renewal: '28-Apr-27' },
  { id: 'C004', name: 'Fatima Al Zaabi',   email: 'fatima@example.com',mobile: '+971 50 321 9876', policy: 'POL-2026-4818', plan: 'Essential · Daman', premium: 620,   status: 'active',  renewal: '04-May-27' },
  { id: 'C005', name: 'Raj Kumar',         email: 'raj@example.com',   mobile: '+971 56 654 3210', policy: 'POL-2026-4780', plan: 'Pearl · Daman',     premium: 1_050, status: 'renewal', renewal: '10-Apr-27' },
  { id: 'C006', name: 'Nour Al Amin',      email: 'nour@example.com',  mobile: '+971 58 123 6547', policy: 'POL-2026-4792', plan: 'Silk Road · RSA',   premium: 890,   status: 'lapsed',  renewal: '14-Apr-27' },
]

const QUOTES = [
  { id: 'QR20260507-4821', client: 'Ahmed Al Mansoori', plan: 'Pearl · Daman',      premium: 1_240, created: '07-May-26', status: 'converted' },
  { id: 'QR20260505-3819', client: 'Priya Nair',        plan: 'Gold · AXA',         premium: 2_240, created: '05-May-26', status: 'pending' },
  { id: 'QR20260503-2741', client: 'Mark Davies',       plan: 'Silk Road · RSA',    premium: 890,   created: '03-May-26', status: 'pending' },
  { id: 'QR20260501-1920', client: 'Aisha Khalid',      plan: 'Essential · Daman',  premium: 620,   created: '01-May-26', status: 'expired' },
  { id: 'QR20260429-0981', client: 'Sam Williams',      plan: 'Platinum · GIG',     premium: 3_150, created: '29-Apr-26', status: 'converted' },
]

const COMMISSIONS = [
  { id: 'COM001', policy: 'POL-2026-4821', client: 'Ahmed Al Mansoori', insurer: 'Daman',    plan: 'Pearl',     premium: 1_240, rate: '8%',  amount: 99,  status: 'paid',    date: '08-May-26' },
  { id: 'COM002', policy: 'POL-2026-4809', client: 'Sara Mohammed',     insurer: 'AXA Gulf', plan: 'Gold',      premium: 2_240, rate: '8%',  amount: 179, status: 'paid',    date: '07-May-26' },
  { id: 'COM003', policy: 'POL-2026-4801', client: 'John Thomas',       insurer: 'GIG Gulf', plan: 'Platinum',  premium: 3_150, rate: '10%', amount: 315, status: 'pending', date: '06-May-26' },
  { id: 'COM004', policy: 'POL-2026-4818', client: 'Fatima Al Zaabi',   insurer: 'Daman',    plan: 'Essential', premium: 620,   rate: '8%',  amount: 50,  status: 'paid',    date: '05-May-26' },
  { id: 'COM005', policy: 'POL-2026-4780', client: 'Raj Kumar',         insurer: 'Daman',    plan: 'Pearl',     premium: 1_050, rate: '8%',  amount: 84,  status: 'pending', date: '04-May-26' },
]

const DOCS = [
  { name: 'POL-2026-4821 — Certificate',        type: 'PDF', client: 'Ahmed Al Mansoori', date: '07-May-26', size: '245 KB' },
  { name: 'POL-2026-4821 — Table of Benefits',  type: 'PDF', client: 'Ahmed Al Mansoori', date: '07-May-26', size: '128 KB' },
  { name: 'POL-2026-4809 — Certificate',        type: 'PDF', client: 'Sara Mohammed',     date: '01-May-26', size: '241 KB' },
  { name: 'POL-2026-4780 — Renewal Notice',     type: 'PDF', client: 'Raj Kumar',         date: '03-May-26', size: '85 KB'  },
  { name: 'Commission Statement — May 2026',    type: 'XLS', client: 'All Clients',       date: '01-May-26', size: '52 KB'  },
]

const NOTIFICATIONS = [
  { id: 1, type: 'renewal', msg: 'Raj Kumar\'s Pearl policy expires in 7 days', time: '2h ago',    read: false },
  { id: 2, type: 'commission', msg: 'AED 179 commission credited — Sara Mohammed', time: '5h ago',  read: false },
  { id: 3, type: 'quote', msg: 'Priya Nair has not responded to your quote', time: '1d ago',        read: false },
  { id: 4, type: 'policy', msg: 'POL-2026-4821 certificate issued for Ahmed', time: '2d ago',       read: true  },
  { id: 5, type: 'renewal', msg: 'Nour Al Amin\'s policy lapsed — follow up', time: '3d ago',       read: true  },
]

type Tab = 'overview' | 'clients' | 'quotes' | 'commissions' | 'documents' | 'settings'
const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',    label: 'Overview',    icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'clients',     label: 'My Clients',  icon: <Users className="w-4 h-4" /> },
  { id: 'quotes',      label: 'Quotes',      icon: <FileText className="w-4 h-4" /> },
  { id: 'commissions', label: 'Commissions', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'documents',   label: 'Documents',   icon: <FolderOpen className="w-4 h-4" /> },
  { id: 'settings',    label: 'Settings',    icon: <Settings className="w-4 h-4" /> },
]

const NOTIF_COLORS: Record<string, string> = { renewal: '#EFF6FF', commission: '#F0FDFA', quote: '#FEF3C7', policy: '#DCFCE7' }
const NOTIF_TEXT: Record<string, string> = { renewal: '#1D4ED8', commission: '#0A7A72', quote: '#92400E', policy: '#166534' }

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    active:   ['#DCFCE7','#166534'], pending:  ['#FEF3C7','#92400E'],
    lapsed:   ['#FEE2E2','#991B1B'], renewal:  ['#EFF6FF','#1D4ED8'],
    paid:     ['#DCFCE7','#166534'], expired:  ['#FEE2E2','#991B1B'],
    converted:['#F0FDFA','#0A7A72'],
  }
  const [bg, text] = map[status] ?? ['#F1F5F9','#475569']
  return <span className="px-2.5 py-0.5 rounded-full font-sans font-semibold text-[11px] capitalize" style={{ backgroundColor: bg, color: text }}>{status}</span>
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

function NotificationBell({ notifications, onClear }: { notifications: typeof NOTIFICATIONS; onClear: (id: number) => void }) {
  const [open, setOpen] = useState(false)
  const unread = notifications.filter(n => !n.read).length
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-[#F4F7FB]"
        style={{ border: '1px solid #E5EAF0' }}>
        <Bell className="w-4 h-4 text-[#475569]" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white font-sans font-bold text-[9px] flex items-center justify-center"
            style={{ backgroundColor: '#EF4444' }}>{unread}</span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}
              className="absolute right-0 top-11 z-50 w-80 bg-white rounded-2xl border shadow-xl overflow-hidden"
              style={{ borderColor: '#E5EAF0' }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                <p className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>Notifications</p>
                {unread > 0 && <span className="font-sans text-[11px] font-semibold" style={{ color: '#0D9488' }}>{unread} unread</span>}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y" style={{ borderColor: '#F1F5F9' }}>
                {notifications.map(n => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[#F8FAFC]"
                    style={{ backgroundColor: n.read ? 'white' : '#FAFEFF' }}>
                    <div className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ backgroundColor: n.read ? '#E5EAF0' : '#0D9488' }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-[12.5px]" style={{ color: '#0F2D55', fontWeight: n.read ? 400 : 600 }}>{n.msg}</p>
                      <p className="font-sans text-[11px] mt-0.5" style={{ color: '#94A3B8' }}>{n.time}</p>
                    </div>
                    <button type="button" onClick={() => onClear(n.id)} className="shrink-0 text-[#CBD5E1] hover:text-[#94A3B8] mt-0.5">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function Sidebar({ tab, setTab, user, onLogout, open, onClose }: {
  tab: Tab; setTab: (t: Tab) => void
  user: { name: string; initials: string; company?: string; licenseNo?: string } | null
  onLogout: () => void; open: boolean; onClose: () => void
}) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'linear-gradient(180deg,#1A0F00 0%,#2A1800 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-5 py-5 border-b flex items-center gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-bold text-[12px] text-white shrink-0"
            style={{ background: 'linear-gradient(135deg,#D4A24B,#B87C1E)' }}>
            {user?.initials}
          </div>
          <div>
            <div className="font-sans font-bold text-[10px] text-white/40 uppercase tracking-widest">Broker Portal</div>
            <div className="font-display font-extrabold text-[13px] text-white truncate max-w-[130px]">{user?.name?.split(' ')[0]}</div>
          </div>
        </div>

        <div className="px-4 pt-4 pb-2">
          <Link href="/quote/health" onClick={onClose}
            className="flex items-center justify-center gap-2 h-10 rounded-xl font-sans font-bold text-[13px] text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#D4A24B,#B87C1E)' }}>
            + New Quote <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {NAV.map(n => (
            <button key={n.id} onClick={() => { setTab(n.id); onClose() }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans font-semibold text-[13px] transition-all text-left"
              style={{ backgroundColor: tab === n.id ? 'rgba(212,162,75,0.15)' : 'transparent', color: tab === n.id ? '#F5C76E' : 'rgba(255,255,255,0.5)' }}>
              <span style={{ color: tab === n.id ? '#F5C76E' : 'rgba(255,255,255,0.35)' }}>{n.icon}</span>
              {n.label}
              {n.id === 'quotes' && (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(212,162,75,0.2)', color: '#F5C76E' }}>9</span>
              )}
            </button>
          ))}
        </nav>

        {/* WhatsApp support */}
        <div className="px-4 py-3 mx-3 mb-3 rounded-xl" style={{ backgroundColor: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.2)' }}>
          <p className="font-sans font-bold text-[11px] text-white/70 mb-1">Need help?</p>
          <a href="https://wa.me/97180047867" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 font-sans font-semibold text-[12px] transition-all hover:opacity-80"
            style={{ color: '#25D366' }}>
            <MessageCircle className="w-3.5 h-3.5" /> Chat with us
          </a>
        </div>

        <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="font-sans font-semibold text-[12px] text-white">{user?.name}</p>
          <p className="font-sans text-[10px] mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{user?.licenseNo} · Broker</p>
          <button onClick={onLogout} className="flex items-center gap-2 font-sans text-[12px] transition-all hover:text-white/60" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

function EmptyState({ icon, title, sub, cta, href }: { icon: string; title: string; sub: string; cta: string; href: string }) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: '#E5EAF0' }}>
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display font-bold text-[18px] mb-2" style={{ color: '#0F2D55' }}>{title}</h3>
      <p className="font-sans text-[14px] mb-6 max-w-sm mx-auto" style={{ color: '#64748B' }}>{sub}</p>
      <Link href={href}
        className="inline-flex items-center gap-2 h-11 px-6 rounded-xl font-sans font-bold text-[13.5px] text-white"
        style={{ background: 'linear-gradient(135deg,#D4A24B,#B87C1E)' }}>
        {cta} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

export default function BrokerDashboard() {
  const [tab, setTab] = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchClients, setSearchClients] = useState('')
  const [searchQuotes, setSearchQuotes] = useState('')
  const [searchCommissions, setSearchCommissions] = useState('')
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [dismissedOnboarding, setDismissedOnboarding] = useState(false)
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const handleLogout = () => { logout(); router.push('/login') }

  const clearNotification = (id: number) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const filteredClients = useMemo(() =>
    CLIENTS.filter(c => c.name.toLowerCase().includes(searchClients.toLowerCase()) ||
      c.plan.toLowerCase().includes(searchClients.toLowerCase())), [searchClients])

  const filteredQuotes = useMemo(() =>
    QUOTES.filter(q => q.client.toLowerCase().includes(searchQuotes.toLowerCase()) ||
      q.plan.toLowerCase().includes(searchQuotes.toLowerCase())), [searchQuotes])

  const filteredCommissions = useMemo(() =>
    COMMISSIONS.filter(c => c.client.toLowerCase().includes(searchCommissions.toLowerCase()) ||
      c.insurer.toLowerCase().includes(searchCommissions.toLowerCase())), [searchCommissions])

  const showOnboarding = !dismissedOnboarding && CLIENTS.length === 0

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F4F7FB' }}>
      <Sidebar tab={tab} setTab={setTab} user={user} onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <div className="h-14 px-5 flex items-center justify-between border-b bg-white shrink-0" style={{ borderColor: '#E5EAF0' }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-[#F4F7FB]" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-[#475569]" />
            </button>
            <h1 className="font-display font-bold text-[16px]" style={{ color: '#0F2D55' }}>
              {NAV.find(n => n.id === tab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell notifications={notifications} onClear={clearNotification} />
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full font-sans font-semibold text-[11px]"
              style={{ backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}>
              🤝 {user?.company ?? 'Broker Portal'}
            </span>
            <Link href="/quote/health"
              className="flex items-center gap-1.5 h-8 px-4 rounded-xl font-sans font-bold text-[12px] text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#D4A24B,#B87C1E)' }}>
              + New Quote
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>

              {/* ── OVERVIEW ── */}
              {tab === 'overview' && (
                <div className="space-y-6">
                  {/* Onboarding banner */}
                  {showOnboarding && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="relative rounded-2xl p-5 pr-12" style={{ background: 'linear-gradient(135deg,#1A0F00,#2A1800)', border: '1px solid rgba(212,162,75,0.3)' }}>
                      <button type="button" onClick={() => setDismissedOnboarding(true)}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <X className="w-3.5 h-3.5 text-white/60" />
                      </button>
                      <p className="font-display font-bold text-[16px] text-white mb-1">Welcome to InsureAE Broker Portal</p>
                      <p className="font-sans text-[13px] mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>Generate your first quote and start building your client portfolio.</p>
                      <div className="flex gap-2">
                        {[['Generate a Quote', '/quote/health'], ['View Plans', '/quote/health']].map(([l, h]) => (
                          <Link key={l} href={h} className="flex items-center gap-1.5 h-9 px-4 rounded-xl font-sans font-bold text-[12.5px] text-white"
                            style={{ background: 'linear-gradient(135deg,#D4A24B,#B87C1E)' }}>{l}</Link>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {KPI.map(k => (
                      <div key={k.label} className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E5EAF0' }}>
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-2xl">{k.icon}</span>
                          <TrendingUp className="w-3.5 h-3.5" style={{ color: '#0D9488' }} />
                        </div>
                        <div className="font-display font-extrabold text-[22px]" style={{ color: k.color }}>{k.value}</div>
                        <div className="font-sans font-semibold text-[11px] mt-0.5" style={{ color: '#64748B' }}>{k.label}</div>
                        <div className="font-sans text-[11px] mt-1" style={{ color: '#94A3B8' }}>{k.sub}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Renewal alerts */}
                    <div className="bg-white rounded-2xl border" style={{ borderColor: '#E5EAF0' }}>
                      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                        <p className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>Upcoming Renewals</p>
                        <span className="px-2 py-0.5 rounded-full font-sans text-[11px] font-semibold" style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>6 upcoming</span>
                      </div>
                      <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                        {CLIENTS.filter(c => c.status === 'renewal' || c.status === 'lapsed').concat(CLIENTS.filter(c => c.status === 'active').slice(0, 3)).map(c => (
                          <div key={c.id} className="px-5 py-3 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-sans font-semibold text-[13px] truncate" style={{ color: '#0F2D55' }}>{c.name}</p>
                              <p className="font-sans text-[11px]" style={{ color: '#94A3B8' }}>{c.plan} · {c.renewal}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <StatusBadge status={c.status} />
                              <button className="flex items-center gap-1.5 h-7 px-3 rounded-lg font-sans font-semibold text-[11px]"
                                style={{ backgroundColor: '#F0FDFA', color: '#0D9488' }}>
                                <RefreshCw className="w-3 h-3" /> Renew
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Commission strip + mini chart */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Paid',    value: 'AED 328',    color: '#0D9488' },
                          { label: 'Pending', value: 'AED 399',    color: '#D4A24B' },
                          { label: 'YTD',     value: 'AED 24,800', color: '#0F2D55' },
                        ].map(s => (
                          <div key={s.label} className="bg-white rounded-2xl border p-4" style={{ borderColor: '#E5EAF0' }}>
                            <div className="font-display font-extrabold text-[18px]" style={{ color: s.color }}>{s.value}</div>
                            <div className="font-sans text-[11px] mt-0.5" style={{ color: '#64748B' }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                      {/* Monthly commission bars */}
                      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E5EAF0' }}>
                        <p className="font-sans font-bold text-[12px] mb-4" style={{ color: '#0F2D55' }}>Monthly Commissions</p>
                        <div className="flex items-end gap-2 h-20">
                          {[['Jan',4200],['Feb',5100],['Mar',6800],['Apr',8200],['May',12400]].map(([m,v]) => {
                            const pct = Math.round((v as number) / 12400 * 100)
                            return (
                              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full rounded-t-md transition-all" style={{ height: `${pct}%`, background: m === 'May' ? 'linear-gradient(180deg,#D4A24B,#B87C1E)' : '#E5EAF0' }} />
                                <span className="font-sans text-[9px]" style={{ color: m === 'May' ? '#D4A24B' : '#94A3B8', fontWeight: m === 'May' ? 700 : 400 }}>{m}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── CLIENTS ── */}
              {tab === 'clients' && (
                <div>
                  <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                    <SearchInput value={searchClients} onChange={setSearchClients} placeholder="Search clients…" />
                    <Link href="/quote/health"
                      className="flex items-center gap-1.5 h-9 px-4 rounded-xl font-sans font-bold text-[12.5px] text-white"
                      style={{ background: 'linear-gradient(135deg,#D4A24B,#B87C1E)' }}>
                      + Add Client
                    </Link>
                  </div>
                  {filteredClients.length === 0 ? (
                    <EmptyState icon="👥" title="No clients found" sub="Try a different search or add a new client by generating a quote." cta="Generate Quote" href="/quote/health" />
                  ) : (
                    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#E5EAF0' }}>
                      <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                        {filteredClients.map(c => (
                          <div key={c.id} className="px-5 py-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-sans font-bold text-[12px] text-white shrink-0"
                              style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
                              {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>{c.name}</p>
                              <p className="font-sans text-[11px]" style={{ color: '#94A3B8' }}>{c.email} · {c.mobile}</p>
                            </div>
                            <div className="hidden sm:block text-center">
                              <p className="font-sans font-semibold text-[12px]" style={{ color: '#0F2D55' }}>{c.plan}</p>
                              <p className="font-sans text-[11px]" style={{ color: '#94A3B8' }}>AED {c.premium.toLocaleString()} / yr</p>
                            </div>
                            <div className="hidden sm:block text-center">
                              <p className="font-sans text-[11px]" style={{ color: '#94A3B8' }}>Renewal</p>
                              <p className="font-sans font-semibold text-[12px]" style={{ color: '#0F2D55' }}>{c.renewal}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <StatusBadge status={c.status} />
                              {c.status === 'renewal' && (
                                <button className="h-7 px-3 rounded-lg font-sans font-semibold text-[11px]" style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>Renew</button>
                              )}
                              <a href={`https://wa.me/${c.mobile.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                                className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80" style={{ backgroundColor: '#DCFCE7' }}>
                                <MessageCircle className="w-3.5 h-3.5" style={{ color: '#166534' }} />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── QUOTES ── */}
              {tab === 'quotes' && (
                <div>
                  <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                    <SearchInput value={searchQuotes} onChange={setSearchQuotes} placeholder="Search quotes…" />
                    <Link href="/quote/health"
                      className="flex items-center gap-1.5 h-9 px-4 rounded-xl font-sans font-bold text-[12.5px] text-white"
                      style={{ background: 'linear-gradient(135deg,#D4A24B,#B87C1E)' }}>
                      + New Quote
                    </Link>
                  </div>
                  {filteredQuotes.length === 0 ? (
                    <EmptyState icon="📄" title="No quotes found" sub="No quotes match your search. Try different keywords or generate a new quote." cta="New Quote" href="/quote/health" />
                  ) : (
                    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#E5EAF0' }}>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead><tr style={{ backgroundColor: '#F8FAFC' }}>
                            {['Quote ID', 'Client', 'Plan', 'Premium', 'Created', 'Status', 'Action'].map(h => (
                              <th key={h} className="px-4 py-3 text-left font-sans font-bold text-[11px] uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>
                            ))}
                          </tr></thead>
                          <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                            {filteredQuotes.map(q => (
                              <tr key={q.id} className="hover:bg-[#F8FAFC] transition-colors">
                                <td className="px-4 py-3 font-sans font-semibold text-[12px]" style={{ color: '#0D9488' }}>{q.id}</td>
                                <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{q.client}</td>
                                <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{q.plan}</td>
                                <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>AED {q.premium.toLocaleString()}</td>
                                <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#94A3B8' }}>{q.created}</td>
                                <td className="px-4 py-3"><StatusBadge status={q.status} /></td>
                                <td className="px-4 py-3">
                                  {q.status === 'pending' ? (
                                    <div className="flex gap-1.5">
                                      <button className="h-7 px-3 rounded-lg font-sans font-semibold text-[11px]" style={{ backgroundColor: '#F0FDFA', color: '#0D9488' }}>Send Reminder</button>
                                      <a href={`https://wa.me/?text=${encodeURIComponent(`Your InsureAE quote is ready! ${q.plan} — AED ${q.premium.toLocaleString()}/yr. Ref: ${q.id}`)}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="h-7 px-3 rounded-lg font-sans font-semibold text-[11px] flex items-center gap-1.5"
                                        style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                                        <MessageCircle className="w-3 h-3" /> WhatsApp
                                      </a>
                                    </div>
                                  ) : q.status === 'expired' ? (
                                    <Link href="/quote/health" className="h-7 px-3 rounded-lg font-sans font-semibold text-[11px] inline-flex items-center" style={{ backgroundColor: '#EBF2FA', color: '#0F2D55' }}>Re-quote</Link>
                                  ) : (
                                    <div className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#0D9488' }} /><span className="font-sans text-[11px]" style={{ color: '#0D9488' }}>Converted</span></div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── COMMISSIONS ── */}
              {tab === 'commissions' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    {[{ l: 'Paid', v: 'AED 328', c: '#0D9488' }, { l: 'Pending', v: 'AED 399', c: '#D4A24B' }, { l: 'YTD', v: 'AED 24,800', c: '#0F2D55' }].map(s => (
                      <div key={s.l} className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E5EAF0' }}>
                        <div className="font-display font-extrabold text-[22px]" style={{ color: s.c }}>{s.v}</div>
                        <div className="font-sans font-semibold text-[12px] mt-1" style={{ color: '#64748B' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <SearchInput value={searchCommissions} onChange={setSearchCommissions} placeholder="Search commissions…" />
                  </div>
                  <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#E5EAF0' }}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead><tr style={{ backgroundColor: '#F8FAFC' }}>
                          {['ID', 'Policy', 'Client', 'Insurer', 'Plan', 'Premium', 'Rate', 'Amount', 'Status', 'Date'].map(h => (
                            <th key={h} className="px-4 py-3 text-left font-sans font-bold text-[11px] uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>
                          ))}
                        </tr></thead>
                        <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                          {filteredCommissions.map(c => (
                            <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                              <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#94A3B8' }}>{c.id}</td>
                              <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#0D9488' }}>{c.policy}</td>
                              <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{c.client}</td>
                              <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{c.insurer}</td>
                              <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{c.plan}</td>
                              <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>AED {c.premium.toLocaleString()}</td>
                              <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{c.rate}</td>
                              <td className="px-4 py-3 font-sans font-bold text-[13px]" style={{ color: '#0D9488' }}>AED {c.amount}</td>
                              <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                              <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#94A3B8' }}>{c.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── DOCUMENTS ── */}
              {tab === 'documents' && (
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#E5EAF0' }}>
                  <div className="px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
                    <p className="font-sans font-bold text-[14px]" style={{ color: '#0F2D55' }}>Documents ({DOCS.length})</p>
                  </div>
                  <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                    {DOCS.map(d => (
                      <div key={d.name} className="px-5 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-sans font-bold text-[10px] shrink-0"
                            style={{ backgroundColor: d.type === 'PDF' ? '#FEE2E2' : '#DCFCE7', color: d.type === 'PDF' ? '#991B1B' : '#166534' }}>
                            {d.type}
                          </div>
                          <div>
                            <p className="font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{d.name}</p>
                            <p className="font-sans text-[11px]" style={{ color: '#94A3B8' }}>{d.client} · {d.date} · {d.size}</p>
                          </div>
                        </div>
                        <button className="flex items-center gap-1.5 h-8 px-3 rounded-xl font-sans font-semibold text-[12px] transition-colors hover:bg-[#F4F7FB]"
                          style={{ borderColor: '#E5EAF0', border: '1px solid', color: '#475569' }}>
                          <Download className="w-3.5 h-3.5" /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SETTINGS ── */}
              {tab === 'settings' && (
                <div className="max-w-xl space-y-4">
                  {[
                    { label: 'Full Name', value: user?.name ?? '—' },
                    { label: 'Broker License', value: user?.licenseNo ?? 'BR-DXB-0247' },
                    { label: 'Company', value: user?.company ?? '—' },
                    { label: 'Email', value: user?.email ?? '—' },
                    { label: 'Commission Rate', value: '8% (standard)' },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border p-5 flex items-center justify-between" style={{ borderColor: '#E5EAF0' }}>
                      <p className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>{s.label}</p>
                      <div className="flex items-center gap-3">
                        <span className="font-sans font-semibold text-[13px]" style={{ color: '#D4A24B' }}>{s.value}</span>
                        <button className="h-7 px-3 rounded-lg font-sans text-[11px] font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>Edit</button>
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
