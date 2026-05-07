'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Building2, Users, FileText, DollarSign,
  Settings, LogOut, ChevronDown, TrendingUp, AlertCircle,
  CheckCircle2, Clock, MoreHorizontal, Shield, Menu, X,
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

/* ─── Mock Data ──────────────────────────────────────────── */
const KPI = [
  { label: 'Total GWP',         value: 'AED 4.82M', sub: '+18% vs last month', trend: 'up',  icon: '💰', color: '#0D9488' },
  { label: 'Active Policies',   value: '1,247',     sub: '+43 this month',     trend: 'up',  icon: '📋', color: '#0F2D55' },
  { label: 'Registered Brokers',value: '34',        sub: '7 pending approval', trend: 'neu', icon: '🤝', color: '#D4A24B' },
  { label: 'Listed Insurers',   value: '9',         sub: '1 pending review',   trend: 'neu', icon: '🏥', color: '#7C3AED' },
]

const INSURERS = [
  { id: 'INS001', name: 'Daman Health', license: 'IC-DXB-0012', status: 'active',  plans: 6, policies: 312, gwp: 486_000, claims: 18, ratio: '72%' },
  { id: 'INS002', name: 'AXA Gulf',     license: 'IC-DXB-0024', status: 'active',  plans: 5, policies: 198, gwp: 342_000, claims: 11, ratio: '68%' },
  { id: 'INS003', name: 'GIG Gulf',     license: 'IC-DXB-0031', status: 'active',  plans: 4, policies: 156, gwp: 289_000, claims: 9,  ratio: '74%' },
  { id: 'INS004', name: 'ADNIC',        license: 'IC-AUH-0007', status: 'active',  plans: 3, policies: 89,  gwp: 142_000, claims: 6,  ratio: '71%' },
  { id: 'INS005', name: 'Sukoon',       license: 'IC-DXB-0045', status: 'active',  plans: 4, policies: 78,  gwp: 134_000, claims: 5,  ratio: '69%' },
  { id: 'INS006', name: 'Allianz Care', license: 'IC-DXB-0052', status: 'active',  plans: 3, policies: 67,  gwp: 198_000, claims: 4,  ratio: '62%' },
  { id: 'INS007', name: 'Orient',       license: 'IC-SHJ-0003', status: 'pending', plans: 0, policies: 0,   gwp: 0,       claims: 0,  ratio: '—'   },
]

const BROKERS = [
  { id: 'BR001', name: 'Omar Al Rashidi',  company: 'Al Rashidi Brokers',   license: 'BR-DXB-0247', status: 'active',  clients: 47, policies: 38, commission: 24_800 },
  { id: 'BR002', name: 'Layla Hassan',     company: 'Gulf Shield Insurance', license: 'BR-DXB-0189', status: 'active',  clients: 32, policies: 28, commission: 18_200 },
  { id: 'BR003', name: 'Ravi Sharma',      company: 'Emirates Cover Co.',   license: 'BR-DXB-0312', status: 'active',  clients: 28, policies: 24, commission: 15_600 },
  { id: 'BR004', name: 'Sara Khalid',      company: 'National Brokers UAE', license: 'BR-AUH-0098', status: 'active',  clients: 19, policies: 15, commission: 9_400 },
  { id: 'BR005', name: 'James Wilson',     company: 'JW Insurance LLC',     license: 'BR-DXB-0401', status: 'pending', clients: 0,  policies: 0,  commission: 0 },
  { id: 'BR006', name: 'Priya Nair',       company: 'Priya Insurance Svcs', license: 'BR-DXB-0418', status: 'pending', clients: 0,  policies: 0,  commission: 0 },
]

