import { Panel } from '@/components/common/Panel'

interface BetTickerSidebarLoadingProps {
  floating?: boolean
}

const shimmerClass =
  "relative overflow-hidden bg-(--card)/60 before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] before:animate-pulse"

const SkeletonLine = ({ className = '' }: { className?: string }) => (
  <div className={`h-3 rounded ${shimmerClass} ${className}`.trim()} aria-hidden />
)

const SkeletonTicketCard = ({ width = 'w-16' }: { width?: string }) => (
  <Panel tone="card" className="space-y-2 border p-2">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1 space-y-2">
        <SkeletonLine className="h-3.5 w-11/12" />
        <SkeletonLine className="h-2.5 w-9/12" />
      </div>
      <div className={`h-4 rounded ${shimmerClass} ${width}`} aria-hidden />
    </div>
    <SkeletonLine className="h-4 w-14" />
  </Panel>
)

export const BetTickerSidebarLoading = ({ floating = false }: BetTickerSidebarLoadingProps) => {
  return (
    <Panel as="aside" tone="panel" className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b border-(--border) p-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-(--text-muted)">Bet Ticket</h2>
        {!floating ? <div className={`h-6 w-6 rounded ${shimmerClass}`} aria-hidden /> : null}
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-hidden p-3">
        <Panel tone="dashed" as="div" className="space-y-2 p-3">
          <SkeletonLine className="w-8/12" />
          <SkeletonLine className="w-6/12" />
        </Panel>
        <div className="space-y-2">
          <SkeletonTicketCard width="w-6" />
          <SkeletonTicketCard width="w-4" />
          <SkeletonTicketCard width="w-5" />
        </div>
      </div>

      <footer className="space-y-2 border-t border-(--border) p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <SkeletonLine className="w-20" />
            <SkeletonLine className="w-12" />
          </div>
          <div className="flex items-center justify-between gap-2">
            <SkeletonLine className="w-16" />
            <SkeletonLine className="w-24" />
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <div className={`h-9 flex-1 rounded ${shimmerClass}`} aria-hidden />
          <div className={`h-9 w-9 rounded ${shimmerClass}`} aria-hidden />
        </div>
      </footer>
    </Panel>
  )
}
