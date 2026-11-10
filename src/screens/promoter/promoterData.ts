// SAMPLE DATA ONLY — promoter / venue companion app. Every person, company,
// phone number and figure here is fictional. Money is derived from the shared
// fixtures and src/lib/pricing.ts wherever possible, so the venue side shows
// the same numbers as the consumer side (booth B3 = Ama Owusu, ACC-7Q4K).
import { bookings, eventById, events, tableTiers, venueById } from '@/data/fixtures'
import { floorPlans } from '@/data/floorplans'
import type { Line } from '@/lib/pricing'
import { RULES, tableQuote } from '@/lib/pricing'
import type { FloorStatus } from '@/components/app/FloorPlan'
import type { PaymentMethod } from '@/data/types'

/** The promoter app's "now": Friday 18 Dec 2026, 11:15pm in Accra (doors 9:30pm). */
export const PROMO_NOW = '2026-12-18T23:15:00Z'

export const venue = venueById('vault')
export const tonightEvent = eventById('afrobeats-til-dawn')
export const vaultTiers = tableTiers.vault
export const vaultPlan = floorPlans.vault
export const tierById = (id: string) => vaultTiers.find((t) => t.id === id)!

/** Tables are held until doors + RULES.holdMinutesAfterDoors, then released. */
export const releaseAt = new Date(new Date(tonightEvent.doorsAt).getTime() + RULES.holdMinutesAfterDoors * 60_000).toISOString()
export const minutesBetween = (a: string, b: string) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 60_000)

/* ───────────────────────── Staff & roles ───────────────────────── */

export type Role = 'owner' | 'manager' | 'promoter' | 'door'

export const roles: { id: Role; label: string; can: string[]; cannot?: string[] }[] = [
  { id: 'owner', label: 'Owner', can: ['Everything', 'Payouts & bank details', 'Staff & permissions'] },
  { id: 'manager', label: 'Manager', can: ['Tonight, floor & bookings', 'Approvals & refunds', 'Events & pricing'], cannot: ['Change payout account'] },
  { id: 'promoter', label: 'Promoter', can: ['Your guest list & comps', 'Your commission', 'Broadcast to your opt-ins'], cannot: ['Other promoters’ lists', 'Pricing, payouts'] },
  { id: 'door', label: 'Door staff', can: ['Scan & check in', 'Guest list search'], cannot: ['Money, pricing, bookings'] },
]

export type Staff = { id: string; name: string; role: Role; phone: string; company?: string }

export const staff: Staff[] = [
  { id: 's1', name: 'Nii Armah Tetteh', role: 'owner', phone: '+233 24 555 0110' },
  { id: 's2', name: 'Esi Quaye', role: 'manager', phone: '+233 20 555 0131' },
  { id: 's3', name: 'Kofi Badu', role: 'door', phone: '+233 54 555 0175' },
  { id: 's4', name: 'Adjoa Frimpong', role: 'door', phone: '+233 27 555 0102' },
  { id: 'p1', name: 'Kweku Ansah', role: 'promoter', phone: '+233 24 555 0166', company: 'Wav Nation Ent.' },
  { id: 'p2', name: 'Afia Boakye', role: 'promoter', phone: '+233 50 555 0148', company: 'Osu After Dark' },
  { id: 'p3', name: 'Jojo Quartey', role: 'promoter', phone: '+233 55 555 0129', company: 'JQ Guestlist' },
]
export const signedInAs = staff[1]
export const staffById = (id: string) => staff.find((s) => s.id === id)!

/** Venues this phone number has access to (sign-in picker). */
export const venueAccess: { venueId: string; role: Role; tonight?: string }[] = [
  { venueId: 'vault', role: 'manager', tonight: 'Afrobeats Til Dawn' },
  { venueId: 'skyline', role: 'promoter', tonight: undefined },
  { venueId: 'koko', role: 'door', tonight: undefined },
]

/* ───────────────────────── Tonight's table bookings ───────────────────────── */

export type PayState = 'deposit-paid' | 'paid-in-full' | 'momo-failed' | 'awaiting-momo' | 'balance-due'
export type ResStatus = 'arrived' | 'booked' | 'late' | 'held' | 'cancelled' | 'no-show'

