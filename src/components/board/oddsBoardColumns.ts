import type { OutcomeId } from '@/types/odds'

export const ODDS_COLUMN_LABELS: OutcomeId[] = ['1', 'X', '2', '1X', '12', 'X2', 'O2.5', 'U2.5']
export const ODDS_GROUP_START_LABELS = new Set<OutcomeId>(['1X', 'O2.5'])
