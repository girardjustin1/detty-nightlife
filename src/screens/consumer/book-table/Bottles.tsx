import { useRef, useState } from 'react'
import { Clock, Flame, Sparkles } from 'lucide-react'
import { bottles } from '@/data/fixtures'
import type { BottleCategory, FloorPlanId } from '@/data/types'
import { BottomBar, Screen } from '@/components/app/chrome'
import { MinSpendMeter } from '@/components/app/domain'
import { Badge, Button, Stepper, Toggle } from '@/components/ui/primitives'
import { tableQuote, type Line } from '@/lib/pricing'
import { cedis, cx } from '@/lib/format'
import { BookingHeader, ContextPill } from './shared'
import { HoldTimer } from './HoldTimer'
import { arrivalSlots, bookingCtx, linesTotal, packages } from './data'

const tabs: { label: string; cats: BottleCategory[] }[] = [
  { label: 'Champagne', cats: ['Champagne'] },
  { label: 'Cognac', cats: ['Cognac'] },
  { label: 'Tequila', cats: ['Tequila'] },
  { label: 'Vodka & gin', cats: ['Vodka', 'Gin'] },
  { label: 'Whisky', cats: ['Whisky'] },
  { label: 'Mixers', cats: ['Mixers'] },
  { label: 'Food & shisha', cats: ['Food', 'Shisha'] },
]

const toMap = (lines: Line[]) => Object.fromEntries(lines.map((l) => [l.bottleId, l.qty])) as Record<string, number>

/**
 * Step 3 — bottles toward the table minimum. Category tabs jump through one list;
 * a packages row on top; – n + steppers; the MinSpendMeter sits above the CTA so it
 * is always in thumb reach. "Decide later" is allowed: the deposit is still taken on the minimum.
 */
