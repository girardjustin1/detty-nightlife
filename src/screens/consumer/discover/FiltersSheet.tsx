import { useState } from 'react'
import type { ReactNode } from 'react'
import { CalendarDays, Info } from 'lucide-react'
import { events, NOW, tableTiers, venueById } from '@/data/fixtures'
import type { Area, Genre } from '@/data/types'
import { RULES } from '@/lib/pricing'
import { cedis, cx } from '@/lib/format'
import { Sheet } from '@/components/app/chrome'
import { Button, Chip, Toggle } from '@/components/ui/primitives'
import { Discover } from './Discover'
import { allGenres, areas, upcoming } from './discoverData'

export type DateFilter = 'tonight' | 'tomorrow' | 'weekend' | 'pick'
export type PartyFilter = 2 | 4 | 6 | 8 | 10

export type Filters = {
  date: DateFilter | null
  /** Inclusive ISO dates (YYYY-MM-DD) when date = 'pick'. */
  range: [string, string]
  party: PartyFilter | null
  genres: Genre[]
  areas: Area[]
  /** Indices into PRICE_BUCKETS, inclusive. */
  price: [number, number]
  tablesAvailable: boolean
  ticketsAvailable: boolean
  inclFees: boolean
}

export const defaultFilters: Filters = {
  date: null,
  range: ['2026-12-23', '2026-12-27'],
  party: null,
  genres: [],
  areas: [],
  price: [0, 6],
  tablesAvailable: false,
  ticketsAvailable: false,
  inclFees: true,
}

/** Bucket edges in cedis; the last bucket is open-ended. */
const PRICE_EDGES = [0, 250, 500, 1000, 2500, 5000, 10000, Infinity]
const PRICE_BUCKETS = PRICE_EDGES.slice(0, -1).map((lo, i) => [lo, PRICE_EDGES[i + 1]] as const)
const bucketOf = (n: number) => PRICE_BUCKETS.findIndex(([lo, hi]) => n >= lo && n < hi)

const withFee = (n: number, on: boolean) => (on ? Math.round(n * (1 + RULES.ticketFeePct / 100)) : n)

/** Every way in across the fixtures (ticket tiers + table minimums), for the histogram. */
function priceSamples(inclFees: boolean) {
  const out: number[] = []
  for (const e of upcoming()) {
    for (const t of e.ticketTiers) if (t.status === 'on-sale') out.push(withFee(t.price, inclFees))
    for (const t of tableTiers[e.venueId] ?? []) out.push(t.minSpend)
  }
  return out
}

const DAY = NOW.slice(0, 10)
const addDays = (iso: string, n: number) => new Date(Date.parse(iso + 'T00:00:00Z') + n * 864e5).toISOString().slice(0, 10)

export function matchCount(f: Filters) {
  return upcoming(events).filter((e) => {
    const v = venueById(e.venueId)
    const d = e.startsAt.slice(0, 10)
    if (f.date === 'tonight' && d !== DAY) return false
    if (f.date === 'tomorrow' && d !== addDays(DAY, 1)) return false
    if (f.date === 'weekend' && (d < DAY || d > addDays(DAY, 2))) return false
    if (f.date === 'pick' && (d < f.range[0] || d > f.range[1])) return false
    if (f.genres.length && !e.genres.some((g) => f.genres.includes(g))) return false
    if (f.areas.length && !f.areas.includes(v.area)) return false
    if (f.tablesAvailable && e.tablesFrom == null) return false
    if (f.ticketsAvailable && !e.ticketTiers.some((t) => t.status === 'on-sale')) return false
    if (f.party) {
      const fitsTable = (tableTiers[e.venueId] ?? []).some((t) => t.capacity >= f.party!)
      if (f.tablesAvailable ? !fitsTable : !fitsTable && e.ticketsFrom == null) return false
    }
    const entry = Math.min(e.ticketsFrom != null ? withFee(e.ticketsFrom, f.inclFees) : Infinity, e.tablesFrom ?? Infinity)
    const b = bucketOf(entry)
    if (b < f.price[0] || b > f.price[1]) return false
    return true
  }).length
}

