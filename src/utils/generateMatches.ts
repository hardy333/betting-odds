import type { Market, Match, SportType } from '@/types/odds'

const SPORTS: Array<{ sport: SportType; icon: string }> = [
  { sport: 'football', icon: '⚽' },
  { sport: 'basketball', icon: '🏀' },
  { sport: 'tennis', icon: '🎾' },
  { sport: 'esports', icon: '🎮' },
  { sport: 'hockey', icon: '🏒' },
]

const TEAM_PREFIXES = [
  'Real',
  'City',
  'United',
  'Sporting',
  'Rapid',
  'Dynamo',
  'Atletico',
  'Olympic',
  'Royal',
  'Inter',
  'FC',
  'AC',
]

const TEAM_SUFFIXES = [
  'Lions',
  'Falcons',
  'Wolves',
  'Titans',
  'Rangers',
  'Phoenix',
  'Warriors',
  'Knights',
  'Stars',
  'Dragons',
  'Eagles',
  'Bulls',
]

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const mulberry32 = (seed: number) => {
  let s = seed
  return () => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const randomRange = (rand: () => number, min: number, max: number) => min + rand() * (max - min)

const randomInt = (rand: () => number, min: number, max: number) =>
  Math.floor(randomRange(rand, min, max + 1))

const makeTeamName = (rand: () => number) => {
  const prefix = TEAM_PREFIXES[randomInt(rand, 0, TEAM_PREFIXES.length - 1)]
  const suffix = TEAM_SUFFIXES[randomInt(rand, 0, TEAM_SUFFIXES.length - 1)]
  return `${prefix} ${suffix}`
}

const makeOdds = (rand: () => number, min = 1.2, max = 6.8) =>
  Number(clamp(randomRange(rand, min, max), min, max).toFixed(2))

const createMarkets = (matchId: string, rand: () => number): Market[] => [
  {
    id: `${matchId}:1x2`,
    type: '1X2',
    label: '1X2',
    outcomes: [
      { id: `${matchId}:1x2:home`, label: '1', odds: makeOdds(rand, 1.4, 4.2) },
      { id: `${matchId}:1x2:draw`, label: 'X', odds: makeOdds(rand, 2.4, 4.8) },
      { id: `${matchId}:1x2:away`, label: '2', odds: makeOdds(rand, 1.4, 4.2) },
    ],
  },
  {
    id: `${matchId}:double`,
    type: 'DOUBLE_CHANCE',
    label: 'Double Chance',
    outcomes: [
      { id: `${matchId}:double:1x`, label: '1X', odds: makeOdds(rand, 1.08, 2.4) },
      { id: `${matchId}:double:12`, label: '12', odds: makeOdds(rand, 1.08, 2.4) },
      { id: `${matchId}:double:x2`, label: 'X2', odds: makeOdds(rand, 1.08, 2.4) },
    ],
  },
  {
    id: `${matchId}:total`,
    type: 'TOTAL',
    label: 'Total 2.5',
    outcomes: [
      { id: `${matchId}:total:over`, label: 'Over', odds: makeOdds(rand, 1.5, 3.0) },
      { id: `${matchId}:total:under`, label: 'Under', odds: makeOdds(rand, 1.5, 3.0) },
    ],
  },
]

export const generateMatches = (count: number, seed = 1001): Match[] => {
  const rand = mulberry32(seed)
  const now = Date.now()
  const matches: Match[] = []

  for (let i = 0; i < count; i += 1) {
    const id = `match-${i + 1}`
    const sportMeta = SPORTS[i % SPORTS.length]
    const minute = randomInt(rand, 1, 90)
    const startOffsetMs = randomInt(rand, -70, 15) * 60_000
    const startTime = new Date(now + startOffsetMs).toISOString()
    const isLive = rand() < 0.65

    matches.push({
      id,
      sport: sportMeta.sport,
      sportIcon: sportMeta.icon,
      competitors: [makeTeamName(rand), makeTeamName(rand)],
      startTime,
      score: {
        home: isLive ? randomInt(rand, 0, 4) : 0,
        away: isLive ? randomInt(rand, 0, 4) : 0,
        minute: isLive ? minute : 0,
        status: isLive ? 'LIVE' : 'UPCOMING',
      },
      markets: createMarkets(id, rand),
    })
  }

  return matches
}
