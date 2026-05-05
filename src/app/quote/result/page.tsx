'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useQuoteStore } from '@/store/quoteStore'
import type { SelectedCheckoutPlan } from '@/store/quoteStore'
import { formatDirham } from '@/lib/formatters'
import {
  Shield,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Check,
  Mail,
  X,
  SlidersHorizontal,
  GitCompare,
} from 'lucide-react'
import Link from 'next/link'

type SortKey = 'popular' | 'price' | 'rating'
type FilterId = 'all' | 'popular' | 'budget' | 'top_rated' | 'cashless'

interface Plan {
  id: string
  insurer: string
  logo: string
  rating: number
  reviews: number
  badge?: string
  multiplier: number
  features: string[]
  claimSettlement: string
  networkSize?: string
  popular?: boolean
}

const MOTOR_PLANS: Plan[] = [
  {
    id: 'axa-gulf-motor',
    insurer: 'AXA Gulf Insurance',
    logo: '🌐',
    rating: 4.8,
    reviews: 3241,
    badge: 'Most popular',
    multiplier: 1.0,
    features: ['Comprehensive cover', 'IA registered', '24/7 roadside assist', 'Claims in 24 hrs'],
    claimSettlement: '98%',
    popular: true,
  },
  {
    id: 'adnic-motor',
    insurer: 'ADNIC',
    logo: '🏢',
    rating: 4.7,
    reviews: 2102,
    badge: 'Best value',
    multiplier: 0.91,
    features: ['Comprehensive cover', 'Towing included', 'Windscreen cover', 'Flood & fire'],
    claimSettlement: '96%',
  },
  {
    id: 'gig-motor',
    insurer: 'GIG Gulf',
    logo: '🛡',
    rating: 4.6,
    reviews: 1534,
    multiplier: 1.05,
    features: ['Comprehensive cover', 'New-for-old replacement', 'GCC-wide coverage', 'Priority claims'],
    claimSettlement: '97%',
  },
  {
    id: 'rsa-motor',
    insurer: 'RSA Insurance UAE',
    logo: '⚡',
    rating: 4.5,
    reviews: 987,
    multiplier: 0.88,
    features: ['Third party & comprehensive', 'Fleet discounts', 'Online policy management', 'IA registered'],
    claimSettlement: '94%',
  },
  {
    id: 'oman-motor',
    insurer: 'Oman Insurance',
    logo: '🏦',
    rating: 4.4,
    reviews: 743,
    multiplier: 0.85,
    features: ['Comprehensive & TPO', 'Excess waiver option', 'Courtesy car', 'IA regulated'],
    claimSettlement: '93%',
  },
]

const MEDICAL_PLANS: Plan[] = [
  {
    id: 'daman-health',
    insurer: 'Daman Health',
    logo: '❤️',
    rating: 4.9,
    reviews: 5102,
    badge: 'Most popular',
    multiplier: 1.0,
    features: ['1,500+ hospitals UAE', 'Cashless treatment', 'DHA & HAAD compliant', 'Emergency evacuation'],
    claimSettlement: '99%',
    networkSize: '1,500+ hospitals',
    popular: true,
  },
  {
    id: 'axa-gulf-health',
    insurer: 'AXA Gulf Health',
    logo: '🏥',
    rating: 4.8,
    reviews: 3214,
    badge: 'Best network',
    multiplier: 1.08,
    features: ['1,200+ accredited facilities', 'Telemedicine included', 'Dental & vision option', 'International cover'],
    claimSettlement: '98%',
    networkSize: '1,200+ hospitals',
  },
  {
    id: 'adnic-health',
    insurer: 'ADNIC Health',
    logo: '💊',
    rating: 4.7,
    reviews: 2177,
    badge: 'Best value',
    multiplier: 0.93,
    features: ['App-based claims', 'Maternity cover', 'Dental & vision', 'Lab & diagnostics'],
    claimSettlement: '97%',
    networkSize: '900+ hospitals',
  },
  {
    id: 'gig-health',
    insurer: 'GIG Gulf Health',
    logo: '🩺',
    rating: 4.6,
    reviews: 1391,
    multiplier: 0.88,
    features: ['Inpatient & outpatient', 'Group plan discounts', 'Preventive care', 'GCC-wide coverage'],
    claimSettlement: '96%',
    networkSize: '700+ hospitals',
  },
  {
    id: 'neuron-health',
    insurer: 'Neuron Health Insurance',
    logo: '🌐',
    rating: 4.5,
    reviews: 891,
    multiplier: 0.82,
    features: ['DHA Basic compliant', 'Budget-friendly', 'Essential inpatient', 'UAE residents focused'],
    claimSettlement: '95%',
    networkSize: '400+ hospitals',
  },
]