const POLICIES = [
  { id: 'POL-2026-4821', client: 'Ahmed Al Mansoori', insurer: 'Daman',     broker: 'Omar Al Rashidi',  plan: 'Pearl',    premium: 1_240, status: 'active',  date: '07-May-2026' },
  { id: 'POL-2026-4820', client: 'Sara Mohammed',     insurer: 'AXA Gulf',  broker: 'Layla Hassan',     plan: 'Gold',     premium: 2_240, status: 'active',  date: '06-May-2026' },
  { id: 'POL-2026-4819', client: 'John Thomas',       insurer: 'GIG Gulf',  broker: 'Ravi Sharma',      plan: 'Platinum', premium: 3_150, status: 'active',  date: '05-May-2026' },
  { id: 'POL-2026-4818', client: 'Fatima Al Zaabi',   insurer: 'Daman',     broker: 'Omar Al Rashidi',  plan: 'Essential',premium: 620,   status: 'active',  date: '04-May-2026' },
  { id: 'POL-2026-4817', client: 'Michael Brown',     insurer: 'Allianz',   broker: 'Sara Khalid',      plan: 'Diamond',  premium: 4_200, status: 'active',  date: '03-May-2026' },
  { id: 'POL-2026-4816', client: 'Nour Al Amin',      insurer: 'ADNIC',     broker: 'Layla Hassan',     plan: 'Silk Road',premium: 890,   status: 'lapsed',  date: '01-May-2026' },
  { id: 'POL-2026-4815', client: 'Raj Kumar',         insurer: 'Sukoon',    broker: 'Ravi Sharma',      plan: 'Pearl',    premium: 1_050, status: 'renewal', date: '29-Apr-2026' },
]

const COMMISSIONS = [
  { id: 'COM001', broker: 'Omar Al Rashidi',  policy: 'POL-2026-4821', insurer: 'Daman',    premium: 1_240, rate: '8%',  amount: 99,    status: 'paid',    date: '08-May-2026' },
  { id: 'COM002', broker: 'Layla Hassan',     policy: 'POL-2026-4820', insurer: 'AXA Gulf', premium: 2_240, rate: '8%',  amount: 179,   status: 'paid',    date: '07-May-2026' },
  { id: 'COM003', broker: 'Ravi Sharma',      policy: 'POL-2026-4819', insurer: 'GIG Gulf', premium: 3_150, rate: '10%', amount: 315,   status: 'pending', date: '06-May-2026' },
  { id: 'COM004', broker: 'Omar Al Rashidi',  policy: 'POL-2026-4818', insurer: 'Daman',    premium: 620,   rate: '8%',  amount: 50,    status: 'paid',    date: '05-May-2026' },
  { id: 'COM005', broker: 'Sara Khalid',      policy: 'POL-2026-4817', insurer: 'Allianz',  premium: 4_200, rate: '10%', amount: 420,   status: 'pending', date: '04-May-2026' },
]

type Tab = 'overview' | 'insurers' | 'brokers' | 'policies' | 'commissions' | 'settings'

const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',     label: 'Overview',         icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'insurers',     label: 'Insurers',         icon: <Building2 className="w-4 h-4" /> },
  { id: 'brokers',      label: 'Brokers',          icon: <Users className="w-4 h-4" /> },
  { id: 'policies',     label: 'All Policies',     icon: <FileText className="w-4 h-4" /> },
  { id: 'commissions',  label: 'Commission Ledger',icon: <DollarSign className="w-4 h-4" /> },
  { id: 'settings',     label: 'Settings',         icon: <Settings className="w-4 h-4" /> },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    active:  ['#DCFCE7', '#166534'],
    pending: ['#FEF3C7', '#92400E'],
    lapsed:  ['#FEE2E2', '#991B1B'],
    renewal: ['#EFF6FF', '#1D4ED8'],
    paid:    ['#DCFCE7', '#166534'],
    approved:['#DCFCE7', '#166534'],
    suspended:['#FEE2E2','#991B1B'],
  }
  const [bg, text] = map[status] ?? ['#F1F5F9', '#475569']
  return (
    <span className="px-2.5 py-0.5 rounded-full font-sans font-semibold text-[11px] capitalize"
      style={{ backgroundColor: bg, color: text }}>{status}</span>
  )
}

