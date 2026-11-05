import { Check, Clock, IdCard, Shirt, Users, Wallet } from 'lucide-react'
import type { FloorPlanId } from '@/data/types'
import { Sheet } from '@/components/app/chrome'
import { Badge, Button, Img } from '@/components/ui/primitives'
import { RULES, tableQuote } from '@/lib/pricing'
import { cedis, time } from '@/lib/format'
import { Fact, MiniPlan } from './shared'
import { arrivalCutoff, bookingCtx, tierOf, viewPhoto } from './data'

/** Step 2b — SeatGeek-style listing sheet: view from the table, mini map, money facts, perks, rules, Select. */
export function TableDetailSheet({ venue: planId = 'vault', tableId = 'B3', onClose, onSelect }: { venue?: FloorPlanId; tableId?: string; onClose?: () => void; onSelect?: () => void }) {
  const { venue, event, tiers, plan } = bookingCtx(planId)
  const table = plan.tables.find((t) => t.id === tableId)!
  const tier = tierOf(tiers, table)
  const q = tableQuote(tier, [])
  const cutoff = arrivalCutoff(event.doorsAt)

  return (
    <Sheet
      title={
        <>
          {table.label} · {tier.name}
        </>
      }
      onClose={onClose ?? (() => {})}
      footer={
        <Button block size="lg" onClick={onSelect}>
          Select {table.label} · min {cedis(tier.minSpend)}
        </Button>
      }
    >
      <div className="relative">
        <Img src={viewPhoto(planId, tier.id)} alt={`View from table ${table.label}`} className="aspect-[16/9] w-full" />
        <Badge tone="glass" className="absolute top-2 left-2">
          View from {table.label}
        </Badge>
      </div>

      <div className="mt-4 flex gap-4">
        <MiniPlan plan={plan} tiers={tiers} tableId={table.id} className="w-[92px]" />
        <dl className="grid min-w-0 flex-1 grid-cols-2 content-start gap-x-3 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-dim">Seats</dt>
            <dd className="font-semibold">Up to {tier.capacity}</dd>
          </div>
          <div>
            <dt className="text-xs text-dim">Minimum spend</dt>
            <dd className="font-semibold tabular-nums">{cedis(tier.minSpend)}</dd>
          </div>
          <div className="col-span-2 rounded-control bg-surface-2 px-3 py-2">
            <dt className="text-xs text-dim">Due now to book</dt>
            <dd className="tabular-nums">
              <b className="text-base">{cedis(q.dueNow)}</b>
              <span className="text-xs text-dim">
                {' '}
                · {tier.depositPct}% deposit {cedis(q.deposit)} + {cedis(q.fee)} fee
              </span>
            </dd>
          </div>
        </dl>
      </div>
      <p className="mt-2 text-xs text-faint">The deposit counts toward your minimum. You settle the rest at the venue.</p>

      <h4 className="mt-5 text-sm font-semibold">What’s included</h4>
      <ul className="mt-2 space-y-1.5">
        {tier.perks.map((p) => (
          <li key={p} className="flex items-center gap-2 text-sm">
            <Check className="size-4 shrink-0 text-success" /> {p}
          </li>
        ))}
      </ul>

      <h4 className="mt-5 text-sm font-semibold">Good to know</h4>
      <div className="divide-y divide-line">
        <Fact
          icon={<Clock className="size-4" />}
          title={`Arrive by ${time(cutoff)}`}
          body={`Held ${RULES.holdMinutesAfterDoors / 60} hours after doors (${time(event.doorsAt)}). After that the table may be released.`}
        />
        <Fact icon={<Users className="size-4" />} title={`Seats up to ${tier.capacity}`} body="The door counts heads at the table." />
        <Fact icon={<Shirt className="size-4" />} title="Dress code" body={venue.dressCode} />
        <Fact icon={<IdCard className="size-4" />} title={`${venue.minAge}+ · ID at the door`} body="Ghana Card, passport or driver’s licence." />
        <Fact icon={<Wallet className="size-4" />} title={`${RULES.venueServicePct}% service charge at the venue`} body="Added to your bill on the night, not prepaid." />
      </div>
    </Sheet>
  )
}
