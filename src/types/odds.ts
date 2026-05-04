export type SportType = 'football' | 'basketball' | 'tennis' | 'esports' | 'hockey'

export type OutcomeGroupId = 'STANDARD' | 'DOUBLE_CHANCE' | 'TOTAL'
export type OutcomeId = '1' | 'X' | '2' | '1X' | '12' | 'X2' | 'O2.5' | 'U2.5'

export type MatchStatus = 'LIVE' | 'UPCOMING'

export type OddsDirection = 'up' | 'down'

export interface Outcome {
  groupId: OutcomeGroupId
  outcomeId: OutcomeId
  odds: number
}

export interface MatchScore {
  home: number
  away: number
  minute: number
  status: MatchStatus
}

export interface Match {
  id: string
  sport: SportType
  sportIcon: string
  competitors: [string, string]
  startTime: string
  score: MatchScore
  outcomes: Outcome[]
}

export interface OddsUpdate {
  matchId: string
  groupId: OutcomeGroupId
  outcomeId: OutcomeId
  newOdds: number
}

export interface SelectedOdd {
  matchId: string
  groupId: OutcomeGroupId
  outcomeId: OutcomeId
}

export type SelectedOddMap = Record<string, SelectedOdd>

export interface FlashState {
  direction: OddsDirection
  expiresAt: number
}

export type ChangedOddsMap = Record<string, FlashState>
