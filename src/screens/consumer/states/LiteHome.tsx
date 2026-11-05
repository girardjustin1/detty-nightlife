import { Bell, Feather, Search } from 'lucide-react'
import { BrandProvider, useBrand } from '@/brands/BrandContext'
import { events, venueById } from '@/data/fixtures'
import type { AccraEvent } from '@/data/types'
import { Logo, NetworkBanner, Screen, StatusBar, TabBar } from '@/components/app/chrome'
import { Badge, Chip, IconButton } from '@/components/ui/primitives'
import { cedis, dayShort, time } from '@/lib/format'

const fromPrice = (e: AccraEvent) => Math.min(e.ticketsFrom ?? Infinity, e.tablesFrom ?? Infinity)

function LiteRow({ e }: { e: AccraEvent }) {
  const v = venueById(e.venueId)
  return (
    <button className="flex w-full items-baseline gap-3 py-2.5 text-left">
      <span className="w-14 shrink-0 text-xs font-semibold text-accent uppercase tabular-nums">{time(e.startsAt)}</span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate font-semibold">{e.title}</span>
          {e.sellingFast && <span className="size-1.5 shrink-0 rounded-full bg-accent-3" aria-label="Selling fast" />}
        </span>
        <span className="block truncate text-sm text-dim">
          {v.name} · {v.area}
        </span>
      </span>
      <span className="shrink-0 text-sm tabular-nums">
        <span className="text-faint">from </span>
        <b>{cedis(fromPrice(e))}</b>
      </span>
    </button>
  )
}

function LiteHomeInner({ slow }: { slow?: boolean }) {
  const brand = useBrand()
  const sorted = [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt)).filter((e) => e.startsAt >= '2026-12-18')
  const byDay = sorted.reduce<Record<string, AccraEvent[]>>((acc, e) => {
    const d = dayShort(e.startsAt)
    ;(acc[d] ??= []).push(e)
    return acc
  }, {})

  return (
    <Screen
      header={
        <div className="shrink-0 bg-bg">
          <StatusBar />
          {slow && <NetworkBanner state="slow" />}
          <div className="flex items-center justify-between px-5 pt-1 pb-2">
            <div className="flex items-center gap-2">
              <Logo className="h-6 w-auto" />
              <Badge tone="neutral">
                <Feather className="size-3" /> Lite
              </Badge>
            </div>
            <div className="flex gap-2">
              <IconButton label="Search">
                <Search className="size-5" />
              </IconButton>
              <IconButton label="Notifications">
                <Bell className="size-5" />
              </IconButton>
            </div>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-2.5">
            {['All', 'Tonight', 'Tables', 'Afrobeats', 'Amapiano', 'Highlife'].map((c, i) => (
              <Chip key={c} selected={i === 0} className="h-8 px-3 text-[13px]">
                {c}
              </Chip>
            ))}
          </div>
        </div>
      }
      tabBar={<TabBar active="discover" bookingsBadge={1} />}
    >
      <div className="mx-5 mb-3 flex items-center gap-2.5 rounded-control bg-surface px-3.5 py-2 text-xs text-dim">
        <Feather className="size-4 shrink-0 text-accent-2" />
        <span className="flex-1">Data saver is on: photos hidden, lists kept short.</span>
        <button className="font-semibold text-accent">Turn off</button>
      </div>
      <div className="px-5 pb-1 text-sm text-dim">{brand.copy.homeGreeting}</div>
      {Object.entries(byDay).map(([day, list]) => (
        <section key={day} className="px-5 pt-3">
          <h2 className="border-b border-line pb-1.5 text-xs font-bold tracking-wider text-faint uppercase">{day}</h2>
          <div className="divide-y divide-line">
            {list.map((e) => (
              <LiteRow key={e.id} e={e} />
            ))}
          </div>
        </section>
      ))}
      <p className="px-5 pt-4 pb-8 text-center text-xs text-faint">Tap a night to load its details. Photos load only when you ask.</p>
    </Screen>
  )
}

/**
 * Low-data "lite" home: no images at all, a compact text list grouped by night.
 * Forces data saver on for everything inside, whatever the toolbar says.
 */
export function LiteHome({ slow }: { /** Show the slow-connection banner too. */ slow?: boolean }) {
  const brand = useBrand()
  return (
    <BrandProvider brand={brand.id} dataSaver>
      <LiteHomeInner slow={slow} />
    </BrandProvider>
  )
}
