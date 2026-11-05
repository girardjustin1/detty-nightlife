import { useBrand } from '@/brands/BrandContext'
import { paymentLabels } from '@/components/app/domain'
import { cedis, dayLong, dayShort, time } from '@/lib/format'
import { RULES } from '@/lib/pricing'
import type { PaymentMethod } from '@/data/types'
import { Button, EmailLayout, H1, Lines, P, Panel, Row, SectionTitle, Spacer, Table, useEmailTheme } from './kit'
import { booking, event, host, links, maskPhone, paystack, quote, refundFor, tableLabel, venue } from './sample'

export type CancelScenario = 'early' | 'mid' | 'late' | 'venue'

/** When each scenario's cancellation happened (Accra = UTC). */
export const cancelledAt: Record<CancelScenario, string> = {
  early: '2026-12-16T12:00:00Z',
  mid: '2026-12-18T10:00:00Z',
  late: '2026-12-18T18:00:00Z',
  venue: '2026-12-17T16:00:00Z',
}

export function cancellationQuote(scenario: CancelScenario) {
  const hours = (new Date(event.startsAt).getTime() - new Date(cancelledAt[scenario]).getTime()) / 3_600_000
  if (scenario === 'venue') return { hours, pct: 100, deposit: quote.deposit, fee: quote.fee, total: quote.dueNow, label: 'Venue cancelled' }
  const r = refundFor(hours)
  return { hours, pct: r.rule.pct, deposit: r.amount, fee: 0, total: r.amount, label: r.rule.label }
}

export function Cancellation({ scenario = 'early', stage = 'cancelled', method = booking.paymentMethod }: { scenario?: CancelScenario; stage?: 'cancelled' | 'refunded'; method?: PaymentMethod }) {
  const brand = useBrand()
  const t = useEmailTheme()
  const l = links(brand)
  const q = cancellationQuote(scenario)
  const at = cancelledAt[scenario]
  const byVenue = scenario === 'venue'
  const to = method === 'card' ? 'Visa •••• 4417' : `${paymentLabels[method].short} ${maskPhone(host.phone)}`
  const eta = method === 'card' ? 'Card refunds can take up to 10 business days to show on your statement.' : `Mobile money refunds go back to ${maskPhone(host.phone)}. We’ll message you on WhatsApp when it lands.`
  const steps = [
    { label: byVenue ? `${venue.name} cancelled` : 'You cancelled', when: `${dayShort(at)}, ${time(at)}`, done: true },
    { label: 'Refund sent to Paystack', when: `${dayShort(at)}`, done: q.total > 0 },
    { label: `Back with you: ${to}`, when: stage === 'refunded' ? `${dayShort('2026-12-19T09:00:00Z')}, ${time('2026-12-19T09:00:00Z')}` : method === 'card' ? 'Within 10 business days' : 'We’ll let you know', done: stage === 'refunded' },
  ]
  const subject =
    stage === 'refunded'
      ? `Refund complete: ${cedis(q.total)} is back with you`
      : byVenue
        ? `${venue.name} cancelled your table for ${dayLong(event.startsAt)}. Full refund on its way`
        : `Cancelled: ${tableLabel} at ${venue.name}. ${q.total > 0 ? `${cedis(q.total)} refund` : 'No refund due'}`
  return (
    <EmailLayout
      refCode={booking.ref}
      meta={{ subject, preheader: q.total > 0 ? `${cedis(q.total)} to ${to}. Paystack ref ${paystack.refundRef}.` : `Cancelled less than ${RULES.refund[1].hoursBefore} hours before, so the deposit isn’t refundable.` }}
    >
      <Row>
        <H1>{stage === 'refunded' ? 'Your refund is complete' : byVenue ? 'The venue cancelled your table' : 'Booking cancelled'}</H1>
        <P dim>
          {stage === 'refunded'
            ? `${cedis(q.total)} for ${tableLabel} at ${venue.name} has been paid back to ${to}.`
            : byVenue
              ? `Sorry, ${host.firstName}. ${venue.name} has cancelled ${event.title} on ${dayLong(event.startsAt)}. You get everything back, including the booking fee.`
              : `${tableLabel} at ${venue.name}, ${dayLong(event.startsAt)}, is cancelled. Your guests have been told and their passes no longer work.`}
        </P>
      </Row>
      <Spacer h={8} />
      <Row>
        <Panel tone={q.total > 0 ? 'success' : 'danger'}>
          <div style={{ fontSize: 13, color: t.faint }}>Refund</div>
          <div style={{ fontSize: 32, lineHeight: '38px', fontWeight: 800, color: t.text }}>{cedis(q.total)}</div>
          <div style={{ fontSize: 14, lineHeight: '21px', color: t.dim, marginTop: 4 }}>
            {byVenue ? 'Full refund: deposit and booking fee' : `${q.pct}% of your ${cedis(quote.deposit)} deposit · ${q.label.toLowerCase()} (${Math.round(q.hours)}h notice)`}
          </div>
        </Panel>
      </Row>
      <Spacer h={20} />
      <Row>
        <SectionTitle>Breakdown</SectionTitle>
        <Lines
          rows={[
            { label: 'Deposit paid', value: cedis(quote.deposit) },
            { label: `Deposit refunded (${q.pct}%)`, value: cedis(q.deposit), tone: q.deposit > 0 ? 'success' : 'dim' },
            { label: 'Booking fee', value: byVenue ? cedis(q.fee) : 'Not refundable', tone: byVenue ? 'success' : 'dim', sub: byVenue ? 'Refunded because the venue cancelled' : undefined },
            { label: 'Total refund', value: cedis(q.total), strong: true, rule: true },
          ]}
        />
      </Row>
      {q.total > 0 && (
        <>
          <Spacer h={20} />
          <Row>
            <SectionTitle>Timeline</SectionTitle>
            <Table>
              {steps.map((s, i) => (
                <tr key={i}>
                  <td width={28} style={{ width: 28, verticalAlign: 'top', paddingTop: 2 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 8, background: s.done ? t.success : 'transparent', border: `2px solid ${s.done ? t.success : t.line}`, boxSizing: 'border-box' }} />
                  </td>
                  <td style={{ paddingBottom: 14, fontSize: 14, lineHeight: '20px', color: s.done ? t.text : t.dim }}>
                    {s.label}
                    <div style={{ fontSize: 12, color: t.faint }}>{s.when}</div>
                  </td>
                </tr>
              ))}
            </Table>
            <P dim small>
              {eta} Paystack reference <span style={{ fontFamily: t.mono }}>{paystack.refundRef}</span>.
            </P>
          </Row>
        </>
      )}
      <Spacer h={12} />
      <Row>
        <Button href={`https://${l.domain}`}>{byVenue ? 'Find another table tonight' : 'Browse other nights'}</Button>
        {!byVenue && (
          <P dim small>
            Policy: {RULES.refund.map((r) => `${r.label.toLowerCase()}: ${r.pct}%`).join(' · ')}. The booking fee isn’t refundable unless the venue cancels.
          </P>
        )}
      </Row>
    </EmailLayout>
  )
}