export type Reservation = {
  id: string
  ref: string
  tableId: string
  tierId: string
  host: string
  phone: string
  partySize: number
  arrived: number
  lines: Line[]
  status: ResStatus
  pay: PayState
  method: PaymentMethod
  arriveBy: string
  arrivedAt?: string
  occasion?: string
  notes?: string
  promoterId?: string
  source: 'app' | 'concierge' | 'promoter link' | 'walk-in'
  createdAt: string
  /** Paid at the venue so far, on top of the deposit. */
  paidAtVenue?: number
}

const canonical = bookings[0]

const raw: Reservation[] = [
  {
    id: 'r-b3',
    ref: canonical.ref,
    tableId: 'B3',
    tierId: 'booth',
    host: 'Ama Owusu',
    phone: '+233 24 555 0142',
    partySize: canonical.partySize,
    arrived: 4,
    lines: canonical.bottles,
    status: 'arrived',
    pay: 'deposit-paid',
    method: canonical.paymentMethod,
    arriveBy: canonical.arriveBy!,
    arrivedAt: '2026-12-18T22:58:00Z',
    occasion: 'Birthday · Kojo',
    notes: 'Sparklers with the Moët at midnight. Two guests arriving late.',
    promoterId: 'p1',
    source: 'app',
    createdAt: canonical.createdAt,
  },
  {
    id: 'r-b1',
    ref: 'ACC-4HXN',
    tableId: 'B1',
    tierId: 'booth',
    host: 'Nana Yeboah',
    phone: '+233 20 555 0177',
    partySize: 6,
    arrived: 6,
    lines: [
      { bottleId: 'dj-1942', qty: 1 },
      { bottleId: 'mixers', qty: 1 },
      { bottleId: 'redbull', qty: 1 },
    ],
    status: 'arrived',
    pay: 'deposit-paid',
    method: 'telecel-cash',
    arriveBy: '2026-12-18T23:00:00Z',
    arrivedAt: '2026-12-18T22:41:00Z',
    promoterId: 'p2',
    source: 'promoter link',
    createdAt: '2026-12-14T13:20:00Z',
  },
  {
    id: 'r-b2',
    ref: 'ACC-8RVE',
    tableId: 'B2',
    tierId: 'booth',
    host: 'Kofi Asamoah',
    phone: '+233 24 555 0193',
    partySize: 6,
    arrived: 0,
    lines: [
      { bottleId: 'hennessy-vsop', qty: 1 },
      { bottleId: 'moet', qty: 1 },
      { bottleId: 'mixers', qty: 1 },
    ],
    status: 'late',
    pay: 'deposit-paid',
    method: 'mtn-momo',
    arriveBy: '2026-12-18T23:00:00Z',
    notes: 'Asked to keep the booth if possible — stuck on Ring Road.',
    source: 'app',
    createdAt: '2026-12-16T21:02:00Z',
  },
  {
    id: 'r-b5',
    ref: 'ACC-3KQW',
    tableId: 'B5',
    tierId: 'booth',
    host: 'Abena Sarpong',
    phone: '+233 55 555 0151',
    partySize: 5,
    arrived: 0,
    lines: [
      { bottleId: 'veuve', qty: 1 },
      { bottleId: 'casamigos', qty: 1 },
    ],
    status: 'held',
    pay: 'momo-failed',
    method: 'mtn-momo',
    arriveBy: '2026-12-18T23:45:00Z',
    source: 'app',
    createdAt: '2026-12-18T23:06:00Z',
  },
  {
    id: 'r-b6',
    ref: 'ACC-6TLB',
    tableId: 'B6',
    tierId: 'booth',
    host: 'Edem Kpodo',
    phone: '+233 26 555 0108',
    partySize: 6,
    arrived: 0,
    lines: [
      { bottleId: 'moet', qty: 2 },
      { bottleId: 'jameson', qty: 1 },
    ],
    status: 'booked',
    pay: 'paid-in-full',
    method: 'card',
    arriveBy: '2026-12-18T23:30:00Z',
    occasion: 'Promotion',
    promoterId: 'p1',
    source: 'promoter link',
    createdAt: '2026-12-12T08:44:00Z',
    paidAtVenue: 0,
  },
  {
    id: 'r-h1',
    ref: 'ACC-1PZD',
    tableId: 'H1',
    tierId: 'hightop',
    host: 'Kwabena Ofori',
    phone: '+233 54 555 0186',
    partySize: 4,
    arrived: 4,
    lines: [
      { bottleId: 'hennessy-vs', qty: 1 },
      { bottleId: 'mixers', qty: 1 },
    ],
    status: 'arrived',
    pay: 'deposit-paid',
    method: 'mtn-momo',
    arriveBy: '2026-12-18T23:00:00Z',
    arrivedAt: '2026-12-18T22:01:00Z',
    source: 'app',
    createdAt: '2026-12-17T17:30:00Z',
  },
  {
    id: 'r-h3',
    ref: 'ACC-5WJC',
    tableId: 'H3',
    tierId: 'hightop',
    host: 'Akua Mensima',
    phone: '+233 20 555 0115',
    partySize: 4,
    arrived: 0,
    lines: [{ bottleId: 'belvedere', qty: 1 }],
    status: 'held',
    pay: 'awaiting-momo',
    method: 'at-money',
    arriveBy: '2026-12-18T23:45:00Z',
    source: 'app',
    createdAt: '2026-12-18T23:11:00Z',
  },
  {
    id: 'r-h4',
    ref: 'ACC-7FMS',
    tableId: 'H4',
    tierId: 'hightop',
    host: 'Kwaku Danso',
    phone: '+233 27 555 0140',
    partySize: 3,
    arrived: 0,
    lines: [
      { bottleId: 'jw-black', qty: 1 },
      { bottleId: 'kelewele', qty: 1 },
    ],
    status: 'booked',
    pay: 'deposit-paid',
    method: 'mtn-momo',
    arriveBy: '2026-12-18T23:30:00Z',
    promoterId: 'p3',
    source: 'promoter link',
    createdAt: '2026-12-18T10:02:00Z',
  },
  {
    id: 'r-l1',
    ref: 'ACC-9NGA',
    tableId: 'L1',
    tierId: 'lounge',
    host: 'Selorm Agbeko',
    phone: '+233 24 555 0124',
    partySize: 12,
    arrived: 0,
    lines: [
      { bottleId: 'ace', qty: 1 },
      { bottleId: 'dj-1942', qty: 1 },
      { bottleId: 'mixers', qty: 2 },
    ],
    status: 'booked',
    pay: 'deposit-paid',
    method: 'card',
    arriveBy: '2026-12-18T23:30:00Z',
    occasion: 'Company end-of-year',
    notes: 'Invoice to Agbeko Logistics. Host wants the parade for the Ace of Spades.',
    source: 'concierge',
    createdAt: '2026-12-09T15:15:00Z',
  },
  {
    id: 'r-l2',
    ref: 'ACC-2DUY',
    tableId: 'L2',
    tierId: 'lounge',
    host: 'Yaa Asantewaa',
    phone: '+44 7700 900318',
    partySize: 12,
    arrived: 10,
    lines: [
      { bottleId: 'clase-azul', qty: 1 },
      { bottleId: 'moet-rose', qty: 2 },
      { bottleId: 'shisha', qty: 1 },
      { bottleId: 'chichinga', qty: 1 },
    ],
    status: 'arrived',
    pay: 'balance-due',
    method: 'card',
    arriveBy: '2026-12-18T23:00:00Z',
    arrivedAt: '2026-12-18T22:35:00Z',
    occasion: 'Back home for December',
    promoterId: 'p2',
    source: 'promoter link',
    createdAt: '2026-11-28T19:40:00Z',
    paidAtVenue: 2500,
  },
]

