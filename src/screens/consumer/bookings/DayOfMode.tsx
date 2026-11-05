import { useEffect, useState } from 'react'
import { Clock, MessageCircle, Navigation, Phone, RefreshCw, Sun, X } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { BOOKING_WHATSAPP, whatsappLink } from '@/config/contact'
import { NetworkBanner, Screen, StatusBar } from '@/components/app/chrome'
import { FakeQR } from '@/components/app/domain'
import { AvatarStack, Button, Chip, IconButton } from '@/components/ui/primitives'
import { cx, time } from '@/lib/format'
import { eventById, hostGuestRows, tierFor, tonightBooking, venueById } from './bookingData'
import { OfflinePill, waButtonClass } from './parts'

const pad = (n: number) => String(n).padStart(2, '0')


export function DayOfMode({ now = '2026-12-18T23:05:00Z', network, lateSheet }: { now?: string; network?: 'offline' | 'slow'; lateSheet?: boolean }) {
  const brand = useBrand()
  const b = tonightBooking
  const ev = eventById(b.eventId)
  const v = venueById(b.venueId)
  const tier = tierFor(b)!
  const cutoff = new Date(b.arriveBy!).getTime()
  const [ms, setMs] = useState(cutoff - new Date(now).getTime())
  useEffect(() => {
    const id = setInterval(() => setMs((m) => m - 1000), 1000)
    return () => clearInterval(id)
  }, [])
  const left = Math.max(0, ms)
  const h = Math.floor(left / 3_600_000)
  const m = Math.floor((left % 3_600_000) / 60_000)
  const s = Math.floor((left % 60_000) / 1000)
  const late = ms <= 0
  const tight = !late && ms < 30 * 60_000
  const withPass = hostGuestRows.filter((g) => g.state === 'paid' || g.state === 'pending').map((g) => g.name)

  return (
    <Screen
      header={
        <div className="shrink-0 bg-bg">
          <StatusBar />
          {network && <NetworkBanner state={network} />}
          <div className="flex items-center gap-3 px-5 pt-1 pb-2">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold tracking-wide text-accent uppercase">Tonight · {v.name}</div>
              <div className="display truncate text-xl">{ev.title}</div>
            </div>
            <IconButton label="Close day-of mode">
              <X className="size-5" />
            </IconButton>
          </div>
        </div>
      }
    >
      <div className="px-5 pb-8">
        {/* QR first */}
        <div className="flex flex-col items-center rounded-card bg-surface p-5 ring-1 ring-line">
          <FakeQR seed={`${b.ref}-dayof`} size={236} />
          <div className="mt-3 text-center">
            <div className="font-semibold">
              Host QR · {tier.name} {b.tableId}
            </div>
            <div className="text-sm text-dim">Checks in your table of {b.partySize}</div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <OfflinePill />
            <span className="inline-flex items-center gap-1 text-xs text-dim">
              <RefreshCw className="size-3.5" /> Rotating
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-dim">
              <Sun className="size-3.5" /> Brightness up
            </span>
          </div>
        </div>

        {/* Cut-off countdown */}
        <div className={cx('mt-3 rounded-card border p-4', late ? 'border-danger/50 bg-danger/10' : tight ? 'border-warning/50 bg-warning/10' : 'border-line bg-surface')}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className={cx('flex items-center gap-1.5 text-sm font-semibold', late ? 'text-danger' : tight ? 'text-warning' : 'text-dim')}>
                <Clock className="size-4" /> {late ? 'Past the arrival cut-off' : `Arrive by ${time(b.arriveBy!)}`}
              </div>
              <div className="mt-0.5 text-xs text-dim">{late ? 'Tell the venue now so they hold the booth a little longer.' : 'After that the venue can release your table.'}</div>
            </div>
            {!late && (
              <div className="display text-3xl tabular-nums">
                {h > 0 && `${h}:`}
                {pad(m)}:{pad(s)}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="secondary" icon={<Navigation className="size-4" />}>
            Directions
          </Button>
          <a href={`tel:${BOOKING_WHATSAPP.e164}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-control border border-line bg-surface-2 px-5 text-[15px] font-semibold text-text">
            <Phone className="size-4" /> Call host
          </a>
        </div>
        <a
          href={whatsappLink(`Booking ${b.ref}: running 15 min late`)}
          target="_blank"
          rel="noreferrer"
          className={cx(
            'mt-2 h-11 text-[15px]',
            late || tight ? waButtonClass : 'inline-flex w-full items-center justify-center gap-2 rounded-control border border-line bg-surface-2 font-semibold text-text',
          )}
        >
          <MessageCircle className="size-4" /> Running late? Tell the venue
        </a>

        {lateSheet && (
          <div className="mt-3 rounded-card border border-line bg-surface p-4">
            <div className="text-sm font-semibold">Send on WhatsApp to {brand.name} bookings</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {['running 15 min late', 'running 30 min late', 'parking now', 'some of us are inside'].map((x, i) => (
                <a key={x} href={whatsappLink(`Booking ${b.ref}: ${x}`)} target="_blank" rel="noreferrer">
                  <Chip selected={i === 0}>{x[0].toUpperCase() + x.slice(1)}</Chip>
                </a>
              ))}
            </div>
            <p className="mt-2 text-xs text-dim">We pass it straight to {v.name}’s host stand. Tables are held up to {time(b.arriveBy!)}; anything later is their call.</p>
          </div>
        )}

        {/* People */}
        <div className="mt-4 divide-y divide-line rounded-card border border-line px-4">
          <div className="flex items-center gap-3 py-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-accent">
              <Phone className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-medium">{brand.name} bookings</div>
              <div className="text-sm text-dim">{BOOKING_WHATSAPP.display} · calls and WhatsApp · ref {b.ref}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 py-3">
            <AvatarStack names={withPass} size={28} />
            <div className="min-w-0 flex-1 text-sm text-dim">{withPass.length} friends have their own pass</div>
            <button className="text-sm font-semibold text-accent">Guests</button>
          </div>
          <div className="py-3 text-sm text-dim">
            {v.address} · {v.dressCode.split('.')[0]} · {ev.minAge}+ with ID
          </div>
        </div>
      </div>
    </Screen>
  )
}
