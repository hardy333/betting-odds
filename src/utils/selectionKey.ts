import type { OutcomeGroupId, OutcomeId } from '@/types/odds'

export interface SelectionKeyParts {
  matchId: string
  groupId: OutcomeGroupId
  outcomeId: OutcomeId
}

export const toSelectionKey = (matchId: string, groupId: OutcomeGroupId, outcomeId: OutcomeId) =>
  `${matchId}|${groupId}|${outcomeId}`

export const parseSelectionKey = (key: string): SelectionKeyParts => {
  const [matchId, groupIdRaw, outcomeIdRaw] = key.split('|')
  const isOutcomeGroupId = (value: string): value is OutcomeGroupId =>
    value === 'STANDARD' || value === 'DOUBLE_CHANCE' || value === 'TOTAL'
  const isOutcomeId = (value: string): value is OutcomeId =>
    value === '1' ||
    value === 'X' ||
    value === '2' ||
    value === '1X' ||
    value === '12' ||
    value === 'X2' ||
    value === 'O2.5' ||
    value === 'U2.5'

  const normalizedGroupId = groupIdRaw ?? ''
  const normalizedOutcomeId = outcomeIdRaw ?? ''
  const groupId: OutcomeGroupId = isOutcomeGroupId(normalizedGroupId) ? normalizedGroupId : 'STANDARD'
  const outcomeId: OutcomeId = isOutcomeId(normalizedOutcomeId) ? normalizedOutcomeId : '1'
  return {
    matchId: matchId ?? '',
    groupId,
    outcomeId,
  }
}