export const reservations = raw.map((r) => {
  const q = tableQuote(tierById(r.tierId), r.lines)
  const unpaid = r.pay === 'momo-failed' || r.pay === 'awaiting-momo'
  const prepaid = r.pay === 'paid-in-full' ? q.commitment : unpaid ? 0 : q.deposit
  return {
    ...r,
    quote: q,
    depositPaid: unpaid ? 0 : q.deposit,
    prepaid,
    balance: Math.max(0, q.commitment - prepaid - (r.paidAtVenue ?? 0)),
  }
})
export type ReservationRow = (typeof reservations)[number]
export const reservationByTable = (tableId: string) => reservations.find((r) => r.tableId === tableId)

/** Floor statuses for promoter mode: free tables have no reservation. */
export const floorStatuses: Record<string, FloorStatus> = Object.fromEntries(
  vaultPlan.tables.map((t) => {
    const r = reservationByTable(t.id)
    return [t.id, r ? (r.status === 'cancelled' || r.status === 'no-show' ? 'available' : r.status) : 'available'] as const
  }),
)

/* ───────────────────────── Tickets & door ───────────────────────── */

/** Per-tier ticket sales tonight (fixture tiers carry prices; sold counts are ours). */
export const ticketSales = tonightEvent.ticketTiers.map((t) => {
  const sold = { early: 120, ga: 196, vip: 18 }[t.id as 'early' | 'ga' | 'vip'] ?? 0
  return { ...t, sold, allocation: sold + (t.remaining ?? 0) }
})
export const ticketsScanned = 141

