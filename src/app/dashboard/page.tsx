'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, Plus, ChevronDown, ChevronUp, Mail, Copy, ExternalLink, RefreshCw } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'

/* ─── Mock Data ──────────────────────────────────────────── */
const MOCK_QUOTES = [
  { id: 'Q001', name: 'Nehal Dilip Mehta',           age: 53, plan: 'Gold',                     date: '13/02/2026', quoteNo: '2026-D-532-00019', agent: 'Aliainsbr@aliainsurance.ae', premium: 29090.93, risk: 'low',  status: 'Maf Form Filled',       action: null },
  { id: 'Q002', name: 'Rohit Khemani',               age: 54, plan: 'Enhanced',                  date: '09/02/2026', quoteNo: '2026-D-532-00018', agent: 'Aliainsbr@aliainsurance.ae', premium: 18500.00, risk: '',     status: 'Quote Sent',            action: null },
  { id: 'Q003', name: 'Doniza Cosep Darnayla',       age: 40, plan: 'General Network',           date: '04/02/2026', quoteNo: '2026-D-532-00017', agent: 'Aliainsbr@aliainsurance.ae', premium: 411362.25,risk: 'high', status: 'Risk Revised Premium',  action: null },
  { id: 'Q004', name: 'Sunny Joyson Fernandies',     age: 31, plan: "Worker's Network",          date: '03/02/2026', quoteNo: '2026-D-532-00009', agent: 'Aliainsbr@aliainsurance.ae', premium: 8847.28,  risk: 'high', status: 'Customer Accepted',     action: null },
  { id: 'Q005', name: 'Irina Bukharina',             age: 42, plan: 'Enhanced',                  date: '28/01/2026', quoteNo: '2026-D-532-00016', agent: 'Aliainsbr@aliainsurance.ae', premium: 14500.00, risk: '',     status: 'Quote Sent',            action: null },
  { id: 'Q006', name: 'Ahmed Al Mansoori',           age: 35, plan: 'Comprehensive',             date: '20/01/2026', quoteNo: '2026-D-532-00015', agent: 'Aliainsbr@aliainsurance.ae', premium: 52300.00, risk: 'low',  status: 'Quote Generated',       action: 'SendMail' },
  { id: 'Q007', name: 'Priya Sharma',                age: 29, plan: 'Basic DHA',                 date: '15/01/2026', quoteNo: '2026-D-532-00014', agent: 'Aliainsbr@aliainsurance.ae', premium: 4200.00,  risk: '',     status: 'Quote Sent',            action: null },
]

const MOCK_POLICIES = [
  { id: 'P001', name: 'Mildred Rodriguez Odero',    age: 38, plan: 'Comprehensive Network',      date: '15/10/2025', quoteNo: '2025-N-532-000006-1', agent: 'Aliainsbr@aliainsurance.ae', premium: 31627.50, risk: 'low',  status: 'Thoshfa Status',        action: 'CopyLink' },
  { id: 'P002', name: 'Kirsteen Ruth Bowie',        age: 44, plan: 'Gold 250K',                  date: '01/05/2025', quoteNo: '2024-D-532-00011-1',  agent: 'Aliainsbr@aliainsurance.ae', premium: 18500.00, risk: '',     status: 'Quote Generated',       action: 'SendMail' },
  { id: 'P003', name: 'Kamran Kamal',               age: 36, plan: 'Super Restricted Network',  date: '13/01/2025', quoteNo: '2024-N-532-00003-1',  agent: 'Aliainsbr@aliainsurance.ae', premium: 53978.41, risk: 'high', status: 'Quote Sent',            action: null },
  { id: 'P004', name: 'Aisha Bint Sultan',          age: 27, plan: 'Enhanced',                   date: '02/11/2024', quoteNo: '2024-D-532-00028-1',  agent: 'Aliainsbr@aliainsurance.ae', premium: 9800.00,  risk: 'low',  status: 'Policy Active',         action: null },
]

