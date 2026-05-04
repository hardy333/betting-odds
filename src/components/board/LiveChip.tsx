import { Chip } from '@/components/ui/Chip'

interface LiveChipProps {
  isLive: boolean
}

export const LiveChip = ({ isLive }: LiveChipProps) => {
  if (!isLive) return null

  return (
    <Chip
      tone="live"
      withPulseDot
      className="border border-[#00c853] bg-transparent px-1.5 py-0.5 text-[9px] tracking-[0.06em]"
    >
      Live
    </Chip>
  )
}
