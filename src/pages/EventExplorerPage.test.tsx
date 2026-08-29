import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { EventExplorerPage } from './EventExplorerPage'

describe('EventExplorerPage', () => {
  it('renderiza a lista de eventos recentes', () => {
    render(<EventExplorerPage />)
    expect(
      screen.getByRole('heading', { name: /event explorer/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('filtrar por device reduz (ou mantém) a contagem de eventos', async () => {
    const user = userEvent.setup()
    render(<EventExplorerPage />)

    const initialHeading = screen.getByText(/^eventos \(\d+\)$/i).textContent
    await user.selectOptions(
      screen.getByLabelText(/filtrar por device/i),
      'android',
    )

    const filteredHeading = screen.getByText(/^eventos \(\d+\)$/i).textContent
    expect(Number(filteredHeading?.match(/\d+/)?.[0])).toBeLessThanOrEqual(
      Number(initialHeading?.match(/\d+/)?.[0]),
    )
  })
})
