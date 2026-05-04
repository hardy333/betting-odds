import { useEffect } from 'react'

import { appConfig } from '@/config/appConfig'
import type { Match, OddsUpdate } from '@/types/odds'

const roundOdds = (value: number) => Number(Math.max(1.01, value).toFixed(2))

const randomInt = (maxExclusive: number) => Math.floor(Math.random() * maxExclusive)
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

interface UseMockOddsSocketProps {
  matchIds: string[]
  matchesById: Record<string, Match>
  intervalMs?: number
  updatesPerTick?: number
  onOddsUpdate: (updates: OddsUpdate[]) => void
}

export const useMockOddsSocket = ({
  matchIds,
  matchesById,
  onOddsUpdate,
  intervalMs = appConfig.socket.intervalMs,
  updatesPerTick = appConfig.socket.updatesPerTick,
}: UseMockOddsSocketProps) => {
  useEffect(() => {
    if (matchIds.length === 0) return

    const interval = window.setInterval(() => {
      const updates: OddsUpdate[] = []

      for (let i = 0; i < updatesPerTick; i += 1) {
        const matchId = matchIds[randomInt(matchIds.length)]
        const match = matchesById[matchId]
        if (!match) continue
        const outcome = match.outcomes[randomInt(match.outcomes.length)]

        if (outcome.groupId === 'TOTAL') {
          const totalOutcomes = match.outcomes.filter((item) => item.groupId === 'TOTAL')
          const overOutcome = totalOutcomes.find((item) => item.outcomeId === 'O2.5')
          const underOutcome = totalOutcomes.find((item) => item.outcomeId === 'U2.5')

          if (overOutcome && underOutcome) {
            const impliedOver = 1 / overOutcome.odds
            const impliedUnder = 1 / underOutcome.odds
            const totalImplied = impliedOver + impliedUnder
            const fairOverProbability = clamp(impliedOver / totalImplied, 0.05, 0.95)

            const probabilityDelta = (Math.random() - 0.5) * 0.04
            const nextOverProbability = clamp(fairOverProbability + probabilityDelta, 0.05, 0.95)
            const nextUnderProbability = 1 - nextOverProbability
            const nextOverround = clamp(totalImplied + (Math.random() - 0.5) * 0.015, 1.02, 1.12)

            updates.push(
              {
                matchId: match.id,
                groupId: overOutcome.groupId,
                outcomeId: overOutcome.outcomeId,
                newOdds: roundOdds(1 / (nextOverProbability * nextOverround)),
              },
              {
                matchId: match.id,
                groupId: underOutcome.groupId,
                outcomeId: underOutcome.outcomeId,
                newOdds: roundOdds(1 / (nextUnderProbability * nextOverround)),
              },
            )
            continue
          }
        }

        const delta = (Math.random() - 0.5) * 0.3

        updates.push({
          matchId: match.id,
          groupId: outcome.groupId,
          outcomeId: outcome.outcomeId,
          newOdds: roundOdds(outcome.odds + delta),
        })
      }

      onOddsUpdate(updates)
    }, intervalMs)

    return () => {
      window.clearInterval(interval)
    }
  }, [intervalMs, matchIds, matchesById, onOddsUpdate, updatesPerTick])
}
