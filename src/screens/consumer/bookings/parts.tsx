// Small pieces shared by the 08 My Bookings and 09 Guests screens.
import type { ReactNode } from 'react'
import { CloudDownload, MessageCircle, Minus, Plus, Search } from 'lucide-react'
import { floorPlans } from '@/data/floorplans'
import { bottleById, tableTiers, venueById } from '@/data/fixtures'
import { FloorPlan } from '@/components/app/FloorPlan'
import { Badge } from '@/components/ui/primitives'
import { cedis, cx } from '@/lib/format'
import type { Line } from '@/lib/pricing'
import { chipFor, type ChipStatus } from './bookingData'

export function StatusChip({ status, className }: { status: ChipStatus; className?: string }) {
  const c = chipFor[status]
  return (
    <Badge tone={c.tone} className={className}>
      {status === 'awaiting-payment' && <span className="size-1.5 animate-pulse rounded-full bg-current" />}
      {c.label}
    </Badge>
  )
}

/** Shown on every QR screen: the code is cached on the phone. */
export function OfflinePill({ className }: { className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success', className)}>
      <CloudDownload className="size-3.5" /> Saved for offline
    </span>
  )
}

/** Icon + label + value fact row. */
export function FactRow({ icon, label, value, trailing }: { icon: ReactNode; label: string; value: ReactNode; trailing?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-dim">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-faint">{label}</div>
        <div className="truncate text-[15px] font-medium">{value}</div>
      </div>
      {trailing}
    </div>
  )
}

/** wa.me share intent with no number: the person picks the chat (guest-to-guest invites, nudges). */
export const waShare = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`

/** Anchor styled like Button variant="whatsapp" (partner green is allowed). */
export const waButtonClass =
  'inline-flex w-full items-center justify-center gap-2 rounded-control bg-whatsapp font-semibold text-[#06260f] transition hover:brightness-105 active:scale-[0.98]'

/** A row that opens the booking WhatsApp line (src/config/contact.ts) with a prefilled message. */
export function WhatsAppRow({ title, subtitle, href }: { title: string; subtitle?: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex w-full items-center gap-3 rounded-card border border-line bg-surface p-3.5 text-left">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-whatsapp text-[#06260f]">
        <MessageCircle className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{title}</span>
        {subtitle && <span className="block truncate text-sm text-dim">{subtitle}</span>}
      </span>
    </a>
  )
}

/** A cropped, non-interactive floor plan centred on one table. */
export function MiniFloorPlan({ venueId, tableId, height = 200 }: { venueId: string; tableId: string; height?: number }) {
  const v = venueById(venueId)
  const plan = v.floorPlanId ? floorPlans[v.floorPlanId] : undefined
  const t = plan?.tables.find((x) => x.id === tableId)
  if (!plan || !t) return null
  const yPct = (t.y / plan.height) * 100
  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-black" style={{ height }} aria-label={`Floor plan with table ${t.label} highlighted`}>
      <div className="pointer-events-none" style={{ transform: `translateY(calc(${-yPct}% + ${height / 2 + 20}px))` }}>
        <FloorPlan plan={plan} tiers={tableTiers[venueId]} selectedId={tableId} className="rounded-none border-0" />
      </div>
    </div>
  )
}

/** Simple bottle stepper list (re-used by Modify booking). */
export function BottleStepperList({ lines, available, onChange }: { lines: Line[]; available: string[]; onChange: (l: Line[]) => void }) {
  const qty = (id: string) => lines.find((l) => l.bottleId === id)?.qty ?? 0
  const set = (id: string, n: number) => {
    const rest = lines.filter((l) => l.bottleId !== id)
    onChange(n > 0 ? [...rest, { bottleId: id, qty: n }].sort((a, b) => available.indexOf(a.bottleId) - available.indexOf(b.bottleId)) : rest)
  }
  return (
    <ul className="divide-y divide-line">
      {available.map((id) => {
        const b = bottleById(id)
        const n = qty(id)
        return (
          <li key={id} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{b.name}</div>
              <div className="text-sm text-dim">
                {b.size} · <span className="text-text tabular-nums">{cedis(b.price)}</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-control border border-line bg-surface">
              <button aria-label={`Remove ${b.name}`} disabled={n === 0} onClick={() => set(id, n - 1)} className="flex size-8 items-center justify-center rounded-control disabled:opacity-30">
                <Minus className="size-4" />
              </button>
              <span className="min-w-5 text-center font-semibold tabular-nums">{n}</span>
              <button aria-label={`Add ${b.name}`} onClick={() => set(id, n + 1)} className="flex size-8 items-center justify-center rounded-control text-accent">
                <Plus className="size-4" />
              </button>
            </span>
          </li>
        )
      })}
    </ul>
  )
}

/** Search input with an icon. (TextField's `prefix` is typed as a string, so it can't take an icon.) */
export function SearchField({ placeholder, defaultValue }: { placeholder: string; defaultValue?: string }) {
  return (
    <label className="flex h-12 items-center gap-2 rounded-control border border-line bg-surface px-4 focus-within:border-accent">
      <Search className="size-4 shrink-0 text-dim" />
      <input type="search" placeholder={placeholder} defaultValue={defaultValue} className="h-full min-w-0 flex-1 bg-transparent text-base text-text outline-none placeholder:text-faint" />
    </label>
  )
}
