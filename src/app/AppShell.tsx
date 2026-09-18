import { LogOut, Moon, Sun } from 'lucide-react'
import { Suspense } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { NAV_ITEMS, ROUTES } from './routes'
import { useThemeSync } from './useThemeSync'

export function AppShell() {
  useThemeSync()
  const mode = useThemeStore((state) => state.mode)
  const toggle = useThemeStore((state) => state.toggle)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate(ROUTES.login, { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-plane text-ink">
      <aside className="flex w-60 shrink-0 flex-col gap-1 border-r border-border p-4">
        <div className="mb-4 px-2 text-sm font-semibold tracking-wide text-ink-muted uppercase">
          Product Analytics OS
        </div>
        <nav aria-label="Navegação principal" className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-2 py-1.5 text-sm font-medium text-ink-secondary hover:bg-surface hover:text-ink',
                  isActive && 'bg-surface text-ink',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={mode === 'light'}
          className="mt-auto flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink-secondary hover:bg-surface hover:text-ink"
        >
          {mode === 'dark' ? (
            <Moon aria-hidden="true" size={16} />
          ) : (
            <Sun aria-hidden="true" size={16} />
          )}
          Tema: {mode === 'dark' ? 'Escuro' : 'Claro'}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink-secondary hover:bg-surface hover:text-ink"
        >
          <LogOut aria-hidden="true" size={16} />
          Sair
        </button>
      </aside>
      <main className="flex-1 p-6">
        <Suspense
          fallback={
            <output className="text-sm text-ink-secondary">Carregando…</output>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
