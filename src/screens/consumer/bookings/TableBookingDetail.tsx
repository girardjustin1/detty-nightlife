import type { ReactNode } from 'react'
import { Car, ChevronRight, Clock, MapPin, Maximize2, Navigation, Share2, Shirt, Users } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { BOOKING_WHATSAPP, whatsappLink } from '@/config/contact'
import { AppBar, BottomBar, NetworkBanner, Screen } from '@/components/app/chrome'
import { FakeQR, MinSpendMeter, PolicyBlock, PriceLines } from '@/components/app/domain'
import { AvatarStack, Button, Card, IconButton, ProgressBar } from '@/components/ui/primitives'
import { bottleById } from '@/data/fixtures'
import { RULES } from '@/lib/pricing'
import { cedis, cx, dayLong, dayShort, time } from '@/lib/format'
import type { Booking } from '@/data/types'
import { bandDeadline, eventById, guestRowsFor, methodLine, NOW, quoteFor, refundFor, refundTable, splitFor, tierFor, tonightBooking, venueById, type ChipStatus } from './bookingData'
import { FactRow, MiniFloorPlan, OfflinePill, StatusChip, WhatsAppRow } from './parts'

function Section({ title, action, children, className }: { title: string; action?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cx('px-5 pt-6', className)}>
      <div className="mb-2.5 flex items-end justify-between">
        <h2 className="display text-lg">{title}</h2>
        {action && <button className="text-sm font-semibold text-accent">{action}</button>}
      </div>
      {children}
    </section>
  )
}

/** The policy, repeated with this booking's exact cedi amounts and deadlines. Used here and in the cancel sheet. */
export function BookingPolicy({ booking, now = NOW }: { booking: Booking; now?: string }) {
  const q = quoteFor(booking)!
  const ev = eventById(booking.eventId)
  const current = refundFor(q.deposit, ev.startsAt, now)
  const rows = refundTable(q.deposit)
  return (
    <div className="space-y-2">
      <PolicyBlock
        tone={current.pct < 100 ? 'warning' : 'neutral'}
        items={rows.map((r, i) => {
          const from = i === 0 ? undefined : bandDeadline(ev.startsAt, RULES.refund[i - 1].hoursBefore)
          const until = r.hoursBefore > 0 ? bandDeadline(ev.startsAt, r.hoursBefore) : undefined
          const when = until ? `Cancel before ${dayShort(until)}, ${time(until)}` : `From ${dayShort(from!)}, ${time(from!)}, or no-show`
          const isNow = r.pct === current.pct
          const passed = !!until && until < now
          return {
            title: `${r.pct === 0 ? 'No refund' : `${cedis(r.amount)} back (${r.pct}%)`}${isNow ? ' · applies now' : passed ? ' · passed' : ''}`,
            body: <span className={cx(isNow && 'text-text', passed && 'line-through opacity-60')}>{when}</span>,
          }
        })}
      />
      <p className="px-1 text-xs text-faint">
        The {cedis(q.fee)} booking fee is non-refundable. Refunds go back to {methodLine[booking.paymentMethod]} in 1–3 days. Table held until {time(booking.arriveBy ?? ev.startsAt)}.
      </p>
    </div>
  )
}