const TRAVEL_PLANS: Plan[] = [
  {
    id: 'axa-gulf-travel',
    insurer: 'AXA Gulf Travel',
    logo: '✈️',
    rating: 4.8,
    reviews: 2823,
    badge: 'Most popular',
    multiplier: 1.0,
    features: ['Schengen compliant', 'USD 100,000 medical cover', 'Trip cancellation', '24/7 emergency line'],
    claimSettlement: '98%',
    popular: true,
  },
  {
    id: 'oman-travel',
    insurer: 'Oman Insurance Travel',
    logo: '🌍',
    rating: 4.7,
    reviews: 1541,
    badge: 'Best value',
    multiplier: 0.92,
    features: ['USD 50,000 medical', 'Baggage & delay', 'Adventure sports option', 'Flight cancellation'],
    claimSettlement: '97%',
  },
  {
    id: 'allianz-travel',
    insurer: 'Allianz Partners UAE',
    logo: '🔵',
    rating: 4.6,
    reviews: 1287,
    badge: 'Best price',
    multiplier: 0.85,
    features: ['Multi-trip option', 'USD 50,000 medical', 'Baggage loss', 'Repatriation cover'],
    claimSettlement: '96%',
  },
  {
    id: 'gig-travel',
    insurer: 'GIG Gulf Travel',
    logo: '🛡',
    rating: 4.5,
    reviews: 812,
    multiplier: 0.80,
    features: ['Single & multi-trip', 'Medical emergency', 'Personal liability', 'IA licensed'],
    claimSettlement: '95%',
  },
]

const BUSINESS_PLANS: Plan[] = [
  {
    id: 'daman-group',
    insurer: 'Daman Group Health',
    logo: '🏦',
    rating: 4.9,
    reviews: 4109,
    badge: 'Most popular',
    multiplier: 1.0,
    features: ['Group health insurance', 'DHA & HAAD compliant', 'Employee wellness', 'Priority claims desk'],
    claimSettlement: '99%',
    popular: true,
  },
  {
    id: 'axa-group',
    insurer: 'AXA Gulf Group',
    logo: '🌐',
    rating: 4.8,
    reviews: 2542,
    badge: 'Best network',
    multiplier: 1.05,
    features: ['1,200+ hospital network', 'Telemedicine for staff', 'Dental & vision options', 'Annual health checks'],
    claimSettlement: '98%',
  },
  {
    id: 'adnic-group',
    insurer: 'ADNIC Group Health',
    logo: '🛡',
    rating: 4.7,
    reviews: 1876,
    badge: 'Best price',
    multiplier: 0.88,
    features: ['Flexible plan tiers', 'UAE-wide coverage', 'Digital HR portal', 'IA regulated'],
    claimSettlement: '96%',
  },
  {
    id: 'neuron-group',
    insurer: 'Neuron Health (Group)',
    logo: '💊',
    rating: 4.5,
    reviews: 854,
    multiplier: 0.82,
    features: ['Budget-friendly group plans', 'Basic to comprehensive', 'SME specialist', 'Online enrollment'],
    claimSettlement: '95%',
  },
]

