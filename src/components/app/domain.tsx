import type { ReactNode } from 'react'
import { Check, Heart, MapPin, Music2, Star } from 'lucide-react'
import type { AccraEvent, TableTier, Venue } from '@/data/types'
import { venueById } from '@/data/fixtures'
import { cedis, cx, dateBadge, dayShort, time } from '@/lib/format'
import { Badge, Img, ProgressBar } from '@/components/ui/primitives'

export function DateBadge({ iso, className }: { iso: string; className?: string }) {
  const d = dateBadge(iso)
  return (
    <div className={cx('flex w-12 shrink-0 flex-col items-center rounded-control bg-surface-2 py-1.5 leading-none', className)}>
      <span className="text-[10px] font-bold tracking-wider text-accent">{d.month}</span>
      <span className="display mt-0.5 text-xl">{d.day}</span>
      <span className="mt-0.5 text-[10px] text-dim">{d.weekday}</span>
    </div>
  )
}

export function GenreTags({ genres, className }: { genres: string[]; className?: string }) {
  return (
    <div className={cx('flex flex-wrap gap-1.5', className)}>
      {genres.map((g) => (
        <span key={g} className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-0.5 text-xs text-dim">
          <Music2 className="size-3" />
          {g}
        </span>
      ))}
    </div>
  )
}

export function PriceFrom({ event }: { event: AccraEvent }) {
  return (
    <span className="text-sm text-dim">
      {event.ticketsFrom != null && (
        <>
          Tickets <b className="text-text">{cedis(event.ticketsFrom)}</b>
        </>
      )}
      {event.ticketsFrom != null && event.tablesFrom != null && ' · '}
      {event.tablesFrom != null && (
        <>
          Tables <b className="text-text">{cedis(event.tablesFrom)}</b>
        </>
      )}
    </span>
  )
}

/** SeatGeek-style event card. `hero` = full-width poster, `row` = horizontal list item, `tile` = carousel tile. */
export function EventCard({ event, variant = 'tile', saved, onClick }: { event: AccraEvent; variant?: 'hero' | 'row' | 'tile'; saved?: boolean; onClick?: () => void }) {
  const venue = venueById(event.venueId)
  if (variant === 'hero') {
    return (
      <button onClick={onClick} className="relative block aspect-[4/5] w-full overflow-hidden rounded-card text-left">
        <Img src={event.photo} alt={event.title} rounded={false} className="absolute inset-0" />
        <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {event.tags.slice(0, 2).map((t) => (
            <Badge key={t} tone={t === 'Selling fast' || t === 'Almost gone' ? 'live' : 'glass'}>
              {t}
            </Badge>
          ))}
        </div>
        <SaveHeart saved={saved} className="absolute top-3 right-3" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <div className="text-xs font-semibold tracking-wide text-white/80 uppercase">
            {dayShort(event.startsAt)} · {time(event.startsAt)} · {venue.name}
          </div>
          <div className="display mt-1 text-[28px]">{event.title}</div>
          <div className="mt-1 text-sm text-white/80">{event.lineup.map((a) => a.name).slice(0, 3).join(' · ')}</div>
          <div className="mt-3 flex items-center justify-between">
            <GenreTags genres={event.genres.slice(0, 2)} className="[&>span]:border-white/30 [&>span]:text-white/90" />
            <span className="text-sm text-white/80">
              from <b className="text-white">{cedis(Math.min(event.ticketsFrom ?? Infinity, event.tablesFrom ?? Infinity))}</b>
            </span>
          </div>
        </div>
      </button>
    )
  }
  if (variant === 'row') {
    return (
      <button onClick={onClick} className="flex w-full items-center gap-3 py-2.5 text-left">
        <Img src={event.photo} alt={event.title} className="size-20 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-accent uppercase">
            {dayShort(event.startsAt)} · {time(event.startsAt)}
          </div>
          <div className="truncate text-[17px] font-semibold">{event.title}</div>
          <div className="truncate text-sm text-dim">
            {venue.name} · {venue.area}
          </div>
          <div className="mt-0.5">
            <PriceFrom event={event} />
          </div>
        </div>
        <SaveHeart saved={saved} plain />
      </button>
    )
  }
  return (
    <button onClick={onClick} className="block w-56 shrink-0 text-left">
      <div className="relative">
        <Img src={event.photo} alt={event.title} className="aspect-[4/3] w-full" />
        <DateBadge iso={event.startsAt} className="absolute bottom-2 left-2 bg-bg/90 backdrop-blur" />
        {event.sellingFast && (
          <Badge tone="live" className="absolute top-2 left-2">
            Selling fast
          </Badge>
        )}
      </div>
      <div className="mt-2 truncate font-semibold">{event.title}</div>
      <div className="truncate text-sm text-dim">
        {venue.name} · {time(event.startsAt)}
      </div>
      <div className="truncate text-sm text-dim">{event.genres.join(' · ')}</div>
    </button>
  )
}