const confirmed = reservations.filter((r) => r.status !== 'held')

export const kpis = {
  tablesTotal: vaultPlan.tables.length,
  tablesBooked: confirmed.length,
  tablesHeld: reservations.filter((r) => r.status === 'held').length,
  tableGuestsExpected: confirmed.reduce((s, r) => s + r.partySize, 0),
  tableGuestsArrived: confirmed.reduce((s, r) => s + r.arrived, 0),
  ticketsSold: ticketSales.reduce((s, t) => s + t.sold, 0),
  ticketAllocation: ticketSales.reduce((s, t) => s + t.allocation, 0),
  ticketsScanned,
  capacity: 450,
  deposits: confirmed.reduce((s, r) => s + r.prepaid, 0),
  minimumCommitted: confirmed.reduce((s, r) => s + r.quote.commitment, 0),
  balanceToCollect: confirmed.reduce((s, r) => s + r.balance, 0),
  ticketRevenue: ticketSales.reduce((s, t) => s + t.sold * t.price, 0),
}
export const guestsExpected = kpis.ticketsSold + kpis.tableGuestsExpected
export const guestsArrived = kpis.ticketsScanned + kpis.tableGuestsArrived

export type Arrival = { id: string; at: string; name: string; what: string; count?: string; by: string; kind: 'table' | 'ticket' | 'comp' }

export const arrivals: Arrival[] = [
  { id: 'a1', at: '2026-12-18T23:13:00Z', name: 'Efua Asante', what: 'Booth B3 · Ama’s party', count: '4 of 6', by: 'Kofi', kind: 'table' },
  { id: 'a2', at: '2026-12-18T23:12:00Z', name: 'Mawuli Kumah', what: 'General admission × 2', by: 'Adjoa', kind: 'ticket' },
  { id: 'a3', at: '2026-12-18T23:10:00Z', name: 'Serwaa Adomako', what: 'Comp · Wav Nation list', by: 'Kofi', kind: 'comp' },
  { id: 'a4', at: '2026-12-18T23:07:00Z', name: 'Yaa Asantewaa +1', what: 'Lounge L2', count: '10 of 12', by: 'Kofi', kind: 'table' },
  { id: 'a5', at: '2026-12-18T23:04:00Z', name: 'Dela Agyei', what: 'VIP entry × 1', by: 'Adjoa', kind: 'ticket' },
  { id: 'a6', at: '2026-12-18T23:01:00Z', name: 'Kojo Mensah', what: 'Booth B3 · Ama’s party', count: '3 of 6', by: 'Kofi', kind: 'table' },
]

/* ───────────────────────── Approvals ───────────────────────── */

export type Approval = {
  id: string
  host: string
  phone: string
  partySize: number
  kind: 'Large party' | 'Concierge' | 'Over capacity'
  forEvent: string
  arriveBy: string
  budget?: number
  message: string
  suggestedTable: string
  alternatives: string[]
  via: string
  receivedAt: string
  expiresInMin: number
  vipNote?: string
}

