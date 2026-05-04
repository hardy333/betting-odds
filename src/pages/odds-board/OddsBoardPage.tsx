import { OddsBoard } from '@/components/board/OddsBoard'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState } from '@/components/common/LoadingState'
import { useBetTicketItems } from '@/hooks/odds-board/useBetTicketItems'
import { useOddsBoard } from '@/hooks/odds-board/useOddsBoard'
import { RightBetTicketSidebar } from '@/pages/odds-board/components/RightBetTicketSidebar'
import { TopBar } from '@/pages/odds-board/components/TopBar'
import { useBetTicketUiStore } from '@/stores/useBetTicketUiStore'
import { useSelectedOddsStore } from '@/stores/useSelectedOddsStore'

export const OddsBoardPage = () => {
  const {
    allMatches,
    isLoading,
    error,
    retryInitialMatches,
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

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#0d1117] p-2 text-[#f3f4f6]">
      <TopBar
        selectedCount={selectedCount}
        totalMatches={allMatches.length}
        isLoading={isLoading}
        onOpenMobileBetTicket={() => setMobileBetTicketOpen(true)}
      />

      <main className="flex min-h-0 flex-1 items-stretch gap-0 md:gap-2">
        <div className="min-h-0 min-w-0 flex-1 self-stretch">
          {error ? (
            <ErrorState
              title="Unable to load odds board"
              message={error.message || 'An unexpected error occurred while loading match data.'}
              actionLabel="Try again"
              onAction={retryInitialMatches}
            />
          ) : isLoading ? (
            <LoadingState message="Loading odds board..." />
          ) : (
            <OddsBoard
              matches={allMatches}
              selectedKeys={selectedKeys}
              onToggle={toggleSelection}
              getFlashDirection={getFlashDirection}
              toSelectionKey={toSelectionKey}
            />
          )}
        </div>

        <div>
          <RightBetTicketSidebar
            items={betTicketItems}
            isLoading={isLoading}
            onRemoveItem={removeSelectionByKey}
            onClearAll={clearSelections}
            isMobileBetTicketOpen={isMobileBetTicketOpen}
            onMobileBetTicketOpenChange={setMobileBetTicketOpen}
          />
        </div>
      </main>
    </div>
  )
}
