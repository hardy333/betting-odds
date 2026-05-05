import { useCallback, useMemo, useState } from 'react'

import { appConfig } from '@/config/appConfig'
import { useMockOddsSocket } from '@/hooks/useMockOddsSocket'
import { useChangedOddsStore } from '@/stores/useChangedOddsStore'
import { useSelectedOddsStore } from '@/stores/useSelectedOddsStore'
import type { Match, OddsDirection, OddsUpdate, OutcomeGroupId, OutcomeId } from '@/types/odds'
import { generateMatches } from '@/utils/generateMatches'
import { toSelectionKey } from '@/utils/selectionKey'

type OutcomeLocation = { matchIndex: number; outcomeIndex: number }

const buildOutcomeLocations = (matches: Match[]) => {
  const map = new Map<string, OutcomeLocation>()
  matches.forEach((match, matchIndex) => {
    match.outcomes.forEach((outcome, outcomeIndex) => {
      map.set(toSelectionKey(match.id, outcome.groupId, outcome.outcomeId), {
        matchIndex,
        outcomeIndex,
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
  const [outcomeLocations] = useState(() => buildOutcomeLocations(allMatches))

  const applyOddsUpdates = useCallback((updates: OddsUpdate[]) => {
    if (updates.length === 0) return

    const now = Date.now()
    setAllMatches((previous) => {
      const next = [...previous]
      const touchedMatches = new Set<number>()
      const changedUpdates: Array<{ key: string; direction: OddsDirection }> = []

      updates.forEach((update) => {
        const key = toSelectionKey(update.matchId, update.groupId, update.outcomeId)
        const location = outcomeLocations.get(key)
        if (!location) return

        const { matchIndex, outcomeIndex } = location
        const currentMatch = touchedMatches.has(matchIndex) ? next[matchIndex] : previous[matchIndex]
        if (!currentMatch) return

        const current = currentMatch.outcomes[outcomeIndex]
        if (!current) return

        if (current.odds === update.newOdds) return

        if (!touchedMatches.has(matchIndex)) {
          next[matchIndex] = { ...currentMatch, outcomes: [...currentMatch.outcomes] }
          touchedMatches.add(matchIndex)
        }

        const nextMatch = next[matchIndex]
        if (!nextMatch) return

        nextMatch.outcomes[outcomeIndex] = {
          ...current,
          odds: update.newOdds,
        }

        changedUpdates.push({
          key,
          direction: update.newOdds > current.odds ? 'up' : 'down',
        })
      })

      if (changedUpdates.length > 0) {
        upsertChangedOdds(changedUpdates, now, appConfig.flash.durationMs)
      }

      return changedUpdates.length > 0 ? next : previous
    })
  }, [outcomeLocations, upsertChangedOdds])

  useMockOddsSocket({
    matches: allMatches,
    onOddsUpdate: applyOddsUpdates,
  })

  const selectedEntries = useMemo(() => Object.entries(selectedOdds), [selectedOdds])

  const getFlashDirection = useCallback(
    (matchId: string, groupId: OutcomeGroupId, outcomeId: OutcomeId): OddsDirection | null => {
      const key = toSelectionKey(matchId, groupId, outcomeId)
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
