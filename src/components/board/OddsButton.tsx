import { memo } from 'react'

import type { OddsDirection } from '@/types/odds'

interface OddsButtonProps {
  label: string
  odds: number
  selected: boolean
  flashDirection: OddsDirection | null
  onClick: () => void
  className?: string
}

const OddsButtonComponent = ({ label, odds, selected, flashDirection, onClick, className }: OddsButtonProps) => {
  const flashOddsClass = flashDirection === null ? 'text-[var(--text-primary)]' : ''
  const borderColor =
    flashDirection === 'up'
      ? 'var(--state-up)'
      : flashDirection === 'down'
        ? 'var(--state-down)'
        : selected
          ? 'var(--accent-gold)'
          : 'var(--border)'
  const oddsColor =
    flashDirection === 'up'
      ? 'var(--state-up)'
      : flashDirection === 'down'
        ? 'var(--state-down)'
        : 'var(--text-primary)'

  const selectedClass = selected
    ? 'bg-[#f7c948]/20 text-[var(--accent-gold)]'
    : 'bg-[var(--card)] text-[var(--accent-gold)]'
  const hoverClass = selected
    ? 'hover:brightness-110'
    : 'hover:bg-[var(--panel)] hover:text-[var(--accent-gold)]'
  const buttonNode = (
    <button
      type="button"
      onClick={onClick}
      className={`font-odds w-[58px] rounded-md border px-2 py-1 text-[13px] font-semibold transition-transform duration-150 ease-out active:scale-[0.98] ${hoverClass} hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-gold) ${selectedClass} ${className ?? ''}`}
      style={{ borderColor }}
      aria-pressed={selected}
      aria-label={`${label} odds ${odds.toFixed(2)}${flashDirection ? `, moving ${flashDirection}` : ''}`}
    >
      {label}{' '}
      <span className={`transition-colors duration-700 ease-out ${flashOddsClass}`} style={{ color: oddsColor }}>
        {odds.toFixed(2)}
      </span>
    </button>
  )

  return buttonNode
}

export const OddsButton = memo(OddsButtonComponent)