/** Filter sheet over Discover. Every control is live; the footer CTA shows the real match count. */
export function FiltersSheet({ initial = {} }: { initial?: Partial<Filters> }) {
  const [f, setF] = useState<Filters>({ ...defaultFilters, ...initial })
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((x) => ({ ...x, [k]: v }))
  const toggleIn = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
  const count = matchCount(f)
  const active =
    (f.date ? 1 : 0) + (f.party ? 1 : 0) + f.genres.length + f.areas.length + (f.price[0] > 0 || f.price[1] < 6 ? 1 : 0) + (f.tablesAvailable ? 1 : 0) + (f.ticketsAvailable ? 1 : 0)

  const samples = priceSamples(f.inclFees)
  const hist = PRICE_BUCKETS.map((_, i) => samples.filter((n) => bucketOf(n) === i).length)
  const maxH = Math.max(...hist, 1)
  const pickBucket = (i: number) => {
    const [lo, hi] = f.price
    if (i < lo) set('price', [i, hi])
    else if (i > hi) set('price', [lo, i])
    else if (i - lo <= hi - i) set('price', [i, hi])
    else set('price', [lo, i])
  }
  const priceLabel = (i: number, edge: 'lo' | 'hi') => {
    const [lo, hi] = PRICE_BUCKETS[i]
    if (edge === 'lo') return cedis(lo)
    return hi === Infinity ? `${cedis(lo)}+` : cedis(hi)
  }

  return (
    <div className="relative h-full">
      <Discover />
      <Sheet
        title={
          <span className="flex items-center gap-2">
            Filters {active > 0 && <span className="rounded-full bg-accent px-2 py-0.5 font-sans text-xs font-bold text-on-accent">{active}</span>}
          </span>
        }
        onClose={() => {}}
        footer={
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setF(defaultFilters)} disabled={active === 0}>
              Clear all
            </Button>
            <Button block disabled={count === 0} className="flex-1">
              {count === 0 ? 'No nights match' : `Show ${count} ${count === 1 ? 'night' : 'nights'}`}
            </Button>
          </div>
        }
      >
        <Group title="When">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['tonight', 'Tonight'],
                ['tomorrow', 'Tomorrow'],
                ['weekend', 'This weekend'],
              ] as [DateFilter, string][]
            ).map(([k, l]) => (
              <Chip key={k} selected={f.date === k} onClick={() => set('date', f.date === k ? null : k)}>
                {l}
              </Chip>
            ))}
            <Chip selected={f.date === 'pick'} onClick={() => set('date', f.date === 'pick' ? null : 'pick')} icon={<CalendarDays className="size-4" />}>
              {f.date === 'pick' ? `${short(f.range[0])} – ${short(f.range[1])}` : 'Pick dates'}
            </Chip>
          </div>
          {f.date === 'pick' && <RangeCalendar range={f.range} onChange={(r) => set('range', r)} />}
        </Group>

        <Group title="Party size" hint="Shows tables that fit your group">
          <div className="flex gap-2">
            {([2, 4, 6, 8, 10] as PartyFilter[]).map((n) => (
              <Chip key={n} selected={f.party === n} onClick={() => set('party', f.party === n ? null : n)} className="flex-1 justify-center px-0">
                {n === 10 ? '10+' : n}
              </Chip>
            ))}
          </div>
        </Group>

        <Group title="Genre">
          <div className="flex flex-wrap gap-2">
            {allGenres.map((g) => (
              <Chip key={g} selected={f.genres.includes(g)} onClick={() => set('genres', toggleIn(f.genres, g))}>
                {g}
              </Chip>
            ))}
          </div>
        </Group>

        <Group title="Area">
          <div className="flex flex-wrap gap-2">
            {areas.map((a) => (
              <Chip key={a} selected={f.areas.includes(a)} onClick={() => set('areas', toggleIn(f.areas, a))}>
                {a}
              </Chip>
            ))}
          </div>
        </Group>

        <Group
          title="Price"
          hint={
            <b className="text-sm text-text">
              {priceLabel(f.price[0], 'lo')} – {priceLabel(f.price[1], 'hi')}
            </b>
          }
        >
          <div className="flex h-16 items-end gap-1.5">
            {hist.map((h, i) => (
              <button
                key={i}
                aria-label={`${priceLabel(i, 'lo')} to ${priceLabel(i, 'hi')}: ${h} options`}
                onClick={() => pickBucket(i)}
                className={cx('flex-1 rounded-t-md transition', i >= f.price[0] && i <= f.price[1] ? 'bg-accent' : 'bg-surface-2')}
                style={{ height: `${Math.max(10, (h / maxH) * 100)}%` }}
              />
            ))}
          </div>
          <div className="relative mt-1 h-6">
            <div className="absolute inset-x-0 top-2.5 h-1 rounded-full bg-surface-2" />
            <div
              className="absolute top-2.5 h-1 rounded-full bg-accent"
              style={{ left: `${(f.price[0] / 7) * 100}%`, right: `${100 - ((f.price[1] + 1) / 7) * 100}%` }}
            />
            {[f.price[0] / 7, (f.price[1] + 1) / 7].map((p, i) => (
              <span key={i} className="absolute top-0 size-6 -translate-x-1/2 rounded-full border-2 border-accent bg-bg shadow" style={{ left: `${p * 100}%` }} />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-xs text-faint">
            <span>{cedis(0)}</span>
            <span>{cedis(1000)}</span>
            <span>{cedis(10000)}+</span>
          </div>
          <p className="mt-2 text-xs text-dim">The cheapest way in: a ticket, or a table’s minimum spend.</p>
        </Group>

        <Group title="Availability" last>
          <ToggleRow label="Tables available" sub="Only nights with a table left for your party" checked={f.tablesAvailable} onChange={(v) => set('tablesAvailable', v)} />
          <ToggleRow label="Tickets available" sub="Hide sold-out nights" checked={f.ticketsAvailable} onChange={(v) => set('ticketsAvailable', v)} />
          <ToggleRow
            label="Prices incl. fees"
            sub={`Ticket prices include the ${RULES.ticketFeePct}% booking fee`}
            checked={f.inclFees}
            onChange={(v) => set('inclFees', v)}
          />
          {count === 0 && (
            <div className="mt-3 flex items-start gap-2 rounded-card border border-warning/40 bg-warning/5 p-3 text-sm text-dim">
              <Info className="mt-0.5 size-4 shrink-0 text-warning" />
              Nothing matches all of these. Try removing an area or widening the price range.
            </div>
          )}
        </Group>
      </Sheet>
    </div>
  )
}

const short = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })

