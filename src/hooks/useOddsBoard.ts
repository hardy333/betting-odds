import { useCallback, useEffect, useMemo } from 'react'

import { appConfig } from '@/config/appConfig'
import { useMockOddsSocket } from '@/hooks/useMockOddsSocket'
import { useChangedOddsStore } from '@/stores/useChangedOddsStore'
import { useMatchStore } from '@/stores/useMatchStore'
import { useSelectedOddsStore } from '@/stores/useSelectedOddsStore'
import type { OddsDirection, OddsUpdate, OutcomeGroupId, OutcomeId } from '@/types/odds'
import { generateMatches } from '@/utils/generateMatches'
import { toSelectionKey } from '@/utils/selectionKey'

interface UseOddsBoardOptions {
  totalMatches?: number
  seed?: number
}

export const useOddsBoard = ({
  totalMatches = appConfig.oddsBoard.defaultTotalMatches,
  seed = appConfig.oddsBoard.defaultMatchGenerationSeed,
}: UseOddsBoardOptions = {}) => {
  const changedOddsMap = useChangedOddsStore((state) => state.changedOddsMap)
  const upsertChangedOdds = useChangedOddsStore((state) => state.upsertChangedOdds)
  const matchIds = useMatchStore((state) => state.matchIds)
  const matches = useMatchStore((state) => state.matches)
  const initializeMatches = useMatchStore((state) => state.initializeMatches)
  const bulkUpdate = useMatchStore((state) => state.bulkUpdate)

  const selectedOdds = useSelectedOddsStore((state) => state.selectedOdds)
  const toggleSelection = useSelectedOddsStore((state) => state.toggleSelection)

  useEffect(() => {
    initializeMatches(generateMatches(totalMatches, seed))
  }, [initializeMatches, seed, totalMatches])

  const applyOddsUpdates = useCallback((updates: OddsUpdate[]) => {
    if (updates.length === 0) return

    const now = Date.now()
    const changedUpdates = bulkUpdate(updates)
    if (changedUpdates.length > 0) {
      upsertChangedOdds(changedUpdates, now, appConfig.flash.durationMs)
    }
  }, [bulkUpdate, upsertChangedOdds])

  useMockOddsSocket({
    matchIds,
    matchesById: matches,
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
    matchIds,
    matchesById: matches,
    selectedOdds,
    selectedKeys,
    selectedCount: selectedEntries.length,
    selectedEntries,
    toggleSelection,
    getFlashDirection,
    toSelectionKey,
  }
}
