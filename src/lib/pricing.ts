// One source of truth for draft pricing, so every screen shows the same numbers.
// SAMPLE RULES — placeholders until the commercial model is decided.
import { bottleById } from '@/data/fixtures'
import type { TableTier, TicketTier } from '@/data/types'

export const RULES = {
  /** Platform booking fee on tables, % of the pre-order (or minimum if higher). Non-refundable. */
  tableFeePct: 3,
  /** Ticket fee, % per ticket. */
  ticketFeePct: 5,
  /** Venue service charge, settled at the venue, not prepaid. */
  venueServicePct: 10,
  /** Refund of the deposit by notice given. */
  refund: [
    { hoursBefore: 48, pct: 100, label: 'More than 48 hours before' },
    { hoursBefore: 6, pct: 50, label: '6–48 hours before' },
    { hoursBefore: 0, pct: 0, label: 'Less than 6 hours before, or no-show' },
  ],
  /** Table is held this long after doors before release. */
  holdMinutesAfterDoors: 120,
  /** How long a held table waits for payment (MoMo approval etc.). */
  checkoutHoldMinutes: 10,
} as const

export type Line = { bottleId: string; qty: number }

export function tableQuote(tier: TableTier, lines: Line[]) {
  const preOrder = lines.reduce((s, l) => s + bottleById(l.bottleId).price * l.qty, 0)
  const commitment = Math.max(preOrder, tier.minSpend)
  const deposit = Math.round((commitment * tier.depositPct) / 100)
  const fee = Math.round((commitment * RULES.tableFeePct) / 100)
  return {
    preOrder,
    minimum: tier.minSpend,
    shortfall: Math.max(0, tier.minSpend - preOrder),
    commitment,
    deposit,
    fee,
    dueNow: deposit + fee,
    balanceAtVenue: commitment - deposit,
    serviceAtVenue: Math.round((commitment * RULES.venueServicePct) / 100),
  }
}

export function ticketQuote(lines: { tier: TicketTier; qty: number }[]) {
  const subtotal = lines.reduce((s, l) => s + l.tier.price * l.qty, 0)
  const fee = Math.round((subtotal * RULES.ticketFeePct) / 100)
  return { subtotal, fee, total: subtotal + fee, count: lines.reduce((s, l) => s + l.qty, 0) }
}

/** Canonical draft path used across stories: The Vault · Afrobeats Til Dawn · booth B3. */
export const canonicalTable = {
  venueId: 'vault',
  eventId: 'afrobeats-til-dawn',
  tableId: 'B3',
  tierId: 'booth',
  lines: [
    { bottleId: 'moet', qty: 1 },
    { bottleId: 'hennessy-vs', qty: 1 },
    { bottleId: 'jameson', qty: 1 },
    { bottleId: 'mixers', qty: 2 },
    { bottleId: 'chichinga', qty: 1 },
  ] as Line[],
  /** Same table, short of the minimum. */
  shortLines: [
    { bottleId: 'moet', qty: 1 },
    { bottleId: 'mixers', qty: 1 },
  ] as Line[],
}
