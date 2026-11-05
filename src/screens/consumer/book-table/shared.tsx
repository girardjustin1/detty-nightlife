import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Hand, Pencil, Users, ZoomIn, ZoomOut } from 'lucide-react'
import type { AccraEvent, Table, TableTier } from '@/data/types'
import type { FloorPlan as Plan } from '@/data/floorplans'
import { AppBar } from '@/components/app/chrome'
import { FloorPlan, type FloorStatus } from '@/components/app/FloorPlan'
import { IconButton } from '@/components/ui/primitives'
import { cx, dayShort, time } from '@/lib/format'

export const STEPS = ['Party & time', 'Table', 'Bottles', 'Guests', 'Review'] as const

/** Step header: app bar with "Step n of 5", a segmented progress bar, and the context pill. */
export function BookingHeader({
  step,
  title,
  optional,
  onBack,
  trailing,
  context,
}: {
  step: number
  title: string
  optional?: boolean
  onBack?: () => void
  trailing?: ReactNode
  context?: ReactNode
}) {
  return (
    <div className="z-20 shrink-0 bg-bg">
      <AppBar title={title} subtitle={optional ? `Optional · before step ${STEPS.length}` : `Step ${step} of ${STEPS.length}`} onBack={onBack} trailing={trailing} />
      <div className="flex gap-1 px-5" aria-hidden>
        {STEPS.map((s, i) => (
          <span key={s} className={cx('h-1 flex-1 rounded-full', i < step ? 'bg-accent' : 'bg-surface-2')} />
        ))}
      </div>
      {context && <div className="px-5 pt-3 pb-2">{context}</div>}
    </div>
  )
}

/** Sticky "event · date · party" pill (Resy). Tap to change party, time or night. */
export function ContextPill({ event, partySize, arrival, onEdit }: { event: AccraEvent; partySize: number; arrival?: string; onEdit?: () => void }) {
  return (
    <button
      onClick={onEdit}
      aria-label="Change party size or arrival time"
      className="flex h-10 w-full items-center gap-2 rounded-control border border-line bg-surface px-3.5 text-left text-sm active:scale-[0.99]"
    >
      <span className="flex shrink-0 items-center gap-1 font-semibold">
        <CalendarDays className="size-3.5 text-dim" /> {dayShort(event.startsAt)}
        {arrival && <> · {time(arrival)}</>}
        <span className="text-dim">·</span>
        <Users className="size-3.5 text-dim" /> {partySize}
      </span>
      <span className="min-w-0 flex-1 truncate text-dim">{event.title}</span>
      <Pencil className="size-4 shrink-0 text-accent" />
    </button>
  )
}

/** Non-interactive thumbnail of the plan with one table highlighted. */
export function MiniPlan({ plan, tiers, tableId, statuses, className }: { plan: Plan; tiers: TableTier[]; tableId?: string; statuses?: Record<string, FloorStatus>; className?: string }) {
  return (
    <div className={cx('pointer-events-none shrink-0', className)} aria-hidden>
      {/* promoter mode: same colours, no price bubble — right for a thumbnail */}
      <FloorPlan plan={plan} tiers={tiers} selectedId={tableId} statuses={statuses} showZones={false} mode="promoter" />
    </div>
  )
}

/**
 * The floor plan in a fixed-height viewport, so the list below stays reachable
 * with one thumb. Zoom scales the plan inside a scroll container (pinch intent);
 * on zoom we scroll the selected table into the middle.
 */
export function PlanViewport({
  plan,
  tiers,
  selectedId,
  onSelect,
  tierFilter,
  statuses,
  zoom: initialZoom = 1,
  height = 340,
}: {
  plan: Plan
  tiers: TableTier[]
  selectedId?: string
  onSelect?: (t: Table) => void
  tierFilter?: string
  statuses?: Record<string, FloorStatus>
  zoom?: number
  height?: number
}) {
  const [zoom, setZoom] = useState(initialZoom)
  const box = useRef<HTMLDivElement>(null)
  const fitWidth = Math.round((height * plan.width) / plan.height)
  const width = Math.round(fitWidth * zoom)

  useEffect(() => {
    const el = box.current
    const t = plan.tables.find((x) => x.id === selectedId)
    if (!el || zoom === 1) return
    const scale = width / plan.width
    const cx_ = t ? t.x * scale : width / 2
    const cy = t ? t.y * scale : (plan.height * scale) / 2
    el.scrollTo({ left: Math.max(0, cx_ - el.clientWidth / 2), top: Math.max(0, cy - el.clientHeight / 2) })
  }, [zoom, selectedId, width, plan])

  return (
    <div className="relative">
      <div ref={box} className="no-scrollbar overflow-auto rounded-card border border-line bg-black" style={{ height }}>
        <div className={cx(zoom === 1 && 'mx-auto')} style={{ width }}>
          <FloorPlan plan={plan} tiers={tiers} selectedId={selectedId} onSelect={onSelect} tierFilter={tierFilter} statuses={statuses} className="rounded-none border-0" />
        </div>
      </div>
      <div className="absolute right-2 bottom-2 flex flex-col gap-1.5">
        <IconButton label="Zoom in" tone="glass" onClick={() => setZoom((z) => Math.min(3, +(z + 0.75).toFixed(2)))} disabled={zoom >= 3}>
          <ZoomIn className="size-5" />
        </IconButton>
        <IconButton label="Zoom out" tone="glass" onClick={() => setZoom((z) => Math.max(1, +(z - 0.75).toFixed(2)))} disabled={zoom <= 1}>
          <ZoomOut className="size-5" />
        </IconButton>
      </div>
      {zoom > 1 && (
        <span className="pointer-events-none absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          <Hand className="size-3.5" /> Pinch or drag to explore
        </span>
      )}
    </div>
  )
}

/** Icon + label + value fact row (OpenTable / SeatGeek). */
export function Fact({ icon, title, body }: { icon: ReactNode; title: ReactNode; body?: ReactNode }) {
  return (
    <div className="flex gap-3 py-2.5">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-accent">{icon}</span>
      <div className="min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        {body && <div className="text-sm text-dim">{body}</div>}
      </div>
    </div>
  )
}

/** Small label above a section inside a step. */
export function StepTitle({ title, sub }: { title: string; sub?: ReactNode }) {
  return (
    <div className="px-5 pt-4 pb-3">
      <h2 className="display text-2xl">{title}</h2>
      {sub && <p className="mt-1 text-sm text-dim">{sub}</p>}
    </div>
  )
}
