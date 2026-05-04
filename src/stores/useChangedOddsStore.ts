import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { storageKeys } from '@/constants/storage'
import type { ChangedOddsMap, OddsDirection } from '@/types/odds'

interface ChangedOddUpdate {
  key: string
  direction: OddsDirection
}

interface ChangedOddsStore {
  changedOddsMap: ChangedOddsMap
  upsertChangedOdds: (updates: ChangedOddUpdate[], now: number, durationMs: number) => void
}

export const useChangedOddsStore = create<ChangedOddsStore>()(
  persist(
    (set) => ({
      changedOddsMap: {},
      upsertChangedOdds: (updates, now, durationMs) => {
        if (updates.length === 0) return

        set((state) => {
          const cleaned: ChangedOddsMap = {}

          Object.entries(state.changedOddsMap).forEach(([key, value]) => {
            if (value.expiresAt > now) {
              cleaned[key] = value
            }
          })

          updates.forEach((update) => {
            cleaned[update.key] = {
              direction: update.direction,
              expiresAt: now + durationMs,
            }
          })

          return { changedOddsMap: cleaned }
        })
      },
    }),
    {
      name: storageKeys.changedOddsMap,
    },
  ),
)