export function Bottles({
  venue: planId = 'vault',
  tierId = 'booth',
  tableLabel = 'B3',
  lines: initialLines = [],
  decideLater: initialLater = false,
  partySize = 6,
}: {
  venue?: FloorPlanId
  tierId?: string
  tableLabel?: string
  lines?: Line[]
  decideLater?: boolean
  partySize?: number
}) {
  const { venue, event, tiers } = bookingCtx(planId)
  const tier = tiers.find((t) => t.id === tierId)!
  const [qty, setQty] = useState<Record<string, number>>(() => toMap(initialLines))
  const [later, setLater] = useState(initialLater)
  const [tab, setTab] = useState(tabs[0].label)
  const sections = useRef<Record<string, HTMLElement | null>>({})

  const lines: Line[] = later ? [] : Object.entries(qty).filter(([, n]) => n > 0).map(([bottleId, n]) => ({ bottleId, qty: n }))
  const q = tableQuote(tier, lines)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const addPackage = (pl: Line[]) =>
    setQty((cur) => {
      const next = { ...cur }
      pl.forEach((l) => (next[l.bottleId] = (next[l.bottleId] ?? 0) + l.qty))
      return next
    })
  const jump = (label: string) => {
    setTab(label)
    sections.current[label]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Screen
      header={
        <BookingHeader
          step={3}
          title="Bottles"
          trailing={<HoldTimer />}
          context={<ContextPill event={event} partySize={partySize} arrival={arrivalSlots(event.doorsAt)[1]} />}
        />
      }
      footer={
        <BottomBar>
          <div className="space-y-3">
            {later ? (
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-dim">Deposit on the {cedis(q.minimum)} minimum</span>
                <b className="text-base tabular-nums">{cedis(q.deposit)}</b>
              </div>
            ) : (
              <MinSpendMeter spent={q.preOrder} minimum={q.minimum} compact />
            )}
            <Button block size="lg">
              {later ? 'Continue without bottles' : count ? `Continue · ${count} ${count === 1 ? 'item' : 'items'}` : 'Continue'}
            </Button>
          </div>
        </BottomBar>
      }
    >
      {/* Decide later */}
      <div className="mx-5 mt-2 flex items-center gap-3 rounded-card border border-line bg-surface px-3.5 py-3">
        <Clock className="size-5 shrink-0 text-accent" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">Decide later at the venue</div>
          <div className="truncate text-xs text-dim">
            {tier.depositPct}% deposit still due on the {cedis(tier.minSpend)} min
          </div>
        </div>
        <Toggle checked={later} onChange={setLater} label="Decide later at the venue" />
      </div>

      {later ? (
        <div className="mx-5 mt-4 rounded-card border border-dashed border-line p-5 text-sm text-dim">
          <p>
            Order on the night from your server at table {tableLabel}. Whatever you order counts toward the {cedis(tier.minSpend)} minimum; if you spend less, the
            difference is still charged.
          </p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={() => setLater(false)}>
            Show me the bottle menu
          </Button>
        </div>
      ) : (
        <>
          {/* Packages */}
          <h2 className="display px-5 pt-5 pb-2.5 text-xl">Popular at {venue.name}</h2>
          <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-5">
            {packages.map((p) => {
              const total = linesTotal(p.lines)
              const covers = total >= tier.minSpend
              return (
                <button key={p.id} onClick={() => addPackage(p.lines)} className="w-[200px] shrink-0 rounded-card border border-line bg-surface p-3.5 text-left active:scale-[0.98]">
                  <div className="flex items-center gap-1.5 font-semibold">
                    {p.id === 'birthday' && <Sparkles className="size-4 text-accent-2" />}
                    {p.name}
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-xs text-dim">{p.blurb}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <b className="tabular-nums">{cedis(total)}</b>
                    {covers ? <Badge tone="success">Covers min</Badge> : <span className="text-xs text-faint">{cedis(tier.minSpend - total)} short</span>}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Category tabs */}
          <div className="no-scrollbar sticky top-0 z-10 mt-4 flex gap-1 overflow-x-auto border-b border-line bg-bg px-3" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.label}
                role="tab"
                aria-selected={tab === t.label}
                onClick={() => jump(t.label)}
                className={cx(
                  'h-11 shrink-0 border-b-2 px-2.5 text-sm font-semibold whitespace-nowrap transition',
                  tab === t.label ? 'border-accent text-text' : 'border-transparent text-dim',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tabs.map((t) => {
            const items = bottles.filter((b) => t.cats.includes(b.category))
            return (
              <section key={t.label} ref={(el) => void (sections.current[t.label] = el)} className="scroll-mt-12 px-5 pt-4">
                <h3 className="text-xs font-bold tracking-wider text-faint uppercase">{t.label}</h3>
                <ul className="divide-y divide-line">
                  {items.map((b) => {
                    const n = qty[b.id] ?? 0
                    return (
                      <li key={b.id} className="flex items-center gap-3 py-3">
                        <div className="min-w-0 flex-1">
                          <div className={cx('leading-snug font-medium', n > 0 && 'text-accent')}>{b.name}</div>
                          <div className="text-sm text-dim">
                            {b.size} · <span className="text-text tabular-nums">{cedis(b.price)}</span>
                          </div>
                          {(b.showpiece || b.popular) && (
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {b.showpiece && (
                                <Badge tone="warning">
                                  <Sparkles className="size-3" /> Arrives with sparklers
                                </Badge>
                              )}
                              {b.popular && (
                                <Badge>
                                  <Flame className="size-3" /> Popular
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <Stepper size="sm" value={n} onChange={(v) => setQty((c) => ({ ...c, [b.id]: v }))} max={10} />
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
          <p className="px-5 pt-2 pb-6 text-xs text-faint">
            {q.preOrder > q.minimum
              ? `You’re ${cedis(q.preOrder - q.minimum)} over the minimum, so the ${tier.depositPct}% deposit is on your ${cedis(q.commitment)} pre-order: ${cedis(q.deposit)}.`
              : `Bottles are served at table ${tableLabel} when you arrive.`}
          </p>
        </>
      )}
    </Screen>
  )
}