function Sidebar({ tab, setTab, user, onLogout, open, onClose }: {
  tab: Tab; setTab: (t: Tab) => void; user: { name: string; initials: string; email: string } | null
  onLogout: () => void; open: boolean; onClose: () => void
}) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'linear-gradient(180deg,#060F1E 0%,#0A1A30 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-5 py-5 border-b flex items-center gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <Logo size={28} />
          <div className="ml-1">
            <div className="font-sans font-bold text-[11px] text-white/40 uppercase tracking-widest">Super Admin</div>
            <div className="font-display font-extrabold text-[14px] text-white">InsureAE</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(n => (
            <button key={n.id} onClick={() => { setTab(n.id); onClose() }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans font-semibold text-[13px] transition-all text-left"
              style={{ backgroundColor: tab === n.id ? 'rgba(13,148,136,0.15)' : 'transparent', color: tab === n.id ? '#2DD4BF' : 'rgba(255,255,255,0.5)' }}>
              <span style={{ color: tab === n.id ? '#2DD4BF' : 'rgba(255,255,255,0.35)' }}>{n.icon}</span>
              {n.label}
              {n.id === 'brokers' && <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#D4A24B22', color: '#D4A24B' }}>7</span>}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-bold text-[12px] text-white shrink-0"
              style={{ background: 'linear-gradient(135deg,#0D9488,#0F2D55)' }}>
              {user?.initials}
            </div>
            <div className="min-w-0">
              <p className="font-sans font-semibold text-[12px] text-white truncate">{user?.name}</p>
              <p className="font-sans text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>Super Admin</p>
            </div>
          </div>
          <button onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-sans text-[12.5px] transition-all hover:bg-white/5"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

export default function SuperAdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => { logout(); router.push('/login') }

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
            <div>
              <h1 className="font-display font-bold text-[16px]" style={{ color: '#0F2D55' }}>
                {NAV.find(n => n.id === tab)?.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full font-sans font-semibold text-[11px]"
              style={{ backgroundColor: '#F0FDFA', color: '#0D9488', border: '1px solid #CCFBF1' }}>
              <Shield className="w-3 h-3" /> Platform Admin
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}>

              {/* ══ OVERVIEW ══ */}
              {tab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {KPI.map(k => (
                      <div key={k.label} className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E5EAF0' }}>
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-2xl">{k.icon}</span>
                          {k.trend === 'up' && <TrendingUp className="w-4 h-4" style={{ color: '#0D9488' }} />}
                        </div>
                        <div className="font-display font-extrabold text-[22px]" style={{ color: '#0F2D55' }}>{k.value}</div>
                        <div className="font-sans font-semibold text-[11px] mt-0.5" style={{ color: '#64748B' }}>{k.label}</div>
                        <div className="font-sans text-[11px] mt-1" style={{ color: k.trend === 'up' ? '#0D9488' : '#94A3B8' }}>{k.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent activity split */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="bg-white rounded-2xl border" style={{ borderColor: '#E5EAF0' }}>
                      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                        <p className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>Latest Policies</p>
                        <button onClick={() => setTab('policies')} className="font-sans text-[12px] font-semibold" style={{ color: '#0D9488' }}>View all</button>
                      </div>
                      <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                        {POLICIES.slice(0, 5).map(p => (
                          <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                            <div>
                              <p className="font-sans font-semibold text-[12.5px]" style={{ color: '#0F2D55' }}>{p.client}</p>
                              <p className="font-sans text-[11px]" style={{ color: '#94A3B8' }}>{p.id} · {p.insurer} · {p.plan}</p>
                            </div>
                            <div className="text-right">
                              <StatusBadge status={p.status} />
                              <p className="font-sans text-[11px] mt-1" style={{ color: '#94A3B8' }}>AED {p.premium.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border" style={{ borderColor: '#E5EAF0' }}>
                      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                        <p className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>Pending Approvals</p>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>7 pending</span>
                      </div>
                      <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                        {(BROKERS.filter(b => b.status === 'pending') as Array<{ id: string; name: string; license: string; status: string; company?: string }>)
                          .concat(INSURERS.filter(i => i.status === 'pending') as Array<{ id: string; name: string; license: string; status: string; company?: string }>)
                          .map(item => (
                          <div key={item.id} className="px-5 py-3 flex items-center justify-between">
                            <div>
                              <p className="font-sans font-semibold text-[12.5px]" style={{ color: '#0F2D55' }}>{item.name}</p>
                              <p className="font-sans text-[11px]" style={{ color: '#94A3B8' }}>
                                {item.company ? 'Broker' : 'Insurer'} · {item.license}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button className="h-7 px-3 rounded-lg font-sans font-semibold text-[11px] transition-colors"
                                style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>Approve</button>
                              <button className="h-7 px-3 rounded-lg font-sans font-semibold text-[11px] transition-colors"
                                style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>Reject</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Insurer performance strip */}
                  <div className="bg-white rounded-2xl border" style={{ borderColor: '#E5EAF0' }}>
                    <div className="px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
                      <p className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>Insurer GWP Distribution</p>
                    </div>
                    <div className="p-5 space-y-3">
                      {INSURERS.filter(i => i.gwp > 0).map(ins => {
                        const max = 486_000; const pct = Math.round((ins.gwp / max) * 100)
                        return (
                          <div key={ins.id}>
                            <div className="flex justify-between mb-1">
                              <span className="font-sans font-semibold text-[12px]" style={{ color: '#0F2D55' }}>{ins.name}</span>
                              <span className="font-sans text-[12px]" style={{ color: '#64748B' }}>AED {ins.gwp.toLocaleString()}</span>
                            </div>
                            <div className="h-2 rounded-full" style={{ backgroundColor: '#F1F5F9' }}>
                              <div className="h-2 rounded-full transition-all"
                                style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#0D9488,#0F2D55)' }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ══ INSURERS ══ */}
              {tab === 'insurers' && (
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#E5EAF0' }}>
                  <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                    <p className="font-sans font-bold text-[14px]" style={{ color: '#0F2D55' }}>Insurance Companies ({INSURERS.length})</p>
                    <button className="h-9 px-4 rounded-xl font-sans font-bold text-[12.5px] text-white"
                      style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>+ Onboard Insurer</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: '#F8FAFC' }}>
                          {['Company', 'License No.', 'Status', 'Plans', 'Policies Sold', 'GWP (AED)', 'Claims', 'Loss Ratio', 'Action'].map(h => (
                            <th key={h} className="px-4 py-3 text-left font-sans font-bold text-[11px] uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                        {INSURERS.map(ins => (
                          <tr key={ins.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-sans font-bold text-[10px] text-white shrink-0"
                                  style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
                                  {ins.name.slice(0,2).toUpperCase()}
                                </div>
                                <span className="font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{ins.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{ins.license}</td>
                            <td className="px-4 py-3"><StatusBadge status={ins.status} /></td>
                            <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{ins.plans}</td>
                            <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{ins.policies.toLocaleString()}</td>
                            <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0D9488' }}>{ins.gwp > 0 ? ins.gwp.toLocaleString() : '—'}</td>
                            <td className="px-4 py-3 font-sans text-[13px]" style={{ color: '#64748B' }}>{ins.claims}</td>
                            <td className="px-4 py-3 font-sans text-[13px]" style={{ color: '#64748B' }}>{ins.ratio}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1.5">
                                <button className="h-7 px-3 rounded-lg font-sans font-semibold text-[11px]" style={{ backgroundColor: '#EBF2FA', color: '#0F2D55' }}>Manage</button>
                                {ins.status === 'pending' && (
                                  <button className="h-7 px-3 rounded-lg font-sans font-semibold text-[11px]" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>Approve</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ══ BROKERS ══ */}
              {tab === 'brokers' && (
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#E5EAF0' }}>
                  <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                    <p className="font-sans font-bold text-[14px]" style={{ color: '#0F2D55' }}>Brokers ({BROKERS.length})</p>
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-[11px] font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                        <AlertCircle className="w-3 h-3" /> {BROKERS.filter(b => b.status === 'pending').length} pending
                      </span>
                      <button className="h-9 px-4 rounded-xl font-sans font-bold text-[12.5px] text-white"
                        style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>+ Add Broker</button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: '#F8FAFC' }}>
                          {['Broker', 'Company', 'License No.', 'Status', 'Clients', 'Policies', 'Commission (AED)', 'Action'].map(h => (
                            <th key={h} className="px-4 py-3 text-left font-sans font-bold text-[11px] uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                        {BROKERS.map(br => (
                          <tr key={br.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-bold text-[11px] text-white shrink-0"
                                  style={{ background: 'linear-gradient(135deg,#D4A24B,#B87C1E)' }}>
                                  {br.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                                </div>
                                <span className="font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{br.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{br.company}</td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{br.license}</td>
                            <td className="px-4 py-3"><StatusBadge status={br.status} /></td>
                            <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{br.clients}</td>
                            <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{br.policies}</td>
                            <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0D9488' }}>{br.commission > 0 ? br.commission.toLocaleString() : '—'}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1.5">
                                {br.status === 'pending' ? (
                                  <>
                                    <button className="h-7 px-3 rounded-lg font-sans font-semibold text-[11px]" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>Approve</button>
                                    <button className="h-7 px-3 rounded-lg font-sans font-semibold text-[11px]" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>Reject</button>
                                  </>
                                ) : (
                                  <>
                                    <button className="h-7 px-3 rounded-lg font-sans font-semibold text-[11px]" style={{ backgroundColor: '#EBF2FA', color: '#0F2D55' }}>View</button>
                                    <button className="h-7 px-3 rounded-lg font-sans font-semibold text-[11px]" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>Suspend</button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ══ ALL POLICIES ══ */}
              {tab === 'policies' && (
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#E5EAF0' }}>
                  <div className="px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
                    <p className="font-sans font-bold text-[14px]" style={{ color: '#0F2D55' }}>All Platform Policies ({POLICIES.length})</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: '#F8FAFC' }}>
                          {['Policy ID', 'Client', 'Insurer', 'Broker', 'Plan', 'Premium', 'Status', 'Issue Date'].map(h => (
                            <th key={h} className="px-4 py-3 text-left font-sans font-bold text-[11px] uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                        {POLICIES.map(p => (
                          <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-4 py-3 font-sans font-semibold text-[12px]" style={{ color: '#0D9488' }}>{p.id}</td>
                            <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{p.client}</td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{p.insurer}</td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{p.broker}</td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{p.plan}</td>
                            <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>AED {p.premium.toLocaleString()}</td>
                            <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                            <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#94A3B8' }}>{p.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ══ COMMISSIONS ══ */}
              {tab === 'commissions' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Total Paid', value: 'AED 328', sub: 'This week', color: '#0D9488' },
                      { label: 'Pending Disbursement', value: 'AED 735', sub: '2 entries', color: '#D4A24B' },
                      { label: 'Total YTD', value: 'AED 48,200', sub: 'Jan–May 2026', color: '#0F2D55' },
                    ].map(s => (
                      <div key={s.label} className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E5EAF0' }}>
                        <div className="font-display font-extrabold text-[22px]" style={{ color: s.color }}>{s.value}</div>
                        <div className="font-sans font-semibold text-[12px]" style={{ color: '#0F2D55' }}>{s.label}</div>
                        <div className="font-sans text-[11px]" style={{ color: '#94A3B8' }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#E5EAF0' }}>
                    <div className="px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
                      <p className="font-sans font-bold text-[14px]" style={{ color: '#0F2D55' }}>Commission Ledger</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr style={{ backgroundColor: '#F8FAFC' }}>
                            {['ID', 'Broker', 'Policy', 'Insurer', 'Premium', 'Rate', 'Amount (AED)', 'Status', 'Date'].map(h => (
                              <th key={h} className="px-4 py-3 text-left font-sans font-bold text-[11px] uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                          {COMMISSIONS.map(c => (
                            <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                              <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#94A3B8' }}>{c.id}</td>
                              <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{c.broker}</td>
                              <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#0D9488' }}>{c.policy}</td>
                              <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{c.insurer}</td>
                              <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>AED {c.premium.toLocaleString()}</td>
                              <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{c.rate}</td>
                              <td className="px-4 py-3 font-sans font-bold text-[13px]" style={{ color: '#0D9488' }}>{c.amount}</td>
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

              {/* ══ SETTINGS ══ */}
              {tab === 'settings' && (
                <div className="max-w-xl space-y-4">
                  {[
                    { label: 'Platform Name', value: 'InsureAE Technologies LLC', note: 'Legal entity name' },
                    { label: 'IA License Number', value: 'LIC/INS/2024/0042', note: 'UAE Insurance Authority' },
                    { label: 'Default Commission Rate', value: '8%', note: 'Standard broker commission' },
                    { label: 'VAT Rate', value: '5%', note: 'UAE standard VAT' },
                    { label: 'Beamah (Solidarity)', value: 'AED 37 – 75', note: 'Based on plan tier' },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E5EAF0' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>{s.label}</p>
                          <p className="font-sans text-[11px]" style={{ color: '#94A3B8' }}>{s.note}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-sans font-semibold text-[13px]" style={{ color: '#0D9488' }}>{s.value}</span>
                          <button className="h-7 px-3 rounded-lg font-sans text-[11px] font-semibold" style={{ backgroundColor: '#EBF2FA', color: '#0F2D55' }}>Edit</button>
                        </div>
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
