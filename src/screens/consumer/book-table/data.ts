// Booking-flow helpers and SAMPLE data local to the "Book a table" screens.
// Every cedi amount is derived from tableQuote / RULES / fixtures — nothing is hard-coded.
import { NOW, bottleById, eventById, guests as fixtureGuests, tableTiers, venueById } from '@/data/fixtures'
import { floorPlans } from '@/data/floorplans'
import type { FloorPlanId, Guest, Table, TableTier } from '@/data/types'
import type { FloorStatus } from '@/components/app/FloorPlan'
import { RULES, canonicalTable, type Line } from '@/lib/pricing'

/** Which night each venue's stories book. Venue ids match floor-plan ids. */
export const venueEvent: Record<FloorPlanId, string> = {
  vault: canonicalTable.eventId,
  skyline: 'sunset-sessions',
  koko: 'highlife-champagne',
}

export function bookingCtx(planId: FloorPlanId = 'vault') {
  const venue = venueById(planId)
  const event = eventById(venueEvent[planId])
  const tiers = tableTiers[planId]
  const plan = floorPlans[planId]
  return { venue, event, tiers, plan, planId }
}
export type BookingCtx = ReturnType<typeof bookingCtx>

export const canonical = (() => {
  const ctx = bookingCtx('vault')
  const table = ctx.plan.tables.find((t) => t.id === canonicalTable.tableId)!
  const tier = ctx.tiers.find((t) => t.id === canonicalTable.tierId)!
  return { ...ctx, table, tier }
})()

export const tierOf = (tiers: TableTier[], t: Table) => tiers.find((x) => x.id === t.tierId)!

export const statusOf = (t: Table, statuses?: Record<string, FloorStatus>): FloorStatus => statuses?.[t.id] ?? t.status

export const availableTables = (tables: Table[], statuses?: Record<string, FloorStatus>) =>
  tables.filter((t) => statusOf(t, statuses) === 'available')

/** Doors + RULES.holdMinutesAfterDoors. */
export const arrivalCutoff = (doorsAt: string) => new Date(Date.parse(doorsAt) + RULES.holdMinutesAfterDoors * 60_000).toISOString()

/** Arrival slots every 30 min from doors until the cut-off. */
export function arrivalSlots(doorsAt: string) {
  const end = Date.parse(arrivalCutoff(doorsAt))
  const out: string[] = []
  for (let t = Date.parse(doorsAt); t <= end; t += 30 * 60_000) out.push(new Date(t).toISOString())
  return out
}

/** SAMPLE: arrival windows the venue has closed (door capacity). Shown as "Notify". */
export const soldOutSlots: Record<string, number[]> = {
  'afrobeats-til-dawn': [Date.parse('2026-12-18T23:00:00Z')],
  'sunset-sessions': [Date.parse('2026-12-19T16:00:00Z')],
  'highlife-champagne': [],
}

/** Refund schedule for a deposit, with concrete deadlines computed from RULES.refund. */
export function refundSchedule(startsAt: string, deposit: number, now: string = NOW) {
  const start = Date.parse(startsAt)
  const rules = RULES.refund
  return rules.map((r, i) => {
    const deadline = i < rules.length - 1 ? new Date(start - r.hoursBefore * 3_600_000).toISOString() : undefined
    const after = i > 0 ? new Date(start - rules[i - 1].hoursBefore * 3_600_000).toISOString() : undefined
    const passed = deadline ? Date.parse(now) >= Date.parse(deadline) : false
    return { ...r, deadline, after, passed, amount: Math.round((deposit * r.pct) / 100) }
  })
}

/** Split the deposit across everyone who hasn't declined; the host absorbs the rounding. */
export function splitDeposit(deposit: number, people: number) {
  const each = Math.floor(deposit / Math.max(1, people))
  return { each, host: deposit - each * (people - 1) }
}

export const linesTotal = (lines: Line[]) => lines.reduce((s, l) => s + bottleById(l.bottleId).price * l.qty, 0)

/** SAMPLE packages, priced from the bottle list. */
export const packages: { id: string; name: string; blurb: string; lines: Line[] }[] = [
  {
    id: 'birthday',
    name: 'Birthday package',
    blurb: '2× Moët with sparklers, mixers, Red Bull',
    lines: [
      { bottleId: 'moet', qty: 2 },
      { bottleId: 'mixers', qty: 1 },
      { bottleId: 'redbull', qty: 1 },
    ],
  },
  { id: 'starter', name: 'Detty starter', blurb: 'Moët, Hennessy, Jameson, chichinga', lines: canonicalTable.lines },
  {
    id: 'big-night',
    name: 'Big night',
    blurb: 'Don Julio 1942, Moët, shisha',
    lines: [
      { bottleId: 'dj-1942', qty: 1 },
      { bottleId: 'moet', qty: 1 },
      { bottleId: 'mixers', qty: 2 },
      { bottleId: 'shisha', qty: 1 },
    ],
  },
]

/** Canonical lines plus a showpiece tequila — well over the booth minimum. */
export const overLines: Line[] = [...canonicalTable.lines, { bottleId: 'dj-1942', qty: 1 }]

export const host = fixtureGuests[0]
/** SAMPLE extra guest so a 6-seat table can be shown full. Fictional. */
const extra: Guest = { id: 'g6', name: 'Adwoa Frimpong', phone: '+233 24 555 0177', status: 'accepted' }

export const guestSets: Record<'justMe' | 'partial' | 'full', Guest[]> = {
  justMe: [host],
  partial: [host, fixtureGuests[1], fixtureGuests[3], fixtureGuests[4], fixtureGuests[5]],
  full: [host, fixtureGuests[1], fixtureGuests[2], fixtureGuests[3], fixtureGuests[4], extra],
}

export const occasions = ['Birthday', 'Detty December', 'Anniversary', 'Corporate', 'Proposal'] as const
export type Occasion = (typeof occasions)[number]

export const viewPhoto = (planId: FloorPlanId, tierId: string) => {
  const img = (n: string) => `${import.meta.env.BASE_URL}img/${n}.webp`
  if (planId === 'vault') return tierId === 'hightop' ? img('venue-entrance') : img('venue-vault')
  if (planId === 'skyline') return img('venue-skyline')
  return img('venue-koko')
}

/** SAMPLE: the venue raised the booth minimum while the guest was choosing (price-changed story). */
export const repricedTier = (t: TableTier): TableTier => ({ ...t, minSpend: t.minSpend + 500 })
