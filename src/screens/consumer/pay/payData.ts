// Pay-step data and math, shared by tickets and tables. Every amount comes from
// src/lib/pricing.ts (ticketQuote / tableQuote); nothing here hard-codes a total.
import { useEffect, useState } from 'react'
import { eventById, guests, me, NOW, tableTiers, venueById } from '@/data/fixtures'
import type { PaymentMethod, TableTier } from '@/data/types'
import { canonicalTable, RULES, tableQuote, ticketQuote, type Line } from '@/lib/pricing'
import { cedis, dayShort, time } from '@/lib/format'

/* ───────────── Sample rules local to the pay step (candidates for RULES) ───────────── */

export const PAY_RULES = {
  /** MoMo prompt times out after ~2–3 min (docs/integrations/payments.md §2). */
  momoTimeoutSeconds: 180,
  /** Resend is offered after this many seconds. */
  momoResendAfterSeconds: 30,
  /** SAMPLE: how long we wait on a 3-D Secure check before offering to retry. */
  threeDSTimeoutSeconds: 300,
  /** Lightning quote expiry (docs/integrations/bitcoin-and-bitchat.md: "for example 10 minutes"). */
  lightningLockSeconds: RULES.checkoutHoldMinutes * 60,
  /** SAMPLE exchange rate for drafts only. The real build quotes sats live at invoice time. */
  sampleSatsPerCedi: 72,
} as const

/* ───────────── What is being paid for ───────────── */

export type PayKind = 'tickets' | 'table' | 'split'

export type PaySummary = {
  kind: PayKind
  title: string
  subtitle: string
  /** Charged now. */
  dueNow: number
  /** Itemised lines for PriceLines (sum = dueNow). */
  lines: { label: string; value: number; muted?: boolean }[]
  /** Tables only: settled at the venue on the night. */
  balanceAtVenue?: number
  serviceAtVenue?: number
  /** Split only. */
  split?: { partySize: number; guestShare: number; guestsOwe: number; payers: number }
  ref: string
}

export const ticketEvent = eventById('afrobeats-til-dawn')
export const canonicalTier = tableTiers[canonicalTable.venueId].find((t) => t.id === canonicalTable.tierId)!
export const canonicalEvent = eventById(canonicalTable.eventId)
export const canonicalVenue = venueById(canonicalTable.venueId)

/** Default ticket order used across pay stories: 2 × General admission. */
export const defaultTicketSelection: Record<string, number> = { ga: 2 }

export function ticketLines(eventId: string, selection: Record<string, number>) {
  const ev = eventById(eventId)
  return ev.ticketTiers.filter((t) => (selection[t.id] ?? 0) > 0).map((tier) => ({ tier, qty: selection[tier.id] }))
}

export function ticketPay(eventId = ticketEvent.id, selection = defaultTicketSelection, discountPct = 0): PaySummary {
  const ev = eventById(eventId)
  const lines = ticketLines(eventId, selection).map((l) => ({ ...l, tier: { ...l.tier, price: Math.round(l.tier.price * (1 - discountPct / 100)) } }))
  const q = ticketQuote(lines)
  return {
    kind: 'tickets',
    title: ev.title,
    subtitle: `${q.count} ticket${q.count === 1 ? '' : 's'} · ${dayShort(ev.startsAt)}`,
    dueNow: q.total,
    lines: [
      ...lines.map((l) => ({ label: `${l.qty} × ${l.tier.name}`, value: l.tier.price * l.qty })),
      { label: `Booking fee (${RULES.ticketFeePct}%)`, value: q.fee, muted: true },
    ],
    ref: 'DTY-2M8P',
  }
}

export function tablePay(tier: TableTier = canonicalTier, lines: Line[] = canonicalTable.lines, tableId: string = canonicalTable.tableId): PaySummary {
  const q = tableQuote(tier, lines)
  return {
    kind: 'table',
    title: `${tier.name} ${tableId} · ${canonicalVenue.name}`,
    subtitle: `${canonicalEvent.title} · ${dayShort(canonicalEvent.startsAt)}`,
    dueNow: q.dueNow,
    lines: [
      { label: `Deposit (${tier.depositPct}% of ${cedis(q.commitment)})`, value: q.deposit },
      { label: `Booking fee (${RULES.tableFeePct}%, non-refundable)`, value: q.fee, muted: true },
    ],
    balanceAtVenue: q.balanceAtVenue,
    serviceAtVenue: q.serviceAtVenue,
    ref: 'DTY-7Q4K',
  }
}

/** Host chose "split the deposit": every guest pays an equal share by link; the host also pays the fee and any rounding. */
export function splitPay(partySize = canonicalTier.capacity): PaySummary {
  const q = tableQuote(canonicalTier, canonicalTable.lines)
  const guestShare = Math.floor(q.deposit / partySize)
  const payers = partySize - 1
  const guestsOwe = guestShare * payers
  const hostShare = q.deposit - guestsOwe
  const base = tablePay()
  return {
    ...base,
    kind: 'split',
    dueNow: hostShare + q.fee,
    lines: [
      { label: 'Your share of the deposit', value: hostShare },
      { label: `Booking fee (${RULES.tableFeePct}%, non-refundable)`, value: q.fee, muted: true },
    ],
    split: { partySize, guestShare, guestsOwe, payers },
  }
}

