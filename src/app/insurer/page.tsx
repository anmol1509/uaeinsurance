'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, AlertCircle, Users, BarChart2,
  Settings, LogOut, TrendingUp, TrendingDown, Menu, Shield, Download,
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

const POLICIES = [
  { id: 'POL-2026-4821', client: 'Ahmed Al Mansoori', broker: 'Omar Al Rashidi',  plan: 'Pearl',     premium: 1_240, status: 'active',  start: '07-May-26', end: '06-May-27' },
  { id: 'POL-2026-4818', client: 'Fatima Al Zaabi',   broker: 'Omar Al Rashidi',  plan: 'Essential', premium: 620,   status: 'active',  start: '04-May-26', end: '03-May-27' },
  { id: 'POL-2026-4809', client: 'Sara Mohammed',     broker: 'Layla Hassan',     plan: 'Gold',      premium: 1_680, status: 'active',  start: '01-May-26', end: '30-Apr-27' },
  { id: 'POL-2026-4801', client: 'John Thomas',       broker: 'Ravi Sharma',      plan: 'Pearl',     premium: 1_240, status: 'active',  start: '28-Apr-26', end: '27-Apr-27' },
  { id: 'POL-2026-4792', client: 'Nour Al Amin',      broker: 'Layla Hassan',     plan: 'Silk Road', premium: 890,   status: 'lapsed',  start: '15-Apr-26', end: '14-Apr-27' },
  { id: 'POL-2026-4780', client: 'Raj Kumar',         broker: 'Ravi Sharma',      plan: 'Pearl',     premium: 1_050, status: 'renewal', start: '10-Apr-26', end: '09-Apr-27' },
]

const CLAIMS = [
  { id: 'CLM-2026-1021', policy: 'POL-2026-4821', member: 'Ahmed Al Mansoori', type: 'Outpatient',  amount: 450,   status: 'approved', date: '05-May-26', tpa: 'Inayah' },
  { id: 'CLM-2026-1019', policy: 'POL-2026-4809', member: 'Sara Mohammed',     type: 'Inpatient',   amount: 8_200, status: 'pending',  date: '03-May-26', tpa: 'Inayah' },
  { id: 'CLM-2026-1015', policy: 'POL-2026-4818', member: 'Fatima Al Zaabi',   type: 'Pharmacy',    amount: 180,   status: 'approved', date: '01-May-26', tpa: 'Inayah' },
  { id: 'CLM-2026-1012', policy: 'POL-2026-4801', member: 'John Thomas',       type: 'Dental',      amount: 750,   status: 'pending',  date: '29-Apr-26', tpa: 'Inayah' },
  { id: 'CLM-2026-1008', policy: 'POL-2026-4792', member: 'Nour Al Amin',      type: 'Outpatient',  amount: 320,   status: 'rejected', date: '25-Apr-26', tpa: 'Inayah' },
  { id: 'CLM-2026-1001', policy: 'POL-2026-4780', member: 'Raj Kumar',         type: 'Specialist',  amount: 600,   status: 'approved', date: '20-Apr-26', tpa: 'Inayah' },
]

const BROKERS = [
  { name: 'Omar Al Rashidi',  company: 'Al Rashidi Brokers',   license: 'BR-DXB-0247', policies: 142, revenue: 186_000, rate: '8%', status: 'active' },
  { name: 'Layla Hassan',     company: 'Gulf Shield Insurance', license: 'BR-DXB-0189', policies: 98,  revenue: 124_000, rate: '8%', status: 'active' },
  { name: 'Ravi Sharma',      company: 'Emirates Cover Co.',   license: 'BR-DXB-0312', policies: 72,  revenue: 96_000,  rate: '8%', status: 'active' },
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

export default function InsurerDashboard() {
  const [tab, setTab] = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const handleLogout = () => { logout(); router.push('/login') }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F4F7FB' }}>
      <Sidebar tab={tab} setTab={setTab} user={user} onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
                  <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                    <p className="font-sans font-bold text-[14px]" style={{ color: '#0F2D55' }}>Policies Sold via InsureAE ({POLICIES.length})</p>
                    <button className="flex items-center gap-1.5 h-9 px-4 rounded-xl font-sans font-semibold text-[12.5px]" style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>
                      <Download className="w-3.5 h-3.5" /> Export
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead><tr style={{ backgroundColor: '#F8FAFC' }}>
                        {['Policy ID','Client','Broker','Plan','Premium (AED)','Status','Start','End'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-sans font-bold text-[11px] uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                        {POLICIES.map(p => (
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
                  <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                    <p className="font-sans font-bold text-[14px]" style={{ color: '#0F2D55' }}>Claims ({CLAIMS.length})</p>
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full font-sans text-[11px] font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                        <AlertCircle className="w-3 h-3" /> {CLAIMS.filter(c=>c.status==='pending').length} pending
                      </span>
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
                        {CLAIMS.map(c => (
                          <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-4 py-3 font-sans font-semibold text-[12px]" style={{ color: '#0D9488' }}>{c.id}</td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{c.policy}</td>
                            <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{c.member}</td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{c.type}</td>
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
                  <div className="px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
                    <p className="font-sans font-bold text-[14px]" style={{ color: '#0F2D55' }}>Brokers Selling Your Plans</p>
                  </div>
                  <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                    {BROKERS.map(b => (
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
