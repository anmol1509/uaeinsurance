import type { Metadata } from 'next'
import MedicalProductPage from '@/components/product/MedicalProductPage'

export const metadata: Metadata = {
  title: 'Health Insurance UAE',
  description: 'DHA & HAAD compliant health insurance in UAE. Basic, Enhanced, and VIP plans. Instant quotes from IA-licensed insurers. Mandatory Dubai health cover made simple.',
}

export default function MedicalPage() {
  return <MedicalProductPage />
}
