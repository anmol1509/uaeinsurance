'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, ChevronLeft, CheckCircle2, Users, User, Heart, ArrowRight,
  Shield, Building2, Baby, UserCheck,
} from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

/* ─── Types ──────────────────────────────────────────────── */
type Emirate = { id: string; label: string; abbr: string; isDubai?: boolean }
type MemberType = 'self' | 'spouse' | 'children' | 'parents'
type SalaryBand = 'lsb' | 'nlsb'
type PlanType = 'basic' | 'enhanced'

interface BenefitConfig {
  consultationCopay: string
  inpatientCopay: string
  outpatientCopay: string
  medicineLimit: string
  medicineCopay: string
}

interface QuoteState {
  emirate: string | null
  memberType: MemberType | null
  salaryBand: SalaryBand | null
  planType: PlanType | null
  benefits: Partial<BenefitConfig>
  // NE flow: product selection
  neProduct: string | null
}

/* ─── Data ───────────────────────────────────────────────── */
const EMIRATES: Emirate[] = [
  { id: 'dubai',    label: 'Dubai',     abbr: 'DXB', isDubai: true },
  { id: 'abudhabi', label: 'Abu Dhabi', abbr: 'AUH' },
  { id: 'sharjah',  label: 'Sharjah',  abbr: 'SHJ' },
  { id: 'ajman',    label: 'Ajman',    abbr: 'AJM' },
  { id: 'uaq',      label: 'UAQ',      abbr: 'UAQ' },
  { id: 'rak',      label: 'RAK',      abbr: 'RKT' },
  { id: 'fujairah', label: 'Fujairah', abbr: 'FJR' },
]

const NE_PRODUCTS = [
  { id: 'basic',    label: 'Basic Plan',    price: 'From AED 750/yr',   desc: 'Essential coverage for individuals', color: '#0D9488', bg: '#F0FDFA' },
  { id: 'standard', label: 'Standard Plan', price: 'From AED 2,200/yr', desc: 'Balanced cover with outpatient',     color: '#1A4F8A', bg: '#EBF2FA' },
  { id: 'premium',  label: 'Premium Plan',  price: 'From AED 5,500/yr', desc: 'Comprehensive worldwide cover',     color: '#B07D1A', bg: '#FFFBEB' },
]

const MEMBER_TYPES = [
  { id: 'self'    as MemberType, label: 'Self',       icon: User,      desc: 'For the visa holder',         color: '#0D9488' },
  { id: 'spouse'  as MemberType, label: 'Spouse',     icon: Heart,     desc: 'Spouse / partner',             color: '#1A4F8A' },
  { id: 'children'as MemberType, label: 'Children',   icon: Baby,      desc: 'Dependent children',           color: '#D97706' },
  { id: 'parents' as MemberType, label: 'Parents',    icon: Users,     desc: 'Dependent parents',            color: '#7C3AED' },
]

const SALARY_BANDS = [
  { id: 'lsb'  as SalaryBand, label: 'LSB',  sublabel: 'Below AED 4,000 salary', color: '#92400E', bg: '#FEF3C7' },
  { id: 'nlsb' as SalaryBand, label: 'NLSB', sublabel: 'AED 4,000+ salary',      color: '#065F46', bg: '#ECFDF5' },
]

const BENEFIT_OPTIONS = {
  consultationCopay: {
    label: 'Consultation Co-pay',
    options: ['Nil', '20%', 'AED 25', 'AED 50'],
    color: '#1A4F8A',
  },
  inpatientCopay: {
    label: 'In-Patient Co-pay',
    options: ['Nil', '10%', '20%'],
    color: '#0D9488',
  },
  outpatientCopay: {
    label: 'Out-Patient Co-pay',
    options: ['Nil', '10%', '20%'],
    color: '#7C3AED',
  },
  medicineLimit: {
    label: 'Medicine Limit',
    options: ['AED 2,500', 'AED 5,000', 'AED 7,500'],
    color: '#92400E',
  },
  medicineCopay: {
    label: 'Medicine Co-pay',
    options: ['Nil', '10%', '20%', '30%'],
    color: '#065F46',
  },
}

/* ─── Helpers ────────────────────────────────────────────── */
function cn(...cls: (string | boolean | undefined | null)[]) {
  return cls.filter(Boolean).join(' ')
}