const MOCK_RENEWALS = [
  { id: 'R001', name: 'Badhriveerappan Sivaji',     age: 52, plan: 'Super Restricted Network',  date: '04/07/2026', quoteNo: '2025-N-532-000003',   agent: 'Aliainsbr@aliainsurance.ae', premium: 50946.20, risk: 'high', status: 'Document Uploaded',     action: null },
  { id: 'R002', name: 'Fatima Al Hassan',           age: 45, plan: 'Gold',                       date: '01/06/2026', quoteNo: '2025-D-532-000012',   agent: 'Aliainsbr@aliainsurance.ae', premium: 27340.00, risk: 'low',  status: 'Renewal Due',           action: 'SendMail' },
]

const MOCK_REVISE = [
  { id: 'RV001', name: 'Rawah Rashak Abdullah Alfarttoosi', age: 39, plan: 'General Network', date: '07/11/2025', quoteNo: '2024-D-532-00029-1', agent: 'Aliainsbr@aliainsurance.ae', premium: 13216.14, risk: '',     status: 'Quote Generated', action: 'SendMail' },
  { id: 'RV002', name: 'John Peter Williams',              age: 48, plan: 'Comprehensive',    date: '12/10/2025', quoteNo: '2024-D-532-00022-1', agent: 'Aliainsbr@aliainsurance.ae', premium: 44200.00, risk: 'low',  status: 'Quote Sent',      action: 'CopyLink' },
]

type TabId = 'quotes' | 'policies' | 'renewals' | 'revise'

const TABS: { id: TabId; label: string }[] = [
  { id: 'quotes',   label: 'Quotes' },
  { id: 'policies', label: 'Policies' },
  { id: 'renewals', label: 'Renewal List' },
  { id: 'revise',   label: 'Revise Renewal Policy' },
]

function getStatusStyle(status: string) {
  if (status.toLowerCase().includes('accepted') || status.toLowerCase().includes('active'))
    return { color: '#0D9488', fontWeight: 700 }
  if (status.toLowerCase().includes('high') || status.toLowerCase().includes('risk'))
    return { color: '#DC2626', fontWeight: 600 }
  if (status.toLowerCase().includes('generated') || status.toLowerCase().includes('sent'))
    return { color: '#0D9488', fontWeight: 600 }
  if (status.toLowerCase().includes('uploaded') || status.toLowerCase().includes('filled'))
    return { color: '#0F2D55', fontWeight: 600 }
  return { color: '#64748B', fontWeight: 500 }
}

function getRiskBadge(risk: string) {
  if (risk === 'high') return { label: 'high', bg: '#FEF2F2', color: '#DC2626' }
  if (risk === 'low')  return { label: 'low',  bg: '#F0FDFA', color: '#0D9488' }
  return null
}

interface Row {
  id: string; name: string; age: number; plan: string; date: string
  quoteNo: string; agent: string; premium: number; risk: string; status: string; action: string | null
}

