'use client'
import React, { useState, useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, CheckCircle2, ArrowRight, Shield, Download,
  SlidersHorizontal, X, Search, Loader2, Mail, Phone, MessageCircle,
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import {
  PLANS, Plan, getPlanPremium, getAvailablePlans, calcDepPremium,
  calcBeamah, calcVAT, calcGrandTotal, generateQuoteNumber,
} from './plansData'

/* ─── Types ──────────────────────────────────────────────── */
type StepId =
  | 'emirate'
  | 'basic_details'
  | 'member_type'
  | 'self_details'
  | 'dependent_details'
  | 'plan_listing'
  | 'quote_summary'
  | 'policyholder'
  | 'payment'

interface QuoteData {
  emirate: string
  // Basic details (all cities)
  name: string; email: string; mobile: string; eid: string
  dob: string; nationality: string; gender: string; maritalStatus: string
  // Dubai routing
  memberType: string        // 'self' | 'dependent'
  // Self details (Dubai)
  salaryBand: string        // 'lsb' | 'nlsb'
  hasExistingPolicy: boolean; existingInsurer: string; existingExpiry: string
  // Dependent details (Dubai)
  depName: string; depDob: string; depNationality: string
  depGender: string; depRelation: string  // 'wife' | 'child' | 'parent'
  depHasExistingPolicy: boolean; depExistingInsurer: string; depExistingExpiry: string
  // Selected plan
  planId: string
  quoteNumber: string
  // Policyholder details
  phSecondName: string; phLastName: string; phPassport: string
  phOccupation: string; phMemberType: string; phEmiratesOfVisa: string
  phEmiratesOfResidency: string; phEmirateOfWork: string; phWorkLocation: string
  phFileNumber: string; phUid: string; phBirthCertId: string
  phHasSpecialConditions: boolean
  phChronicConditions: string[]
  phCriticalConditions: string[]
}

function cn(...cls: (string | boolean | undefined | null)[]) { return cls.filter(Boolean).join(' ') }

const slide = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, x: -24, transition: { duration: 0.16 } },
}

function foc(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = '#0D9488'
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.12)'
}
function blu(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = '#E5EAF0'
  e.currentTarget.style.boxShadow = 'none'
}

const INP = "w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none transition-all"

/* ─── Nationalities ──────────────────────────────────────── */
const NATIONALITIES = [
  { name: 'UAE', flag: '🇦🇪' }, { name: 'India', flag: '🇮🇳' }, { name: 'Pakistan', flag: '🇵🇰' },
  { name: 'Philippines', flag: '🇵🇭' }, { name: 'Bangladesh', flag: '🇧🇩' }, { name: 'Egypt', flag: '🇪🇬' },
  { name: 'Jordan', flag: '🇯🇴' }, { name: 'Lebanon', flag: '🇱🇧' }, { name: 'Saudi Arabia', flag: '🇸🇦' },
  { name: 'Nepal', flag: '🇳🇵' }, { name: 'Sri Lanka', flag: '🇱🇰' }, { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'Ethiopia', flag: '🇪🇹' }, { name: 'United Kingdom', flag: '🇬🇧' }, { name: 'United States', flag: '🇺🇸' },
  { name: 'Canada', flag: '🇨🇦' }, { name: 'Australia', flag: '🇦🇺' }, { name: 'France', flag: '🇫🇷' },
  { name: 'Germany', flag: '🇩🇪' }, { name: 'China', flag: '🇨🇳' }, { name: 'Other', flag: '🌍' },
]

const UAE_INSURERS = [
  'Daman', 'AXA Gulf', 'GIG Gulf', 'ADNIC', 'Sukoon', 'Cigna', 'Allianz',
  'Neuron', 'RSA', 'MetLife', 'Oman Insurance', 'Orient', 'Union Insurance',
  'Emirates Insurance', 'Watania', 'Al Ain Ahlia', 'Other',
]

const CHRONIC_CONDITIONS = [
  'Addison Disease', 'Anemia', 'Atherosclerosis', 'Cardiac congestive failure',
  'Chronic Eczema', 'Chronic Pancreatitis', 'Chronic corneal ulcer', 'Coronary artery disease',
  'Diabetes and Complications', 'Emphysema / Gastroduodenal Ulcer', 'Epilepsy',
  'Esophageal varices', 'Gout', 'Hypertension', 'Hypothyroidism',
  'Intestinal inflammatory disease', 'Others', 'Psoriasis', 'Rheumatoid disease',
  'Thyrotoxicosis', 'Tuberculosis', 'Vertebral hernia / Cataract',
]

const CRITICAL_CONDITIONS = [
  'None', 'Ascites', 'Cancer', 'Cerebro-meningitis',
  'Heart open surgeries and catheterism', 'Hepatitis B and C', 'Liver Failure',
  'Physical / Mental disabilities or birth defects', 'Renal Failure', 'Respiratory insufficiency',
]

/* ─── Sub-components ─────────────────────────────────────── */
function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: '#475569' }}>
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function NationalitySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const selected = NATIONALITIES.find(n => n.name === value)
  const filtered = NATIONALITIES.filter(n => n.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className={`${INP} flex items-center gap-2.5 text-left`}
        style={{ borderColor: open ? '#0D9488' : '#E5EAF0', boxShadow: open ? '0 0 0 3px rgba(13,148,136,0.12)' : 'none', color: value ? '#0F2D55' : '#94A3B8' }}>
        {selected ? <><span className="text-lg">{selected.flag}</span><span className="text-[14px]">{selected.name}</span></> : 'Select nationality'}
        <span className="ml-auto text-[10px] text-[#94A3B8]">▼</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSearch('') }} />
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-xl border shadow-xl overflow-hidden" style={{ borderColor: '#E5EAF0' }}>
            <div className="p-2.5 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center gap-2 h-9 px-3 rounded-lg border bg-[#F8FAFC]" style={{ borderColor: '#E5EAF0' }}>
                <Search className="w-3.5 h-3.5 shrink-0 text-[#94A3B8]" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search…" className="flex-1 font-sans text-[13px] outline-none bg-transparent" autoFocus />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filtered.map(n => (
                <button key={n.name} type="button" onClick={() => { onChange(n.name); setOpen(false); setSearch('') }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 font-sans text-[13.5px] text-left hover:bg-[#F0FDFA] transition-colors"
                  style={{ color: value === n.name ? '#0D9488' : '#0F2D55', fontWeight: value === n.name ? 600 : 400 }}>
                  <span className="text-lg w-7 shrink-0">{n.flag}</span>
                  {n.name}
                  {value === n.name && <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0" style={{ color: '#0D9488' }} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ExistingPolicySection({ has, insurer, expiry, onToggle, onInsurer, onExpiry }: {
  has: boolean; insurer: string; expiry: string
  onToggle: (v: boolean) => void; onInsurer: (v: string) => void; onExpiry: (v: string) => void
}) {
  return (
    <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5EAF0' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-sans font-bold text-[13.5px]" style={{ color: '#0F2D55' }}>Existing health insurance?</p>
          <p className="font-sans text-[12px]" style={{ color: '#64748B' }}>Helps us find the best renewal rate</p>
        </div>
        <button type="button" onClick={() => onToggle(!has)}
          className="relative w-11 h-6 rounded-full transition-all shrink-0 ml-4"
          style={{ backgroundColor: has ? '#0D9488' : '#CBD5E1' }}>
          <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
            style={{ left: has ? '22px' : '2px' }} />
        </button>
      </div>
      {has && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ borderColor: '#E5EAF0' }}>
          <FormField label="Current Insurer">
            <select value={insurer} onChange={e => onInsurer(e.target.value)}
              className={INP + " appearance-none"} style={{ borderColor: '#E5EAF0', color: insurer ? '#0F2D55' : '#94A3B8' }}>
              <option value="">Select insurer</option>
              {UAE_INSURERS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </FormField>
          <FormField label="Policy Expiry Date">
            <input type="date" value={expiry} onChange={e => onExpiry(e.target.value)}
              className={INP} style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
          </FormField>
        </motion.div>
      )}
    </div>
  )
}

function SalaryBandPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {([
        { id: 'lsb',  title: 'LSB',  subtitle: 'Up to AED 4,000/month',  color: '#0D9488' },
        { id: 'nlsb', title: 'NLSB', subtitle: 'Above AED 4,000/month',  color: '#0F2D55' },
      ] as const).map(({ id, title, subtitle, color }) => {
        const active = value === id
        return (
          <button key={id} type="button" onClick={() => onChange(id)}
            className="flex items-center justify-between p-4 rounded-xl border-2 transition-all"
            style={{ borderColor: active ? color : '#E5EAF0', backgroundColor: active ? (id === 'lsb' ? '#F0FDFA' : '#EBF2FA') : 'white' }}>
            <div>
              <div className="font-display font-extrabold text-[22px]" style={{ color }}>{title}</div>
              <div className="font-sans text-[11px]" style={{ color: '#64748B' }}>{subtitle}</div>
            </div>
            {active && <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color }} />}
          </button>
        )
      })}
    </div>
  )
}

