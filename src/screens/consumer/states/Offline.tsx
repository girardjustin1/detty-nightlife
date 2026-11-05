import { useState } from 'react'
import { CircleCheck, QrCode, RefreshCw, Sun, WifiOff } from 'lucide-react'
import { bookings, eventById, tableTiers, venueById } from '@/data/fixtures'
import { NetworkBanner, Screen, Sheet, StatusBar, TabBar } from '@/components/app/chrome'
import { DateBadge, FakeQR } from '@/components/app/domain'
import { Button } from '@/components/ui/primitives'
import { time } from '@/lib/format'

/** Bookings saved on the phone (the ones that are still ahead). */
const cached = bookings.filter((b) => b.status === 'confirmed' || b.status === 'paid-in-full')

/** No connection. The message that matters: your tickets still work. */
export function Offline({
  noTickets,
  openTicket: initialOpen,
  retrying,
}: {
  /** Nothing saved on this phone yet. */
  noTickets?: boolean
  /** Booking id whose QR is open. */
  openTicket?: string
  retrying?: boolean
}) {
  const [open, setOpen] = useState(initialOpen)
  const list = noTickets ? [] : cached
  const ticket = list.find((b) => b.id === open)

  return (
    <Screen
      header={
        <div className="shrink-0 bg-bg">
          <StatusBar />
          <NetworkBanner state="offline" />
        </div>
      }
      tabBar={<TabBar active="bookings" />}
    >
      <div className="px-6 pt-10 pb-6 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface-2 text-dim">
          <WifiOff className="size-8" />
        </span>
        <h1 className="display mt-5 text-[28px] leading-tight">{noTickets ? 'You’re offline' : 'Your tickets still work'}</h1>
        <p className="mt-2 text-[15px] text-dim">
          {noTickets
            ? 'Nothing is saved on this phone yet. Tickets you book are kept here automatically, so they’ll open next time without signal.'
            : 'No signal, no problem. These QR codes are saved on this phone and scan at the door without internet.'}
        </p>
      </div>

      {list.length > 0 && (
        <section className="px-5 pb-6">
          <h2 className="mb-2 px-1 text-xs font-semibold tracking-wider text-faint uppercase">Saved on this phone</h2>
          <div className="divide-y divide-line rounded-card border border-line bg-surface px-4">
            {list.map((b) => {
              const ev = eventById(b.eventId)
              const venue = venueById(b.venueId)
              const tier = b.tierId ? tableTiers[b.venueId]?.find((t) => t.id === b.tierId) : undefined
              return (
                <button key={b.id} onClick={() => setOpen(b.id)} className="flex w-full items-center gap-3 py-3.5 text-left">
                  <DateBadge iso={ev.startsAt} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{ev.title}</span>
                    <span className="block truncate text-sm text-dim">
                      {venue.name} · {time(ev.startsAt)}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-dim">
                      <CircleCheck className="size-3.5 shrink-0 text-success" /> <span className="text-success">Works offline</span> ·{' '}
                      {tier ? `${tier.name}, ${b.partySize} guests` : `${b.partySize} tickets`}
                    </span>
                  </span>
                  <QrCode className="size-6 shrink-0 text-accent" />
                </button>
              )
            })}
          </div>
        </section>
      )}

      <div className="px-5 pb-8">
        <Button variant="secondary" block loading={retrying} icon={<RefreshCw className="size-4" />}>
          {retrying ? 'Reconnecting…' : 'Try again'}
        </Button>
        <p className="mt-3 text-center text-xs text-faint">Browsing and booking need a connection. Last synced today at 2:00pm.</p>
      </div>

      {ticket && (
        <Sheet title={eventById(ticket.eventId).title} onClose={() => setOpen(undefined)}>
          <div className="flex flex-col items-center pb-4 text-center">
            <div className="text-sm text-dim">
              {venueById(ticket.venueId).name} · Ref <b className="text-text">{ticket.ref}</b>
            </div>
            <FakeQR seed={ticket.ref} size={220} className="mt-4" />
            <div className="mt-3 flex items-center gap-1.5 text-xs text-dim">
              <Sun className="size-4" /> Screen brightness turned up for the scanner
            </div>
            <p className="mt-2 text-xs text-faint">Code refreshes from a key saved on this phone — no internet needed. Screenshots won’t scan.</p>
          </div>
        </Sheet>
      )}
    </Screen>
  )
}
