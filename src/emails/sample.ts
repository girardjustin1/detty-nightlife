// Shared sample data for email and WhatsApp drafts. Everything here is derived
// from the app fixtures and src/lib/pricing.ts, so the comms show exactly the same
// amounts as the booking screens. SAMPLE DATA ONLY: people, venues and refs are
// fictional; the support number and Paystack refs are placeholders.
import type { Brand } from '@/brands/brands'
import { bookings, bottleById, eventById, guests, me, tableTiers, venueById } from '@/data/fixtures'
import { BOOKING_WHATSAPP, whatsappLink } from '@/config/contact'
import { canonicalTable, RULES, tableQuote, ticketQuote, type Line } from '@/lib/pricing'

const bookingByRef = (ref: string) => bookings.find((b) => b.ref === ref)!

export const booking = bookingByRef('ACC-7Q4K')
export const event = eventById(canonicalTable.eventId)
export const venue = venueById(canonicalTable.venueId)
export const tier = tableTiers[canonicalTable.venueId].find((t) => t.id === canonicalTable.tierId)!
export const quote = tableQuote(tier, canonicalTable.lines)
export const host = me
export const guestList = guests
export const tableLabel = `${tier.name} ${canonicalTable.tableId}`

export const itemise = (lines: Line[]) =>
  lines.map((l) => {
    const b = bottleById(l.bottleId)
    return { id: l.bottleId, name: b.name, size: b.size, qty: l.qty, unit: b.price, total: b.price * l.qty }
  })

export const preOrderItems = itemise(canonicalTable.lines)

/** Ticket booking used for "tickets delivered" (fixture b2). */
export const ticketBooking = bookingByRef('ACC-2M8P')
export const ticketEvent = eventById(ticketBooking.eventId)
export const ticketVenue = venueById(ticketBooking.venueId)
export const ticketTier = ticketEvent.ticketTiers.find((t) => t.id === ticketBooking.tickets![0].tierId)!
export const ticketTotals = ticketQuote([{ tier: ticketTier, qty: ticketBooking.tickets![0].qty }])

/** Refund of the deposit under RULES.refund, by hours of notice. The booking fee is non-refundable. */
export function refundFor(hoursBefore: number, deposit = quote.deposit) {
  const rule = RULES.refund.find((r) => hoursBefore > r.hoursBefore) ?? RULES.refund[RULES.refund.length - 1]
  return { rule, amount: Math.round((deposit * rule.pct) / 100) }
}

/** Arrival cut-off: the table is held this long after doors. */
export const arrivalCutoff = new Date(new Date(event.doorsAt).getTime() + RULES.holdMinutesAfterDoors * 60_000).toISOString()

/** '+233 24 555 0142' → '024 ••• 0142' (local format, middle masked). */
export function maskPhone(e164: string) {
  const digits = e164.replace(/\D/g, '')
  const local = digits.startsWith('233') ? '0' + digits.slice(3) : digits
  return `${local.slice(0, 3)} ••• ${local.slice(-4)}`
}

/** Placeholder domain per brand direction (the integration docs use detty.app). */
export const domainFor = (brand: Brand) => brand.domain

export const shortRef = booking.ref.replace('ACC-', '')

export const links = (brand: Brand) => {
  const d = domainFor(brand)
  return {
    domain: d,
    booking: `https://${d}/b/${shortRef}`,
    pass: `https://${d}/b/${shortRef}/pass`,
    ics: `https://${d}/b/${shortRef}.ics`,
    receipt: `https://${d}/r/${shortRef}`,
    directions: `https://${d}/v/${venue.id}/map`,
    invite: `https://${d}/i/k9QpZ`,
    review: `https://${d}/review/${shortRef}`,
    tickets: `https://${d}/t/${ticketBooking.ref.replace('ACC-', '')}`,
    help: `https://${d}/help`,
    prefs: `https://${d}/me/notifications`,
    unsubscribe: `https://news.${d}/u/one-click`,
  }
}

/** Support: the one booking WhatsApp number lives in src/config/contact.ts (never hard-code it). */
export const support = {
  whatsapp: BOOKING_WHATSAPP.display,
  waLink: (text?: string) => whatsappLink(text),
  email: (brand: Brand) => `support@${domainFor(brand)}`,
}

/** Placeholder Paystack references (fictional format). */
export const paystack = {
  depositRef: 'T658204913377',
  refundRef: 'RF-904417-7Q4K',
  splitLink: 'https://paystack.shop/pay/acc-7q4k-efua',
  checkoutLink: 'https://checkout.paystack.com/dty7q4kre',
}

export const addressPlaceholder = '[Legal entity name] · [Registered address], Accra, Ghana · [Business reg. no.]'

/** Per-brand copy helper: pick a line in the brand's voice. */
/** Per-brand copy. Three voices are written out; each direction names the one it uses, or supplies its own line. */
export const voice = <T>(brand: Brand, v: Record<Brand['voiceFamily'], T> & Partial<Record<Brand['id'], T>>) => v[brand.id] ?? v[brand.voiceFamily]
