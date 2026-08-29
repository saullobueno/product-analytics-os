import { Card } from '@/components/Card'
import type { CohortRetentionRow } from '@/data/types'
import { sequentialBlue } from '@/lib/palette'

const STEPS = Object.keys(sequentialBlue)
  .map(Number)
  .sort((a, b) => a - b) as (keyof typeof sequentialBlue)[]

function stepForValue(value: number): keyof typeof sequentialBlue {
  const index = Math.min(
    STEPS.length - 1,
    Math.max(0, Math.round((value / 100) * (STEPS.length - 1))),
  )
  return STEPS[index]
}

function textColorForStep(step: number): string {
  return step >= 450 ? '#ffffff' : '#0b0b0b'
}

export interface CohortHeatmapProps {
  cohorts: CohortRetentionRow[]
  maxWeeks: number
}

/**
 * Heatmap = codificação sequencial de magnitude (um hue só, claro→escuro).
 * Cada célula sempre traz o número — nunca só a cor (ver skill dataviz).
 */
export function CohortHeatmap({ cohorts, maxWeeks }: CohortHeatmapProps) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">Retention por coorte</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th className="px-2 text-left font-medium text-ink-muted">
                Coorte
              </th>
              <th className="px-2 text-right font-medium text-ink-muted">
                Tamanho
              </th>
              {Array.from({ length: maxWeeks + 1 }, (_, week) => (
                <th
                  key={week}
                  scope="col"
                  className="px-2 text-center font-medium text-ink-muted"
                >
                  S{week}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort) => (
              <tr key={cohort.cohortWeekStart}>
                <th
                  scope="row"
                  className="px-2 text-left font-normal whitespace-nowrap text-ink-secondary"
                >
                  {cohort.cohortWeekStart}
                </th>
                <td className="px-2 text-right tabular-nums text-ink-secondary">
                  {cohort.cohortSize.toLocaleString('pt-BR')}
                </td>
                {Array.from({ length: maxWeeks + 1 }, (_, week) => {
                  const value = cohort.retentionByWeek[week]
                  if (value === undefined) {
                    return <td key={week} aria-hidden="true" />
                  }
                  const step = stepForValue(value)
                  return (
                    <td
                      key={week}
                      className="rounded px-2 py-1 text-center tabular-nums"
                      style={{
                        backgroundColor: sequentialBlue[step],
                        color: textColorForStep(step),
                      }}
                    >
                      {value}%
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
