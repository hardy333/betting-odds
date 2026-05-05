import { useCallback } from 'react'

import { OddsBoard } from '@/components/board/OddsBoard'
import { useBetTicketItems } from '@/hooks/useBetTicketItems'
import { useOddsBoard } from '@/hooks/useOddsBoard'
import { RightBetTicketSidebar } from '@/pages/odds-board/components/RightBetTicketSidebar'
import { TopBar } from '@/pages/odds-board/components/TopBar'
import { useBetTicketUiStore } from '@/stores/useBetTicketUiStore'
import { useSelectedOddsStore } from '@/stores/useSelectedOddsStore'

export const OddsBoardPage = () => {
  const {
    allMatches,
    selectedOdds,
    selectedKeys,
    selectedCount,
    toggleSelection,
    getFlashDirection,
    toSelectionKey,
  } = useOddsBoard()
  const clearSelections = useSelectedOddsStore((state) => state.clearSelections)
  const removeSelectionByKey = useSelectedOddsStore((state) => state.removeSelectionByKey)
  const isMobileBetTicketOpen = useBetTicketUiStore((state) => state.isMobileBetTicketOpen)
  const setMobileBetTicketOpen = useBetTicketUiStore((state) => state.setMobileBetTicketOpen)

  const betTicketItems = useBetTicketItems({
    matches: allMatches,
    selectedOdds,
    getFlashDirection,
  })

  const removeSelectionById = useCallback(
    (id: string) => {
      removeSelectionByKey(id)
    },
    [removeSelectionByKey],
  )

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#0d1117] p-2 text-[#f3f4f6]">
      <TopBar selectedCount={selectedCount} onOpenMobileBetTicket={() => setMobileBetTicketOpen(true)} />

      <main className="flex min-h-0 flex-1 items-stretch gap-0 md:gap-2">
        <div className="min-h-0 min-w-0 flex-1 self-stretch">
          <OddsBoard
            matches={allMatches}
            selectedKeys={selectedKeys}
            onToggle={toggleSelection}
            getFlashDirection={getFlashDirection}
            toSelectionKey={toSelectionKey}
          />
        </div>

        <div>
          <RightBetTicketSidebar
            items={betTicketItems}
            onRemoveItem={removeSelectionById}
            onClearAll={clearSelections}
            isMobileBetTicketOpen={isMobileBetTicketOpen}
            onMobileBetTicketOpenChange={setMobileBetTicketOpen}
          />
        </div>
      </main>
    </div>
  )
}
