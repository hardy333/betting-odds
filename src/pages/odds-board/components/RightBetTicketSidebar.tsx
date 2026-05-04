import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BetTickerSidebar } from '@/pages/odds-board/components/BetTickerSidebar'

import { appConfig } from '@/config/appConfig'
import { useBetTicketUiStore } from '@/stores/useBetTicketUiStore'
import type { OddsDirection } from '@/types/odds'

interface BetTicketItem {
  id: string
  matchLabel: string
  marketLabel: string
  outcomeLabel: string
  odds: number
  flashDirection: OddsDirection | null
}

interface RightBetTicketSidebarProps {
  items: BetTicketItem[]
  onRemoveItem: (id: string) => void
  onClearAll: () => void
  isMobileBetTicketOpen: boolean
  onMobileBetTicketOpenChange: (isOpen: boolean) => void
}

export const RightBetTicketSidebar = ({
  items,
  onRemoveItem,
  onClearAll,
  isMobileBetTicketOpen,
  onMobileBetTicketOpenChange,
}: RightBetTicketSidebarProps) => {
  const { isBetTicketCollapsed, toggleBetTicketCollapsed } = useBetTicketUiStore()
  const sidebarWidth = isBetTicketCollapsed
    ? appConfig.sidebar.collapsedWidthPx
    : appConfig.sidebar.expandedWidthPx

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const handleDesktopMode = (event: MediaQueryListEvent) => {
      if (event.matches) {
        onMobileBetTicketOpenChange(false)
      }
    }
    mediaQuery.addEventListener('change', handleDesktopMode)

    return () => {
      mediaQuery.removeEventListener('change', handleDesktopMode)
    }
  }, [onMobileBetTicketOpenChange])

  return (
    <>
      <div
        className="sticky top-2 hidden overflow-hidden transition-[width] ease-out md:block"
        style={{
          width: `${sidebarWidth}px`,
          transitionDuration: `${appConfig.sidebar.widthTransitionMs}ms`,
          height: `calc(100dvh - ${appConfig.sidebar.topHeaderHeightRem}rem - (2 * ${appConfig.sidebar.gapRem}rem) - ${appConfig.sidebar.safetyOffsetRem}rem)`,
        }}
      >
        <BetTickerSidebar
          items={items}
          collapsed={isBetTicketCollapsed}
          onToggleCollapse={toggleBetTicketCollapsed}
          onRemoveItem={onRemoveItem}
          onClearAll={onClearAll}
        />
      </div>

      <AnimatePresence>
        {isMobileBetTicketOpen && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-black/55 md:hidden"
              aria-label="Close bet ticket panel backdrop"
              onClick={() => onMobileBetTicketOpenChange(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              id="mobile-bet-ticket"
              className="fixed inset-x-3 bottom-4 z-50 h-[400px] overflow-hidden rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.45)] md:hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <BetTickerSidebar
                items={items}
                collapsed={false}
                onToggleCollapse={() => onMobileBetTicketOpenChange(false)}
                onRemoveItem={onRemoveItem}
                onClearAll={onClearAll}
                floating
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