/* ───────────── Saved methods (SAMPLE, the signed-in user's wallet) ───────────── */

export type SavedMethod = { id: string; method: PaymentMethod; label: string; detail: string; phone?: string }

export const savedMethods: SavedMethod[] = [
  { id: 'momo-1', method: 'mtn-momo', label: 'MTN MoMo', detail: localPhone(me.phone), phone: me.phone },
  { id: 'momo-2', method: 'telecel-cash', label: 'Telecel Cash', detail: '050 555 0110 · Work', phone: '+233 50 555 0110' },
  { id: 'card-1', method: 'card', label: 'Visa', detail: 'ending 4821 · exp 08/28' },
]

/** "+233 24 555 0142" → "024 555 0142". */
export function localPhone(intl: string) {
  return intl.replace(/^\+233\s?/, '0')
}

/** Network from the number prefix. People port numbers, so this is only a default the user can change. */
export function detectNetwork(phone: string): PaymentMethod | undefined {
  const p = localPhone(phone).replace(/\s/g, '').slice(0, 3)
  if (['024', '025', '053', '054', '055', '059'].includes(p)) return 'mtn-momo'
  if (['020', '050'].includes(p)) return 'telecel-cash'
  if (['026', '027', '056', '057'].includes(p)) return 'at-money'
  return undefined
}

/** Where to find a missed approval prompt. DRAFT copy — confirm each USSD path with the network before launch. */
export const momoHelp: Record<string, { dial: string; path: string }> = {
  'mtn-momo': { dial: '*170#', path: 'My Wallet → My Approvals' },
  'telecel-cash': { dial: '*110#', path: 'Approvals (pending payments)' },
  'at-money': { dial: '*110#', path: 'Approvals (pending payments)' },
}

export type PayError = 'declined' | 'insufficient' | 'timeout' | 'wrong-pin' | 'card-declined'

export const payErrors: Record<PayError, { title: string; body: string }> = {
  declined: { title: 'Payment declined', body: 'The approval was cancelled on your phone. Nothing was charged.' },
  insufficient: { title: 'Not enough in this wallet', body: 'Top up your MoMo wallet or pick another number. Nothing was charged.' },
  timeout: { title: 'The prompt timed out', body: 'We didn’t get an approval in 3 minutes. Nothing was charged — send it again.' },
  'wrong-pin': { title: 'Wrong MoMo PIN', body: 'The PIN didn’t match. Too many tries can lock your wallet, so check it first.' },
  'card-declined': { title: 'Card declined by your bank', body: 'Try another card, or pay with Mobile Money.' },
}

/* ───────────── Policy, with concrete times and cedi amounts ───────────── */

export function depositPolicy(eventStartsAt: string, deposit: number, fee: number, doorsAt: string) {
  const start = new Date(eventStartsAt).getTime()
  const now = new Date(NOW).getTime()
  const at = (h: number) => new Date(start - h * 3600_000).toISOString()
  const windows = RULES.refund.filter((r) => r.pct === 0 || start - r.hoursBefore * 3600_000 > now)
  const arriveBy = new Date(new Date(doorsAt).getTime() + RULES.holdMinutesAfterDoors * 60_000).toISOString()
  return [
    ...windows.map((r) =>
      r.pct === 0
        ? { title: r.label, body: 'No refund. The deposit stays with the venue.' }
        : {
            title: `Cancel by ${dayShort(at(r.hoursBefore))}, ${time(at(r.hoursBefore))}`,
            body: `${r.pct}% of the deposit back: ${cedis(Math.round((deposit * r.pct) / 100))}, to the way you paid.`,
          },
    ),
    { title: `Arrive by ${time(arriveBy)}`, body: `The table is released ${RULES.holdMinutesAfterDoors / 60} hours after doors open.` },
    { title: 'Booking fee', body: `The ${cedis(fee)} booking fee is non-refundable.` },
  ]
}

/** Large-party example: Lounge deck L1 for 12, which needs venue approval. */
export const loungeTier = tableTiers[canonicalTable.venueId].find((t) => t.id === 'lounge')!

export const otherGuests = guests.filter((g) => g.status !== 'host')

/* ───────────── Live countdown (waiting states must feel alive) ───────────── */

export function useCountdown(from: number, running = true) {
  const [left, setLeft] = useState(from)
  useEffect(() => setLeft(from), [from])
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [running])
  return left
}

export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export const toSats = (cedis: number) => Math.round(cedis * PAY_RULES.sampleSatsPerCedi)

/** Fake BOLT11-looking string, deterministic per amount. Not a real invoice. */
export function fakeInvoice(sats: number) {
  let h = Math.imul(sats, 2654435761) >>> 0
  const chars = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'
  let s = ''
  for (let i = 0; i < 180; i++) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0
    s += chars[h >>> 27]
  }
  return `lnbc${Math.round(sats / 100)}u1p${s}`
}
