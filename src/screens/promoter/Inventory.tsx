import { useState } from 'react'
import { Pencil, Plus, Search, Sparkles, Star, Users } from 'lucide-react'
import { AppBar, Screen, Sheet } from '@/components/app/chrome'
import { Button, Chip, Segmented, TextField, Toggle } from '@/components/ui/primitives'
import { bottles } from '@/data/fixtures'
import type { BottleCategory } from '@/data/types'
import { RULES, tableQuote } from '@/lib/pricing'
import { cedis, cx } from '@/lib/format'
import { Label, PromoterTabBar, tight } from './PromoterChrome'
import { tierById, vaultPlan, vaultTiers } from './promoterData'

export type InventoryTab = 'tables' | 'bottles'

/** Fixture: what the bar has run out of tonight. */
const outOfStock = ['ace', 'clase-azul', 'glenfiddich-15']

export function Inventory({ tab: initial = 'tables', editing, category = 'All' }: { tab?: InventoryTab; editing?: string; category?: 'All' | BottleCategory }) {
  const [tab, setTab] = useState<InventoryTab>(initial)
  const [cat, setCat] = useState<'All' | BottleCategory>(category)
  const [stock, setStock] = useState<string[]>(bottles.map((b) => b.id).filter((id) => !outOfStock.includes(id)))
  const [show, setShow] = useState<string[]>(bottles.filter((b) => b.showpiece).map((b) => b.id))
  const cats = ['All', ...new Set(bottles.map((b) => b.category))] as ('All' | BottleCategory)[]
  const list = bottles.filter((b) => cat === 'All' || b.category === cat)

  return (
    <Screen
      header={
        <div className="shrink-0 border-b border-line bg-bg">
          <AppBar title="Inventory & pricing" subtitle="The Vault · applies to new bookings" />
          <div className="px-4 pb-2.5">
            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { value: 'tables', label: 'Table tiers' },
                { value: 'bottles', label: `Bottle menu · ${bottles.length}` },
              ]}
            />
          </div>
          {tab === 'bottles' && (
            <>
              <div className="flex gap-2 px-4 pb-2">
                <label className="flex h-10 flex-1 items-center gap-2 rounded-control border border-line bg-surface px-3">
                  <Search className="size-4 text-faint" />
                  <input placeholder="Search menu" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-faint" />
                </label>
                <Button size="sm" className="h-10" icon={<Plus className="size-4" />}>
                  Item
                </Button>
              </div>
              <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-2.5">
                {cats.map((c) => (
                  <Chip key={c} className="h-8 px-3 text-[13px]" selected={cat === c} onClick={() => setCat(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
            </>
          )}
        </div>
      }
      tabBar={<PromoterTabBar active="more" />}
    >
      {tab === 'tables' ? (
        <div className="px-4 pt-3 pb-6">
          <div className="space-y-2">
            {vaultTiers.map((t) => {
              const tables = vaultPlan.tables.filter((x) => x.tierId === t.id)
              const q = tableQuote(t, [])
              return (
                <div key={t.id} className="rounded-card border border-line bg-surface p-3">
                  <div className="flex items-start gap-2">
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{t.name}</span>
                      <span className="flex items-center gap-1 text-xs text-dim">
                        <Users className="size-3" /> {t.capacity} guests · {tables.length} tables ({tables.map((x) => x.label).join(', ')})
                      </span>
                    </span>
                    <Button size="sm" variant="secondary" className={tight} icon={<Pencil className="size-3.5" />}>
                      Edit
                    </Button>
                  </div>
                  <div className="mt-2.5 grid grid-cols-3 divide-x divide-line rounded-control border border-line bg-bg text-center">
                    <Stat k="Min spend" v={cedis(t.minSpend)} />
                    <Stat k="Deposit" v={`${t.depositPct}%`} sub={cedis(q.deposit)} />
                    <Stat k="Capacity" v={String(t.capacity)} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {t.perks.map((p) => (
                      <span key={p} className="rounded-full border border-line px-2 py-0.5 text-[11px] text-dim">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <Label className="px-0">Rules</Label>
          <div className="divide-y divide-line rounded-card border border-line bg-surface text-sm">
            {[
              ['Guest booking fee', `${RULES.tableFeePct}% · paid by guest`],
              ['Service charge', `${RULES.venueServicePct}% · at the venue`],
              ['Release unarrived tables', `${RULES.holdMinutesAfterDoors} min after doors`],
              ['Checkout hold', `${RULES.checkoutHoldMinutes} min`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between px-3 py-2.5">
                <span className="text-dim">{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-faint">Changes apply to new bookings only. Existing bookings keep the price they paid.</p>
        </div>
      ) : (
        <div className="pb-6">
          <div className="flex items-center justify-between px-4 pt-3 pb-2 text-xs text-dim">
            <span>
              {list.length} items · <span className={cx(bottles.length > stock.length && 'text-warning')}>{bottles.length - stock.length} out of stock</span>
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="size-3 text-accent-2" /> = showpiece (sparklers / parade)
            </span>
          </div>
          <ul className="mx-4 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
            {list.map((b) => {
              const inStock = stock.includes(b.id)
              const isShow = show.includes(b.id)
              return (
                <li key={b.id} className={cx('flex items-center gap-2.5 px-3 py-2.5', !inStock && 'opacity-55')}>
                  <button
                    aria-label={isShow ? 'Unmark showpiece' : 'Mark as showpiece'}
                    aria-pressed={isShow}
                    onClick={() => setShow(isShow ? show.filter((x) => x !== b.id) : [...show, b.id])}
                    className={cx('flex size-8 shrink-0 items-center justify-center rounded-full border', isShow ? 'border-accent-2/50 bg-accent-2/15 text-accent-2' : 'border-line text-faint')}
                  >
                    <Sparkles className="size-4" />
                  </button>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1 truncate text-sm font-semibold">
                      {b.name}
                      {b.popular && <Star className="size-3 shrink-0 fill-accent-2 text-accent-2" aria-label="Popular" />}
                    </span>
                    <span className="block truncate text-xs text-dim">
                      <b className="text-text tabular-nums">{cedis(b.price)}</b> · {b.category} · {b.size}
                      {!inStock && <span className="text-warning"> · out tonight</span>}
                    </span>
                  </span>
                  <Toggle checked={inStock} label={`${b.name} in stock`} onChange={(v) => setStock(v ? [...stock, b.id] : stock.filter((x) => x !== b.id))} />
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {editing && <EditTier tierId={editing} />}
    </Screen>
  )
}

function Stat({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <span className="block px-2 py-1.5">
      <span className="block text-[10px] font-bold text-faint uppercase">{k}</span>
      <span className="block text-[15px] font-bold tabular-nums">{v}</span>
      {sub && <span className="block text-[10px] text-faint">{sub}</span>}
    </span>
  )
}

function EditTier({ tierId }: { tierId: string }) {
  const t = tierById(tierId)
  const q = tableQuote(t, [])
  return (
    <Sheet
      title={`Edit ${t.name}`}
      footer={
        <Button block size="lg">
          Save changes
        </Button>
      }
    >
      <div className="space-y-4 pb-2">
        <TextField label="Tier name" defaultValue={t.name} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Minimum spend" prefix="₵" defaultValue={t.minSpend.toLocaleString('en-GH')} inputMode="numeric" />
          <TextField label="Capacity" defaultValue={String(t.capacity)} inputMode="numeric" />
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-dim">Deposit</span>
          <div className="flex gap-1.5">
            {[20, 30, 40, 50, 100].map((p) => (
              <Chip key={p} selected={p === t.depositPct} className="h-8 flex-1 justify-center px-0 text-[13px]">
                {p}%
              </Chip>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-faint">
            Guest pays {cedis(q.deposit)} + {cedis(q.fee)} booking fee now, {cedis(q.balanceAtVenue)} at the venue.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span>
            <span className="block text-sm font-medium">Needs approval over capacity</span>
            <span className="block text-xs text-faint">Requests land in Approvals</span>
          </span>
          <Toggle checked label="Needs approval over capacity" />
        </div>
      </div>
    </Sheet>
  )
}
