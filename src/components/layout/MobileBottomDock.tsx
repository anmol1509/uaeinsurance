'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, RefreshCw, FileText, LifeBuoy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { shouldShowMarketingBottomDock } from '@/lib/mobileDock'

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/renewals', label: 'Renew', icon: RefreshCw },
  { href: '/quote/motor', label: 'Quote', icon: FileText },
  { href: '/claims', label: 'Claims', icon: LifeBuoy },
] as const

export default function MobileBottomDock() {
  const pathname = usePathname()
  if (!shouldShowMarketingBottomDock(pathname)) return null

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-[var(--border-default)] bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)] pt-1.5 px-1 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
      aria-label="Primary"
    >
      <ul className="flex max-w-lg mx-auto">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/'
              ? pathname === '/'
              : href === '/quote/motor'
                ? pathname.startsWith('/quote/')
                : pathname === href || pathname.startsWith(`${href}/`)
          return (
            <li key={href} className="flex-1 min-w-0">
              <Link
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-2 rounded-xl transition-colors',
                  active ? 'text-[var(--green-700)]' : 'text-[var(--text-muted)]'
                )}
              >
                <Icon className={cn('w-5 h-5', active && 'stroke-[2.5px]')} strokeWidth={active ? 2.5 : 2} />
                <span className="font-sans font-semibold text-[10px] tracking-tight">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
