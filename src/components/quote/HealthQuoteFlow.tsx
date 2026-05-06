'use client'
import { useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, CheckCircle2, ArrowRight, Shield,
  Stethoscope, Hospital, Pill, TrendingUp, Users, User, Star,
} from 'lucide-react'
import Logo from '@/components/ui/Logo'

/* ─── Enhanced plan option sets ─────────────────────────── */
const CONSULTATION_OPTIONS = [
  { id: 'gp',         label: 'GP Only',         sub: 'General Practitioner',   addOnPct: 0   },
  { id: 'gp_spec',    label: 'GP + Specialist', sub: 'Any specialist referral', addOnPct: 0.12 },
  { id: 'unlimited',  label: 'No Limit',        sub: 'Direct specialist access',addOnPct: 0.22 },
]
const IP_OPTIONS = [
  { id: '150k',  label: 'AED 150,000',   addOnPct: 0    },
  { id: '500k',  label: 'AED 500,000',   addOnPct: 0.15 },
  { id: '1m',    label: 'AED 1,000,000', addOnPct: 0.28 },
  { id: '3m',    label: 'AED 3,000,000', addOnPct: 0.45 },
]
const OP_OPTIONS = [
  { id: '3k',   label: 'AED 3,000',   addOnPct: 0    },
  { id: '7.5k', label: 'AED 7,500',   addOnPct: 0.10 },
  { id: '15k',  label: 'AED 15,000',  addOnPct: 0.20 },
  { id: 'unl',  label: 'Unlimited',   addOnPct: 0.35 },
]
const MED_LIMIT_OPTIONS = [
  { id: '1.5k', label: 'AED 1,500',   addOnPct: 0    },
  { id: '3k',   label: 'AED 3,000',   addOnPct: 0.08 },
  { id: '5k',   label: 'AED 5,000',   addOnPct: 0.16 },
  { id: '10k',  label: 'AED 10,000',  addOnPct: 0.26 },
]
const MED_COPAY_OPTIONS = [
  { id: '20',  label: '20% copay', sub: 'You pay 20%', addOnPct: 0    },
  { id: '15',  label: '15% copay', sub: 'You pay 15%', addOnPct: 0.06 },
  { id: '10',  label: '10% copay', sub: 'You pay 10%', addOnPct: 0.12 },
  { id: '0',   label: '0% copay',  sub: 'Fully covered',addOnPct: 0.22 },
]

/* ─── Non-Dubai 3 fixed plans ────────────────────────────── */
interface FixedPlan {
  id: string; name: string; insurer: string
  premium: number; tag?: string; tagColor?: string; recommended?: boolean
  highlights: string[]
  benefits: { consultation: string; inpatient: string; outpatient: string; medicineLimit: string; medicineCopay: string; extras?: string[] }
}

const NON_DUBAI_PLANS: FixedPlan[] = [
  {
    id: 'essential', name: 'Essential', insurer: 'Neuron / RSA', premium: 550,
    highlights: ['Emergency & hospitalisation', 'GP visits', 'Basic prescriptions', 'UAE-wide clinics'],
    benefits: { consultation: 'AED 50 copay', inpatient: 'AED 150,000 / yr', outpatient: 'AED 3,000 / yr', medicineLimit: 'AED 1,500 / yr', medicineCopay: '20%' },
  },
  {
    id: 'enhanced', name: 'Enhanced', insurer: 'Daman / GIG Gulf', premium: 1_050,
    tag: 'Most Popular', tagColor: '#0D9488', recommended: true,
    highlights: ['Wider specialist network', 'Dental & optical included', 'Maternity basic cover', 'Chronic disease management', 'Direct billing 400+ facilities'],
    benefits: { consultation: 'AED 30 copay', inpatient: 'AED 500,000 / yr', outpatient: 'AED 7,500 / yr', medicineLimit: 'AED 3,000 / yr', medicineCopay: '15%', extras: ['Dental AED 1,500/yr', 'Optical AED 500/yr'] },
  },
  {
    id: 'comprehensive', name: 'Comprehensive', insurer: 'AXA Gulf / Allianz', premium: 1_980,
    highlights: ['Premium all-UAE network', 'International emergency', 'Full maternity & newborn', 'Mental health cover', 'Unlimited IP top hospitals'],
    benefits: { consultation: 'No copay', inpatient: 'AED 3,000,000 / yr', outpatient: 'AED 15,000 / yr', medicineLimit: 'AED 5,000 / yr', medicineCopay: '10%', extras: ['Dental AED 3,000/yr', 'Optical AED 1,000/yr', 'Maternity AED 10,000/yr'] },
  },
]

/* ─── Dubai base premiums ────────────────────────────────── */
const DUBAI_BASIC_LSB  = { id: 'basic_lsb',  premium: 620,   insurer: 'Neuron / RSA' }
const DUBAI_BASIC_NLSB = { id: 'basic_nlsb', premium: 890,   insurer: 'ADNIC / Sukoon' }
const DUBAI_ENHANCED_BASE_LSB  = 850
const DUBAI_ENHANCED_BASE_NLSB = 1_200

/* ─── Types ──────────────────────────────────────────────── */
type StepId = 'emirate' | 'member_type' | 'personal_details' | 'dependent_type' | 'dependent_details' | 'plan_type' | 'enhanced_config' | 'checkout'

interface EnhancedConfig { consultation: string; inpatient: string; outpatient: string; medicineLimit: string; medicineCopay: string }

interface QuoteData {
  emirate: string
  memberType: string            // 'self' | 'dependent'
  // Self details
  selfName: string
  selfEID: string
  selfEmail: string
  selfPhone: string
  selfNationality: string
  selfSalaryBand: string        // 'lsb' | 'nlsb'
  selfHasExistingPolicy: boolean
  selfExistingInsurer: string
  selfExistingExpiry: string
  // Dependent type
  dependentType: string         // 'spouse' | 'child' | 'parent'
  // Dependent personal details
  depName: string
  depEmail: string
  depPhone: string
  depNationality: string
  // Sponsor details (for dependent flow)
  sponsorName: string
  sponsorEID: string
  sponsorEmail: string
  sponsorPhone: string
  sponsorNationality: string
  sponsorSalaryBand: string     // 'lsb' | 'nlsb'
  sponsorHasExistingPolicy: boolean
  sponsorExistingInsurer: string
  sponsorExistingExpiry: string
  // Plan
  planType: string              // 'basic' | 'enhanced' | fixed plan id
  enhancedConfig: EnhancedConfig
}

function cn(...cls: (string | boolean | undefined | null)[]) { return cls.filter(Boolean).join(' ') }

const slide = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, x: -28, transition: { duration: 0.18 } },
}

/* ─── Social proof snippets ─────────────────────────────── */
const SOCIAL_PROOF: Record<string, string> = {
  'basic':         '🔒 DHA-required for all Dubai visa holders',
  'enhanced':      '⭐ Chosen by 68% of our Dubai customers',
  'essential':     '✓ Most affordable option for your emirate',
  'comprehensive': '🏆 Best-rated plan for families & expats',
  'lsb':           '💡 Recommended for salary ≤ AED 4,000',
  'nlsb':          '💡 Recommended for salary > AED 4,000',
  'self':          '👤 Quickest to purchase — 3 min checkout',
  'dependent':     '👨‍👩‍👧 Best value when covering your family',
}

/* ─── Premium calculation ────────────────────────────────── */
function getSalaryBand(data: QuoteData): string {
  return data.memberType === 'dependent' ? data.sponsorSalaryBand : data.selfSalaryBand
}

