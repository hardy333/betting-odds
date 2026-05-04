import type { ElementType, HTMLAttributes, ReactNode } from 'react'

type PanelTone = 'panel' | 'card' | 'subtle' | 'dashed'

interface PanelProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  tone?: PanelTone
  children: ReactNode
}

const toneClassMap: Record<PanelTone, string> = {
  panel: 'rounded-lg border border-[#30363d] bg-[#161b22]',
  card: 'rounded-md border border-[#30363d] bg-[#1c2330]',
  subtle: 'rounded-md bg-[#111722]',
  dashed: 'rounded-md border border-dashed border-[#30363d] bg-[#1c2330]',
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
