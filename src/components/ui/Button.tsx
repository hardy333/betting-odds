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
    'border border-transparent bg-[#f5820f] text-[#111827] hover:brightness-110 active:translate-y-px active:brightness-95 focus-visible:ring-[#f7c948]',
  surface:
    'border border-[#30363d] bg-[#1c2330] text-[#f7c948] hover:border-[#f7c948] hover:bg-[#252d3d] active:translate-y-px active:bg-[#1a2230] focus-visible:ring-[#f7c948]',
  outline:
    'border border-[#f5820f] bg-transparent text-[#f5820f] hover:bg-[#f5820f]/12 hover:text-[#ffb15b] active:translate-y-px active:bg-[#f5820f]/20 focus-visible:ring-[#f5820f]',
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
