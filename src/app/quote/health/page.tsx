import type { Metadata } from 'next'
import { Suspense } from 'react'
import HealthQuoteFlow from '@/components/quote/HealthQuoteFlow'

export const metadata: Metadata = {
  title: 'Get Health Insurance Quote — UAE',
  description: 'Instant DHA & HAAD compliant health insurance quotes for Dubai, Abu Dhabi and all UAE emirates. Compare 14+ insurers in under 3 minutes.',
}

export default function HealthQuotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-sans text-[var(--text-muted)]">Loading quote flow…</div>}>
      <HealthQuoteFlow />
    </Suspense>
  )
}
