import type { ElementType, HTMLAttributes, ReactNode } from 'react'

type PanelTone = 'panel' | 'card' | 'subtle' | 'dashed'

interface PanelProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  tone?: PanelTone
  children: ReactNode
}

const toneClassMap: Record<PanelTone, string> = {
  panel: 'rounded-lg border border-[var(--border)] bg-[var(--panel)]',
  card: 'rounded-md border border-[var(--border)] bg-[var(--card)]',
  subtle: 'rounded-md bg-[var(--bg-app)]',
  dashed: 'rounded-md border border-dashed border-[var(--border)] bg-[var(--card)]',
}

export const Panel = ({
  as: Component = 'div',
  tone = 'panel',
  className,
  children,
  ...rest
}: PanelProps) => {
  return (
    <Component className={`${toneClassMap[tone]} ${className ?? ''}`} {...rest}>
      {children}
    </Component>
  )
}
