import type { Match, Outcome, SportType } from '@/types/odds'

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

const TOTAL_GOALS_LINE = 2.5

const poissonTailProbability = (lambda: number, minimumGoals: number) => {
  if (minimumGoals <= 0) return 1
  if (lambda <= 0) return 0

  let probability = Math.exp(-lambda)
  let cumulative = probability

  for (let k = 1; k < minimumGoals; k += 1) {
    probability = (probability * lambda) / k
    cumulative += probability
  }

  return clamp(1 - cumulative, 0, 1)
}

const totalOddsFromState = ({
  rand,
  totalGoalsScored,
  isLive,
  minute,
}: {
  rand: () => number
  totalGoalsScored: number
  isLive: boolean
  minute: number
}) => {
  const fairFullTimeLambda = randomRange(rand, 2.1, 3.2)
  const goalsNeededForOver = Math.floor(TOTAL_GOALS_LINE) + 1 - totalGoalsScored
  let overProbability: number

  if (goalsNeededForOver <= 0) {
    overProbability = 0.995
  } else if (isLive) {
    const remainingMinutes = clamp(90 - minute, 1, 90)
    const remainingLambda = fairFullTimeLambda * (remainingMinutes / 90)
    overProbability = poissonTailProbability(remainingLambda, goalsNeededForOver)
  } else {
    overProbability = poissonTailProbability(fairFullTimeLambda, goalsNeededForOver)
  }

  const clampedOverProbability = clamp(overProbability, 0.05, 0.95)
  const underProbability = 1 - clampedOverProbability
  const overround = randomRange(rand, 1.04, 1.1)

  return {
    overOdds: Number((1 / (clampedOverProbability * overround)).toFixed(2)),
    underOdds: Number((1 / (underProbability * overround)).toFixed(2)),
  }
}

const createOutcomes = (
  rand: () => number,
  context: { totalGoalsScored: number; isLive: boolean; minute: number },
): Outcome[] => {
  const { overOdds, underOdds } = totalOddsFromState({
    rand,
    totalGoalsScored: context.totalGoalsScored,
    isLive: context.isLive,
    minute: context.minute,
  })

  return [
    { groupId: 'STANDARD', outcomeId: '1', odds: makeOdds(rand, 1.4, 4.2) },
    { groupId: 'STANDARD', outcomeId: 'X', odds: makeOdds(rand, 2.4, 4.8) },
    { groupId: 'STANDARD', outcomeId: '2', odds: makeOdds(rand, 1.4, 4.2) },
    { groupId: 'DOUBLE_CHANCE', outcomeId: '1X', odds: makeOdds(rand, 1.08, 2.4) },
    { groupId: 'DOUBLE_CHANCE', outcomeId: '12', odds: makeOdds(rand, 1.08, 2.4) },
    { groupId: 'DOUBLE_CHANCE', outcomeId: 'X2', odds: makeOdds(rand, 1.08, 2.4) },
    { groupId: 'TOTAL', outcomeId: 'O2.5', odds: overOdds },
    { groupId: 'TOTAL', outcomeId: 'U2.5', odds: underOdds },
  ]
}

export const generateMatches = (count: number, seed = 1001): Match[] => {
  const rand = mulberry32(seed)
  const now = Date.now()
  const matches: Match[] = []

  for (let i = 0; i < count; i += 1) {
    const id = `match-${i + 1}`
    const sportMeta = SPORTS[i % SPORTS.length]
    if (!sportMeta) continue

    const minute = randomInt(rand, 1, 90)
    const startOffsetMs = randomInt(rand, -70, 15) * 60_000
    const startTime = new Date(now + startOffsetMs).toISOString()
    const isLive = rand() < 0.65
    const homeScore = isLive ? randomInt(rand, 0, 4) : 0
    const awayScore = isLive ? randomInt(rand, 0, 4) : 0

    matches.push({
      id,
      sport: sportMeta.sport,
      sportIcon: sportMeta.icon,
      competitors: [makeTeamName(rand), makeTeamName(rand)],
      startTime,
      score: {
        home: homeScore,
        away: awayScore,
        minute: isLive ? minute : 0,
        status: isLive ? 'LIVE' : 'UPCOMING',
      },
      outcomes: createOutcomes(rand, {
        totalGoalsScored: homeScore + awayScore,
        isLive,
        minute,
      }),
    })
  }

  return matches
}
