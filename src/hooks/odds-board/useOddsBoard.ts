import { useCallback, useEffect, useMemo } from 'react'

import { appConfig } from '@/config/appConfig'
import { useInitialMatchesQuery } from '@/hooks/api/useInitialMatchesQuery'
import { useMockOddsSocket } from '@/hooks/api/useMockOddsSocket'
import { useChangedOddsStore } from '@/stores/useChangedOddsStore'
import { useMatchStore } from '@/stores/useMatchStore'
import { useSelectedOddsStore } from '@/stores/useSelectedOddsStore'
import type { OddsDirection, OddsUpdate, OutcomeGroupId, OutcomeId } from '@/types/odds'
import { toSelectionKey } from '@/utils/selectionKey'

interface UseOddsBoardOptions {
  totalMatches?: number
  seed?: number
}

export const useOddsBoard = ({
  totalMatches = appConfig.oddsBoard.defaultTotalMatches,
  seed = appConfig.oddsBoard.defaultSeed,
}: UseOddsBoardOptions = {}) => {
  const allMatches = useMatchStore((state) => state.matches)
  const setMatches = useMatchStore((state) => state.setMatches)
  const clearMatches = useMatchStore((state) => state.clearMatches)
  const applyStoreOddsUpdates = useMatchStore((state) => state.applyOddsUpdates)

  const matchesQuery = useInitialMatchesQuery({ totalMatches, seed })
  const { data: initialMatches, error: queryError, isLoading: isInitialLoading, isFetching, refetch } = matchesQuery

  useEffect(() => {
    if (!initialMatches) return
    setMatches(initialMatches)
  }, [initialMatches, setMatches])

  const isLoading = isInitialLoading || isFetching
  const error = queryError ? new Error('Something went wrong. Please try again.') : null

  const selectedOdds = useSelectedOddsStore((state) => state.selectedOdds)
  const toggleSelection = useSelectedOddsStore((state) => state.toggleSelection)

  const applyOddsUpdates = useCallback((updates: OddsUpdate[]) => {
    if (updates.length === 0) return
    applyStoreOddsUpdates(updates)
  }, [applyStoreOddsUpdates])

  useMockOddsSocket({
    matches: allMatches,
    onOddsUpdate: applyOddsUpdates,
  })

  const selectedEntries = useMemo(() => Object.entries(selectedOdds), [selectedOdds])

  const getFlashDirection = useCallback(
    (matchId: string, groupId: OutcomeGroupId, outcomeId: OutcomeId): OddsDirection | null => {
      const key = toSelectionKey(matchId, groupId, outcomeId)
      const flash = useChangedOddsStore.getState().changedOddsMap[key]
      if (!flash) return null
      if (flash.expiresAt <= Date.now()) return null
      return flash.direction
    },
    [],
  )

  const selectedKeys = useMemo(() => new Set(selectedEntries.map(([key]) => key)), [selectedEntries])
  const retryInitialMatches = useCallback(() => {
    clearMatches()
    void refetch()
  }, [clearMatches, refetch])

  return {
    allMatches,
    isLoading,
    error,
    retryInitialMatches,
    selectedOdds,
    selectedKeys,
    selectedCount: selectedEntries.length,
    toggleSelection,
    getFlashDirection,
    toSelectionKey,
  }
}
