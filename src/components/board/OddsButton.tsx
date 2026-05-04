import { motion } from 'framer-motion'
import { Tooltip } from '@/components/ui/Tooltip'
import type { OddsDirection } from '@/types/odds'

interface OddsButtonProps {
  label: string
  odds: number
  selected: boolean
  flashDirection: OddsDirection | null
  onClick: () => void
  className?: string
}

const BET_TOOLTIP_BY_LABEL: Record<string, string> = {
  '1X': 'Double chance: home win or draw.',
  '12': 'Double chance: either team wins, draw loses.',
  X2: 'Double chance: draw or away win.',
  'O2.5': 'Over 2.5 total goals, 3 or more goals needed.',
  'U2.5': 'Under 2.5 total goals, 2 or fewer goals needed.',
}

export const OddsButton = ({ label, odds, selected, flashDirection, onClick, className }: OddsButtonProps) => {
  const flashOddsClass = flashDirection === null ? 'text-[#f3f4f6]' : ''
  const borderColor =
    flashDirection === 'up' ? '#00c853' : flashDirection === 'down' ? '#ef4444' : selected ? '#f7c948' : '#30363d'
  const oddsColor =
    flashDirection === 'up' ? '#00c853' : flashDirection === 'down' ? '#ef4444' : '#f3f4f6'

  const selectedClass = selected
    ? 'bg-[#4a3a12] text-[#f7c948]'
    : 'bg-[#1c2330] text-[#f7c948]'
  const hoverClass = selected
    ? 'hover:bg-[#5a4918]'
    : 'hover:bg-[#2b3444] hover:text-[#f7c948]'
  const tooltip = BET_TOOLTIP_BY_LABEL[label]
  const buttonNode = (
    <motion.button
      type="button"
      onClick={onClick}
      className={`font-odds w-[58px] rounded-md border px-2 py-1 text-[13px] font-semibold ${hoverClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7c948] ${selectedClass} ${className ?? ''}`}
      style={{ borderColor }}
      aria-pressed={selected}
      aria-label={`${label} odds ${odds.toFixed(2)}${tooltip ? `. ${tooltip}` : ''}${flashDirection ? `, moving ${flashDirection}` : ''}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      {label}{' '}
      <span className={`transition-colors duration-700 ease-out ${flashOddsClass}`} style={{ color: oddsColor }}>
        {odds.toFixed(2)}
      </span>
    </motion.button>
  )

  if (!tooltip) return buttonNode

  return <Tooltip content={tooltip}>{buttonNode}</Tooltip>
}
