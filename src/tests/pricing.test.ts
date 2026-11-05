import { describe, expect, it } from 'vitest'
import { tableTiers, events } from '@/data/fixtures'
import { canonicalTable, RULES, tableQuote, ticketQuote } from '@/lib/pricing'
import { cedis } from '@/lib/format'

const booth = tableTiers.vault.find((t) => t.id === 'booth')!

describe('table pricing', () => {
  it('prices the canonical booking the same everywhere', () => {
    const q = tableQuote(booth, canonicalTable.lines)
    expect(q).toMatchObject({ preOrder: 6480, minimum: 6000, shortfall: 0, deposit: 1944, fee: 194, dueNow: 2138, balanceAtVenue: 4536 })
  })

  it('takes the deposit on the minimum when the pre-order is short', () => {
    const q = tableQuote(booth, canonicalTable.shortLines)
    expect(q.shortfall).toBe(6000 - q.preOrder)
    expect(q.commitment).toBe(6000)
    expect(q.deposit).toBe(1800)
  })

  it('has refund bands from most to least generous', () => {
    const pcts = RULES.refund.map((r) => r.pct)
    expect(pcts).toEqual([...pcts].sort((a, b) => b - a))
  })
})

describe('ticket pricing', () => {
  it('adds the ticket fee', () => {
    const tier = events[0].ticketTiers.find((t) => t.id === 'ga')!
    const q = ticketQuote([{ tier, qty: 2 }])
    expect(q.subtotal).toBe(tier.price * 2)
    expect(q.total).toBe(q.subtotal + Math.round((q.subtotal * RULES.ticketFeePct) / 100))
  })
})

describe('format', () => {
  it('formats cedis with a thousands separator', () => {
    expect(cedis(2138)).toBe('₵2,138')
  })
})
