import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SegmentationPage } from './SegmentationPage'

describe('SegmentationPage', () => {
  it('renderiza o gráfico de conversão por device', () => {
    render(<SegmentationPage />)
    expect(
      screen.getByRole('heading', { name: /conversão por device/i }),
    ).toBeInTheDocument()
  })
})
