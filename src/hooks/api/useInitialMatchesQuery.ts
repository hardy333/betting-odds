import { useQuery } from '@tanstack/react-query'

import { getAllMatchesMock } from '@/api/matches'

interface UseInitialMatchesQueryParams {
  totalMatches: number
  seed: number
}

export const useInitialMatchesQuery = ({ totalMatches, seed }: UseInitialMatchesQueryParams) => {
  return useQuery({
    queryKey: ['matches', totalMatches, seed],
    queryFn: () =>
      getAllMatchesMock({
        count: totalMatches,
        seed,
      }),
    staleTime: Number.POSITIVE_INFINITY,
  })
}
