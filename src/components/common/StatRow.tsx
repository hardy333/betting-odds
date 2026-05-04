interface StatRowProps {
  label: string
  value: string | number
  valueClassName?: string
}

export const StatRow = ({ label, value, valueClassName }: StatRowProps) => {
  return (
    <div className="flex items-center justify-between text-[12px] text-[#d1d5db]">
      <span className="uppercase tracking-[0.08em]">{label}</span>
      <span className={valueClassName ?? 'font-semibold text-[#f7c948]'}>{value}</span>
    </div>
  )
}
