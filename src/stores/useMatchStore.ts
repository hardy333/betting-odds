import { create } from 'zustand'

import { appConfig } from '@/config/appConfig'
import { useChangedOddsStore } from '@/stores/useChangedOddsStore'
import type { Match, OddsDirection, OddsUpdate } from '@/types/odds'
import { toSelectionKey } from '@/utils/selectionKey'

type OutcomeLocation = { matchIndex: number; outcomeIndex: number }
type OutcomeLocationsCache = {
  signature: string
  map: Map<string, OutcomeLocation>
}

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

const getMatchesSignature = (matches: Match[]) => {
  if (matches.length === 0) return '0'
  const firstMatch = matches[0]
  const middleMatch = matches[Math.floor(matches.length / 2)]
  const lastMatch = matches[matches.length - 1]
  return `${matches.length}:${firstMatch?.id ?? ''}:${middleMatch?.id ?? ''}:${lastMatch?.id ?? ''}`
}

let outcomeLocationsCache: OutcomeLocationsCache | null = null

const getOutcomeLocationsCached = (matches: Match[]) => {
  const signature = getMatchesSignature(matches)
  if (outcomeLocationsCache?.signature === signature) {
    return outcomeLocationsCache.map
  }

  const map = buildOutcomeLocations(matches)
  outcomeLocationsCache = { signature, map }
  return map
}

interface MatchStore {
  matches: Match[]
  setMatches: (matches: Match[]) => void
  clearMatches: () => void
  applyOddsUpdates: (updates: OddsUpdate[]) => void
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  matches: [],
  setMatches: (matches) => {
    set({ matches })
  },
  clearMatches: () => {
    set({ matches: [] })
  },
  applyOddsUpdates: (updates) => {
    if (updates.length === 0) return

    const previousMatches = get().matches
    if (previousMatches.length === 0) return

    const outcomeLocations = getOutcomeLocationsCached(previousMatches)
    const next = [...previousMatches]
    const touchedMatches = new Set<number>()
    const changedUpdates: Array<{ key: string; direction: OddsDirection }> = []

    updates.forEach((update) => {
      const key = toSelectionKey(update.matchId, update.groupId, update.outcomeId)
      const location = outcomeLocations.get(key)
      if (!location) return

      const { matchIndex, outcomeIndex } = location
      const currentMatch = touchedMatches.has(matchIndex) ? next[matchIndex] : previousMatches[matchIndex]
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

    if (changedUpdates.length === 0) return

    const now = Date.now()
    useChangedOddsStore.getState().upsertChangedOdds(changedUpdates, now, appConfig.flash.durationMs)
    set({ matches: next })
  },
}))
