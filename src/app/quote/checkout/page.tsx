'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, CreditCard, Shield } from 'lucide-react'
import { useQuoteStore } from '@/store/quoteStore'
import { formatDirham } from '@/lib/formatters'

const PRODUCT_COLORS: Record<string, { main: string; light: string }> = {
  motor: { main: 'var(--motor-600)', light: 'var(--motor-50)' },
  medical: { main: 'var(--medical-600)', light: 'var(--medical-50)' },
  travel: { main: 'var(--travel-600)', light: 'var(--travel-50)' },
  business: { main: 'var(--business-600)', light: 'var(--business-50)' },
}

function useProposer(product: string) {
  const motorData = useQuoteStore((s) => s.motorData)
  const medicalData = useQuoteStore((s) => s.medicalData)
  const travelData = useQuoteStore((s) => s.travelData)
  const businessData = useQuoteStore((s) => s.businessData)
  return useMemo(() => {
    if (product === 'motor') {
      return { name: motorData.fullName || '—', email: motorData.email || '—', phone: motorData.phone || '—' }
    }
    if (product === 'medical') {
      return { name: medicalData.fullName || '—', email: medicalData.email || '—', phone: medicalData.phone || '—' }
    }
    if (product === 'travel') {
      return { name: travelData.fullName || '—', email: '—', phone: '—' }
    }
    return {
      name: businessData.directorName || businessData.businessName || '—',
      email: businessData.directorEmail || '—',
      phone: businessData.directorPhone || '—',
    }
  }, [product, motorData, medicalData, travelData, businessData])
}

export default function QuoteCheckoutPage() {
  const router = useRouter()
  const activeProduct = useQuoteStore((s) => s.activeProduct)
  const selectedCheckoutPlan = useQuoteStore((s) => s.selectedCheckoutPlan)
  const setSelectedCheckoutPlan = useQuoteStore((s) => s.setSelectedCheckoutPlan)
  const [paid, setPaid] = useState(false)

  const product = (activeProduct ?? 'motor') as string
  const color = PRODUCT_COLORS[product] ?? PRODUCT_COLORS.motor

  const proposer = useProposer(product)

  useEffect(() => {
    if (!selectedCheckoutPlan) {
      router.replace(`/quote/result`)
    }
  }, [selectedCheckoutPlan, router])

  if (!selectedCheckoutPlan) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
        Redirecting…
      </div>
    )
  }

  const stamp = 750
  const total = selectedCheckoutPlan.annualPremium + stamp

  return (
    <div className="min-h-[100dvh] pb-8" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="border-b border-[var(--border-default)] bg-white px-5 py-6 lg:px-20">
        <div className="max-w-lg mx-auto lg:max-w-2xl">
          <Link
            href="/quote/result"
            className="inline-flex items-center gap-1.5 font-sans text-sm mb-4 hover:underline"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to plans
          </Link>
          <h1 className="font-display font-extrabold text-2xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Checkout
          </h1>
          <p className="font-sans text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Review your policy and pay securely — IA-licensed partner.
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto lg:max-w-2xl px-5 pt-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[var(--border-default)] bg-white p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: color.light }}
            >
              {selectedCheckoutPlan.logo}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Selected plan
              </p>
              <p className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                {selectedCheckoutPlan.insurer}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCheckoutPlan.features.slice(0, 3).map((f) => (
                  <span
                    key={f}
                    className="font-sans text-[11px] px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-secondary)' }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="rounded-3xl border border-[var(--border-default)] bg-white p-5">
          <p className="font-sans font-semibold text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--text-subtle)' }}>
            Proposer
          </p>
          <dl className="space-y-2 font-sans text-sm">
            <div className="flex justify-between gap-4">
              <dt style={{ color: 'var(--text-muted)' }}>Name</dt>
              <dd className="font-medium text-right truncate" style={{ color: 'var(--text-primary)' }}>
                {proposer.name}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt style={{ color: 'var(--text-muted)' }}>Email</dt>
              <dd className="font-medium text-right truncate" style={{ color: 'var(--text-primary)' }}>
                {proposer.email}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt style={{ color: 'var(--text-muted)' }}>Phone</dt>
              <dd className="font-medium text-right truncate" style={{ color: 'var(--text-primary)' }}>
                {proposer.phone}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl border border-[var(--border-default)] bg-white p-5">
          <p className="font-sans font-semibold text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--text-subtle)' }}>
            Payment summary
          </p>
          <div className="space-y-2 font-sans text-sm">
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Premium (1 year)</span>
              <span className="font-semibold">{formatDirham(selectedCheckoutPlan.annualPremium)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Stamp duty &amp; levies</span>
              <span className="font-semibold">{formatDirham(stamp)}</span>
            </div>
            <div className="border-t border-[var(--border-subtle)] pt-3 mt-2 flex justify-between items-center">
              <span className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                Total due
              </span>
              <span className="font-display font-extrabold text-xl" style={{ color: color.main }}>
                {formatDirham(total)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-2xl px-3 py-2.5" style={{ backgroundColor: 'var(--green-50)' }}>
          <Shield className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--green-700)' }} />
          <p className="font-sans text-[12px]" style={{ color: 'var(--green-800)' }}>
            Secure checkout. Your DHA-compliant certificate is issued instantly after successful payment (demo flow below).
          </p>
        </div>

        {!paid ? (
          <div className="space-y-3 pt-2">
            <button
              type="button"
              className="w-full h-12 rounded-2xl font-display font-semibold text-white flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-transform"
              style={{ backgroundColor: color.main }}
              onClick={() => setPaid(true)}
            >
              <CreditCard className="w-5 h-5" /> Pay Securely
            </button>
            <button
              type="button"
              className="w-full h-11 rounded-2xl font-sans font-medium text-sm border border-[var(--border-medium)]"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => {
                setSelectedCheckoutPlan(null)
                router.push('/quote/result')
              }}
            >
              Change plan
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-[var(--border-default)] bg-white p-8 text-center"
          >
            <div
              className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: 'var(--green-50)' }}
            >
              <Check className="w-7 h-7" style={{ color: 'var(--green-700)' }} strokeWidth={2.5} />
            </div>
            <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
              Payment received (demo)
            </h2>
            <p className="font-sans text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              In production this step would confirm payment, email your DHA-compliant policy PDF, and issue your IA certificate.
            </p>
            <Link
              href="/dashboard/policies"
              className="inline-flex h-11 px-8 rounded-2xl font-sans font-semibold text-sm text-white items-center justify-center"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              View my policies
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
