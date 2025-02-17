'use client'

import React from 'react'
import {
  Tooltip as TooltipPrimitive,
  TooltipContent as TooltipContentPrimitive,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip'
import { cn } from '../../../lib/utils'

const isMac = typeof window !== 'undefined' ? navigator.platform.toUpperCase().indexOf('MAC') >= 0 : false

const ShortcutKey = ({ children }: { children: string }): JSX.Element => {
  const className =
    'inline-flex items-center justify-center w-5 h-5 p-1 text-[0.625rem] rounded font-semibold leading-none border border-neutral-200 text-neutral-500 border-b-2'

  if (children === 'Mod') {
    return <kbd className={className}>{isMac ? '⌘' : 'Ctrl'}</kbd>
  }
  if (children === 'Shift') {
    return <kbd className={className}>⇧</kbd>
  }
  if (children === 'Alt') {
    return <kbd className={className}>{isMac ? '⌥' : 'Alt'}</kbd>
  }
  return <kbd className={className}>{children}</kbd>
}

interface TooltipProps {
  children: React.ReactNode
  title?: string
  shortcut?: string[]
  enabled?: boolean
}

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipContentPrimitive>,
  React.ComponentPropsWithoutRef<typeof TooltipContentPrimitive>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipContentPrimitive
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipContentPrimitive.displayName

export const Tooltip = ({ children, title, shortcut, enabled = true }: TooltipProps) => {
  if (!enabled || (!title && !shortcut)) {
    return <>{children}</>
  }

  return (
    <TooltipProvider>
      <TooltipPrimitive>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="flex items-center gap-2">
          {title && <span className="text-xs font-medium">{title}</span>}
          {shortcut && (
            <span className="flex items-center gap-0.5">
              {shortcut.map(key => (
                <ShortcutKey key={key}>{key}</ShortcutKey>
              ))}
            </span>
          )}
        </TooltipContent>
      </TooltipPrimitive>
    </TooltipProvider>
  )
}

export { TooltipProvider, TooltipTrigger }
export default Tooltip
