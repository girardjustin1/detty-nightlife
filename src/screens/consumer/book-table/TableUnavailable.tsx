import { useState } from 'react'
import { Bell, Check, CircleAlert } from 'lucide-react'
import type { FloorPlanId } from '@/data/types'
import type { FloorStatus } from '@/components/app/FloorPlan'
import { AppBar, BottomBar, Screen } from '@/components/app/chrome'
import { Badge, Button } from '@/components/ui/primitives'
import { canonicalTable, tableQuote } from '@/lib/pricing'
import { cedis, cx } from '@/lib/format'
import { MiniPlan } from './shared'
import { availableTables, bookingCtx, tierOf } from './data'

/**
 * Race condition: someone else paid for the table between selection and review.
 * The guest keeps bottles and guests; we offer the closest free tables (same tier
 * first, then by how much the minimum changes) and a Notify fallback.
 */
export function TableUnavailable({
  venue: planId = 'vault',
  tableId = canonicalTable.tableId,
  partySize = 6,
  lines = canonicalTable.lines,
  statuses: extra,
}: {
  venue?: FloorPlanId
  tableId?: string
  partySize?: number
  lines?: typeof canonicalTable.lines
  /** Extra status overrides (e.g. everything else booked). */
  statuses?: Record<string, FloorStatus>
}) {
  const { venue, tiers, plan } = bookingCtx(planId)
  const lost = plan.tables.find((t) => t.id === tableId)!
  const lostTier = tierOf(tiers, lost)
  const statuses: Record<string, FloorStatus> = { ...extra, [lost.id]: 'booked' }
  const was = tableQuote(lostTier, lines)
  const alts = availableTables(plan.tables, statuses)
    .filter((t) => tierOf(tiers, t).capacity >= partySize)
    .map((t) => ({ t, tier: tierOf(tiers, t), q: tableQuote(tierOf(tiers, t), lines) }))
    .sort((a, b) => Number(b.tier.id === lostTier.id) - Number(a.tier.id === lostTier.id) || Math.abs(a.q.dueNow - was.dueNow) - Math.abs(b.q.dueNow - was.dueNow))
  const [pick, setPick] = useState(alts[0]?.t.id)
  const [notify, setNotify] = useState(false)
  const chosen = alts.find((a) => a.t.id === pick)

  return (
    <Screen
      header={<AppBar title="Table unavailable" onClose={() => {}} />}
      footer={
        <BottomBar
          summary={
            chosen ? (
              <div>
                <div className="truncate text-xs text-dim">
                  {chosen.t.label} · {chosen.tier.name}
                </div>
                <div className="font-semibold tabular-nums">{cedis(chosen.q.dueNow)} now</div>
              </div>
            ) : undefined
          }
        >
          {chosen ? (
            <Button size="lg">Take {chosen.t.label}</Button>
          ) : (
            <Button size="lg" block variant={notify ? 'secondary' : 'primary'} icon={notify ? <Check className="size-5" /> : <Bell className="size-5" />} onClick={() => setNotify(true)}>
              {notify ? 'We’ll message you' : `Notify me if ${lost.label} frees up`}
            </Button>
          )}
        </BottomBar>
      }
    >
      <div className="flex gap-4 px-5 pt-2">
        <MiniPlan plan={plan} tiers={tiers} statuses={statuses} tableId={chosen?.t.id} className="w-24" />
        <div className="min-w-0">
          <CircleAlert className="size-7 text-danger" />
          <h2 className="display mt-2 text-2xl">{lost.label} was just booked</h2>
          <p className="mt-1 text-sm text-dim">
            Someone paid for it while you were choosing. You weren’t charged. Your bottles and guests are saved.
          </p>
        </div>
      </div>

      <h3 className="px-5 pt-6 pb-2 text-xs font-bold tracking-wider text-faint uppercase">{alts.length ? `Still free at ${venue.name} for ${partySize}` : 'Nothing else free for your party'}</h3>
      <ul className="space-y-2 px-5">
        {alts.map(({ t, tier, q }) => {
          const diff = q.dueNow - was.dueNow
          const sel = t.id === pick
          return (
            <li key={t.id}>
              <button
                onClick={() => setPick(t.id)}
                aria-pressed={sel}
                className={cx('flex w-full items-center gap-3 rounded-card border p-3 text-left transition', sel ? 'border-accent bg-accent/10' : 'border-line bg-surface')}
              >
                <span className={cx('display flex size-12 shrink-0 items-center justify-center rounded-control text-lg', sel ? 'bg-accent text-on-accent' : 'bg-surface-2')}>
                  {t.label}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{tier.name}</span>
                  <span className="block truncate text-sm text-dim">
                    Up to {tier.capacity} · min {cedis(tier.minSpend)}
                  </span>
                </span>
                {diff === 0 ? <Badge tone="success">Same price</Badge> : <Badge tone={diff > 0 ? 'warning' : 'neutral'}>{diff > 0 ? `+${cedis(diff)} now` : `${cedis(-diff)} less`}</Badge>}
              </button>
            </li>
          )
        })}
      </ul>
      {alts.length > 0 && (
        <button onClick={() => setNotify((n) => !n)} className="mx-5 mt-4 mb-6 flex items-center gap-2 text-sm font-semibold text-accent">
          {notify ? <Check className="size-4" /> : <Bell className="size-4" />}
          {notify ? `We’ll message you if ${lost.label} frees up` : `Or notify me if ${lost.label} frees up`}
        </button>
      )}
      {!alts.length && <p className="px-5 text-sm text-dim">Try a smaller party, another night, or turn on Notify and we’ll message you on WhatsApp if a table opens up.</p>}
    </Screen>
  )
}
