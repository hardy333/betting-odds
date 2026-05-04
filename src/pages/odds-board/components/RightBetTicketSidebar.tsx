import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BetTickerSidebar } from '@/pages/odds-board/components/BetTickerSidebar'
import { BetTickerSidebarLoading } from '@/pages/odds-board/components/BetTickerSidebarLoading'

import { appConfig } from '@/config/appConfig'
import type { BetTicketItem } from '@/hooks/odds-board/useBetTicketItems'
import { useBetTicketUiStore } from '@/stores/useBetTicketUiStore'

interface RightBetTicketSidebarProps {
  items: BetTicketItem[]
  isLoading?: boolean
  onRemoveItem: (id: string) => void
  onClearAll: () => void
  isMobileBetTicketOpen: boolean
  onMobileBetTicketOpenChange: (isOpen: boolean) => void
}

export const RightBetTicketSidebar = ({
  items,
  isLoading = false,
  onRemoveItem,
  onClearAll,
  isMobileBetTicketOpen,
  onMobileBetTicketOpenChange,
}: RightBetTicketSidebarProps) => {
  const isBetTicketCollapsed = useBetTicketUiStore((state) => state.isBetTicketCollapsed)
  const toggleBetTicketCollapsed = useBetTicketUiStore((state) => state.toggleBetTicketCollapsed)
  const desktopMinWidthPx = appConfig.viewport.mobileMaxWidthPx + 1
  const sidebarWidth = isBetTicketCollapsed
    ? appConfig.sidebar.collapsedWidthPx
    : appConfig.sidebar.expandedWidthPx

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${desktopMinWidthPx}px)`)
    const handleDesktopMode = (event: MediaQueryListEvent) => {
      if (event.matches) {
        onMobileBetTicketOpenChange(false)
      }
    }
    mediaQuery.addEventListener('change', handleDesktopMode)

    return () => {
      mediaQuery.removeEventListener('change', handleDesktopMode)
    }
  }, [desktopMinWidthPx, onMobileBetTicketOpenChange])

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
        {isLoading ? (
          <BetTickerSidebarLoading />
        ) : (
          <BetTickerSidebar
            items={items}
            collapsed={isBetTicketCollapsed}
            onToggleCollapse={toggleBetTicketCollapsed}
            onRemoveItem={onRemoveItem}
            onClearAll={onClearAll}
          />
        )}
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
              {isLoading ? (
                <BetTickerSidebarLoading floating />
              ) : (
                <BetTickerSidebar
                  items={items}
                  collapsed={false}
                  onToggleCollapse={() => onMobileBetTicketOpenChange(false)}
                  onRemoveItem={onRemoveItem}
                  onClearAll={onClearAll}
                  floating
                />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
