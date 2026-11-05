import { useState } from 'react'
import { ArrowRightLeft, Cake, Check, CircleCheck, DoorOpen, MessageCircle, Phone, Smartphone, Sparkles, StickyNote, UserCheck, X } from 'lucide-react'
import { Screen, Sheet } from '@/components/app/chrome'
import { FloorLegend, FloorPlan, type FloorStatus } from '@/components/app/FloorPlan'
import { Avatar, Button, Chip, IconButton, ProgressBar } from '@/components/ui/primitives'
import { bottleById } from '@/data/fixtures'
import { cedis, cx, time } from '@/lib/format'
import { Fact, PayLabel, PromoterHeader, PromoterTabBar, StatusPill, tight } from './PromoterChrome'
import type { ReservationRow } from './promoterData'
import { floorStatuses, minutesBetween, PROMO_NOW, releaseAt, reservationByTable, tierById, vaultPlan, vaultTiers } from './promoterData'

const counts = (Object.values(floorStatuses) as FloorStatus[]).reduce<Record<string, number>>((a, s) => ((a[s] = (a[s] ?? 0) + 1), a), {})

export function LiveFloor({ selected: initial, tier }: { selected?: string; tier?: string }) {
  const [selected, setSelected] = useState<string | undefined>(initial)
  const [tierFilter, setTierFilter] = useState<string | undefined>(tier)
  const table = vaultPlan.tables.find((t) => t.id === selected)
  const res = selected ? reservationByTable(selected) : undefined

  return (
    <Screen header={<PromoterHeader alerts={3} />} tabBar={<PromoterTabBar active="tonight" badges={{ bookings: 3 }} />}>
      <div className="flex items-center justify-between px-4 pt-3">
        <h1 className="display text-2xl">Live floor</h1>
        <span className="text-xs text-dim">Updated {time(PROMO_NOW)}</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5 px-4 pt-3 text-center">
        {(
          [
            ['arrived', 'Arrived', 'text-success'],
            ['booked', 'Booked', 'text-text'],
            ['late', 'Late', 'text-danger'],
            ['held', 'Held', 'text-warning'],
            ['available', 'Free', 'text-accent'],
          ] as const
        ).map(([k, l, c]) => (
          <div key={k} className="rounded-control border border-line bg-surface py-1.5">
            <div className={cx('text-lg leading-none font-bold tabular-nums', c)}>{counts[k] ?? 0}</div>
            <div className="mt-0.5 text-[10px] font-semibold text-faint uppercase">{l}</div>
          </div>
        ))}
      </div>
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pt-3">
        <Chip className="h-8 px-3 text-[13px]" selected={!tierFilter} onClick={() => setTierFilter(undefined)}>
          All tiers
        </Chip>
        {vaultTiers.map((t) => (
          <Chip key={t.id} className="h-8 px-3 text-[13px]" selected={tierFilter === t.id} onClick={() => setTierFilter(t.id)}>
            {t.name}
          </Chip>
        ))}
      </div>
      <div className="px-4 pt-3">
        <FloorPlan plan={vaultPlan} tiers={vaultTiers} mode="promoter" statuses={floorStatuses} selectedId={selected} onSelect={(t) => setSelected(t.id)} tierFilter={tierFilter} />
        <FloorLegend mode="promoter" className="mt-2.5" />
        <p className="mt-2 pb-6 text-xs text-faint">Unarrived tables release at {time(releaseAt)}. Tap a table for its booking.</p>
      </div>

      {table && (
        <Sheet
          title={
            <span className="flex items-center gap-2">
              {table.label} · {tierById(table.tierId).name}
              {res ? <StatusPill status={res.status} /> : <span className="rounded-[5px] bg-accent/15 px-1.5 py-px text-[11px] font-bold text-accent">Free</span>}
            </span>
          }
          onClose={() => setSelected(undefined)}
          footer={res ? <BookingActions res={res} /> : <FreeActions />}
        >
          {res ? <BookingSummary res={res} /> : <FreeTable tierId={table.tierId} />}
        </Sheet>
      )}
    </Screen>
  )
}

