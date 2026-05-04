import type { CSSProperties } from 'react'

import { LiveChip } from '@/components/board/LiveChip'
import { OddsButton } from '@/components/board/OddsButton'
import { Panel } from '@/components/common/Panel'
import type { Match, OddsDirection, OutcomeGroupId, OutcomeId } from '@/types/odds'

interface MatchRowProps {
  match: Match
  selectedKeys: Set<string>
  toSelectionKey: (matchId: string, groupId: OutcomeGroupId, outcomeId: OutcomeId) => string
  onToggle: (matchId: string, groupId: OutcomeGroupId, outcomeId: OutcomeId) => void
  getFlashDirection: (matchId: string, groupId: OutcomeGroupId, outcomeId: OutcomeId) => OddsDirection | null
  isLastRow?: boolean
  style?: CSSProperties
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

const ODDS_GROUP_START_LABELS = new Set(['1X', 'O2.5'])

export const MatchRow = ({
  match,
  style,
  selectedKeys,
  toSelectionKey,
  onToggle,
  getFlashDirection,
  isLastRow = false,
}: MatchRowProps) => {
  const oddsColumns = match.outcomes

  return (
    <div
      style={style}
      className="h-full px-1 py-1 md:px-2"
    >
      <Panel as="article" tone="card" className="h-full border p-2 md:hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base" title={match.sport}>
                {match.sportIcon}
              </span>
              <p className="truncate text-[12px] font-semibold uppercase text-[#f3f4f6]">
                {match.competitors[0]} <span className="text-[#6b7280]">vs</span> {match.competitors[1]}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-[#9ca3af]">
              <span>{formatTime(match.startTime)}</span>
              <span>•</span>
              <LiveChip isLive={match.score.status === 'LIVE'} />
            </div>
          </div>
          <Panel tone="subtle" className="shrink-0 px-2 py-1">
            <span className="font-odds text-[12px] text-[#f3f4f6]">
              {match.score.home}:{match.score.away}
            </span>
            <span className="ml-2 text-[10px] text-[#9ca3af]">
              {match.score.status === 'LIVE' ? `${match.score.minute}'` : 'NS'}
            </span>
          </Panel>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-1">
          {oddsColumns.map((outcome) => (
            <div key={`${outcome.groupId}:${outcome.outcomeId}`}>
              <OddsButton
                label={outcome.outcomeId}
                odds={outcome.odds}
                selected={selectedKeys.has(toSelectionKey(match.id, outcome.groupId, outcome.outcomeId))}
                flashDirection={getFlashDirection(match.id, outcome.groupId, outcome.outcomeId)}
                onClick={() => onToggle(match.id, outcome.groupId, outcome.outcomeId)}
                className="w-full px-1.5 py-1 text-[12px]"
              />
            </div>
          ))}
        </div>
      </Panel>

      <div
        className={`hidden items-center py-1 text-[13px] transition-colors hover:bg-[#1a2330] md:flex ${
          isLastRow ? '' : 'border-b border-[#30363d]'
        }`}
      >
        <div className="flex shrink-0 items-center gap-1">
          <div className="w-8 text-center text-base" title={match.sport}>
            {match.sportIcon}
          </div>
          <div className="w-[220px] shrink-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase text-[#f3f4f6]">
              <span>{match.competitors[0]}</span>
              <span className="text-[#6b7280]">vs</span>
              <span>{match.competitors[1]}</span>
            </div>
          </div>

          <div className="w-[70px] pl-1 text-left text-[12px] text-[#9ca3af]">
            {formatTime(match.startTime)}
          </div>

          <div className="w-[70px]">
            <Panel tone="subtle" className="flex items-center justify-between px-1.5 py-0.5">
              <span className="font-odds text-[12px] text-[#f3f4f6]">
                {match.score.home}:{match.score.away}
              </span>
              <span className="text-[10px] text-[#9ca3af]">
                {match.score.status === 'LIVE' ? `${match.score.minute}'` : 'NS'}
              </span>
            </Panel>
          </div>

          <div className="flex w-[60px] justify-start pl-1">
            <LiveChip isLive={match.score.status === 'LIVE'} />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          {oddsColumns.map((outcome) => (
            <div
              key={`${outcome.groupId}:${outcome.outcomeId}`}
              className={`w-[58px] ${ODDS_GROUP_START_LABELS.has(outcome.outcomeId) ? 'mx-1 border-l border-[#30363d] pl-1' : ''}`}
            >
              <OddsButton
                label={outcome.outcomeId}
                odds={outcome.odds}
                selected={selectedKeys.has(toSelectionKey(match.id, outcome.groupId, outcome.outcomeId))}
                flashDirection={getFlashDirection(match.id, outcome.groupId, outcome.outcomeId)}
                onClick={() => onToggle(match.id, outcome.groupId, outcome.outcomeId)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