function Group({ title, hint, children, last }: { title: string; hint?: ReactNode; children: ReactNode; last?: boolean }) {
  return (
    <section className={cx('py-4', !last && 'border-b border-line')}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h4 className="shrink-0 font-semibold">{title}</h4>
        {hint && <span className="truncate text-xs text-dim">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

function ToggleRow({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-medium">{label}</div>
        <div className="text-xs text-dim">{sub}</div>
      </div>
      <Toggle label={label} checked={checked} onChange={onChange} />
    </div>
  )
}

/** Two-week range picker starting Monday 14 Dec. Days before today are disabled. */
function RangeCalendar({ range, onChange }: { range: [string, string]; onChange: (r: [string, string]) => void }) {
  const start = '2026-12-14'
  const days = Array.from({ length: 21 }, (_, i) => addDays(start, i))
  const [lo, hi] = range
  const tap = (d: string) => {
    if (d < lo || lo !== hi) onChange([d, d])
    else onChange([lo, d])
  }
  return (
    <div className="mt-3 rounded-card border border-line bg-bg p-3">
      <div className="mb-2 text-center text-sm font-semibold">December 2026</div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={i} className="pb-1 text-faint">
            {d}
          </span>
        ))}
        {days.map((d) => {
          const past = d < DAY
          const inRange = d >= lo && d <= hi
          const edge = d === lo || d === hi
          return (
            <button
              key={d}
              disabled={past}
              onClick={() => tap(d)}
              className={cx(
                'mx-auto flex size-9 items-center justify-center rounded-full text-sm tabular-nums disabled:text-faint disabled:line-through',
                edge ? 'bg-accent font-bold text-on-accent' : inRange ? 'bg-accent/20 text-text' : 'text-text',
                d === DAY && !edge && 'ring-1 ring-accent',
                !inRange && d.slice(5, 7) !== '12' && 'text-faint',
              )}
            >
              {Number(d.slice(8))}
            </button>
          )
        })}
      </div>
    </div>
  )
}
