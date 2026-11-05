import { useState } from 'react'
import { Bell, Check, MessageCircle, Users } from 'lucide-react'
import type { FloorPlanId } from '@/data/types'
import { Screen, BottomBar } from '@/components/app/chrome'
import { Badge, Button, Img, Stepper } from '@/components/ui/primitives'
import { cedis, cx, dayLong, time } from '@/lib/format'
import { BookingHeader, StepTitle } from './shared'
import { arrivalCutoff, arrivalSlots, availableTables, bookingCtx, soldOutSlots } from './data'

/** Step 1 — party size, arrival slot (Resy chips, "Notify" when closed) and tier chips filtered by party size. */
export function PartyTime({
  venue: planId = 'vault',
  partySize: initialParty = 6,
  arrival: initialArrival,
  tierId: initialTier,
  notified,
}: {
  venue?: FloorPlanId
  partySize?: number
  /** ISO arrival slot. Defaults to the second slot. */
  arrival?: string
  tierId?: string
  /** Arrival slots the guest has asked to be notified about. */
  notified?: string[]
}) {
  const { venue, event, tiers, plan } = bookingCtx(planId)
  const slots = arrivalSlots(event.doorsAt)
  const closed = soldOutSlots[event.id] ?? []
  const maxCap = Math.max(...tiers.map((t) => t.capacity))
  const [party, setParty] = useState(initialParty)
  const [arrival, setArrival] = useState(initialArrival ?? slots[1])
  const [notify, setNotify] = useState<string[]>(notified ?? [])
  const fits = tiers.filter((t) => t.capacity >= party)
  const [tier, setTier] = useState<string | undefined>(initialTier ?? fits[0]?.id)
  const tierFits = fits.some((t) => t.id === tier)
  const left = (tierId: string) => availableTables(plan.tables.filter((t) => t.tierId === tierId)).length

  return (
    <Screen
      header={<BookingHeader step={1} title="Party & time" />}
      footer={
        <BottomBar
          summary={
            <div>
              <div className="text-xs text-dim">
                {party} {party === 1 ? 'guest' : 'guests'} · arrive {time(arrival)}
              </div>
              <div className="truncate font-semibold">{tierFits ? tiers.find((t) => t.id === tier)?.name : 'Any table'}</div>
            </div>
          }
        >
          <Button size="lg" disabled={fits.length === 0}>
            See tables
          </Button>
        </BottomBar>
      }
    >
      <div className="flex items-center gap-3 px-5 pt-4">
        <Img src={event.photo} alt={event.title} className="size-14 shrink-0" />
        <div className="min-w-0">
          <div className="truncate text-[17px] font-semibold">{event.title}</div>
          <div className="truncate text-sm text-dim">
            {venue.name} · {dayLong(event.startsAt)}
          </div>
          <div className="text-xs text-faint">
            Doors {time(event.doorsAt)} · tables held until {time(arrivalCutoff(event.doorsAt))}
          </div>
        </div>
      </div>

      <StepTitle title="How many of you?" />
      <div className="mx-5 flex items-center justify-between rounded-card border border-line bg-surface p-4">
        <div className="flex items-center gap-3">
          <Users className="size-5 text-accent" />
          <div>
            <div className="font-semibold">Party size</div>
            <div className="text-xs text-dim">Including you</div>
          </div>
        </div>
        <Stepper value={party} min={1} max={maxCap} onChange={setParty} />
      </div>
      {party >= maxCap && (
        <p className="mx-5 mt-2 flex items-center gap-1.5 text-xs text-dim">
          <MessageCircle className="size-3.5" /> More than {maxCap}? Message {venue.name} on WhatsApp for a buy-out.
        </p>
      )}

      <StepTitle title="Arrival time" sub={`Your table is held until ${time(arrivalCutoff(event.doorsAt))}. After that it may be released.`} />
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5">
        {slots.map((s) => {
          const isClosed = closed.includes(Date.parse(s))
          const isSel = s === arrival && !isClosed
          const isNotified = notify.includes(s)
          return (
            <button
              key={s}
              onClick={() => (isClosed ? setNotify((n) => (n.includes(s) ? n.filter((x) => x !== s) : [...n, s])) : setArrival(s))}
              aria-pressed={isSel}
              className={cx(
                'flex h-14 min-w-[84px] shrink-0 flex-col items-center justify-center rounded-control px-3 transition active:scale-95',
                isClosed ? 'border border-dashed border-line text-dim' : isSel ? 'bg-accent text-on-accent' : 'border border-line bg-surface text-text',
              )}
            >
              <span className="text-[15px] font-semibold">{time(s)}</span>
              <span className={cx('flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase', isSel ? 'opacity-80' : 'text-faint', isClosed && 'text-accent')}>
                {isClosed ? (
                  isNotified ? (
                    <>
                      <Check className="size-3" /> Notifying
                    </>
                  ) : (
                    <>
                      <Bell className="size-3" /> Notify
                    </>
                  )
                ) : s === slots[0] ? (
                  'Doors'
                ) : s === slots[slots.length - 1] ? (
                  'Last entry'
                ) : (
                  'Open'
                )}
              </span>
            </button>
          )
        })}
      </div>

      <StepTitle title="Table type" sub={fits.length < tiers.length ? `Tables too small for ${party} are greyed out.` : undefined} />
      <div className="space-y-2.5 px-5 pb-6">
        {tiers.map((t) => {
          const ok = t.capacity >= party
          const n = left(t.id)
          const sel = ok && tier === t.id
          return (
            <button
              key={t.id}
              disabled={!ok || n === 0}
              onClick={() => setTier(t.id)}
              aria-pressed={sel}
              className={cx(
                'flex w-full items-center gap-3 rounded-card border p-4 text-left transition active:scale-[0.99] disabled:active:scale-100',
                sel ? 'border-accent bg-accent/10' : 'border-line bg-surface',
                (!ok || n === 0) && 'opacity-45',
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{t.name}</span>
                  {ok && n === 1 && <Badge tone="live">Only 1 left</Badge>}
                  {ok && n === 0 && <Badge>Fully booked</Badge>}
                </div>
                <div className="truncate text-sm text-dim">
                  {ok ? `Up to ${t.capacity} · ${t.perks[0]}` : `Seats up to ${t.capacity} — too small for ${party}`}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[11px] font-bold tracking-wide text-faint uppercase">Min</div>
                <div className="font-semibold tabular-nums">{cedis(t.minSpend)}</div>
              </div>
            </button>
          )
        })}
        {fits.length === 0 && <p className="text-sm text-dim">No single table seats {party}. Try a smaller party or message the venue.</p>}
      </div>
    </Screen>
  )
}
