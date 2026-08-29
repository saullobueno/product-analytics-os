import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CohortsPage } from './CohortsPage'

describe('CohortsPage', () => {
  it('renderiza a tabela de retenção por coorte com semana 0 em 100%', () => {
    render(<CohortsPage />)
    expect(
      screen.getByRole('heading', { name: /retention por coorte/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('100%').length).toBeGreaterThan(0)
  })
})
