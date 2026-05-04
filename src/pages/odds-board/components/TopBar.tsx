import { motion } from 'framer-motion'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { formatNumberWithCommas } from '@/utils/formatNumber'

interface TopBarProps {
  selectedCount: number
  totalMatches: number
  isLoading: boolean
  onOpenMobileBetTicket: () => void
}

export const TopBar = ({ selectedCount, totalMatches, isLoading, onOpenMobileBetTicket }: TopBarProps) => {
  return (
    <header className="mb-2 flex items-center justify-between rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-2">
      <div>
        <motion.p
          className="text-[10px] font-bold uppercase tracking-widest text-[#9ca3af] md:text-[11px]"
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          Crypto SportsBook
        </motion.p>
        <motion.h1
          className="text-[15px] font-bold uppercase tracking-[0.06em] text-[#f7c948] md:text-[18px]"
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.2, ease: 'easeOut' }}
        >
          Live Odds Board
        </motion.h1>
      </div>
      <div className="flex items-center gap-2">

        <Chip tone="neutral" className="px-3 py-1 text-[12px]">
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="h-3 w-3 border-[1.5px]" />
              Loading matches
            </>
          ) : (
            `${formatNumberWithCommas(totalMatches, 0)} Matches`
          )}
        </Chip>
        <Button
          variant="surface"
          size="sm"
          className="h-7 min-h-7 rounded-full px-2.5 normal-case tracking-normal md:hidden"
          onClick={onOpenMobileBetTicket}
        >
          🎟️
        </Button>
        <div className="hidden md:block">
          <Chip tone="gold" className="border-[#f7c948]/70 bg-[#f7c948]/25 px-3 py-1 text-[12px]">
            {isLoading ? (
              <LoadingSpinner size="sm" className="h-3 w-3 border-[1.5px]" />
            ) : (
              `${selectedCount} Selected`
            )}
          </Chip>
        </div>
      </div>
    </header>
  )
}
