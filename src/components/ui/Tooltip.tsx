import type { ReactElement } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

interface TooltipProps {
  content: string
  children: ReactElement
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider delayDuration={150}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="top"
            sideOffset={8}
            className="z-80 max-w-[260px] rounded-md border border-[#3b4557] bg-[#111827] px-2 py-1.5 text-[11px] font-medium normal-case tracking-normal text-[#e5e7eb] shadow-lg"
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-[#111827]" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
