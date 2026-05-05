import Link from 'next/link'
import { Shield, Phone, Mail, MapPin } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const links = {
  Products: [
    { label: 'Health Insurance',      href: '/medical' },
    { label: 'Group Health',          href: '/business' },
    { label: 'Motor Insurance',       href: '/motor' },
    { label: 'Travel Insurance',      href: '/travel' },
  ],
  Company: [
    { label: 'About InsureAE',        href: '/about' },
    { label: 'Careers',               href: '/careers' },
    { label: 'Press & Media',         href: '/press' },
    { label: 'Blog',                  href: '/blog' },
  ],
  Support: [
    { label: 'File a Claim',          href: '/claims' },
    { label: 'Policy Renewal',        href: '/renewals' },
    { label: 'Contact Us',            href: '/contact' },
    { label: 'FAQs',                  href: '/faqs' },
  ],
  Legal: [
    { label: 'Privacy Policy',        href: '/privacy' },
    { label: 'Terms of Service',      href: '/terms' },
    { label: 'Cookie Policy',         href: '/cookies' },
    { label: 'Regulatory Disclosure', href: '/regulatory' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--navy-950)', color: 'var(--navy-200)' }}>
      <div className="max-w-[1320px] mx-auto px-5 lg:px-8">

        {/* Main footer content */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">

          {/* Brand column */}
          <div className="col-span-2">
            <Logo size={34} textColor="white" className="mb-4" />
            <p className="font-sans text-[13px] leading-relaxed mb-5" style={{ color: 'var(--navy-400)', maxWidth: '240px' }}>
              UAE's premier health insurance comparison platform. IA-licensed. DHA &amp; HAAD compliant.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--teal-500)' }} />
                <a href="tel:+97180047867" className="font-sans text-[13px] hover:text-white transition-colors">800-INSURE (467873)</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--teal-500)' }} />
                <a href="mailto:hello@insure.ae" className="font-sans text-[13px] hover:text-white transition-colors">hello@insure.ae</a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--teal-500)' }} />
                <span className="font-sans text-[13px]">Gate District 3, DIFC, Dubai, UAE</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="font-sans font-bold text-[11px] uppercase tracking-widest text-white mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-sans text-[13px] transition-colors hover:text-white"
                      style={{ color: 'var(--navy-400)' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Regulatory bar */}
        <div
          className="py-5 border-t flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <Shield className="w-5 h-5 shrink-0" style={{ color: 'var(--teal-500)' }} />
          <p className="font-sans text-[11.5px] leading-relaxed" style={{ color: 'var(--navy-400)', maxWidth: '800px' }}>
            InsureAE is licensed by the <strong className="text-white font-semibold">Insurance Authority of the UAE</strong> (IA). 
            Health plans for Dubai comply with <strong className="text-white font-semibold">Dubai Health Authority (DHA)</strong> regulations. 
            Plans for Abu Dhabi comply with <strong className="text-white font-semibold">Health Authority Abu Dhabi (HAAD)</strong> regulations. 
            All premiums and plans are subject to IA and relevant authority approvals.
          </p>
        </div>

        {/* Bottom bar */}
        <div
          className="py-5 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <p className="font-sans text-[12px]" style={{ color: 'var(--navy-500)' }}>
            © {new Date().getFullYear()} InsureAE Technologies LLC. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {['Apple Pay', 'Visa', 'Mastercard', 'Bank Transfer', 'Samsung Pay'].map(m => (
              <span key={m} className="font-sans font-semibold text-[11px] px-2.5 py-1 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'var(--navy-300)' }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
