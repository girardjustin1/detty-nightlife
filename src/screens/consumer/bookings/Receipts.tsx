import { ArrowDownLeft, ArrowUpRight, ChevronDown, Download, Hourglass } from 'lucide-react'
import { AppBar, Screen } from '@/components/app/chrome'
import { PaymentMark, PriceLines } from '@/components/app/domain'
import { Button, Card } from '@/components/ui/primitives'
import { bottleById, bookings } from '@/data/fixtures'
import type { Booking } from '@/data/types'
import { RULES } from '@/lib/pricing'
import { cedis, cx, dayShort, time } from '@/lib/format'
import { bAwaiting, bCancelled, cancelledRefund, bGuestsPending, bNyeTickets, bRefunded, eventById, methodLine, quoteFor, receiptEntries, ticketQuoteFor, tierFor, type ReceiptEntry } from './bookingData'

const allBookings: Booking[] = [...bookings, bAwaiting, bGuestsPending, bNyeTickets, bCancelled, bRefunded]

function Breakdown({ entry }: { entry: ReceiptEntry }) {
  const b = allBookings.find((x) => x.id === entry.bookingId)!
  const ev = eventById(b.eventId)
  const head = (
    <div className="mb-3 text-xs text-dim">
      {ev.title} · {dayShort(ev.startsAt)} · Ref {b.ref}
    </div>
  )
  if (b.kind === 'tickets') {
    const q = ticketQuoteFor(b)
    const tier = ev.ticketTiers.find((t) => t.id === b.tickets?.[0]?.tierId)
    const refund = entry.kind !== 'payment'
    return (
      <>
        {head}
        <PriceLines
          lines={[
            { label: `${q.count} × ${tier?.name} (${cedis(tier?.price ?? 0)})`, value: q.subtotal },
            { label: `Ticket fee (${RULES.ticketFeePct}%)${refund ? ', non-refundable' : ''}`, value: q.fee, muted: true },
          ]}
          total={refund ? q.subtotal : q.total}
          totalLabel={refund ? 'Refunded to you' : 'Paid'}
        />
      </>
    )
  }
  const q = quoteFor(b)!
  const tier = tierFor(b)!
  if (entry.kind !== 'payment') {
    return (
      <>
        {head}
        <PriceLines
          lines={[
            { label: `Deposit paid (${tier.depositPct}%)`, value: q.deposit },
            { label: `Kept by the venue (${cancelledRefund.band.label.toLowerCase()})`, value: q.deposit - entry.amount, muted: true },
            { label: 'Booking fee, non-refundable', value: q.fee, muted: true },
          ]}
          total={entry.amount}
          totalLabel={entry.kind === 'pending' ? 'Refund on its way' : 'Refunded'}
        />
      </>
    )
  }
  const paidInFull = b.status === 'completed'
  return (
    <>
      {head}
      <ul className="mb-3 space-y-1.5 text-sm">
        {b.bottles.map((l) => (
          <li key={l.bottleId} className="flex justify-between gap-3 text-dim">
            <span className="truncate">
              {l.qty} × {bottleById(l.bottleId).name}
            </span>
            <span className="tabular-nums">{cedis(bottleById(l.bottleId).price * l.qty)}</span>
          </li>
        ))}
      </ul>
      <PriceLines
        lines={
          paidInFull
            ? [
                { label: 'Bottles (paid in full)', value: q.commitment },
                { label: `Booking fee (${RULES.tableFeePct}%)`, value: q.fee, muted: true },
              ]
            : [
                { label: `Table commitment (min ${cedis(q.minimum)})`, value: q.commitment },
                { label: `Deposit (${tier.depositPct}%)`, value: q.deposit },
                { label: `Booking fee (${RULES.tableFeePct}%)`, value: q.fee, muted: true },
              ]
        }
        total={entry.amount}
        totalLabel="Paid"
      />
      {!paidInFull && <div className="mt-2 text-xs text-faint">Balance of {cedis(q.balanceAtVenue)} is settled at the venue, plus a {RULES.venueServicePct}% service charge.</div>}
    </>
  )
}

export function Receipts({ openId = 'r1' }: { openId?: string }) {
  const sorted = [...receiptEntries].sort((a, b) => b.at.localeCompare(a.at))
  const paid = sorted.filter((e) => e.kind === 'payment').reduce((s, e) => s + e.amount, 0)
  const back = sorted.filter((e) => e.kind === 'refund').reduce((s, e) => s + e.amount, 0)
  const pending = sorted.filter((e) => e.kind === 'pending').reduce((s, e) => s + e.amount, 0)

  return (
    <Screen header={<AppBar title="Payments & refunds" subtitle="December 2026" />}>
      <div className="px-5 pt-2 pb-8">
        <div className="grid grid-cols-2 gap-2">
          <Card className="p-3.5">
            <div className="text-xs text-dim">Paid</div>
            <div className="display text-2xl tabular-nums">{cedis(paid)}</div>
          </Card>
          <Card className="p-3.5">
            <div className="text-xs text-dim">Refunded</div>
            <div className="display text-2xl text-success tabular-nums">{cedis(back)}</div>
            {pending > 0 && <div className="text-xs text-warning">+{cedis(pending)} on its way</div>}
          </Card>
        </div>

        <ol className="relative mt-5">
          <span className="absolute top-3 bottom-3 left-[17px] w-0.5 bg-line" />
          {sorted.map((e) => {
            const open = e.id === openId
            const icon = e.kind === 'payment' ? <ArrowUpRight className="size-4" /> : e.kind === 'refund' ? <ArrowDownLeft className="size-4" /> : <Hourglass className="size-4" />
            return (
              <li key={e.id} className="relative flex gap-3 pb-3">
                <span
                  className={cx(
                    'relative z-10 mt-3 flex size-9 shrink-0 items-center justify-center rounded-full ring-4 ring-bg',
                    e.kind === 'payment' ? 'bg-surface-2 text-text' : e.kind === 'refund' ? 'bg-success text-bg' : 'bg-warning text-bg',
                  )}
                >
                  {icon}
                </span>
                <Card className={cx('min-w-0 flex-1 p-3.5', open && 'border-accent')}>
                  <button className="flex w-full items-start gap-3 text-left">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{eventById(allBookings.find((x) => x.id === e.bookingId)!.eventId).title}</span>
                      <span className="block text-xs text-dim">{e.title}</span>
                      <span className="mt-1 flex items-center gap-1.5 text-xs text-faint">
                        <PaymentMark method={e.method} size={16} />
                        {dayShort(e.at)}, {time(e.at)} · {e.kind === 'pending' ? 'Pending · 1–3 days' : methodLine[e.method].split(' · ')[0]}
                      </span>
                    </span>
                    <span className={cx('shrink-0 font-semibold tabular-nums', e.kind !== 'payment' && 'text-success')}>
                      {e.kind === 'payment' ? '−' : '+'}
                      {cedis(e.amount)}
                    </span>
                    <ChevronDown className={cx('size-4 shrink-0 text-faint transition', open && 'rotate-180')} />
                  </button>
                  {open && (
                    <div className="mt-3 border-t border-line pt-3">
                      <Breakdown entry={e} />
                      <Button variant="secondary" size="sm" block className="mt-3" icon={<Download className="size-4" />}>
                        Download receipt (PDF, 40 KB)
                      </Button>
                    </div>
                  )}
                </Card>
              </li>
            )
          })}
        </ol>
      </div>
    </Screen>
  )
}
