import { useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, Flame, SlidersHorizontal } from 'lucide-react'
import { cedis, cx } from '@/lib/format'
import { Img } from '@/components/ui/primitives'
import type { MapSpot, VenueMapDef } from './types'
import { ListingSheet } from './ListingSheet'
import { VenueMap, demandDot } from './VenueMap'

export type MapPickerProps = {
  map: VenueMapDef
  event: { title: string; when: string; venue: string; photo: string }
  /** Party size for tables, ticket count for sections/zones. */
  qty: number
  selectedId?: string
  /** Open the listing sheet for the selected spot. */
  sheetOpen?: boolean
  callouts?: 'selected' | 'all' | 'none'
  initialZoom?: number
  depositPct?: number
  onBack?: () => void
  onContinue?: (s: MapSpot) => void
}

type Sort = 'value' | 'low' | 'high'

/**
 * Full-screen "pick on the map" step, SeatGeek-style: event pill on top,
 * map with price pins in the middle, a synced list at the bottom. Tapping a
 * pin or a row opens the listing sheet.
 */
export function MapPicker({ map, event, qty, selectedId, sheetOpen = false, callouts = 'selected', initialZoom = 1, depositPct = 30, onBack, onContinue }: MapPickerProps) {
  const [sel, setSel] = useState<string | undefined>(selectedId)
  const [open, setOpen] = useState(sheetOpen)
  const [sort, setSort] = useState<Sort>('value')
  const [dealsOnly, setDealsOnly] = useState(false)
  const spot = map.spots.find((s) => s.id === sel)

  const list = useMemo(() => {
    const avail = map.spots.filter((s) => !s.soldOut && (!dealsOnly || s.demand === 'deal'))
    const rank = { deal: 0, fair: 1, high: 2 }
    return [...avail].sort((a, b) => (sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : rank[a.demand] - rank[b.demand] || a.price - b.price))
  }, [map, sort, dealsOnly])
  const from = Math.min(...map.spots.filter((s) => !s.soldOut).map((s) => s.price))
  const kindWord = map.spots[0]?.kind === 'table' ? 'tables' : 'listings'

  if (open && spot)
    return (
      <ListingSheet
        map={map}
        spot={spot}
        qty={qty}
        depositPct={depositPct}
        similar={list.filter((s) => s.id !== spot.id && s.kind === spot.kind).slice(0, 4)}
        onBack={() => setOpen(false)}
        onContinue={() => onContinue?.(spot)}
        onPickSimilar={(s) => setSel(s.id)}
      />
    )

  return (
    <div className="flex h-full flex-col bg-bg text-text">
      {/* Event pill */}
      <div className="shrink-0 px-3 pt-12 pb-2">
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Back" onClick={onBack} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2">
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-control border border-line bg-surface px-2 py-1.5">
            <Img src={event.photo} alt="" className="size-9 shrink-0 rounded-[8px]" />
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-sm font-semibold">{event.title}</div>
              <div className="truncate text-xs text-dim">
                {event.when} · {event.venue}
              </div>
            </div>
            <ChevronDown className="size-4 shrink-0 text-dim" />
          </div>
        </div>
        <div className="no-scrollbar mt-2.5 flex gap-2 overflow-x-auto">
          <span className="inline-flex h-8 shrink-0 items-center rounded-control bg-accent px-3 text-[13px] font-semibold text-on-accent">
            {qty} {kindWord === 'tables' ? 'guests' : 'tickets'}
          </span>
          <button type="button" onClick={() => setDealsOnly((d) => !d)} className={cx('inline-flex h-8 shrink-0 items-center gap-1 rounded-control border px-3 text-[13px] font-semibold', dealsOnly ? 'border-accent text-accent' : 'border-line')}>
            <span className="size-2 rounded-full" style={{ background: demandDot.deal }} /> Deals only
          </button>
          {(['value', 'low', 'high'] as Sort[]).map((s) => (
            <button key={s} type="button" onClick={() => setSort(s)} className={cx('inline-flex h-8 shrink-0 items-center rounded-control border px-3 text-[13px]', sort === s ? 'border-text font-semibold' : 'border-line text-dim')}>
              {s === 'value' ? 'Best value' : s === 'low' ? 'Price ↑' : 'Price ↓'}
            </button>
          ))}
          <span className="inline-flex h-8 shrink-0 items-center gap-1 rounded-control border border-line px-3 text-[13px] text-dim">
            <SlidersHorizontal className="size-3.5" /> Filters
          </span>
        </div>
      </div>

      <VenueMap map={map} selectedId={sel} onSelect={(s) => setSel(s.id)} callouts={callouts} initialZoom={initialZoom} className="min-h-0 flex-[1.25]" />

      {/* Synced list */}
      <div className="flex min-h-0 flex-1 flex-col rounded-t-[22px] border-t border-line bg-bg">
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-line" />
        <div className="flex shrink-0 items-baseline justify-between px-5 pt-2 pb-1">
          <div className="font-semibold">
            {list.length} {kindWord}
          </div>
          <div className="text-sm text-dim">from {cedis(from)} · incl. fees</div>
        </div>
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-8">
          {list.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => (s.id === sel ? setOpen(true) : setSel(s.id))}
              className={cx('flex w-full items-center gap-3 rounded-card px-2.5 py-2.5 text-left', s.id === sel && 'bg-surface-2')}
            >
              <VenueMap map={map} focusId={s.id} zoomable={false} pins={false} className="aspect-[4/3] w-16 shrink-0 rounded-[8px]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  {s.hot && <Flame className="size-3.5 fill-[#ff7a1a] text-[#ff5a00]" />}
                  {s.label}
                </div>
                <div className="truncate text-sm text-dim">
                  {s.capacity ? `Up to ${s.capacity}` : 'Standing'}
                  {s.left != null && s.left <= 3 ? ` · ${s.left} left` : ''}
                  {s.rise ? ` · ↗ ${cedis(s.rise.to)} ${s.rise.at ? `at ${s.rise.at}` : 'soon'}` : ''}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5 font-bold">
                  <span className="size-2 rounded-full" style={{ background: demandDot[s.demand] }} />
                  {cedis(s.price)}
                </div>
                <div className="text-[11px] text-dim">{s.kind === 'table' ? 'minimum' : 'each'}</div>
              </div>
            </button>
          ))}
        </div>
        {spot && (
          <div className="shrink-0 border-t border-line px-5 pt-3 pb-8">
            <button type="button" onClick={() => setOpen(true)} className="flex h-13 w-full items-center justify-center gap-2 rounded-control bg-accent font-semibold text-on-accent">
              View {spot.label} · {cedis(spot.price)}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