export const approvals: Approval[] = [
  {
    id: 'ap1',
    host: 'Kwame Asiedu',
    phone: '+1 202 555 0164',
    partySize: 11,
    kind: 'Large party',
    forEvent: 'afrobeats-til-dawn',
    arriveBy: '2026-12-19T00:00:00Z',
    budget: 18000,
    message: 'Flying in tonight with my cousins. 11 of us, we want the lounge and a bottle parade.',
    suggestedTable: 'L3',
    alternatives: ['B4 + H2'],
    via: 'App request',
    receivedAt: '2026-12-18T23:02:00Z',
    expiresInMin: 25,
    vipNote: '3 past bookings · always met minimum',
  },
  {
    id: 'ap2',
    host: 'Mansa Owusu-Ansah',
    phone: '+233 24 555 0157',
    partySize: 8,
    kind: 'Over capacity',
    forEvent: 'afrobeats-til-dawn',
    arriveBy: '2026-12-18T23:45:00Z',
    message: 'Booth is for 6, we are 8. Happy to add a bottle to cover it.',
    suggestedTable: 'B4',
    alternatives: ['L3'],
    via: 'App request',
    receivedAt: '2026-12-18T22:50:00Z',
    expiresInMin: 40,
  },
  {
    id: 'ap3',
    host: 'Elmina Travel (concierge)',
    phone: '+233 30 555 0190',
    partySize: 14,
    kind: 'Concierge',
    forEvent: 'nye-countdown',
    arriveBy: '2026-12-31T22:00:00Z',
    budget: 30000,
    message: 'Corporate client group of 14 for NYE. Need two adjoining lounge tables and an invoice.',
    suggestedTable: 'L1 + L2',
    alternatives: ['L2 + L3'],
    via: 'WhatsApp concierge',
    receivedAt: '2026-12-18T16:20:00Z',
    expiresInMin: 1440,
  },
]

/* ───────────────────────── Door scan results ───────────────────────── */

export type ScanResult =
  | { kind: 'valid'; name: string; what: string; ref: string; party?: { inNow: number; of: number }; note?: string }
  | { kind: 'already'; name: string; what: string; ref: string; at: string; by: string }
  | { kind: 'invalid'; reason: 'wrong-night' | 'not-found' | 'refunded'; name?: string; what?: string; detail: string }

export const scanResults: Record<'valid' | 'validTicket' | 'already' | 'wrongNight' | 'notFound', ScanResult> = {
  valid: { kind: 'valid', name: 'Efua Asante', what: 'VIP booth B3 · Ama Owusu’s table', ref: canonical.ref, party: { inNow: 4, of: 6 }, note: 'Birthday table — sparklers at midnight' },
  validTicket: { kind: 'valid', name: 'Mawuli Kumah', what: 'General admission · Ticket 1 of 2', ref: 'ACC-T5520' },
  already: { kind: 'already', name: 'Kwabena Ofori', what: 'High-top H1 · table host', ref: 'ACC-1PZD', at: '2026-12-18T22:01:00Z', by: 'Kofi' },
  wrongNight: { kind: 'invalid', reason: 'wrong-night', name: 'Nhyira Appiah', what: 'Hiplife Throwback · GA', detail: 'This ticket is for Wed 23 Dec. Not valid tonight.' },
  notFound: { kind: 'invalid', reason: 'not-found', detail: 'Code not recognised. It may be a screenshot of an old code or a fake.' },
}

/* ───────────────────────── Guest list ───────────────────────── */

export type ListGuest = {
  id: string
  name: string
  phone: string
  list: 'Door list' | 'Comp' | 'Table' | 'Ticket'
  status: 'attending' | 'pending' | 'no-show' | 'checked-in'
  plusOnes: number
  addedBy: string
  table?: string
  at?: string
}

