import { useEffect, useRef } from 'react'

import { appConfig } from '@/config/appConfig'
import type { Match, OddsUpdate } from '@/types/odds'

const roundOdds = (value: number) => Number(Math.max(1.01, value).toFixed(2))

const randomInt = (maxExclusive: number) => Math.floor(Math.random() * maxExclusive)
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

interface UseMockOddsSocketProps {
  matches: Match[]
  intervalMs?: number
  updatesPerTick?: number
  onOddsUpdate: (updates: OddsUpdate[]) => void
}

type TotalOutcomeIndices = {
  overIndex: number
  underIndex: number
}

const buildTotalOutcomeIndex = (matches: Match[]) => {
  const map = new Map<string, TotalOutcomeIndices>()

  matches.forEach((match) => {
    let overIndex = -1
    let underIndex = -1

    match.outcomes.forEach((outcome, index) => {
      if (outcome.groupId !== 'TOTAL') return
      if (outcome.outcomeId === 'O2.5') overIndex = index
      if (outcome.outcomeId === 'U2.5') underIndex = index
    })

    if (overIndex !== -1 && underIndex !== -1) {
      map.set(match.id, { overIndex, underIndex })
    }
  })

  return map
}

export const useMockOddsSocket = ({
  matches,
  onOddsUpdate,
  intervalMs = appConfig.socket.intervalMs,
  updatesPerTick = appConfig.socket.updatesPerTick,
}: UseMockOddsSocketProps) => {
  const matchesRef = useRef(matches)
  const onOddsUpdateRef = useRef(onOddsUpdate)
  const totalOutcomeIndexRef = useRef<Map<string, TotalOutcomeIndices>>(buildTotalOutcomeIndex(matches))
  const datasetSignatureRef = useRef(`${matches.length}:${matches[0]?.id ?? ''}:${matches[matches.length - 1]?.id ?? ''}`)

  useEffect(() => {
    matchesRef.current = matches
    onOddsUpdateRef.current = onOddsUpdate

    const nextSignature = `${matches.length}:${matches[0]?.id ?? ''}:${matches[matches.length - 1]?.id ?? ''}`
    if (datasetSignatureRef.current !== nextSignature) {
      totalOutcomeIndexRef.current = buildTotalOutcomeIndex(matches)
      datasetSignatureRef.current = nextSignature
    }
  }, [matches, onOddsUpdate])

  useEffect(() => {
    const interval = window.setInterval(() => {
      const currentMatches = matchesRef.current
      if (currentMatches.length === 0) return

      const updates: OddsUpdate[] = []
      const totalOutcomeIndex = totalOutcomeIndexRef.current

      for (let i = 0; i < updatesPerTick; i += 1) {
        const match = currentMatches[randomInt(currentMatches.length)]
        if (!match) continue

        const outcome = match.outcomes[randomInt(match.outcomes.length)]
        if (!outcome) continue

        if (outcome.groupId === 'TOTAL') {
          const totalIndices = totalOutcomeIndex.get(match.id)
          const overOutcome = totalIndices ? match.outcomes[totalIndices.overIndex] : undefined
          const underOutcome = totalIndices ? match.outcomes[totalIndices.underIndex] : undefined

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

      onOddsUpdateRef.current(updates)
    }, intervalMs)

    return () => {
      window.clearInterval(interval)
    }
  }, [intervalMs, updatesPerTick])
}
