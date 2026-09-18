import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { routeObjects } from './app/router'
import { useAuthStore } from './store/authStore'

// Páginas são carregadas via React.lazy (ver src/app/lazyPages.ts) — o
// import() dinâmico, na primeira resolução "fria" (especialmente sob
// carga, com vários arquivos de teste rodando em paralelo), pode
// passar bastante do timeout padrão do findBy*/do teste.
const LAZY_LOAD_TIMEOUT = 15000

describe('roteamento da aplicação', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ isAuthenticated: true })
  })

  it(
    'redireciona rotas protegidas para /login quando deslogado',
    async () => {
      useAuthStore.setState({ isAuthenticated: false })
      const router = createMemoryRouter(routeObjects, {
        initialEntries: ['/product-health'],
      })
      render(<RouterProvider router={router} />)

      expect(
        await screen.findByRole(
          'heading',
          { name: /product analytics os/i },
          { timeout: LAZY_LOAD_TIMEOUT },
        ),
      ).toBeInTheDocument()
    },
    LAZY_LOAD_TIMEOUT,
  )

  it(
    'redireciona / para Product Health',
    async () => {
      const router = createMemoryRouter(routeObjects, {
        initialEntries: ['/'],
      })
      render(<RouterProvider router={router} />)

      expect(
        await screen.findByRole(
          'heading',
          { name: /product health/i },
          { timeout: LAZY_LOAD_TIMEOUT },
        ),
      ).toBeInTheDocument()
    },
    LAZY_LOAD_TIMEOUT,
  )

  it(
    'navega para AI Analyst via URL direta',
    async () => {
      const router = createMemoryRouter(routeObjects, {
        initialEntries: ['/ai-analyst'],
      })
      render(<RouterProvider router={router} />)

      expect(
        await screen.findByRole(
          'heading',
          { name: /ai analyst/i },
          { timeout: LAZY_LOAD_TIMEOUT },
        ),
      ).toBeInTheDocument()
    },
    LAZY_LOAD_TIMEOUT,
  )

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
