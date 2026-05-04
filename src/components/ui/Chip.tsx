import type { HTMLAttributes, ReactNode } from 'react'

type ChipTone = 'gold' | 'live' | 'neutral'

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: ChipTone
  withPulseDot?: boolean
  children: ReactNode
}

const toneClassMap: Record<ChipTone, string> = {
  gold: 'border border-[var(--accent-gold)] bg-[var(--card)] text-[var(--accent-gold)]',
  live: 'border border-[var(--state-up)] bg-transparent text-[var(--state-up)]',
  neutral: 'border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)]',
}

export const Chip = ({
  tone = 'neutral',
  withPulseDot = false,
  className,
  children,
  ...rest
}: ChipProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${toneClassMap[tone]} ${className ?? ''}`}
      {...rest}
    >
      {withPulseDot ? (
        <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-(--state-up)" aria-hidden />
      ) : null}
      {children}
    </span>
  )
}
