import { useBrand } from '@/brands/BrandContext'
import { cedis, dayLong } from '@/lib/format'
import { canonicalTable, RULES, tableQuote, type Line } from '@/lib/pricing'
import { Button, EmailLayout, H1, Lines, P, Panel, Row, SectionTitle, Spacer, useEmailTheme } from './kit'
import { booking, event, host, itemise, links, tableLabel, tier, venue } from './sample'

/** Ordered on the night, on top of the pre-order (sample). */
const extrasMet: Line[] = [
  { bottleId: 'redbull', qty: 1 },
  { bottleId: 'shisha', qty: 1 },
  { bottleId: 'kelewele', qty: 1 },
]
/** Under-minimum night: the short pre-order plus one bottle at the table. */
const extrasShort: Line[] = [{ bottleId: 'hennessy-vs', qty: 1 }]

export function balanceTab(variant: 'met' | 'short') {
  const pre = variant === 'met' ? canonicalTable.lines : canonicalTable.shortLines
  const extras = variant === 'met' ? extrasMet : extrasShort
  const booked = tableQuote(tier, pre)
  const night = tableQuote(tier, [...pre, ...extras])
  const spend = night.preOrder
  const unspent = Math.max(0, tier.minSpend - spend)
  const billed = spend + unspent
  const service = Math.round((billed * RULES.venueServicePct) / 100)
  return { pre: itemise(pre), extras: itemise(extras), booked, spend, unspent, billed, service, deposit: booked.deposit, paidAtVenue: billed + service - booked.deposit }
}

export function BalanceReceipt({ variant = 'met' }: { variant?: 'met' | 'short' }) {
  const brand = useBrand()
  const t = useEmailTheme()
  const l = links(brand)
  const tab = balanceTab(variant)
  return (
    <EmailLayout
      refCode={booking.ref}
      meta={{
        subject: `Your bill from ${venue.name}: ${cedis(tab.paidAtVenue)} paid at the table`,
        preheader: `${cedis(tab.spend)} spent on a ${cedis(tier.minSpend)} minimum. ${cedis(tab.deposit)} deposit applied.`,
      }}
    >
      <Row>
        <H1>Your bill from last night</H1>
        <P dim>
          {tableLabel} · {event.title} · {dayLong(event.startsAt)}. Itemised from {venue.name}’s bar system.
        </P>
      </Row>
      <Spacer h={8} />
      <Row>
        <Panel tone={tab.unspent ? 'danger' : 'success'}>
          <Lines
            rows={[
              { label: 'Minimum spend', value: cedis(tier.minSpend) },
              { label: 'You spent', value: cedis(tab.spend), strong: true, tone: tab.unspent ? 'danger' : 'success', sub: tab.unspent ? `${cedis(tab.unspent)} under the minimum` : `Minimum met, ${cedis(tab.spend - tier.minSpend)} over` },
            ]}
          />
        </Panel>
      </Row>
      <Spacer h={20} />
      <Row>
        <SectionTitle>Pre-ordered</SectionTitle>
        <Lines rows={tab.pre.map((it) => ({ label: `${it.qty} × ${it.name}`, value: cedis(it.total) }))} />
      </Row>
      <Row>
        <SectionTitle>Ordered on the night</SectionTitle>
        <Lines rows={tab.extras.map((it) => ({ label: `${it.qty} × ${it.name}`, value: cedis(it.total) }))} />
      </Row>
      <Spacer h={12} />
      <Row>
        <Lines
          rows={[
            { label: 'Total spend', value: cedis(tab.spend), rule: true },
            ...(tab.unspent ? [{ label: 'Unspent minimum', value: cedis(tab.unspent), sub: 'Charged so the table reaches its minimum' }] : []),
            { label: `Service (${RULES.venueServicePct}%)`, value: cedis(tab.service) },
            { label: 'Deposit applied', value: `−${cedis(tab.deposit)}`, tone: 'success', sub: `Paid with booking ${booking.ref}` },
            { label: 'Paid at the venue', value: cedis(tab.paidAtVenue), strong: true, rule: true, sub: `Card •••• 4417 at ${venue.name}` },
          ]}
        />
      </Row>
      <Spacer h={20} />
      <Row>
        <P dim small>
          The {cedis(tab.booked.fee)} booking fee was paid online and isn’t part of this bill. Something look wrong? Reply within 7 days and we’ll check it with {venue.name}.
        </P>
        <Button href={l.receipt}>Download PDF</Button>
        <Button href={l.review} variant="secondary">
          Rate your night
        </Button>
      </Row>
      <Row>
        <p style={{ margin: '6px 0 0', fontSize: 12, color: t.faint }}>Billed to {host.name}.</p>
      </Row>
    </EmailLayout>
  )
}
