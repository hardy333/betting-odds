import type { ReactNode } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'

interface AppErrorBoundaryProps {
  children: ReactNode
}

const AppErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const handleReload = () => {
    window.location.reload()
  }
  const errorMessage =
    error instanceof Error && error.message
      ? error.message
      : 'An unexpected error occurred while rendering the app.'

  return (
    <div className="flex min-h-dvh items-center justify-center bg-(--bg-app) px-4 text-(--text-primary)">
      <div className="w-full max-w-md rounded-lg border border-(--border) bg-(--panel) p-5">
        <h1 className="text-lg font-semibold text-(--text-primary)">Something went wrong.</h1>
        <p className="mt-2 text-sm text-(--text-muted)">
          {errorMessage}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-(--accent-gold) bg-(--card) px-3 py-2 text-sm font-semibold text-(--accent-gold) transition hover:brightness-110"
            onClick={resetErrorBoundary}
          >
            Try again
          </button>
          <button
            type="button"
            className="rounded-md border border-(--border) bg-(--panel) px-3 py-2 text-sm font-semibold text-(--text-primary) transition hover:brightness-110"
            onClick={handleReload}
          >
            Reload app
          </button>
        </div>
      </div>
    </div>
  )
}

export const AppErrorBoundary = ({ children }: AppErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      FallbackComponent={AppErrorFallback}
      onError={(error, info) => {
        console.error('Unhandled app error:', error, info)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
