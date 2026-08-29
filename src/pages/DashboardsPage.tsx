import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  SortableContext,
} from '@dnd-kit/sortable'
import { X } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Card } from '@/components/Card'
import { DraggableWidget } from '@/features/dashboards/DraggableWidget'
import { useDashboardStore } from '@/features/dashboards/dashboardStore'
import { WIDGET_LABELS, type WidgetType } from '@/features/dashboards/types'
import { WidgetContent } from '@/features/dashboards/WidgetContent'
import { useHeadlineMetrics } from '@/features/product-health/useHeadlineMetrics'

const ALL_WIDGET_TYPES: WidgetType[] = [
  'dau',
  'conversion',
  'churn',
  'retention',
  'funnel',
]

export function DashboardsPage() {
  const {
    widgets,
    addWidget,
    removeWidget,
    reorderWidgets,
    savedReports,
    saveCurrentAsReport,
    loadReport,
    deleteReport,
  } = useDashboardStore()
  const metrics = useHeadlineMetrics('30d', 'all')
  const [reportName, setReportName] = useState('')

  // PointerSensor cobre mouse/touch; KeyboardSensor garante que dá pra
  // reordenar sem mouse (Tab até a alça, Space para pegar, setas para
  // mover, Space para soltar) — ver skill dataviz / ADR de dashboards.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = widgets.findIndex((w) => w.id === active.id)
    const newIndex = widgets.findIndex((w) => w.id === over.id)
    reorderWidgets(arrayMove(widgets, oldIndex, newIndex))
  }

  function handleSaveReport(event: FormEvent) {
    event.preventDefault()
    saveCurrentAsReport(reportName)
    setReportName('')
  }

  const availableTypes = ALL_WIDGET_TYPES.filter(
    (type) => !widgets.some((widget) => widget.type === type),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-ink">Dashboards</h1>
        <div className="flex flex-wrap items-center gap-2">
          {availableTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addWidget(type)}
              className="rounded-full border border-border px-3 py-1.5 text-sm text-ink-secondary hover:bg-surface hover:text-ink"
            >
              + {WIDGET_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSaveReport} className="flex gap-2">
          <label htmlFor="report-name" className="sr-only">
            Nome do relatório
          </label>
          <input
            id="report-name"
            value={reportName}
            onChange={(event) => setReportName(event.target.value)}
            placeholder="Nome do relatório"
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-ink placeholder:text-ink-muted"
          />
          <button
            type="submit"
            className="rounded-lg bg-series-1 px-3 py-1.5 text-sm font-medium text-white"
          >
            Salvar como relatório
          </button>
        </form>

        {savedReports.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-ink-muted uppercase">
              Relatórios salvos
            </span>
            {savedReports.map((report) => (
              <span
                key={report.id}
                className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-xs text-ink-secondary"
              >
                <button
                  type="button"
                  onClick={() => loadReport(report.id)}
                  className="hover:text-ink"
                >
                  {report.name}
                </button>
                <button
                  type="button"
                  onClick={() => deleteReport(report.id)}
                  aria-label={`Excluir relatório ${report.name}`}
                  className="hover:text-critical"
                >
                  <X aria-hidden="true" size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {widgets.length === 0 ? (
        <Card className="text-sm text-ink-secondary">
          Nenhum widget no dashboard — adicione um acima.
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={widgets.map((widget) => widget.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {widgets.map((widget) => (
                <DraggableWidget
                  key={widget.id}
                  id={widget.id}
                  label={WIDGET_LABELS[widget.type]}
                  onRemove={() => removeWidget(widget.id)}
                >
                  <WidgetContent type={widget.type} metrics={metrics} />
                </DraggableWidget>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
