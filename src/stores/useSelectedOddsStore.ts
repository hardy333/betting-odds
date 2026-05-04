import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { storageKeys } from '@/constants/storage'
import type { OutcomeGroupId, OutcomeId, SelectedOddMap } from '@/types/odds'
import { toSelectionKey } from '@/utils/selectionKey'

interface SelectedOddsStore {
  selectedOdds: SelectedOddMap
  toggleSelection: (matchId: string, groupId: OutcomeGroupId, outcomeId: OutcomeId) => void
  removeSelectionByKey: (key: string) => void
  clearSelections: () => void
}

export const useSelectedOddsStore = create<SelectedOddsStore>()(
  persist(
    (set) => ({
      selectedOdds: {},
      toggleSelection: (matchId, groupId, outcomeId) => {
        set((state) => {
          const key = toSelectionKey(matchId, groupId, outcomeId)
          const next = { ...state.selectedOdds }

          if (next[key]) {
            delete next[key]
          } else {
            // Keep one active outcome per match+groupId (mutually exclusive group selection).
            Object.entries(next).forEach(([selectedKey, selectedValue]) => {
              if (selectedValue.matchId === matchId && selectedValue.groupId === groupId) {
                delete next[selectedKey]
              }
            })
            next[key] = { matchId, groupId, outcomeId }
          }

          return { selectedOdds: next }
        })
      },
      removeSelectionByKey: (key) => {
        set((state) => {
          if (!state.selectedOdds[key]) return state
          const next = { ...state.selectedOdds }
          delete next[key]
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
