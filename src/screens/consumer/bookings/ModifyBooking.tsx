import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Equal } from 'lucide-react'
import { AppBar, BottomBar, Screen } from '@/components/app/chrome'
import { MinSpendMeter } from '@/components/app/domain'
import { Button, Card, Chip, Stepper } from '@/components/ui/primitives'
import type { Booking } from '@/data/types'
import type { Line } from '@/lib/pricing'
import { cedis, cx, dayShort, time } from '@/lib/format'
import { eventById, methodLine, NOW, quoteFor, refundFor, tierFor, tonightBooking } from './bookingData'
import { BottleStepperList } from './parts'

const extras = ['veuve', 'dj-1942', 'grey-goose', 'redbull', 'shisha', 'kelewele']

const sameLines = (a: Line[], b: Line[]) => {
  const key = (l: Line[]) => [...l].sort((x, y) => x.bottleId.localeCompare(y.bottleId)).map((x) => `${x.bottleId}:${x.qty}`).join(',')
  return key(a) === key(b)
}

/** Half-hour arrival slots from doors to the hold cut-off. */
function arrivalSlots(doorsIso: string, cutoffIso: string) {
  const out: string[] = []
  for (let t = new Date(doorsIso).getTime(); t <= new Date(cutoffIso).getTime(); t += 30 * 60_000) out.push(new Date(t).toISOString())
  return out
}

export function ModifyBooking({
  booking = tonightBooking,
  lines: initialLines,
  party: initialParty,
  arriveAt: initialArrive,
  now = NOW,
}: {
  booking?: Booking
  /** Pre-edited state for stories. Defaults to the booking as it is. */
  lines?: Line[]
  party?: number
  arriveAt?: string
  now?: string
}) {
  const ev = eventById(booking.eventId)
  const tier = tierFor(booking)!
  const cutoff = booking.arriveBy ?? ev.startsAt
  const [lines, setLines] = useState<Line[]>(initialLines ?? booking.bottles)
  const [party, setParty] = useState(initialParty ?? booking.partySize)
  const slots = arrivalSlots(ev.startsAt, cutoff)
  const [arrive, setArrive] = useState(initialArrive ?? slots[slots.length - 1])

  const before = quoteFor(booking)!
  const after = quoteFor(booking, lines)!
  const changed = !sameLines(lines, booking.bottles) || party !== booking.partySize || arrive !== slots[slots.length - 1]
  const depositDiff = after.deposit - before.deposit
  const feeDiff = Math.max(0, after.fee - before.fee)
  const band = refundFor(Math.max(0, -depositDiff), ev.startsAt, now)
  const payMore = depositDiff > 0 ? depositDiff + feeDiff : 0
  const refund = depositDiff < 0 ? band.amount : 0
  const depositHeld = depositDiff > 0 ? after.deposit : before.deposit - refund
  const feeAfter = Math.max(before.fee, after.fee)
  const kept = depositDiff < 0 ? -depositDiff - refund : 0
  const available = [...booking.bottles.map((l) => l.bottleId), ...extras.filter((id) => !booking.bottles.some((l) => l.bottleId === id))]

  const preview = !changed ? (
    <div className="text-sm text-dim">Make a change to see the price difference.</div>
  ) : payMore > 0 ? (
    <div>
      <div className="flex items-center gap-1.5 font-semibold">
        <ArrowUpRight className="size-4 text-warning" /> You’ll pay {cedis(payMore)} more now
      </div>
      <div className="text-xs text-dim">
        {cedis(depositDiff)} deposit + {cedis(feeDiff)} fee · {methodLine[booking.paymentMethod]}
      </div>
    </div>
  ) : refund > 0 ? (
    <div>
      <div className="flex items-center gap-1.5 font-semibold">
        <ArrowDownLeft className="size-4 text-success" /> {cedis(refund)} will be refunded
      </div>
      <div className="text-xs text-dim">
        {band.pct}% of the {cedis(-depositDiff)} deposit difference ({band.band.label.toLowerCase()})
      </div>
    </div>
  ) : (
    <div>
      <div className="flex items-center gap-1.5 font-semibold">
        <Equal className="size-4 text-dim" /> No price change
      </div>
      <div className="text-xs text-dim">{depositDiff < 0 ? 'Under 6 hours to go, so the deposit stays.' : 'Your deposit and balance stay the same.'}</div>
    </div>
  )

  return (
    <Screen
      header={<AppBar title="Modify booking" subtitle={`${tier.name} ${booking.tableId} · ${dayShort(ev.startsAt)}`} />}
      footer={
        <BottomBar>
          <div className="mb-3">{preview}</div>
          <Button block size="lg" disabled={!changed}>
            Save changes
          </Button>
        </BottomBar>
      }
    >
      <section className="px-5 pt-2">
        <h2 className="display text-lg">Party size</h2>
        <Card className="mt-2.5 flex items-center justify-between p-4">
          <div>
            <div className="font-semibold">{party} guests</div>
            <div className="text-sm text-dim">
              {tier.name} seats up to {tier.capacity}
            </div>
          </div>
          <Stepper value={party} min={1} max={tier.capacity} onChange={setParty} />
        </Card>
        {party < booking.partySize && <p className="mt-2 px-1 text-xs text-faint">The table minimum stays {cedis(tier.minSpend)} with fewer guests.</p>}
      </section>

      <section className="px-5 pt-6">
        <h2 className="display text-lg">Arrival time</h2>
        <div className="no-scrollbar -mx-5 mt-2.5 flex gap-2 overflow-x-auto px-5">
          {slots.map((s) => (
            <Chip key={s} selected={arrive === s} onClick={() => setArrive(s)}>
              {time(s)}
            </Chip>
          ))}
        </div>
        <p className="mt-2 px-1 text-xs text-faint">Table held until {time(cutoff)}. After that the venue can release it.</p>
      </section>

      <section className="px-5 pt-6 pb-6">
        <div className="flex items-end justify-between">
          <h2 className="display text-lg">Bottles</h2>
          <span className="text-sm text-dim tabular-nums">{cedis(after.preOrder)}</span>
        </div>
        <div className="mt-2.5">
          <MinSpendMeter spent={after.preOrder} minimum={after.minimum} />
        </div>
        <Card className="mt-3 px-4">
          <BottleStepperList lines={lines} available={available} onChange={setLines} />
        </Card>
        <div className={cx('mt-3 rounded-card border border-line p-4 text-sm')}>
          <div className="mb-2 font-semibold">Before → after</div>
          <dl className="space-y-1.5">
            {[
              ['Table commitment', before.commitment, after.commitment],
              ['Deposit held', before.deposit, depositHeld],
              ['Booking fee', before.fee, feeAfter],
              ['Balance at the venue', before.balanceAtVenue, after.commitment - depositHeld],
            ].map(([label, a, b]) => (
              <div key={label} className="flex justify-between gap-3">
                <dt className="text-dim">{label}</dt>
                <dd className="tabular-nums">
                  {a === b ? (
                    cedis(a as number)
                  ) : (
                    <>
                      <span className="text-faint line-through">{cedis(a as number)}</span> <b>{cedis(b as number)}</b>
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs text-faint">
            The booking fee is non-refundable, so it never goes down.{kept > 0 && ` The other ${cedis(kept)} stays on your deposit and counts toward your tab.`}
          </p>
        </div>
      </section>
    </Screen>
  )
}