export function BookingSummary({ res }: { res: ReservationRow }) {
  const tier = tierById(res.tierId)
  return (
    <div className="space-y-4 pb-2">
      {res.status === 'late' && (
        <div className="rounded-control border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          Due {time(res.arriveBy)} · releases in {minutesBetween(PROMO_NOW, releaseAt)} min ({time(releaseAt)})
        </div>
      )}
      {res.pay === 'momo-failed' && (
        <div className="rounded-control border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">MoMo deposit declined. Held while the host retries.</div>
      )}
      <div className="flex items-center gap-3">
        <Avatar name={res.host} size={44} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{res.host}</div>
          <div className="truncate text-xs text-dim">
            {res.ref} · {res.phone}
          </div>
        </div>
        <IconButton label="Call host" className="size-9">
          <Phone className="size-4" />
        </IconButton>
      </div>
      <div className="rounded-card border border-line bg-bg p-3">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-dim">Party</span>
          <span>
            <b className="text-lg tabular-nums">{res.arrived}</b>
            <span className="text-dim"> of {res.partySize} in</span>
            <span className="text-faint"> · cap {tier.capacity}</span>
          </span>
        </div>
        <ProgressBar value={res.arrived} max={res.partySize} tone="success" className="mt-2 h-1.5" />
        <div className="mt-2 text-xs text-dim">{res.arrivedAt ? `First in ${time(res.arrivedAt)}` : `Arriving by ${time(res.arriveBy)}`}</div>
      </div>

      {(res.occasion || res.notes) && (
        <div className="space-y-1.5 text-sm">
          {res.occasion && (
            <div className="flex items-center gap-2">
              <Cake className="size-4 text-accent-2" /> {res.occasion}
            </div>
          )}
          {res.notes && (
            <div className="flex items-start gap-2 text-dim">
              <StickyNote className="mt-0.5 size-4 shrink-0" /> {res.notes}
            </div>
          )}
        </div>
      )}

      <div>
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.14em] text-faint uppercase">Bottles to prep</div>
        <ul className="divide-y divide-line rounded-card border border-line bg-bg">
          {res.lines.map((l) => {
            const b = bottleById(l.bottleId)
            return (
              <li key={l.bottleId} className="flex items-center gap-2 px-3 py-2 text-sm">
                <span className="w-6 font-bold text-accent tabular-nums">{l.qty}×</span>
                <span className="min-w-0 flex-1 truncate">{b.name}</span>
                {b.showpiece && <Sparkles className="size-4 shrink-0 text-accent-2" aria-label="Showpiece" />}
                <span className="shrink-0 text-dim tabular-nums">{cedis(b.price * l.qty)}</span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="rounded-card border border-line bg-bg px-3 py-1.5">
        <Fact k="Minimum spend" v={cedis(tier.minSpend)} />
        <Fact k="Pre-order" v={cedis(res.quote.preOrder)} />
        <Fact k={`Deposit (${tier.depositPct}%)`} v={res.depositPaid ? cedis(res.depositPaid) : <span className="text-danger">Not paid</span>} />
        {!!res.paidAtVenue && <Fact k="Paid at venue" v={cedis(res.paidAtVenue)} />}
        <Fact k="Balance to collect" v={<span className={res.balance ? 'text-warning' : 'text-success'}>{res.balance ? cedis(res.balance) : 'Settled'}</span>} className="border-t border-line" />
        <div className="flex justify-end pb-1">
          <PayLabel pay={res.pay} />
        </div>
      </div>
    </div>
  )
}

function BookingActions({ res }: { res: ReservationRow }) {
  if (res.status === 'held')
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button block icon={<Smartphone className="size-4" />} className="whitespace-nowrap">
            Resend MoMo
          </Button>
          <Button block variant="secondary" className="whitespace-nowrap">
            Pay at door
          </Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="whatsapp" className={cx(tight, 'flex-1 whitespace-nowrap')} icon={<MessageCircle className="size-4" />}>
            WhatsApp
          </Button>
          <Button size="sm" variant="danger" className={tight} icon={<DoorOpen className="size-4" />}>
            Release hold
          </Button>
        </div>
      </div>
    )
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Button block icon={<UserCheck className="size-4" />} className="whitespace-nowrap">
          Check in
        </Button>
        <Button block variant="secondary" icon={<CircleCheck className="size-4" />} className="whitespace-nowrap" disabled={res.arrived === res.partySize}>
          Mark arrived
        </Button>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="whatsapp" className={cx(tight, 'flex-1 whitespace-nowrap')} icon={<MessageCircle className="size-4" />}>
          WhatsApp
        </Button>
        <Button size="sm" variant="secondary" className={tight} icon={<ArrowRightLeft className="size-4" />}>
          Move
        </Button>
        <Button size="sm" variant="danger" className={tight} icon={<DoorOpen className="size-4" />}>
          Release
        </Button>
      </div>
    </div>
  )
}

function FreeTable({ tierId }: { tierId: string }) {
  const tier = tierById(tierId)
  return (
    <div className="space-y-3 pb-2">
      <div className="rounded-card border border-line bg-bg px-3 py-1.5">
        <Fact k="Capacity" v={`${tier.capacity} guests`} />
        <Fact k="Minimum spend" v={cedis(tier.minSpend)} />
        <Fact k="Deposit" v={`${tier.depositPct}%`} />
      </div>
      <ul className="space-y-1 text-sm text-dim">
        {tier.perks.map((p) => (
          <li key={p} className="flex items-center gap-2">
            <Check className="size-4 text-success" /> {p}
          </li>
        ))}
      </ul>
      <p className="text-xs text-faint">Still bookable in the app tonight. Holding it removes it from sale.</p>
    </div>
  )
}

function FreeActions() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button block>Seat walk-in</Button>
      <Button block variant="secondary" icon={<X className="size-4" />}>
        Hold / block
      </Button>
    </div>
  )
}
