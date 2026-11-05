import { useEffect, useState } from 'react'
import { ArrowRightLeft, ChevronLeft, ChevronRight, MapPin, Navigation, RefreshCw, Sun, Wallet, WifiOff } from 'lucide-react'
import { AppBar, NetworkBanner, Screen } from '@/components/app/chrome'
import { FakeQR } from '@/components/app/domain'
import { Avatar, Img } from '@/components/ui/primitives'
import { cx, dayShort, time } from '@/lib/format'
import { eventById, me, ticketWalletBooking, venueById } from './bookingData'
import { OfflinePill } from './parts'

/** Stub notch: two half-circles in the page colour cut into the card edge. */
function Notch() {
  return (
    <div className="relative h-6">
      <span className="absolute top-0 -left-3 size-6 rounded-full bg-bg" />
      <span className="absolute top-0 -right-3 size-6 rounded-full bg-bg" />
      <span className="absolute inset-x-5 top-1/2 border-t-2 border-dashed border-line" />
    </div>
  )
}

export function TicketWallet({
  index: initialIndex = 0,
  transferredTo,
  network,
  rotate = true,
}: {
  index?: number
  /** Show this ticket as already transferred to a friend. */
  transferredTo?: string
  network?: 'offline' | 'slow'
  /** Rotate the QR every 15s (off for stable snapshots). */
  rotate?: boolean
}) {
  const b = ticketWalletBooking
  const ev = eventById(b.eventId)
  const v = venueById(b.venueId)
  const tierId = b.tickets?.[0]?.tierId
  const tier = ev.ticketTiers.find((t) => t.id === tierId)
  const count = b.tickets?.reduce((s, t) => s + t.qty, 0) ?? 1
  const [i, setI] = useState(initialIndex)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!rotate) return
    const id = setInterval(() => setTick((t) => t + 1), 15000)
    return () => clearInterval(id)
  }, [rotate])
  const holder = i === 0 ? me.name : transferredTo && i === 1 ? transferredTo : b.guests[i]?.name
  const isTransferred = !!transferredTo && i === 1

  return (
    <Screen
      header={
        <>
          <AppBar title="Your tickets" subtitle={`${ev.title} · ${dayShort(ev.startsAt)}`} />
          {network && <NetworkBanner state={network} />}
        </>
      }
    >
      <div className="px-5 pt-2 pb-8">
        <div className="mb-3 flex items-center justify-between">
          <OfflinePill />
          <span className="text-xs text-faint">Ref {b.ref}</span>
        </div>

        {/* Ticket stub */}
        <div className="overflow-hidden rounded-card bg-surface ring-1 ring-line">
          <div className="flex gap-3 p-4">
            <Img src={ev.photo} alt={ev.title} className="size-16 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-accent uppercase">
                {dayShort(ev.startsAt)} · doors {time(ev.doorsAt)}
              </div>
              <div className="display truncate text-xl">{ev.title}</div>
              <div className="flex items-center gap-1 truncate text-sm text-dim">
                <MapPin className="size-3.5 shrink-0" /> {v.name} · {v.area}
              </div>
            </div>
          </div>
          <Notch />
          <div className="flex flex-col items-center px-4 pt-2 pb-5">
            {isTransferred ? (
              <div className="flex h-[232px] w-[232px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-line text-center">
                <ArrowRightLeft className="size-8 text-dim" />
                <div className="mt-2 font-semibold">Transferred</div>
                <div className="px-6 text-sm text-dim">{transferredTo} has this ticket. Their QR is on their phone.</div>
              </div>
            ) : (
              <div className="relative">
                <FakeQR seed={`${b.ref}-${i}-${tick}`} size={232} />
              </div>
            )}
            {!isTransferred && (
              <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-dim">
                <RefreshCw className="size-3.5 animate-spin text-accent [animation-duration:3s]" />
                Rotating code — screenshots won’t get you in
              </div>
            )}
            <div className="mt-4 flex w-full items-center gap-3 rounded-control bg-surface-2 px-3 py-2.5">
              <Avatar name={holder ?? 'Guest'} size={32} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{holder ?? 'Not assigned yet'}</div>
                <div className="truncate text-xs text-dim">
                  {tier?.name} · {ev.minAge}+ · bring ID
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pager */}
        <div className="mt-4 flex items-center justify-between">
          <button aria-label="Previous ticket" disabled={i === 0} onClick={() => setI(i - 1)} className="flex size-10 items-center justify-center rounded-full bg-surface-2 disabled:opacity-30">
            <ChevronLeft className="size-5" />
          </button>
          <div className="text-center">
            <div className="text-sm font-semibold">
              Ticket {i + 1} of {count}
            </div>
            <div className="mt-1.5 flex justify-center gap-1.5">
              {Array.from({ length: count }, (_, k) => (
                <span key={k} className={cx('h-1.5 rounded-full transition-all', k === i ? 'w-5 bg-accent' : 'w-1.5 bg-line')} />
              ))}
            </div>
          </div>
          <button aria-label="Next ticket" disabled={i === count - 1} onClick={() => setI(i + 1)} className="flex size-10 items-center justify-center rounded-full bg-surface-2 disabled:opacity-30">
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Hints */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-start gap-2 rounded-card border border-line p-3 text-xs text-dim">
            <Sun className="size-4 shrink-0 text-accent-2" />
            <span>
              <b className="block text-text">Brightness up</b>We max it while this is open.
            </span>
          </div>
          <div className="flex items-start gap-2 rounded-card border border-line p-3 text-xs text-dim">
            <WifiOff className="size-4 shrink-0 text-success" />
            <span>
              <b className="block text-text">Works offline</b>No signal at the door? Still scans.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { icon: <ArrowRightLeft className="size-5" />, label: 'Transfer', disabled: isTransferred },
            { icon: <Wallet className="size-5" />, label: 'Add to Wallet' },
            { icon: <Navigation className="size-5" />, label: 'Directions' },
          ].map((a) => (
            <button key={a.label} disabled={a.disabled} className="flex flex-col items-center gap-1.5 rounded-card border border-line bg-surface py-3 text-xs font-semibold disabled:opacity-40">
              <span className="text-accent">{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </Screen>
  )
}
