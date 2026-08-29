import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RetentionPage } from './RetentionPage'

describe('RetentionPage', () => {
  it('renderiza o KPI de retenção média e o gráfico de tendência', () => {
    render(<RetentionPage />)
    expect(
      screen.getByRole('heading', { name: /^retention$/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/retenção média/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /retenção semana 1 por coorte/i }),
    ).toBeInTheDocument()
  })
})