export const guestList: ListGuest[] = [
  { id: 'gl0', name: 'Ama Owusu', phone: '+233 24 555 0142', list: 'Table', status: 'checked-in', plusOnes: 0, addedBy: 'Host', table: 'B3', at: '2026-12-18T22:58:00Z' },
  { id: 'gl1', name: 'Serwaa Adomako', phone: '+233 24 555 0103', list: 'Comp', status: 'checked-in', plusOnes: 1, addedBy: 'Kweku Ansah', at: '2026-12-18T23:10:00Z' },
  { id: 'gl2', name: 'Efua Asante', phone: '+233 54 555 0123', list: 'Table', status: 'checked-in', plusOnes: 0, addedBy: 'Ama Owusu', table: 'B3', at: '2026-12-18T23:13:00Z' },
  { id: 'gl3', name: 'Kojo Mensah', phone: '+233 20 555 0187', list: 'Table', status: 'checked-in', plusOnes: 0, addedBy: 'Ama Owusu', table: 'B3', at: '2026-12-18T23:01:00Z' },
  { id: 'gl4', name: 'Yaw Boateng', phone: '+233 27 555 0199', list: 'Table', status: 'checked-in', plusOnes: 0, addedBy: 'Ama Owusu', table: 'B3', at: '2026-12-18T22:58:00Z' },
  { id: 'gl5', name: 'Akosua Darko', phone: '+233 55 555 0164', list: 'Table', status: 'pending', plusOnes: 0, addedBy: 'Ama Owusu', table: 'B3' },
  { id: 'gl6', name: 'DJ Abena K', phone: '+233 50 555 0177', list: 'Comp', status: 'attending', plusOnes: 2, addedBy: 'Esi Quaye' },
  { id: 'gl7', name: 'Fiifi Arthur', phone: '+233 24 555 0135', list: 'Door list', status: 'attending', plusOnes: 1, addedBy: 'Afia Boakye' },
  { id: 'gl8', name: 'Ewurabena Koomson', phone: '+233 20 555 0144', list: 'Door list', status: 'pending', plusOnes: 0, addedBy: 'Jojo Quartey' },
  { id: 'gl9', name: 'Kobby Ntim', phone: '+233 26 555 0181', list: 'Comp', status: 'pending', plusOnes: 1, addedBy: 'Kweku Ansah' },
  { id: 'gl10', name: 'Naa Dedei Lamptey', phone: '+233 54 555 0112', list: 'Door list', status: 'no-show', plusOnes: 1, addedBy: 'Afia Boakye' },
  { id: 'gl11', name: 'Kwesi Arhin', phone: '+233 27 555 0160', list: 'Comp', status: 'no-show', plusOnes: 0, addedBy: 'Kweku Ansah' },
  { id: 'gl12', name: 'Adwoa Pokuaa', phone: '+233 55 555 0196', list: 'Door list', status: 'attending', plusOnes: 0, addedBy: 'Jojo Quartey' },
]

/** Promoter comp allowances for tonight. */
export const compLists = [
  { promoterId: 'p1', allowance: 20, used: 14, checkedIn: 6 },
  { promoterId: 'p2', allowance: 15, used: 15, checkedIn: 9 },
  { promoterId: 'p3', allowance: 10, used: 4, checkedIn: 1 },
]

/* ───────────────────────── Events & sales ───────────────────────── */

export const vaultEvents = events
  .filter((e) => e.venueId === 'vault')
  .map((e) => {
    const s = {
      'afrobeats-til-dawn': { tickets: kpis.ticketsSold, ticketCap: kpis.ticketAllocation, tables: kpis.tablesBooked, status: 'live' as const },
      'hiplife-throwback': { tickets: 148, ticketCap: 380, tables: 5, status: 'on-sale' as const },
      'nye-countdown': { tickets: 402, ticketCap: 450, tables: 12, status: 'on-sale' as const },
    }[e.id] ?? { tickets: 0, ticketCap: 400, tables: 0, status: 'draft' as const }
    return { event: e, ...s, tableCap: vaultPlan.tables.length }
  })

/** A draft the manager is building in the Create event flow. */
export const draftEvent = {
  title: 'Amapiano Saturdays: Year-End',
  photo: eventById('log-drum-sundays').photo,
  /** Per-night minimum spend overrides (tier id → ₵). */
  minOverrides: { lounge: 18000 },
  date: '2027-01-02T22:00:00Z',
  doors: '2027-01-02T21:30:00Z',
  ends: '2027-01-03T04:00:00Z',
  genres: ['Amapiano', 'Afro House'],
  lineup: [
    { name: 'Nana Piano', role: 'Headliner' },
    { name: 'DJ Abena K', role: 'DJ' },
    { name: 'MC Blaze', role: 'Host' },
  ],
  ticketTiers: [
    { id: 'early', name: 'Early bird', price: 150, qty: 100, window: 'Until 26 Dec' },
    { id: 'ga', name: 'General admission', price: 220, qty: 250, window: 'Until doors' },
    { id: 'vip', name: 'VIP entry', price: 600, qty: 40, window: 'Until doors' },
  ],
}

/* ───────────────────────── Payouts ───────────────────────── */

/**
 * SAMPLE commercial terms for the venue side. Not decided yet — these should
 * move into RULES in src/lib/pricing.ts once agreed.
 */
