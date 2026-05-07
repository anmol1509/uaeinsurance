'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileBottomDock from './MobileBottomDock'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import LiveChat from '@/components/ui/LiveChat'
import CookieBanner from '@/components/ui/CookieBanner'
import { cn } from '@/lib/utils'
import { shouldShowMarketingBottomDock, isQuoteFormPath } from '@/lib/mobileDock'

const CHROME_HIDDEN_PREFIXES = ['/dashboard', '/login', '/register', '/admin', '/insurer', '/broker', '/quote/health']

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideChrome = CHROME_HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))
  const immersiveQuote =
    isQuoteFormPath(pathname) || pathname.startsWith('/quote/checkout')
  const hideFloatingAndFooter = !hideChrome && immersiveQuote
  const showMobileDock = shouldShowMarketingBottomDock(pathname)

  return (
    <>
      {!hideChrome && <Navbar />}
      <main
        className={cn(
          showMobileDock &&
            'max-md:pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))]'
        )}
      >
        {children}
      </main>
      {!hideChrome && !hideFloatingAndFooter && <Footer />}
      {!hideChrome && !hideFloatingAndFooter && <WhatsAppButton />}
      {!hideChrome && !hideFloatingAndFooter && <LiveChat />}
      {!hideChrome && <MobileBottomDock />}
      <CookieBanner />
    </>
  )
}
