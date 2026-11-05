import { useBrand } from '@/brands/BrandContext'
import { paymentLabels } from '@/components/app/domain'
import { cedis, dayLong, time } from '@/lib/format'
import { RULES } from '@/lib/pricing'
import type { PaymentMethod } from '@/data/types'
import { Button, EmailLayout, H1, Lines, P, Panel, Row, SectionTitle, Spacer, useEmailTheme } from './kit'
import { addressPlaceholder, booking, event, host, links, maskPhone, paystack, preOrderItems, quote, tableLabel, tier, venue } from './sample'

export function DepositReceipt({ method = booking.paymentMethod }: { method?: PaymentMethod }) {
  const brand = useBrand()
  const t = useEmailTheme()
  const l = links(brand)
  const charged = new Date(booking.createdAt)
  const methodLine = method === 'card' ? 'Visa •••• 4417' : `${paymentLabels[method].name} · ${maskPhone(host.phone)}`
  return (
    <EmailLayout
      refCode={booking.ref}
      meta={{
        subject: `Receipt: ${cedis(quote.dueNow)} paid for ${venue.name}, ${dayLong(event.startsAt)}`,
        preheader: `Paystack ref ${paystack.depositRef}. ${cedis(quote.deposit)} counts toward your ${cedis(quote.commitment)} spend on the night.`,
      }}
    >
      <Row>
        <H1>Receipt</H1>
        <P dim>
          Payment received for {tableLabel} at {venue.name}, {event.title}, {dayLong(event.startsAt)}.
        </P>
      </Row>
      <Spacer h={8} />
      <Row>
        <Panel>
          <div style={{ fontSize: 13, color: t.faint, marginBottom: 2 }}>Amount paid</div>
          <div style={{ fontSize: 34, lineHeight: '40px', fontWeight: 800, color: t.text }}>{cedis(quote.dueNow, { decimals: true })}</div>
          <div style={{ fontSize: 13, color: t.dim, marginTop: 4 }}>
            {charged.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}, {time(booking.createdAt)} GMT · {methodLine}
          </div>
        </Panel>
      </Row>
      <Spacer h={24} />
      <Row>
        <SectionTitle>Pre-order</SectionTitle>
        <Lines rows={preOrderItems.map((it) => ({ label: `${it.qty} × ${it.name}`, sub: it.size, value: cedis(it.total) }))} />
        <Lines
          rows={[
            { label: 'Pre-order total', value: cedis(quote.preOrder), rule: true },
            { label: `Table minimum (${tier.name})`, value: cedis(quote.minimum), tone: 'dim' },
            { label: 'Your commitment', value: cedis(quote.commitment), sub: 'The higher of your pre-order and the minimum' },
          ]}
        />
      </Row>
      <Spacer h={20} />
      <Row>
        <SectionTitle>Charged today</SectionTitle>
        <Lines
          rows={[
            { label: `Deposit (${tier.depositPct}% of commitment)`, value: cedis(quote.deposit, { decimals: true }) },
            { label: `Booking fee (${RULES.tableFeePct}%, non-refundable)`, value: cedis(quote.fee, { decimals: true }) },
            { label: 'Total', value: cedis(quote.dueNow, { decimals: true }), strong: true, rule: true },
          ]}
        />
      </Row>
      <Spacer h={20} />
      <Row>
        <Panel tone="accent">
          <P small style={{ margin: 0 }}>
            <strong>How your deposit is used.</strong> The {cedis(quote.deposit)} deposit comes off your bill on the night. You’ll pay the remaining {cedis(quote.balanceAtVenue)} at the venue, plus{' '}
            {RULES.venueServicePct}% service.
          </P>
        </Panel>
      </Row>
      <Spacer h={20} />
      <Row>
        <SectionTitle>Payment details</SectionTitle>
        <Lines
          rows={[
            { label: 'Method', value: method === 'card' ? 'Card' : paymentLabels[method].short },
            { label: method === 'card' ? 'Card' : 'Wallet', value: method === 'card' ? '•••• 4417' : maskPhone(host.phone) },
            { label: 'Paystack reference', value: <span style={{ fontFamily: t.mono }}>{paystack.depositRef}</span> },
            { label: 'Booking reference', value: <span style={{ fontFamily: t.mono }}>{booking.ref}</span> },
            { label: 'Paid by', value: host.name },
          ]}
        />
      </Row>
      <Spacer h={20} />
      <Row>
        <Button href={l.receipt}>Download PDF receipt</Button>
        <Button href={l.booking} variant="secondary">
          View booking
        </Button>
        <P dim small>
          Issued by {brand.name} on behalf of {venue.name}. {addressPlaceholder}. Payments processed by Paystack.
        </P>
      </Row>
    </EmailLayout>
  )
}
