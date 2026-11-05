import { useState } from 'react'
import { Bell, Check, Clock, Info, Sofa, Users } from 'lucide-react'
import { AppBar, BottomBar, Screen } from '@/components/app/chrome'
import { Badge, Button, Chip, Img, Stepper } from '@/components/ui/primitives'
import { me, venueById } from '@/data/fixtures'
import type { AccraEvent, TicketTier } from '@/data/types'
import { cedis, cx, dayShort, time } from '@/lib/format'
import { ticketQuote } from '@/lib/pricing'
import { countOf, linesFor, perTicket, sampleEvent, TICKET_RULES, type Selection } from './ticketRules'

const qtyChips = [1, 2, 3, 4] as const

function TierCard({ tier, qty, max, salesEnd, onChange }: { tier: TicketTier; qty: number; max: number; salesEnd: string; onChange: (n: number) => void }) {
  const p = perTicket(tier)
  const out = tier.status !== 'on-sale'
  const low = tier.remaining != null && tier.remaining > 0 && tier.remaining <= TICKET_RULES.lowStock
  return (
    <div className={cx('rounded-card border p-4 transition', out ? 'border-line bg-surface opacity-60' : qty > 0 ? 'border-accent bg-surface' : 'border-line bg-surface')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cx('text-[17px] font-semibold', out && 'line-through decoration-1')}>{tier.name}</span>
            {out && <Badge tone="danger">Sold out</Badge>}
            {low && <Badge tone="warning">Only {tier.remaining} left</Badge>}
          </div>
          <div className="text-sm text-dim">{tier.description}</div>
        </div>
        {!out && <Stepper value={qty} max={max} onChange={onChange} size="sm" />}
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <span className="text-lg font-semibold tabular-nums">{cedis(p.total)}</span>
          <span className="text-sm text-dim"> incl. {cedis(p.fee)} fee</span>
        </div>
        <span className="text-xs text-faint">
          {out ? 'No more released' : tier.remaining != null && !low ? `${tier.remaining} left` : ''}
        </span>
      </div>
      {!out && (
        <div className="mt-2 flex items-center gap-1.5 border-t border-line pt-2 text-xs text-faint">
          <Clock className="size-3.5" /> Sales end {salesEnd}
        </div>
      )}
    </div>
  )
}

