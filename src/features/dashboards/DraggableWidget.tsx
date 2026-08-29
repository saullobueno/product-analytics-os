import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'
import type { ReactNode } from 'react'

export interface DraggableWidgetProps {
  id: string
  label: string
  onRemove: () => void
  children: ReactNode
}

export function DraggableWidget({
  id,
  label,
  onRemove,
  children,
}: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Arrastar widget ${label}`}
          className="cursor-grab rounded p-1 text-ink-muted hover:bg-plane hover:text-ink active:cursor-grabbing"
        >
          <GripVertical aria-hidden="true" size={14} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover widget ${label}`}
          className="rounded p-1 text-ink-muted hover:bg-plane hover:text-ink"
        >
          <X aria-hidden="true" size={14} />
        </button>
      </div>
      {children}
    </div>
  )
}