export function SaveHeart({ saved, className, plain }: { saved?: boolean; className?: string; plain?: boolean }) {
  return (
    <span
      role="button"
      aria-label={saved ? 'Saved' : 'Save'}
      className={cx('inline-flex size-9 items-center justify-center rounded-full', plain ? 'text-dim' : 'bg-black/40 text-white backdrop-blur-md', className)}
    >
      <Heart className={cx('size-5', saved && 'fill-accent text-accent')} />
    </span>
  )
}

export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1 text-sm', className)}>
      <Star className="size-4 fill-accent-2 text-accent-2" />
      <b>{value.toFixed(1)}</b>
      {count != null && <span className="text-dim">({count.toLocaleString()})</span>}
    </span>
  )
}

export const priceLevel = (n: number) => '₵'.repeat(n)

/** Resy-style venue card: the table tiers sit on the card as chips, so the list itself is bookable. */
export function VenueCard({ venue, tiers, onClick, tonight }: { venue: Venue; tiers?: (TableTier & { left: number })[]; onClick?: () => void; tonight?: string }) {
  return (
    <div className="py-3">
      <button onClick={onClick} className="block w-full text-left">
        <Img src={venue.photo} alt={venue.name} className="aspect-[16/9] w-full" />
        <div className="mt-2.5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[17px] font-semibold">{venue.name}</div>
            <div className="flex items-center gap-1 truncate text-sm text-dim">
              <MapPin className="size-3.5" />
              {venue.kind} · {venue.area} · {priceLevel(venue.priceLevel)}
            </div>
          </div>
          <Rating value={venue.rating} count={venue.reviewCount} />
        </div>
        {tonight && <div className="mt-1 text-sm">Tonight: <b>{tonight}</b></div>}
      </button>
      {tiers && (
        <div className="no-scrollbar -mx-5 mt-2.5 flex gap-2 overflow-x-auto px-5">
          {tiers.map((t) => (
            <button
              key={t.id}
              className={cx(
                'shrink-0 rounded-control px-3.5 py-2 text-left',
                t.left > 0 ? 'bg-accent text-on-accent' : 'border border-line text-dim',
              )}
            >
              <div className="text-[11px] font-bold tracking-wide uppercase opacity-80">{t.name}</div>
              <div className="text-sm font-semibold">{t.left > 0 ? `Min ${cedis(t.minSpend)}` : 'Notify me'}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** The new pattern: how far the bottle selection is toward the table minimum. */
export function MinSpendMeter({ spent, minimum, compact }: { spent: number; minimum: number; compact?: boolean }) {
  const met = spent >= minimum
  return (
    <div className={cx(compact ? '' : 'rounded-card border border-line bg-surface p-4')}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm text-dim">{met ? 'Minimum met' : 'Toward table minimum'}</span>
        <span className="text-sm tabular-nums">
          <b className={cx('text-base', met ? 'text-success' : 'text-text')}>{cedis(spent)}</b>
          <span className="text-dim"> / {cedis(minimum)}</span>
        </span>
      </div>
      <ProgressBar value={spent} max={minimum} tone={met ? 'success' : 'accent'} className="mt-2" />
      <div className="mt-1.5 flex items-center gap-1 text-xs text-dim">
        {met ? (
          <>
            <Check className="size-3.5 text-success" /> Anything extra is added to your tab at the venue.
          </>
        ) : (
          <>{cedis(minimum - spent)} to go — or top up on the night.</>
        )}
      </div>
    </div>
  )
}

export function PriceLines({ lines, total, totalLabel = 'Total' }: { lines: { label: ReactNode; value: number; muted?: boolean }[]; total?: number; totalLabel?: string }) {
  return (
    <dl className="space-y-2 text-sm">
      {lines.map((l, i) => (
        <div key={i} className={cx('flex justify-between gap-4', l.muted && 'text-dim')}>
          <dt>{l.label}</dt>
          <dd className="tabular-nums">{cedis(l.value)}</dd>
        </div>
      ))}
      {total != null && (
        <div className="flex justify-between gap-4 border-t border-line pt-2 text-base font-semibold">
          <dt>{totalLabel}</dt>
          <dd className="tabular-nums">{cedis(total)}</dd>
        </div>
      )}
    </dl>
  )
}

/** Resy-style policy block: concrete date, time and cedi amounts. Shown on review, booking detail and cancel. */
export function PolicyBlock({ items, tone = 'neutral' }: { items: { title: string; body: ReactNode }[]; tone?: 'neutral' | 'warning' }) {
  return (
    <div className={cx('rounded-card border p-4', tone === 'warning' ? 'border-warning/40 bg-warning/5' : 'border-line bg-surface')}>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.title}>
            <div className="text-sm font-semibold">{it.title}</div>
            <div className="text-sm text-dim">{it.body}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Deterministic fake QR for drafts (not scannable). Real build: signed, rotating token. */
export function FakeQR({ seed, size = 200, className }: { seed: string; size?: number; className?: string }) {
  const n = 25
  let h = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
  const rnd = () => ((h = (h * 1103515245 + 12345) >>> 0) / 2 ** 32)
  const cells: [number, number][] = []
  const finder = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7)
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!finder(x, y) && rnd() > 0.52) cells.push([x, y])
  const Eye = ({ x, y }: { x: number; y: number }) => (
    <g>
      <rect x={x} y={y} width={7} height={7} fill="#000" />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="#000" />
    </g>
  )
  return (
    <svg viewBox={`-2 -2 ${n + 4} ${n + 4}`} width={size} height={size} className={cx('rounded-xl bg-white', className)} shapeRendering="crispEdges" role="img" aria-label="Entry QR code">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#000" />
      ))}
      <Eye x={0} y={0} />
      <Eye x={n - 7} y={0} />
      <Eye x={0} y={n - 7} />
    </svg>
  )
}

export const paymentLabels: Record<string, { name: string; short: string; color: string }> = {
  'mtn-momo': { name: 'MTN Mobile Money', short: 'MTN MoMo', color: '#FFCC00' },
  'telecel-cash': { name: 'Telecel Cash', short: 'Telecel', color: '#E60000' },
  'at-money': { name: 'AT Money', short: 'AT Money', color: '#0066B3' },
  card: { name: 'Visa / Mastercard', short: 'Card', color: '#8b8b9a' },
  lightning: { name: 'Bitcoin · Lightning', short: 'Lightning', color: '#F7931A' },
}

export function PaymentMark({ method, size = 36 }: { method: keyof typeof paymentLabels | string; size?: number }) {
  const p = paymentLabels[method]
  const text = method === 'lightning' ? '⚡' : method === 'card' ? '💳' : p.short.slice(0, method === 'mtn-momo' ? 3 : 2).toUpperCase()
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-lg text-[11px] font-black"
      style={{ width: size, height: size, background: p.color, color: method === 'mtn-momo' ? '#000' : '#fff' }}
    >
      {text}
    </span>
  )
}
