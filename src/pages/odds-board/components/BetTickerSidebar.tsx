import { ChevronRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { StatRow } from '@/components/common/StatRow'
import { Panel } from '@/components/common/Panel'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import type { OddsDirection } from '@/types/odds'
import { formatNumberWithCommas } from '@/utils/formatNumber'

const ticketListVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.03,
    },
  },
} satisfies Variants

const ticketItemVariants = {
  initial: { opacity: 0, y: 4 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.14, ease: 'easeIn' },
  },
} satisfies Variants

interface BetTickerSidebarItem {
  id: string
  matchLabel: string
  marketLabel: string
  outcomeLabel: string
  odds: number
  flashDirection: OddsDirection | null
}

interface BetTickerSidebarProps {
  items: BetTickerSidebarItem[]
  collapsed: boolean
  onToggleCollapse: () => void
  onRemoveItem: (id: string) => void
  onClearAll: () => void
  floating?: boolean
}

export const BetTickerSidebar = ({
  items,
  collapsed,
  onToggleCollapse,
  onRemoveItem,
  onClearAll,
  floating = false,
}: BetTickerSidebarProps) => {
  const totalOdds = items.reduce((acc, item) => acc * item.odds, 1)
  const isCollapsed = floating ? false : collapsed

  return (
    <Panel as="aside" tone="panel" className="flex h-full w-full flex-col">
      <div
        className={`flex items-center gap-2 border-b border-[#30363d] ${
          isCollapsed ? 'justify-center p-2' : 'justify-between p-3'
        }`}
      >
        {floating ? (
          <>
            <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-[#9ca3af]">Bet Ticket</h2>
            <Button
              onClick={onToggleCollapse}
              variant="surface"
              size="sm"
              className="h-7 min-h-7 min-w-7 p-0!"
              aria-label="Close bet ticket panel"
              title="Close bet ticket"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={onToggleCollapse}
              variant="surface"
              size="sm"
              className="p-1! normal-case leading-none tracking-normal"
              aria-label={isCollapsed ? 'Expand bet ticket panel' : 'Collapse bet ticket panel'}
              title={isCollapsed ? 'Expand bet ticket' : 'Collapse bet ticket'}
            >
              <ChevronRight
                className={`h-3.5 w-3.5 transition-transform duration-300 ease-in-out ${
                  isCollapsed ? 'rotate-180' : 'rotate-0'
                }`}
                aria-hidden
              />
            </Button>
            {!isCollapsed && (
              <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-[#9ca3af]">Bet Ticket</h2>
            )}
          </>
        )}
      </div>
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          <motion.div
            key="collapsed"
            className="flex flex-1 items-end justify-center pb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <Chip tone="gold" className="normal-case tracking-normal">
              {items.length}
            </Chip>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            className="flex min-h-0 flex-1 flex-col"
            initial={{ opacity: 0, x: 2 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -2 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div
              className="min-h-0 flex-1 space-y-2 overflow-x-hidden overflow-y-scroll p-3 pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"
              style={{ scrollbarGutter: 'stable' }}
            >
              {items.length === 0 ? (
                <Panel tone="dashed" as="p" className="p-3 text-[13px] text-[#9ca3af]">
                  No bets yet.
                </Panel>
              ) : (
                <motion.div className="space-y-2" variants={ticketListVariants} initial="initial" animate="animate">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        variants={ticketItemVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <Panel
                          as="article"
                          tone="card"
                          className="space-y-1 border p-2 transition-colors duration-700 ease-out"
                          style={{
                            borderColor:
                              item.flashDirection === 'up'
                                ? '#00c853'
                                : item.flashDirection === 'down'
                                  ? '#ef4444'
                                  : '#30363d',
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[12px] font-semibold uppercase text-[#f3f4f6]">
                                {item.matchLabel}
                              </p>
                              <p className="text-[11px] text-[#9ca3af]">
                                {item.marketLabel} - {item.outcomeLabel}
                              </p>
                            </div>
                            <Button
                              variant="surface"
                              size="sm"
                              className="h-6 min-h-6 min-w-6 p-0!"
                              aria-label="Remove bet"
                              title="Remove bet"
                              onClick={() => onRemoveItem(item.id)}
                            >
                              <X className="h-3.5 w-3.5" aria-hidden />
                            </Button>
                          </div>
                          <p
                            className="font-odds mt-1 text-[13px] font-semibold transition-colors duration-700 ease-out"
                            style={{
                              color:
                                item.flashDirection === 'up'
                                  ? '#00c853'
                                  : item.flashDirection === 'down'
                                    ? '#ef4444'
                                    : '#f3f4f6',
                            }}
                          >
                            {item.odds.toFixed(2)}
                          </p>
                        </Panel>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
            <footer className="space-y-2 border-t border-[#30363d] p-3">
              <StatRow label="Selections" value={items.length} />
              <StatRow
                label="Total Odds"
                value={items.length ? formatNumberWithCommas(totalOdds) : formatNumberWithCommas(0)}
                valueClassName="font-odds font-semibold text-[#f7c948]"
              />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="md" className="flex-1">
                  Bet Now
                </Button>
                <Button
                  variant="surface"
                  size="md"
                  className="w-9 min-w-9 px-0!"
                  onClick={onClearAll}
                  disabled={items.length === 0}
                  aria-label="Clear all bets"
                  title="Clear all bets"
                >
                  🗑️
                </Button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  )
}