const PLANS_BY_PRODUCT: Record<string, Plan[]> = {
  motor: MOTOR_PLANS,
  medical: MEDICAL_PLANS,
  travel: TRAVEL_PLANS,
  business: BUSINESS_PLANS,
}

const PRODUCT_COLORS: Record<string, { main: string; light: string; text: string }> = {
  motor: { main: 'var(--motor-600)', light: 'var(--motor-50)', text: 'var(--motor-700)' },
  medical: { main: 'var(--medical-600)', light: 'var(--medical-50)', text: 'var(--medical-700)' },
  travel: { main: 'var(--travel-600)', light: 'var(--travel-50)', text: 'var(--travel-700)' },
  business: { main: 'var(--business-600)', light: 'var(--business-50)', text: 'var(--business-700)' },
}

const FILTER_CHIPS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All plans' },
  { id: 'popular', label: 'Popular' },
  { id: 'budget', label: 'Lowest premium' },
  { id: 'top_rated', label: 'Top rated' },
  { id: 'cashless', label: 'Cashless' },
]

function planMatchesFilter(plan: Plan, filter: FilterId, product: string): boolean {
  if (filter === 'all') return true
  if (filter === 'popular') return !!plan.popular
  if (filter === 'budget') return plan.multiplier <= 0.92
  if (filter === 'top_rated') return plan.rating >= 4.7
  if (filter === 'cashless') {
    if (product !== 'medical') return true
    return plan.features.some((f) => f.toLowerCase().includes('cashless'))
  }
  return true
}

