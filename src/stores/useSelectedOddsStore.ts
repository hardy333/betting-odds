import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { storageKeys } from '@/constants/storage'
import type { SelectedOddMap } from '@/types/odds'
import { toSelectionKey } from '@/utils/selectionKey'

interface SelectedOddsStore {
  selectedOdds: SelectedOddMap
  toggleSelection: (matchId: string, marketId: string, outcomeId: string) => void
  clearSelections: () => void
}

export const useSelectedOddsStore = create<SelectedOddsStore>()(
  persist(
    (set) => ({
      selectedOdds: {},
      toggleSelection: (matchId, marketId, outcomeId) => {
        set((state) => {
          const key = toSelectionKey(matchId, marketId, outcomeId)
          const next = { ...state.selectedOdds }

          if (next[key]) {
            delete next[key]
          } else {
            next[key] = { matchId, marketId, outcomeId }
          }

          return { selectedOdds: next }
        })
      },
      clearSelections: () => {
        set({ selectedOdds: {} })
      },
    }),
    {
      name: storageKeys.selectedOdds,
    },
  ),
)