function StepDot({ step, current, total }: { step: number; current: number; total: number }) {
  const done = step < current
  const active = step === current
  return (
    <div
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center font-sans font-bold text-[13px] shrink-0 transition-all',
        done   ? 'bg-[var(--teal-600)] text-white' :
        active ? 'bg-[var(--navy-800)] text-white ring-4 ring-[var(--navy-100)]' :
                 'bg-[var(--border-default)] text-[var(--text-subtle)]'
      )}
    >
      {done ? <CheckCircle2 className="w-4 h-4" /> : step}
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────── */
export default function HealthQuoteFlow() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [quote, setQuote] = useState<QuoteState>({
    emirate:    searchParams.get('emirate'),
    memberType: null,
    salaryBand: null,
    planType:   null,
    benefits:   {},
    neProduct:  null,
  })

  const isDubai = quote.emirate === 'dubai'

  // Determine current step
  // Dubai flow: 1 emirate → 2 member type → (if self) 3 salary band → 4 plan → (if enhanced) 5 benefits → 6 review
  // NE flow:    1 emirate → 2 product select → 3 review
  function getStep(): number {
    if (!quote.emirate) return 1
    if (isDubai) {
      if (!quote.memberType) return 2
      if (quote.memberType === 'self' && !quote.salaryBand) return 3
      if (!quote.planType) return 4
      if (quote.planType === 'enhanced' && Object.keys(quote.benefits).length < 5) return 5
      return 6
    } else {
      if (!quote.neProduct) return 2
      return 3
    }
  }

  const step = getStep()
  const totalSteps = isDubai ? 6 : 3

  function set<K extends keyof QuoteState>(key: K, val: QuoteState[K]) {
    setQuote(prev => ({ ...prev, [key]: val }))
  }

  function setBenefit(key: keyof BenefitConfig, val: string) {
    setQuote(prev => ({ ...prev, benefits: { ...prev.benefits, [key]: val } }))
  }

  function handleFinalSubmit() {
    const params = new URLSearchParams()
    params.set('type', 'medical')
    params.set('emirate', quote.emirate || '')
    if (quote.planType) params.set('plan', quote.planType)
    router.push(`/quote/result?${params.toString()}`)
  }

  const slideVariants = {
    initial: { opacity: 0, x: 32 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
    exit:    { opacity: 0, x: -32, transition: { duration: 0.18 } },
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Header strip */}
      <div
        className="border-b border-[var(--border-default)] bg-white"
      >
        <div className="max-w-[900px] mx-auto px-5 h-16 flex items-center justify-between">
          <Logo size={32} />
          <div className="flex items-center gap-2 text-[13px] font-sans text-[var(--text-muted)]">
            <Shield className="w-4 h-4" style={{ color: 'var(--teal-600)' }} />
            IA Licensed &amp; Regulated
          </div>
        </div>
      </div>

      <div className="max-w-[680px] mx-auto px-5 py-10">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans font-semibold text-[13px] text-[var(--text-secondary)]">
              Step {step} of {totalSteps}
            </span>
            <span className="font-sans text-[12px] text-[var(--text-muted)]">
              Health Insurance Quote
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-default)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, var(--navy-800), var(--teal-600))' }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div key={step} variants={slideVariants} initial="initial" animate="animate" exit="exit">

            {/* ── Step 1: Emirate ───────────────────────────── */}
            {step === 1 && (
              <StepCard
                stepNum={1}
                title="Select Emirate of Visa Issuance"
                desc="Your coverage terms depend on which emirate issued your visa."
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {EMIRATES.map(({ id, label, abbr, isDubai: dub }) => {
                    const active = quote.emirate === id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => set('emirate', id)}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                          active
                            ? 'border-[var(--teal-600)] bg-[var(--teal-50)]'
                            : 'border-[var(--border-default)] bg-white hover:border-[var(--teal-400)] hover:bg-[var(--teal-50)]'
                        )}
                      >
                        <span
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-extrabold text-[11px] shrink-0"
                          style={{
                            backgroundColor: active ? 'var(--teal-600)' : 'var(--navy-50)',
                            color: active ? '#fff' : 'var(--navy-700)',
                          }}
                        >
                          {abbr}
                        </span>
                        <div>
                          <div className={cn('font-sans font-semibold text-[13px]', active ? 'text-[var(--teal-700)]' : 'text-[var(--text-primary)]')}>{label}</div>
                          {dub && <div className="font-sans text-[10px] text-[var(--teal-600)]">Mandatory DHA</div>}
                        </div>
                      </button>
                    )
                  })}
                </div>
                <StepFooter onNext={() => {}} disabled={!quote.emirate} hideBack />
              </StepCard>
            )}

            {/* ── Step 2a (NE): Product selection ──────────── */}
            {step === 2 && !isDubai && (
              <StepCard
                stepNum={2}
                title="Choose Your Plan"
                desc="Select the coverage level that suits you."
              >
                <div className="space-y-3">
                  {NE_PRODUCTS.map(({ id, label, price, desc, color, bg }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set('neProduct', id)}
                      className={cn(
                        'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all',
                        quote.neProduct === id
                          ? 'border-[var(--teal-600)] bg-[var(--teal-50)]'
                          : 'border-[var(--border-default)] bg-white hover:border-[var(--teal-400)]'
                      )}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                        <Heart className="w-5 h-5" style={{ color }} />
                      </div>
                      <div className="flex-1">
                        <div className="font-sans font-bold text-[15px] text-[var(--text-primary)] mb-0.5">{label}</div>
                        <div className="font-sans text-[12px] text-[var(--text-muted)]">{desc}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-display font-bold text-[14px]" style={{ color }}>{price}</div>
                        {quote.neProduct === id && <CheckCircle2 className="w-4 h-4 mt-1 ml-auto" style={{ color: 'var(--teal-600)' }} />}
                      </div>
                    </button>
                  ))}
                </div>
                <StepFooter onNext={() => {}} disabled={!quote.neProduct} onBack={() => set('emirate', null)} />
              </StepCard>
            )}

            {/* ── Step 2b (Dubai): Member type ─────────────── */}
            {step === 2 && isDubai && (
              <StepCard
                stepNum={2}
                title="Who are you insuring?"
                desc="Select the member type for this policy."
              >
                <div className="grid grid-cols-2 gap-3">
                  {MEMBER_TYPES.map(({ id, label, icon: Icon, desc, color }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set('memberType', id)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all',
                        quote.memberType === id
                          ? 'border-[var(--teal-600)] bg-[var(--teal-50)]'
                          : 'border-[var(--border-default)] bg-white hover:border-[var(--teal-400)]'
                      )}
                    >
                      <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div className="text-center">
                        <div className="font-sans font-bold text-[14px] text-[var(--text-primary)]">{label}</div>
                        <div className="font-sans text-[11px] text-[var(--text-muted)]">{desc}</div>
                      </div>
                      {quote.memberType === id && <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--teal-600)' }} />}
                    </button>
                  ))}
                </div>
                <StepFooter onNext={() => {}} disabled={!quote.memberType} onBack={() => set('emirate', null)} />
              </StepCard>
            )}

            {/* ── Step 3 (Dubai, Self): Salary band ────────── */}
            {step === 3 && isDubai && quote.memberType === 'self' && (
              <StepCard
                stepNum={3}
                title="What is your monthly salary?"
                desc="DHA mandates different minimum benefits based on income."
              >
                <div className="space-y-3">
                  {SALARY_BANDS.map(({ id, label, sublabel, color, bg }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set('salaryBand', id)}
                      className={cn(
                        'w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all',
                        quote.salaryBand === id
                          ? 'border-[var(--teal-600)] bg-[var(--teal-50)]'
                          : 'border-[var(--border-default)] bg-white hover:border-[var(--teal-400)]'
                      )}
                    >
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 font-display font-extrabold text-[15px]"
                        style={{ backgroundColor: bg, color }}
                      >
                        {label}
                      </div>
                      <div>
                        <div className="font-sans font-bold text-[15px] text-[var(--text-primary)] mb-0.5">{label}</div>
                        <div className="font-sans text-[13px] text-[var(--text-muted)]">{sublabel}</div>
                      </div>
                      {quote.salaryBand === id && <CheckCircle2 className="w-5 h-5 ml-auto" style={{ color: 'var(--teal-600)' }} />}
                    </button>
                  ))}
                </div>
                <StepFooter onNext={() => {}} disabled={!quote.salaryBand} onBack={() => set('memberType', null)} />
              </StepCard>
            )}

            {/* ── Step 4 (Dubai): Plan type ─────────────────── */}
            {step === 4 && isDubai && (
              <StepCard
                stepNum={4}
                title="Select your Dubai plan type"
                desc="Choose between a fixed plan or configure your own benefits."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => set('planType', 'basic')}
                    className={cn(
                      'p-5 rounded-2xl border-2 text-left transition-all',
                      quote.planType === 'basic'
                        ? 'border-[var(--teal-600)] bg-[var(--teal-50)]'
                        : 'border-[var(--border-default)] bg-white hover:border-[var(--teal-400)]'
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--navy-50)] flex items-center justify-center mb-3">
                      <Shield className="w-5 h-5" style={{ color: 'var(--navy-700)' }} />
                    </div>
                    <div className="font-display font-bold text-[16px] text-[var(--navy-900)] mb-1">Basic Plan</div>
                    <div className="font-sans text-[13px] text-[var(--text-muted)] mb-3">Fixed plan &amp; fixed benefits</div>
                    <div className="font-sans text-[12px] text-[var(--teal-600)] font-semibold">From AED 750 / year</div>
                    {quote.planType === 'basic' && (
                      <div className="mt-2 flex items-center gap-1 text-[var(--teal-700)]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-sans font-semibold text-[12px]">Selected</span>
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => set('planType', 'enhanced')}
                    className={cn(
                      'p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden',
                      quote.planType === 'enhanced'
                        ? 'border-[var(--teal-600)] bg-[var(--teal-50)]'
                        : 'border-[var(--border-default)] bg-white hover:border-[var(--teal-400)]'
                    )}
                  >
                    <div className="absolute top-3 right-3 font-sans font-bold text-[9px] px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--teal-600)' }}>POPULAR</div>
                    <div className="w-10 h-10 rounded-xl bg-[var(--teal-50)] flex items-center justify-center mb-3">
                      <UserCheck className="w-5 h-5" style={{ color: 'var(--teal-600)' }} />
                    </div>
                    <div className="font-display font-bold text-[16px] text-[var(--navy-900)] mb-1">Enhanced Plan</div>
                    <div className="font-sans text-[13px] text-[var(--text-muted)] mb-3">Choose your benefit levels</div>
                    <div className="font-sans text-[12px] text-[var(--teal-600)] font-semibold">From AED 1,800 / year</div>
                    {quote.planType === 'enhanced' && (
                      <div className="mt-2 flex items-center gap-1 text-[var(--teal-700)]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-sans font-semibold text-[12px]">Selected</span>
                      </div>
                    )}
                  </button>
                </div>
                <StepFooter
                  onNext={() => {}}
                  disabled={!quote.planType}
                  onBack={() => {
                    if (quote.memberType === 'self') set('salaryBand', null)
                    else set('memberType', null)
                  }}
                />
              </StepCard>
            )}

            {/* ── Step 5 (Dubai, Enhanced): Benefit config ─── */}
            {step === 5 && isDubai && quote.planType === 'enhanced' && (
              <StepCard
                stepNum={5}
                title="Configure your benefits"
                desc="Select the level of each benefit. Your premium is calculated based on your selections."
              >
                <div className="space-y-4">
                  {(Object.entries(BENEFIT_OPTIONS) as [keyof BenefitConfig, typeof BENEFIT_OPTIONS[keyof typeof BENEFIT_OPTIONS]][]).map(([key, { label, options, color }]) => (
                    <div key={key} className="bg-white rounded-xl p-4 border border-[var(--border-default)]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="font-sans font-semibold text-[13.5px] text-[var(--text-primary)]">{label}</span>
                        {quote.benefits[key] && (
                          <span className="ml-auto font-sans font-bold text-[12px] px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>
                            {quote.benefits[key]}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {options.map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setBenefit(key, opt)}
                            className={cn(
                              'px-3.5 py-1.5 rounded-lg border font-sans font-medium text-[13px] transition-all',
                              quote.benefits[key] === opt
                                ? 'border-transparent text-white'
                                : 'border-[var(--border-medium)] text-[var(--text-secondary)] bg-white hover:bg-[var(--surface-raised)]'
                            )}
                            style={quote.benefits[key] === opt ? { backgroundColor: color, borderColor: color } : {}}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <StepFooter
                  onNext={() => {}}
                  disabled={Object.keys(quote.benefits).length < 5}
                  onBack={() => set('planType', null)}
                />
              </StepCard>
            )}

            {/* ── Final step: Review & Generate ────────────── */}
            {step === (isDubai ? 6 : 3) && (
              <StepCard
                stepNum={step}
                title="Review & Generate Quote"
                desc="Your personalised health insurance quote is ready to generate."
              >
                <div className="bg-white rounded-2xl border border-[var(--border-default)] overflow-hidden">
                  <div className="px-5 py-3 border-b border-[var(--border-subtle)]" style={{ backgroundColor: 'var(--navy-50)' }}>
                    <span className="font-sans font-bold text-[12px] text-[var(--navy-800)] uppercase tracking-widest">Quote Summary</span>
                  </div>
                  <div className="p-5 space-y-3">
                    <SummaryRow label="Emirate" value={EMIRATES.find(e => e.id === quote.emirate)?.label || ''} />
                    {isDubai && quote.memberType && (
                      <SummaryRow label="Member Type" value={quote.memberType.charAt(0).toUpperCase() + quote.memberType.slice(1)} />
                    )}
                    {isDubai && quote.memberType === 'self' && quote.salaryBand && (
                      <SummaryRow label="Salary Band" value={quote.salaryBand.toUpperCase()} />
                    )}
                    {isDubai && quote.planType && (
                      <SummaryRow label="Plan Type" value={quote.planType === 'enhanced' ? 'Enhanced Plan' : 'Basic Plan'} highlight />
                    )}
                    {!isDubai && quote.neProduct && (
                      <SummaryRow label="Plan" value={NE_PRODUCTS.find(p => p.id === quote.neProduct)?.label || ''} highlight />
                    )}
                    {isDubai && quote.planType === 'enhanced' && Object.keys(quote.benefits).length > 0 && (
                      <div className="border-t border-[var(--border-subtle)] pt-3 mt-3">
                        <p className="font-sans font-semibold text-[12px] text-[var(--text-muted)] mb-2">Benefit Configuration</p>
                        {(Object.entries(quote.benefits) as [keyof BenefitConfig, string][]).map(([key, val]) => (
                          <SummaryRow key={key} label={BENEFIT_OPTIONS[key]?.label || key} value={val} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="w-full h-14 rounded-xl font-sans font-bold text-[15px] text-white flex items-center justify-center gap-2.5 transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--teal-600) 100%)' }}
                  >
                    Generate Premium Quote
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (isDubai) {
                        if (quote.planType === 'enhanced') set('benefits', {})
                        else set('planType', null)
                      } else {
                        set('neProduct', null)
                      }
                    }}
                    className="w-full h-11 rounded-xl border border-[var(--border-medium)] font-sans font-medium text-[14px] text-[var(--text-muted)] flex items-center justify-center gap-2 hover:bg-[var(--surface-raised)] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                </div>
                <p className="mt-4 text-center font-sans text-[12px] text-[var(--text-subtle)]">
                  IA-licensed quotes from 14+ certified insurers · No commitment required
                </p>
              </StepCard>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Trust footer */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[12px] font-sans text-[var(--text-subtle)]">
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> IA Licensed</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> DHA &amp; HAAD Compliant</span>
          <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> 14+ Insurer Partners</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Sub-components ─────────────────────────────────────── */
function StepCard({
  stepNum,
  title,
  desc,
  children,
}: {
  stepNum: number
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-6">
        <div
          className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full font-sans font-semibold text-[11px]"
          style={{ backgroundColor: 'var(--navy-50)', color: 'var(--navy-700)' }}
        >
          Step {stepNum}
        </div>
        <h2 className="font-display font-bold text-[22px] text-[var(--navy-900)] mb-2 leading-tight">{title}</h2>
        <p className="font-sans text-[14px] text-[var(--text-muted)]">{desc}</p>
      </div>
      {children}
    </div>
  )
}

function StepFooter({
  onNext,
  disabled,
  onBack,
  hideBack,
}: {
  onNext: () => void
  disabled: boolean
  onBack?: () => void
  hideBack?: boolean
}) {
  return (
    <div className="mt-6 flex items-center gap-3">
      {!hideBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="h-12 px-5 flex items-center gap-1.5 rounded-xl border border-[var(--border-medium)] font-sans font-medium text-[14px] text-[var(--text-muted)] hover:bg-[var(--surface-raised)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      )}
      {!disabled && (
        <div className="flex-1 flex items-center gap-1.5 font-sans text-[13px] font-semibold" style={{ color: 'var(--teal-600)' }}>
          <CheckCircle2 className="w-4 h-4" />
          Selection made — scroll down or select another
        </div>
      )}
      {disabled && <div className="flex-1 font-sans text-[13px] text-[var(--text-subtle)]">Make a selection to continue</div>}
    </div>
  )
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="font-sans text-[13px] text-[var(--text-muted)]">{label}</span>
      <span
        className={cn(
          'font-sans font-semibold text-[13px]',
          highlight ? 'text-[var(--teal-700)]' : 'text-[var(--text-primary)]'
        )}
      >
        {value}
      </span>
    </div>
  )
}
