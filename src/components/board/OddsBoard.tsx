import { useEffect, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

import { MatchRow } from '@/components/board/MatchRow'
import { OddsBoardHeader } from '@/components/board/OddsBoardHeader'
import { Panel } from '@/components/common/Panel'
import { appConfig } from '@/config/appConfig'
import { useMediaQuery } from '@/hooks/utils/useMediaQuery'
import { usePersistentScroll } from '@/hooks/utils/usePersistentScroll'
import type { Match, OddsDirection, OutcomeGroupId, OutcomeId } from '@/types/odds'

interface OddsBoardProps {
  matches: Match[]
  selectedKeys: Set<string>
  onToggle: (matchId: string, groupId: OutcomeGroupId, outcomeId: OutcomeId) => void
  getFlashDirection: (matchId: string, groupId: OutcomeGroupId, outcomeId: OutcomeId) => OddsDirection | null
  toSelectionKey: (matchId: string, groupId: OutcomeGroupId, outcomeId: OutcomeId) => string
}

export const OddsBoard = ({
  matches,
  selectedKeys,
  onToggle,
  getFlashDirection,
  toSelectionKey,
}: OddsBoardProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const isMobile = useMediaQuery(`(max-width: ${appConfig.viewport.mobileMaxWidthPx}px)`)

  usePersistentScroll(scrollRef)

  const virtualizer = useVirtualizer({
    count: matches.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => (isMobile ? 300 : appConfig.oddsBoard.rowHeightPx),
    overscan: appConfig.oddsBoard.overscanRows,
  })

  useEffect(() => {
    virtualizer.measure()
  }, [isMobile, virtualizer])

  return (
    <Panel as="section" tone="panel" className="flex h-full min-h-0 flex-col overflow-hidden">
      <OddsBoardHeader />
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-auto"
      >
        <div
          className="relative font-medium text-[#f3f4f6]"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const match = matches[virtualRow.index]
            if (!match) return null

            return (
              <MatchRow
                key={match.id}
                match={match}
                selectedKeys={selectedKeys}
                toSelectionKey={toSelectionKey}
                onToggle={onToggle}
                getFlashDirection={getFlashDirection}
                isLastRow={virtualRow.index === matches.length - 1}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              />
            )
          })}
        </div>
      </div>
    </Panel>
  )
}
