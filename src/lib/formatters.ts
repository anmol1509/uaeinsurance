const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

export const formatNaira = formatCurrency
export const formatAED = formatCurrency
export const formatDirham = formatCurrency

const formatCurrencyShort = (amount: number): string => {
  if (amount >= 1_000_000_000) return `AED ${(amount / 1_000_000_000).toFixed(1)}B`
  if (amount >= 1_000_000) return `AED ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `AED ${(amount / 1_000).toFixed(0)}K`
  return `AED ${amount}`
}

export const formatNairaShort = formatCurrencyShort
export const formatAEDShort = formatCurrencyShort
export const formatDirhamShort = formatCurrencyShort

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('en-AE').format(n)
