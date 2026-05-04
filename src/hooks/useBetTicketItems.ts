import { useMemo } from 'react'

import type { Match, OddsDirection, SelectedOddMap } from '@/types/odds'
import { formatMatchLabel } from '@/utils/formatMatchLabel'

export interface BetTicketItem {
  id: string
  matchLabel: string
  marketLabel: string
  outcomeLabel: string
  odds: number
  flashDirection: OddsDirection | null
}

interface UseBetTicketItemsParams {
  matches: Match[]
  selectedOdds: SelectedOddMap
  getFlashDirection: (matchId: string, marketId: string, outcomeId: string) => OddsDirection | null
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
        const market = match?.markets.find((item) => item.id === selected.marketId)
        const outcome = market?.outcomes.find((item) => item.id === selected.outcomeId)
        if (!match || !market || !outcome) return null

        return {
          id: key,
          matchLabel: formatMatchLabel(match.competitors),
          marketLabel: market.label,
          outcomeLabel: outcome.label,
          odds: outcome.odds,
          flashDirection: getFlashDirection(selected.matchId, selected.marketId, selected.outcomeId),
        }
      })
      .filter((item): item is BetTicketItem => !!item)
  }, [getFlashDirection, matches, selectedOdds])
}
