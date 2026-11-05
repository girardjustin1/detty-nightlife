// SAMPLE ticket-order rules for the drafts (candidates for RULES in src/lib/pricing.ts).
import { eventById } from '@/data/fixtures'
import type { AccraEvent, TicketTier } from '@/data/types'
import { ticketQuote } from '@/lib/pricing'

export const TICKET_RULES = {
  /** Max tickets in one order, across tiers. Bigger groups are nudged toward a table. */
  maxPerOrder: 6,
  /** Below this many left, the tier shows "Only N left". */
  lowStock: 20,
  /** Sample promo code. */
  promo: { code: 'DETTYDEC', pct: 10 },
} as const

export type Selection = Record<string, number>

export const sampleEvent = eventById('afrobeats-til-dawn')

/** The same event with every tier sold out (story state). */
export function soldOut(ev: AccraEvent): AccraEvent {
  return { ...ev, ticketTiers: ev.ticketTiers.map((t) => ({ ...t, status: 'sold-out' as const, remaining: 0 })) }
}

export const countOf = (sel: Selection) => Object.values(sel).reduce((a, b) => a + b, 0)

/** Per-ticket all-in price, from ticketQuote so fees match checkout exactly. */
export function perTicket(tier: TicketTier) {
  const q = ticketQuote([{ tier, qty: 1 }])
  return { total: q.total, fee: q.fee }
}

export function linesFor(ev: AccraEvent, sel: Selection, discountPct = 0) {
  return ev.ticketTiers
    .filter((t) => (sel[t.id] ?? 0) > 0)
    .map((tier) => ({ tier: discountPct ? { ...tier, price: Math.round(tier.price * (1 - discountPct / 100)) } : tier, qty: sel[tier.id] }))
}
