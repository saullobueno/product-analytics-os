import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import type { ConversionAnomaly } from '@/data/selectors'
import { formatSignedPercent } from '@/lib/format'

export interface AnomalyListProps {
  anomalies: ConversionAnomaly[]
}

/** Anomalias sempre com Badge (ícone + label), nunca só uma cor de fundo. */
export function AnomalyList({ anomalies }: AnomalyListProps) {
  if (anomalies.length === 0) return null

  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">Anomalias detectadas</h2>
      <p className="mt-1 text-sm text-ink-secondary">
        Dias em que a conversão se desviou de forma incomum da média do período
        (≥ 1.5 desvio-padrão).
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {anomalies.map((anomaly) => (
          <li key={anomaly.date} className="flex items-center gap-3 text-sm">
            <Badge tone={anomaly.severity}>{anomaly.date}</Badge>
            <span className="text-ink-secondary">
              Conversão {formatSignedPercent(anomaly.deviationPct, 1)} vs. média
              do período ({anomaly.value.toFixed(1)}% vs.{' '}
              {anomaly.expected.toFixed(1)}%)
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
