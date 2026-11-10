import { useState } from 'react'
import { ChevronRight, Inbox, Search, SlidersHorizontal } from 'lucide-react'
import { Screen } from '@/components/app/chrome'
import { Chip, Segmented, Skeleton } from '@/components/ui/primitives'
import { cedis, cx, dayShort, time } from '@/lib/format'
import { Label, PayLabel, PromoterHeader, PromoterTabBar, StatusPill, TableChip } from './PromoterChrome'
import type { ResStatus } from './promoterData'
import { approvals, reservations, staffById, vaultEvents } from './promoterData'

export type ResFilter = 'all' | 'upcoming' | 'arrived' | 'late' | 'held'

const match = (f: ResFilter, s: ResStatus) => f === 'all' || (f === 'upcoming' ? s === 'booked' : s === f)

export function Reservations({ filter: initial = 'all', query = '', night = 'afrobeats-til-dawn', loading }: { filter?: ResFilter; query?: string; night?: string; loading?: boolean }) {
  const [filter, setFilter] = useState<ResFilter>(initial)
  const [nightId, setNight] = useState(night)
  const isTonight = nightId === 'afrobeats-til-dawn'
  const q = query.toLowerCase()
  const rows = (isTonight ? reservations : [])
    .filter((r) => match(filter, r.status))
    .filter((r) => !q || r.host.toLowerCase().includes(q) || r.ref.toLowerCase().includes(q) || r.tableId.toLowerCase() === q)
    .sort((a, b) => a.tableId.localeCompare(b.tableId))
  const count = (f: ResFilter) => (isTonight ? reservations.filter((r) => match(f, r.status)).length : 0)
  const committed = rows.reduce((s, r) => s + r.quote.commitment, 0)
  const toCollect = rows.reduce((s, r) => s + r.balance, 0)

  return (
    <Screen
      header={
        <PromoterHeader night={false} title="Bookings">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-2.5">
            {vaultEvents.map(({ event }) => (
              <Chip key={event.id} className="h-8 px-3 text-[13px]" selected={nightId === event.id} onClick={() => setNight(event.id)}>
                {event.id === 'afrobeats-til-dawn' ? 'Tonight' : dayShort(event.startsAt)} · {event.title}
              </Chip>
            ))}
          </div>
          <div className="flex gap-2 px-4 pb-2.5">
            <label className="flex h-10 flex-1 items-center gap-2 rounded-control border border-line bg-surface px-3 focus-within:border-accent">
              <Search className="size-4 text-faint" />
              <input defaultValue={query} placeholder="Host, ref or table" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-faint" />
            </label>
            <button aria-label="More filters" className="flex size-10 items-center justify-center rounded-control border border-line bg-surface text-dim">
              <SlidersHorizontal className="size-4" />
            </button>
          </div>
          <div className="px-4 pb-2.5">
            <Segmented
              className="[&>button]:h-8 [&>button]:text-[12px]"
              value={filter}
              onChange={setFilter}
              options={(['all', 'upcoming', 'arrived', 'late', 'held'] as ResFilter[]).map((f) => ({
                value: f,
                label: (
                  <>
                    {f === 'all' ? 'All' : f === 'upcoming' ? 'Due' : f[0].toUpperCase() + f.slice(1)}
                    <span className="text-faint tabular-nums">{count(f)}</span>
                  </>
                ),
              }))}
            />
          </div>
        </PromoterHeader>
      }
      tabBar={<PromoterTabBar active="bookings" badges={{ bookings: approvals.length }} />}
    >
      <button className="mx-4 mt-3 flex w-[calc(100%-2rem)] items-center gap-3 rounded-card border border-warning/40 bg-warning/10 px-3 py-2.5 text-left">
        <Inbox className="size-5 text-warning" />
        <span className="flex-1 text-sm">
          <b>{approvals.length} requests</b> <span className="text-dim">waiting for approval</span>
        </span>
        <ChevronRight className="size-4 text-dim" />
      </button>

      {loading ? (
        <div className="space-y-2 px-4 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="px-8 py-16 text-center">
          <Search className="mx-auto size-8 text-faint" />
          <p className="mt-3 font-semibold">{q ? `No bookings match “${query}”` : isTonight ? 'Nothing in this filter' : 'No table bookings yet for this night'}</p>
          <p className="mt-1 text-sm text-dim">{q ? 'Try the host’s surname, the booking reference or a table like B3.' : 'Share the event link to WhatsApp to get tables moving.'}</p>
        </div>
      ) : (
        <>
          <Label action={<span className="text-xs font-normal text-dim">{rows.length} tables · {cedis(committed)} committed · <span className="text-warning">{cedis(toCollect)}</span> due</span>}>
            {isTonight ? 'Tonight' : 'Night'}
          </Label>
          <ul className="mx-4 mb-6 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
            {rows.map((r) => (
              <li key={r.id}>
                <button className="flex w-full items-center gap-3 px-3 py-2.5 text-left">
                  <TableChip id={r.tableId} status={r.status} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-semibold">{r.host}</span>
                      <StatusPill status={r.status} />
                    </span>
                    <span className="block truncate text-xs text-dim">
                      {r.arrived}/{r.partySize} in · due {time(r.arriveBy)}
                      {r.promoterId && ` · ${staffById(r.promoterId).name.split(' ')[0]}`}
                      {r.source === 'concierge' && ' · Concierge'}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-semibold tabular-nums">{cedis(r.quote.commitment)}</span>
                    <PayLabel pay={r.pay} className={cx('block')} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Screen>
  )
}
