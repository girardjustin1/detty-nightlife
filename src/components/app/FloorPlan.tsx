import { useState } from 'react'
import type { FloorPlan as Plan } from '@/data/floorplans'
import type { Table, TableTier } from '@/data/types'
import { cedis, cx } from '@/lib/format'

export type FloorStatus = Table['status'] | 'arrived' | 'late'

const statusStyle: Record<FloorStatus, { fill: string; stroke: string; text: string; dash?: string }> = {
  available: { fill: 'color-mix(in srgb, var(--accent) 28%, transparent)', stroke: 'var(--accent)', text: 'var(--text)' },
  held: { fill: 'color-mix(in srgb, var(--warning) 18%, transparent)', stroke: 'var(--warning)', text: 'var(--warning)', dash: '10 8' },
  booked: { fill: 'rgb(0 0 0 / 0.55)', stroke: 'rgb(255 255 255 / 0.18)', text: 'rgb(255 255 255 / 0.4)' },
  unavailable: { fill: 'rgb(0 0 0 / 0.55)', stroke: 'rgb(255 255 255 / 0.12)', text: 'rgb(255 255 255 / 0.3)' },
  arrived: { fill: 'color-mix(in srgb, var(--success) 30%, transparent)', stroke: 'var(--success)', text: 'var(--text)' },
  late: { fill: 'color-mix(in srgb, var(--danger) 25%, transparent)', stroke: 'var(--danger)', text: 'var(--text)' },
}

export const floorLegend: Record<'consumer' | 'promoter', { status: FloorStatus; label: string }[]> = {
  consumer: [
    { status: 'available', label: 'Available' },
    { status: 'held', label: 'Being booked' },
    { status: 'booked', label: 'Taken' },
  ],
  promoter: [
    { status: 'available', label: 'Free' },
    { status: 'booked', label: 'Booked' },
    { status: 'arrived', label: 'Arrived' },
    { status: 'late', label: 'Late' },
    { status: 'held', label: 'Held' },
  ],
}

/**
 * Interactive floor plan. The venue artwork (a Higgsfield SVG, ~10–20 KB) is
 * a single <image>; tables are vector hit targets drawn on top, so they stay
 * crisp at any zoom and cost almost nothing to ship.
 */
export function FloorPlan({
  plan,
  tiers,
  selectedId,
  onSelect,
  tierFilter,
  statuses,
  showZones = true,
  className,
  mode = 'consumer',
}: {
  plan: Plan
  tiers: TableTier[]
  selectedId?: string
  onSelect?: (t: Table) => void
  /** Dim tables outside this tier. */
  tierFilter?: string
  /** Promoter view: override per-table status. */
  statuses?: Record<string, FloorStatus>
  showZones?: boolean
  className?: string
  mode?: 'consumer' | 'promoter'
}) {
  const [internal, setInternal] = useState<string | undefined>(selectedId)
  const selected = selectedId ?? internal
  const tierOf = (t: Table) => tiers.find((x) => x.id === t.tierId)

  return (
    <div className={cx('relative overflow-hidden rounded-card border border-line bg-black', className)}>
      <svg viewBox={`0 0 ${plan.width} ${plan.height}`} className="block h-auto w-full" role="group" aria-label="Venue floor plan">
        <image href={plan.src} width={plan.width} height={plan.height} />
        {showZones &&
          plan.zones.map((z) => (
            <text key={z.label} x={z.x} y={z.y} textAnchor="middle" fontSize={26} fontWeight={700} fill="rgb(255 255 255 / 0.55)" style={{ letterSpacing: 2, textTransform: 'uppercase' }}>
              {z.label.toUpperCase()}
            </text>
          ))}
        {plan.tables.map((t) => {
          const status: FloorStatus = statuses?.[t.id] ?? t.status
          const s = statusStyle[status]
          const isSel = selected === t.id
          const dimmed = tierFilter && t.tierId !== tierFilter
          const clickable = mode === 'promoter' || status === 'available'
          const w = t.w ?? (t.shape === 'booth' ? 120 : 84)
          const h = t.h ?? (t.shape === 'booth' ? 104 : 84)
          const r = t.shape === 'round' ? w / 2 : t.shape === 'booth' ? 40 : 26
          return (
            <g
              key={t.id}
              role="button"
              tabIndex={clickable ? 0 : -1}
              aria-label={`Table ${t.label}, ${tierOf(t)?.name ?? ''}, ${status}`}
              aria-pressed={isSel}
              onClick={() => {
                if (!clickable) return
                setInternal(t.id)
                onSelect?.(t)
              }}
              onKeyDown={(e) => {
                if (clickable && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  setInternal(t.id)
                  onSelect?.(t)
                }
              }}
              style={{ cursor: clickable ? 'pointer' : 'not-allowed', opacity: dimmed ? 0.25 : 1, outline: 'none' }}
            >
              {isSel && (
                <rect x={t.x - w / 2 - 14} y={t.y - h / 2 - 14} width={w + 28} height={h + 28} rx={r + 14} fill="none" stroke="var(--accent)" strokeWidth={6} opacity={0.5}>
                  <animate attributeName="opacity" values="0.6;0.15;0.6" dur="1.6s" repeatCount="indefinite" />
                </rect>
              )}
              <rect
                x={t.x - w / 2}
                y={t.y - h / 2}
                width={w}
                height={h}
                rx={r}
                fill={isSel ? 'var(--accent)' : s.fill}
                stroke={isSel ? 'var(--accent)' : s.stroke}
                strokeWidth={isSel ? 6 : 4}
                strokeDasharray={s.dash}
              />
              <text x={t.x} y={t.y + 10} textAnchor="middle" fontSize={30} fontWeight={800} fill={isSel ? 'var(--on-accent)' : s.text}>
                {t.label}
              </text>
            </g>
          )
        })}
        {(() => {
          const t = plan.tables.find((x) => x.id === selected)
          const tier = t && tierOf(t)
          if (!t || !tier || mode === 'promoter') return null
          const bw = 250
          const above = t.y > 180
          const bx = Math.min(Math.max(t.x - bw / 2, 12), plan.width - bw - 12)
          const by = above ? t.y - (t.h ?? 104) / 2 - 110 : t.y + (t.h ?? 104) / 2 + 24
          return (
            <g pointerEvents="none">
              <rect x={bx} y={by} width={bw} height={84} rx={20} fill="var(--bg)" stroke="var(--accent)" strokeWidth={3} />
              <text x={bx + bw / 2} y={by + 36} textAnchor="middle" fontSize={26} fontWeight={800} fill="var(--text)">
                {tier.name} · {t.label}
              </text>
              <text x={bx + bw / 2} y={by + 68} textAnchor="middle" fontSize={24} fill="var(--dim)">
                Min {cedis(tier.minSpend)} · {tier.capacity} guests
              </text>
            </g>
          )
        })()}
      </svg>
    </div>
  )
}

export function FloorLegend({ mode = 'consumer', className }: { mode?: 'consumer' | 'promoter'; className?: string }) {
  return (
    <div className={cx('flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-dim', className)}>
      {floorLegend[mode].map((l) => (
        <span key={l.status} className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-full border-2" style={{ background: statusStyle[l.status].fill, borderColor: statusStyle[l.status].stroke }} />
          {l.label}
        </span>
      ))}
    </div>
  )
}
