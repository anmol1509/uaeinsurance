'use client'
import { useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, CheckCircle2, ArrowRight, Shield, Building2, Plus, Minus, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

/* ─── Types ──────────────────────────────────────────────── */
interface QuoteData {
  // Contact
  name: string
  email: string
  mobile: string
  // Emirate
  emirate: string
  // Existing policy
  existingPolicy: string
  previousInsurer: string
  // Salary
  salaryBand: string
  // Member type
  memberType: string
  // Personal
  nationality: string
  gender: string
  maritalStatus: string
  dob: string
  // Dependents
  spouseDob: string
  spouseGender: string
  daughters: number
  daughterAges: string[]
  sons: number
  sonAges: string[]
  fatherAge: string
  motherAge: string
}

/* ─── Static Data ─────────────────────────────────────────── */
const EMIRATES = [
  { id: 'dubai',    label: 'Dubai',     abbr: 'DXB', note: 'DHA mandatory' },
  { id: 'abudhabi', label: 'Abu Dhabi', abbr: 'AUH', note: 'HAAD rules' },
  { id: 'sharjah',  label: 'Sharjah',  abbr: 'SHJ', note: '' },
  { id: 'ajman',    label: 'Ajman',    abbr: 'AJM', note: '' },
  { id: 'rak',      label: 'RAK',      abbr: 'RKT', note: '' },
  { id: 'fujairah', label: 'Fujairah', abbr: 'FJR', note: '' },
  { id: 'uaq',      label: 'UAQ',      abbr: 'UAQ', note: '' },
]

const EXISTING_POLICY_OPTIONS = [
  { id: 'yes',        label: 'Yes, active policy',           sub: 'Currently insured in UAE' },
  { id: 'expired30',  label: 'Expired over 30 days ago',     sub: 'Lapsed more than a month' },
  { id: 'expired30r', label: 'Expired within last 30 days',  sub: 'Recently lapsed' },
  { id: 'no',         label: 'No existing policy',           sub: 'First-time insurance buyer' },
]

const UAE_INSURERS = [
  'AXA Gulf', 'Daman', 'Cigna', 'ADNIC', 'GIG Gulf',
  'Neuron (RSA)', 'Sukoon Insurance', 'Fidelity United',
  'Dubai Insurance', 'Allianz Care', 'Takaful Emarat',
  'Orient Insurance', 'Watania Takaful', 'Abu Dhabi National Takaful',
]

const SALARY_BANDS = [
  { id: 'upto4000',    label: 'Upto AED 4,000',     note: 'LSB — basic DHA plan' },
  { id: '4001-5000',   label: 'AED 4,001 – 5,000',  note: 'NLSB' },
  { id: '5001-6000',   label: 'AED 5,001 – 6,000',  note: 'NLSB' },
  { id: '6001-7000',   label: 'AED 6,001 – 7,000',  note: 'NLSB' },
  { id: '7001-8000',   label: 'AED 7,001 – 8,000',  note: 'NLSB' },
  { id: '8001-9000',   label: 'AED 8,001 – 9,000',  note: 'NLSB' },
  { id: '9001-10000',  label: 'AED 9,001 – 10,000', note: 'NLSB' },
  { id: 'above10001',  label: 'Above AED 10,001',   note: 'NLSB — premium plans' },
]

const MEMBER_TYPES = [
  { id: 'self',         label: 'Self Only',               sub: 'Just you' },
  { id: 'self+spouse',  label: 'Self + Spouse',           sub: 'You and partner' },
  { id: 'family',       label: 'Self + Family',           sub: 'Spouse, children, parents' },
  { id: 'parents',      label: 'Parents / Dependents',    sub: 'Parents or other dependents' },
]

const TOP_NATIONALITIES = [
  { id: 'indian',     label: 'Indian',     flag: '🇮🇳' },
  { id: 'pakistani',  label: 'Pakistani',  flag: '🇵🇰' },
  { id: 'emirati',    label: 'Emirati',    flag: '🇦🇪' },
  { id: 'egyptian',   label: 'Egyptian',   flag: '🇪🇬' },
  { id: 'filipino',   label: 'Filipino',   flag: '🇵🇭' },
  { id: 'british',    label: 'British',    flag: '🇬🇧' },
  { id: 'jordanian',  label: 'Jordanian',  flag: '🇯🇴' },
  { id: 'syrian',     label: 'Syrian',     flag: '🇸🇾' },
  { id: 'bangladeshi',label: 'Bangladeshi',flag: '🇧🇩' },
  { id: 'sri_lankan', label: 'Sri Lankan', flag: '🇱🇰' },
  { id: 'nepali',     label: 'Nepali',     flag: '🇳🇵' },
  { id: 'american',   label: 'American',   flag: '🇺🇸' },
]

const ALL_NATIONALITIES = [
  ...TOP_NATIONALITIES,
  { id: 'french',     label: 'French',     flag: '🇫🇷' },
  { id: 'german',     label: 'German',     flag: '🇩🇪' },
  { id: 'chinese',    label: 'Chinese',    flag: '🇨🇳' },
  { id: 'lebanese',   label: 'Lebanese',   flag: '🇱🇧' },
  { id: 'saudi',      label: 'Saudi',      flag: '🇸🇦' },
  { id: 'canadian',   label: 'Canadian',   flag: '🇨🇦' },
  { id: 'australian', label: 'Australian', flag: '🇦🇺' },
  { id: 'other',      label: 'Other',      flag: '🌍' },
]

/* ─── Step config ─────────────────────────────────────────── */
type StepId =
  | 'contact' | 'emirate' | 'existing_policy' | 'prev_insurer'
  | 'salary' | 'member_type' | 'nationality' | 'personal'
  | 'dependents' | 'review'

const STEP_LABELS: Record<StepId, string> = {
  contact:        'Contact Details',
  emirate:        'Visa Emirate',
  existing_policy:'Existing Policy',
  prev_insurer:   'Previous Insurer',
  salary:         'Salary Band',
  member_type:    'Member Type',
  nationality:    'Nationality',
  personal:       'Personal Details',
  dependents:     'Member Details',
  review:         'View Quotes',
}

/* ─── Helpers ─────────────────────────────────────────────── */
function cn(...cls: (string | boolean | undefined | null)[]) {
  return cls.filter(Boolean).join(' ')
}

const slideIn = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, x: -28, transition: { duration: 0.18 } },
}

