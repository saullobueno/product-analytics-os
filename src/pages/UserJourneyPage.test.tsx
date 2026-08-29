import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { UserJourneyPage } from './UserJourneyPage'

describe('UserJourneyPage', () => {
  it('renderiza os filtros e o funil da jornada', () => {
    const router = createMemoryRouter(
      [{ path: '/user-journey', element: <UserJourneyPage /> }],
      { initialEntries: ['/user-journey'] },
    )
    render(<RouterProvider router={router} />)

    expect(
      screen.getByRole('heading', { name: /^user journey$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /funil de ativação/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '30 dias' })).toBeInTheDocument()
    expect(screen.getByText('Landing')).toBeInTheDocument()
  })
})