function DataTable({ rows, showPageSize = false }: { rows: Row[]; showPageSize?: boolean }) {
  const [sortField, setSortField] = useState<'date' | 'premium' | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  function toggleSort(f: 'date' | 'premium') {
    if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(f); setSortDir('desc') }
  }

  const sorted = [...rows].sort((a, b) => {
    if (!sortField) return 0
    if (sortField === 'premium') return sortDir === 'asc' ? a.premium - b.premium : b.premium - a.premium
    if (sortField === 'date') {
      const [d1, m1, y1] = a.date.split('/').map(Number)
      const [d2, m2, y2] = b.date.split('/').map(Number)
      const da = new Date(y1, m1 - 1, d1).getTime()
      const db = new Date(y2, m2 - 1, d2).getTime()
      return sortDir === 'asc' ? da - db : db - da
    }
    return 0
  })

  function SortIcon({ field }: { field: 'date' | 'premium' }) {
    if (sortField !== field) return <div className="flex flex-col gap-0.5 opacity-30"><ChevronUp className="w-2.5 h-2.5" /><ChevronDown className="w-2.5 h-2.5" /></div>
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3" style={{ color: '#0D9488' }} />
      : <ChevronDown className="w-3 h-3" style={{ color: '#0D9488' }} />
  }

  if (rows.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">📭</div>
        <p className="font-sans font-semibold text-[14px]" style={{ color: 'var(--text-muted)' }}>No records found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E5EAF0' }}>
            {[
              { label: 'Name',     key: null },
              { label: 'Age',      key: null },
              { label: 'Plan',     key: null },
              { label: 'Date',     key: 'date' as const },
              { label: 'Quote number', key: null },
              { label: 'Agent',    key: null },
              { label: 'Premium (excl. Fees & Taxes)', key: 'premium' as const },
              { label: 'Risk Status', key: null },
              { label: 'Status',   key: null },
              { label: 'Action',   key: null },
            ].map(col => (
              <th key={col.label}
                className="px-4 py-3 text-left font-sans font-semibold text-[11.5px] whitespace-nowrap"
                style={{ color: '#64748B' }}>
                {col.key ? (
                  <button type="button" onClick={() => toggleSort(col.key!)}
                    className="flex items-center gap-1 hover:text-[#0F2D55] transition-colors">
                    {col.label} <SortIcon field={col.key} />
                  </button>
                ) : col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const risk = getRiskBadge(row.risk)
            const statusStyle = getStatusStyle(row.status)
            return (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b transition-colors hover:bg-[#F8FAFC]"
                style={{ borderColor: '#F1F5F9' }}>
                <td className="px-4 py-3">
                  <span className="font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{row.name}</span>
                </td>
                <td className="px-4 py-3 font-sans text-[13px]" style={{ color: '#475569' }}>{row.age}</td>
                <td className="px-4 py-3 font-sans text-[12.5px]" style={{ color: '#475569' }}>{row.plan}</td>
                <td className="px-4 py-3 font-sans text-[12.5px]" style={{ color: '#475569' }}>
                  <button type="button" onClick={() => toggleSort('date')} className="text-left">{row.date}</button>
                </td>
                <td className="px-4 py-3">
                  <a href="#" className="font-sans text-[12.5px] font-semibold hover:underline" style={{ color: '#0D9488' }}>
                    {row.quoteNo}
                  </a>
                </td>
                <td className="px-4 py-3 font-sans text-[12px]" style={{ color: '#64748B' }}>{row.agent}</td>
                <td className="px-4 py-3 font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>
                  AED {row.premium.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3">
                  {risk && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full font-sans font-semibold text-[11px]"
                      style={{ backgroundColor: risk.bg, color: risk.color }}>
                      {risk.label}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="font-sans text-[12.5px]" style={statusStyle}>{row.status}</span>
                </td>
                <td className="px-4 py-3">
                  {row.action === 'SendMail' && (
                    <button type="button"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans font-semibold text-[12px] text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: '#0D9488' }}>
                      <Mail className="w-3.5 h-3.5" /> Send Mail
                    </button>
                  )}
                  {row.action === 'CopyLink' && (
                    <button type="button"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans font-semibold text-[12px] transition-all hover:bg-[#EBF2FA]"
                      style={{ color: '#0F2D55', border: '1px solid #CBD5E1' }}>
                      <Copy className="w-3.5 h-3.5" /> Copy Link
                    </button>
                  )}
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#E5EAF0' }}>
        <div className="flex items-center gap-2">
          <button type="button" className="px-3 py-1 rounded font-sans text-[12px] transition-colors hover:bg-[#F0FDFA]"
            style={{ color: '#64748B', border: '1px solid #E5EAF0' }}>
            Prev
          </button>
          <span className="w-8 h-7 rounded flex items-center justify-center font-sans font-bold text-[12px] text-white"
            style={{ backgroundColor: '#0F2D55' }}>1</span>
          <button type="button" className="px-3 py-1 rounded font-sans text-[12px] transition-colors hover:bg-[#F0FDFA]"
            style={{ color: '#64748B', border: '1px solid #E5EAF0' }}>
            Next &gt;
          </button>
        </div>
        {showPageSize && (
          <div className="flex items-center gap-2">
            <span className="font-sans text-[12px]" style={{ color: '#64748B' }}>Page</span>
            <select className="h-7 px-2 rounded border font-sans text-[12px]" style={{ borderColor: '#E5EAF0', color: '#0F2D55' }}>
              <option>1</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<TabId>('quotes')
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  const totalPolicies = MOCK_POLICIES.length
  const totalPremium = [...MOCK_POLICIES, ...MOCK_QUOTES].reduce((s, r) => s + r.premium, 0)

  const tabData: Record<TabId, Row[]> = {
    quotes:   MOCK_QUOTES,
    policies: MOCK_POLICIES,
    renewals: MOCK_RENEWALS,
    revise:   MOCK_REVISE,
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F7FB' }}>
      {/* Page inner content */}
      <div className="max-w-[1300px] mx-auto px-4 lg:px-8 py-6">

        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden mb-6"
          style={{ background: 'linear-gradient(135deg, #0F2D55 0%, #1A4F8A 50%, #0D9488 100%)', minHeight: '120px' }}>
          <div className="flex items-center justify-between px-6 py-5">
            {/* Left text */}
            <div className="text-white">
              <div className="font-sans text-[12px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Health Insurance Portal
              </div>
              <h1 className="font-display font-extrabold text-[22px] leading-tight mb-1">
                Welcome back, {firstName}
              </h1>
              <p className="font-sans text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Get health insurance that&apos;s free from surprises.
              </p>
            </div>

            {/* Stats */}
            <div className="hidden md:flex items-center gap-8">
              <StatPill icon="👥" value={totalPolicies.toFixed(2)} label="Total Policies" />
              <StatPill icon="💰" value={`AED ${totalPremium.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} label="Total Premium" />
              <StatPill icon="📊" value="0.00" label="Brokerage" />
            </div>
          </div>
        </motion.div>

        {/* Mobile stats */}
        <div className="grid grid-cols-3 gap-3 mb-5 md:hidden">
          <MobileStat label="Total Policies" value={totalPolicies.toFixed(2)} />
          <MobileStat label="Total Premium" value={`AED ${(totalPremium / 1000).toFixed(0)}K`} />
          <MobileStat label="Brokerage" value="0.00" />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link href="/quote/health"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans font-bold text-[13.5px] text-white transition-all hover:opacity-90 hover:shadow-md"
              style={{ background: 'linear-gradient(135deg, #0F2D55 0%, #0D9488 100%)' }}>
              <Plus className="w-4 h-4" />
              Create New Quote
            </Link>
            <button type="button"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-sans font-semibold text-[13px] transition-colors hover:bg-[#EBF2FA] border"
              style={{ borderColor: '#CBD5E1', color: '#0F2D55', backgroundColor: 'white' }}>
              <RefreshCw className="w-3.5 h-3.5" /> Analytics
            </button>
          </div>
          <button type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans font-bold text-[13px] transition-colors hover:bg-red-600 text-white"
            style={{ backgroundColor: '#DC2626' }}>
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Tabs + table */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl overflow-hidden"
          style={{ border: '1px solid #E5EAF0', boxShadow: '0 1px 4px rgba(15,45,85,0.06)' }}>

          {/* Tab headers */}
          <div className="flex border-b" style={{ borderColor: '#E5EAF0' }}>
            {TABS.map(tab => (
              <button key={tab.id} type="button"
                onClick={() => setActiveTab(tab.id)}
                className="px-5 py-3.5 font-sans font-semibold text-[13px] transition-all relative whitespace-nowrap"
                style={{
                  color: activeTab === tab.id ? '#0F2D55' : '#94A3B8',
                  backgroundColor: activeTab === tab.id ? 'white' : '#F8FAFC',
                  borderBottom: activeTab === tab.id ? '2px solid #0F2D55' : '2px solid transparent',
                }}>
                {tab.label}
                {tabData[tab.id].length > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full font-sans font-bold text-[10px]"
                    style={{
                      backgroundColor: activeTab === tab.id ? '#0F2D55' : '#E5EAF0',
                      color: activeTab === tab.id ? 'white' : '#64748B',
                    }}>
                    {tabData[tab.id].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <DataTable
            rows={tabData[activeTab]}
            showPageSize={activeTab === 'renewals'}
          />
        </motion.div>
      </div>
    </div>
  )
}

function StatPill({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl mb-1">{icon}</div>
      <div className="font-display font-extrabold text-[20px] text-white leading-tight">{value}</div>
      <div className="font-sans text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</div>
    </div>
  )
}

function MobileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-3 text-center border" style={{ borderColor: '#E5EAF0' }}>
      <div className="font-display font-bold text-[16px]" style={{ color: '#0F2D55' }}>{value}</div>
      <div className="font-sans text-[10.5px] mt-0.5" style={{ color: '#64748B' }}>{label}</div>
    </div>
  )
}
