import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { FloorPlanId, Table } from '@/data/types'
import type { FloorStatus } from '@/components/app/FloorPlan'
import { FloorLegend } from '@/components/app/FloorPlan'
import { BottomBar, Screen } from '@/components/app/chrome'
import { Badge, Button, Chip } from '@/components/ui/primitives'
import { tableQuote } from '@/lib/pricing'
import { cedis, cx } from '@/lib/format'
import { BookingHeader, ContextPill, PlanViewport } from './shared'
import { arrivalSlots, availableTables, bookingCtx, statusOf, tierOf } from './data'
import { TableDetailSheet } from './TableDetailSheet'

/**
 * Step 2 — the floor plan on top (fixed-height, zoomable), tier filter + legend,
 * and a list of available tables kept in sync with the map. Sticky bar shows the pick.
 */
export function PickTable({
  venue: planId = 'vault',
  partySize = 6,
  selectedId: initialSel,
  statuses,
  zoom = 1,
  detailOpen: initialDetail = false,
}: {
  venue?: FloorPlanId
  partySize?: number
  selectedId?: string
  /** Override table statuses (e.g. "only 1 left"). */
  statuses?: Record<string, FloorStatus>
  zoom?: number
  /** Open the table detail sheet for the selected table. */
  detailOpen?: boolean
}) {
  const ctx = bookingCtx(planId)
  const { event, tiers, plan } = ctx
  const fits = tiers.filter((t) => t.capacity >= partySize)
  const [filter, setFilter] = useState<string>('all')
  const [sel, setSel] = useState<string | undefined>(initialSel)
  const [detail, setDetail] = useState(initialDetail)
  const free = availableTables(plan.tables, statuses)
  const list = free
    .filter((t) => tierOf(tiers, t).capacity >= partySize)
    .filter((t) => filter === 'all' || t.tierId === filter)
    .sort((a, b) => tierOf(tiers, a).minSpend - tierOf(tiers, b).minSpend || a.label.localeCompare(b.label))
  const leftIn = (tierId: string) => free.filter((t) => t.tierId === tierId).length
  const selected = plan.tables.find((t) => t.id === sel)
  const selTier = selected && tierOf(tiers, selected)
  const quote = selTier && tableQuote(selTier, [])
  const pick = (t: Table) => {
    if (statusOf(t, statuses) !== 'available') return
    setSel(t.id)
  }

  return (
    <Screen
      header={<BookingHeader step={2} title="Pick your table" context={<ContextPill event={event} partySize={partySize} arrival={arrivalSlots(event.doorsAt)[1]} />} />}
      footer={
        <BottomBar
          summary={
            selected && selTier && quote ? (
              <div>
                <div className="truncate text-xs text-dim">
                  {selected.label} · {selTier.name} · up to {selTier.capacity}
                </div>
                <div className="font-semibold tabular-nums">
                  Min {cedis(selTier.minSpend)} <span className="text-sm font-normal text-dim">· {cedis(quote.dueNow)} now</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-dim">Tap a table on the map or in the list</div>
            )
          }
        >
          <Button size="lg" disabled={!selected} onClick={() => setDetail(true)}>
            {selected ? `Choose ${selected.label}` : 'Choose'}
          </Button>
        </BottomBar>
      }
    >
      <div className="px-5 pt-1">
        <PlanViewport plan={plan} tiers={tiers} selectedId={sel} onSelect={pick} tierFilter={filter === 'all' ? undefined : filter} statuses={statuses} zoom={zoom} />
        <FloorLegend className="mt-2.5" />
      </div>

      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-5">
        <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>
          All · {free.filter((t) => tierOf(tiers, t).capacity >= partySize).length}
        </Chip>
        {fits.map((t) => (
          <Chip key={t.id} selected={filter === t.id} onClick={() => setFilter(t.id)} disabled={leftIn(t.id) === 0}>
            {t.name} · {leftIn(t.id)}
          </Chip>
        ))}
      </div>

      <ul className="space-y-2 px-5 pt-3 pb-6" aria-label="Available tables">
        {list.map((t) => {
          const tier = tierOf(tiers, t)
          const isSel = t.id === sel
          const only = leftIn(t.tierId) === 1
          return (
            <li key={t.id}>
              <div
                className={cx(
                  'flex items-center gap-3 rounded-card border p-3 transition',
                  isSel ? 'border-accent bg-accent/10' : 'border-line bg-surface',
                )}
              >
                <button onClick={() => pick(t)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-pressed={isSel}>
                  <span
                    className={cx(
                      'display flex size-12 shrink-0 items-center justify-center rounded-control text-lg',
                      isSel ? 'bg-accent text-on-accent' : 'bg-surface-2 text-text',
                    )}
                  >
                    {t.label}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate font-semibold">{tier.name}</span>
                      {only && <Badge tone="live">Only 1 left</Badge>}
                    </span>
                    <span className="block truncate text-sm text-dim">
                      Up to {tier.capacity} · {tier.depositPct}% deposit
                    </span>
                    <span className="block text-sm font-semibold tabular-nums">Min {cedis(tier.minSpend)}</span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    pick(t)
                    setDetail(true)
                  }}
                  className="flex h-11 shrink-0 items-center gap-0.5 rounded-control px-2 text-sm font-semibold text-accent"
                  aria-label={`Details for ${t.label}`}
                >
                  Details <ChevronRight className="size-4" />
                </button>
              </div>
            </li>
          )
        })}
        {list.length === 0 && (
          <li className="rounded-card border border-dashed border-line p-5 text-center text-sm text-dim">
            Nothing free in this section for {partySize}. Try another table type, or turn on Notify from the venue page.
          </li>
        )}
      </ul>

      {detail && selected && <TableDetailSheet venue={planId} tableId={selected.id} onClose={() => setDetail(false)} />}
    </Screen>
  )
}
