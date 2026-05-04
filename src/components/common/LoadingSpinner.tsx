interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-9 w-9 border-[3px]',
}

export const LoadingSpinner = ({ className = '', size = 'md' }: LoadingSpinnerProps) => {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-(--border) border-t-(--accent-gold) ${sizeClasses[size]} ${className}`.trim()}
      aria-hidden
    />
  )
}
