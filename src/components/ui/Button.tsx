import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'surface' | 'outline'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  children: ReactNode
}

const sizeClassMap: Record<ButtonSize, string> = {
  sm: 'px-2 py-1 text-[12px]',
  md: 'px-3 py-2 text-[13px]',
}

const variantClassMap: Record<ButtonVariant, string> = {
  primary:
    'border border-transparent bg-[var(--accent-orange)] text-[var(--bg-app)] hover:brightness-110 active:translate-y-px active:brightness-95 focus-visible:ring-[var(--accent-gold)]',
  surface:
    'border border-[var(--border)] bg-[var(--card)] text-[var(--accent-gold)] hover:border-[var(--accent-gold)] hover:brightness-110 active:translate-y-px active:bg-[var(--panel)] focus-visible:ring-[var(--accent-gold)]',
  outline:
    'border border-[var(--accent-orange)] bg-transparent text-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/12 hover:brightness-110 active:translate-y-px active:bg-[var(--accent-orange)]/20 focus-visible:ring-[var(--accent-orange)]',
}

export const Button = ({
  variant = 'surface',
  size = 'md',
  className,
  fullWidth = false,
  children,
  ...rest
}: ButtonProps) => {
  const fullWidthClass = fullWidth ? 'w-full' : ''
  const baseClass =
    'inline-flex items-center justify-center gap-1 rounded-md font-bold uppercase tracking-[0.08em] transition focus-visible:outline-none focus-visible:ring-2'

  return (
    <button
      type="button"
      className={`${baseClass} ${sizeClassMap[size]} ${variantClassMap[variant]} ${fullWidthClass} ${className ?? ''}`}
      {...rest}
    >
      {children}
    </button>
  )
}
