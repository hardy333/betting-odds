import { create } from 'zustand'

import type { Match, OddsDirection, OddsUpdate } from '@/types/odds'
import { toSelectionKey } from '@/utils/selectionKey'

type MatchMap = Record<string, Match>

interface ChangedOddUpdate {
  key: string
  direction: OddsDirection
}

interface MatchStore {
  matches: MatchMap
  matchIds: string[]
  initializeMatches: (matches: Match[]) => void
  updateMatch: (update: Partial<Match> & { id: string }) => void
  bulkUpdate: (updates: OddsUpdate[]) => ChangedOddUpdate[]
}

export const useMatchStore = create<MatchStore>()((set) => ({
  matches: {},
  matchIds: [],
  initializeMatches: (matches) => {
    const nextMatches: MatchMap = {}
    const nextMatchIds: string[] = []

    matches.forEach((match) => {
      nextMatches[match.id] = match
      nextMatchIds.push(match.id)
    })

    set({
      matches: nextMatches,
      matchIds: nextMatchIds,
    })
  },
  updateMatch: (update) =>
    set((state) => ({
      matches: {
        ...state.matches,
        [update.id]: { ...state.matches[update.id], ...update } as Match,
      },
    })),
  bulkUpdate: (updates) => {
    if (updates.length === 0) return []

    const changed: ChangedOddUpdate[] = []

    set((state) => {
      const nextMatches = { ...state.matches }

      updates.forEach((update) => {
        const currentMatch = nextMatches[update.matchId]
        if (!currentMatch) return

        const outcomeIndex = currentMatch.outcomes.findIndex(
          (outcome) => outcome.groupId === update.groupId && outcome.outcomeId === update.outcomeId,
        )
        if (outcomeIndex === -1) return

        const currentOutcome = currentMatch.outcomes[outcomeIndex]
        if (currentOutcome.odds === update.newOdds) return

        const nextOutcomes = [...currentMatch.outcomes]
        nextOutcomes[outcomeIndex] = {
          ...currentOutcome,
          odds: update.newOdds,
        }

        nextMatches[update.matchId] = {
          ...currentMatch,
          outcomes: nextOutcomes,
        }

        changed.push({
          key: toSelectionKey(update.matchId, update.groupId, update.outcomeId),
          direction: update.newOdds > currentOutcome.odds ? 'up' : 'down',
        })
      })

      return { matches: nextMatches }
    })

    return changed
  },
}))
