import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { routeObjects } from './app/router'

describe('roteamento da aplicação', () => {
  it('redireciona / para Product Health', async () => {
    const router = createMemoryRouter(routeObjects, { initialEntries: ['/'] })
    render(<RouterProvider router={router} />)

    expect(
      await screen.findByRole('heading', { name: /product health/i }),
    ).toBeInTheDocument()
  })

  it('navega para AI Analyst via URL direta', async () => {
    const router = createMemoryRouter(routeObjects, {
      initialEntries: ['/ai-analyst'],
    })
    render(<RouterProvider router={router} />)

    expect(
      await screen.findByRole('heading', { name: /ai analyst/i }),
    ).toBeInTheDocument()
  })

  it('exibe a navegação principal com todas as seções', () => {
    const router = createMemoryRouter(routeObjects, {
      initialEntries: ['/product-health'],
    })
    render(<RouterProvider router={router} />)

    expect(
      screen.getByRole('navigation', { name: /navegação principal/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /dashboards/i }),
    ).toBeInTheDocument()
  })
})
