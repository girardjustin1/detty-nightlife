// Derived data for the 08 My Bookings screens. SAMPLE ONLY.
// Every amount is computed from src/lib/pricing.ts so the screens agree with checkout.
import { bookings, eventById, me, NOW, tableTiers, venueById } from '@/data/fixtures'
import type { Booking, BookingStatus, PaymentMethod } from '@/data/types'
import { RULES, tableQuote, ticketQuote, type Line } from '@/lib/pricing'
import { cedis } from '@/lib/format'

export { NOW }

/* ───────────────────────── Look-ups ───────────────────────── */

export const tierFor = (b: Pick<Booking, 'venueId' | 'tierId'>) => tableTiers[b.venueId]?.find((t) => t.id === b.tierId)

export function quoteFor(b: Pick<Booking, 'venueId' | 'tierId' | 'bottles'>, lines: Line[] = b.bottles) {
  const tier = tierFor(b)
  return tier ? tableQuote(tier, lines) : undefined
}

export function ticketQuoteFor(b: Booking) {
  const ev = eventById(b.eventId)
  return ticketQuote((b.tickets ?? []).map((t) => ({ tier: ev.ticketTiers.find((x) => x.id === t.tierId)!, qty: t.qty })))
}

export const hoursBetween = (fromIso: string, toIso: string) => (new Date(toIso).getTime() - new Date(fromIso).getTime()) / 3_600_000

/* ───────────────────────── Refund rules ───────────────────────── */

/** Which RULES.refund band applies, and the exact cedi refund for this deposit. Booking fee never refunds. */
export function refundFor(deposit: number, startsAt: string, now: string = NOW) {
  const hours = hoursBetween(now, startsAt)
  const band = RULES.refund.find((r) => hours > r.hoursBefore) ?? RULES.refund[RULES.refund.length - 1]
  return { hours, band, pct: band.pct, amount: Math.round((deposit * band.pct) / 100) }
}

/** All three bands with this booking's amounts, for the repeated policy block. */
export function refundTable(deposit: number) {
  return RULES.refund.map((r) => ({ ...r, amount: Math.round((deposit * r.pct) / 100) }))
}

/** "Thu 17 Dec, 10pm" — the moment a band ends for this booking. */
export function bandDeadline(startsAt: string, hoursBefore: number) {
  return new Date(new Date(startsAt).getTime() - hoursBefore * 3_600_000).toISOString()
}

/* ───────────────────────── Payment labels ───────────────────────── */

export const methodLine: Record<PaymentMethod, string> = {
  'mtn-momo': 'MTN MoMo · 024 ••• 0142',
  'telecel-cash': 'Telecel Cash · 020 ••• 0142',
  'at-money': 'AT Money · 027 ••• 0142',
  card: 'Visa •••• 4821',
  lightning: 'Lightning wallet',
}

/* ───────────────────────── Status chips ───────────────────────── */

export type ChipStatus = 'confirmed' | 'awaiting-payment' | 'guests-pending' | 'completed' | 'cancelled' | 'refunded'

