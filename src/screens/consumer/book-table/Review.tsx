import { useState } from 'react'
import { ArrowRight, TriangleAlert } from 'lucide-react'
import { bottleById } from '@/data/fixtures'
import type { FloorPlanId, Guest } from '@/data/types'
import { BottomBar, Screen } from '@/components/app/chrome'
import { PolicyBlock, PriceLines } from '@/components/app/domain'
import { AvatarStack, Button, Card, Divider } from '@/components/ui/primitives'
import { RULES, canonicalTable, tableQuote, type Line } from '@/lib/pricing'
import { cedis, cx, dayShort, time } from '@/lib/format'
import { BookingHeader, ContextPill, MiniPlan } from './shared'
import { HoldTimer } from './HoldTimer'
import { arrivalCutoff, arrivalSlots, bookingCtx, guestSets, refundSchedule, repricedTier, type Occasion } from './data'
import { VenueRulesSheet } from './VenueRulesSheet'

const when = (iso: string) => `${dayShort(iso)}, ${time(iso)}`

/**
 * Step 5 — Resy "Complete order": the policy block FIRST with concrete dates, times
 * and cedi amounts; then table, bottles, guests and the itemised price. Sticky CTA
 * leads to the venue-rules sheet, then Pay (another group).
 */
export function Review({
  venue: planId = 'vault',
  tableId = canonicalTable.tableId,
  lines = canonicalTable.lines,
  guests = guestSets.partial,
  occasion,
  partySize = 6,
  priceChanged,
  holdSeconds,
  rulesOpen: initialRules = false,
}: {
  venue?: FloorPlanId
  tableId?: string
  lines?: Line[]
  guests?: Guest[]
  occasion?: Occasion
  partySize?: number
  /** The venue changed the minimum since the table was picked. */
  priceChanged?: boolean
  holdSeconds?: number
  rulesOpen?: boolean
}) {
  const { venue, event, tiers, plan } = bookingCtx(planId)
  const table = plan.tables.find((t) => t.id === tableId)!
  const pickedTier = tiers.find((t) => t.id === table.tierId)!
  const tier = priceChanged ? repricedTier(pickedTier) : pickedTier
  const q = tableQuote(tier, lines)
  const before = tableQuote(pickedTier, lines)
  const schedule = refundSchedule(event.startsAt, q.deposit)
  const current = schedule.find((r) => !r.passed)
  const cutoff = arrivalCutoff(event.doorsAt)
  const coming = guests.filter((g) => g.status !== 'declined')
  const invited = guests.filter((g) => g.status === 'invited').length
  const [rules, setRules] = useState(initialRules)
  const short = q.shortfall > 0

  return (
    <Screen
      header={<BookingHeader step={5} title="Review & commit" context={<ContextPill event={event} partySize={partySize} arrival={arrivalSlots(event.doorsAt)[1]} />} />}
      footer={
        <BottomBar>
          <Button block size="lg" onClick={() => setRules(true)} iconRight={<ArrowRight className="size-5" />}>
            Confirm & pay {cedis(q.dueNow)} deposit
          </Button>
          <p className="mt-2 text-center text-xs text-faint">
            Includes the {cedis(q.fee)} booking fee · MoMo, card or Lightning next
          </p>
        </BottomBar>
      }
    >
      <div className="space-y-4 px-5 pt-2 pb-6">
        <HoldTimer variant="bar" tableLabel={table.label} seconds={holdSeconds} />

        {priceChanged && (
          <div className="rounded-card border border-warning/40 bg-warning/5 p-4 text-sm" role="alert">
            <div className="flex items-center gap-2 font-semibold text-warning">
              <TriangleAlert className="size-4" /> The price changed
            </div>
            <p className="mt-1 text-dim">
              {venue.name} raised the {tier.name} minimum from <s>{cedis(pickedTier.minSpend)}</s> to <b className="text-text">{cedis(tier.minSpend)}</b> since you picked{' '}
              {table.label}. Due now is <s>{cedis(before.dueNow)}</s> <b className="text-text">{cedis(q.dueNow)}</b>.
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm">Accept new price</Button>
              <Button size="sm" variant="secondary">
                Pick another table
              </Button>
            </div>
          </div>
        )}

        {short && !priceChanged && (
          <div className="rounded-card border border-warning/40 bg-warning/5 p-4 text-sm" role="alert">
            <div className="flex items-center gap-2 font-semibold text-warning">
              <TriangleAlert className="size-4" /> {cedis(q.shortfall)} short of the minimum
            </div>
            <p className="mt-1 text-dim">
              You can still book. The difference becomes a <b className="text-text">{cedis(q.shortfall)} bar tab</b> at {venue.name} — or add bottles now and
              choose exactly what you’ll drink.
            </p>
            <Button size="sm" variant="secondary" className="mt-3">
              Add bottles
            </Button>
          </div>
        )}

        {/* Policy first */}
        <section aria-labelledby="policy">
          <h2 id="policy" className="display mb-2.5 text-xl">
            Before you pay
          </h2>
          <PolicyBlock
            tone={short ? 'warning' : 'neutral'}
            items={[
              {
                title: `Due now: ${cedis(q.dueNow)}`,
                body: (
                  <>
                    {cedis(q.deposit)} deposit ({tier.depositPct}% of {cedis(q.commitment)}) + {cedis(q.fee)} booking fee. The fee isn’t refundable.
                  </>
                ),
              },
              {
                title: current && current.pct > 0 ? `Cancel before ${when(current.deadline!)} for ${cedis(current.amount)} back` : 'Cancellation',
                body: (
                  <ul className="mt-1 space-y-1">
                    {schedule.map((r) => (
                      <li key={r.hoursBefore} className={cx('flex justify-between gap-3', r.passed && 'text-faint line-through')}>
                        <span>{r.deadline ? `Before ${when(r.deadline)}` : `After ${when(r.after!)}, or no-show`}</span>
                        <span className={cx('shrink-0 tabular-nums', r === current && 'font-semibold text-text')}>
                          {r.pct ? `${cedis(r.amount)} back` : 'No refund'}
                        </span>
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                title: `Arrive by ${time(cutoff)}`,
                body: `${table.label} is held until ${time(cutoff)}, ${RULES.holdMinutesAfterDoors / 60} hours after doors. After that it may be released and the deposit is kept.`,
              },
              {
                title: short ? `Minimum not met: ${cedis(q.shortfall)} becomes a bar tab` : `Minimum ${cedis(q.minimum)}: covered`,
                body: short
                  ? `Your pre-order is ${cedis(q.preOrder)}. You’re committing to the ${cedis(q.minimum)} minimum, so the ${cedis(q.shortfall)} difference is credit to spend at the bar on the night. Unspent credit isn’t refunded.`
                  : `Your ${cedis(q.preOrder)} pre-order covers the ${cedis(q.minimum)} minimum. Anything extra on the night goes on your tab.`,
              },
            ]}
          />
        </section>

        {/* Table */}
        <Card className="flex gap-3 p-3">
          <MiniPlan plan={plan} tiers={tiers} tableId={table.id} className="w-16" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-accent uppercase">{dayShort(event.startsAt)} · arrive {time(arrivalSlots(event.doorsAt)[1])}</div>
            <div className="font-semibold">
              {table.label} · {tier.name}
            </div>
            <div className="text-sm text-dim">
              {venue.name} · {event.title}
            </div>
            <div className="text-sm text-dim">
              Up to {tier.capacity} · min {cedis(tier.minSpend)}
            </div>
          </div>
          <button className="self-start text-sm font-semibold text-accent">Change</button>
        </Card>

        {/* Bottles */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Bottles</h3>
            <button className="text-sm font-semibold text-accent">Edit</button>
          </div>
          {lines.length ? (
            <ul className="mt-2 space-y-1.5 text-sm">
              {lines.map((l) => {
                const b = bottleById(l.bottleId)
                return (
                  <li key={l.bottleId} className="flex justify-between gap-3">
                    <span className="min-w-0 truncate">
                      <span className="text-dim tabular-nums">{l.qty}×</span> {b.name}
                    </span>
                    <span className="shrink-0 tabular-nums">{cedis(b.price * l.qty)}</span>
                  </li>
                )
              })}
              {short && (
                <li className="flex justify-between gap-3 text-warning">
                  <span>Bar tab credit (to reach minimum)</span>
                  <span className="tabular-nums">{cedis(q.shortfall)}</span>
                </li>
              )}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-dim">Deciding at the venue — the deposit is on the {cedis(q.minimum)} minimum.</p>
          )}
        </Card>

        {/* Guests */}
        <Card className="flex items-center gap-3 p-4">
          <AvatarStack names={coming.map((g) => g.name)} max={4} size={30} />
          <div className="min-w-0 flex-1 text-sm">
            <div className="font-semibold">
              {coming.length} of {tier.capacity} coming
            </div>
            <div className="text-dim">{invited ? `${invited} still to accept` : 'Everyone’s in'}{occasion && ` · ${occasion}`}</div>
          </div>
          <button className="text-sm font-semibold text-accent">Edit</button>
        </Card>

        {/* Price */}
        <Card className="p-4">
          <PriceLines
            lines={[
              { label: `Pre-order (${lines.reduce((s, l) => s + l.qty, 0)} items)`, value: q.preOrder },
              { label: 'Table minimum', value: q.minimum, muted: true },
              ...(short ? [{ label: 'Bar tab credit', value: q.shortfall, muted: true }] : []),
              { label: <b>Your commitment</b>, value: q.commitment },
            ]}
          />
          <Divider className="my-3" />
          <PriceLines
            lines={[
              { label: `Deposit (${tier.depositPct}%)`, value: q.deposit },
              { label: `Booking fee (${RULES.tableFeePct}%, non-refundable)`, value: q.fee },
            ]}
            total={q.dueNow}
            totalLabel="Due now"
          />
          <Divider className="my-3" />
          <PriceLines lines={[{ label: 'Balance at the venue', value: q.balanceAtVenue, muted: true }]} />
          <p className="mt-2 text-xs text-faint">
            Plus the venue’s {RULES.venueServicePct}% service charge (about {cedis(q.serviceAtVenue)}), settled on the night — not prepaid.
          </p>
        </Card>
      </div>

      {rules && <VenueRulesSheet venue={planId} tableLabel={table.label} dueNow={q.dueNow} onBack={() => setRules(false)} />}
    </Screen>
  )
}
