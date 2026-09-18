import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { DEMO_CREDENTIALS } from '@/features/auth/credentials'
import { useAuthStore } from '@/store/authStore'
import { LoginPage } from './LoginPage'

function renderPage() {
  const router = createMemoryRouter(
    [
      { path: '/login', element: <LoginPage /> },
      { path: '/product-health', element: <div>Product Health</div> },
    ],
    { initialEntries: ['/login'] },
  )
  return render(<RouterProvider router={router} />)
}

beforeEach(() => {
  localStorage.clear()
  useAuthStore.setState({ isAuthenticated: false })
})

describe('LoginPage', () => {
  it('vem com e-mail e senha de demonstração já preenchidos', () => {
    renderPage()

    expect(screen.getByLabelText(/e-mail/i)).toHaveValue(DEMO_CREDENTIALS.email)
    expect(screen.getByLabelText(/senha/i)).toHaveValue(
      DEMO_CREDENTIALS.password,
    )
  })

  it('mostra a credencial de demonstração no rodapé do card', () => {
    renderPage()

    expect(
      screen.getByText(
        `${DEMO_CREDENTIALS.email} / ${DEMO_CREDENTIALS.password}`,
      ),
    ).toBeInTheDocument()
  })

  it('autentica e navega ao submeter com as credenciais preenchidas', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByText('Product Health')).toBeInTheDocument()
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })
})