function Buttons({ onNext, disabled, onBack, nextLabel = 'Continue', hideBack }: {
  onNext: () => void; disabled: boolean; onBack?: () => void; nextLabel?: string; hideBack?: boolean
}) {
  return (
    <div className="mt-6 flex gap-3">
      {!hideBack && onBack && (
        <button type="button" onClick={onBack}
          className="h-12 px-5 rounded-xl border font-sans font-semibold text-[14px] flex items-center gap-1.5 transition-colors hover:bg-[#F4F7FB]"
          style={{ borderColor: '#E5EAF0', color: '#64748B' }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      <button type="button" onClick={onNext} disabled={disabled}
        className={cn('flex-1 h-12 rounded-xl font-sans font-bold text-[14px] flex items-center justify-center gap-2 transition-all',
          disabled ? 'cursor-not-allowed' : 'hover:opacity-90 hover:shadow-md hover:-translate-y-0.5')}
        style={{ background: disabled ? '#E5EAF0' : 'linear-gradient(135deg,#0F2D55,#0D9488)', color: disabled ? '#94A3B8' : 'white' }}>
        {nextLabel} {!disabled && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  )
}

function Shell({ title, sub, icon, children }: { title: string; sub: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">{icon}</div>
        <h2 className="font-display font-bold text-[22px] leading-tight mb-1" style={{ color: '#0F2D55' }}>{title}</h2>
        <p className="font-sans text-[14px]" style={{ color: '#64748B' }}>{sub}</p>
      </div>
      {children}
    </div>
  )
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={cn('flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all w-full hover:-translate-y-0.5',
        active ? 'border-[#0D9488] bg-[#F0FDFA] shadow-sm' : 'border-[#E5EAF0] bg-white hover:border-[#2DD4BF]')}>
      {children}
      {active && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" style={{ color: '#0D9488' }} />}
    </button>
  )
}

/* ─── Compare Modal ──────────────────────────────────────── */
function ComparePlanModal({ planIds, plans, getPremiumFn, onSelect, onClose }: {
  planIds: string[]
  plans: Plan[]
  getPremiumFn: (p: Plan) => number
  onSelect: (id: string) => void
  onClose: () => void
}) {
  const selected = planIds.map(id => plans.find(p => p.id === id)).filter(Boolean) as Plan[]

  const ROWS: { label: string; key: keyof Plan['highlights'] }[] = [
    { label: 'Annual Limit',       key: 'annualLimit' },
    { label: 'Territory',          key: 'territory' },
    { label: 'Consultation',       key: 'consultation' },
    { label: 'OP Annual Limit',    key: 'opLimit' },
    { label: 'Pharmacy Copay',     key: 'pharmacy' },
    { label: 'Pharmacy Sub-limit', key: 'pharmacySub' },
    { label: 'Dental',             key: 'dental' },
    { label: 'Optical',            key: 'optical' },
    { label: 'Maternity',          key: 'maternity' },
  ]

  const networkRank: Record<string, number> = { standard: 1, wide: 2, premium: 3 }

  return (
    <>
      <motion.div key="cov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60" onClick={onClose} />
      <motion.div key="cm" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-x-3 top-4 bottom-4 z-50 bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between shrink-0" style={{ borderColor: '#E5EAF0' }}>
          <div>
            <h2 className="font-display font-bold text-[18px]" style={{ color: '#0F2D55' }}>Side-by-Side Comparison</h2>
            <p className="font-sans text-[12px]" style={{ color: '#64748B' }}>Comparing {selected.length} plans</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F4F7FB]">
            <X className="w-4 h-4 text-[#64748B]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            {/* Plan headers */}
            <thead>
              <tr>
                <th className="w-40 px-4 py-4 text-left font-sans font-bold text-[11px] uppercase tracking-wide sticky left-0 bg-white"
                  style={{ color: '#94A3B8', borderBottom: '2px solid #E5EAF0' }}>Feature</th>
                {selected.map(p => {
                  const premium = getPremiumFn(p)
                  return (
                    <th key={p.id} className="px-4 py-4 text-left min-w-[200px]"
                      style={{ borderBottom: `2px solid ${p.recommended ? '#0D9488' : '#E5EAF0'}` }}>
                      <div className="flex items-center gap-2 mb-1">
                        {p.recommended && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: '#0D9488' }}>Most Popular</span>
                        )}
                        {p.tag && !p.recommended && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: p.tagColor ?? '#64748B' }}>{p.tag}</span>
                        )}
                      </div>
                      <p className="font-display font-extrabold text-[18px]" style={{ color: '#0F2D55' }}>{p.name}</p>
                      <p className="font-sans text-[11px]" style={{ color: '#64748B' }}>{p.insurer}</p>
                      <p className="font-display font-bold text-[20px] mt-1" style={{ color: '#0D9488' }}>
                        AED {premium.toLocaleString()}<span className="font-sans font-normal text-[11px] text-[#94A3B8]"> /yr</span>
                      </p>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {/* Network row */}
              <tr style={{ backgroundColor: '#F8FAFC' }}>
                <td className="px-4 py-3 font-sans font-semibold text-[12px] sticky left-0 bg-[#F8FAFC]" style={{ color: '#475569' }}>Network</td>
                {selected.map(p => {
                  const best = selected.reduce((a, b) => (networkRank[b.network] > networkRank[a.network] ? b : a))
                  return (
                    <td key={p.id} className="px-4 py-3">
                      <span className="font-sans font-semibold text-[12.5px]"
                        style={{ color: p.id === best.id ? '#0D9488' : '#475569' }}>
                        {p.networkLabel}
                        {p.id === best.id && <span className="ml-1.5 text-[10px]">★</span>}
                      </span>
                    </td>
                  )
                })}
              </tr>

              {/* Highlights rows */}
              {ROWS.map((row, ri) => {
                const vals = selected.map(p => p.highlights[row.key])
                const allSame = vals.every(v => v === vals[0])
                return (
                  <tr key={row.key} style={{ backgroundColor: ri % 2 === 0 ? 'white' : '#F8FAFC' }}>
                    <td className="px-4 py-3 font-sans font-semibold text-[12px] sticky left-0"
                      style={{ color: '#475569', backgroundColor: ri % 2 === 0 ? 'white' : '#F8FAFC' }}>{row.label}</td>
                    {selected.map((p, pi) => {
                      const v = p.highlights[row.key]
                      const isNotCovered = v === 'Not covered'
                      const isBest = !allSame && !isNotCovered && pi === vals.findIndex(x => x !== 'Not covered' && x === vals.reduce((a, b) =>
                        (a === 'Not covered' ? b : b === 'Not covered' ? a : a.length > b.length ? a : b)
                      ))
                      return (
                        <td key={p.id} className="px-4 py-3">
                          <span className="font-sans text-[12.5px]"
                            style={{ color: isNotCovered ? '#CBD5E1' : '#0F2D55', fontWeight: isBest ? 600 : 400 }}>
                            {isNotCovered ? '—' : v}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}

              {/* Key features row */}
              <tr>
                <td className="px-4 py-3 font-sans font-semibold text-[12px] sticky left-0 bg-white align-top pt-4" style={{ color: '#475569' }}>Key Features</td>
                {selected.map(p => (
                  <td key={p.id} className="px-4 py-3 align-top pt-4">
                    <div className="space-y-1.5">
                      {p.keyFeatures.slice(0, 4).map(f => (
                        <div key={f} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" style={{ color: '#0D9488' }} />
                          <span className="font-sans text-[11.5px]" style={{ color: '#475569' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t shrink-0 grid gap-3" style={{ borderColor: '#E5EAF0', gridTemplateColumns: `160px repeat(${selected.length}, 1fr)` }}>
          <div />
          {selected.map(p => (
            <button key={p.id} type="button" onClick={() => { onSelect(p.id); onClose() }}
              className="h-10 rounded-xl font-sans font-bold text-[13px] text-white transition-all hover:opacity-90"
              style={{ background: p.recommended ? 'linear-gradient(135deg,#0D9488,#0F2D55)' : 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
              Select {p.name}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  )
}

/* ─── Plan Listing (PolicyBazaar style) ──────────────────── */
type PlanTab = 'highlights' | 'exclusions' | 'split'

function PlanListingStep({ plans, emirate, salaryBand, depRelation, memberType, onSelect }: {
  plans: Plan[]
  emirate: string
  salaryBand: string
  depRelation: string
  memberType: string
  onSelect: (planId: string) => void
}) {
  const [sortBy, setSortBy] = useState<'price' | 'coverage' | 'popular'>('popular')
  const [filterNetwork, setFilterNetwork] = useState<string[]>([])
  const [filterFeatures, setFilterFeatures] = useState<string[]>([])
  const [activeTabs, setActiveTabs] = useState<Record<string, PlanTab>>({})
  const [compareList, setCompareList] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showCompare, setShowCompare] = useState(false)

  const emirateName: Record<string, string> = {
    dubai: 'Dubai', abudhabi: 'Abu Dhabi', sharjah: 'Sharjah',
    ajman: 'Ajman', rak: 'RAK', fujairah: 'Fujairah', uaq: 'UAQ',
  }

  const getTab = (id: string): PlanTab => activeTabs[id] ?? 'highlights'
  const setTab = (id: string, tab: PlanTab) => setActiveTabs(p => ({ ...p, [id]: tab }))

  const toggleCompare = (id: string) => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) :
      prev.length < 3 ? [...prev, id] : prev
    )
  }

  const toggleFilter = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  const getPremium = (p: Plan) => {
    const base = getPlanPremium(p, emirate, salaryBand)
    if (memberType === 'dependent') return calcDepPremium(base, depRelation)
    return base
  }

  const displayed = useMemo(() => {
    let list = [...plans]
    if (filterNetwork.length > 0) list = list.filter(p => filterNetwork.includes(p.network))
    if (filterFeatures.length > 0) list = list.filter(p => filterFeatures.every(f => p.features.includes(f)))
    if (sortBy === 'price') list.sort((a, b) => getPremium(a) - getPremium(b))
    else if (sortBy === 'coverage') {
      const limitVal = (s: string) => s === 'Unlimited' ? 9_999_999 : parseInt(s.replace(/\D/g, '')) || 0
      list.sort((a, b) => limitVal(b.highlights.annualLimit) - limitVal(a.highlights.annualLimit))
    } else {
      list.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0))
    }
    return list
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans, filterNetwork, filterFeatures, sortBy, salaryBand, memberType, depRelation])

  const networkColors: Record<string, string> = { standard: '#64748B', wide: '#0D9488', premium: '#7C3AED' }

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>Sort By</p>
        <div className="space-y-2">
          {([['popular', 'Most Popular'], ['price', 'Lowest Price'], ['coverage', 'Best Coverage']] as const).map(([v, l]) => (
            <label key={v} className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                style={{ borderColor: sortBy === v ? '#0D9488' : '#CBD5E1' }}
                onClick={() => setSortBy(v)}>
                {sortBy === v && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0D9488' }} />}
              </div>
              <span className="font-sans text-[13px]" style={{ color: '#475569' }}>{l}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>Network</p>
        <div className="space-y-2">
          {([['standard', 'Standard'], ['wide', 'Wide UAE'], ['premium', 'Premium Worldwide']] as const).map(([v, l]) => (
            <label key={v} className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                style={{ borderColor: filterNetwork.includes(v) ? '#0D9488' : '#CBD5E1', backgroundColor: filterNetwork.includes(v) ? '#0D9488' : 'white' }}
                onClick={() => toggleFilter(filterNetwork, setFilterNetwork, v)}>
                {filterNetwork.includes(v) && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
              </div>
              <span className="font-sans text-[13px]" style={{ color: '#475569' }}>{l}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>Coverage Includes</p>
        <div className="space-y-2">
          {([['dental', 'Dental'], ['optical', 'Optical'], ['maternity', 'Maternity'], ['worldwide', 'Worldwide']] as const).map(([v, l]) => (
            <label key={v} className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                style={{ borderColor: filterFeatures.includes(v) ? '#0D9488' : '#CBD5E1', backgroundColor: filterFeatures.includes(v) ? '#0D9488' : 'white' }}
                onClick={() => toggleFilter(filterFeatures, setFilterFeatures, v)}>
                {filterFeatures.includes(v) && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
              </div>
              <span className="font-sans text-[13px]" style={{ color: '#475569' }}>{l}</span>
            </label>
          ))}
        </div>
      </div>
      {(filterNetwork.length > 0 || filterFeatures.length > 0) && (
        <button type="button" onClick={() => { setFilterNetwork([]); setFilterFeatures([]) }}
          className="w-full h-9 rounded-lg border font-sans text-[12.5px] font-semibold transition-colors hover:bg-[#F4F7FB]"
          style={{ borderColor: '#E5EAF0', color: '#64748B' }}>
          Clear filters
        </button>
      )}
    </div>
  )

    return (
      <div>
        {/* Compare modal */}
        <AnimatePresence>
          {showCompare && compareList.length >= 2 && (
            <ComparePlanModal
              planIds={compareList}
              plans={plans}
              getPremiumFn={getPremium}
              onSelect={id => { onSelect(id); setShowCompare(false) }}
              onClose={() => setShowCompare(false)}
            />
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2 font-sans font-semibold text-[12px]"
            style={{ backgroundColor: '#F0FDFA', color: '#0D9488', border: '1px solid #CCFBF1' }}>
            Plans for {emirateName[emirate] ?? emirate}
            {emirate === 'dubai' && salaryBand ? ` · ${salaryBand.toUpperCase()}` : ''}
          </div>
          <h2 className="font-display font-bold text-[22px]" style={{ color: '#0F2D55' }}>
            {displayed.length} plans available
          </h2>
          <p className="font-sans text-[13px]" style={{ color: '#64748B' }}>Compare and select the right plan for you</p>
        </div>
        {/* Mobile filter toggle */}
        <button type="button" onClick={() => setShowFilters(true)}
          className="sm:hidden flex items-center gap-2 px-3 py-2 rounded-xl border font-sans font-semibold text-[12.5px]"
          style={{ borderColor: '#E5EAF0', color: '#475569' }}>
          <SlidersHorizontal className="w-4 h-4" /> Filters
          {(filterNetwork.length + filterFeatures.length) > 0 && (
            <span className="w-4 h-4 rounded-full text-[10px] text-white flex items-center justify-center" style={{ backgroundColor: '#0D9488' }}>
              {filterNetwork.length + filterFeatures.length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40" onClick={() => setShowFilters(false)} />
            <motion.div key="dr" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 inset-y-0 z-50 w-72 bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <p className="font-sans font-bold text-[15px]" style={{ color: '#0F2D55' }}>Filters</p>
                <button type="button" onClick={() => setShowFilters(false)}><X className="w-5 h-5 text-[#64748B]" /></button>
              </div>
              <FilterPanel />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <div className="hidden sm:block w-[210px] shrink-0">
          <div className="sticky top-[120px] bg-white rounded-2xl border p-5" style={{ borderColor: '#E5EAF0' }}>
            <FilterPanel />
          </div>
        </div>

        {/* Plan cards */}
        <div className={cn('flex-1 space-y-4 min-w-0', compareList.length > 0 ? 'pb-20' : 'pb-4')}>
          {displayed.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: '#E5EAF0' }}>
              <p className="font-sans font-bold text-[16px] mb-2" style={{ color: '#0F2D55' }}>No plans match your filters</p>
              <button type="button" onClick={() => { setFilterNetwork([]); setFilterFeatures([]) }}
                className="font-sans font-semibold text-[13px]" style={{ color: '#0D9488' }}>Clear all filters</button>
            </div>
          ) : displayed.map(plan => {
            const premium = getPremium(plan)
            const tab = getTab(plan.id)
            const inCompare = compareList.includes(plan.id)
            return (
              <div key={plan.id} className={cn('bg-white rounded-2xl border-2 overflow-hidden transition-all',
                plan.recommended ? 'border-[#0D9488]' : 'border-[#E5EAF0]')}>

                {/* Card header */}
                <div className="px-5 pt-4 pb-3 border-b" style={{ borderColor: '#F1F5F9' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-sans font-bold text-[11px] px-2 py-0.5 rounded"
                          style={{ backgroundColor: '#F1F5F9', color: networkColors[plan.network] }}>
                          {plan.networkLabel}
                        </span>
                        {plan.tag && (
                          <span className="relative inline-flex items-center font-sans font-bold text-[10px] px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: plan.tagColor ?? '#0D9488' }}>
                            {plan.recommended && (
                              <span className="absolute inset-0 rounded-full animate-ping opacity-40"
                                style={{ backgroundColor: plan.tagColor ?? '#0D9488' }} />
                            )}
                            {plan.tag}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-extrabold text-[20px]" style={{ color: '#0F2D55' }}>{plan.name}</h3>
                      <p className="font-sans text-[12px]" style={{ color: '#64748B' }}>{plan.insurer}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display font-extrabold text-[26px] leading-none" style={{ color: '#0F2D55' }}>
                          AED {premium.toLocaleString()}
                        </span>
                        <span className="font-sans font-semibold text-[12px]" style={{ color: '#94A3B8' }}>/yr</span>
                      </div>
                      <div className="font-sans text-[10.5px]" style={{ color: '#94A3B8' }}>excl. Beamah &amp; VAT</div>
                    </div>
                  </div>
                </div>

                {/* Key benefits row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-b" style={{ borderColor: '#F1F5F9' }}>
                  {[
                    { label: 'Annual Limit', value: plan.highlights.annualLimit },
                    { label: 'Consultation', value: plan.highlights.consultation },
                    { label: 'Pharmacy', value: plan.highlights.pharmacy },
                    { label: 'Dental', value: plan.highlights.dental },
                  ].map((item, i) => (
                    <div key={i} className={cn('px-4 py-3', i < 3 ? 'border-r' : '')} style={{ borderColor: '#F1F5F9' }}>
                      <p className="font-sans text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#94A3B8' }}>{item.label}</p>
                      <p className="font-sans font-bold text-[12.5px]" style={{ color: item.value === 'Not covered' ? '#94A3B8' : '#0F2D55' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div className="border-b" style={{ borderColor: '#F1F5F9' }}>
                  <div className="flex">
                    {(['highlights', 'exclusions', 'split'] as const).map(t => (
                      <button key={t} type="button" onClick={() => setTab(plan.id, t)}
                        className="px-5 py-2.5 font-sans font-semibold text-[12px] border-b-2 transition-all capitalize"
                        style={{
                          borderColor: tab === t ? '#0D9488' : 'transparent',
                          color: tab === t ? '#0D9488' : '#64748B',
                        }}>
                        {t === 'split' ? 'Member Split' : t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab content */}
                <div className="px-5 py-4">
                  {tab === 'highlights' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                      {plan.keyFeatures.map(f => (
                        <div key={f} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#0D9488' }} />
                          <span className="font-sans text-[12.5px]" style={{ color: '#475569' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {tab === 'exclusions' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                      {plan.exclusions.map(e => (
                        <div key={e} className="flex items-start gap-2">
                          <X className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
                          <span className="font-sans text-[12.5px]" style={{ color: '#475569' }}>{e}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {tab === 'split' && (
                    <div className="space-y-2">
                      {[
                        { label: 'Self', mult: 1.0 },
                        { label: 'Spouse', mult: 0.85 },
                        { label: 'Child (per child)', mult: 0.60 },
                        { label: 'Parent', mult: 1.20 },
                      ].map(({ label, mult }) => (
                        <div key={label} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: '#F1F5F9' }}>
                          <span className="font-sans text-[13px]" style={{ color: '#475569' }}>{label}</span>
                          <span className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>
                            AED {Math.round(premium * mult).toLocaleString()} / yr
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card footer */}
                <div className="px-5 pb-4 flex items-center justify-between gap-3 flex-wrap">
                  <button type="button" onClick={() => toggleCompare(plan.id)}
                    className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all"
                      style={{ borderColor: inCompare ? '#0F2D55' : '#CBD5E1', backgroundColor: inCompare ? '#0F2D55' : 'white' }}>
                      {inCompare && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="font-sans text-[12.5px] group-hover:underline" style={{ color: inCompare ? '#0F2D55' : '#475569', fontWeight: inCompare ? 600 : 400 }}>
                      {inCompare ? 'Remove' : 'Add to Compare'}
                    </span>
                  </button>
                  <div className="flex items-center gap-2 ml-auto">
                    <button type="button"
                      className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border font-sans font-semibold text-[12.5px] transition-colors hover:bg-[#F4F7FB]"
                      style={{ borderColor: '#E5EAF0', color: '#475569' }}>
                      <Download className="w-3.5 h-3.5" /> Download Benefits
                    </button>
                    <button type="button" onClick={() => onSelect(plan.id)}
                      className="flex items-center gap-1.5 h-9 px-5 rounded-xl font-sans font-bold text-[13px] text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
                      Select Plan <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Compare bar */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t shadow-xl"
            style={{ backgroundColor: '#0F2D55', borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="max-w-[860px] mx-auto px-5 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-sans font-semibold text-[13px] text-white/70">Comparing:</span>
                {compareList.map(id => {
                  const p = PLANS.find(pl => pl.id === id)
                  return p ? (
                    <div key={id} className="flex items-center gap-1.5 px-3 py-1 rounded-lg font-sans font-semibold text-[12px]"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                      {p.name}
                      <button type="button" onClick={() => toggleCompare(id)}><X className="w-3 h-3 text-white/60" /></button>
                    </div>
                  ) : null
                })}
              </div>
              <button type="button" onClick={() => setShowCompare(true)}
                className="flex items-center gap-1.5 h-9 px-4 rounded-xl font-sans font-bold text-[12.5px] text-white shrink-0 transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#0D9488,#2DD4BF)' }}>
                Compare {compareList.length} Plans
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Quote Summary (Liva style) ─────────────────────────── */
function QuoteSummaryStep({ data, plan, premium, goNext, goBack }: {
  data: QuoteData; plan: Plan; premium: number; goNext: () => void; goBack: () => void
}) {
  const beamah = calcBeamah(premium)
  const vat = calcVAT(premium, beamah)
  const grand = calcGrandTotal(premium)
  const today = new Date()
  const policyEnd = new Date(today); policyEnd.setFullYear(today.getFullYear() + 1)
  const fmt = (d: Date) => `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`

  const quoteSummaryRows = [
    ['Quotation Number', data.quoteNumber],
    ['Insurance Company', plan.insurer],
    ['Client Name', data.name || '—'],
    ['Policy Period', `${fmt(today)} to ${fmt(policyEnd)}`],
    ['TPA', 'Inayah Health'],
    ['Broker Name', 'InsureAE L.L.C'],
    ['Issued Date', fmt(today)],
  ]

  const productRows = [
    ['Network Name', plan.networkLabel],
    ['Territorial Scope of Coverage', plan.highlights.territory],
    ['Aggregate Annual Limit', plan.highlights.annualLimit],
    ['Consultation Deductible', plan.highlights.consultation],
    ['OP Pharmacy Copay', plan.highlights.pharmacy],
    ['OP Pharmacy Sub-Limit', plan.highlights.pharmacySub],
    ['Diagnostics (X-ray, MRI, CT-Scan)', 'Covered — Nil copay'],
    ['Dental Benefit', plan.highlights.dental],
    ['Optical Benefit', plan.highlights.optical],
  ]

  const premiumRows: [string, string, boolean][] = [
    ['Total Premium', `AED ${premium.toLocaleString()}`, false],
    ['Beamah (Solidarity Contribution)', `AED ${beamah.toFixed(2)}`, false],
    ['ICP', 'AED 0.00', false],
    ['VAT (5%)', `AED ${vat.toFixed(2)}`, false],
    ['Grand Total', `AED ${grand.toFixed(2)}`, true],
  ]

  return (
    <div>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 font-sans font-semibold text-[12px]"
          style={{ backgroundColor: '#F0FDFA', color: '#0D9488', border: '1px solid #CCFBF1' }}>
          Quote Summary
        </div>
        <h2 className="font-display font-bold text-[24px] mb-1" style={{ color: '#0F2D55' }}>Review Your Quote</h2>
        <p className="font-sans text-[14px]" style={{ color: '#64748B' }}>Confirm the details before proceeding to policyholder information</p>
      </div>

      {/* Quote info table */}
      <div className="bg-white rounded-2xl border overflow-hidden mb-4" style={{ borderColor: '#E5EAF0' }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: '#E5EAF0', backgroundColor: '#F8FAFC' }}>
          <p className="font-sans font-bold text-[12px] uppercase tracking-widest" style={{ color: '#94A3B8' }}>Quote Summary</p>
        </div>
        <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
          {quoteSummaryRows.map(([label, value]) => (
            <div key={label} className="flex px-5 py-2.5">
              <span className="font-sans text-[13px] w-44 shrink-0" style={{ color: '#64748B' }}>{label}</span>
              <span className="font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Product details */}
      <div className="bg-white rounded-2xl border overflow-hidden mb-4" style={{ borderColor: '#E5EAF0' }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: '#E5EAF0', backgroundColor: '#F8FAFC' }}>
          <p className="font-sans font-bold text-[12px] uppercase tracking-widest" style={{ color: '#94A3B8' }}>Product Details</p>
        </div>
        <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
          {productRows.map(([label, value]) => (
            <div key={label} className="flex px-5 py-2.5">
              <span className="font-sans text-[13px] w-56 shrink-0" style={{ color: '#64748B' }}>{label}</span>
              <span className="font-sans font-semibold text-[13px]" style={{ color: '#0F2D55' }}>: {value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Premium details */}
      <div className="bg-white rounded-2xl border overflow-hidden mb-5" style={{ borderColor: '#E5EAF0' }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: '#E5EAF0', backgroundColor: '#F8FAFC' }}>
          <p className="font-sans font-bold text-[12px] uppercase tracking-widest" style={{ color: '#94A3B8' }}>Premium Details</p>
        </div>
        <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
          {premiumRows.map(([label, value, bold]) => (
            <div key={label} className="flex justify-between px-5 py-2.5" style={{ backgroundColor: bold ? '#F0FDFA' : 'white' }}>
              <span className="font-sans text-[13px]" style={{ color: bold ? '#0D9488' : '#64748B', fontWeight: bold ? 700 : 400 }}>{label}</span>
              <span className="font-sans text-[13px]" style={{ color: bold ? '#0D9488' : '#0F2D55', fontWeight: bold ? 700 : 600 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button type="button" onClick={goBack}
          className="h-12 px-5 rounded-xl border font-sans font-semibold text-[14px] flex items-center gap-1.5 transition-colors hover:bg-[#F4F7FB]"
          style={{ borderColor: '#E5EAF0', color: '#64748B' }}>
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button type="button"
          className="h-12 px-5 rounded-xl border font-sans font-semibold text-[13px] flex items-center gap-2 transition-colors hover:bg-[#F4F7FB]"
          style={{ borderColor: '#E5EAF0', color: '#475569' }}>
          <Download className="w-4 h-4" /> Download TOB PDF
        </button>
        <button type="button" onClick={goNext}
          className="flex-1 h-12 rounded-xl font-sans font-bold text-[14px] text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/* ─── Policyholder Form ──────────────────────────────────── */
function PolicyholderStep({ data, set, goNext, goBack }: {
  data: QuoteData
  set: <K extends keyof QuoteData>(k: K, v: QuoteData[K]) => void
  goNext: () => void
  goBack: () => void
}) {
  const toggleCondition = (field: 'phChronicConditions' | 'phCriticalConditions', val: string) => {
    const current = data[field] as string[]
    const next = current.includes(val) ? current.filter(x => x !== val) : [...current, val]
    set(field, next)
  }

  const valid = data.phPassport && data.phMemberType && data.phEmiratesOfVisa && data.phFileNumber

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">📋</div>
        <h2 className="font-display font-bold text-[22px] leading-tight mb-1" style={{ color: '#0F2D55' }}>Policyholder Details</h2>
        <p className="font-sans text-[14px]" style={{ color: '#64748B' }}>Complete mandatory information for your DHA-compliant policy</p>
      </div>

      {/* Identity section */}
      <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5EAF0' }}>
        <p className="font-sans font-bold text-[11px] uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>Identity & Personal</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="First Name (as in Passport)">
            <input type="text" value={data.name} readOnly
              className={INP + " bg-[#F8FAFC]"} style={{ borderColor: '#E5EAF0', color: '#0F2D55' }} />
          </FormField>
          <FormField label="Second Name">
            <input type="text" value={data.phSecondName} placeholder="Middle name"
              onChange={e => set('phSecondName', e.target.value)}
              className={INP} style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
          </FormField>
          <FormField label="Last Name (as in Passport)" required>
            <input type="text" value={data.phLastName} placeholder="Family name"
              onChange={e => set('phLastName', e.target.value)}
              className={INP} style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
          </FormField>
          <FormField label="Emirates ID">
            <input type="text" value={data.eid} readOnly
              className={INP + " bg-[#F8FAFC]"} style={{ borderColor: '#E5EAF0', color: '#0F2D55' }} />
          </FormField>
          <FormField label="Passport Number" required>
            <input type="text" value={data.phPassport} placeholder="Passport no."
              onChange={e => set('phPassport', e.target.value)}
              className={INP} style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
          </FormField>
          <FormField label="UID Number">
            <input type="text" value={data.phUid} placeholder="UID"
              onChange={e => set('phUid', e.target.value)}
              className={INP} style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
          </FormField>
          <FormField label="Date of Birth">
            <input type="date" value={data.dob} readOnly
              className={INP + " bg-[#F8FAFC]"} style={{ borderColor: '#E5EAF0', color: '#0F2D55' }} />
          </FormField>
          <FormField label="Gender">
            <input type="text" value={data.gender} readOnly
              className={INP + " bg-[#F8FAFC] capitalize"} style={{ borderColor: '#E5EAF0', color: '#0F2D55' }} />
          </FormField>
          <FormField label="Nationality">
            <input type="text" value={data.nationality} readOnly
              className={INP + " bg-[#F8FAFC]"} style={{ borderColor: '#E5EAF0', color: '#0F2D55' }} />
          </FormField>
          <FormField label="Marital Status">
            <input type="text" value={data.maritalStatus} readOnly
              className={INP + " bg-[#F8FAFC] capitalize"} style={{ borderColor: '#E5EAF0', color: '#0F2D55' }} />
          </FormField>
          <FormField label="Occupation">
            <input type="text" value={data.phOccupation} placeholder="Your occupation"
              onChange={e => set('phOccupation', e.target.value)}
              className={INP} style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
          </FormField>
          <FormField label="Birth Certificate ID">
            <input type="text" value={data.phBirthCertId} placeholder="If applicable"
              onChange={e => set('phBirthCertId', e.target.value)}
              className={INP} style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
          </FormField>
        </div>
      </div>

      {/* Visa & Work section */}
      <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5EAF0' }}>
        <p className="font-sans font-bold text-[11px] uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>Visa & Work Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Emirate of VISA Issuance" required>
            <select value={data.phEmiratesOfVisa} onChange={e => set('phEmiratesOfVisa', e.target.value)}
              className={INP + " appearance-none"} style={{ borderColor: '#E5EAF0', color: data.phEmiratesOfVisa ? '#0F2D55' : '#94A3B8' }}>
              <option value="">Select emirate</option>
              {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'Fujairah', 'UAQ'].map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </FormField>
          <FormField label="Emirates of Residency">
            <select value={data.phEmiratesOfResidency} onChange={e => set('phEmiratesOfResidency', e.target.value)}
              className={INP + " appearance-none"} style={{ borderColor: '#E5EAF0', color: data.phEmiratesOfResidency ? '#0F2D55' : '#94A3B8' }}>
              <option value="">Select emirate</option>
              {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'Fujairah', 'UAQ'].map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </FormField>
          <FormField label="Emirate of Work">
            <select value={data.phEmirateOfWork} onChange={e => set('phEmirateOfWork', e.target.value)}
              className={INP + " appearance-none"} style={{ borderColor: '#E5EAF0', color: data.phEmirateOfWork ? '#0F2D55' : '#94A3B8' }}>
              <option value="">Select emirate</option>
              {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'Fujairah', 'UAQ'].map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </FormField>
          <FormField label="Work Location">
            <input type="text" value={data.phWorkLocation} placeholder="Company / work location"
              onChange={e => set('phWorkLocation', e.target.value)}
              className={INP} style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
          </FormField>
          <FormField label="Salary Band/Month" required>
            <select value={data.salaryBand || data.memberType === 'dependent' ? '' : data.salaryBand}
              onChange={e => set('salaryBand', e.target.value)}
              className={INP + " appearance-none"} style={{ borderColor: '#E5EAF0', color: '#0F2D55' }}>
              <option value="">Select salary band</option>
              <option value="lsb">LSB — Up to AED 4,000/month</option>
              <option value="nlsb">NLSB — Above AED 4,000/month</option>
            </select>
          </FormField>
          <FormField label="Member Type" required>
            <select value={data.phMemberType} onChange={e => set('phMemberType', e.target.value)}
              className={INP + " appearance-none"} style={{ borderColor: '#E5EAF0', color: data.phMemberType ? '#0F2D55' : '#94A3B8' }}>
              <option value="">Select type</option>
              {['Principal', 'Spouse', 'Child', 'Parent'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="File Number" required>
            <input type="text" value={data.phFileNumber} placeholder="Policy file number"
              onChange={e => set('phFileNumber', e.target.value)}
              className={INP} style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
          </FormField>
        </div>
      </div>

      {/* Special conditions */}
      <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5EAF0' }}>
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="font-sans font-bold text-[13.5px]" style={{ color: '#0F2D55' }}>Special Conditions / Pre-existing Diseases</p>
            <p className="font-sans text-[12px]" style={{ color: '#64748B' }}>Disclosure required by UAE Insurance Authority</p>
          </div>
          <button type="button" onClick={() => set('phHasSpecialConditions', !data.phHasSpecialConditions)}
            className="relative w-11 h-6 rounded-full transition-all shrink-0 ml-4"
            style={{ backgroundColor: data.phHasSpecialConditions ? '#EF4444' : '#CBD5E1' }}>
            <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
              style={{ left: data.phHasSpecialConditions ? '22px' : '2px' }} />
          </button>
        </div>
        {data.phHasSpecialConditions && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="mt-5 pt-5 border-t space-y-6" style={{ borderColor: '#E5EAF0' }}>
            <div>
              <p className="font-sans font-bold text-[13px] mb-3" style={{ color: '#0F2D55' }}>
                Have you been diagnosed / treated for any Chronic condition?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
                {CHRONIC_CONDITIONS.map(c => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0"
                      style={{ borderColor: data.phChronicConditions.includes(c) ? '#0D9488' : '#CBD5E1', backgroundColor: data.phChronicConditions.includes(c) ? '#0D9488' : 'white' }}
                      onClick={() => toggleCondition('phChronicConditions', c)}>
                      {data.phChronicConditions.includes(c) && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="font-sans text-[12px]" style={{ color: '#475569' }}>{c}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="font-sans font-bold text-[13px] mb-3" style={{ color: '#0F2D55' }}>
                Have you been diagnosed / treated for any Critical cases?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
                {CRITICAL_CONDITIONS.map(c => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0"
                      style={{ borderColor: data.phCriticalConditions.includes(c) ? '#0D9488' : '#CBD5E1', backgroundColor: data.phCriticalConditions.includes(c) ? '#0D9488' : 'white' }}
                      onClick={() => toggleCondition('phCriticalConditions', c)}>
                      {data.phCriticalConditions.includes(c) && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="font-sans text-[12px]" style={{ color: '#475569' }}>{c}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p className="font-sans text-[12px]" style={{ color: '#DC2626' }}>
                Declaration: I confirm that the above information is true and correct. Non-disclosure may result in claim rejection or policy cancellation.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* GDRFA Validation */}
      <GdfraSaveButton valid={!!valid} onBack={goBack} onSuccess={goNext} />
    </div>
  )
}

function GdfraSaveButton({ valid, onBack, onSuccess }: { valid: boolean; onBack: () => void; onSuccess: () => void }) {
  const [state, setState] = useState<'idle' | 'validating' | 'done'>('idle')

  function handleClick() {
    if (!valid || state !== 'idle') return
    setState('validating')
    setTimeout(() => { setState('done'); setTimeout(onSuccess, 600) }, 2200)
  }

  return (
    <div className="mt-6">
      {state === 'done' && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl mb-3 font-sans font-semibold text-[13px]"
          style={{ backgroundColor: '#F0FDFA', border: '1px solid #CCFBF1', color: '#0A7A72' }}>
          <CheckCircle2 className="w-4 h-4 shrink-0" /> GDRFA validation successful
        </motion.div>
      )}
      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="h-12 px-5 rounded-xl border font-sans font-semibold text-[14px] flex items-center gap-1.5 transition-colors hover:bg-[#F4F7FB]"
          style={{ borderColor: '#E5EAF0', color: '#64748B' }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button type="button" onClick={handleClick} disabled={!valid || state === 'validating'}
          className={cn('flex-1 h-12 rounded-xl font-sans font-bold text-[14px] flex items-center justify-center gap-2 transition-all',
            !valid || state === 'validating' ? 'cursor-not-allowed' : 'hover:opacity-90 hover:shadow-md hover:-translate-y-0.5')}
          style={{ background: !valid ? '#E5EAF0' : 'linear-gradient(135deg,#0F2D55,#0D9488)', color: !valid ? '#94A3B8' : 'white' }}>
          {state === 'validating' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Validating with GDRFA…</>
          ) : (
            <>GDRFA Validation &amp; Save Details <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  )
}

/* ─── Success Step ───────────────────────────────────────── */
function SuccessStep({ data, plan, premium }: {
  data: QuoteData; plan: Plan; premium: number
}) {
  const beamah = calcBeamah(premium)
  const vat = calcVAT(premium, beamah)
  const grand = calcGrandTotal(premium)
  const today = new Date()
  const policyEnd = new Date(today); policyEnd.setFullYear(today.getFullYear() + 1)
  const fmt = (d: Date) => `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`

  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4,0,0.2,1] as [number,number,number,number] }}
      className="text-center">

      {/* Success icon */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ backgroundColor: '#0D9488' }} />
        <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
      </div>

      <h2 className="font-display font-extrabold text-[28px] mb-2" style={{ color: '#0F2D55' }}>
        Quote Sent Successfully!
      </h2>
      <p className="font-sans text-[15px] mb-1" style={{ color: '#64748B' }}>
        Your quote has been generated and sent to your email
      </p>
      <p className="font-sans font-bold text-[15px] mb-8" style={{ color: '#0D9488' }}>
        Reference: {data.quoteNumber}
      </p>

      {/* Summary card */}
      <div className="bg-white rounded-2xl border text-left mb-6 overflow-hidden" style={{ borderColor: '#E5EAF0' }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: '#E5EAF0', background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
          <p className="font-display font-bold text-[15px] text-white">{plan.name} — {plan.insurer}</p>
          <p className="font-sans text-[12px] text-white/70">{plan.networkLabel}</p>
        </div>
        <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
          {[
            ['Client Name', data.name || '—'],
            ['Quotation Number', data.quoteNumber],
            ['Policy Period', `${fmt(today)} to ${fmt(policyEnd)}`],
            ['Annual Limit', plan.highlights.annualLimit],
            ['Territory', plan.highlights.territory],
            ['Base Premium', `AED ${premium.toLocaleString()}`],
            ['Beamah', `AED ${beamah.toFixed(2)}`],
            ['VAT (5%)', `AED ${vat.toFixed(2)}`],
            ['Grand Total', `AED ${grand.toFixed(2)}`],
          ].map(([l, v], i) => (
            <div key={l} className="flex justify-between items-center px-5 py-2.5"
              style={{ backgroundColor: i === 8 ? '#F0FDFA' : 'white' }}>
              <span className="font-sans text-[13px]" style={{ color: '#64748B' }}>{l}</span>
              <span className="font-sans font-bold text-[13px]" style={{ color: i === 8 ? '#0D9488' : '#0F2D55' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact confirmations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-white" style={{ borderColor: '#E5EAF0' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#F0FDFA' }}>
            <Mail className="w-4 h-4" style={{ color: '#0D9488' }} />
          </div>
          <div>
            <p className="font-sans font-bold text-[12px]" style={{ color: '#0F2D55' }}>Quote emailed to</p>
            <p className="font-sans text-[12px]" style={{ color: '#64748B' }}>{data.email || '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-white" style={{ borderColor: '#E5EAF0' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#F0FDFA' }}>
            <Phone className="w-4 h-4" style={{ color: '#0D9488' }} />
          </div>
          <div>
            <p className="font-sans font-bold text-[12px]" style={{ color: '#0F2D55' }}>Advisor will contact</p>
            <p className="font-sans text-[12px]" style={{ color: '#64748B' }}>+971 {data.mobile || '—'}</p>
          </div>
        </div>
      </div>

      {/* WhatsApp share */}
      <a href={`https://wa.me/?text=${encodeURIComponent(`My InsureAE Quote ✅\n\nRef: ${data.quoteNumber}\nPlan: ${plan.name} by ${plan.insurer}\nPremium: AED ${premium.toLocaleString()}/yr\nAnnual Limit: ${plan.highlights.annualLimit}\n\nGenerated at https://insuranceuae.vercel.app`)}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-sans font-bold text-[14px] text-white mb-4 transition-all hover:opacity-90 hover:-translate-y-0.5"
        style={{ backgroundColor: '#25D366' }}>
        <MessageCircle className="w-5 h-5" /> Share via WhatsApp
      </a>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href="/broker"
          className="flex items-center justify-center gap-2 h-12 px-8 rounded-xl font-sans font-bold text-[14px] text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
          View My Dashboard <ArrowRight className="w-4 h-4" />
        </a>
        <a href="/quote/health"
          className="flex items-center justify-center gap-2 h-12 px-8 rounded-xl font-sans font-semibold text-[14px] border transition-colors hover:bg-[#F4F7FB]"
          style={{ borderColor: '#E5EAF0', color: '#475569' }}>
          New Quote
        </a>
      </div>
    </motion.div>
  )
}

/* ─── Main Component ─────────────────────────────────────── */
export default function HealthQuoteFlow() {
  const searchParams = useSearchParams()

  const [step, setStep] = useState<StepId>('emirate')
  const [data, setData] = useState<QuoteData>({
    emirate: searchParams.get('emirate') || '',
    name: '', email: '', mobile: '', eid: '', dob: '', nationality: '', gender: '', maritalStatus: '',
    memberType: '',
    salaryBand: '', hasExistingPolicy: false, existingInsurer: '', existingExpiry: '',
    depName: '', depDob: '', depNationality: '', depGender: '', depRelation: '',
    depHasExistingPolicy: false, depExistingInsurer: '', depExistingExpiry: '',
    planId: '', quoteNumber: '',
    phSecondName: '', phLastName: '', phPassport: '', phOccupation: '', phMemberType: '',
    phEmiratesOfVisa: '', phEmiratesOfResidency: '', phEmirateOfWork: '', phWorkLocation: '',
    phFileNumber: '', phUid: '', phBirthCertId: '',
    phHasSpecialConditions: false, phChronicConditions: [], phCriticalConditions: [],
  })

  const set = useCallback(<K extends keyof QuoteData>(k: K, v: QuoteData[K]) =>
    setData(prev => ({ ...prev, [k]: v })), [])

  const isDubai = data.emirate === 'dubai'

  const emirateName: Record<string, string> = {
    dubai: 'Dubai', abudhabi: 'Abu Dhabi', sharjah: 'Sharjah',
    ajman: 'Ajman', rak: 'RAK', fujairah: 'Fujairah', uaq: 'UAQ',
  }

  function getSteps(): StepId[] {
    const s: StepId[] = ['emirate', 'basic_details']
    if (!data.emirate) return s
    if (isDubai) {
      s.push('member_type')
      if (data.memberType === 'self') s.push('self_details')
      else if (data.memberType === 'dependent') s.push('dependent_details')
    }
    s.push('plan_listing', 'quote_summary', 'policyholder', 'payment')
    return s
  }

  const steps = getSteps()
  const stepIdx = steps.indexOf(step)

  const SECTIONS: string[] = !isDubai
    ? ['City', 'Details', 'Plans', 'Summary', 'Policy', 'Pay']
    : data.memberType === 'dependent'
      ? ['City', 'Details', 'Type', 'Dependent', 'Plans', 'Summary', 'Policy', 'Pay']
      : ['City', 'Details', 'Type', 'Salary', 'Plans', 'Summary', 'Policy', 'Pay']

  const SECTION_STEPS: StepId[][] = !isDubai
    ? [['emirate'], ['basic_details'], ['plan_listing'], ['quote_summary'], ['policyholder'], ['payment']]
    : data.memberType === 'dependent'
      ? [['emirate'], ['basic_details'], ['member_type'], ['dependent_details'], ['plan_listing'], ['quote_summary'], ['policyholder'], ['payment']]
      : [['emirate'], ['basic_details'], ['member_type'], ['self_details'], ['plan_listing'], ['quote_summary'], ['policyholder'], ['payment']]

  function goNext() {
    const next = steps[steps.indexOf(step) + 1]
    if (next) setStep(next)
  }
  function goBack() {
    const prev = steps[steps.indexOf(step) - 1]
    if (prev) setStep(prev)
  }

  const availablePlans = getAvailablePlans(data.emirate, data.salaryBand)
  const selectedPlan = PLANS.find(p => p.id === data.planId)
  const selectedPremium = selectedPlan
    ? (() => {
        const base = getPlanPremium(selectedPlan, data.emirate, data.salaryBand)
        return data.memberType === 'dependent' ? calcDepPremium(base, data.depRelation) : base
      })()
    : 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F7FB' }}>

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40" style={{ borderColor: '#E5EAF0' }}>
        <div className="max-w-[1000px] mx-auto px-5 h-14 flex items-center justify-between">
          <Logo size={30} />
          <div className="flex items-center gap-4">
            <a href="tel:+97180047867" className="hidden sm:flex items-center gap-1.5 font-sans text-[13px] font-semibold" style={{ color: '#0D9488' }}>
              📞 800-INSURE
            </a>
            <div className="flex items-center gap-1.5 font-sans text-[12px]" style={{ color: '#64748B' }}>
              <Shield className="w-3.5 h-3.5" style={{ color: '#0D9488' }} /> IA Licensed
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="bg-white border-b" style={{ borderColor: '#E5EAF0' }}>
        <div className="max-w-[1000px] mx-auto px-5 py-3">
          {/* Mobile: step counter pill */}
          <div className="sm:hidden flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-1 rounded-full font-sans font-bold text-[12px] text-white"
                style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
                Step {SECTION_STEPS.findIndex(ss => ss.includes(step)) + 1} of {SECTIONS.length}
              </div>
              <span className="font-sans font-semibold text-[12px]" style={{ color: '#0F2D55' }}>
                {SECTIONS[SECTION_STEPS.findIndex(ss => ss.includes(step))]}
              </span>
            </div>
            <span className="font-sans text-[11px]" style={{ color: '#94A3B8' }}>
              {Math.round(((SECTION_STEPS.findIndex(ss => ss.includes(step))) / (SECTIONS.length - 1)) * 100)}% complete
            </span>
          </div>
          {/* Mobile progress bar */}
          <div className="sm:hidden h-1.5 rounded-full mb-1" style={{ backgroundColor: '#E5EAF0' }}>
            <div className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.round(((SECTION_STEPS.findIndex(ss => ss.includes(step))) / (SECTIONS.length - 1)) * 100)}%`, background: 'linear-gradient(90deg,#0F2D55,#0D9488)' }} />
          </div>
          {/* Desktop: dot track */}
          <div className="hidden sm:block relative flex items-start">
          <div className="relative flex items-start">
            <div className="absolute h-0.5 pointer-events-none"
              style={{ top: 14, left: `${50 / SECTIONS.length}%`, right: `${50 / SECTIONS.length}%`, backgroundColor: '#E5EAF0', zIndex: 0 }} />
            {(() => {
              const sIdx = SECTION_STEPS.findIndex(ss => ss.includes(step))
              return sIdx > 0 ? (
                <div className="absolute h-0.5 transition-all duration-500 pointer-events-none"
                  style={{ top: 14, left: `${50 / SECTIONS.length}%`, width: `${(sIdx / (SECTIONS.length - 1)) * (100 - 100 / SECTIONS.length)}%`, backgroundColor: '#0D9488', zIndex: 0 }} />
              ) : null
            })()}
            {SECTIONS.map((sec, i) => {
              const sIdx = SECTION_STEPS.findIndex(ss => ss.includes(step))
              const done = i < sIdx; const active = i === sIdx
              return (
                <div key={sec} className="flex-1 flex flex-col items-center gap-1.5 relative z-10">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-sans font-bold text-[11px] transition-all"
                    style={{ backgroundColor: done ? '#0D9488' : active ? '#0F2D55' : 'white', border: done || active ? 'none' : '2px solid #CBD5E1', color: done || active ? 'white' : '#94A3B8', boxShadow: active ? '0 0 0 3px rgba(15,45,85,0.15)' : 'none' }}>
                    {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className="font-sans font-medium text-[9.5px] text-center leading-tight hidden sm:block"
                    style={{ color: active ? '#0F2D55' : done ? '#0D9488' : '#94A3B8' }}>{sec}</span>
                </div>
              )
            })}
          </div>
          </div>
        </div>
      </div>

      <div className={cn('mx-auto px-5 py-8', step === 'plan_listing' ? 'max-w-[1000px]' : 'max-w-[720px]')}>
        <AnimatePresence mode="wait">
          <motion.div key={step} variants={slide} initial="initial" animate="animate" exit="exit">

            {/* ══ EMIRATE ══ */}
            {step === 'emirate' && (
              <Shell title="Emirate of Visa Issuance" sub="Coverage terms and mandatory plans differ by emirate" icon="📍">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {([
                    { id: 'dubai',    label: 'Dubai',     abbr: 'DXB', note: 'DHA mandatory' },
                    { id: 'abudhabi', label: 'Abu Dhabi', abbr: 'AUH', note: 'HAAD rules' },
                    { id: 'sharjah',  label: 'Sharjah',  abbr: 'SHJ', note: '' },
                    { id: 'ajman',    label: 'Ajman',    abbr: 'AJM', note: '' },
                    { id: 'rak',      label: 'RAK',      abbr: 'RKT', note: '' },
                    { id: 'fujairah', label: 'Fujairah', abbr: 'FJR', note: '' },
                    { id: 'uaq',      label: 'UAQ',      abbr: 'UAQ', note: '' },
                  ] as const).map(({ id, label, abbr, note }) => (
                    <Chip key={id} active={data.emirate === id} onClick={() => { set('emirate', id); setTimeout(goNext, 200) }}>
                      <span className="w-10 h-10 rounded-lg font-display font-extrabold text-[11px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: data.emirate === id ? '#0D9488' : '#EBF2FA', color: data.emirate === id ? '#fff' : '#133B6E' }}>
                        {abbr}
                      </span>
                      <div>
                        <div className="font-sans font-bold text-[13.5px]" style={{ color: data.emirate === id ? '#0A7A72' : '#0F2D55' }}>{label}</div>
                        {note && <div className="font-sans text-[10px]" style={{ color: '#0D9488' }}>{note}</div>}
                      </div>
                    </Chip>
                  ))}
                </div>
                <Buttons onNext={goNext} disabled={!data.emirate} hideBack />
              </Shell>
            )}

            {/* ══ BASIC DETAILS ══ */}
            {step === 'basic_details' && (
              <div>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">📝</div>
                  <h2 className="font-display font-bold text-[22px] mb-1" style={{ color: '#0F2D55' }}>Your Basic Details</h2>
                  <p className="font-sans text-[14px]" style={{ color: '#64748B' }}>Required to generate your personalised quote</p>
                </div>
                <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5EAF0' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Full Name" required>
                      <input type="text" value={data.name} placeholder="Ahmed Al Mansoori"
                        onChange={e => set('name', e.target.value)}
                        className={INP} style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                    </FormField>
                    <FormField label="Email Address" required>
                      <input type="email" value={data.email} placeholder="you@example.com"
                        onChange={e => set('email', e.target.value)}
                        className={INP} style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                    </FormField>
                    <FormField label="UAE Mobile" required>
                      <div className="flex">
                        <span className="flex items-center px-3.5 border border-r-0 rounded-l-xl font-sans font-semibold text-[13px] shrink-0 h-12"
                          style={{ borderColor: '#E5EAF0', backgroundColor: '#F4F7FB', color: '#475569' }}>🇦🇪 +971</span>
                        <input type="tel" value={data.mobile} placeholder="50 123 4567"
                          onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 9))}
                          className="flex-1 h-12 rounded-r-xl border px-4 font-sans text-[14px] bg-white outline-none transition-all"
                          style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                      </div>
                    </FormField>
                    <FormField label="Emirates ID">
                      <input type="text" value={data.eid} placeholder="784-XXXX-XXXXXXX-X"
                        onChange={e => set('eid', e.target.value)}
                        className={INP} style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                    </FormField>
                    <FormField label="Date of Birth" required>
                      <input type="date" value={data.dob} onChange={e => set('dob', e.target.value)}
                        className={INP} style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                    </FormField>
                    <FormField label="Nationality" required>
                      <NationalitySelect value={data.nationality} onChange={v => set('nationality', v)} />
                    </FormField>
                    <FormField label="Gender" required>
                      <div className="grid grid-cols-2 gap-2">
                        {(['male', 'female'] as const).map(g => (
                          <button key={g} type="button" onClick={() => set('gender', g)}
                            className="h-12 rounded-xl border-2 font-sans font-semibold text-[13px] capitalize transition-all"
                            style={{ borderColor: data.gender === g ? '#0D9488' : '#E5EAF0', backgroundColor: data.gender === g ? '#F0FDFA' : 'white', color: data.gender === g ? '#0D9488' : '#475569' }}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </FormField>
                    <FormField label="Marital Status" required>
                      <select value={data.maritalStatus} onChange={e => set('maritalStatus', e.target.value)}
                        className={INP + " appearance-none"} style={{ borderColor: '#E5EAF0', color: data.maritalStatus ? '#0F2D55' : '#94A3B8' }}>
                        <option value="">Select status</option>
                        {['Single', 'Married', 'Divorced', 'Widowed'].map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
                      </select>
                    </FormField>
                  </div>
                </div>
                <Buttons onNext={goNext}
                  disabled={!data.name || !data.email || !data.mobile || !data.dob || !data.nationality || !data.gender || !data.maritalStatus}
                  onBack={goBack} />
              </div>
            )}

            {/* ══ MEMBER TYPE (Dubai only) ══ */}
            {step === 'member_type' && (
              <Shell title="Who are you insuring?" sub="Select who this policy covers" icon="👥">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([
                    { id: 'self',      label: 'Self',      sub: 'Coverage for yourself only',         icon: '👤' },
                    { id: 'dependent', label: 'Dependent', sub: 'Spouse, child or parent',             icon: '👨‍👩‍👧' },
                  ] as const).map(({ id, label, sub, icon }) => {
                    const active = data.memberType === id
                    return (
                      <button key={id} type="button" onClick={() => { set('memberType', id); setTimeout(goNext, 200) }}
                        className="flex flex-col items-center p-6 rounded-2xl border-2 text-center transition-all hover:-translate-y-0.5 gap-3"
                        style={{ borderColor: active ? '#0D9488' : '#E5EAF0', backgroundColor: active ? '#F0FDFA' : 'white' }}>
                        <div className="text-5xl">{icon}</div>
                        <div>
                          <div className="font-sans font-bold text-[16px]" style={{ color: active ? '#0A7A72' : '#0F2D55' }}>{label}</div>
                          <div className="font-sans text-[12px] mt-0.5" style={{ color: '#64748B' }}>{sub}</div>
                        </div>
                        {active && <CheckCircle2 className="w-5 h-5" style={{ color: '#0D9488' }} />}
                      </button>
                    )
                  })}
                </div>
                <Buttons onNext={goNext} disabled={!data.memberType} onBack={goBack} />
              </Shell>
            )}

            {/* ══ SELF DETAILS (Dubai + Self) ══ */}
            {step === 'self_details' && (
              <Shell title="Salary & Policy Details" sub="Required for Dubai DHA plan eligibility" icon="💼">
                <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5EAF0' }}>
                  <p className="font-sans font-bold text-[11px] uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>Monthly Salary Band</p>
                  <SalaryBandPicker value={data.salaryBand} onChange={v => set('salaryBand', v)} />
                </div>
                <ExistingPolicySection
                  has={data.hasExistingPolicy} insurer={data.existingInsurer} expiry={data.existingExpiry}
                  onToggle={v => set('hasExistingPolicy', v)} onInsurer={v => set('existingInsurer', v)} onExpiry={v => set('existingExpiry', v)}
                />
                <Buttons onNext={goNext} disabled={!data.salaryBand} onBack={goBack} nextLabel="View Plans" />
              </Shell>
            )}

            {/* ══ DEPENDENT DETAILS (Dubai + Dependent) ══ */}
            {step === 'dependent_details' && (
              <div>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">👨‍👩‍👧</div>
                  <h2 className="font-display font-bold text-[22px] mb-1" style={{ color: '#0F2D55' }}>Dependent Details</h2>
                  <p className="font-sans text-[14px]" style={{ color: '#64748B' }}>Details of the person to be insured</p>
                </div>
                <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5EAF0' }}>
                  <p className="font-sans font-bold text-[11px] uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>Dependent Information</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Full Name" required>
                      <input type="text" value={data.depName} placeholder="Full name"
                        onChange={e => set('depName', e.target.value)}
                        className={INP} style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                    </FormField>
                    <FormField label="Date of Birth" required>
                      <input type="date" value={data.depDob} onChange={e => set('depDob', e.target.value)}
                        className={INP} style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                    </FormField>
                    <FormField label="Nationality" required>
                      <NationalitySelect value={data.depNationality} onChange={v => set('depNationality', v)} />
                    </FormField>
                    <FormField label="Gender" required>
                      <div className="grid grid-cols-2 gap-2">
                        {(['male', 'female'] as const).map(g => (
                          <button key={g} type="button" onClick={() => set('depGender', g)}
                            className="h-12 rounded-xl border-2 font-sans font-semibold text-[13px] capitalize transition-all"
                            style={{ borderColor: data.depGender === g ? '#0D9488' : '#E5EAF0', backgroundColor: data.depGender === g ? '#F0FDFA' : 'white', color: data.depGender === g ? '#0D9488' : '#475569' }}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </FormField>
                    <FormField label="Relation to Sponsor" required>
                      <div className="grid grid-cols-3 gap-2">
                        {(['wife', 'child', 'parent'] as const).map(r => (
                          <button key={r} type="button" onClick={() => set('depRelation', r)}
                            className="h-12 rounded-xl border-2 font-sans font-semibold text-[13px] capitalize transition-all"
                            style={{ borderColor: data.depRelation === r ? '#0D9488' : '#E5EAF0', backgroundColor: data.depRelation === r ? '#F0FDFA' : 'white', color: data.depRelation === r ? '#0D9488' : '#475569' }}>
                            {r}
                          </button>
                        ))}
                      </div>
                    </FormField>
                    <FormField label="Sponsor Salary Band" required>
                      <select value={data.salaryBand} onChange={e => set('salaryBand', e.target.value)}
                        className={INP + " appearance-none"} style={{ borderColor: '#E5EAF0', color: data.salaryBand ? '#0F2D55' : '#94A3B8' }}>
                        <option value="">Select salary band</option>
                        <option value="lsb">LSB — Up to AED 4,000/month</option>
                        <option value="nlsb">NLSB — Above AED 4,000/month</option>
                      </select>
                    </FormField>
                  </div>
                </div>
                <ExistingPolicySection
                  has={data.depHasExistingPolicy} insurer={data.depExistingInsurer} expiry={data.depExistingExpiry}
                  onToggle={v => set('depHasExistingPolicy', v)} onInsurer={v => set('depExistingInsurer', v)} onExpiry={v => set('depExistingExpiry', v)}
                />
                <Buttons onNext={goNext}
                  disabled={!data.depName || !data.depDob || !data.depNationality || !data.depGender || !data.depRelation || !data.salaryBand}
                  onBack={goBack} nextLabel="View Plans" />
              </div>
            )}

            {/* ══ PLAN LISTING ══ */}
            {step === 'plan_listing' && (
              <PlanListingStep
                plans={availablePlans}
                emirate={data.emirate}
                salaryBand={data.salaryBand}
                depRelation={data.depRelation}
                memberType={data.memberType}
                onSelect={planId => {
                  set('planId', planId)
                  set('quoteNumber', generateQuoteNumber())
                  setTimeout(goNext, 200)
                }}
              />
            )}

            {/* ══ QUOTE SUMMARY ══ */}
            {step === 'quote_summary' && selectedPlan && (
              <QuoteSummaryStep data={data} plan={selectedPlan} premium={selectedPremium} goNext={goNext} goBack={goBack} />
            )}

            {/* ══ POLICYHOLDER ══ */}
            {step === 'policyholder' && (
              <PolicyholderStep data={data} set={set} goNext={goNext} goBack={goBack} />
            )}

            {/* ══ SUCCESS ══ */}
            {step === 'payment' && selectedPlan && (
              <SuccessStep data={data} plan={selectedPlan} premium={selectedPremium} />
            )}

          </motion.div>
        </AnimatePresence>

        {/* Trust strip */}
        {!['plan_listing', 'quote_summary', 'policyholder', 'payment'].includes(step) && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[['🏆','Best Price Guaranteed'],['🔒','Secure & Private'],['🏥','14+ Insurers'],['📞','Claims Assistance']].map(([icon, text]) => (
              <div key={text} className="bg-white rounded-xl p-3 flex flex-col items-center gap-1.5 border" style={{ borderColor: '#E5EAF0' }}>
                <span className="text-2xl">{icon}</span>
                <span className="font-sans font-semibold text-[11.5px] text-center" style={{ color: '#475569' }}>{text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
