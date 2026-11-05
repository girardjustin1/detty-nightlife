// WhatsApp template plan (docs/integrations/whatsapp.md §3) as data, so the chat mocks and the
// catalogue render the same wording. Bodies use Meta's {{n}} placeholders; samples are filled
// from the canonical booking via tableQuote. Template names/wording are drafts until Meta approves them.
import type { Brand } from '@/brands/brands'
import { eventById, venueById } from '@/data/fixtures'
import { cedis, dayShort, time } from '@/lib/format'
import { RULES } from '@/lib/pricing'
import { arrivalCutoff, booking, event, guestList, host, links, maskPhone, paystack, quote, tableLabel, tier, venue } from '@/emails/sample'
import { whatsappLink } from '@/config/contact'
import type { WaButton } from './wa'

export type Category = 'authentication' | 'utility' | 'marketing' | 'service' | 'none'

export type Template = {
  name: string
  kind: 'template' | 'interactive' | 'share-link'
  category: Category
  language: string
  header?: string
  body: string
  footer?: string
  vars: { name: string; sample: string }[]
  buttons: WaButton[]
  trigger: string
  /** Phase from the integration roadmap. */
  phase: 'v1' | 'v2'
  notes?: string
}

/** Meta "Rest of Africa" rate card (Ghana, +233), USD per delivered message, effective 2026-10-01. */
export const RATES: Record<Category, number | null> = {
  authentication: 0.0046,
  utility: 0.0046,
  marketing: 0.0259,
  service: 0.0046,
  none: 0,
}
export const RATE_SOURCE =
  'Gallabox’s copy of Meta’s rate card, effective 2026-10-01. Unverified until checked against Meta’s official CSV (docs/integrations/whatsapp.md §2).'

export const fill = (t: Pick<Template, 'body' | 'vars'>) => t.body.replace(/\{\{(\d+)\}\}/g, (_, n) => t.vars[Number(n) - 1]?.sample ?? `{{${n}}}`)

export const OTP_CODE = '482913'
export const share = Math.round(quote.deposit / booking.partySize)
export const shareDeadline = '2026-12-17T18:00:00Z'

