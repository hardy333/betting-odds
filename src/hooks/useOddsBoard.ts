import { useCallback, useMemo, useRef, useState } from 'react'

import { appConfig } from '@/config/appConfig'
import { useMockOddsSocket } from '@/hooks/useMockOddsSocket'
import { useChangedOddsStore } from '@/stores/useChangedOddsStore'
import { useSelectedOddsStore } from '@/stores/useSelectedOddsStore'
import type { Match, OddsDirection, OddsUpdate } from '@/types/odds'
import { generateMatches } from '@/utils/generateMatches'
import { toSelectionKey } from '@/utils/selectionKey'

type OutcomeLocation = { matchIndex: number; marketIndex: number; outcomeIndex: number }

const buildOutcomeLocations = (matches: Match[]) => {
  const map = new Map<string, OutcomeLocation>()
  matches.forEach((match, matchIndex) => {
    match.markets.forEach((market, marketIndex) => {
      market.outcomes.forEach((outcome, outcomeIndex) => {
        map.set(toSelectionKey(match.id, market.id, outcome.id), {
          matchIndex,
          marketIndex,
          outcomeIndex,
        })
      })
    })
  })
  return map
}

interface UseOddsBoardOptions {
  totalMatches?: number
  seed?: number
}

export const useOddsBoard = ({
  totalMatches = appConfig.oddsBoard.defaultTotalMatches,
  seed = appConfig.oddsBoard.defaultSeed,
}: UseOddsBoardOptions = {}) => {
  const [allMatches, setAllMatches] = useState<Match[]>(() => generateMatches(totalMatches, seed))
  const changedOddsMap = useChangedOddsStore((state) => state.changedOddsMap)
  const upsertChangedOdds = useChangedOddsStore((state) => state.upsertChangedOdds)

  const selectedOdds = useSelectedOddsStore((state) => state.selectedOdds)
  const toggleSelection = useSelectedOddsStore((state) => state.toggleSelection)
  const outcomeLocationsRef = useRef<Map<string, OutcomeLocation> | null>(null)

  if (outcomeLocationsRef.current == null) {
    outcomeLocationsRef.current = buildOutcomeLocations(allMatches)
  }

  const applyOddsUpdates = useCallback((updates: OddsUpdate[]) => {
    if (updates.length === 0) return

    const now = Date.now()

    setAllMatches((previous) => {
      const next = [...previous]
      const touchedMatches = new Set<number>()
      const touchedMarkets = new Set<string>()
      const nextChangedOdds: Array<{ key: string; direction: OddsDirection }> = []
      const locations = outcomeLocationsRef.current

      if (!locations) return previous

      updates.forEach((update) => {
        const key = toSelectionKey(update.matchId, update.marketId, update.outcomeId)
        const location = locations.get(key)
        if (!location) return

        const { matchIndex, marketIndex, outcomeIndex } = location

        if (!touchedMatches.has(matchIndex)) {
          next[matchIndex] = { ...next[matchIndex], markets: [...next[matchIndex].markets] }
          touchedMatches.add(matchIndex)
        }

        const marketKey = `${matchIndex}:${marketIndex}`
        if (!touchedMarkets.has(marketKey)) {
          next[matchIndex].markets[marketIndex] = {
            ...next[matchIndex].markets[marketIndex],
            outcomes: [...next[matchIndex].markets[marketIndex].outcomes],
          }
          touchedMarkets.add(marketKey)
        }

        const current = next[matchIndex].markets[marketIndex].outcomes[outcomeIndex]
        if (current.odds === update.newOdds) return

        next[matchIndex].markets[marketIndex].outcomes[outcomeIndex] = {
          ...current,
          odds: update.newOdds,
        }

        nextChangedOdds.push({
          key,
          direction: update.newOdds > current.odds ? 'up' : 'down',
        })
      })

      if (nextChangedOdds.length > 0) {
        upsertChangedOdds(nextChangedOdds, now, appConfig.flash.durationMs)
      }

      return next
    })
  }, [upsertChangedOdds])

  useMockOddsSocket({
    matches: allMatches,
    onOddsUpdate: applyOddsUpdates,
  })

  const selectedEntries = useMemo(() => Object.entries(selectedOdds), [selectedOdds])

  const getFlashDirection = useCallback(
    (matchId: string, marketId: string, outcomeId: string): OddsDirection | null => {
      const key = toSelectionKey(matchId, marketId, outcomeId)
      const flash = changedOddsMap[key]
      if (!flash) return null
      if (flash.expiresAt <= Date.now()) return null
      return flash.direction
    },
    [changedOddsMap],
  )

  const selectedKeys = useMemo(() => new Set(selectedEntries.map(([key]) => key)), [selectedEntries])

  return {
    allMatches,
    selectedOdds,
    selectedKeys,
    selectedCount: selectedEntries.length,
    selectedEntries,
    toggleSelection,
    getFlashDirection,
    toSelectionKey,
  }
}
