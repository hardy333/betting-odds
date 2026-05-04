const LEFT_COLUMN_LABELS = ['Sport', 'Match', 'Start', 'Score', 'Status']
const ODDS_COLUMN_LABELS = ['1', 'X', '2', '1X', '12', 'X2', 'Over', 'Under']
const ODDS_GROUP_START_LABELS = new Set(['1X', 'Over'])

export const OddsBoardHeader = () => {
  return (
    <header className="sticky top-0 z-20 hidden shrink-0 items-center rounded-t-lg border border-[#30363d] bg-[#161b22] px-2 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#9ca3af] md:flex">
      <div className="flex shrink-0 items-center gap-1">
        {LEFT_COLUMN_LABELS.map((label, index) => (
          <span
            key={label}
            className={`${index === 0 ? 'w-8 text-center' : ''} ${index === 1 ? 'w-[220px] text-left' : ''} ${index >= 2 && index <= 3 ? 'w-[70px] pl-1 text-left' : ''} ${index === 4 ? 'w-[60px] pl-1 text-left' : ''}`}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-1">
        {ODDS_COLUMN_LABELS.map((label) => (
          <span
            key={label}
            className={`w-[58px] text-center ${ODDS_GROUP_START_LABELS.has(label) ? 'mx-1 pl-1' : ''}`}
          >
            {label}
          </span>
        ))}
      </div>
    </header>
  )
}
