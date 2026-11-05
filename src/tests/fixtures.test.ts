import { describe, expect, it } from 'vitest'
import { bookings, bottles, eventById, events, pastEvents, tableTiers, venueById, venues } from '@/data/fixtures'
import { floorPlans } from '@/data/floorplans'
import { canonicalTable } from '@/lib/pricing'
import { BOOKING_WHATSAPP } from '@/config/contact'

describe('sample data integrity', () => {
  it('every event points at a real venue', () => {
    for (const e of [...events, ...pastEvents]) expect(venueById(e.venueId), e.id).toBeTruthy()
  })
  it('every booking points at a real event, venue and bottles', () => {
    for (const b of bookings) {
      expect(eventById(b.eventId), b.id).toBeTruthy()
      expect(venueById(b.venueId), b.id).toBeTruthy()
      for (const l of b.bottles) expect(bottles.some((x) => x.id === l.bottleId), `${b.id}:${l.bottleId}`).toBe(true)
    }
  })
  it('floor plan tables use tiers that exist for that venue', () => {
    for (const plan of Object.values(floorPlans)) {
      const tiers = tableTiers[plan.id].map((t) => t.id)
      for (const t of plan.tables) expect(tiers, `${plan.id}:${t.id}`).toContain(t.tierId)
    }
  })
  it('venues with a floor plan have table tiers', () => {
    for (const v of venues.filter((v) => v.floorPlanId)) expect(tableTiers[v.id]?.length, v.id).toBeGreaterThan(0)
  })
  it('past events are not listed as upcoming', () => {
    for (const e of pastEvents) expect(events.find((x) => x.id === e.id)).toBeUndefined()
  })
  it('the canonical path is consistent', () => {
    expect(eventById(canonicalTable.eventId).venueId).toBe(canonicalTable.venueId)
    expect(floorPlans.vault.tables.some((t) => t.id === canonicalTable.tableId)).toBe(true)
  })
  it('the booking WhatsApp number is a valid wa.me link', () => {
    expect(BOOKING_WHATSAPP.link).toBe(`https://wa.me/${BOOKING_WHATSAPP.e164.slice(1)}`)
  })
})
