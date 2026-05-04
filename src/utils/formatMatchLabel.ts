import type { Match } from '@/types/odds'

export const formatMatchLabel = (competitors: Match['competitors']) =>
  `${competitors[0]} vs ${competitors[1]}`
