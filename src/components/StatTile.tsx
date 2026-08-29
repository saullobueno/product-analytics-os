import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Card } from './Card'

export interface StatTileProps {
  label: string
  value: string
  /** Variação em pontos percentuais desde o período anterior. */
  delta?: number
  deltaLabel?: string
  /** Direção que representa melhora: 'up' para DAU/conversão, 'down' para churn. */
  positiveDirection?: 'up' | 'down'
  className?: string
}

export function StatTile({
  label,
  value,
  delta,
  deltaLabel,
  positiveDirection = 'up',
  className,
}: StatTileProps) {
  const hasDelta = typeof delta === 'number' && delta !== 0
  const isUp = (delta ?? 0) > 0
  const isGood = hasDelta && (positiveDirection === 'up' ? isUp : !isUp)
  const DeltaIcon = isUp ? ArrowUpRight : ArrowDownRight

  return (
    <Card className={cn('flex flex-col gap-2', className)}>
      <span className="text-sm text-ink-secondary">{label}</span>
      <span className="text-3xl font-semibold tabular-nums text-ink">
        {value}
      </span>
      {hasDelta && (
        <span
          className={cn(
            'inline-flex items-center gap-1 text-sm font-medium',
            isGood ? 'text-delta-good' : 'text-delta-bad',
          )}
        >
          <DeltaIcon aria-hidden="true" size={14} />
          <span>
            {isUp ? '+' : ''}
            {delta!.toFixed(1)}%
          </span>
          {deltaLabel && (
            <span className="font-normal text-ink-muted">{deltaLabel}</span>
          )}
          <span className="sr-only">
            {isGood ? 'melhora' : 'piora'} em relação ao período anterior
          </span>
        </span>
      )}
    </Card>
  )
}