/** 05 Book Tickets — tier picker. Quantity chips, tiers with steppers, fees shown up front, sticky total. */
export function TicketTiers({
  event = sampleEvent,
  selection: initial = {},
  waitlistJoined,
}: {
  event?: AccraEvent
  selection?: Selection
  waitlistJoined?: boolean
}) {
  const [sel, setSel] = useState<Selection>(initial)
  const [joined, setJoined] = useState(!!waitlistJoined)
  const [waitQty, setWaitQty] = useState(2)
  const venue = venueById(event.venueId)
  const onSale = event.ticketTiers.filter((t) => t.status === 'on-sale')
  const allOut = onSale.length === 0
  const count = countOf(sel)
  const q = ticketQuote(linesFor(event, sel))
  const atMax = count >= TICKET_RULES.maxPerOrder
  const salesEnd = `${dayShort(event.doorsAt)}, ${time(event.doorsAt)}`
  const maxFor = (t: TicketTier) => Math.min(t.remaining ?? TICKET_RULES.maxPerOrder, (sel[t.id] ?? 0) + TICKET_RULES.maxPerOrder - count)

  return (
    <Screen
      header={<AppBar title="Tickets" subtitle={event.title} />}
      footer={
        allOut ? (
          <BottomBar>
            <Button block size="lg" variant={joined ? 'secondary' : 'primary'} icon={joined ? <Check className="size-5" /> : <Bell className="size-5" />} onClick={() => setJoined(true)}>
              {joined ? `On the waitlist for ${waitQty}` : 'Join the waitlist'}
            </Button>
          </BottomBar>
        ) : (
          <BottomBar
            summary={
              count > 0 ? (
                <>
                  <div className="text-lg font-semibold tabular-nums">{cedis(q.total)}</div>
                  <div className="text-xs text-dim">
                    {count} ticket{count === 1 ? '' : 's'}{atMax ? ' (max)' : ''} · incl. {cedis(q.fee)} fees
                  </div>
                </>
              ) : (
                <div className="text-sm text-dim">Pick your tickets</div>
              )
            }
          >
            <Button size="lg" disabled={count === 0}>
              Continue
            </Button>
          </BottomBar>
        )
      }
    >
      <div className="space-y-5 px-5 pt-1 pb-6">
        <div className="flex items-center gap-3">
          <Img src={event.photo} alt={event.title} className="size-16 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-accent uppercase">
              {dayShort(event.startsAt)} · {time(event.startsAt)}
            </div>
            <div className="truncate text-[17px] font-semibold">{event.title}</div>
            <div className="truncate text-sm text-dim">
              {venue.name} · {venue.area} · {event.minAge}+
            </div>
          </div>
        </div>

        {allOut ? (
          <>
            <div className="rounded-card border border-line bg-surface p-4 text-center">
              <Badge tone="danger">Sold out</Badge>
              <div className="display mt-2 text-2xl">Every ticket is gone</div>
              <p className="mt-1 text-sm text-dim">Tickets sometimes come back when people transfer or the venue releases more. We’ll WhatsApp you first.</p>
              {!joined ? (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <span className="text-sm font-medium">How many?</span>
                  <Stepper value={waitQty} min={1} max={TICKET_RULES.maxPerOrder} onChange={setWaitQty} size="sm" />
                </div>
              ) : (
                <div className="mt-4 inline-flex items-center gap-2 rounded-control bg-success/15 px-3 py-1.5 text-sm font-semibold text-success">
                  <Check className="size-4" /> You’re on the list · we’ll message {me.phone}
                </div>
              )}
            </div>
            {event.tablesFrom != null && (
              <button className="flex w-full items-center gap-3 rounded-card border border-accent/50 bg-surface p-4 text-left">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent">
                  <Sofa className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">Tables are still available</span>
                  <span className="block text-sm text-dim">Entry for the whole group, from {cedis(event.tablesFrom)} minimum spend</span>
                </span>
              </button>
            )}
            <div className="space-y-2.5">
              {event.ticketTiers.map((t) => (
                <TierCard key={t.id} tier={t} qty={0} max={0} salesEnd={salesEnd} onChange={() => {}} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="mb-2 text-sm font-medium text-dim">How many tickets?</div>
              <div className="flex gap-2">
                {qtyChips.map((n) => (
                  <Chip
                    key={n}
                    className="flex-1 justify-center"
                    selected={n === 4 ? count >= 4 : count === n}
                    onClick={() => {
                      const first = Object.keys(sel).find((k) => sel[k] > 0)
                      const tier = onSale.find((t) => t.id === first) ?? onSale.find((t) => t.id === 'ga') ?? onSale[0]
                      setSel({ [tier.id]: Math.min(n, tier.remaining ?? n) })
                    }}
                  >
                    {n === 4 ? '4+' : n}
                  </Chip>
                ))}
              </div>
            </div>

            {atMax ? (
              <div className="flex gap-3 rounded-card border border-warning/40 bg-warning/5 px-4 py-3" role="status">
                <Users className="mt-0.5 size-5 shrink-0 text-warning" />
                <div className="text-sm">
                  <div className="font-semibold">That’s the max — {TICKET_RULES.maxPerOrder} tickets per order</div>
                  <div className="text-dim">
                    Bigger group?{' '}
                    {event.tablesFrom != null ? (
                      <button className="font-semibold text-accent">Book a table from {cedis(event.tablesFrom)}</button>
                    ) : (
                      'Ask a friend to place a second order.'
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-control bg-surface-2 px-3.5 py-2 text-sm text-dim">
              <Info className="size-4 shrink-0 text-accent-2" /> Prices include fees. What you see is what you pay.
              </div>
            )}

            <div className="space-y-2.5">
              {event.ticketTiers.map((t) => (
                <TierCard key={t.id} tier={t} qty={sel[t.id] ?? 0} max={maxFor(t)} salesEnd={salesEnd} onChange={(n) => setSel({ ...sel, [t.id]: n })} />
              ))}
            </div>

            <p className="text-xs leading-relaxed text-faint">
              Tickets are digital and work offline. Entry {event.minAge}+ with ID. Dress code: {event.dressCode}. Tickets can be transferred to friends from Bookings.
            </p>
          </>
        )}
      </div>
    </Screen>
  )
}
