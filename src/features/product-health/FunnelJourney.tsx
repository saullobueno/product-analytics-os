import { ArrowDown } from 'lucide-react'
import { Card } from '@/components/Card'
import type { FunnelStepSummary } from '@/data/selectors'
import { cn } from '@/lib/cn'

const STEP_OPACITY = ['opacity-100', 'opacity-80', 'opacity-60', 'opacity-40']

export interface FunnelJourneyProps {
  steps: FunnelStepSummary[]
}

/**
 * Rampa sequencial de um hue só (series-1), escurecendo a cada passo —
 * magnitude decrescente, não identidade categórica (ver skill dataviz).
 */
export function FunnelJourney({ steps }: FunnelJourneyProps) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">User Journey</h2>
      <ol className="mt-4 flex flex-col gap-1">
        {steps.map((step, index) => (
          <li key={step.id}>
            {index > 0 && (
              <div className="flex items-center gap-1 py-1 pl-1 text-xs font-medium text-ink-muted">
                <ArrowDown aria-hidden="true" size={12} />
                <span>{step.retainedFromLandingRate.toFixed(0)}%</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-28 shrink-0 text-sm font-medium text-ink">
                {step.label}
              </div>
              <div className="h-6 flex-1 rounded-full bg-plane">
                <div
                  className={cn(
                    'h-6 rounded-full bg-series-1',
                    STEP_OPACITY[index],
                  )}
                  style={{
                    width: `${Math.max(step.retainedFromLandingRate, 2)}%`,
                  }}
                />
              </div>
              <div className="w-20 shrink-0 text-right text-sm text-ink-secondary tabular-nums">
                {step.count.toLocaleString('pt-BR')}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  )
}
