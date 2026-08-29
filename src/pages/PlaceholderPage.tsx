import { Card } from '@/components/Card'

export interface PlaceholderPageProps {
  title: string
}

/** Página-esqueleto usada pelas rotas ainda não implementadas nas fases seguintes. */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <Card>
      <h1 className="text-xl font-semibold text-ink">{title}</h1>
      <p className="mt-2 text-sm text-ink-secondary">
        Em construção — chega numa fase seguinte do projeto.
      </p>
    </Card>
  )
}
