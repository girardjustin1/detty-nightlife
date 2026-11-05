import { useState, type ReactNode } from 'react'
import { Check, ChevronDown, ChevronRight, ChevronUp, MessageCircle, Phone, Tag, X } from 'lucide-react'
import { PaymentMark } from '@/components/app/domain'
import { Avatar, Button, IconButton, Img } from '@/components/ui/primitives'
import { guests, me, venueById } from '@/data/fixtures'
import type { AccraEvent } from '@/data/types'
import { cedis, cx, dayShort, time } from '@/lib/format'
import { RULES, ticketQuote } from '@/lib/pricing'
import { TicketTiers } from './TicketTiers'
import { linesFor, sampleEvent, TICKET_RULES, type Selection } from './ticketRules'

export type PromoState = 'none' | 'entering' | 'applied' | 'invalid'

function Row({ label, children, action = 'Change', onClick }: { label: string; children: ReactNode; action?: string; onClick?: () => void }) {
  return (
    <div className="border-b border-line py-3.5 last:border-0">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-dim uppercase">{label}</span>
        {action && (
          <button onClick={onClick} className="text-sm font-semibold text-accent">
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

/**
 * Local sheet with a flex column, so the sticky footer (total + Pay) is never clipped when the
 * breakdown expands. The shared Sheet caps its body at 60vh, which can push the footer out of the frame.
 */
function CheckoutSheet({ title, children, footer }: { title: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative flex max-h-[90%] flex-col overflow-hidden rounded-t-[28px] border-t border-line bg-surface">
        <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line" />
        <div className="flex shrink-0 items-center justify-between px-5 pt-3 pb-1">
          <h3 className="display text-xl">{title}</h3>
          <IconButton label="Close">
            <X className="size-5" />
          </IconButton>
        </div>
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-2">{children}</div>
        <div className="shrink-0 border-t border-line px-5 pt-3 pb-8">{footer}</div>
      </div>
    </div>
  )
}

/** Breakdown rows; like PriceLines but allows a discount line. */
function Breakdown({ rows, total }: { rows: { label: string; value: number; tone?: 'muted' | 'success' }[]; total: number }) {
  return (
    <dl className="space-y-2 text-sm">
      {rows.map((r) => (
        <div key={r.label} className={cx('flex justify-between gap-4', r.tone === 'muted' && 'text-dim', r.tone === 'success' && 'text-success')}>
          <dt>{r.label}</dt>
          <dd className="tabular-nums">{r.value < 0 ? `−${cedis(-r.value)}` : cedis(r.value)}</dd>
        </div>
      ))}
      <div className="flex justify-between gap-4 border-t border-line pt-2 text-base font-semibold">
        <dt>Total</dt>
        <dd className="tabular-nums">{cedis(total)}</dd>
      </div>
    </dl>
  )
}

/** 05 Book Tickets — SeatGeek-style single checkout sheet with editable rows and an expandable price breakdown. */
export function Checkout({
  event = sampleEvent,
  selection = { ga: 2 },
  promo: initialPromo = 'none',
  breakdownOpen,
  holdersAssigned,
}: {
  event?: AccraEvent
  selection?: Selection
  promo?: PromoState
  breakdownOpen?: boolean
  holdersAssigned?: boolean
}) {
  const [open, setOpen] = useState(!!breakdownOpen)
  const [promo, setPromo] = useState<PromoState>(initialPromo)
  const venue = venueById(event.venueId)
  const pct = promo === 'applied' ? TICKET_RULES.promo.pct : 0
  const full = ticketQuote(linesFor(event, selection))
  const q = ticketQuote(linesFor(event, selection, pct))
  const discount = full.subtotal - q.subtotal
  const tickets = linesFor(event, selection).flatMap((l) => Array.from({ length: l.qty }, () => l.tier.name))
  const friends = guests.filter((g) => g.status !== 'host')

  const rows = [
    ...linesFor(event, selection).map((l) => ({ label: `${l.qty} × ${l.tier.name}`, value: l.tier.price * l.qty })),
    ...(discount > 0 ? [{ label: `Promo ${TICKET_RULES.promo.code} (${pct}% off)`, value: -discount, tone: 'success' as const }] : []),
    { label: `Booking fee (${RULES.ticketFeePct}%)`, value: q.fee, tone: 'muted' as const },
  ]

  return (
    <div className="relative h-full">
      <TicketTiers event={event} selection={selection} />
      <CheckoutSheet
        title="Checkout"
        footer={
          <div>
            {open && (
              <div className="mb-3">
                <Breakdown rows={rows} total={q.total} />
              </div>
            )}
            <div className="flex items-center gap-4">
              <button onClick={() => setOpen(!open)} className="min-w-0 flex-1 text-left">
                <div className="text-lg font-semibold tabular-nums">
                  {discount > 0 && <span className="mr-1.5 text-sm font-normal text-faint line-through">{cedis(full.total)}</span>}
                  {cedis(q.total)}
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                  {open ? 'Hide details' : 'View details'} {open ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
                </div>
              </button>
              <Button size="lg">Pay {cedis(q.total)}</Button>
            </div>
          </div>
        }
      >
        <div className="flex items-center gap-3 border-b border-line pb-3.5">
          <Img src={event.photo} alt={event.title} className="size-14 shrink-0" />
          <div className="min-w-0">
            <div className="truncate font-semibold">{event.title}</div>
            <div className="truncate text-sm text-dim">
              {dayShort(event.startsAt)} · {time(event.startsAt)} · {venue.name}
            </div>
          </div>
        </div>

        <Row label="Contact">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="size-4 text-dim" />
            <span className="font-medium">{me.phone}</span>
            <span className="text-faint">· from your profile</span>
          </div>
          <div className="mt-0.5 pl-6 text-xs text-faint">Tickets and receipt by SMS + WhatsApp · {me.email}</div>
        </Row>

        <Row label={`Ticket holders · ${tickets.length}`} action="">
          <ul className="space-y-2">
            {tickets.map((tier, i) => {
              const name = i === 0 ? `${me.name} (you)` : holdersAssigned ? friends[i - 1]?.name : undefined
              return (
                <li key={i} className="flex items-center gap-3">
                  {name ? <Avatar name={name} size={32} /> : <span className="flex size-8 items-center justify-center rounded-full border border-dashed border-line text-xs text-faint">{i + 1}</span>}
                  <span className="min-w-0 flex-1">
                    <span className={cx('block truncate text-sm', name ? 'font-medium' : 'text-faint')}>{name ?? 'Add a name'}</span>
                    <span className="block truncate text-xs text-dim">{tier}</span>
                  </span>
                  {i > 0 &&
                    (name ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                        <Check className="size-3.5" /> Sends after payment
                      </span>
                    ) : (
                      <Button size="sm" variant="whatsapp" icon={<MessageCircle className="size-4" />}>
                        Send
                      </Button>
                    ))}
                </li>
              )
            })}
          </ul>
          <p className="mt-2 text-xs text-faint">You can also assign or send tickets later from Bookings.</p>
        </Row>

        <Row label="Payment">
          <div className="flex items-center gap-3">
            <PaymentMark method="mtn-momo" size={32} />
            <div className="min-w-0 flex-1 text-sm">
              <div className="font-medium">MTN MoMo · 024 555 0142</div>
              <div className="text-xs text-dim">You’ll approve the prompt on your phone</div>
            </div>
            <ChevronRight className="size-4 text-faint" />
          </div>
        </Row>

        <Row label="Promo code" action={promo === 'applied' ? 'Remove' : ''} onClick={() => setPromo('none')}>
          {promo === 'applied' ? (
            <div className="flex items-center gap-2 rounded-control bg-success/15 px-3 py-2 text-sm text-success">
              <Tag className="size-4" />
              <b>{TICKET_RULES.promo.code}</b> applied · you save {cedis(discount + (full.fee - q.fee))}
            </div>
          ) : promo === 'none' ? (
            <button onClick={() => setPromo('entering')} className="inline-flex items-center gap-2 text-sm text-dim">
              <Tag className="size-4" /> Add a promo code
            </button>
          ) : (
            <div>
              <div className={cx('flex h-11 items-center gap-2 rounded-control border bg-surface-2 pr-1 pl-3', promo === 'invalid' ? 'border-danger' : 'border-line')}>
                <Tag className="size-4 text-dim" />
                <input defaultValue={promo === 'invalid' ? 'DETTY2025' : ''} placeholder="Enter code" className="h-full min-w-0 flex-1 bg-transparent text-sm uppercase outline-none placeholder:normal-case placeholder:text-faint" />
                <Button size="sm" onClick={() => setPromo('applied')}>
                  Apply
                </Button>
              </div>
              {promo === 'invalid' && <div className="mt-1.5 text-xs text-danger">That code has expired or isn’t valid for this event.</div>}
            </div>
          )}
        </Row>
      </CheckoutSheet>
    </div>
  )
}