export const VENUE_TERMS = {
  /** Platform commission on online sales the venue receives. */
  platformPct: 5,
  /** Promoter commission on tables/tickets sold through their link. */
  promoterPct: 10,
  /** Settlement delay after the night. */
  settleDays: 2,
  /** WhatsApp marketing template, est. cost per delivered message (sample). */
  waMessageCost: 0.45,
}

export type Night = { id: string; title: string; date: string; tables: number; tickets: number; status: 'settled' | 'pending' | 'processing'; promoterSales?: number; paidTo?: string; paidOn?: string }

const promoGross = (id: string) => reservations.filter((r) => r.promoterId === id && r.status !== 'held').reduce((s, r) => s + r.prepaid, 0)

export const promoterCommission = staff
  .filter((s) => s.role === 'promoter')
  .map((p) => {
    const sales = promoGross(p.id)
    const tables = reservations.filter((r) => r.promoterId === p.id && r.status !== 'held').length
    return { promoter: p, tables, sales, commission: Math.round((sales * VENUE_TERMS.promoterPct) / 100) }
  })

export const nights: Night[] = [
  { id: 'n0', title: 'Afrobeats Til Dawn', date: '2026-12-18T22:00:00Z', tables: kpis.deposits, tickets: kpis.ticketRevenue, status: 'pending' },
  { id: 'n1', title: 'Amapiano Wednesdays', date: '2026-12-16T22:00:00Z', tables: 21400, tickets: 18750, status: 'processing', promoterSales: 9600 },
  { id: 'n2', title: 'Saturday Social', date: '2026-12-12T22:00:00Z', tables: 48200, tickets: 41250, status: 'settled', promoterSales: 22000, paidTo: 'MTN MoMo ·· 0110', paidOn: '2026-12-14T09:00:00Z' },
  { id: 'n3', title: 'Afro Fridays', date: '2026-12-11T22:00:00Z', tables: 39600, tickets: 36500, status: 'settled', promoterSales: 17400, paidTo: 'MTN MoMo ·· 0110', paidOn: '2026-12-13T09:00:00Z' },
  { id: 'n4', title: 'Hiplife Wednesday', date: '2026-12-09T22:00:00Z', tables: 12800, tickets: 15600, status: 'settled', promoterSales: 4800, paidTo: 'GCB Bank ·· 4471', paidOn: '2026-12-11T09:00:00Z' },
]

export const nightNet = (n: Night) => {
  const gross = n.tables + n.tickets
  const fee = Math.round((gross * VENUE_TERMS.platformPct) / 100)
  const promo = n.id === 'n0' ? promoterCommission.reduce((s, p) => s + p.commission, 0) : Math.round(((n.promoterSales ?? 0) * VENUE_TERMS.promoterPct) / 100)
  return { gross, fee, promo, net: gross - fee - promo }
}

/* ───────────────────────── Broadcast ───────────────────────── */

export const audience = {
  pastGuests: 3460,
  optedIn: 2184,
  segments: [
    { id: 'all', label: 'All opted-in guests', count: 2184 },
    { id: 'amapiano', label: 'Liked Amapiano nights', count: 1206 },
    { id: 'tables', label: 'Booked a table before', count: 412 },
    { id: 'lapsed', label: 'Not been in 60+ days', count: 738 },
    { id: 'diaspora', label: 'Diaspora numbers (+44, +1…)', count: 296 },
  ],
}

export const momoAccounts = [
  { id: 'momo', label: 'MTN MoMo', detail: 'Nii Armah Tetteh ·· 0110', method: 'mtn-momo' as const },
  { id: 'bank', label: 'GCB Bank', detail: 'The Vault Ent. Ltd ·· 4471', method: 'card' as const },
]

/** B3 timeline for the booking detail (times from the shared booking fixture). */
export const b3Timeline = [
  { id: 'booked', label: 'Booked in the app', at: '2026-12-15T19:12:00Z', done: true },
  { id: 'deposit', label: 'Deposit paid · MTN MoMo', at: '2026-12-15T19:13:00Z', done: true },
  { id: 'guests', label: '5 invites sent · 2 accepted', at: '2026-12-16T12:40:00Z', done: true },
  { id: 'arrived', label: 'Arrived · 4 of 6 in', at: '2026-12-18T22:58:00Z', done: true },
  { id: 'balance', label: 'Balance settled at the venue', at: undefined, done: false },
]
