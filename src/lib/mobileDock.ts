/**
 * Fixed bottom marketing dock (mobile) — chat/WhatsApp should sit above it.
 * Hidden on quote form wizard, dashboard, auth, and checkout for an app-like flow.
 */
export function shouldShowMarketingBottomDock(pathname: string): boolean {
  if (!pathname) return false
  if (['/dashboard', '/login', '/register', '/admin'].some((p) => pathname.startsWith(p))) return false
  if (pathname.startsWith('/quote/checkout')) return false
  if (/^\/quote\/(motor|medical|travel|business)(\/|$)/.test(pathname)) return false
  return true
}

export function isQuoteFormPath(pathname: string): boolean {
  return /^\/quote\/(motor|medical|travel|business)(\/|$)/.test(pathname)
}
