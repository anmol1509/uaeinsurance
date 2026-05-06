import { redirect } from 'next/navigation'

export default function RenewalsPage() {
  redirect('/dashboard?tab=renewals')
}
