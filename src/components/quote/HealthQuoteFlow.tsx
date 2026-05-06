'use client'
import { useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, CheckCircle2, ArrowRight, Shield, Star,
  Stethoscope, Hospital, Pill, TrendingUp, Users, User,
} from 'lucide-react'
import Logo from '@/components/ui/Logo'

/* ─── Plan data ───────────────────────────────────────────── */
interface Plan {
  id: string
  name: string
  badge?: string
  insurer: string
  premium: number  // AED per year (self/LSB base)
  premiumNLSB?: number
  tag?: string
  tagColor?: string
  benefits: {
    consultation: string
    inpatient: string
    outpatient: string
    medicineLimit: string
    medicineCopay: string
    extras?: string[]
  }
  highlights: string[]
  recommended?: boolean
}

// Non-Dubai — 3 fixed plans
const NON_DUBAI_PLANS: Plan[] = [
  {
    id: 'essential',
    name: 'Essential',
    insurer: 'Neuron / RSA',
    premium: 550,
    benefits: {
      consultation: 'AED 50 copay per visit',
      inpatient: 'AED 150,000 / year',
      outpatient: 'AED 3,000 / year',
      medicineLimit: 'AED 1,500 / year',
      medicineCopay: '20% copay',
    },
    highlights: [
      'Covers emergency & hospitalisation',
      'General GP visits',
      'Basic prescription medicines',
      'UAE-wide clinic network',
    ],
  },
  {
    id: 'enhanced',
    name: 'Enhanced',
    insurer: 'Daman / GIG Gulf',
    premium: 1_050,
    tag: 'Most Popular',
    tagColor: '#0D9488',
    recommended: true,
    benefits: {
      consultation: 'AED 30 copay per visit',
      inpatient: 'AED 500,000 / year',
      outpatient: 'AED 7,500 / year',
      medicineLimit: 'AED 3,000 / year',
      medicineCopay: '15% copay',
      extras: ['Dental AED 1,500/yr', 'Optical AED 500/yr'],
    },
    highlights: [
      'Wider specialist network',
      'Dental & optical included',
      'Maternity basic cover',
      'Chronic disease management',
      'Direct billing at 400+ facilities',
    ],
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive',
    insurer: 'AXA Gulf / Allianz',
    premium: 1_980,
    benefits: {
      consultation: 'No copay',
      inpatient: 'AED 3,000,000 / year',
      outpatient: 'AED 15,000 / year',
      medicineLimit: 'AED 5,000 / year',
      medicineCopay: '10% copay',
      extras: ['Dental AED 3,000/yr', 'Optical AED 1,000/yr', 'Maternity AED 10,000/yr', 'Mental health cover'],
    },
    highlights: [
      'Premium all-UAE network',
      'International emergency coverage',
      'Full maternity & newborn',
      'Unlimited IP at top hospitals',
      'Mental health & wellness',
      'Chronic & pre-existing review',
    ],
  },
]

// Dubai LSB plans (salary ≤ AED 4,000)
const DUBAI_LSB_PLANS: Plan[] = [
  {
    id: 'basic_dha',
    name: 'Basic DHA',
    badge: 'DHA Mandatory',
    insurer: 'Neuron / RSA',
    premium: 620,
    benefits: {
      consultation: 'AED 50 copay',
      inpatient: 'AED 150,000 / year',
      outpatient: 'AED 1,500 / year',
      medicineLimit: 'AED 1,500 / year',
      medicineCopay: '20% copay',
    },
    highlights: [
      'DHA-compliant mandatory plan',
      'Emergency hospitalisation',
      'Basic GP visits in Dubai',
      'Employer-sponsored eligible',
    ],
  },
  {
    id: 'enhanced_dubai_lsb',
    name: 'Enhanced Dubai',
    insurer: 'Daman / GIG Gulf',
    premium: 1_080,
    tag: 'Recommended',
    tagColor: '#0D9488',
    recommended: true,
    benefits: {
      consultation: 'AED 30 copay',
      inpatient: 'AED 500,000 / year',
      outpatient: 'AED 5,000 / year',
      medicineLimit: 'AED 3,000 / year',
      medicineCopay: '15% copay',
      extras: ['Dental AED 1,000/yr', 'Maternity basic'],
    },
    highlights: [
      'Wider network beyond basic DHA',
      'Specialist referrals included',
      'Direct billing at 500+ facilities',
      'Dental & maternity top-up',
      'Chronic condition management',
    ],
  },
]

