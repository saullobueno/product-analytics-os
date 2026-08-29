import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatTile } from './StatTile'

describe('StatTile', () => {
  it('renderiza label e valor', () => {
    render(<StatTile label="DAU" value="182,430" />)
    expect(screen.getByText('DAU')).toBeInTheDocument()
    expect(screen.getByText('182,430')).toBeInTheDocument()
  })

  it('trata alta como melhora quando positiveDirection é "up"', () => {
    render(
      <StatTile
        label="Conversão"
        value="7.3%"
        delta={2}
        positiveDirection="up"
      />,
    )
    expect(screen.getByText(/melhora/i)).toBeInTheDocument()
  })

  it('trata alta como piora quando positiveDirection é "down" (ex.: churn)', () => {
    render(
      <StatTile
        label="Churn"
        value="2.4%"
        delta={1.2}
        positiveDirection="down"
      />,
    )
    expect(screen.getByText(/piora/i)).toBeInTheDocument()
  })

  it('não renderiza bloco de delta quando delta é omitido', () => {
    render(<StatTile label="DAU" value="182,430" />)
    expect(screen.queryByText(/melhora|piora/i)).not.toBeInTheDocument()
  })
})
