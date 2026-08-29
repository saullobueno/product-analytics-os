import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ProductHealthPage } from './ProductHealthPage'

function renderPage(initialEntries = ['/product-health']) {
  const router = createMemoryRouter(
    [{ path: '/product-health', element: <ProductHealthPage /> }],
    { initialEntries },
  )
  return render(<RouterProvider router={router} />)
}

describe('ProductHealthPage', () => {
  it('renderiza as 4 métricas principais e a jornada do usuário', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: /product health/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('DAU')).toBeInTheDocument()
    expect(screen.getByText(/retention/i)).toBeInTheDocument()
    expect(screen.getByText('Conversion')).toBeInTheDocument()
    expect(screen.getByText('Churn')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /user journey/i }),
    ).toBeInTheDocument()
  })

  it('lê o filtro de período da URL', () => {
    renderPage(['/product-health?range=7d'])
    expect(screen.getByRole('button', { name: '7 dias' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('clicar num filtro de device atualiza o botão pressionado', async () => {
    const user = userEvent.setup()
    renderPage()

    const androidButton = screen.getByRole('button', { name: 'Android' })
    expect(androidButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(androidButton)

    expect(androidButton).toHaveAttribute('aria-pressed', 'true')
  })
})
