import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, DM_Sans, Lora } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://insure.ae'),
  title: {
    default: 'InsureAE — UAE\'s Premier Health Insurance Platform',
    template: '%s | InsureAE',
  },
  description:
    'Get instant health insurance quotes in UAE. DHA & HAAD compliant. IA licensed. Mandatory health cover for Dubai employees. Certificate in under 3 minutes.',
  keywords: [
    'health insurance UAE',
    'health insurance Dubai',
    'health insurance Abu Dhabi',
    'mandatory health insurance Dubai',
    'DHA compliant health insurance',
    'HAAD insurance UAE',
    'medical insurance UAE',
    'group health insurance UAE',
    'individual health insurance Dubai',
    'family health insurance UAE',
    'best health insurance UAE',
    'cheap health insurance Dubai',
    'insurance authority UAE',
    'expat health insurance UAE',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://insure.ae',
    siteName: 'InsureAE',
    title: 'InsureAE — UAE\'s Premier Health Insurance Platform',
    description: 'Instant quotes. DHA-compliant certificates. Real claims support.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'InsureAE — UAE health insurance comparison platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@insure_ae',
    site: '@insure_ae',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://insure.ae' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${dmSans.variable} ${lora.variable}`}>
      <body className="font-sans antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
