import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type StatusTone = 'good' | 'warning' | 'serious' | 'critical'

const TONE_CONFIG: Record<
  StatusTone,
  { icon: LucideIcon; textClass: string; bgClass: string }
> = {
  good: { icon: CheckCircle2, textClass: 'text-good', bgClass: 'bg-good/10' },
  warning: {
    icon: AlertTriangle,
    textClass: 'text-warning',
    bgClass: 'bg-warning/10',
  },
  serious: {
    icon: AlertTriangle,
    textClass: 'text-serious',
    bgClass: 'bg-serious/10',
  },
  critical: {
    icon: AlertOctagon,
    textClass: 'text-critical',
    bgClass: 'bg-critical/10',
  },
}

export interface BadgeProps {
  tone: StatusTone
  children: ReactNode
}

/** Badge de status: sempre ícone + texto, nunca só cor (ver skill dataviz). */
export function Badge({ tone, children }: BadgeProps) {
  const { icon: Icon, textClass, bgClass } = TONE_CONFIG[tone]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        textClass,
        bgClass,
      )}
    >
      <Icon aria-hidden="true" size={12} />
      {children}
    </span>
  )
}