export function TableBookingDetail({
  booking = tonightBooking,
  status = 'confirmed',
  now = NOW,
  network,
}: {
  booking?: Booking
  status?: ChipStatus
  now?: string
  network?: 'offline' | 'slow'
}) {
  const brand = useBrand()
  const ev = eventById(booking.eventId)
  const v = venueById(booking.venueId)
  const tier = tierFor(booking)!
  const q = quoteFor(booking)!
  const split = splitFor(booking)
  const rows = guestRowsFor(booking)
  const collected = rows.reduce((s, g) => s + (g.state === 'paid' ? (g.paid ?? 0) : 0), 0)
  const invited = rows.filter((g) => g.state === 'invited').length
  const confirmed = rows.filter((g) => g.state === 'host' || g.state === 'paid' || g.state === 'pending').length

  return (
    <Screen
      header={
        <>
          <AppBar
            title="Table booking"
            subtitle={`Ref ${booking.ref}`}
            trailing={
              <IconButton label="Share booking" tone="plain">
                <Share2 className="size-5" />
              </IconButton>
            }
          />
          {network && <NetworkBanner state={network} />}
        </>
      }
      footer={
        <BottomBar>
          <div className="flex gap-2">
            <Button variant="secondary" block>
              Modify
            </Button>
            <Button variant="danger" block>
              Cancel booking
            </Button>
          </div>
        </BottomBar>
      }
    >
      {/* Status + event */}
      <div className="px-5 pt-1">
        <StatusChip status={status} />
        <h1 className="display mt-2 text-[28px] leading-tight">{ev.title}</h1>
        <div className="mt-1 text-sm text-dim">
          {dayLong(ev.startsAt)} · {time(ev.startsAt)} · {v.name}
        </div>
      </div>

      {/* Host QR */}
      <div className="px-5 pt-4">
        <Card className="flex items-center gap-4 p-4">
          <FakeQR seed={booking.ref} size={120} />
          <div className="min-w-0 flex-1">
            <div className="font-semibold">Host QR</div>
            <div className="mt-0.5 text-sm text-dim">Checks in the whole table. Guests get their own pass.</div>
            <OfflinePill className="mt-2" />
            <button className="mt-2 flex items-center gap-1 text-sm font-semibold text-accent">
              <Maximize2 className="size-4" /> Full screen
            </button>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Section title={`${tier.name} · ${booking.tableId}`} action="View map">
        <MiniFloorPlan venueId={booking.venueId} tableId={booking.tableId!} height={190} />
        <div className="mt-2 divide-y divide-line">
          <FactRow icon={<Clock className="size-4" />} label="Arrive by" value={`${time(booking.arriveBy ?? ev.startsAt)} · doors ${time(ev.doorsAt)}`} />
          <FactRow icon={<Users className="size-4" />} label="Party" value={`${booking.partySize} of ${tier.capacity} seats · ${v.minAge}+ with ID`} />
          <FactRow icon={<Shirt className="size-4" />} label="Dress code" value={v.dressCode} />
        </div>
      </Section>

      {/* Bottles */}
      <Section title="Bottles pre-ordered" action="Change">
        <Card className="p-4">
          <ul className="space-y-2 text-sm">
            {booking.bottles.map((l) => {
              const b = bottleById(l.bottleId)
              return (
                <li key={l.bottleId} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate">
                    <span className="text-dim tabular-nums">{l.qty} ×</span> {b.name}
                  </span>
                  <span className="shrink-0 tabular-nums">{cedis(b.price * l.qty)}</span>
                </li>
              )
            })}
          </ul>
          <div className="mt-3 border-t border-line pt-3">
            <MinSpendMeter spent={q.preOrder} minimum={q.minimum} compact />
          </div>
        </Card>
      </Section>

      {/* Money */}
      <Section title="Payment">
        <Card className="p-4">
          <PriceLines
            lines={[
              { label: 'Table commitment', value: q.commitment },
              { label: `Deposit paid (${tier.depositPct}%)`, value: q.deposit },
              { label: `Booking fee (${RULES.tableFeePct}%, non-refundable)`, value: q.fee, muted: true },
            ]}
            total={q.balanceAtVenue}
            totalLabel="Balance at the venue"
          />
          <div className="mt-2 text-xs text-faint">
            Paid {cedis(q.dueNow)} with {methodLine[booking.paymentMethod]}. Service charge ({RULES.venueServicePct}%, about {cedis(q.serviceAtVenue)}) is settled on the night.
          </div>
        </Card>
      </Section>

      {/* Guests */}
      <Section title="Guests" action="Manage">
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <AvatarStack names={rows.filter((g) => g.state !== 'declined').map((g) => g.name)} max={5} />
            <span className="text-sm text-dim">
              {confirmed} of {booking.partySize} in
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between text-sm">
            <span className="text-dim">Shares collected</span>
            <span className="tabular-nums">
              <b>{cedis(collected)}</b> <span className="text-dim">of {cedis(split.guestsTarget)}</span>
            </span>
          </div>
          <ProgressBar value={collected} max={split.guestsTarget} tone="success" className="mt-1.5" />
          <button className="mt-3 flex w-full items-center justify-between text-sm font-semibold text-accent">
            {invited} invites pending · nudge on WhatsApp <ChevronRight className="size-4" />
          </button>
        </Card>
      </Section>

      {/* Policy, repeated */}
      <Section title="Cancellation policy">
        <BookingPolicy booking={booking} now={now} />
      </Section>

      {/* Venue */}
      <Section title="The venue" className="pb-8">
        <WhatsAppRow
          title="Chat with the venue on WhatsApp"
          subtitle={`${brand.name} bookings · ${BOOKING_WHATSAPP.display}`}
          href={whatsappLink(`Booking ${booking.ref}: question about ${tier.name} ${booking.tableId} at ${v.name}, ${dayShort(ev.startsAt)}`)}
        />
        <div className="mt-2 divide-y divide-line">
          <FactRow
            icon={<MapPin className="size-4" />}
            label="Address"
            value={v.address}
            trailing={
              <IconButton label="Directions">
                <Navigation className="size-4" />
              </IconButton>
            }
          />
          <FactRow icon={<Car className="size-4" />} label="Parking" value={v.parking} />
        </div>
      </Section>
    </Screen>
  )
}
