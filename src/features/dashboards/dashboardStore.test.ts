import { beforeEach, describe, expect, it } from 'vitest'
import { useDashboardStore } from './dashboardStore'

const DEFAULT_WIDGET_COUNT = 5

beforeEach(() => {
  localStorage.clear()
  useDashboardStore.setState({
    widgets: [
      { id: 'w-dau', type: 'dau' },
      { id: 'w-conversion', type: 'conversion' },
      { id: 'w-churn', type: 'churn' },
      { id: 'w-retention', type: 'retention' },
      { id: 'w-funnel', type: 'funnel' },
    ],
    savedReports: [],
  })
})

describe('useDashboardStore', () => {
  it('começa com os widgets padrão', () => {
    expect(useDashboardStore.getState().widgets).toHaveLength(
      DEFAULT_WIDGET_COUNT,
    )
  })

  it('addWidget adiciona um widget novo com id único', () => {
    useDashboardStore.getState().addWidget('dau')
    const widgets = useDashboardStore.getState().widgets
    expect(widgets).toHaveLength(DEFAULT_WIDGET_COUNT + 1)
    expect(new Set(widgets.map((w) => w.id)).size).toBe(widgets.length)
  })

  it('removeWidget remove pelo id', () => {
    useDashboardStore.getState().removeWidget('w-dau')
    expect(
      useDashboardStore.getState().widgets.find((w) => w.id === 'w-dau'),
    ).toBeUndefined()
  })

  it('reorderWidgets substitui a ordem completa', () => {
    const reversed = [...useDashboardStore.getState().widgets].reverse()
    useDashboardStore.getState().reorderWidgets(reversed)
    expect(useDashboardStore.getState().widgets).toEqual(reversed)
  })

  it('saveCurrentAsReport salva um snapshot dos widgets atuais', () => {
    useDashboardStore.getState().saveCurrentAsReport('Meu relatório')
    const reports = useDashboardStore.getState().savedReports
    expect(reports).toHaveLength(1)
    expect(reports[0].name).toBe('Meu relatório')
    expect(reports[0].widgets).toEqual(useDashboardStore.getState().widgets)
  })

  it('ignora nomes vazios ao salvar um relatório', () => {
    useDashboardStore.getState().saveCurrentAsReport('   ')
    expect(useDashboardStore.getState().savedReports).toHaveLength(0)
  })

  it('loadReport restaura os widgets do relatório salvo', () => {
    useDashboardStore.getState().removeWidget('w-funnel')
    useDashboardStore.getState().saveCurrentAsReport('Sem funil')
    const reportId = useDashboardStore.getState().savedReports[0].id

    useDashboardStore.getState().addWidget('dau')
    useDashboardStore.getState().loadReport(reportId)

    expect(useDashboardStore.getState().widgets).toHaveLength(
      DEFAULT_WIDGET_COUNT - 1,
    )
  })

  it('deleteReport remove o relatório salvo', () => {
    useDashboardStore.getState().saveCurrentAsReport('Temporário')
    const reportId = useDashboardStore.getState().savedReports[0].id
    useDashboardStore.getState().deleteReport(reportId)
    expect(useDashboardStore.getState().savedReports).toHaveLength(0)
  })
})
