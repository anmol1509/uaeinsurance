import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: number
  showWordmark?: boolean
  wordmarkColor?: string
  textColor?: string
  href?: string
  variant?: 'default' | 'white'
  className?: string
}

export default function Logo({
  size = 32,
  showWordmark = true,
  wordmarkColor,
  textColor: textColorProp,
  href = '/',
  variant = 'default',
  className,
}: LogoProps) {
  const textColor = textColorProp ?? wordmarkColor ?? (variant === 'white' ? 'white' : 'var(--navy-900)')
  const id = `logo-grad-${size}`

  const inner = (
    <span className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        style={{ borderRadius: size * 0.22 }}
        aria-label="InsureAE logo"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0F2D55" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill={`url(#${id})`} />
        {/* Shield outline */}
        <path
          d="M20 8 L29 13 L29 22.5 C29 27.5 25.2 31.5 20 33 C14.8 31.5 11 27.5 11 22.5 L11 13 Z"
          fill="white"
          opacity="0.12"
        />
        <path
          d="M20 10 L27.5 14.5 L27.5 22.5 C27.5 26.8 24.4 30.2 20 31.5 C15.6 30.2 12.5 26.8 12.5 22.5 L12.5 14.5 Z"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Checkmark */}
        <path
          d="M15.5 22 L18.5 25.5 L24.5 18"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark && (
        <span
          className="font-display font-bold leading-none tracking-tight"
          style={{ fontSize: size * 0.53, color: textColor }}
        >
          InsureAE
        </span>
      )}
    </span>
  )

  if (!href) return inner

  return (
    <Link href={href} className="flex items-center">
      {inner}
    </Link>
  )
}
