import { useBrand } from '@/brands/BrandContext'
import { paymentLabels } from '@/components/app/domain'
import { cedis, dayLong, time } from '@/lib/format'
import { RULES } from '@/lib/pricing'
import { Bullets, Button, EmailLayout, EventHeader, H1, Lines, P, Panel, QRBlock, Row, SectionTitle, Spacer, useEmailTheme } from './kit'
import { host, links, maskPhone, ticketBooking, ticketEvent, ticketTier, ticketTotals, ticketVenue, voice } from './sample'

export function TicketsDelivered({ count = ticketTotals.count }: { count?: number }) {
  const brand = useBrand()
  const t = useEmailTheme()
  const l = links(brand)
  const holders = ticketBooking.guests.slice(0, count)
  const subtotal = ticketTier.price * count
  const fee = count === ticketTotals.count ? ticketTotals.fee : Math.round((subtotal * RULES.ticketFeePct) / 100)
  const code = (i: number) => `${ticketBooking.ref.replace('DTY-', '')}-${String(i + 1).padStart(2, '0')}`
  return (
    <EmailLayout
      refCode={ticketBooking.ref}
      meta={{
        subject: `Your ${count === 1 ? 'ticket' : `${count} tickets`} for ${ticketEvent.title}`,
        preheader: `${dayLong(ticketEvent.startsAt)} · gates ${time(ticketEvent.doorsAt)} · ${ticketVenue.name}. Your QR works offline in the app.`,
      }}
    >
      <Row>
        <H1>{voice(brand, { detty: 'Tickets in hand 🎟️', aurum: 'Your tickets', vybe: 'Tickets dropped.' })}</H1>
        <P dim>
          {host.firstName}, here {count === 1 ? 'is your ticket' : `are your ${count} tickets`}. Each one has its own QR, so forward a ticket to whoever’s using it.
        </P>
      </Row>
      <Spacer h={8} />
      <Row>
        <Panel>
          <EventHeader iso={ticketEvent.startsAt} title={ticketEvent.title} lines={[`${ticketVenue.name} · ${ticketVenue.area}`, `${dayLong(ticketEvent.startsAt)} · gates ${time(ticketEvent.doorsAt)}`, `${count} × ${ticketTier.name}`]} />
        </Panel>
      </Row>
      <Spacer h={20} />
      <Row>
        <Button href={l.tickets}>Open in the app</Button>
        <Button href={`${l.tickets}.ics`} variant="secondary">
          Add to calendar
        </Button>
        <P dim small>
          Open your tickets once while you have signal. After that they work offline, even with no data at the gate.
        </P>
      </Row>
      <Spacer h={12} />
      {holders.map((g, i) => (
        <Row key={g.id} pad="0 32px 16px">
          <Panel>
            <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
              <tbody>
                <tr>
                  <td style={{ fontSize: 13, color: t.faint, paddingBottom: 12 }}>
                    Ticket {i + 1} of {count} · {ticketTier.name}
                  </td>
                  <td align="right" style={{ fontSize: 13, color: t.dim, paddingBottom: 12 }}>
                    {g.status === 'host' ? 'You' : g.name}
                  </td>
                </tr>
              </tbody>
            </table>
            <QRBlock seed={code(i)} code={code(i)} size={148} caption="One scan per ticket" />
          </Panel>
        </Row>
      ))}
      <Spacer h={8} />
      <Row>
        <SectionTitle>Payment</SectionTitle>
        <Lines
          rows={[
            { label: `${count} × ${ticketTier.name}`, value: cedis(subtotal) },
            { label: `Ticket fee (${RULES.ticketFeePct}%)`, value: cedis(fee) },
            { label: 'Paid', value: cedis(subtotal + fee), strong: true, rule: true, sub: `${paymentLabels[ticketBooking.paymentMethod].name} ${maskPhone(host.phone)}` },
          ]}
        />
      </Row>
      <Spacer h={20} />
      <Row>
        <SectionTitle>Good to know</SectionTitle>
        <Bullets items={[`${ticketVenue.minAge}+ with ID. ${ticketVenue.dressCode}`, `${ticketVenue.address}. ${ticketVenue.parking}.`, 'Screenshots of a QR may be refused. Show it from the app or this email.']} />
      </Row>
    </EmailLayout>
  )
}
