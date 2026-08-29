import { Badge, type StatusTone } from '@/components/Badge'
import { Card } from '@/components/Card'
import type { InsightReport } from './types'

function confidenceTone(confidence: number): StatusTone {
  if (confidence >= 75) return 'good'
  if (confidence >= 50) return 'warning'
  return 'serious'
}

export function InsightCard({ report }: { report: InsightReport }) {
  return (
    <Card className="flex max-w-md flex-col gap-4">
      <p className="text-base font-semibold text-ink">{report.headline}</p>

      {report.primaryFactor && (
        <div>
          <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">
            Primary factor
          </p>
          <p className="text-sm font-medium text-ink">{report.primaryFactor}</p>
        </div>
      )}

      <div>
        <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">
          Evidence
        </p>
        <ul className="mt-1 flex flex-col gap-1">
          {report.evidence.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-ink-secondary">
              <span aria-hidden="true">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <Badge tone={confidenceTone(report.confidence)}>
        Confidence: {report.confidence}%
      </Badge>
    </Card>
  )
}