/* ─── Main component ─────────────────────────────────────── */
export default function HealthQuoteFlow() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [step, setStep] = useState<StepId>('contact')
  const [showAllNat, setShowAllNat] = useState(false)
  const [insurerOpen, setInsurerOpen] = useState(false)

  const [data, setData] = useState<QuoteData>({
    name: '', email: '', mobile: '',
    emirate: searchParams.get('emirate') || '',
    existingPolicy: '', previousInsurer: '',
    salaryBand: '', memberType: '',
    nationality: '', gender: '', maritalStatus: '', dob: '',
    spouseDob: '', spouseGender: '',
    daughters: 0, daughterAges: [],
    sons: 0, sonAges: [],
    fatherAge: '', motherAge: '',
  })

  const set = useCallback(<K extends keyof QuoteData>(k: K, v: QuoteData[K]) =>
    setData(prev => ({ ...prev, [k]: v })), [])

  // Compute ordered steps based on selections
  function getSteps(): StepId[] {
    const steps: StepId[] = ['contact', 'emirate', 'existing_policy']
    if (['yes', 'expired30', 'expired30r'].includes(data.existingPolicy)) {
      steps.push('prev_insurer')
    }
    steps.push('salary', 'member_type', 'nationality', 'personal')
    if (['self+spouse', 'family', 'parents'].includes(data.memberType)) {
      steps.push('dependents')
    }
    steps.push('review')
    return steps
  }

  const steps = getSteps()
  const stepIdx = steps.indexOf(step)
  const totalSteps = steps.length
  const progress = Math.round(((stepIdx + 1) / totalSteps) * 100)

  function goNext() {
    const next = steps[stepIdx + 1]
    if (next) setStep(next)
  }

  function goBack() {
    const prev = steps[stepIdx - 1]
    if (prev) setStep(prev)
  }

  function handleFinalSubmit() {
    const p = new URLSearchParams({ type: 'medical', emirate: data.emirate, salary: data.salaryBand, member: data.memberType })
    router.push(`/quote/result?${p}`)
  }

  // Section labels for progress bar
  const SECTIONS = [
    { label: 'Contact Details', steps: ['contact'] },
    { label: 'Policy Info', steps: ['emirate', 'existing_policy', 'prev_insurer', 'salary'] },
    { label: 'Personal Details', steps: ['member_type', 'nationality', 'personal'] },
    { label: 'Member Details', steps: ['dependents', 'review'] },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F9FC' }}>

      {/* ── Top header ── */}
      <div className="bg-white border-b border-[var(--border-default)] sticky top-0 z-40">
        <div className="max-w-[780px] mx-auto px-5 h-14 flex items-center justify-between">
          <Logo size={30} />
          <div className="flex items-center gap-4">
            <a href="tel:+97180047867" className="hidden sm:flex items-center gap-1.5 font-sans text-[13px] font-semibold" style={{ color: 'var(--teal-600)' }}>
              📞 800-INSURE
            </a>
            <div className="flex items-center gap-1.5 font-sans text-[12px] text-[var(--text-muted)]">
              <Shield className="w-3.5 h-3.5" style={{ color: 'var(--teal-600)' }} />
              IA Licensed
            </div>
          </div>
        </div>
      </div>

      {/* ── Section progress bar (like PolicyBazaar's top tabs) ── */}
      <div className="bg-white border-b border-[var(--border-default)]">
        <div className="max-w-[780px] mx-auto px-5">
          <div className="flex items-center">
            {SECTIONS.map((sec, i) => {
              const done = sec.steps.every(s => steps.indexOf(s as StepId) < stepIdx)
              const active = sec.steps.includes(step)
              return (
                <div key={sec.label} className="flex-1 flex flex-col items-center py-3 relative">
                  {/* Connector line */}
                  {i > 0 && (
                    <div className="absolute left-0 top-[22px] w-full h-0.5 -translate-y-1/2"
                      style={{ backgroundColor: done || active ? 'var(--teal-500)' : 'var(--border-default)', zIndex: 0 }} />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-sans font-bold text-[11px] transition-all"
                      style={{
                        backgroundColor: done ? 'var(--teal-600)' : active ? 'var(--navy-800)' : 'white',
                        border: done || active ? 'none' : '2px solid var(--border-medium)',
                        color: done || active ? 'white' : 'var(--text-subtle)',
                      }}
                    >
                      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span
                      className="font-sans font-semibold text-[10px] text-center leading-tight hidden sm:block"
                      style={{ color: active ? 'var(--navy-800)' : done ? 'var(--teal-600)' : 'var(--text-subtle)' }}
                    >
                      {sec.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          {/* Fine progress bar */}
          <div className="h-0.5 w-full" style={{ backgroundColor: 'var(--border-subtle)' }}>
            <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--navy-800), var(--teal-500))' }} />
          </div>
        </div>
      </div>

      {/* ── Step content ── */}
      <div className="max-w-[640px] mx-auto px-5 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={step} variants={slideIn} initial="initial" animate="animate" exit="exit">

            {/* ══ CONTACT DETAILS ══ */}
            {step === 'contact' && (
              <StepShell title="Enter Your Details" sub="Your personal data is safe with us" icon="👤">
                <div className="space-y-4">
                  <Field label="Full name / Sponsor name">
                    <input
                      type="text" value={data.name} placeholder="Ahmed Al Mansoori"
                      onChange={e => set('name', e.target.value)}
                      className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none transition-all"
                      style={{ borderColor: 'var(--border-medium)' }}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </Field>
                  <Field label="Email address">
                    <input
                      type="email" value={data.email} placeholder="you@example.com"
                      onChange={e => set('email', e.target.value)}
                      className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none transition-all"
                      style={{ borderColor: 'var(--border-medium)' }}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </Field>
                  <Field label="UAE mobile number">
                    <div className="flex">
                      <span className="flex items-center px-3.5 border border-r-0 rounded-l-xl font-sans font-semibold text-[13px] bg-[var(--surface-raised)] shrink-0" style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}>
                        🇦🇪 +971
                      </span>
                      <input
                        type="tel" value={data.mobile} placeholder="50 123 4567"
                        onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 9))}
                        className="flex-1 h-12 rounded-r-xl border px-4 font-sans text-[14px] bg-white outline-none transition-all"
                        style={{ borderColor: 'var(--border-medium)' }}
                        onFocus={focusStyle} onBlur={blurStyle}
                      />
                    </div>
                  </Field>
                  <p className="font-sans text-[11.5px] text-[var(--text-subtle)] leading-relaxed">
                    By continuing, I declare that I am a resident of the UAE holding a valid visa and agree to InsureAE&apos;s{' '}
                    <Link href="/privacy" className="underline" style={{ color: 'var(--teal-600)' }}>Privacy Policy</Link>
                    {' '}and{' '}
                    <Link href="/terms" className="underline" style={{ color: 'var(--teal-600)' }}>Terms of Use</Link>.
                  </p>
                </div>
                <NavButtons
                  onNext={goNext}
                  nextLabel="Continue"
                  disabled={!data.name || !data.email || data.mobile.length < 8}
                  hideBack
                />
              </StepShell>
            )}

            {/* ══ EMIRATE ══ */}
            {step === 'emirate' && (
              <StepShell title="Emirate of Visa Issuance" sub="Your coverage terms depend on which emirate issued your visa" icon="📍">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {EMIRATES.map(({ id, label, abbr, note }) => (
                    <ChipCard
                      key={id} active={data.emirate === id}
                      onClick={() => { set('emirate', id); setTimeout(goNext, 180) }}
                    >
                      <span className="w-10 h-10 rounded-lg font-display font-extrabold text-[11px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: data.emirate === id ? 'var(--teal-600)' : 'var(--navy-50)', color: data.emirate === id ? '#fff' : 'var(--navy-700)' }}>
                        {abbr}
                      </span>
                      <div>
                        <div className="font-sans font-bold text-[13.5px]" style={{ color: data.emirate === id ? 'var(--teal-700)' : 'var(--text-primary)' }}>{label}</div>
                        {note && <div className="font-sans text-[10px]" style={{ color: 'var(--teal-600)' }}>{note}</div>}
                      </div>
                    </ChipCard>
                  ))}
                </div>
                <NavButtons onNext={goNext} disabled={!data.emirate} onBack={goBack} nextLabel="Next" />
              </StepShell>
            )}

            {/* ══ EXISTING POLICY ══ */}
            {step === 'existing_policy' && (
              <StepShell title="Do you have existing health insurance in the UAE?" sub="Coverage and premiums are based on your current policy status" icon="🛡️">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EXISTING_POLICY_OPTIONS.map(({ id, label, sub }) => (
                    <ChipCard
                      key={id} active={data.existingPolicy === id} wide
                      onClick={() => { set('existingPolicy', id); setTimeout(goNext, 180) }}
                    >
                      <div>
                        <div className="font-sans font-bold text-[14px]" style={{ color: data.existingPolicy === id ? 'var(--teal-700)' : 'var(--text-primary)' }}>{label}</div>
                        <div className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</div>
                      </div>
                    </ChipCard>
                  ))}
                </div>
                <NavButtons onNext={goNext} disabled={!data.existingPolicy} onBack={goBack} nextLabel="Next" />
              </StepShell>
            )}

            {/* ══ PREVIOUS INSURER ══ */}
            {step === 'prev_insurer' && (
              <StepShell title="Previous Insurer" sub="Select the insurer from your current or most recent policy" icon="🏢">
                {/* Dropdown */}
                <div className="relative mb-4">
                  <button
                    type="button"
                    onClick={() => setInsurerOpen(o => !o)}
                    className="w-full h-12 rounded-xl border px-4 flex items-center justify-between font-sans text-[14px] bg-white transition-all"
                    style={{ borderColor: data.previousInsurer ? 'var(--teal-600)' : 'var(--border-medium)', color: data.previousInsurer ? 'var(--text-primary)' : 'var(--text-subtle)' }}
                  >
                    {data.previousInsurer || 'Select Previous Insurer'}
                    <ChevronDown className={cn('w-4 h-4 transition-transform', insurerOpen && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {insurerOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border shadow-lg z-20 overflow-hidden max-h-52 overflow-y-auto"
                        style={{ borderColor: 'var(--border-default)' }}
                      >
                        {UAE_INSURERS.map(ins => (
                          <button key={ins} type="button"
                            onClick={() => { set('previousInsurer', ins); setInsurerOpen(false) }}
                            className="w-full px-4 py-3 text-left font-sans text-[14px] hover:bg-[var(--teal-50)] transition-colors border-b last:border-0"
                            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                          >
                            {ins}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quick-pick chips */}
                <div className="flex flex-wrap gap-2">
                  {UAE_INSURERS.slice(0, 7).map(ins => (
                    <button key={ins} type="button"
                      onClick={() => set('previousInsurer', ins)}
                      className="px-3.5 py-1.5 rounded-lg border font-sans font-medium text-[13px] transition-all"
                      style={{
                        borderColor: data.previousInsurer === ins ? 'var(--teal-600)' : 'var(--border-medium)',
                        backgroundColor: data.previousInsurer === ins ? 'var(--teal-50)' : 'white',
                        color: data.previousInsurer === ins ? 'var(--teal-700)' : 'var(--text-secondary)',
                      }}
                    >
                      {ins}
                    </button>
                  ))}
                </div>
                <NavButtons onNext={goNext} disabled={!data.previousInsurer} onBack={goBack} nextLabel="Next" />
              </StepShell>
            )}

            {/* ══ SALARY BAND ══ */}
            {step === 'salary' && (
              <StepShell title="Salary (AED per month)" sub="Assesses your policy eligibility and minimum benefit requirements" icon="💼">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SALARY_BANDS.map(({ id, label, note }) => (
                    <ChipCard
                      key={id} active={data.salaryBand === id}
                      onClick={() => { set('salaryBand', id); setTimeout(goNext, 180) }}
                    >
                      <div>
                        <div className="font-sans font-bold text-[13px]" style={{ color: data.salaryBand === id ? 'var(--teal-700)' : 'var(--text-primary)' }}>{label}</div>
                        <div className="font-sans text-[10.5px] mt-0.5" style={{ color: data.salaryBand === id ? 'var(--teal-500)' : 'var(--text-muted)' }}>{note}</div>
                      </div>
                    </ChipCard>
                  ))}
                </div>
                <NavButtons onNext={goNext} disabled={!data.salaryBand} onBack={goBack} nextLabel="Next" />
              </StepShell>
            )}

            {/* ══ MEMBER TYPE ══ */}
            {step === 'member_type' && (
              <StepShell title="Who are you insuring?" sub="Select all members to be covered under this policy" icon="👨‍👩‍👧">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MEMBER_TYPES.map(({ id, label, sub }) => (
                    <ChipCard
                      key={id} active={data.memberType === id} wide
                      onClick={() => { set('memberType', id); setTimeout(goNext, 180) }}
                    >
                      <div>
                        <div className="font-sans font-bold text-[14px]" style={{ color: data.memberType === id ? 'var(--teal-700)' : 'var(--text-primary)' }}>{label}</div>
                        <div className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</div>
                      </div>
                    </ChipCard>
                  ))}
                </div>
                <NavButtons onNext={goNext} disabled={!data.memberType} onBack={goBack} nextLabel="Next" />
              </StepShell>
            )}

            {/* ══ NATIONALITY ══ */}
            {step === 'nationality' && (
              <StepShell title="Nationality" sub="Helps us discover the most suitable plans for you" icon="🌍">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
                  {(showAllNat ? ALL_NATIONALITIES : TOP_NATIONALITIES).map(({ id, label, flag }) => (
                    <ChipCard
                      key={id} active={data.nationality === id}
                      onClick={() => { set('nationality', id); setTimeout(goNext, 180) }}
                    >
                      <span className="text-xl">{flag}</span>
                      <span className="font-sans font-semibold text-[13px]" style={{ color: data.nationality === id ? 'var(--teal-700)' : 'var(--text-primary)' }}>{label}</span>
                    </ChipCard>
                  ))}
                </div>
                {!showAllNat && (
                  <button type="button" onClick={() => setShowAllNat(true)}
                    className="font-sans font-semibold text-[13px] hover:underline"
                    style={{ color: 'var(--teal-600)' }}
                  >
                    Show more nationalities →
                  </button>
                )}
                <NavButtons onNext={goNext} disabled={!data.nationality} onBack={goBack} nextLabel="Next" />
              </StepShell>
            )}

            {/* ══ PERSONAL DETAILS ══ */}
            {step === 'personal' && (
              <StepShell title="Personal Details" sub="Tailored coverage based on your profile" icon="📋">
                <div className="space-y-5">
                  <div>
                    <p className="font-sans font-semibold text-[13px] text-[var(--text-secondary)] mb-2">Gender</p>
                    <div className="flex gap-3">
                      {['Male', 'Female'].map(g => (
                        <button key={g} type="button" onClick={() => set('gender', g)}
                          className="flex-1 h-12 rounded-xl border-2 font-sans font-semibold text-[14px] transition-all"
                          style={{
                            borderColor: data.gender === g ? 'var(--teal-600)' : 'var(--border-medium)',
                            backgroundColor: data.gender === g ? 'var(--teal-50)' : 'white',
                            color: data.gender === g ? 'var(--teal-700)' : 'var(--text-secondary)',
                          }}
                        >
                          {g === 'Male' ? '♂ Male' : '♀ Female'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-sans font-semibold text-[13px] text-[var(--text-secondary)] mb-2">Marital Status</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Single', 'Married', 'Divorced', 'Widowed'].map(s => (
                        <button key={s} type="button" onClick={() => set('maritalStatus', s)}
                          className="h-11 rounded-xl border-2 font-sans font-semibold text-[13px] transition-all"
                          style={{
                            borderColor: data.maritalStatus === s ? 'var(--teal-600)' : 'var(--border-medium)',
                            backgroundColor: data.maritalStatus === s ? 'var(--teal-50)' : 'white',
                            color: data.maritalStatus === s ? 'var(--teal-700)' : 'var(--text-secondary)',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-sans font-semibold text-[13px] text-[var(--text-secondary)] mb-2">Date of Birth</p>
                    <input
                      type="date" value={data.dob}
                      onChange={e => set('dob', e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full h-12 rounded-xl border px-4 font-sans text-[14px] bg-white outline-none transition-all"
                      style={{ borderColor: 'var(--border-medium)', color: data.dob ? 'var(--text-primary)' : 'var(--text-subtle)' }}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </div>
                </div>
                <NavButtons
                  onNext={goNext}
                  disabled={!data.gender || !data.maritalStatus || !data.dob}
                  onBack={goBack}
                  nextLabel="Next"
                />
              </StepShell>
            )}

            {/* ══ DEPENDENTS ══ */}
            {step === 'dependents' && (
              <StepShell title="Enter Applicant Details" sub="Insure your loved ones — enter their details below" icon="👨‍👩‍👧‍👦">
                <div className="space-y-4">
                  {/* Spouse */}
                  {['self+spouse', 'family'].includes(data.memberType) && (
                    <DependentBlock title="Spouse">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Date of Birth">
                          <input type="date" value={data.spouseDob} onChange={e => set('spouseDob', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full h-11 rounded-xl border px-3 font-sans text-[13px] bg-white outline-none"
                            style={{ borderColor: 'var(--border-medium)' }}
                            onFocus={focusStyle} onBlur={blurStyle}
                          />
                        </Field>
                        <Field label="Gender">
                          <div className="flex gap-2 h-11">
                            {['Male', 'Female'].map(g => (
                              <button key={g} type="button" onClick={() => set('spouseGender', g)}
                                className="flex-1 rounded-xl border-2 font-sans font-semibold text-[13px] transition-all"
                                style={{ borderColor: data.spouseGender === g ? 'var(--teal-600)' : 'var(--border-medium)', backgroundColor: data.spouseGender === g ? 'var(--teal-50)' : 'white', color: data.spouseGender === g ? 'var(--teal-700)' : 'var(--text-secondary)' }}
                              >{g}</button>
                            ))}
                          </div>
                        </Field>
                      </div>
                    </DependentBlock>
                  )}

                  {/* Daughters */}
                  {data.memberType === 'family' && (
                    <DependentBlock title="Daughters">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="font-sans text-[13px] text-[var(--text-muted)]">Number of daughters:</span>
                        <Counter
                          value={data.daughters}
                          onChange={v => {
                            set('daughters', v)
                            set('daughterAges', Array(v).fill(''))
                          }}
                          max={5}
                        />
                      </div>
                      {Array.from({ length: data.daughters }).map((_, i) => (
                        <Field key={i} label={`Daughter ${i + 1} — Date of Birth`}>
                          <input type="date" value={data.daughterAges[i] || ''}
                            onChange={e => { const a = [...data.daughterAges]; a[i] = e.target.value; set('daughterAges', a) }}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full h-11 rounded-xl border px-3 font-sans text-[13px] bg-white outline-none"
                            style={{ borderColor: 'var(--border-medium)' }}
                            onFocus={focusStyle} onBlur={blurStyle}
                          />
                        </Field>
                      ))}
                    </DependentBlock>
                  )}

                  {/* Sons */}
                  {data.memberType === 'family' && (
                    <DependentBlock title="Sons">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="font-sans text-[13px] text-[var(--text-muted)]">Number of sons:</span>
                        <Counter
                          value={data.sons}
                          onChange={v => {
                            set('sons', v)
                            set('sonAges', Array(v).fill(''))
                          }}
                          max={5}
                        />
                      </div>
                      {Array.from({ length: data.sons }).map((_, i) => (
                        <Field key={i} label={`Son ${i + 1} — Date of Birth`}>
                          <input type="date" value={data.sonAges[i] || ''}
                            onChange={e => { const a = [...data.sonAges]; a[i] = e.target.value; set('sonAges', a) }}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full h-11 rounded-xl border px-3 font-sans text-[13px] bg-white outline-none"
                            style={{ borderColor: 'var(--border-medium)' }}
                            onFocus={focusStyle} onBlur={blurStyle}
                          />
                        </Field>
                      ))}
                    </DependentBlock>
                  )}

                  {/* Parents */}
                  {['family', 'parents'].includes(data.memberType) && (
                    <DependentBlock title="Parents">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Father — Date of Birth">
                          <input type="date" value={data.fatherAge} onChange={e => set('fatherAge', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full h-11 rounded-xl border px-3 font-sans text-[13px] bg-white outline-none"
                            style={{ borderColor: 'var(--border-medium)' }}
                            onFocus={focusStyle} onBlur={blurStyle}
                          />
                        </Field>
                        <Field label="Mother — Date of Birth">
                          <input type="date" value={data.motherAge} onChange={e => set('motherAge', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full h-11 rounded-xl border px-3 font-sans text-[13px] bg-white outline-none"
                            style={{ borderColor: 'var(--border-medium)' }}
                            onFocus={focusStyle} onBlur={blurStyle}
                          />
                        </Field>
                      </div>
                    </DependentBlock>
                  )}
                </div>
                <NavButtons onNext={goNext} disabled={false} onBack={goBack} nextLabel="Next" />
              </StepShell>
            )}

            {/* ══ REVIEW ══ */}
            {step === 'review' && (
              <StepShell title="You're almost done!" sub="Review your details and view your personalised quotes" icon="✅">
                <div className="bg-white rounded-2xl border border-[var(--border-default)] overflow-hidden mb-6">
                  <div className="px-5 py-3 border-b" style={{ backgroundColor: 'var(--navy-50)', borderColor: 'var(--border-subtle)' }}>
                    <span className="font-sans font-bold text-[11px] uppercase tracking-widest" style={{ color: 'var(--navy-700)' }}>Your Quote Summary</span>
                  </div>
                  <div className="p-5 space-y-2.5">
                    {[
                      ['Name', data.name],
                      ['Mobile', `+971 ${data.mobile}`],
                      ['Emirate', EMIRATES.find(e => e.id === data.emirate)?.label],
                      ['Existing Policy', EXISTING_POLICY_OPTIONS.find(e => e.id === data.existingPolicy)?.label],
                      data.previousInsurer && ['Previous Insurer', data.previousInsurer],
                      ['Salary Band', SALARY_BANDS.find(s => s.id === data.salaryBand)?.label],
                      ['Members', MEMBER_TYPES.find(m => m.id === data.memberType)?.label],
                      ['Nationality', ALL_NATIONALITIES.find(n => n.id === data.nationality)?.label],
                      ['Gender', data.gender],
                      ['Date of Birth', data.dob],
                    ].filter(Boolean).map(([label, value]) => value && (
                      <div key={label as string} className="flex items-center justify-between py-1 border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
                        <span className="font-sans text-[13px] text-[var(--text-muted)]">{label as string}</span>
                        <span className="font-sans font-semibold text-[13px] text-[var(--text-primary)]">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="w-full h-14 rounded-xl font-sans font-extrabold text-[16px] text-white flex items-center justify-center gap-3 transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--teal-500) 100%)' }}
                >
                  View My Quotes
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-center font-sans text-[11.5px] text-[var(--text-subtle)] mt-3">
                  IA-licensed quotes from 14+ UAE insurers · No obligation · Free comparison
                </p>
                <button type="button" onClick={goBack}
                  className="w-full mt-2 h-11 rounded-xl border font-sans font-medium text-[13.5px] flex items-center justify-center gap-2 hover:bg-[var(--surface-raised)] transition-colors"
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}
                >
                  <ChevronLeft className="w-4 h-4" /> Edit details
                </button>
              </StepShell>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Trust strip */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '🏆', text: 'Best Price Guaranteed' },
            { icon: '🌍', text: 'Worldwide Coverage' },
            { icon: '🏥', text: '14+ Insurers' },
            { icon: '📞', text: 'Claims Assistance' },
          ].map(({ icon, text }) => (
            <div key={text} className="bg-white rounded-xl p-3 flex flex-col items-center gap-1.5 border border-[var(--border-default)]">
              <span className="text-2xl">{icon}</span>
              <span className="font-sans font-semibold text-[11.5px] text-center text-[var(--text-secondary)]">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Sub-components ─────────────────────────────────────── */
function StepShell({ title, sub, icon, children }: { title: string; sub: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">{icon}</div>
        <h2 className="font-display font-bold text-[22px] text-[var(--navy-900)] leading-tight mb-1">{title}</h2>
        <p className="font-sans text-[14px] text-[var(--text-muted)]">{sub}</p>
      </div>
      {children}
    </div>
  )
}

function ChipCard({ children, active, onClick, wide }: { children: React.ReactNode; active: boolean; onClick: () => void; wide?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all w-full',
        wide ? 'p-4' : '',
        active
          ? 'border-[var(--teal-600)] bg-[var(--teal-50)] shadow-sm'
          : 'border-[var(--border-default)] bg-white hover:border-[var(--teal-400)] hover:bg-[var(--teal-50)]'
      )}
    >
      {children}
      {active && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" style={{ color: 'var(--teal-600)' }} />}
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

function DependentBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border-default)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--navy-50)' }}>
        <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--teal-600)' }} />
        <span className="font-sans font-bold text-[13px]" style={{ color: 'var(--navy-800)' }}>{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function Counter({ value, onChange, max = 10 }: { value: number; onChange: (v: number) => void; max?: number }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors hover:bg-[var(--surface-raised)]"
        style={{ borderColor: 'var(--border-medium)' }}
      >
        <Minus className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
      </button>
      <span className="font-display font-bold text-[16px] w-6 text-center" style={{ color: 'var(--navy-800)' }}>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors hover:bg-[var(--teal-50)]"
        style={{ borderColor: value < max ? 'var(--teal-600)' : 'var(--border-medium)' }}
      >
        <Plus className="w-3.5 h-3.5" style={{ color: value < max ? 'var(--teal-600)' : 'var(--text-subtle)' }} />
      </button>
    </div>
  )
}

function NavButtons({ onNext, disabled, onBack, nextLabel = 'Continue', hideBack }: {
  onNext: () => void; disabled: boolean; onBack?: () => void; nextLabel?: string; hideBack?: boolean
}) {
  return (
    <div className={cn('mt-6 flex gap-3', hideBack ? '' : '')}>
      {!hideBack && onBack && (
        <button type="button" onClick={onBack}
          className="h-12 px-5 rounded-xl border font-sans font-semibold text-[14px] flex items-center gap-1.5 hover:bg-[var(--surface-raised)] transition-colors"
          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className={cn(
          'flex-1 h-12 rounded-xl font-sans font-bold text-[14px] flex items-center justify-center gap-2 transition-all',
          disabled
            ? 'cursor-not-allowed'
            : 'hover:opacity-90 hover:shadow-md hover:-translate-y-0.5'
        )}
        style={{
          background: disabled ? 'var(--border-default)' : 'linear-gradient(135deg, var(--navy-800) 0%, var(--teal-600) 100%)',
          color: disabled ? 'var(--text-subtle)' : 'white',
        }}
      >
        {nextLabel}
        {!disabled && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  )
}

function focusStyle(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = 'var(--teal-600)'
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.12)'
}
function blurStyle(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = 'var(--border-medium)'
  e.currentTarget.style.boxShadow = 'none'
}