function PlanCard({
  plan,
  basePrice,
  color,
  index,
  compareSelected,
  onToggleCompare,
  onChoose,
}: {
  plan: Plan
  basePrice: number
  color: { main: string; light: string; text: string }
  index: number
  compareSelected: string[]
  onToggleCompare: (id: string) => void
  onChoose: (plan: Plan, annualPremium: number) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const price = Math.round(basePrice * plan.multiplier)
  const inCompare = compareSelected.includes(plan.id)
  const compareDisabled = !inCompare && compareSelected.length >= 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-3xl border overflow-hidden hover:shadow-md transition-shadow duration-200"
      style={{ borderColor: plan.popular ? color.main : 'var(--border-default)' }}
    >
      {plan.popular && <div className="h-1.5 w-full" style={{ backgroundColor: color.main }} />}

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <label className="flex items-center gap-2 cursor-pointer select-none shrink-0">
            <input
              type="checkbox"
              checked={inCompare}
              disabled={compareDisabled}
              onChange={() => onToggleCompare(plan.id)}
              className="w-4 h-4 rounded border-[var(--border-medium)] accent-[var(--green-700)]"
            />
            <span className="font-sans text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
              Compare
            </span>
          </label>
          <div className="text-right min-w-0 flex-1">
            <p className="font-sans text-[10px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-muted)' }}>
              From
            </p>
            <p className="font-display font-extrabold text-xl sm:text-[26px] leading-none truncate" style={{ color: color.main }}>
              {formatDirham(price)}
            </p>
            <p className="font-sans text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              / year
            </p>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shrink-0"
              style={{ backgroundColor: color.light }}
            >
              {plan.logo}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-sm sm:text-base truncate" style={{ color: 'var(--text-primary)' }}>
                  {plan.insurer}
                </h3>
                {plan.badge && (
                  <span
                    className="font-sans font-semibold text-[10px] px-2 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: color.light, color: color.text }}
                  >
                    {plan.badge}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-current shrink-0" style={{ color: '#F59E0B' }} />
                <span className="font-sans text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {plan.rating}
                </span>
                <span className="font-sans text-[12px] truncate" style={{ color: 'var(--text-muted)' }}>
                  ({plan.reviews.toLocaleString()} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mb-4">
          {plan.features.slice(0, expanded ? undefined : 4).map((f) => (
            <div key={f} className="flex items-center gap-2 min-w-0">
              <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: color.light }}>
                <Check className="w-2.5 h-2.5" style={{ color: color.main }} strokeWidth={3} />
              </div>
              <span className="font-sans text-[12px] truncate" style={{ color: 'var(--text-secondary)' }}>
                {f}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 py-3 border-y border-[var(--border-subtle)] mb-4 flex-wrap">
          <div>
            <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Claim settlement
            </p>
            <p className="font-display font-bold text-sm" style={{ color: 'var(--green-700)' }}>
              {plan.claimSettlement}
            </p>
          </div>
          {plan.networkSize && (
            <div className="border-l border-[var(--border-subtle)] pl-3 sm:pl-4">
              <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Network
              </p>
              <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                {plan.networkSize}
              </p>
            </div>
          )}
          <div className="border-l border-[var(--border-subtle)] pl-3 sm:pl-4 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
            <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>
              IA
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => onChoose(plan, price)}
            className="flex-1 h-11 sm:h-11 rounded-2xl font-sans font-semibold text-sm text-white transition-all hover:-translate-y-px hover:shadow-md"
            style={{ backgroundColor: color.main }}
          >
            Buy this plan →
          </button>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="h-11 px-4 rounded-2xl border font-sans text-sm flex items-center justify-center gap-1.5 hover:bg-[var(--surface-raised)] transition-colors shrink-0"
            style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" /> Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> Details
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function SaveEmailModal({ onClose, lowestPrice }: { onClose: () => void; lowestPrice: number }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!email.includes('@')) return
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-[420px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-subtle)] hover:text-[var(--text-muted)]"
        >
          <X className="w-5 h-5" />
        </button>

        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">📬</div>
            <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
              Quote sent!
            </h3>
            <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>
              Check your inbox — we&apos;ve emailed your comparison results. Valid for 24 hours.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 h-10 px-6 rounded-xl font-sans font-semibold text-sm text-white"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="text-3xl mb-4">📧</div>
            <h3 className="font-display font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
              Save your quote
            </h3>
            <p className="font-sans text-[13px] mb-5" style={{ color: 'var(--text-muted)' }}>
              We&apos;ll email you these {formatDirham(lowestPrice)}/yr+ results so you can compare later or share with your HR or family.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-12 rounded-xl border-[1.5px] border-[var(--border-medium)] px-4 font-sans text-[14px] outline-none mb-3 focus:border-[var(--green-700)]"
              style={{ color: 'var(--text-primary)' }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!email.includes('@')}
              className="w-full h-11 rounded-xl font-sans font-semibold text-sm text-white disabled:opacity-40 transition-opacity"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              Send quote to email
            </button>
            <p className="font-sans text-[11px] text-center mt-3" style={{ color: 'var(--text-muted)' }}>
              No spam. Unsubscribe any time. UAE data privacy compliant.
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}

function CompareSheet({
  plans,
  basePrice,
  color,
  onClose,
}: {
  plans: Plan[]
  basePrice: number
  color: { main: string; light: string; text: string }
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-4xl max-h-[90dvh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5" style={{ color: color.main }} />
            <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              Side-by-side compare
            </h2>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-[var(--surface-raised)]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-x-auto overflow-y-auto p-4 sm:p-6">
          <table className="w-full min-w-[520px] border-collapse font-sans text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 pr-4 font-semibold text-[var(--text-muted)] w-32">Metric</th>
                {plans.map((p) => (
                  <th key={p.id} className="text-left py-2 px-2 font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                    <span className="mr-1">{p.logo}</span>
                    {p.insurer}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: 'Premium / yr',
                  val: (p: Plan) => formatDirham(Math.round(basePrice * p.multiplier)),
                },
                { label: 'Rating', val: (p: Plan) => `${p.rating} ★` },
                { label: 'Reviews', val: (p: Plan) => p.reviews.toLocaleString() },
                { label: 'Claims paid', val: (p: Plan) => p.claimSettlement },
                {
                  label: 'Network / notes',
                  val: (p: Plan) => p.networkSize ?? '—',
                },
              ].map((row) => (
                <tr key={row.label} className="border-t border-[var(--border-subtle)]">
                  <td className="py-3 pr-4 font-medium" style={{ color: 'var(--text-muted)' }}>
                    {row.label}
                  </td>
                  {plans.map((p) => (
                    <td key={p.id} className="py-3 px-2 align-top" style={{ color: 'var(--text-secondary)' }}>
                      {row.val(p)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-[var(--border-subtle)]">
                <td className="py-3 pr-4 font-medium align-top" style={{ color: 'var(--text-muted)' }}>
                  Highlights
                </td>
                {plans.map((p) => (
                  <td key={p.id} className="py-3 px-2 align-top">
                    <ul className="list-disc pl-4 space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      {p.features.slice(0, 4).map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default function QuoteResultPage() {
  const router = useRouter()
  const { calculatedPremium, activeProduct, setSelectedCheckoutPlan } = useQuoteStore()
  const [sortBy, setSortBy] = useState<SortKey>('popular')
  const [filter, setFilter] = useState<FilterId>('all')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)

  const product = (activeProduct ?? 'motor') as string
  const basePrice = calculatedPremium ?? 50000
  const color = PRODUCT_COLORS[product] ?? PRODUCT_COLORS.motor
  const rawPlans = PLANS_BY_PRODUCT[product] ?? MOTOR_PLANS

  const filtered = useMemo(
    () => rawPlans.filter((p) => planMatchesFilter(p, filter, product)),
    [rawPlans, filter, product]
  )

  const plans = useMemo(() => {
    const list = [...filtered]
    list.sort((a, b) => {
      if (sortBy === 'price') return a.multiplier - b.multiplier
      if (sortBy === 'rating') return b.rating - a.rating
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
    })
    return list
  }, [filtered, sortBy])

  const lowestPrice = Math.round(basePrice * Math.min(...rawPlans.map((p) => p.multiplier)))

  const comparePlans = useMemo(
    () => compareIds.map((id) => rawPlans.find((p) => p.id === id)).filter(Boolean) as Plan[],
    [compareIds, rawPlans]
  )

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  function handleChoose(plan: Plan, annualPremium: number) {
    const payload: SelectedCheckoutPlan = {
      planId: plan.id,
      insurer: plan.insurer,
      logo: plan.logo,
      annualPremium,
      features: plan.features,
      claimSettlement: plan.claimSettlement,
      networkSize: plan.networkSize,
    }
    setSelectedCheckoutPlan(payload)
    router.push('/quote/checkout')
  }

  const filterRow = FILTER_CHIPS.filter((c) => c.id !== 'cashless' || product === 'medical')

  return (
    <div
      className={compareIds.length > 0 ? 'min-h-screen max-md:pb-28 pb-20 md:pb-8' : 'min-h-screen'}
      style={{ backgroundColor: 'var(--page-bg)' }}
    >
      <div className="py-6 sm:py-8 px-5 lg:px-20 bg-white border-b border-[var(--border-default)]">
        <div className="max-w-[960px] mx-auto">
          <Link
            href={`/quote/${product}`}
            className="flex items-center gap-1.5 font-sans text-sm mb-4 hover:underline"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to quote form
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display font-extrabold text-2xl sm:text-[28px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {plans.length} plans match your profile
              </h1>
              <p className="font-sans text-sm sm:text-base mt-1" style={{ color: 'var(--text-muted)' }}>
                From{' '}
                <span className="font-bold" style={{ color: color.main }}>
                  {formatDirham(lowestPrice)}/yr
                </span>{' '}
                · Filter, sort, shortlist up to 3, then buy in under 3 minutes.
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl border shrink-0"
              style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-100)' }}
            >
              <Shield className="w-4 h-4 shrink-0" style={{ color: 'var(--green-700)' }} />
                <span className="font-sans font-medium text-xs sm:text-sm" style={{ color: 'var(--green-700)' }}>
                IA Licensed
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-5 lg:px-0 py-6 sm:py-8">
        {/* PolicyBazaar-style filter + sort row */}
        <div className="rounded-3xl border border-[var(--border-default)] bg-white p-4 sm:p-5 mb-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Quick filters
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {filterRow.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className="h-9 px-3.5 rounded-full font-sans text-[13px] font-medium transition-all border"
                style={
                  filter === id
                    ? { backgroundColor: color.main, color: 'white', borderColor: color.main }
                    : { backgroundColor: 'var(--surface-raised)', color: 'var(--text-secondary)', borderColor: 'var(--border-medium)' }
                }
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <span className="font-sans text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>
              Sort:
            </span>
            {(
              [
                ['popular', 'Recommended'],
                ['price', 'Premium low → high'],
                ['rating', 'Insurer rating'],
              ] as [SortKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSortBy(key)}
                className="h-8 px-3 rounded-full font-sans text-[12px] font-medium transition-all border"
                style={
                  sortBy === key
                    ? { backgroundColor: color.light, color: color.text, borderColor: color.main }
                    : { backgroundColor: 'white', color: 'var(--text-secondary)', borderColor: 'var(--border-medium)' }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {plans.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border-default)] bg-white p-10 text-center font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
            No plans match this filter.{' '}
            <button type="button" className="underline font-medium" style={{ color: color.main }} onClick={() => setFilter('all')}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {plans.map((plan, i) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                basePrice={basePrice}
                color={color}
                index={i}
                compareSelected={compareIds}
                onToggleCompare={toggleCompare}
                onChoose={handleChoose}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-6 flex items-center justify-center gap-3 flex-wrap"
        >
          <button
            type="button"
            onClick={() => setShowEmailModal(true)}
            className="flex items-center gap-2 h-10 px-5 rounded-xl border font-sans font-medium text-[13px] hover:bg-[var(--surface-raised)] transition-colors"
            style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
          >
            <Mail className="w-4 h-4" /> Save quote to email
          </button>
          <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
            Valid 24h · No spam
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-8 p-5 rounded-3xl border border-[var(--border-default)] bg-white flex flex-wrap items-center justify-center gap-6"
        >
          {[
            { icon: '🔒', label: '256-bit SSL encryption' },
            { icon: '📋', label: 'IA regulated insurers' },
            { icon: '⚡', label: 'DHA certificate in minutes' },
            { icon: '📞', label: '24/7 multilingual support' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-lg">{icon}</span>
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        <p className="font-sans text-[12px] mt-8 leading-relaxed max-w-2xl" style={{ color: 'var(--text-muted)' }}>
          All plans are verified with IA-licensed UAE insurers. DHA and HAAD compliance certified. Prices are indicative — final premiums confirmed at checkout based on your Emirates ID and visa status.
        </p>
      </div>

      <AnimatePresence>
        {showEmailModal && <SaveEmailModal onClose={() => setShowEmailModal(false)} lowestPrice={lowestPrice} />}
      </AnimatePresence>

      <AnimatePresence>
        {compareOpen && comparePlans.length >= 2 && (
          <CompareSheet plans={comparePlans} basePrice={basePrice} color={color} onClose={() => setCompareOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sticky compare bar (mobile-first) */}
      {compareIds.length > 0 && (
        <div className="fixed max-md:bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] bottom-0 inset-x-0 z-[56] md:left-auto md:right-6 md:bottom-6 md:max-w-md md:rounded-2xl border-t md:border border-[var(--border-default)] bg-white/95 backdrop-blur-md px-4 py-3 md:shadow-xl flex items-center justify-between gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-3">
          <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {compareIds.length}
            </span>{' '}
            / 3 selected
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="h-10 px-3 rounded-xl font-sans text-[13px] font-medium border border-[var(--border-medium)]"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setCompareIds([])}
            >
              Clear
            </button>
            <button
              type="button"
              disabled={compareIds.length < 2}
              className="h-10 px-4 rounded-xl font-sans text-[13px] font-semibold text-white disabled:opacity-40"
              style={{ backgroundColor: color.main }}
              onClick={() => setCompareOpen(true)}
            >
              Compare
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