// Dubai NLSB plans (salary > AED 4,000)
const DUBAI_NLSB_PLANS: Plan[] = [
  {
    id: 'standard_nlsb',
    name: 'Standard',
    insurer: 'ADNIC / Sukoon',
    premium: 1_350,
    benefits: {
      consultation: 'AED 30 copay',
      inpatient: 'AED 1,000,000 / year',
      outpatient: 'AED 10,000 / year',
      medicineLimit: 'AED 5,000 / year',
      medicineCopay: '15% copay',
    },
    highlights: [
      'Broad Dubai network',
      'Specialist & diagnostics',
      'Prescription medicines',
      'Physiotherapy sessions',
    ],
  },
  {
    id: 'enhanced_nlsb',
    name: 'Enhanced',
    insurer: 'AXA Gulf / Cigna',
    premium: 2_100,
    tag: 'Best Value',
    tagColor: '#D4A24B',
    recommended: true,
    benefits: {
      consultation: 'No copay',
      inpatient: 'AED 3,000,000 / year',
      outpatient: 'AED 20,000 / year',
      medicineLimit: 'AED 10,000 / year',
      medicineCopay: '10% copay',
      extras: ['Dental AED 3,000/yr', 'Optical AED 1,000/yr', 'Maternity AED 15,000/yr'],
    },
    highlights: [
      'Premium network — top UAE hospitals',
      'No copay on consultations',
      'Full maternity & newborn cover',
      'Dental & optical included',
      'International emergency SOS',
      'Mental health & wellness',
    ],
  },
]

/* ─── Types ──────────────────────────────────────────────── */
type StepId = 'contact' | 'emirate' | 'salary' | 'member_type' | 'dependents' | 'plan_compare' | 'premium'

interface QuoteData {
  name: string
  email: string
  mobile: string
  emirate: string
  salaryBand: string   // 'lsb' | 'nlsb'
  memberType: string   // 'self' | 'dependent'
  hasSpouse: boolean
  children: number
  hasParents: boolean
  selectedPlan: Plan | null
}

/* ─── Helpers ─────────────────────────────────────────────── */
function cn(...cls: (string | boolean | undefined | null)[]) {
  return cls.filter(Boolean).join(' ')
}

const slide = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.26, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, x: -32, transition: { duration: 0.18 } },
}

function computePremium(plan: Plan, data: QuoteData): number {
  let base = data.salaryBand === 'lsb' ? plan.premium : (plan.premiumNLSB ?? plan.premium)
  let total = base
  if (data.hasSpouse) total += base * 0.85
  total += data.children * base * 0.55
  if (data.hasParents) total += base * 1.2
  return Math.round(total)
}

