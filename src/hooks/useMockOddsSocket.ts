import { useEffect } from 'react'

import { appConfig } from '@/config/appConfig'
import type { Match, OddsUpdate } from '@/types/odds'

const roundOdds = (value: number) => Number(Math.max(1.01, value).toFixed(2))

const randomInt = (maxExclusive: number) => Math.floor(Math.random() * maxExclusive)

interface UseMockOddsSocketProps {
  matches: Match[]
  intervalMs?: number
  updatesPerTick?: number
  onOddsUpdate: (updates: OddsUpdate[]) => void
}

export const useMockOddsSocket = ({
  matches,
  onOddsUpdate,
  intervalMs = appConfig.socket.intervalMs,
  updatesPerTick = appConfig.socket.updatesPerTick,
}: UseMockOddsSocketProps) => {
  useEffect(() => {
    if (matches.length === 0) return

    const interval = window.setInterval(() => {
      const updates: OddsUpdate[] = []

      for (let i = 0; i < updatesPerTick; i += 1) {
        const match = matches[randomInt(matches.length)]
        const market = match.markets[randomInt(match.markets.length)]
        const outcome = market.outcomes[randomInt(market.outcomes.length)]
        const delta = (Math.random() - 0.5) * 0.3

        updates.push({
          matchId: match.id,
          marketId: market.id,
          outcomeId: outcome.id,
          newOdds: roundOdds(outcome.odds + delta),
        })
      }

      onOddsUpdate(updates)
    }, intervalMs)

    return () => {
      window.clearInterval(interval)
    }
  }, [intervalMs, matches, onOddsUpdate, updatesPerTick])
}
