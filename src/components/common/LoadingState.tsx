import { Panel } from '@/components/common/Panel'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

interface LoadingStateProps {
  message?: string
}

export const LoadingState = ({ message = 'Loading...' }: LoadingStateProps) => {
  return (
    <div className="flex h-full items-center justify-center">
      <Panel
        as="section"
        tone="panel"
        className="flex w-full max-w-md items-center justify-center gap-3 p-5 text-center text-sm text-(--text-muted)"
      >
        <LoadingSpinner size="md" />
        <span>{message}</span>
      </Panel>
    </div>
  )
}
