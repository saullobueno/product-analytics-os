import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FunnelsPage } from './FunnelsPage'

describe('FunnelsPage', () => {
  it('renderiza um funil por device', () => {
    render(<FunnelsPage />)
    expect(screen.getByText('Android')).toBeInTheDocument()
    expect(screen.getByText('iOS')).toBeInTheDocument()
    expect(screen.getByText('Web')).toBeInTheDocument()
    expect(
      screen.getAllByRole('heading', { name: /user journey/i }),
    ).toHaveLength(3)
  })
})