/* ─── Main ───────────────────────────────────────────────── */
export default function HealthQuoteFlow() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialEmirate = searchParams.get('emirate') || ''
  const isDubaiStart = initialEmirate === 'dubai'

  const [step, setStep] = useState<StepId>(initialEmirate ? (isDubaiStart ? 'contact' : 'contact') : 'contact')

  const [data, setData] = useState<QuoteData>({
    name: '', email: '', mobile: '',
    emirate: initialEmirate,
    salaryBand: '',
    memberType: '',
    hasSpouse: false,
    children: 0,
    hasParents: false,
    selectedPlan: null,
  })

  const set = useCallback(<K extends keyof QuoteData>(k: K, v: QuoteData[K]) =>
    setData(prev => ({ ...prev, [k]: v })), [])

  const isDubai = data.emirate === 'dubai'

  function getSteps(): StepId[] {
    const steps: StepId[] = ['contact', 'emirate']
    if (!data.emirate) return steps
    if (!isDubai) {
      steps.push('plan_compare', 'premium')
      return steps
    }
    steps.push('salary', 'member_type')
    if (data.memberType === 'dependent') steps.push('dependents')
    steps.push('plan_compare', 'premium')
    return steps
  }

  const steps = getSteps()
  const stepIdx = steps.indexOf(step)
  const progress = Math.round(((stepIdx + 1) / steps.length) * 100)

  function goNext() {
    // Special: after emirate, if non-dubai skip straight to plan_compare
    if (step === 'emirate' && data.emirate && data.emirate !== 'dubai') {
      setStep('plan_compare')
      return
    }
    const next = steps[stepIdx + 1]
    if (next) setStep(next)
  }

  function goBack() {
    const prev = steps[stepIdx - 1]
    if (prev) setStep(prev)
  }

  function getPlans(): Plan[] {
    if (!isDubai) return NON_DUBAI_PLANS
    if (data.salaryBand === 'lsb') return DUBAI_LSB_PLANS
    return DUBAI_NLSB_PLANS
  }

  const emirateName = {
    dubai: 'Dubai', abudhabi: 'Abu Dhabi', sharjah: 'Sharjah',
    ajman: 'Ajman', rak: 'RAK', fujairah: 'Fujairah', uaq: 'UAQ',
  }[data.emirate] ?? data.emirate

  /* Section tabs for top bar */
  const SECTIONS = isDubai
    ? ['Contact', 'Emirate', 'Salary', 'Members', 'Plans', 'Premium']
    : ['Contact', 'Emirate', 'Plans', 'Premium']

  const sectionStepMap = isDubai
    ? [['contact'], ['emirate'], ['salary'], ['member_type', 'dependents'], ['plan_compare'], ['premium']]
    : [['contact'], ['emirate'], ['plan_compare'], ['premium']]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F7FB' }}>

      {/* Top header */}
      <div className="bg-white border-b sticky top-0 z-40" style={{ borderColor: 'var(--border-default)' }}>
        <div className="max-w-[860px] mx-auto px-5 h-14 flex items-center justify-between">
          <Logo size={30} />
          <div className="flex items-center gap-4">
            <a href="tel:+97180047867" className="hidden sm:flex items-center gap-1.5 font-sans text-[13px] font-semibold"
              style={{ color: '#0D9488' }}>
              📞 800-INSURE
            </a>
            <div className="flex items-center gap-1.5 font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
              <Shield className="w-3.5 h-3.5" style={{ color: '#0D9488' }} />
              IA Licensed
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b" style={{ borderColor: 'var(--border-default)' }}>
        <div className="max-w-[860px] mx-auto px-5">
          <div className="flex items-center py-3 gap-0">
            {SECTIONS.map((sec, i) => {
              const stepIds = sectionStepMap[i] as StepId[]
              const done = stepIds.every(s => steps.indexOf(s) < stepIdx)
              const active = stepIds.includes(step)
              return (
                <div key={sec} className="flex-1 flex flex-col items-center relative">
                  {i > 0 && (
                    <div className="absolute left-0 top-[14px] w-full h-0.5 -translate-y-1/2"
                      style={{ backgroundColor: done ? '#0D9488' : '#E5EAF0', zIndex: 0 }} />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-sans font-bold text-[11px] transition-all"
                      style={{
                        backgroundColor: done ? '#0D9488' : active ? '#0F2D55' : 'white',
                        border: done || active ? 'none' : '2px solid #CBD5E1',
                        color: done || active ? 'white' : '#94A3B8',
                      }}>
                      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className="font-sans font-medium text-[9.5px] text-center leading-tight hidden sm:block"
                      style={{ color: active ? '#0F2D55' : done ? '#0D9488' : '#94A3B8' }}>
                      {sec}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="h-1 w-full rounded-full overflow-hidden mb-2" style={{ backgroundColor: '#E5EAF0' }}>
            <div className="h-full transition-all duration-500 rounded-full"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #0F2D55, #0D9488)' }} />
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-[680px] mx-auto px-5 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={step} variants={slide} initial="initial" animate="animate" exit="exit">

            {/* ══ CONTACT ══ */}
            {step === 'contact' && (
              <Shell title="Enter Your Details" sub="Your information is secure and encrypted" icon="👤">
                <div className="space-y-4">
                  <Field label="Full name">
                    <input type="text" value={data.name} placeholder="Ahmed Al Mansoori"
                      onChange={e => set('name', e.target.value)}
                      className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none"
                      style={{ borderColor: 'var(--border-medium)' }}
                      onFocus={foc} onBlur={blu} />
                  </Field>
                  <Field label="Email address">
                    <input type="email" value={data.email} placeholder="you@example.com"
                      onChange={e => set('email', e.target.value)}
                      className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none"
                      style={{ borderColor: 'var(--border-medium)' }}
                      onFocus={foc} onBlur={blu} />
                  </Field>
                  <Field label="UAE mobile number">
                    <div className="flex">
                      <span className="flex items-center px-3.5 border border-r-0 rounded-l-xl font-sans font-semibold text-[13px] shrink-0"
                        style={{ borderColor: 'var(--border-medium)', backgroundColor: '#F4F7FB', color: 'var(--text-secondary)' }}>
                        🇦🇪 +971
                      </span>
                      <input type="tel" value={data.mobile} placeholder="50 123 4567"
                        onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 9))}
                        className="flex-1 h-12 rounded-r-xl border px-4 font-sans text-[14px] bg-white outline-none"
                        style={{ borderColor: 'var(--border-medium)' }}
                        onFocus={foc} onBlur={blu} />
                    </div>
                  </Field>
                  <p className="font-sans text-[11.5px] leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
                    By continuing, I agree to InsureAE&apos;s Privacy Policy and Terms of Use, and confirm I am a UAE resident.
                  </p>
                </div>
                <Buttons onNext={goNext} disabled={!data.name || !data.email || data.mobile.length < 8} hideBack />
              </Shell>
            )}

            {/* ══ EMIRATE ══ */}
            {step === 'emirate' && (
              <Shell title="Emirate of Visa Issuance" sub="Coverage terms and mandatory plans differ by emirate" icon="📍">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'dubai',    label: 'Dubai',     abbr: 'DXB', note: 'DHA mandatory' },
                    { id: 'abudhabi', label: 'Abu Dhabi', abbr: 'AUH', note: 'HAAD rules' },
                    { id: 'sharjah',  label: 'Sharjah',  abbr: 'SHJ', note: '' },
                    { id: 'ajman',    label: 'Ajman',    abbr: 'AJM', note: '' },
                    { id: 'rak',      label: 'RAK',      abbr: 'RKT', note: '' },
                    { id: 'fujairah', label: 'Fujairah', abbr: 'FJR', note: '' },
                    { id: 'uaq',      label: 'UAQ',      abbr: 'UAQ', note: '' },
                  ].map(({ id, label, abbr, note }) => (
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
                <Buttons onNext={goNext} disabled={!data.emirate} onBack={goBack} />
              </Shell>
            )}

            {/* ══ SALARY (Dubai only) ══ */}
            {step === 'salary' && (
              <Shell title="What is your monthly salary?" sub="Determines your DHA tier and minimum plan requirements" icon="💼">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'lsb',
                      title: 'LSB',
                      subtitle: 'Low Salary Band',
                      amount: 'Up to AED 4,000 / month',
                      note: 'DHA Basic plan required',
                      color: '#0D9488',
                    },
                    {
                      id: 'nlsb',
                      title: 'NLSB',
                      subtitle: 'Non-Low Salary Band',
                      amount: 'Above AED 4,000 / month',
                      note: 'Access to enhanced plans',
                      color: '#0F2D55',
                    },
                  ].map(({ id, title, subtitle, amount, note, color }) => {
                    const active = data.salaryBand === id
                    return (
                      <button key={id} type="button"
                        onClick={() => { set('salaryBand', id); setTimeout(goNext, 200) }}
                        className="flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all w-full hover:-translate-y-0.5"
                        style={{
                          borderColor: active ? color : 'var(--border-default)',
                          backgroundColor: active ? (id === 'lsb' ? '#F0FDFA' : '#EBF2FA') : 'white',
                        }}>
                        <div className="flex items-center justify-between w-full mb-3">
                          <span className="font-display font-extrabold text-[22px]" style={{ color }}>{title}</span>
                          {active && <CheckCircle2 className="w-5 h-5" style={{ color }} />}
                        </div>
                        <div className="font-sans font-bold text-[14px] mb-1" style={{ color: 'var(--text-primary)' }}>{subtitle}</div>
                        <div className="font-sans text-[13px] mb-2" style={{ color: 'var(--text-secondary)' }}>{amount}</div>
                        <div className="text-[11px] font-sans px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: active ? color : '#F1F5F9', color: active ? 'white' : '#64748B' }}>
                          {note}
                        </div>
                      </button>
                    )
                  })}
                </div>
                <Buttons onNext={goNext} disabled={!data.salaryBand} onBack={goBack} />
              </Shell>
            )}

            {/* ══ MEMBER TYPE (Dubai only) ══ */}
            {step === 'member_type' && (
              <Shell title="Who are you insuring?" sub="Select the primary category for this policy" icon="👥">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'self',      label: 'Self Only',      sub: 'Coverage for yourself',       icon: User },
                    { id: 'dependent', label: 'Self + Dependents', sub: 'Spouse, children, parents', icon: Users },
                  ].map(({ id, label, sub, icon: Icon }) => {
                    const active = data.memberType === id
                    return (
                      <button key={id} type="button"
                        onClick={() => { set('memberType', id); setTimeout(goNext, 200) }}
                        className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 text-center transition-all hover:-translate-y-0.5 gap-3"
                        style={{
                          borderColor: active ? '#0D9488' : 'var(--border-default)',
                          backgroundColor: active ? '#F0FDFA' : 'white',
                        }}>
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: active ? '#0D9488' : '#EBF2FA' }}>
                          <Icon className="w-7 h-7" style={{ color: active ? 'white' : '#133B6E' }} />
                        </div>
                        <div>
                          <div className="font-sans font-bold text-[15px]"
                            style={{ color: active ? '#0A7A72' : 'var(--text-primary)' }}>{label}</div>
                          <div className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</div>
                        </div>
                        {active && <CheckCircle2 className="w-5 h-5" style={{ color: '#0D9488' }} />}
                      </button>
                    )
                  })}
                </div>
                <Buttons onNext={goNext} disabled={!data.memberType} onBack={goBack} />
              </Shell>
            )}

            {/* ══ DEPENDENTS (Dubai only) ══ */}
            {step === 'dependents' && (
              <Shell title="Add Your Dependents" sub="Enter details for each person to be covered" icon="👨‍👩‍👧‍👦">
                <div className="space-y-4">
                  {/* Spouse */}
                  <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
                    <div className="flex items-center justify-between px-4 py-3 border-b"
                      style={{ backgroundColor: '#EBF2FA', borderColor: 'var(--border-subtle)' }}>
                      <span className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>Spouse</span>
                      <button type="button"
                        onClick={() => set('hasSpouse', !data.hasSpouse)}
                        className="relative w-11 h-6 rounded-full transition-all"
                        style={{ backgroundColor: data.hasSpouse ? '#0D9488' : '#CBD5E1' }}>
                        <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                          style={{ left: data.hasSpouse ? '22px' : '2px' }} />
                      </button>
                    </div>
                    {data.hasSpouse && (
                      <div className="p-4">
                        <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
                          Spouse will be added to this policy. Details collected at checkout.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Children */}
                  <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
                    <div className="flex items-center justify-between px-4 py-3 border-b"
                      style={{ backgroundColor: '#EBF2FA', borderColor: 'var(--border-subtle)' }}>
                      <span className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>Children</span>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <span className="font-sans text-[14px]" style={{ color: 'var(--text-secondary)' }}>Number of children</span>
                      <div className="flex items-center gap-3">
                        <button type="button"
                          onClick={() => set('children', Math.max(0, data.children - 1))}
                          className="w-9 h-9 rounded-xl border flex items-center justify-center text-lg font-bold transition-colors hover:bg-gray-50"
                          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}>−</button>
                        <span className="font-display font-bold text-[20px] w-8 text-center"
                          style={{ color: '#0F2D55' }}>{data.children}</span>
                        <button type="button"
                          onClick={() => set('children', Math.min(8, data.children + 1))}
                          className="w-9 h-9 rounded-xl border flex items-center justify-center text-lg font-bold transition-colors hover:bg-[#F0FDFA]"
                          style={{ borderColor: data.children < 8 ? '#0D9488' : 'var(--border-medium)', color: data.children < 8 ? '#0D9488' : 'var(--text-subtle)' }}>+</button>
                      </div>
                    </div>
                  </div>

                  {/* Parents */}
                  <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
                    <div className="flex items-center justify-between px-4 py-3 border-b"
                      style={{ backgroundColor: '#EBF2FA', borderColor: 'var(--border-subtle)' }}>
                      <span className="font-sans font-bold text-[13px]" style={{ color: '#0F2D55' }}>Parents</span>
                      <button type="button"
                        onClick={() => set('hasParents', !data.hasParents)}
                        className="relative w-11 h-6 rounded-full transition-all"
                        style={{ backgroundColor: data.hasParents ? '#0D9488' : '#CBD5E1' }}>
                        <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                          style={{ left: data.hasParents ? '22px' : '2px' }} />
                      </button>
                    </div>
                    {data.hasParents && (
                      <div className="p-4">
                        <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
                          Parents will be added. Individual details collected at checkout.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <Buttons onNext={goNext} disabled={false} onBack={goBack} nextLabel="View Plans" />
              </Shell>
            )}

            {/* ══ PLAN COMPARISON ══ */}
            {step === 'plan_compare' && (
              <div>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-3 font-sans font-semibold text-[12px]"
                    style={{ backgroundColor: '#F0FDFA', color: '#0D9488', border: '1px solid #CCFBF1' }}>
                    ✓ Plans for {emirateName}{isDubai && data.salaryBand ? ` · ${data.salaryBand.toUpperCase()}` : ''}
                  </div>
                  <h2 className="font-display font-bold text-[24px] mb-1" style={{ color: '#0F2D55' }}>
                    Choose Your Plan
                  </h2>
                  <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>
                    {isDubai ? 'DHA-compliant options for your salary band' : 'Fixed plans available for your emirate'}
                  </p>
                </div>

                <div className={cn(
                  'grid gap-4',
                  getPlans().length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
                )}>
                  {getPlans().map(plan => {
                    const selected = data.selectedPlan?.id === plan.id
                    return (
                      <div key={plan.id}
                        className={cn(
                          'relative rounded-2xl border-2 overflow-hidden cursor-pointer transition-all hover:-translate-y-1',
                          selected ? 'border-[#0D9488] shadow-xl' : 'border-[var(--border-default)] bg-white hover:border-[#2DD4BF]',
                          plan.recommended ? 'ring-2 ring-[#0D9488] ring-offset-2' : ''
                        )}
                        onClick={() => { set('selectedPlan', plan); }}
                        style={{ backgroundColor: selected ? '#F0FDFA' : 'white' }}>

                        {plan.tag && (
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full font-sans font-bold text-[10px] text-white"
                            style={{ backgroundColor: plan.tagColor ?? '#0D9488' }}>
                            {plan.tag}
                          </div>
                        )}
                        {plan.badge && (
                          <div className="px-4 pt-3 pb-0">
                            <span className="inline-block px-2 py-0.5 rounded-md font-sans font-bold text-[9.5px] uppercase tracking-wide"
                              style={{ backgroundColor: '#EBF2FA', color: '#0F2D55' }}>
                              {plan.badge}
                            </span>
                          </div>
                        )}

                        <div className="p-4 pb-3">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h3 className="font-display font-extrabold text-[18px]"
                                style={{ color: selected ? '#0A7A72' : '#0F2D55' }}>{plan.name}</h3>
                              <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{plan.insurer}</p>
                            </div>
                            {selected && <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#0D9488' }} />}
                          </div>

                          <div className="my-3 py-3 border-y" style={{ borderColor: 'var(--border-subtle)' }}>
                            <div className="font-display font-extrabold text-[28px] leading-none" style={{ color: '#0F2D55' }}>
                              AED {plan.premium.toLocaleString()}
                            </div>
                            <div className="font-sans text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>per year · self</div>
                          </div>

                          {/* Benefits breakdown */}
                          <div className="space-y-2">
                            <BenefitRow icon={Stethoscope} label="Consultation" value={plan.benefits.consultation} />
                            <BenefitRow icon={Hospital}    label="In-patient"  value={plan.benefits.inpatient} />
                            <BenefitRow icon={TrendingUp}  label="Out-patient" value={plan.benefits.outpatient} />
                            <BenefitRow icon={Pill}        label="Medicine limit"  value={plan.benefits.medicineLimit} />
                            <BenefitRow icon={Pill}        label="Medicine copay"  value={plan.benefits.medicineCopay} />
                          </div>

                          {/* Highlights */}
                          <div className="mt-3 pt-3 border-t space-y-1.5" style={{ borderColor: 'var(--border-subtle)' }}>
                            {plan.highlights.map(h => (
                              <div key={h} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#0D9488' }} />
                                <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{h}</span>
                              </div>
                            ))}
                            {plan.benefits.extras?.map(e => (
                              <div key={e} className="flex items-start gap-2">
                                <Star className="w-3.5 h-3.5 mt-0.5 shrink-0 fill-current" style={{ color: '#D4A24B' }} />
                                <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{e}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="px-4 pb-4">
                          <button
                            type="button"
                            onClick={() => { set('selectedPlan', plan); setTimeout(goNext, 150) }}
                            className="w-full h-10 rounded-xl font-sans font-bold text-[13.5px] transition-all hover:opacity-90"
                            style={{
                              background: selected
                                ? 'linear-gradient(135deg, #0F2D55 0%, #0D9488 100%)'
                                : '#F4F7FB',
                              color: selected ? 'white' : '#0F2D55',
                              border: selected ? 'none' : '1px solid #CBD5E1',
                            }}>
                            {selected ? 'Selected ✓' : 'Select Plan'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 flex gap-3">
                  <button type="button" onClick={goBack}
                    className="h-12 px-5 rounded-xl border font-sans font-semibold text-[14px] flex items-center gap-1.5 transition-colors hover:bg-[#F4F7FB]"
                    style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={goNext} disabled={!data.selectedPlan}
                    className={cn(
                      'flex-1 h-12 rounded-xl font-sans font-bold text-[14.5px] flex items-center justify-center gap-2 transition-all',
                      data.selectedPlan ? 'text-white hover:opacity-90 hover:shadow-md hover:-translate-y-0.5' : 'cursor-not-allowed'
                    )}
                    style={{
                      background: data.selectedPlan ? 'linear-gradient(135deg, #0F2D55 0%, #0D9488 100%)' : 'var(--border-default)',
                      color: data.selectedPlan ? 'white' : 'var(--text-subtle)',
                    }}>
                    Generate My Premium <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ══ PREMIUM RESULT ══ */}
            {step === 'premium' && data.selectedPlan && (
              <PremiumResult data={data} plan={data.selectedPlan} computePremium={computePremium} onBack={goBack} router={router} />
            )}

          </motion.div>
        </AnimatePresence>

        {/* Trust strip */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '🏆', text: 'Best Price Guaranteed' },
            { icon: '🔒', text: 'Secure & Private' },
            { icon: '🏥', text: '14+ Insurers' },
            { icon: '📞', text: 'Claims Assistance' },
          ].map(({ icon, text }) => (
            <div key={text} className="bg-white rounded-xl p-3 flex flex-col items-center gap-1.5 border"
              style={{ borderColor: 'var(--border-default)' }}>
              <span className="text-2xl">{icon}</span>
              <span className="font-sans font-semibold text-[11.5px] text-center" style={{ color: 'var(--text-secondary)' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Premium Result Component ────────────────────────────── */
function PremiumResult({
  data, plan, computePremium, onBack, router
}: {
  data: QuoteData
  plan: Plan
  computePremium: (p: Plan, d: QuoteData) => number
  onBack: () => void
  router: ReturnType<typeof useRouter>
}) {
  const total = computePremium(plan, data)
  const monthly = Math.round(total / 12)

  const breakdown: { label: string; amount: number }[] = [
    { label: 'Self', amount: plan.premium },
  ]
  if (data.hasSpouse) breakdown.push({ label: 'Spouse', amount: Math.round(plan.premium * 0.85) })
  for (let i = 0; i < data.children; i++) {
    breakdown.push({ label: `Child ${i + 1}`, amount: Math.round(plan.premium * 0.55) })
  }
  if (data.hasParents) breakdown.push({ label: 'Parents', amount: Math.round(plan.premium * 1.2) })

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🎉</div>
        <h2 className="font-display font-bold text-[24px] mb-1" style={{ color: '#0F2D55' }}>Your Premium Quote</h2>
        <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>
          Based on your selections — no obligation required
        </p>
      </div>

      {/* Plan summary card */}
      <div className="bg-white rounded-2xl border overflow-hidden mb-5" style={{ borderColor: '#0D9488', boxShadow: '0 0 0 2px #CCFBF1' }}>
        <div className="px-5 py-4 flex items-center justify-between border-b"
          style={{ background: 'linear-gradient(135deg, #0F2D55 0%, #0D9488 100%)', borderColor: 'transparent' }}>
          <div>
            <div className="font-display font-extrabold text-[20px] text-white">{plan.name} Plan</div>
            <div className="font-sans text-[12px] text-white/70">{plan.insurer}</div>
          </div>
          <div className="text-right">
            <div className="font-display font-extrabold text-[32px] text-white leading-none">
              AED {total.toLocaleString()}
            </div>
            <div className="font-sans text-[12px] text-white/70">per year</div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="font-sans text-[14px]" style={{ color: 'var(--text-secondary)' }}>Monthly equivalent</span>
            <span className="font-display font-bold text-[18px]" style={{ color: '#0F2D55' }}>
              AED {monthly.toLocaleString()} / mo
            </span>
          </div>

          {/* Breakdown */}
          <p className="font-sans font-semibold text-[11px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-subtle)' }}>
            Premium Breakdown
          </p>
          <div className="space-y-2">
            {breakdown.map(b => (
              <div key={b.label} className="flex items-center justify-between">
                <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{b.label}</span>
                <span className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>
                  AED {b.amount.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="font-sans font-bold text-[14px]" style={{ color: '#0F2D55' }}>Total Annual Premium</span>
              <span className="font-display font-extrabold text-[16px]" style={{ color: '#0D9488' }}>
                AED {total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Benefits summary */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="font-sans font-semibold text-[11px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-subtle)' }}>
              Key Benefits Included
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Consultation', plan.benefits.consultation],
                ['In-patient', plan.benefits.inpatient],
                ['Out-patient', plan.benefits.outpatient],
                ['Medicine', plan.benefits.medicineLimit],
              ].map(([k, v]) => (
                <div key={k} className="p-3 rounded-xl" style={{ backgroundColor: '#F4F7FB' }}>
                  <div className="font-sans text-[10.5px] font-semibold uppercase tracking-wide mb-0.5"
                    style={{ color: '#64748B' }}>{k}</div>
                  <div className="font-sans font-bold text-[12.5px]" style={{ color: '#0F2D55' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button type="button"
        onClick={() => router.push('/quote/checkout')}
        className="w-full h-14 rounded-xl font-sans font-extrabold text-[16px] text-white flex items-center justify-center gap-3 transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
        style={{ background: 'linear-gradient(135deg, #0F2D55 0%, #0D9488 100%)' }}>
        Buy This Plan — AED {total.toLocaleString()}/yr
        <ArrowRight className="w-5 h-5" />
      </button>
      <p className="text-center font-sans text-[11.5px] mt-3" style={{ color: 'var(--text-subtle)' }}>
        IA-licensed · DHA compliant · Certificate in 24 hours
      </p>
      <button type="button" onClick={onBack}
        className="w-full mt-2 h-11 rounded-xl border font-sans font-medium text-[13.5px] flex items-center justify-center gap-2 transition-colors hover:bg-[#F4F7FB]"
        style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}>
        <ChevronLeft className="w-4 h-4" /> Back to Plans
      </button>
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
        <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>{sub}</p>
      </div>
      {children}
    </div>
  )
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all w-full hover:-translate-y-0.5',
        active ? 'border-[#0D9488] bg-[#F0FDFA] shadow-sm' : 'border-[var(--border-default)] bg-white hover:border-[#2DD4BF] hover:bg-[#F0FDFA]'
      )}>
      {children}
      {active && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" style={{ color: '#0D9488' }} />}
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Buttons({
  onNext, disabled, onBack, nextLabel = 'Continue', hideBack
}: {
  onNext: () => void; disabled: boolean; onBack?: () => void; nextLabel?: string; hideBack?: boolean
}) {
  return (
    <div className="mt-6 flex gap-3">
      {!hideBack && onBack && (
        <button type="button" onClick={onBack}
          className="h-12 px-5 rounded-xl border font-sans font-semibold text-[14px] flex items-center gap-1.5 transition-colors hover:bg-[#F4F7FB]"
          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      <button type="button" onClick={onNext} disabled={disabled}
        className={cn(
          'flex-1 h-12 rounded-xl font-sans font-bold text-[14px] flex items-center justify-center gap-2 transition-all',
          disabled ? 'cursor-not-allowed' : 'hover:opacity-90 hover:shadow-md hover:-translate-y-0.5'
        )}
        style={{
          background: disabled ? 'var(--border-default)' : 'linear-gradient(135deg, #0F2D55 0%, #0D9488 100%)',
          color: disabled ? 'var(--text-subtle)' : 'white',
        }}>
        {nextLabel} {!disabled && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  )
}

function BenefitRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: '#0D9488' }} />
      <span className="font-sans text-[11.5px] shrink-0" style={{ color: '#64748B' }}>{label}</span>
      <span className="font-sans font-semibold text-[11.5px] ml-auto text-right" style={{ color: '#0F2D55' }}>{value}</span>
    </div>
  )
}

function foc(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = '#0D9488'
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.12)'
}
function blu(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = 'var(--border-medium)'
  e.currentTarget.style.boxShadow = 'none'
}
