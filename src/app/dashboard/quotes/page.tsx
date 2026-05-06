'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Plus } from 'lucide-react'
import { mockQuotes, PRODUCT_COLORS } from '@/lib/mockData'
import { formatDirham } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'

const STATUS_VARIANT: Record<string, 'status-active' | 'status-expiring' | 'status-expired'> = {
  converted: 'status-active',
  submitted: 'status-expiring',
  draft:     'status-expired',
}

const STATUS_LABEL: Record<string, string> = {
  converted: 'Converted',
  submitted: 'Pending',
  draft:     'Draft',
}

export default function QuotesPage() {
  return (
    <div className="px-4 lg:px-8 py-6 max-w-[900px] mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Quote History
          </h1>
          <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {mockQuotes.length} quotes saved
          </p>
        </div>
        <Link
          href="/quote/health"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans font-semibold text-[13px] text-white"
          style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}
        >
          <Plus className="w-4 h-4" /> New Quote
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {mockQuotes.map((quote, i) => {
          const colors = PRODUCT_COLORS[quote.productType] ?? PRODUCT_COLORS.medical
          const expired = new Date(quote.expiresAt) < new Date()
          return (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border p-5 flex items-center gap-4"
              style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] shrink-0"
                style={{ backgroundColor: colors.light }}
              >
                {colors.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-sans font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>
                    {quote.summary}
                  </p>
                  <Badge variant={STATUS_VARIANT[quote.status] ?? 'default'}>
                    {STATUS_LABEL[quote.status]}
                  </Badge>
                </div>
                <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Created {new Date(quote.createdAt).toLocaleDateString('en-AE')} ·{' '}
                  {expired ? <span style={{ color: 'var(--error)' }}>Expired</span> : `Expires ${new Date(quote.expiresAt).toLocaleDateString('en-AE')}`}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="font-sans font-bold text-[16px]" style={{ color: 'var(--text-primary)' }}>
                  {formatDirham(quote.estimatedPremium)}
                </p>
                <p className="font-sans text-[11px]" style={{ color: 'var(--text-subtle)' }}>estimated</p>
              </div>

              {quote.status !== 'converted' && (
                <Link
                  href="/quote/health"
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl font-sans font-semibold text-[12px] border transition-colors hover:bg-[#F0FDFA]"
                  style={{ borderColor: '#E5EAF0', color: '#0D9488' }}
                >
                  Resume <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="mt-6 p-5 rounded-2xl border text-center" style={{ backgroundColor: '#F0FDFA', borderColor: '#CCFBF1' }}>
        <p className="font-sans font-semibold text-[14px] mb-1" style={{ color: '#0D9488' }}>
          Get a fresh health insurance quote
        </p>
        <p className="font-sans text-[13px] mb-3" style={{ color: 'var(--text-muted)' }}>
          DHA & HAAD compliant plans for every UAE emirate — compare in 3 minutes.
        </p>
        <Link
          href="/quote/health"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans font-bold text-[13px] text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#0F2D55,#0D9488)' }}
        >
          Start New Quote <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
