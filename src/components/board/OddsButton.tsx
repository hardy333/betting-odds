import { motion } from 'framer-motion'
import type { OddsDirection } from '@/types/odds'

interface OddsButtonProps {
  label: string
  odds: number
  selected: boolean
  flashDirection: OddsDirection | null
  onClick: () => void
  className?: string
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

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`font-odds w-[58px] rounded-md border px-2 py-1 text-[13px] font-semibold transition-colors duration-700 ease-out ${hoverClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7c948] ${selectedClass} ${className ?? ''}`}
      style={{ borderColor }}
      aria-pressed={selected}
      aria-label={`${label} odds ${odds.toFixed(2)}${flashDirection ? `, moving ${flashDirection}` : ''}`}
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
}
