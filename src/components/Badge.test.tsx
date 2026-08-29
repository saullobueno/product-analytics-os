import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renderiza o texto e um ícone (nunca só cor)', () => {
    const { container } = render(<Badge tone="critical">Anomalia</Badge>)
    expect(screen.getByText('Anomalia')).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