function calcBasePremium(data: QuoteData): number {
  const band = getSalaryBand(data)
  if (data.emirate !== 'dubai') {
    const plan = NON_DUBAI_PLANS.find(p => p.id === data.planType)
    return plan?.premium ?? 0
  }
  if (data.planType === 'basic') {
    return band === 'lsb' ? DUBAI_BASIC_LSB.premium : DUBAI_BASIC_NLSB.premium
  }
  // enhanced
  const base = band === 'lsb' ? DUBAI_ENHANCED_BASE_LSB : DUBAI_ENHANCED_BASE_NLSB
  const cfg = data.enhancedConfig
  const addOn = (
    (CONSULTATION_OPTIONS.find(o => o.id === cfg.consultation)?.addOnPct ?? 0) +
    (IP_OPTIONS.find(o => o.id === cfg.inpatient)?.addOnPct ?? 0) +
    (OP_OPTIONS.find(o => o.id === cfg.outpatient)?.addOnPct ?? 0) +
    (MED_LIMIT_OPTIONS.find(o => o.id === cfg.medicineLimit)?.addOnPct ?? 0) +
    (MED_COPAY_OPTIONS.find(o => o.id === cfg.medicineCopay)?.addOnPct ?? 0)
  )
  return Math.round(base * (1 + addOn))
}

function calcTotalPremium(data: QuoteData): number {
  const base = calcBasePremium(data)
  if (data.memberType !== 'dependent') return base
  if (data.dependentType === 'spouse')  return Math.round(base * 0.85)
  if (data.dependentType === 'child')   return Math.round(base * 0.60)
  if (data.dependentType === 'parent')  return Math.round(base * 1.20)
  return base
}

