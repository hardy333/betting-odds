export interface SelectionKeyParts {
  matchId: string
  marketId: string
  outcomeId: string
}

export const toSelectionKey = (matchId: string, marketId: string, outcomeId: string) =>
  `${matchId}|${marketId}|${outcomeId}`

export const parseSelectionKey = (key: string): SelectionKeyParts => {
  const [matchId, marketId, outcomeId] = key.split('|')
  return {
    matchId: matchId ?? '',
    marketId: marketId ?? '',
    outcomeId: outcomeId ?? '',
  }
}
