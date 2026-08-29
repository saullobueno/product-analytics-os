import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FeatureAdoptionPage } from './FeatureAdoptionPage'

describe('FeatureAdoptionPage', () => {
  it('renderiza o ranking de adoção de features', () => {
    render(<FeatureAdoptionPage />)
    expect(
      screen.getByRole('heading', { name: /adoção de features/i }),
    ).toBeInTheDocument()
  })
})