export function templates(brand: Brand): Template[] {
  const l = links(brand)
  const drop = eventById('nye-countdown')
  const promo = eventById('hiplife-throwback')
  const promoVenue = venueById(promo.venueId)
  const kojo = guestList.find((g) => g.id === 'g1')!
  return [
    {
      name: 'otp_login',
      kind: 'template',
      category: 'authentication',
      language: 'en_GB',
      body: '*{{1}}* is your verification code. For your security, do not share this code.',
      footer: 'This code expires in 10 minutes.',
      vars: [{ name: 'code', sample: OTP_CODE }],
      buttons: [{ type: 'copy', label: 'Copy code' }],
      trigger: 'User asks for a login code (SMS fallback after ~20 s or on failed status)',
      phase: 'v1',
      notes: 'Body text is fixed by Meta. One-tap/zero-tap need a native Android app, so a PWA gets copy-code.',
    },
    {
      name: 'booking_confirmed',
      kind: 'template',
      category: 'utility',
      language: 'en_GB',
      header: 'Booking confirmed',
      body: 'Hi {{1}}, your table is confirmed.\n\n*{{2}}*\n🗓 {{3}}\n🛋 {{4}}\n\nPaid today: {{5}}\nBalance at the venue: {{6}}\nArrive by *{{7}}*\n\nRef: {{8}}',
      footer: `${brand.name} · booking updates`,
      vars: [
        { name: 'first_name', sample: host.firstName },
        { name: 'venue_event', sample: `${venue.name} · ${event.title}` },
        { name: 'date_time', sample: `${dayShort(event.startsAt)} · ${time(event.startsAt)}` },
        { name: 'table', sample: `${tableLabel} · up to ${tier.capacity} guests` },
        { name: 'paid', sample: `${cedis(quote.dueNow)} (deposit ${cedis(quote.deposit)} + fee ${cedis(quote.fee)})` },
        { name: 'balance', sample: `${cedis(quote.balanceAtVenue)} + ${RULES.venueServicePct}% service` },
        { name: 'arrive_by', sample: time(arrivalCutoff) },
        { name: 'ref', sample: booking.ref },
      ],
      buttons: [
        { type: 'url', label: 'View booking' },
        { type: 'url', label: 'Get directions' },
      ],
      trigger: 'Paystack charge.success for a table deposit',
      phase: 'v1',
      notes: `URL buttons: ${l.booking}, ${l.directions}`,
    },
    {
      name: 'deposit_receipt',
      kind: 'template',
      category: 'utility',
      language: 'en_GB',
      header: '[document] Receipt PDF',
      body: 'Payment received: *{{1}}*\n\n{{2}}\nMethod: {{3}}\nPaystack ref: {{4}}\nDate: {{5}}\n\nYour {{6}} deposit comes off your bill on the night.',
      vars: [
        { name: 'amount', sample: cedis(quote.dueNow, { decimals: true }) },
        { name: 'what', sample: `${tableLabel} · ${venue.name} · ${dayShort(event.startsAt)}` },
        { name: 'method', sample: `MTN MoMo ${maskPhone(host.phone)}` },
        { name: 'paystack_ref', sample: paystack.depositRef },
        { name: 'date', sample: `${dayShort(booking.createdAt)}, ${time(booking.createdAt)}` },
        { name: 'deposit', sample: cedis(quote.deposit) },
      ],
      buttons: [{ type: 'url', label: 'View receipt' }],
      trigger: 'Paystack charge.success (can be merged into booking_confirmed: ~25% less utility spend)',
      phase: 'v1',
    },
    {
      name: 'booking_reminder',
      kind: 'template',
      category: 'utility',
      language: 'en_GB',
      body: 'Tonight: *{{1}}* at {{2}} 🎶\n\nDoors {{3}}. Arrive by *{{4}}* or the table may be released.\nDress code: {{5}}\n{{6}}+ with ID for everyone\nGuests confirmed: {{7}}\n\nLet us know how you’re doing 👇',
      vars: [
        { name: 'table', sample: tableLabel },
        { name: 'venue', sample: venue.name },
        { name: 'doors', sample: time(event.doorsAt) },
        { name: 'arrive_by', sample: time(arrivalCutoff) },
        { name: 'dress_code', sample: venue.dressCode.split('.')[0] },
        { name: 'min_age', sample: String(venue.minAge) },
        { name: 'guests', sample: `${booking.guests.filter((g) => g.status === 'accepted' || g.status === 'host').length} of ${tier.capacity}` },
      ],
      buttons: [
        { type: 'reply', label: 'I’m on my way' },
        { type: 'reply', label: 'Running late' },
        { type: 'reply', label: 'Cancel' },
      ],
      trigger: 'Scheduled: event day, 2pm (and/or T-24h)',
      phase: 'v1',
      notes: 'A quick-reply tap opens the 24h window; our replies inside it are service messages.',
    },
    {
      name: 'booking_changed',
      kind: 'template',
      category: 'utility',
      language: 'en_GB',
      body: 'Your booking {{1}} has changed.\n\n{{2}}: ~{{3}}~ → *{{4}}*\n\n{{5}}',
      vars: [
        { name: 'ref', sample: booking.ref },
        { name: 'field', sample: 'Table' },
        { name: 'old', sample: 'VIP booth B3' },
        { name: 'new', sample: 'VIP booth B4' },
        { name: 'note', sample: `Same night, same price. Your pass updates automatically. Not happy? Cancel for a full refund.` },
      ],
      buttons: [{ type: 'url', label: 'View booking' }],
      trigger: 'Venue or user changes time, table, guest count, pre-order or minimum',
      phase: 'v1',
    },
    {
      name: 'booking_cancelled',
      kind: 'template',
      category: 'utility',
      language: 'en_GB',
      body: 'Your booking {{1}} at {{2}} is cancelled.\n\nRefund: *{{3}}* ({{4}})\nTo: {{5}}\n{{6}}',
      vars: [
        { name: 'ref', sample: booking.ref },
        { name: 'venue_date', sample: `${venue.name}, ${dayShort(event.startsAt)}` },
        { name: 'refund', sample: cedis(quote.deposit) },
        { name: 'policy', sample: '100% of deposit, more than 48h notice' },
        { name: 'method', sample: `MTN MoMo ${maskPhone(host.phone)}` },
        { name: 'eta', sample: 'We’ll message you here when it lands.' },
      ],
      buttons: [{ type: 'url', label: 'View refund' }],
      trigger: 'User or venue cancels',
      phase: 'v1',
    },
    {
      name: 'refund_processed',
      kind: 'template',
      category: 'utility',
      language: 'en_GB',
      body: 'Your refund of *{{1}}* for {{2}} has been paid to {{3}}.\nPaystack ref: {{4}}',
      vars: [
        { name: 'amount', sample: cedis(quote.deposit) },
        { name: 'ref', sample: booking.ref },
        { name: 'method', sample: `MTN MoMo ${maskPhone(host.phone)}` },
        { name: 'paystack_ref', sample: paystack.refundRef },
      ],
      buttons: [],
      trigger: 'Paystack refund.processed',
      phase: 'v1',
    },
    {
      name: 'ticket_ready',
      kind: 'template',
      category: 'utility',
      language: 'en_GB',
      body: 'Your {{1}} for *{{2}}* {{3}} ready. Open them once with signal and they work offline at the gate.',
      vars: [
        { name: 'qty', sample: '3 tickets' },
        { name: 'event', sample: 'Tidal: Beach Rave' },
        { name: 'verb', sample: 'are' },
      ],
      buttons: [{ type: 'url', label: 'Open tickets' }],
      trigger: 'Ticket purchase succeeds',
      phase: 'v1',
    },
    {
      name: 'guest_joined',
      kind: 'template',
      category: 'utility',
      language: 'en_GB',
      body: '{{1}} is in for {{2}} 🙌 {{3}} confirmed.',
      vars: [
        { name: 'guest', sample: kojo.name.split(' ')[0] },
        { name: 'table', sample: tableLabel },
        { name: 'count', sample: `3 of ${tier.capacity}` },
      ],
      buttons: [{ type: 'url', label: 'See guest list' }],
      trigger: 'A guest accepts the invite (sent to the host)',
      phase: 'v1',
    },
    {
      name: '(wa.me share) guest invite',
      kind: 'share-link',
      category: 'none',
      language: 'Host’s own',
      body: `${host.firstName} added you to her table at ${venue.name} 🎉\n${dayShort(event.startsAt)} · ${time(event.startsAt)} · ${tableLabel}\nTap to confirm your spot (takes 10s): ${l.invite}`,
      vars: [{ name: 'per-guest token', sample: 'k9QpZ' }],
      buttons: [],
      trigger: 'Host taps "Invite on WhatsApp" (opens wa.me/?text=… on the host’s phone)',
      phase: 'v1',
      notes: 'Not a template. Sent from the host’s own WhatsApp, so no opt-in, approval or fee. We never learn if it was sent.',
    },
    {
      name: 'split_payment_request',
      kind: 'template',
      category: 'utility',
      language: 'en_GB',
      body: '{{1}} is splitting the deposit for *{{2}}* at {{3}}, {{4}}.\n\nYour share: *{{5}}*\nPay by {{6}} to keep your spot.',
      vars: [
        { name: 'host', sample: host.firstName },
        { name: 'table', sample: tableLabel },
        { name: 'venue', sample: venue.name },
        { name: 'date', sample: dayShort(event.startsAt) },
        { name: 'share', sample: cedis(share) },
        { name: 'deadline', sample: `${dayShort(shareDeadline)}, ${time(shareDeadline)}` },
      ],
      buttons: [{ type: 'url', label: 'Pay my share' }],
      trigger: 'Host starts a split deposit (v2); only to guests who ticked WhatsApp updates when they RSVP’d',
      phase: 'v2',
      notes: 'URL button opens a Paystack payment link (WhatsApp Pay isn’t available in Ghana).',
    },
    {
      name: 'rsvp_flow',
      kind: 'interactive',
      category: 'service',
      language: 'en_GB',
      body: `${host.firstName} invited you to ${tableLabel} at ${venue.name}, ${dayShort(event.startsAt)}. RSVP here in 10 seconds.`,
      vars: [{ name: 'invite token', sample: 'K9QPZ' }],
      buttons: [{ type: 'flow', label: 'RSVP' }],
      trigger: `Guest taps “RSVP on WhatsApp” (${whatsappLink('RSVP K9QPZ')}), which opens the 24h window`,
      phase: 'v2',
      notes: 'Flow (RSVP, party size, arrival time) with a data_exchange endpoint, then a CTA-URL message to a Paystack link. Service-priced inside the window.',
    },
    {
      name: 'event_drop',
      kind: 'template',
      category: 'marketing',
      language: 'en_GB',
      header: '[image] Event artwork',
      body: '🎆 *{{1}}* just dropped.\n\n{{2}} · {{3}}\n{{4}}\n\nTickets from {{5}} · tables from {{6}} minimum.',
      footer: 'Not interested? Tap Stop promotions.',
      vars: [
        { name: 'event', sample: drop.title },
        { name: 'venue', sample: venueById(drop.venueId).name },
        { name: 'date', sample: `${dayShort(drop.startsAt)}, ${time(drop.startsAt)}` },
        { name: 'headline', sample: drop.description },
        { name: 'tickets_from', sample: cedis(drop.ticketsFrom ?? 0) },
        { name: 'tables_from', sample: cedis(drop.tablesFrom ?? 0) },
      ],
      buttons: [
        { type: 'url', label: 'Get tickets' },
        { type: 'reply', label: 'Stop promotions' },
      ],
      trigger: 'Marketing campaign; only users who ticked "Event drops & offers"',
      phase: 'v2',
      notes: 'Per-user marketing caps apply (error 131049: retry after 24h, never resend in a loop).',
    },
    {
      name: 'promoter_broadcast',
      kind: 'template',
      category: 'marketing',
      language: 'en_GB',
      header: '📣 From {{1}}',
      body: '{{2}}\n\n*{{3}}* · {{4}}\nTickets from {{5}}\n\n— {{6}}',
      footer: 'Promotions from venues you’ve booked. Tap Stop promotions to opt out.',
      vars: [
        { name: 'venue', sample: promoVenue.name },
        { name: 'message', sample: `${promo.description} We kept a few booths for people who partied with us this month.` },
        { name: 'event', sample: promo.title },
        { name: 'date', sample: `${dayShort(promo.startsAt)}, ${time(promo.startsAt)}` },
        { name: 'tickets_from', sample: cedis(promo.ticketsFrom ?? 0) },
        { name: 'signed', sample: `${promo.lineup.find((a) => a.role === 'Host')?.name ?? 'The team'}, ${promoVenue.name}` },
      ],
      buttons: [
        { type: 'url', label: 'See the night' },
        { type: 'reply', label: 'Stop promotions' },
      ],
      trigger: 'Promoter sends a broadcast from the promoter app to past guests who opted in to offers',
      phase: 'v2',
      notes: 'Sent from our number on the venue’s behalf; counts against our portfolio messaging limit and quality rating.',
    },
  ]
}

export const templateByName = (brand: Brand, name: string) => templates(brand).find((t) => t.name === name)!
