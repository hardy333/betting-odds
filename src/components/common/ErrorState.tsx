import { Panel } from '@/components/common/Panel'

interface ErrorStateProps {
  title?: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

export const ErrorState = ({
  title = 'Something went wrong',
  message,
  actionLabel,
  onAction,
}: ErrorStateProps) => {
  return (
    <div className="flex h-full items-center justify-center">
      <Panel as="section" tone="panel" className="max-w-md space-y-2 p-5 text-center">
        <h2 className="text-base font-semibold text-(--text-primary)">{title}</h2>
        <p className="text-sm text-(--text-muted)">{message}</p>
        {actionLabel && onAction ? (
          <div className="pt-2">
            <button
              type="button"
              className="rounded-md border border-(--accent-gold) bg-(--card) px-3 py-2 text-sm font-semibold text-(--accent-gold) transition hover:brightness-110"
              onClick={onAction}
            >
              {actionLabel}
            </button>
          </div>
        ) : null}
      </Panel>
    </div>
  )
}
