import { useState } from 'react'
import { BellRing, ChevronRight, Ellipsis, Navigation, QrCode, Receipt, Ticket, Wine } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { Screen, StatusBar, TabBar, NetworkBanner } from '@/components/app/chrome'
import { Button, Card, IconButton, Img, Segmented, Skeleton } from '@/components/ui/primitives'
import { dayShort, time } from '@/lib/format'
import { eventById, notifyItems, pastList, tierFor, upcomingList, venueById, type ListItem } from './bookingData'
import { OfflinePill, StatusChip } from './parts'

export type BookingsSegment = 'upcoming' | 'past'

function BookingCard({ item }: { item: ListItem }) {
  const { booking: b, chip, note } = item
  const ev = eventById(b.eventId)
  const v = venueById(b.venueId)
  const tier = tierFor(b)
  const what = b.kind === 'table' ? `${tier?.name} ${b.tableId} · ${b.partySize} guests` : `${b.partySize} × ${ev.ticketTiers.find((t) => t.id === b.tickets?.[0]?.tierId)?.name ?? 'Ticket'}`
  const faded = chip === 'cancelled' || chip === 'refunded'
  return (
    <Card className="flex gap-3 p-3">
      <Img src={ev.photo} alt={ev.title} className={faded ? 'size-[72px] shrink-0 opacity-50 grayscale' : 'size-[72px] shrink-0'} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-accent uppercase">
              {dayShort(ev.startsAt)} · {time(ev.startsAt)}
            </div>
            <div className="truncate font-semibold">{ev.title}</div>
          </div>
          <IconButton label="Booking actions" tone="plain" className="-mt-1.5 -mr-2 size-8">
            <Ellipsis className="size-5 text-dim" />
          </IconButton>
        </div>
        <div className="flex items-center gap-1.5 truncate text-sm text-dim">
          {b.kind === 'table' ? <Wine className="size-3.5 shrink-0" /> : <Ticket className="size-3.5 shrink-0" />}
          <span className="truncate">
            {v.name} · {what}
          </span>
        </div>
        <div className="mt-1.5">
          <StatusChip status={chip} />
        </div>
        {note && <div className="mt-1 truncate text-xs text-dim">{note}</div>}
      </div>
    </Card>
  )
}

function TonightCard({ item }: { item: ListItem }) {
  const b = item.booking
  const ev = eventById(b.eventId)
  const v = venueById(b.venueId)
  const tier = tierFor(b)
  return (
    <div className="overflow-hidden rounded-card border-2 border-accent bg-surface">
      <div className="relative h-32">
        <Img src={ev.photo} alt={ev.title} rounded={false} className="absolute inset-0" />
        <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        <span className="absolute top-3 left-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-on-accent uppercase">Tonight</span>
        <div className="absolute inset-x-0 bottom-0 px-4 pb-2.5 text-white">
          <div className="display truncate text-2xl">{ev.title}</div>
          <div className="text-sm text-white/80">
            {v.name} · doors {time(ev.doorsAt)}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="font-semibold">
              {tier?.name} {b.tableId} · {b.partySize} guests
            </div>
            <div className="text-sm text-dim">Arrive by {time(b.arriveBy!)} or the table is released</div>
          </div>
          <StatusChip status={item.chip} />
        </div>
        <div className="mt-3 flex gap-2">
          <Button block icon={<QrCode className="size-5" />}>
            Show QR
          </Button>
          <Button variant="secondary" icon={<Navigation className="size-4" />} className="shrink-0">
            Directions
          </Button>
        </div>
        <div className="mt-3 flex justify-center">
          <OfflinePill />
        </div>
      </div>
    </div>
  )
}

export function BookingsTab({ segment: initial = 'upcoming', empty, loading, network }: { segment?: BookingsSegment; empty?: boolean; loading?: boolean; network?: 'offline' | 'slow' }) {
  const brand = useBrand()
  const [segment, setSegment] = useState<BookingsSegment>(initial)
  const list = empty ? [] : segment === 'upcoming' ? upcomingList : pastList
  const [pinned, ...rest] = segment === 'upcoming' ? list : [undefined, ...list]
  const notified = notifyItems.filter((n) => n.notified).length

  return (
    <Screen
      header={
        <div className="shrink-0 bg-bg">
          <StatusBar />
          {network && <NetworkBanner state={network} />}
          <div className="flex items-center justify-between px-5 pt-1 pb-3">
            <h1 className="display text-3xl">Bookings</h1>
            <IconButton label="Receipts">
              <Receipt className="size-5" />
            </IconButton>
          </div>
          <div className="px-5 pb-3">
            <Segmented
              value={segment}
              onChange={setSegment}
              options={[
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'past', label: 'Past' },
              ]}
            />
          </div>
        </div>
      }
      tabBar={<TabBar active="bookings" bookingsBadge={empty ? undefined : 1} />}
    >
      {loading ? (
        <div className="space-y-3 px-5 pt-1">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center px-8 pt-20 text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-surface-2 text-accent">
            <Ticket className="size-9" />
          </span>
          <p className="display mt-5 text-2xl">{brand.copy.emptyBookings}</p>
          <p className="mt-2 text-sm text-dim">Tickets and tables you book show up here, with QR codes that work offline at the door.</p>
          <Button className="mt-6">Find a night</Button>
          <button className="mt-3 text-sm font-semibold text-accent">Have a guest invite link?</button>
        </div>
      ) : (
        <div className="space-y-3 px-5 pt-1 pb-6">
          {pinned && <TonightCard item={pinned} />}
          {segment === 'upcoming' && (
            <button className="flex w-full items-center gap-3 rounded-card border border-line bg-surface px-4 py-3 text-left">
              <span className="relative flex size-9 items-center justify-center rounded-full bg-surface-2 text-accent">
                <BellRing className="size-[18px]" />
                {notified > 0 && <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-accent-3 ring-2 ring-surface" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">Notify list · {notifyItems.length}</span>
                <span className="block truncate text-sm text-dim">{notified > 0 ? 'A VIP booth opened at The Vault' : 'We’ll ping you when a table opens'}</span>
              </span>
              <ChevronRight className="size-5 text-faint" />
            </button>
          )}
          {rest.map((it) => it && <BookingCard key={it.booking.id} item={it} />)}
        </div>
      )}
    </Screen>
  )
}
