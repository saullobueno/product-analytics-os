import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useDashboardStore } from '@/features/dashboards/dashboardStore'
import { DashboardsPage } from './DashboardsPage'

const DEFAULT_WIDGETS = [
  { id: 'w-dau', type: 'dau' as const },
  { id: 'w-conversion', type: 'conversion' as const },
  { id: 'w-churn', type: 'churn' as const },
  { id: 'w-retention', type: 'retention' as const },
  { id: 'w-funnel', type: 'funnel' as const },
]

beforeEach(() => {
  localStorage.clear()
  useDashboardStore.setState({ widgets: DEFAULT_WIDGETS, savedReports: [] })
})

describe('DashboardsPage', () => {
  it('renderiza os widgets padrão', () => {
    render(<DashboardsPage />)
    expect(screen.getByText('DAU')).toBeInTheDocument()
    expect(screen.getByText('Conversion')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /user journey/i }),
    ).toBeInTheDocument()
  })

  it('remover um widget tira ele da tela e libera o botão de adicionar de volta', async () => {
    const user = userEvent.setup()
    render(<DashboardsPage />)

    await user.click(
      screen.getByRole('button', { name: /remover widget dau/i }),
    )

    expect(screen.queryByText('DAU')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+ DAU' })).toBeInTheDocument()
  })

  it('salvar e carregar um relatório restaura o layout salvo', async () => {
    const user = userEvent.setup()
    render(<DashboardsPage />)

    await user.click(
      screen.getByRole('button', { name: /remover widget dau/i }),
    )
    await user.type(screen.getByLabelText(/nome do relatório/i), 'Sem DAU')
    await user.click(
      screen.getByRole('button', { name: /salvar como relatório/i }),
    )

    expect(screen.getByRole('button', { name: 'Sem DAU' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '+ DAU' }))
    expect(screen.getByText('DAU')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sem DAU' }))
    expect(screen.queryByText('DAU')).not.toBeInTheDocument()
  })
})
