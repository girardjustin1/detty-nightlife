import { useState } from 'react'
import { Check, Download, Hourglass, Info, MessageCircle, Undo2 } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { BOOKING_WHATSAPP, whatsappLink } from '@/config/contact'
import { AppBar, BottomBar, Screen, Sheet } from '@/components/app/chrome'
import { PriceLines } from '@/components/app/domain'
import { Button, Card, Chip, Img } from '@/components/ui/primitives'
import type { Booking } from '@/data/types'
import { RULES } from '@/lib/pricing'
import { cedis, cx, dayShort, time } from '@/lib/format'
import { bandDeadline, eventById, methodLine, NOW, quoteFor, refundFor, refundTable, tierFor, tonightBooking, venueById } from './bookingData'
import { StatusChip } from './parts'
import { TableBookingDetail } from './TableBookingDetail'

const reasons = ['Plans changed', 'Squad can’t make it', 'Booked the wrong night', 'Found another table', 'Too pricey', 'Other']

function useCancelMath(booking: Booking, now: string) {
  const q = quoteFor(booking)!
  const ev = eventById(booking.eventId)
  const r = refundFor(q.deposit, ev.startsAt, now)
  return { q, ev, r, kept: q.deposit - r.amount }
}

export function CancelSheet({ booking = tonightBooking, now = NOW, reason: initialReason }: { booking?: Booking; now?: string; reason?: string }) {
  const { q, ev, r, kept } = useCancelMath(booking, now)
  const v = venueById(booking.venueId)
  const tier = tierFor(booking)!
  const [reason, setReason] = useState(initialReason)
  const hoursLeft = Math.max(0, Math.floor(r.hours))

  return (
    <div className="relative h-full">
      <TableBookingDetail booking={booking} now={now} />
      <Sheet
        title="Cancel this booking?"
        onClose={() => {}}
        footer={
          <div className="space-y-2">
            <Button variant="danger" block size="lg">
              {r.amount > 0 ? `Cancel booking · get ${cedis(r.amount)} back` : 'Cancel booking · no refund'}
            </Button>
            <Button variant="ghost" block>
              Keep my booking
            </Button>
          </div>
        }
      >
        <Card className="flex items-center gap-3 p-3">
          <Img src={ev.photo} alt={ev.title} className="size-14 shrink-0" />
          <div className="min-w-0">
            <div className="truncate font-semibold">{ev.title}</div>
            <div className="truncate text-sm text-dim">
              {tier.name} {booking.tableId} · {v.name} · {dayShort(ev.startsAt)}, {time(ev.startsAt)}
            </div>
          </div>
        </Card>

        <div className={cx('mt-3 rounded-card border p-4', r.pct === 100 ? 'border-success/40 bg-success/5' : 'border-warning/40 bg-warning/5')}>
          <div className="text-sm text-dim">If you cancel now ({hoursLeft} hours to go)</div>
          <div className="display mt-0.5 text-3xl tabular-nums">{r.amount > 0 ? `${cedis(r.amount)} back` : 'No refund'}</div>
          <div className="mt-3">
            <PriceLines
              lines={[
                { label: `Deposit paid (${tier.depositPct}%)`, value: q.deposit },
                { label: `Refund · ${r.band.label.toLowerCase()} (${r.pct}%)`, value: r.amount },
                { label: 'Kept by the venue', value: kept, muted: true },
                { label: 'Booking fee · non-refundable', value: q.fee, muted: true },
              ]}
            />
          </div>
          {r.amount > 0 && <div className="mt-2 text-xs text-dim">Back to {methodLine[booking.paymentMethod]} in 1–3 days.</div>}
        </div>

        <div className="mt-4">
          <div className="text-sm font-semibold">The policy for this booking</div>
          <ul className="mt-2 space-y-1.5 text-sm">
            {refundTable(q.deposit).map((b, i) => {
              const until = b.hoursBefore > 0 ? bandDeadline(ev.startsAt, b.hoursBefore) : undefined
              const from = i > 0 ? bandDeadline(ev.startsAt, RULES.refund[i - 1].hoursBefore) : undefined
              const isNow = b.pct === r.pct
              return (
                <li key={b.label} className={cx('flex justify-between gap-3 rounded-control px-3 py-1.5', isNow ? 'bg-surface-2 font-semibold text-text' : 'text-dim')}>
                  <span>{until ? `Before ${dayShort(until)}, ${time(until)}` : `After ${dayShort(from!)}, ${time(from!)}`}</span>
                  <span className="tabular-nums">{b.amount > 0 ? cedis(b.amount) : '₵0'}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="mt-4">
          <div className="text-sm font-semibold">Why are you cancelling? (optional)</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {reasons.map((x) => (
              <Chip key={x} selected={reason === x} onClick={() => setReason(reason === x ? undefined : x)}>
                {x}
              </Chip>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-start gap-2 text-xs text-faint">
          <Info className="size-4 shrink-0" /> Your guests get a WhatsApp message, and anyone who paid a share is refunded the same way.
        </div>
      </Sheet>
    </div>
  )
}

function Step({ done, active, title, body, last }: { done?: boolean; active?: boolean; title: string; body: string; last?: boolean }) {
  return (
    <li className="relative flex gap-3 pb-5">
      {!last && <span className={cx('absolute top-7 left-[13px] h-[calc(100%-24px)] w-0.5', done ? 'bg-success' : 'bg-line')} />}
      <span
        className={cx(
          'relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full',
          done ? 'bg-success text-bg' : active ? 'border-2 border-accent bg-bg text-accent' : 'border-2 border-line bg-bg text-faint',
        )}
      >
        {done ? <Check className="size-4" /> : <Hourglass className="size-3.5" />}
      </span>
      <div className="min-w-0 pt-0.5">
        <div className={cx('font-semibold', !done && !active && 'text-dim')}>{title}</div>
        <div className="text-sm text-dim">{body}</div>
      </div>
    </li>
  )
}

export function CancelledBooking({ booking = tonightBooking, now = NOW, stage = 'sent' }: { booking?: Booking; now?: string; stage?: 'sent' | 'received' }) {
  const brand = useBrand()
  const { q, ev, r, kept } = useCancelMath(booking, now)
  const v = venueById(booking.venueId)
  const tier = tierFor(booking)!
  const by = new Date(new Date(now).getTime() + 3 * 86_400_000).toISOString()
  const method = methodLine[booking.paymentMethod]

  return (
    <Screen
      header={<AppBar title="Booking cancelled" subtitle={`Ref ${booking.ref}`} />}
      footer={
        <BottomBar>
          <div className="flex gap-2">
            <Button variant="secondary" icon={<Download className="size-4" />} block>
              Receipt
            </Button>
            <Button block>Find a night</Button>
          </div>
        </BottomBar>
      }
    >
      <div className="px-5 pt-2 pb-8">
        <StatusChip status={stage === 'received' ? 'refunded' : 'cancelled'} />
        <h1 className="display mt-2 text-[28px] leading-tight">{r.amount > 0 ? `${cedis(r.amount)} is on its way back` : 'Your booking is cancelled'}</h1>
        <p className="mt-1 text-sm text-dim">
          {tier.name} {booking.tableId} at {v.name} for {ev.title}, {dayShort(ev.startsAt)}. The table has been released and your guests were told on WhatsApp.
        </p>

        {r.amount > 0 ? (
          <Card className="mt-5 p-4">
            <div className="mb-3 text-sm font-semibold">Refund timeline</div>
            <ol>
              <Step done title="Cancelled" body={`${dayShort(now)}, ${time(now)} · ${r.band.label}`} />
              <Step done title={`Refund sent · ${cedis(r.amount)}`} body={`To ${method}`} />
              <Step
                last
                done={stage === 'received'}
                active={stage === 'sent'}
                title={stage === 'received' ? 'In your MoMo wallet' : 'Lands in your MoMo wallet'}
                body={stage === 'received' ? `Received ${dayShort(by)}` : `MoMo refunds take 1–3 days · by ${dayShort(by)}`}
              />
            </ol>
          </Card>
        ) : (
          <Card className="mt-5 flex gap-3 p-4 text-sm text-dim">
            <Info className="size-5 shrink-0 text-warning" />
            Cancelled less than 6 hours before the night, so the deposit isn’t refunded. That was the policy shown at booking and on this booking.
          </Card>
        )}

        <Card className="mt-3 p-4">
          <PriceLines
            lines={[
              { label: 'Deposit paid', value: q.deposit },
              { label: 'Booking fee (non-refundable)', value: q.fee, muted: true },
              { label: 'Kept by the venue', value: kept, muted: true },
            ]}
            total={r.amount}
            totalLabel="Refund to you"
          />
        </Card>

        <div className="mt-3 space-y-2">
          <a
            href={whatsappLink(`Booking ${booking.ref}: my ${cedis(r.amount)} refund hasn't arrived`)}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center gap-3 rounded-card border border-line p-3.5 text-left text-sm"
          >
            <MessageCircle className="size-5 text-dim" />
            <span className="flex-1">
              Refund not arrived after 3 days? WhatsApp {brand.name} bookings · {BOOKING_WHATSAPP.display}
            </span>
          </a>
          <button className="flex w-full items-center gap-3 rounded-card border border-line p-3.5 text-left text-sm">
            <Undo2 className="size-5 text-dim" />
            <span className="flex-1">{tier.name} {booking.tableId} is free again until someone grabs it. Rebook?</span>
          </button>
        </div>
      </div>
    </Screen>
  )
}
