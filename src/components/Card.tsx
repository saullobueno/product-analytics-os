import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

export function Card({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface p-4 shadow-sm',
        className,
      )}
      {...props}
    />
  )
}
