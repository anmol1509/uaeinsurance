import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: number
  showWordmark?: boolean
  wordmarkColor?: string
  href?: string
  variant?: 'default' | 'white'
}

export default function Logo({
  size = 32,
  showWordmark = true,
  wordmarkColor,
  href = '/',
  variant = 'default',
}: LogoProps) {
  const textColor = wordmarkColor ?? (variant === 'white' ? 'white' : 'var(--text-primary)')

  const inner = (
    <span className="flex items-center gap-2.5">
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
        <rect width="40" height="40" rx="10" fill="var(--green-700)" />
        <path
          d="M20 8 L28 13 L28 22 C28 26.4 24.8 30.2 20 32 C15.2 30.2 12 26.4 12 22 L12 13 Z"
          fill="white"
          opacity="0.15"
        />
        <path
          d="M20 10 L27 14.5 L27 22 C27 25.8 24.2 29.2 20 31 C15.8 29.2 13 25.8 13 22 L13 14.5 Z"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M16 22 L19 25 L24 18"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark && (
        <span
          className="font-display font-bold leading-none"
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
