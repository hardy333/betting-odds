import { useMemo } from 'react'

import type { Match, OddsDirection, OutcomeGroupId, OutcomeId, SelectedOddMap } from '@/types/odds'
import { formatMatchLabel } from '@/utils/formatMatchLabel'

export interface BetTicketItem {
  id: string
  matchLabel: string
  marketLabel: string
  outcomeLabel: OutcomeId
  odds: number
  flashDirection: OddsDirection | null
}

interface UseBetTicketItemsParams {
  matches: Match[]
  selectedOdds: SelectedOddMap
  getFlashDirection: (matchId: string, groupId: OutcomeGroupId, outcomeId: OutcomeId) => OddsDirection | null
}

const OUTCOME_GROUP_LABELS: Record<OutcomeGroupId, string> = {
  STANDARD: 'Standard',
  DOUBLE_CHANCE: 'Double Chance',
  TOTAL: 'Total 2.5',
}

export const useBetTicketItems = ({
  matches,
  selectedOdds,
  getFlashDirection,
}: UseBetTicketItemsParams) => {
  return useMemo<BetTicketItem[]>(() => {
    const selectedEntries = Object.entries(selectedOdds)

    return selectedEntries
      .map(([key, selected]) => {
        const match = matches.find((item) => item.id === selected.matchId)
        const outcome = match?.outcomes.find((item) => item.outcomeId === selected.outcomeId)
        if (!match || !outcome) return null

        return {
          id: key,
          matchLabel: formatMatchLabel(match.competitors),
          marketLabel: OUTCOME_GROUP_LABELS[selected.groupId] ?? selected.groupId,
          outcomeLabel: outcome.outcomeId,
          odds: outcome.odds,
          flashDirection: getFlashDirection(selected.matchId, selected.groupId, selected.outcomeId),
        }
      })
      .filter((item): item is BetTicketItem => !!item)
  }, [getFlashDirection, matches, selectedOdds])
}