export const chipFor: Record<ChipStatus, { label: string; tone: 'success' | 'warning' | 'accent' | 'neutral' | 'danger' }> = {
  confirmed: { label: 'Confirmed', tone: 'success' },
  'awaiting-payment': { label: 'Awaiting payment', tone: 'warning' },
  'guests-pending': { label: 'Guests pending', tone: 'accent' },
  completed: { label: 'Completed', tone: 'neutral' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
  refunded: { label: 'Refunded', tone: 'neutral' },
}

/* ───────────────────────── List fixtures ───────────────────────── */

const [b1, b2, b3] = bookings

function tableBooking(over: Partial<Booking> & Pick<Booking, 'id' | 'ref' | 'eventId' | 'venueId' | 'tableId' | 'tierId' | 'partySize' | 'bottles' | 'status'>): Booking {
  const q = quoteFor(over)!
  return {
    kind: 'table',
    guests: b1.guests.slice(0, over.partySize),
    subtotal: q.preOrder,
    serviceFee: q.fee,
    depositPaid: over.status === 'awaiting-payment' ? 0 : q.deposit,
    balanceDue: q.balanceAtVenue,
    paymentMethod: 'mtn-momo',
    createdAt: '2026-12-16T10:00:00Z',
    ...over,
  }
}

function ticketBooking(over: Partial<Booking> & Pick<Booking, 'id' | 'ref' | 'eventId' | 'venueId' | 'tickets' | 'status'>): Booking {
  const b = { kind: 'tickets' as const, partySize: 0, bottles: [], guests: [], subtotal: 0, serviceFee: 0, depositPaid: 0, balanceDue: 0, paymentMethod: 'mtn-momo' as const, createdAt: '2026-12-12T09:00:00Z', ...over }
  const q = ticketQuoteFor(b)
  return { ...b, partySize: q.count, subtotal: q.subtotal, serviceFee: q.fee, depositPaid: q.total }
}

/** Skyline cabana, MoMo prompt sent but not yet approved. */
export const bAwaiting = tableBooking({
  id: 'b4',
  ref: 'DTY-5R2N',
  eventId: 'sunset-sessions',
  venueId: 'skyline',
  tableId: 'C2',
  tierId: 'cabana',
  partySize: 8,
  bottles: [
    { bottleId: 'veuve', qty: 2 },
    { bottleId: 'casamigos', qty: 1 },
    { bottleId: 'mixers', qty: 2 },
  ],
  status: 'awaiting-payment',
})

/** Vault high-top for the throwback night: paid, but most guests haven't accepted. */
export const bGuestsPending = tableBooking({
  id: 'b5',
  ref: 'DTY-8H3D',
  eventId: 'hiplife-throwback',
  venueId: 'vault',
  tableId: 'H2',
  tierId: 'hightop',
  partySize: 4,
  bottles: [
    { bottleId: 'jameson', qty: 1 },
    { bottleId: 'hennessy-vs', qty: 1 },
  ],
  guests: [b1.guests[0], b1.guests[1], { ...b1.guests[2], status: 'invited' }, b1.guests[3]],
  status: 'confirmed',
})

export const bNyeTickets = ticketBooking({ id: 'b6', ref: 'DTY-3N1Y', eventId: 'nye-countdown', venueId: 'vault', tickets: [{ tierId: 'vip', qty: 2 }], status: 'paid-in-full' })

/** Past: a cancelled table (50% band) and refunded tickets. */
export const bCancelled = tableBooking({
  id: 'b7',
  ref: 'DTY-4K7C',
  eventId: 'sunset-sessions',
  venueId: 'skyline',
  tableId: 'S3',
  tierId: 'sofa',
  partySize: 6,
  bottles: [{ bottleId: 'moet', qty: 1 }, { bottleId: 'mixers', qty: 1 }],
  status: 'cancelled',
  createdAt: '2026-12-08T18:20:00Z',
})

export const bRefunded = ticketBooking({ id: 'b8', ref: 'DTY-6T9R', eventId: 'sunset-sessions', venueId: 'skyline', tickets: [{ tierId: 'ga', qty: 2 }], status: 'refunded', paymentMethod: 'telecel-cash' })

/** When bCancelled was cancelled: 29.5h before Sunset Sessions, so the 50% band. */
export const cancelledAt = '2026-12-18T09:30:00Z'
export const cancelledRefund = refundFor(quoteFor(bCancelled)!.deposit, eventById(bCancelled.eventId).startsAt, cancelledAt)

export const tonightBooking = b1
export const ticketWalletBooking = b2

export type ListItem = { booking: Booking; chip: ChipStatus; note?: string }

export const upcomingList: ListItem[] = [
  { booking: b1, chip: 'confirmed', note: 'Tonight · arrive by 11:30pm' },
  { booking: bAwaiting, chip: 'awaiting-payment', note: 'Approve the MoMo prompt to hold your cabana' },
  { booking: bGuestsPending, chip: 'guests-pending', note: '1 of 3 friends accepted' },
  { booking: b2, chip: 'confirmed' },
  { booking: bNyeTickets, chip: 'confirmed' },
]

export const pastList: ListItem[] = [
  { booking: b3, chip: 'completed' },
  { booking: bCancelled, chip: 'cancelled', note: `Refund of ${cedis(cancelledRefund.amount)} on its way` },
  { booking: bRefunded, chip: 'refunded', note: `${cedis(ticketQuoteFor(bRefunded).subtotal)} back on Telecel Cash` },
]

export const statusFromBooking = (s: BookingStatus): ChipStatus =>
  s === 'awaiting-payment' ? 'awaiting-payment' : s === 'completed' || s === 'checked-in' ? 'completed' : s === 'cancelled' ? 'cancelled' : s === 'refunded' ? 'refunded' : 'confirmed'

/* ───────────────────────── Notify list ───────────────────────── */

export type NotifyItem = {
  id: string
  venueId: string
  eventId?: string
  what: string
  dateIso: string
  window: string
  party: number
  notified?: boolean
}

export const notifyItems: NotifyItem[] = [
  { id: 'n1', venueId: 'vault', eventId: 'afrobeats-til-dawn', what: 'VIP booth', dateIso: '2026-12-18T22:00:00Z', window: '10pm – 12am', party: 6, notified: true },
  { id: 'n2', venueId: 'skyline', eventId: 'sunset-sessions', what: 'Pool cabana', dateIso: '2026-12-19T15:00:00Z', window: '4pm – 7pm', party: 8 },
  { id: 'n3', venueId: 'vault', eventId: 'nye-countdown', what: 'Lounge deck', dateIso: '2026-12-31T21:00:00Z', window: 'Any time', party: 12 },
  { id: 'n4', venueId: 'koko', what: 'Any table', dateIso: '2026-12-24T20:00:00Z', window: '8pm – 10pm', party: 4 },
]

/* ───────────────────────── Receipts ───────────────────────── */

export type ReceiptEntry = {
  id: string
  bookingId: string
  kind: 'payment' | 'refund' | 'pending'
  title: string
  at: string
  amount: number
  method: PaymentMethod
}

const q1 = quoteFor(b1)!
const qC = quoteFor(bCancelled)!
const tR = ticketQuoteFor(bRefunded)

export const receiptEntries: ReceiptEntry[] = [
  { id: 'r1', bookingId: b1.id, kind: 'payment', title: 'Deposit + fee · VIP booth B3', at: b1.createdAt, amount: q1.dueNow, method: b1.paymentMethod },
  { id: 'r2', bookingId: bRefunded.id, kind: 'refund', title: 'Refund · 2 × General admission', at: '2026-12-14T08:12:00Z', amount: tR.subtotal, method: 'telecel-cash' },
  { id: 'r3', bookingId: bCancelled.id, kind: 'pending', title: `Refund · Lounge sofa S3 (${cancelledRefund.pct}%)`, at: cancelledAt, amount: cancelledRefund.amount, method: 'mtn-momo' },
  { id: 'r4', bookingId: b2.id, kind: 'payment', title: '3 × General admission', at: b2.createdAt, amount: ticketQuoteFor(b2).total, method: b2.paymentMethod },
  { id: 'r5', bookingId: bCancelled.id, kind: 'payment', title: 'Deposit + fee · Lounge sofa S3', at: bCancelled.createdAt, amount: qC.dueNow, method: 'mtn-momo' },
  { id: 'r6', bookingId: b3.id, kind: 'payment', title: 'Paid in full · Stage booth S2', at: b3.createdAt, amount: quoteFor(b3)!.commitment + quoteFor(b3)!.fee, method: b3.paymentMethod },
]

/* ───────────────────────── Contacts (transfer, invites) ───────────────────────── */

export const contacts = [
  { name: 'Kojo Mensah', phone: '+233 20 555 0187', onApp: true },
  { name: 'Efua Asante', phone: '+233 54 555 0123', onApp: true },
  { name: 'Yaw Boateng', phone: '+233 27 555 0199', onApp: false },
  { name: 'Akosua Darko', phone: '+233 55 555 0164', onApp: true },
  { name: 'Abena Ofori', phone: '+233 24 555 0110', onApp: false },
  { name: 'Nii Armah', phone: '+233 26 555 0175', onApp: true },
  { name: 'Esi Quaye', phone: '+233 50 555 0138', onApp: false },
]

export { me, venueById, eventById }

/* ───────────────────────── Guest split (09 Guests) ───────────────────────── */

/** Equal split of the whole table (commitment + booking fee). The host's share absorbs rounding. */
export function splitFor(b: Booking) {
  const q = quoteFor(b)!
  const total = q.commitment + q.fee
  const share = Math.round(total / b.partySize)
  const guestsTarget = share * (b.partySize - 1)
  return { quote: q, total, share, hostShare: total - guestsTarget, guestsTarget }
}

export type HostGuestRow = {
  id: string
  name: string
  phone: string
  state: 'host' | 'paid' | 'pending' | 'invited' | 'declined' | 'covered'
  paid?: number
  note?: string
}

const split1 = splitFor(b1)

/** Host-side view of booking b1's guests. Statuses follow fixtures.guests; paid amounts follow splitFor(). */
export const hostGuestRows: HostGuestRow[] = [
  { id: 'g0', name: b1.guests[0].name, phone: b1.guests[0].phone, state: 'host', paid: q1.dueNow, note: `Paid the ${cedis(q1.dueNow)} deposit + fee` },
  { id: 'g1', name: 'Kojo Mensah', phone: '+233 20 555 0187', state: 'paid', paid: split1.share, note: 'Paid by MTN MoMo · Tue 15 Dec' },
  { id: 'g2', name: 'Efua Asante', phone: '+233 54 555 0123', state: 'pending', note: 'Accepted · MoMo prompt sent 12 min ago' },
  { id: 'g3', name: 'Yaw Boateng', phone: '+233 27 555 0199', state: 'invited', note: 'Invited on WhatsApp · 2 days ago' },
  { id: 'g4', name: 'Akosua Darko', phone: '+233 55 555 0164', state: 'invited', note: 'Opened the link · yesterday' },
  { id: 'g5', name: 'Kwame Nkansah', phone: '+44 7700 900412', state: 'declined', note: 'Can’t make it' },
]

export const plusOneRequests = [{ id: 'p1', name: 'Abena Ofori', via: 'Efua Asante', phone: '+233 24 555 0110' }]

/** Host-side rows for any table booking. b1 uses the detailed fixture above; others derive from booking.guests. */
export function guestRowsFor(b: Booking): HostGuestRow[] {
  if (b.id === b1.id) return hostGuestRows
  const sp = splitFor(b)
  return b.guests.map((g) => ({
    id: g.id,
    name: g.name,
    phone: g.phone,
    state: g.status === 'host' ? 'host' : g.status === 'declined' ? 'declined' : g.status === 'invited' ? 'invited' : g.paidShare ? 'paid' : 'pending',
    paid: g.status === 'host' ? sp.quote.dueNow : g.paidShare ? sp.share : undefined,
  }))
}
