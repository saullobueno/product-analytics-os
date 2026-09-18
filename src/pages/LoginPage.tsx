import { LogIn } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Card } from '@/components/Card'
import { DEMO_CREDENTIALS } from '@/features/auth/credentials'
import { useAuthStore } from '@/store/authStore'

export function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState<string>(DEMO_CREDENTIALS.email)
  const [password, setPassword] = useState<string>(DEMO_CREDENTIALS.password)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (
      email.trim() !== DEMO_CREDENTIALS.email ||
      password !== DEMO_CREDENTIALS.password
    ) {
      setError('Credenciais inválidas — use os dados preenchidos abaixo.')
      return
    }

    login()
    const state = location.state as { from?: { pathname: string } } | null
    navigate(state?.from?.pathname ?? ROUTES.productHealth, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-plane px-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-ink">Product Analytics OS</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Peça de portfólio front-end — sem backend, sem dados reais. Esta tela
          é só uma vitrine de login, não uma autenticação de verdade.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-ink-secondary">
            E-mail
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-md border border-border bg-plane px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-series-1"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-ink-secondary">
            Senha
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-md border border-border bg-plane px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-series-1"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-critical">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-series-1 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <LogIn aria-hidden="true" size={16} />
            Entrar
          </button>
        </form>

        <footer className="mt-6 border-t border-border pt-4 text-xs text-ink-muted">
          Login de demonstração (já preenchido acima):
          <br />
          <span className="text-ink-secondary">
            {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
          </span>
        </footer>
      </Card>
    </div>
  )
}
