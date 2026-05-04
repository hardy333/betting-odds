import type { HTMLAttributes, ReactNode } from 'react'

type ChipTone = 'gold' | 'live' | 'neutral'

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: ChipTone
  withPulseDot?: boolean
  children: ReactNode
}

const toneClassMap: Record<ChipTone, string> = {
  gold: 'border border-[#f7c948] bg-[#2a230f] text-[#f7c948]',
  live: 'bg-[#0b2d18] text-[#00c853]',
  neutral: 'border border-[#30363d] bg-[#1c2330] text-[#9ca3af]',
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
        <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-[#00c853]" aria-hidden />
      ) : null}
      {children}
    </span>
  )
}
