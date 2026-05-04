export type SportType = 'football' | 'basketball' | 'tennis' | 'esports' | 'hockey'

export type MarketType = '1X2' | 'DOUBLE_CHANCE' | 'TOTAL'

export type MatchStatus = 'LIVE' | 'UPCOMING'

export type OddsDirection = 'up' | 'down'

export interface Outcome {
  id: string
  label: string
  odds: number
}

export interface Market {
  id: string
  type: MarketType
  label: string
  outcomes: Outcome[]
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
  markets: Market[]
}

export interface OddsUpdate {
  matchId: string
  marketId: string
  outcomeId: string
  newOdds: number
}

export interface SelectedOdd {
  matchId: string
  marketId: string
  outcomeId: string
}

export type SelectedOddMap = Record<string, SelectedOdd>

export interface FlashState {
  direction: OddsDirection
  expiresAt: number
}

export type ChangedOddsMap = Record<string, FlashState>
