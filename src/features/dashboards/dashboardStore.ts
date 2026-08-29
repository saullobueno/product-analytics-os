import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DashboardWidget, SavedReport, WidgetType } from './types'

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'w-dau', type: 'dau' },
  { id: 'w-conversion', type: 'conversion' },
  { id: 'w-churn', type: 'churn' },
  { id: 'w-retention', type: 'retention' },
  { id: 'w-funnel', type: 'funnel' },
]

interface DashboardState {
  widgets: DashboardWidget[]
  savedReports: SavedReport[]
  addWidget: (type: WidgetType) => void
  removeWidget: (id: string) => void
  reorderWidgets: (widgets: DashboardWidget[]) => void
  saveCurrentAsReport: (name: string) => void
  loadReport: (id: string) => void
  deleteReport: (id: string) => void
}

/** Dashboard customizável: layout de widgets e relatórios salvos, persistidos em localStorage. */
export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      widgets: DEFAULT_WIDGETS,
      savedReports: [],

      addWidget: (type) =>
        set((state) => ({
          widgets: [...state.widgets, { id: crypto.randomUUID(), type }],
        })),

      removeWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((widget) => widget.id !== id),
        })),

      reorderWidgets: (widgets) => set({ widgets }),

      saveCurrentAsReport: (name) => {
        const trimmed = name.trim()
        if (!trimmed) return
        set((state) => ({
          savedReports: [
            ...state.savedReports,
            {
              id: crypto.randomUUID(),
              name: trimmed,
              widgets: state.widgets,
              createdAt: new Date().toISOString(),
            },
          ],
        }))
      },

      loadReport: (id) => {
        const report = get().savedReports.find((r) => r.id === id)
        if (report) set({ widgets: report.widgets })
      },

      deleteReport: (id) =>
        set((state) => ({
          savedReports: state.savedReports.filter((r) => r.id !== id),
        })),
    }),
    { name: 'pao:dashboard' },
  ),
)