/* ─── Main component ─────────────────────────────────────── */
export default function HealthQuoteFlow() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [step, setStep] = useState<StepId>('emirate')
  const [data, setData] = useState<QuoteData>({
    emirate: searchParams.get('emirate') || '',
    memberType: '',
    selfName: '', selfEID: '', selfEmail: '', selfPhone: '', selfNationality: '', selfSalaryBand: '',
    selfHasExistingPolicy: false, selfExistingInsurer: '', selfExistingExpiry: '',
    dependentType: '',
    depName: '', depEmail: '', depPhone: '', depNationality: '',
    sponsorName: '', sponsorEID: '', sponsorEmail: '', sponsorPhone: '', sponsorNationality: '', sponsorSalaryBand: '',
    sponsorHasExistingPolicy: false, sponsorExistingInsurer: '', sponsorExistingExpiry: '',
    planType: '',
    enhancedConfig: { consultation: '', inpatient: '', outpatient: '', medicineLimit: '', medicineCopay: '' },
  })

  const set = useCallback(<K extends keyof QuoteData>(k: K, v: QuoteData[K]) =>
    setData(prev => ({ ...prev, [k]: v })), [])

  const setEnhanced = useCallback((k: keyof EnhancedConfig, v: string) =>
    setData(prev => ({ ...prev, enhancedConfig: { ...prev.enhancedConfig, [k]: v } })), [])

  const isDubai = data.emirate === 'dubai'

  function getSteps(): StepId[] {
    const s: StepId[] = ['emirate']
    if (!data.emirate) return s
    if (!isDubai) {
      s.push('plan_type', 'personal_details', 'checkout')
      return s
    }
    s.push('member_type')
    if (!data.memberType) return s
    if (data.memberType === 'self') {
      s.push('personal_details')
    } else {
      s.push('dependent_type', 'dependent_details')
    }
    s.push('plan_type')
    if (data.planType === 'enhanced') s.push('enhanced_config')
    s.push('checkout')
    return s
  }

  const steps = getSteps()
  const stepIdx = steps.indexOf(step)
  const progress = Math.round(((stepIdx + 1) / steps.length) * 100)

  function goNext() {
    const next = steps[steps.indexOf(step) + 1]
    if (next) setStep(next)
  }

  function goBack() {
    const prev = steps[steps.indexOf(step) - 1]
    if (prev) setStep(prev)
  }

  const emirateName: Record<string, string> = {
    dubai: 'Dubai', abudhabi: 'Abu Dhabi', sharjah: 'Sharjah',
    ajman: 'Ajman', rak: 'RAK', fujairah: 'Fujairah', uaq: 'UAQ',
  }

  const totalPremium = calcTotalPremium(data)
  const basePremium  = calcBasePremium(data)

  /* ── Section labels ── */
  const SECTIONS: string[] = !isDubai
    ? ['Emirate', 'Plan', 'Details', 'Checkout']
    : data.memberType === 'dependent'
      ? ['Emirate', 'Type', 'Dep. Type', 'Details', 'Plan', 'Checkout']
      : ['Emirate', 'Type', 'Details', 'Plan', 'Checkout']
  const SECTION_STEPS: StepId[][] = !isDubai
    ? [['emirate'], ['plan_type'], ['personal_details'], ['checkout']]
    : data.memberType === 'dependent'
      ? [['emirate'], ['member_type'], ['dependent_type'], ['dependent_details'], ['plan_type', 'enhanced_config'], ['checkout']]
      : [['emirate'], ['member_type'], ['personal_details'], ['plan_type', 'enhanced_config'], ['checkout']]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F7FB' }}>

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40" style={{ borderColor: '#E5EAF0' }}>
        <div className="max-w-[860px] mx-auto px-5 h-14 flex items-center justify-between">
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

      {/* Progress tabs */}
      <div className="bg-white border-b" style={{ borderColor: '#E5EAF0' }}>
        <div className="max-w-[860px] mx-auto px-5 py-4">
          {/* Step circles with properly centered connectors */}
          <div className="relative flex items-start">
            {/* Gray track — spans from center of first circle to center of last */}
            <div className="absolute h-0.5 pointer-events-none"
              style={{
                top: 14,
                left: `${50 / SECTIONS.length}%`,
                right: `${50 / SECTIONS.length}%`,
                backgroundColor: '#E5EAF0',
                zIndex: 0,
              }} />
            {/* Teal progress fill */}
            {(() => {
              const sIdx = SECTION_STEPS.findIndex(ss => (ss as StepId[]).includes(step))
              return sIdx > 0 ? (
                <div className="absolute h-0.5 transition-all duration-500 pointer-events-none"
                  style={{
                    top: 14,
                    left: `${50 / SECTIONS.length}%`,
                    width: `${(sIdx / (SECTIONS.length - 1)) * (100 - 100 / SECTIONS.length)}%`,
                    backgroundColor: '#0D9488',
                    zIndex: 0,
                  }} />
              ) : null
            })()}
            {SECTIONS.map((sec, i) => {
              const stepIds = SECTION_STEPS[i] as StepId[]
              const sIdx    = SECTION_STEPS.findIndex(ss => (ss as StepId[]).includes(step))
              const done    = i < sIdx
              const active  = i === sIdx
              return (
                <div key={sec} className="flex-1 flex flex-col items-center gap-1.5 relative z-10">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-sans font-bold text-[11px] transition-all"
                    style={{
                      backgroundColor: done ? '#0D9488' : active ? '#0F2D55' : 'white',
                      border: done || active ? 'none' : '2px solid #CBD5E1',
                      color: done || active ? 'white' : '#94A3B8',
                      boxShadow: active ? '0 0 0 3px rgba(15,45,85,0.15)' : 'none',
                    }}>
                    {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className="font-sans font-medium text-[9.5px] text-center leading-tight hidden sm:block"
                    style={{ color: active ? '#0F2D55' : done ? '#0D9488' : '#94A3B8' }}>
                    {sec}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sticky premium bar — appears once plan is selected */}
      <AnimatePresence>
        {data.planType && step !== 'checkout' && (
          <motion.div
            initial={{ y: -48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -48, opacity: 0 }}
            className="sticky top-[56px] z-30 border-b"
            style={{ backgroundColor: '#0F2D55', borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <div className="max-w-[720px] mx-auto px-5 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[12px] text-white/60">Selected:</span>
                <span className="font-sans font-bold text-[13px] text-white capitalize">
                  {isDubai
                    ? (data.planType === 'basic' ? 'Basic DHA Plan' : 'Enhanced Plan')
                    : (data.planType.charAt(0).toUpperCase() + data.planType.slice(1) + ' Plan')}
                </span>
                {SOCIAL_PROOF[data.planType] && (
                  <span className="hidden sm:inline font-sans text-[11px]" style={{ color: '#2DD4BF' }}>
                    · {SOCIAL_PROOF[data.planType].replace(/^[^ ]+ /, '')}
                  </span>
                )}
              </div>
              {basePremium > 0 && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-display font-extrabold text-[15px] text-white">
                      AED {totalPremium.toLocaleString()}
                    </span>
                    <span className="font-sans text-[11px] text-white/50 ml-1">/yr</span>
                  </div>
                  {step !== 'plan_type' && step !== 'enhanced_config' && (
                    <button
                      type="button"
                      onClick={() => setStep('checkout')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans font-bold text-[12px] text-white transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg,#0D9488,#2DD4BF)' }}
                    >
                      Buy Now →
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[720px] mx-auto px-5 py-8">
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
                    <Chip key={id} active={data.emirate === id}
                      onClick={() => { set('emirate', id); setTimeout(goNext, 200) }}>
                      <span className="w-10 h-10 rounded-lg font-display font-extrabold text-[11px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: data.emirate === id ? '#0D9488' : '#EBF2FA', color: data.emirate === id ? '#fff' : '#133B6E' }}>
                        {abbr}
                      </span>
                      <div>
                        <div className="font-sans font-bold text-[13.5px]"
                          style={{ color: data.emirate === id ? '#0A7A72' : 'var(--text-primary)' }}>{label}</div>
                        {note && <div className="font-sans text-[10px]" style={{ color: '#0D9488' }}>{note}</div>}
                      </div>
                    </Chip>
                  ))}
                </div>
                <Buttons onNext={goNext} disabled={!data.emirate} hideBack />
              </Shell>
            )}

            {/* ══ MEMBER TYPE ══ */}
            {step === 'member_type' && (
              <Shell title="Who are you insuring?" sub="Select who this policy is for" icon="👥">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([
                    { id: 'self',      label: 'Self',      sub: 'Coverage for yourself only',               icon: User },
                    { id: 'dependent', label: 'Dependent', sub: 'Spouse, children or family members',       icon: Users },
                  ] as const).map(({ id, label, sub, icon: Icon }) => {
                    const active = data.memberType === id
                    return (
                      <button key={id} type="button"
                        onClick={() => { set('memberType', id); setTimeout(goNext, 200) }}
                        className="flex flex-col items-center p-6 rounded-2xl border-2 text-center transition-all hover:-translate-y-0.5 gap-3"
                        style={{ borderColor: active ? '#0D9488' : '#E5EAF0', backgroundColor: active ? '#F0FDFA' : 'white' }}>
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: active ? '#0D9488' : '#EBF2FA' }}>
                          <Icon className="w-7 h-7" style={{ color: active ? 'white' : '#133B6E' }} />
                        </div>
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

            {/* ══ PERSONAL DETAILS (Self) ══ */}
            {step === 'personal_details' && (
              <div>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">👤</div>
                  <h2 className="font-display font-bold text-[22px] leading-tight mb-1" style={{ color: '#0F2D55' }}>Your Details</h2>
                  <p className="font-sans text-[14px]" style={{ color: '#64748B' }}>A few details to prepare your personalised quote</p>
                </div>
                <div className="bg-white rounded-2xl border p-5 space-y-4 mb-4" style={{ borderColor: '#E5EAF0' }}>
                  <p className="font-sans font-bold text-[11px] uppercase tracking-widest" style={{ color: '#94A3B8' }}>Personal Information</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Full Name" required>
                      <input type="text" value={data.selfName} placeholder="Ahmed Al Mansoori"
                        onChange={e => set('selfName', e.target.value)}
                        className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none"
                        style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                    </FormField>
                    <FormField label="Emirates ID" required>
                      <input type="text" value={data.selfEID} placeholder="784-XXXX-XXXXXXX-X"
                        onChange={e => set('selfEID', e.target.value)}
                        className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none"
                        style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                    </FormField>
                    <FormField label="Email Address" required>
                      <input type="email" value={data.selfEmail} placeholder="you@example.com"
                        onChange={e => set('selfEmail', e.target.value)}
                        className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none"
                        style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                    </FormField>
                    <FormField label="UAE Mobile" required>
                      <div className="flex">
                        <span className="flex items-center px-3.5 border border-r-0 rounded-l-xl font-sans font-semibold text-[13px] shrink-0 h-12"
                          style={{ borderColor: '#E5EAF0', backgroundColor: '#F4F7FB', color: '#475569' }}>🇦🇪 +971</span>
                        <input type="tel" value={data.selfPhone} placeholder="50 123 4567"
                          onChange={e => set('selfPhone', e.target.value.replace(/\D/g, '').slice(0, 9))}
                          className="flex-1 h-12 rounded-r-xl border px-4 font-sans text-[14px] bg-white outline-none"
                          style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                      </div>
                    </FormField>
                    <FormField label="Nationality" required>
                      <NationalitySelect value={data.selfNationality} onChange={v => set('selfNationality', v)} />
                    </FormField>
                  </div>
                </div>

                {/* Salary band */}
                <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5EAF0' }}>
                  <p className="font-sans font-bold text-[11px] uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>Monthly Salary Band</p>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { id: 'lsb',  title: 'LSB',  subtitle: 'Up to AED 4,000/month',   color: '#0D9488' },
                      { id: 'nlsb', title: 'NLSB', subtitle: 'Above AED 4,000/month',   color: '#0F2D55' },
                    ] as const).map(({ id, title, subtitle, color }) => {
                      const active = data.selfSalaryBand === id
                      return (
                        <button key={id} type="button" onClick={() => set('selfSalaryBand', id)}
                          className="flex items-center justify-between p-4 rounded-xl border-2 transition-all"
                          style={{ borderColor: active ? color : '#E5EAF0', backgroundColor: active ? (id === 'lsb' ? '#F0FDFA' : '#EBF2FA') : 'white' }}>
                          <div>
                            <div className="font-display font-extrabold text-[20px]" style={{ color }}>{title}</div>
                            <div className="font-sans text-[11px]" style={{ color: '#64748B' }}>{subtitle}</div>
                          </div>
                          {active && <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color }} />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Existing policy */}
                <ExistingPolicySection
                  has={data.selfHasExistingPolicy}
                  insurer={data.selfExistingInsurer}
                  expiry={data.selfExistingExpiry}
                  onToggle={v => set('selfHasExistingPolicy', v)}
                  onInsurer={v => set('selfExistingInsurer', v)}
                  onExpiry={v => set('selfExistingExpiry', v)}
                />

                <Buttons onNext={goNext}
                  disabled={!data.selfName || !data.selfEmail || !data.selfPhone || !data.selfNationality || !data.selfSalaryBand}
                  onBack={goBack} nextLabel={isDubai ? 'Continue' : 'View Plans'} />
              </div>
            )}

            {/* ══ DEPENDENT TYPE ══ */}
            {step === 'dependent_type' && (
              <Shell title="Relationship to Sponsor" sub="What is the dependent's relationship to the visa sponsor?" icon="👨‍👩‍👧">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {([
                    { id: 'spouse', label: 'Spouse',  sub: 'Husband or wife of the sponsor', emoji: '💑' },
                    { id: 'child',  label: 'Child',   sub: 'Son or daughter of the sponsor', emoji: '👧' },
                    { id: 'parent', label: 'Parent',  sub: 'Father or mother of the sponsor', emoji: '👴' },
                  ] as const).map(({ id, label, sub, emoji }) => {
                    const active = data.dependentType === id
                    return (
                      <button key={id} type="button"
                        onClick={() => { set('dependentType', id); setTimeout(goNext, 200) }}
                        className="flex flex-col items-center p-6 rounded-2xl border-2 text-center transition-all hover:-translate-y-0.5 gap-2"
                        style={{ borderColor: active ? '#0D9488' : '#E5EAF0', backgroundColor: active ? '#F0FDFA' : 'white' }}>
                        <div className="text-4xl">{emoji}</div>
                        <div className="font-sans font-bold text-[15px]" style={{ color: active ? '#0A7A72' : '#0F2D55' }}>{label}</div>
                        <div className="font-sans text-[12px]" style={{ color: '#64748B' }}>{sub}</div>
                        {active && <CheckCircle2 className="w-5 h-5 mt-1" style={{ color: '#0D9488' }} />}
                      </button>
                    )
                  })}
                </div>
                <Buttons onNext={goNext} disabled={!data.dependentType} onBack={goBack} />
              </Shell>
            )}

            {/* ══ DEPENDENT DETAILS ══ */}
            {step === 'dependent_details' && (
              <div>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">📋</div>
                  <h2 className="font-display font-bold text-[22px] leading-tight mb-1" style={{ color: '#0F2D55' }}>Dependent & Sponsor Details</h2>
                  <p className="font-sans text-[14px]" style={{ color: '#64748B' }}>Details of the person being insured and the visa sponsor</p>
                </div>

                {/* Dependent details */}
                <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5EAF0' }}>
                  <p className="font-sans font-bold text-[11px] uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>
                    Dependent Details · {data.dependentType === 'spouse' ? 'Spouse' : data.dependentType === 'child' ? 'Child' : 'Parent'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Full Name" required>
                      <input type="text" value={data.depName} placeholder="Sara Al Mansoori"
                        onChange={e => set('depName', e.target.value)}
                        className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none"
                        style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                    </FormField>
                    <FormField label="Email Address" required>
                      <input type="email" value={data.depEmail} placeholder="dependent@example.com"
                        onChange={e => set('depEmail', e.target.value)}
                        className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none"
                        style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                    </FormField>
                    <FormField label="UAE Mobile" required>
                      <div className="flex">
                        <span className="flex items-center px-3.5 border border-r-0 rounded-l-xl font-sans font-semibold text-[13px] shrink-0 h-12"
                          style={{ borderColor: '#E5EAF0', backgroundColor: '#F4F7FB', color: '#475569' }}>🇦🇪 +971</span>
                        <input type="tel" value={data.depPhone} placeholder="50 123 4567"
                          onChange={e => set('depPhone', e.target.value.replace(/\D/g, '').slice(0, 9))}
                          className="flex-1 h-12 rounded-r-xl border px-4 font-sans text-[14px] bg-white outline-none"
                          style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                      </div>
                    </FormField>
                    <FormField label="Nationality" required>
                      <NationalitySelect value={data.depNationality} onChange={v => set('depNationality', v)} />
                    </FormField>
                  </div>
                </div>

                {/* Sponsor details */}
                <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5EAF0' }}>
                  <p className="font-sans font-bold text-[11px] uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>Sponsor Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Sponsor Full Name" required>
                      <input type="text" value={data.sponsorName} placeholder="Mohammed Al Hashimi"
                        onChange={e => set('sponsorName', e.target.value)}
                        className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none"
                        style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                    </FormField>
                    <FormField label="Sponsor Emirates ID" required>
                      <input type="text" value={data.sponsorEID} placeholder="784-XXXX-XXXXXXX-X"
                        onChange={e => set('sponsorEID', e.target.value)}
                        className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none"
                        style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                    </FormField>
                    <FormField label="Sponsor Email" required>
                      <input type="email" value={data.sponsorEmail} placeholder="sponsor@example.com"
                        onChange={e => set('sponsorEmail', e.target.value)}
                        className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none"
                        style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                    </FormField>
                    <FormField label="Sponsor UAE Mobile" required>
                      <div className="flex">
                        <span className="flex items-center px-3.5 border border-r-0 rounded-l-xl font-sans font-semibold text-[13px] shrink-0 h-12"
                          style={{ borderColor: '#E5EAF0', backgroundColor: '#F4F7FB', color: '#475569' }}>🇦🇪 +971</span>
                        <input type="tel" value={data.sponsorPhone} placeholder="50 123 4567"
                          onChange={e => set('sponsorPhone', e.target.value.replace(/\D/g, '').slice(0, 9))}
                          className="flex-1 h-12 rounded-r-xl border px-4 font-sans text-[14px] bg-white outline-none"
                          style={{ borderColor: '#E5EAF0' }} onFocus={foc} onBlur={blu} />
                      </div>
                    </FormField>
                    <FormField label="Sponsor Nationality" required>
                      <NationalitySelect value={data.sponsorNationality} onChange={v => set('sponsorNationality', v)} />
                    </FormField>
                  </div>
                  {/* Sponsor salary band */}
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E5EAF0' }}>
                    <p className="font-sans font-bold text-[12px] mb-3" style={{ color: '#475569' }}>Sponsor Monthly Salary Band</p>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { id: 'lsb',  title: 'LSB',  subtitle: 'Up to AED 4,000/month',   color: '#0D9488' },
                        { id: 'nlsb', title: 'NLSB', subtitle: 'Above AED 4,000/month',   color: '#0F2D55' },
                      ] as const).map(({ id, title, subtitle, color }) => {
                        const active = data.sponsorSalaryBand === id
                        return (
                          <button key={id} type="button" onClick={() => set('sponsorSalaryBand', id)}
                            className="flex items-center justify-between p-3.5 rounded-xl border-2 transition-all"
                            style={{ borderColor: active ? color : '#E5EAF0', backgroundColor: active ? (id === 'lsb' ? '#F0FDFA' : '#EBF2FA') : 'white' }}>
                            <div>
                              <div className="font-display font-extrabold text-[18px]" style={{ color }}>{title}</div>
                              <div className="font-sans text-[11px]" style={{ color: '#64748B' }}>{subtitle}</div>
                            </div>
                            {active && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color }} />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <ExistingPolicySection
                  has={data.sponsorHasExistingPolicy}
                  insurer={data.sponsorExistingInsurer}
                  expiry={data.sponsorExistingExpiry}
                  onToggle={v => set('sponsorHasExistingPolicy', v)}
                  onInsurer={v => set('sponsorExistingInsurer', v)}
                  onExpiry={v => set('sponsorExistingExpiry', v)}
                />

                <Buttons onNext={goNext}
                  disabled={!data.depName || !data.depEmail || !data.depPhone || !data.depNationality ||
                            !data.sponsorName || !data.sponsorEmail || !data.sponsorPhone || !data.sponsorNationality || !data.sponsorSalaryBand}
                  onBack={goBack} nextLabel="View Plans" />
              </div>
            )}

            {/* ══ PLAN TYPE ══ */}
            {step === 'plan_type' && (
              <div>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-3 font-sans font-semibold text-[12px]"
                    style={{ backgroundColor: '#F0FDFA', color: '#0D9488', border: '1px solid #CCFBF1' }}>
                    Plans for {emirateName[data.emirate] ?? data.emirate}
                    {isDubai && getSalaryBand(data) ? ` · ${getSalaryBand(data).toUpperCase()}` : ''}
                    {isDubai && data.memberType ? ` · ${data.memberType === 'self' ? 'Self' : 'Dependent'}` : ''}
                  </div>
                  <h2 className="font-display font-bold text-[24px] mb-1" style={{ color: '#0F2D55' }}>Select Your Plan</h2>
                  <p className="font-sans text-[14px]" style={{ color: '#64748B' }}>
                    {isDubai ? 'Choose between the DHA Basic or customise an Enhanced plan' : 'Compare our 3 fixed plans for your emirate'}
                  </p>
                </div>

                {isDubai ? (
                  /* Dubai: Basic (fixed) + Enhanced (configurable) */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Basic Plan */}
                    <div
                      className={cn('rounded-2xl border-2 overflow-hidden cursor-pointer transition-all hover:-translate-y-1',
                        data.planType === 'basic' ? 'border-[#0D9488] shadow-xl' : 'border-[#E5EAF0] hover:border-[#2DD4BF]')}
                      onClick={() => set('planType', 'basic')}
                      style={{ backgroundColor: data.planType === 'basic' ? '#F0FDFA' : 'white' }}>
                      <div className="px-5 pt-5 pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded-md font-sans font-bold text-[9.5px] uppercase tracking-wide mb-2"
                              style={{ backgroundColor: '#EBF2FA', color: '#0F2D55' }}>DHA Mandatory</span>
                            <h3 className="font-display font-extrabold text-[20px]" style={{ color: data.planType === 'basic' ? '#0A7A72' : '#0F2D55' }}>
                              Basic Plan
                            </h3>
                            <p className="font-sans text-[12px]" style={{ color: '#64748B' }}>
                              {getSalaryBand(data) === 'lsb' ? 'Neuron / RSA' : 'ADNIC / Sukoon'}
                            </p>
                          </div>
                          {data.planType === 'basic' && <CheckCircle2 className="w-5 h-5 mt-1" style={{ color: '#0D9488' }} />}
                        </div>
                        <div className="py-3 border-y mb-3" style={{ borderColor: '#E5EAF0' }}>
                          <div className="font-display font-extrabold text-[28px] leading-none" style={{ color: '#0F2D55' }}>
                            AED {(getSalaryBand(data) === 'lsb' ? DUBAI_BASIC_LSB.premium : DUBAI_BASIC_NLSB.premium).toLocaleString()}
                          </div>
                          <div className="font-sans text-[11px] mt-0.5" style={{ color: '#64748B' }}>per year · fixed</div>
                        </div>
                        <div className="space-y-2 mb-4">
                          {[
                            ['Consultation',   'AED 50 copay'],
                            ['In-patient',     'AED 150,000 / yr'],
                            ['Out-patient',    'AED 1,500 / yr'],
                            ['Medicine',       'AED 1,500 / yr'],
                            ['Medicine copay', '20%'],
                          ].map(([k, v]) => (
                            <BenefitRow key={k} label={k} value={v} />
                          ))}
                        </div>
                        <div className="space-y-1.5 pt-3 border-t" style={{ borderColor: '#E5EAF0' }}>
                          {['DHA-compliant mandatory plan', 'Emergency hospitalisation', 'Basic GP visits in Dubai', 'Direct billing at clinics'].map(h => (
                            <div key={h} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#0D9488' }} />
                              <span className="font-sans text-[12px]" style={{ color: '#475569' }}>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="px-5 pb-5">
                        <button type="button" onClick={() => { set('planType', 'basic'); setTimeout(goNext, 150) }}
                          className="w-full h-10 rounded-xl font-sans font-bold text-[13.5px] transition-all hover:opacity-90"
                          style={{ background: data.planType === 'basic' ? 'linear-gradient(135deg,#0F2D55,#0D9488)' : '#F4F7FB', color: data.planType === 'basic' ? 'white' : '#0F2D55', border: data.planType === 'basic' ? 'none' : '1px solid #CBD5E1' }}>
                          {data.planType === 'basic' ? 'Selected ✓' : 'Select Basic Plan'}
                        </button>
                      </div>
                    </div>

                    {/* Enhanced Plan */}
                    <div
                      className={cn('rounded-2xl border-2 overflow-hidden cursor-pointer transition-all hover:-translate-y-1 ring-2 ring-offset-2',
                        data.planType === 'enhanced' ? 'border-[#0D9488] shadow-xl ring-[#0D9488]' : 'border-[#E5EAF0] hover:border-[#2DD4BF] ring-transparent')}
                      onClick={() => set('planType', 'enhanced')}
                      style={{ backgroundColor: data.planType === 'enhanced' ? '#F0FDFA' : 'white' }}>
                      <div className="px-5 pt-5 pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="inline-block px-2.5 py-0.5 rounded-full font-sans font-bold text-[9.5px] text-white mb-2"
                              style={{ backgroundColor: '#0D9488' }}>Customisable</span>
                            <h3 className="font-display font-extrabold text-[20px]" style={{ color: data.planType === 'enhanced' ? '#0A7A72' : '#0F2D55' }}>
                              Enhanced Plan
                            </h3>
                            <p className="font-sans text-[12px]" style={{ color: '#64748B' }}>Daman / AXA Gulf / Cigna</p>
                          </div>
                          {data.planType === 'enhanced' && <CheckCircle2 className="w-5 h-5 mt-1" style={{ color: '#0D9488' }} />}
                        </div>
                        <div className="py-3 border-y mb-3" style={{ borderColor: '#E5EAF0' }}>
                          <div className="font-display font-extrabold text-[28px] leading-none" style={{ color: '#0F2D55' }}>
                            AED {(getSalaryBand(data) === 'lsb' ? DUBAI_ENHANCED_BASE_LSB : DUBAI_ENHANCED_BASE_NLSB).toLocaleString()}+
                          </div>
                          <div className="font-sans text-[11px] mt-0.5" style={{ color: '#64748B' }}>starting from · you choose coverage</div>
                        </div>
                        <div className="space-y-2 mb-4">
                          {[
                            ['Consultation',   'You choose'],
                            ['In-patient',     'You choose'],
                            ['Out-patient',    'You choose'],
                            ['Medicine',       'You choose'],
                            ['Medicine copay', 'You choose'],
                          ].map(([k, v]) => (
                            <BenefitRow key={k} label={k} value={v} custom />
                          ))}
                        </div>
                        <div className="space-y-1.5 pt-3 border-t" style={{ borderColor: '#E5EAF0' }}>
                          {['Pick your own coverage limits', 'Premium adjusts per your choices', 'Wider hospital network', 'Dental & optical top-ups available'].map(h => (
                            <div key={h} className="flex items-start gap-2">
                              <Star className="w-3.5 h-3.5 mt-0.5 shrink-0 fill-current" style={{ color: '#D4A24B' }} />
                              <span className="font-sans text-[12px]" style={{ color: '#475569' }}>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="px-5 pb-5">
                        <button type="button" onClick={() => { set('planType', 'enhanced'); setTimeout(goNext, 150) }}
                          className="w-full h-10 rounded-xl font-sans font-bold text-[13.5px] transition-all hover:opacity-90"
                          style={{ background: data.planType === 'enhanced' ? 'linear-gradient(135deg,#0F2D55,#0D9488)' : '#F4F7FB', color: data.planType === 'enhanced' ? 'white' : '#0F2D55', border: data.planType === 'enhanced' ? 'none' : '1px solid #CBD5E1' }}>
                          {data.planType === 'enhanced' ? 'Configure Plan →' : 'Customise Enhanced Plan'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Non-Dubai: 3 fixed plan cards */
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {NON_DUBAI_PLANS.map(plan => {
                      const sel = data.planType === plan.id
                      return (
                        <div key={plan.id}
                          className={cn('relative rounded-2xl border-2 cursor-pointer transition-all hover:-translate-y-1 flex flex-col',
                            sel ? 'border-[#0D9488] shadow-xl' : 'border-[#E5EAF0] hover:border-[#2DD4BF]',
                            plan.recommended ? 'ring-2 ring-[#0D9488] ring-offset-2' : '')}
                          onClick={() => set('planType', plan.id)}
                          style={{ backgroundColor: sel ? '#F0FDFA' : 'white' }}>

                          {/* Plan name + tag row */}
                          <div className="px-5 pt-5 pb-0">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <h3 className="font-display font-extrabold text-[20px]" style={{ color: sel ? '#0A7A72' : '#0F2D55' }}>{plan.name}</h3>
                                <p className="font-sans text-[12px]" style={{ color: '#64748B' }}>{plan.insurer}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                                {sel && <CheckCircle2 className="w-5 h-5" style={{ color: '#0D9488' }} />}
                                {plan.tag && (
                                  <span className="px-2.5 py-0.5 rounded-full font-sans font-bold text-[10px] text-white whitespace-nowrap"
                                    style={{ backgroundColor: plan.tagColor ?? '#0D9488' }}>{plan.tag}</span>
                                )}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="mt-3 mb-3 py-3 border-y" style={{ borderColor: '#E5EAF0' }}>
                              <div className="font-display font-extrabold text-[30px] leading-none" style={{ color: '#0F2D55' }}>
                                AED {plan.premium.toLocaleString()}
                              </div>
                              <div className="font-sans text-[11px] mt-0.5" style={{ color: '#64748B' }}>per year · self</div>
                            </div>

                            {/* CTA button — at the top */}
                            {plan.recommended && (
                              <div className="text-center mb-2 font-sans text-[11px] font-semibold" style={{ color: '#0D9488' }}>
                                ⭐ 68% of customers choose this
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); set('planType', plan.id); setTimeout(goNext, 150) }}
                              className="w-full h-11 rounded-xl font-sans font-bold text-[14px] transition-all hover:opacity-90 mb-4"
                              style={{
                                background: sel ? 'linear-gradient(135deg,#0F2D55,#0D9488)' : 'white',
                                color: sel ? 'white' : '#0F2D55',
                                border: sel ? 'none' : '2px solid #CBD5E1',
                              }}>
                              {sel ? 'Selected ✓' : 'Select Plan'}
                            </button>
                          </div>

                          {/* Benefits + highlights */}
                          <div className="px-5 pb-5 flex-1">
                            <div className="space-y-2">
                              <BenefitRow label="Consultation"    value={plan.benefits.consultation} />
                              <BenefitRow label="In-patient"      value={plan.benefits.inpatient} />
                              <BenefitRow label="Out-patient"     value={plan.benefits.outpatient} />
                              <BenefitRow label="Medicine limit"  value={plan.benefits.medicineLimit} />
                              <BenefitRow label="Medicine copay"  value={plan.benefits.medicineCopay} />
                            </div>
                            <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: '#E5EAF0' }}>
                              {plan.highlights.map(h => (
                                <div key={h} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#0D9488' }} />
                                  <span className="font-sans text-[12.5px]" style={{ color: '#475569' }}>{h}</span>
                                </div>
                              ))}
                              {plan.benefits.extras?.map(e => (
                                <div key={e} className="flex items-start gap-2">
                                  <Star className="w-3.5 h-3.5 mt-0.5 shrink-0 fill-current" style={{ color: '#D4A24B' }} />
                                  <span className="font-sans text-[12.5px]" style={{ color: '#475569' }}>{e}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  <button type="button" onClick={goBack}
                    className="h-12 px-5 rounded-xl border font-sans font-semibold text-[14px] flex items-center gap-1.5 transition-colors hover:bg-[#F4F7FB]"
                    style={{ borderColor: '#E5EAF0', color: '#64748B' }}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={goNext} disabled={!data.planType}
                    className={cn('flex-1 h-12 rounded-xl font-sans font-bold text-[14.5px] flex items-center justify-center gap-2 transition-all',
                      data.planType ? 'text-white hover:opacity-90 hover:shadow-md hover:-translate-y-0.5' : 'cursor-not-allowed')}
                    style={{ background: data.planType ? 'linear-gradient(135deg,#0F2D55,#0D9488)' : '#E5EAF0', color: data.planType ? 'white' : '#94A3B8' }}>
                    {isDubai && data.planType === 'enhanced' ? 'Configure Enhanced Plan' : 'Continue'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ══ ENHANCED CONFIG ══ */}
            {step === 'enhanced_config' && (
              <div>
                <div className="text-center mb-5">
                  <h2 className="font-display font-bold text-[24px] mb-1" style={{ color: '#0F2D55' }}>Build Your Enhanced Plan</h2>
                  <p className="font-sans text-[14px] mb-3" style={{ color: '#64748B' }}>Select your preferred coverage for each benefit. Premium updates live.</p>
                  <button
                    type="button"
                    onClick={() => setData(prev => ({
                      ...prev,
                      enhancedConfig: { consultation: 'gp_spec', inpatient: '500k', outpatient: '7.5k', medicineLimit: '3k', medicineCopay: '15' }
                    }))}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-sans font-semibold text-[12.5px] transition-all hover:opacity-90"
                    style={{ backgroundColor: '#EBF2FA', color: '#0F2D55', border: '1px solid #CBD5E1' }}
                  >
                    ✨ Apply Smart Defaults (Most Popular)
                  </button>
                </div>

                {/* Live premium badge */}
                <div className="flex items-center justify-between mb-5 p-4 rounded-2xl"
                  style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
                  <span className="font-sans font-semibold text-[13px] text-white/80">Estimated annual premium</span>
                  <motion.span
                    key={basePremium}
                    initial={{ scale: 1.08, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-display font-extrabold text-[22px] text-white">
                    AED {basePremium.toLocaleString()}
                  </motion.span>
                </div>

                <div className="space-y-5">
                  <ConfigSection title="Consultation" icon={Stethoscope}
                    options={CONSULTATION_OPTIONS} selected={data.enhancedConfig.consultation}
                    onSelect={v => setEnhanced('consultation', v)} />
                  <ConfigSection title="In-patient Limit" icon={Hospital}
                    options={IP_OPTIONS} selected={data.enhancedConfig.inpatient}
                    onSelect={v => setEnhanced('inpatient', v)} />
                  <ConfigSection title="Out-patient Limit" icon={TrendingUp}
                    options={OP_OPTIONS} selected={data.enhancedConfig.outpatient}
                    onSelect={v => setEnhanced('outpatient', v)} />
                  <ConfigSection title="Medicine Limit" icon={Pill}
                    options={MED_LIMIT_OPTIONS} selected={data.enhancedConfig.medicineLimit}
                    onSelect={v => setEnhanced('medicineLimit', v)} />
                  <ConfigSection title="Medicine Copay" icon={Pill}
                    options={MED_COPAY_OPTIONS} selected={data.enhancedConfig.medicineCopay}
                    onSelect={v => setEnhanced('medicineCopay', v)} />
                </div>

                {Object.values(data.enhancedConfig).some(v => v) && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-2xl border"
                    style={{ backgroundColor: '#F0FDFA', borderColor: '#CCFBF1' }}>
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-semibold text-[13px]" style={{ color: '#0D9488' }}>Your configured premium</span>
                      <span className="font-display font-extrabold text-[18px]" style={{ color: '#0F2D55' }}>
                        AED {basePremium.toLocaleString()} / year
                      </span>
                    </div>
                  </motion.div>
                )}

                <div className="mt-5 flex gap-3">
                  <button type="button" onClick={goBack}
                    className="h-12 px-5 rounded-xl border font-sans font-semibold text-[14px] flex items-center gap-1.5 transition-colors hover:bg-[#F4F7FB]"
                    style={{ borderColor: '#E5EAF0', color: '#64748B' }}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={goNext}
                    disabled={!Object.values(data.enhancedConfig).every(v => v)}
                    className={cn('flex-1 h-12 rounded-xl font-sans font-bold text-[14.5px] flex items-center justify-center gap-2 transition-all',
                      Object.values(data.enhancedConfig).every(v => v) ? 'text-white hover:opacity-90 hover:shadow-md hover:-translate-y-0.5' : 'cursor-not-allowed')}
                    style={{ background: Object.values(data.enhancedConfig).every(v => v) ? 'linear-gradient(135deg,#0F2D55,#0D9488)' : '#E5EAF0', color: Object.values(data.enhancedConfig).every(v => v) ? 'white' : '#94A3B8' }}>
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ══ CHECKOUT (contact + payment) ══ */}
            {step === 'checkout' && (
              <CheckoutStep data={data} totalPremium={totalPremium}
                emirateName={emirateName} isDubai={isDubai} onBack={goBack} router={router} />
            )}

          </motion.div>
        </AnimatePresence>

        {/* Trust strip */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[['🏆','Best Price Guaranteed'],['🔒','Secure & Private'],['🏥','14+ Insurers'],['📞','Claims Assistance']].map(([icon, text]) => (
            <div key={text} className="bg-white rounded-xl p-3 flex flex-col items-center gap-1.5 border" style={{ borderColor: '#E5EAF0' }}>
              <span className="text-2xl">{icon}</span>
              <span className="font-sans font-semibold text-[11.5px] text-center" style={{ color: '#475569' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Checkout step ──────────────────────────────────────── */
function CheckoutStep({ data, totalPremium, emirateName, isDubai, onBack, router }: {
  data: QuoteData
  totalPremium: number
  emirateName: Record<string, string>
  isDubai: boolean
  onBack: () => void
  router: ReturnType<typeof useRouter>
}) {
  const [paid, setPaid] = useState(false)
  const stamp = 750
  const total = totalPremium + stamp
  const monthly = Math.round(total / 12)

  const contactEmail = data.memberType === 'dependent' ? data.sponsorEmail : data.selfEmail
  const contactName  = data.memberType === 'dependent' ? data.sponsorName  : data.selfName

  const planLabel = isDubai
    ? (data.planType === 'basic' ? 'Basic DHA Plan' : 'Enhanced Plan')
    : (data.planType ? data.planType.charAt(0).toUpperCase() + data.planType.slice(1) + ' Plan' : 'Plan')

  if (paid) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border bg-white p-10 text-center" style={{ borderColor: '#E5EAF0' }}>
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="font-display font-bold text-[22px] mb-2" style={{ color: '#0F2D55' }}>Policy Confirmed!</h2>
        <p className="font-sans text-[14px] mb-2" style={{ color: '#64748B' }}>
          Your DHA-compliant health insurance certificate will be emailed to{' '}
          <strong>{contactEmail || 'your email'}</strong> within 24 hours.
        </p>
        <p className="font-sans font-bold text-[15px] mb-6" style={{ color: '#0D9488' }}>
          AED {total.toLocaleString()} charged successfully
        </p>
        <a href="/dashboard"
          className="inline-flex h-12 px-8 rounded-xl font-sans font-bold text-[14px] text-white items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
          View My Dashboard →
        </a>
      </motion.div>
    )
  }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🛒</div>
        <h2 className="font-display font-bold text-[24px] mb-1" style={{ color: '#0F2D55' }}>Review & Pay</h2>
        <p className="font-sans text-[14px]" style={{ color: '#64748B' }}>Confirm your details and complete payment securely</p>
      </div>

      {/* Plan summary bar */}
      <div className="mb-5 rounded-2xl p-5 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
        <div>
          <div className="font-sans text-[11px] font-semibold text-white/60 mb-0.5">{emirateName[data.emirate] ?? ''} · {data.memberType === 'self' ? 'Self' : 'Dependent'}</div>
          <div className="font-display font-extrabold text-[20px] text-white">{planLabel}</div>
        </div>
        <div className="text-right">
          <div className="font-display font-extrabold text-[26px] text-white leading-none">
            AED {total.toLocaleString()}
          </div>
          <div className="font-sans text-[11px] text-white/60">incl. stamp duty</div>
        </div>
      </div>

      {/* Policy holder summary */}
      <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5EAF0' }}>
        <p className="font-sans font-bold text-[11px] uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>
          {data.memberType === 'self' ? 'Policy Holder' : 'Dependent & Sponsor'}
        </p>
        {data.memberType === 'self' ? (
          <div className="grid grid-cols-2 gap-3 text-[13px]">
            <SummaryRow label="Name"        value={data.selfName} />
            <SummaryRow label="EID"         value={data.selfEID || '—'} />
            <SummaryRow label="Email"       value={data.selfEmail} />
            <SummaryRow label="Mobile"      value={`+971 ${data.selfPhone}`} />
            <SummaryRow label="Nationality" value={data.selfNationality} />
            <SummaryRow label="Salary Band" value={data.selfSalaryBand.toUpperCase()} />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="font-sans text-[11px] font-semibold mb-2" style={{ color: '#64748B' }}>
                Dependent ({data.dependentType})
              </p>
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <SummaryRow label="Name"        value={data.depName} />
                <SummaryRow label="Email"       value={data.depEmail} />
                <SummaryRow label="Mobile"      value={`+971 ${data.depPhone}`} />
                <SummaryRow label="Nationality" value={data.depNationality} />
              </div>
            </div>
            <div className="pt-4 border-t" style={{ borderColor: '#E5EAF0' }}>
              <p className="font-sans text-[11px] font-semibold mb-2" style={{ color: '#64748B' }}>Sponsor</p>
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <SummaryRow label="Name"        value={data.sponsorName} />
                <SummaryRow label="EID"         value={data.sponsorEID || '—'} />
                <SummaryRow label="Email"       value={data.sponsorEmail} />
                <SummaryRow label="Mobile"      value={`+971 ${data.sponsorPhone}`} />
                <SummaryRow label="Nationality" value={data.sponsorNationality} />
                <SummaryRow label="Salary Band" value={data.sponsorSalaryBand.toUpperCase()} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment summary */}
      <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5EAF0' }}>
        <p className="font-sans font-bold text-[11px] uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>Payment Summary</p>
        <div className="space-y-2 font-sans text-[13.5px]">
          <div className="flex justify-between">
            <span style={{ color: '#64748B' }}>Annual premium</span>
            <span className="font-semibold" style={{ color: '#0F2D55' }}>AED {totalPremium.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: '#64748B' }}>≈ Monthly</span>
            <span className="font-semibold" style={{ color: '#0F2D55' }}>AED {monthly.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: '#64748B' }}>Stamp duty &amp; levies</span>
            <span className="font-semibold" style={{ color: '#0F2D55' }}>AED {stamp.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: '#E5EAF0' }}>
            <span className="font-display font-bold text-[15px]" style={{ color: '#0F2D55' }}>Total due</span>
            <span className="font-display font-extrabold text-[22px]" style={{ color: '#0D9488' }}>AED {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3.5 rounded-xl mb-5" style={{ backgroundColor: '#F0FDFA' }}>
        <Shield className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#0D9488' }} />
        <p className="font-sans text-[12px]" style={{ color: '#0A7A72' }}>
          Secure payment. IA-licensed. DHA-compliant certificate emailed to <strong>{contactName || 'you'}</strong> within 24 hours.
        </p>
      </div>

      <button type="button" onClick={() => setPaid(true)}
        className="w-full h-14 rounded-xl font-sans font-extrabold text-[16px] text-white flex items-center justify-center gap-3 transition-all mb-3 hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
        style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}>
        Pay AED {total.toLocaleString()} Securely
        <ArrowRight className="w-5 h-5" />
      </button>
      <button type="button" onClick={onBack}
        className="w-full h-11 rounded-xl border font-sans font-medium text-[13.5px] flex items-center justify-center gap-2 transition-colors hover:bg-[#F4F7FB]"
        style={{ borderColor: '#E5EAF0', color: '#64748B' }}>
        <ChevronLeft className="w-4 h-4" /> Back to Plan Selection
      </button>
    </div>
  )
}

/* ─── ConfigSection ──────────────────────────────────────── */
function ConfigSection({ title, icon: Icon, options, selected, onSelect }: {
  title: string
  icon: React.ElementType
  options: { id: string; label: string; sub?: string; addOnPct: number }[]
  selected: string
  onSelect: (v: string) => void
}) {
  return (
    <div className="bg-white rounded-2xl border p-4" style={{ borderColor: '#E5EAF0' }}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" style={{ color: '#0D9488' }} />
        <span className="font-sans font-bold text-[13.5px]" style={{ color: '#0F2D55' }}>{title}</span>
        {selected && <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0" style={{ color: '#0D9488' }} />}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {options.map(opt => (
          <button key={opt.id} type="button" onClick={() => onSelect(opt.id)}
            className="p-2.5 rounded-xl border-2 text-left transition-all hover:-translate-y-0.5"
            style={{
              borderColor: selected === opt.id ? '#0D9488' : '#E5EAF0',
              backgroundColor: selected === opt.id ? '#F0FDFA' : '#F8FAFC',
            }}>
            <div className="font-sans font-bold text-[12.5px]" style={{ color: selected === opt.id ? '#0A7A72' : '#0F2D55' }}>{opt.label}</div>
            {opt.sub && <div className="font-sans text-[10.5px] mt-0.5" style={{ color: '#64748B' }}>{opt.sub}</div>}
            {opt.addOnPct > 0 && (
              <div className="font-sans text-[10px] mt-1" style={{ color: '#D4A24B' }}>
                +{Math.round(opt.addOnPct * 100)}% premium
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Sub-components ─────────────────────────────────────── */
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
        active ? 'border-[#0D9488] bg-[#F0FDFA] shadow-sm' : 'border-[#E5EAF0] bg-white hover:border-[#2DD4BF] hover:bg-[#F0FDFA]')}>
      {children}
      {active && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" style={{ color: '#0D9488' }} />}
    </button>
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

function BenefitRow({ label, value, custom }: { label: string; value: string; custom?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-sans text-[11.5px] shrink-0" style={{ color: '#64748B' }}>{label}</span>
      <span className="font-sans font-semibold text-[11.5px] ml-auto text-right"
        style={{ color: custom ? '#D4A24B' : '#0F2D55' }}>{value}</span>
    </div>
  )
}

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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-sans text-[11px]" style={{ color: '#94A3B8' }}>{label}</div>
      <div className="font-sans font-semibold text-[13px] truncate" style={{ color: '#0F2D55' }}>{value || '—'}</div>
    </div>
  )
}

/* ─── Nationality list ───────────────────────────────────── */
const NATIONALITIES = [
  { name: 'UAE',           flag: '🇦🇪' },
  { name: 'India',         flag: '🇮🇳' },
  { name: 'Pakistan',      flag: '🇵🇰' },
  { name: 'Philippines',   flag: '🇵🇭' },
  { name: 'Bangladesh',    flag: '🇧🇩' },
  { name: 'Egypt',         flag: '🇪🇬' },
  { name: 'Jordan',        flag: '🇯🇴' },
  { name: 'Lebanon',       flag: '🇱🇧' },
  { name: 'Saudi Arabia',  flag: '🇸🇦' },
  { name: 'Nepal',         flag: '🇳🇵' },
  { name: 'Sri Lanka',     flag: '🇱🇰' },
  { name: 'Indonesia',     flag: '🇮🇩' },
  { name: 'Ethiopia',      flag: '🇪🇹' },
  { name: 'United Kingdom',flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Canada',        flag: '🇨🇦' },
  { name: 'Australia',     flag: '🇦🇺' },
  { name: 'France',        flag: '🇫🇷' },
  { name: 'Germany',       flag: '🇩🇪' },
  { name: 'China',         flag: '🇨🇳' },
  { name: 'Other',         flag: '🌍' },
]

function NationalitySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const selected = NATIONALITIES.find(n => n.name === value)
  const filtered = NATIONALITIES.filter(n => n.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white flex items-center gap-2.5 text-left transition-all"
        style={{ borderColor: open ? '#0D9488' : '#E5EAF0', boxShadow: open ? '0 0 0 3px rgba(13,148,136,0.12)' : 'none', color: value ? '#0F2D55' : '#94A3B8' }}>
        {selected ? <><span className="text-lg">{selected.flag}</span><span>{selected.name}</span></> : 'Select nationality'}
        <span className="ml-auto text-[#94A3B8] text-[10px]">▼</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSearch('') }} />
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-xl border shadow-xl overflow-hidden"
            style={{ borderColor: '#E5EAF0' }}>
            <div className="p-2.5 border-b" style={{ borderColor: '#F1F5F9' }}>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search nationality…"
                className="w-full h-9 rounded-lg border px-3 font-sans text-[13px] outline-none bg-[#F8FAFC]"
                style={{ borderColor: '#E5EAF0' }}
                autoFocus />
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 && (
                <p className="px-4 py-3 font-sans text-[13px]" style={{ color: '#94A3B8' }}>No results</p>
              )}
              {filtered.map(n => (
                <button key={n.name} type="button"
                  onClick={() => { onChange(n.name); setOpen(false); setSearch('') }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 font-sans text-[13.5px] text-left transition-colors hover:bg-[#F0FDFA]"
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

/* ─── Existing policy section ────────────────────────────── */
const UAE_INSURERS = [
  'Daman','AXA Gulf','GIG Gulf','ADNIC','Sukoon','Cigna','Allianz',
  'Neuron','RSA','MetLife','Oman Insurance','Orient','Union Insurance',
  'Emirates Insurance','Watania','Al Ain Ahlia','Other',
]

function ExistingPolicySection({ has, insurer, expiry, onToggle, onInsurer, onExpiry }: {
  has: boolean; insurer: string; expiry: string
  onToggle: (v: boolean) => void; onInsurer: (v: string) => void; onExpiry: (v: string) => void
}) {
  return (
    <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5EAF0' }}>
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="font-sans font-bold text-[13.5px]" style={{ color: '#0F2D55' }}>Existing Health Insurance Policy?</p>
          <p className="font-sans text-[12px]" style={{ color: '#64748B' }}>Helps us find you the best renewal deal</p>
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
              className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none appearance-none"
              style={{ borderColor: '#E5EAF0', color: insurer ? '#0F2D55' : '#94A3B8' }}>
              <option value="">Select insurer</option>
              {UAE_INSURERS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </FormField>
          <FormField label="Policy Expiry Date">
            <input type="date" value={expiry} onChange={e => onExpiry(e.target.value)}
              className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none"
              style={{ borderColor: '#E5EAF0', color: expiry ? '#0F2D55' : '#94A3B8' }}
              onFocus={foc} onBlur={blu} />
          </FormField>
        </motion.div>
      )}
    </div>
  )
}

function foc(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = '#0D9488'
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.12)'
}
function blu(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = '#E5EAF0'
  e.currentTarget.style.boxShadow = 'none'
}
