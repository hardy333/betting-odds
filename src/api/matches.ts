import { appConfig } from '@/config/appConfig'
import type { Match } from '@/types/odds'
import { generateMatches } from '@/utils/generateMatches'

interface GetAllMatchesMockParams {
  count: number
  seed: number
}

const randomDelayMs = (minMs: number, maxMs: number) => {
  const lower = Math.min(minMs, maxMs)
  const upper = Math.max(minMs, maxMs)
  return Math.floor(Math.random() * (upper - lower + 1)) + lower
}

const sleep = (delayMs: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, delayMs)
  })

export const getAllMatchesMock = async ({ count, seed }: GetAllMatchesMockParams): Promise<Match[]> => {
  const delayMs = randomDelayMs(
    appConfig.api.initialMatchesMinDelayMs,
    appConfig.api.initialMatchesMaxDelayMs,
  )

  await sleep(delayMs)
  return generateMatches(count, seed)
}
