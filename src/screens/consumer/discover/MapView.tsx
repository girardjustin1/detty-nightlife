import { useEffect, useRef, useState } from 'react'
import { List, LocateFixed, Search as SearchIcon, SlidersHorizontal, WifiOff } from 'lucide-react'
import { events, tableTiers, venues } from '@/data/fixtures'
import type { Area } from '@/data/types'
import { cedis, cx, dayShort } from '@/lib/format'
import { NetworkBanner, Screen, StatusBar, TabBar } from '@/components/app/chrome'
import { priceLevel, Rating } from '@/components/app/domain'
import { Badge, Chip, IconButton, Img } from '@/components/ui/primitives'
import { AccraMap } from './AccraMap'
import { tonightPrice, upcoming } from './discoverData'

const nextAt = (venueId: string) => upcoming(events.filter((e) => e.venueId === venueId))[0]

/**
 * Map view (toggle from Discover). A stylised SVG of Accra instead of map
 * tiles: pins carry tonight's price, the bottom carousel stays in sync with
 * the selected pin (tap a pin → card scrolls into view, and vice versa).
 */
export function MapView({
  selectedId: initialSelected = 'vault',
  tablesOnly = false,
  area,
  network,
}: {
  selectedId?: string
  /** "Tables tonight" filter chip. */
  tablesOnly?: boolean
  /** Restrict to one area (shows the empty state when nothing is there). */
  area?: Area
  network?: 'offline' | 'slow'
}) {
  const [selected, setSelected] = useState(initialSelected)
  const [tables, setTables] = useState(tablesOnly)
  const list = venues.filter((v) => (!tables || tableTiers[v.id]?.length) && (!area || v.area === area))
  const rail = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rail.current?.querySelector<HTMLElement>(`[data-venue="${selected}"]`)
    if (el && rail.current) rail.current.scrollTo({ left: el.offsetLeft - 20, behavior: 'smooth' })
  }, [selected])

  const pins = venues.map((v) => {
    const p = tonightPrice(v)
    const inList = list.some((x) => x.id === v.id)
    return {
      id: v.id,
      label: !inList ? '' : tables ? cedis(Math.min(...tableTiers[v.id].map((t) => t.minSpend))) : p.amount != null ? cedis(p.amount) : 'Closed',
      selected: inList && v.id === selected,
      muted: !inList || p.amount == null,
    }
  })

  return (
    <Screen tabBar={<TabBar active="discover" bookingsBadge={1} />} bodyClassName="relative">
      <div className="absolute inset-0">
        <AccraMap pins={pins} onPin={setSelected} />
      </div>

      {/* top overlay */}
      <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-bg via-bg/80 to-transparent pb-6">
        <StatusBar />
        {network && <NetworkBanner state={network} />}
        <div className="flex items-center gap-2 px-5 pt-1">
          <button className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-control border border-line bg-surface px-4 text-left text-sm">
            <SearchIcon className="size-4 shrink-0 text-dim" />
            <span className="truncate">
              <b>Accra</b> <span className="text-dim">· Tonight · Fri 18 Dec</span>
            </span>
          </button>
          <IconButton label="Filters">
            <SlidersHorizontal className="size-5" />
          </IconButton>
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pt-3">
          <Chip selected={!tables} onClick={() => setTables(false)}>
            All venues
          </Chip>
          <Chip selected={tables} onClick={() => setTables(true)}>
            Tables tonight
          </Chip>
          <Chip>Afrobeats</Chip>
          <Chip>Amapiano</Chip>
        </div>
      </div>

      {/* bottom: carousel + list toggle */}
      <div className="absolute inset-x-0 bottom-0 z-10 pb-3">
        <div className="mb-3 flex items-center justify-between px-5">
          <Badge tone="glass" className="gap-1.5">
            <WifiOff className="size-3" /> 2 KB map · works offline
          </Badge>
          <span className="flex items-center gap-2">
            <IconButton label="My location" className="size-9 border border-line">
              <LocateFixed className="size-4" />
            </IconButton>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-control bg-text px-4 text-sm font-semibold text-bg shadow-lg">
              <List className="size-4" /> List
            </button>
          </span>
        </div>
        {list.length === 0 ? (
          <div className="mx-5 rounded-card border border-line bg-surface p-4">
            <div className="font-semibold">Nothing in {area} {tables ? 'with tables ' : ''}tonight</div>
            <p className="mt-1 text-sm text-dim">Tidal Beach Club is general admission only. Zoom out, or turn off “Tables tonight”.</p>
            <div className="mt-3 flex gap-2">
              <Chip onClick={() => setTables(false)}>Show all venues</Chip>
            </div>
          </div>
        ) : (
          <div ref={rail} className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-5">
            {list.map((v) => {
              const p = tonightPrice(v)
              const sel = v.id === selected
              return (
                <button
                  key={v.id}
                  data-venue={v.id}
                  onClick={() => setSelected(v.id)}
                  className={cx(
                    'flex w-[300px] shrink-0 snap-start gap-3 rounded-card border bg-surface p-2.5 text-left shadow-xl transition',
                    sel ? 'border-accent' : 'border-line',
                  )}
                >
                  <Img src={v.photo} alt={v.name} className="aspect-square w-24 shrink-0" />
                  <div className="min-w-0 flex-1 py-0.5">
                    <div className="truncate font-semibold">{v.name}</div>
                    <div className="truncate text-xs text-dim">
                      {v.kind} · {v.area} · {priceLevel(v.priceLevel)}
                    </div>
                    <Rating value={v.rating} count={v.reviewCount} className="mt-1 text-xs" />
                    <div className="mt-1.5 truncate text-sm">
                      {p.amount != null ? (
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-xs text-dim">{p.event ? `Tonight: ${p.event.title}` : `${p.label} tonight`}</span>
                          <span className="shrink-0 text-xs text-dim">
                            from <b className="text-sm text-text">{cedis(p.amount)}</b>
                          </span>
                        </div>
                      ) : (
                        <span className="text-dim">
                          Nothing on tonight
                          {nextAt(v.id) && <> · Next {dayShort(nextAt(v.id)!.startsAt)}</>}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </Screen>
  )
}
