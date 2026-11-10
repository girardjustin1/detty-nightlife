import { useBrand } from '@/brands/BrandContext'
import { paymentLabels } from '@/components/app/domain'
import { cedis, dayLong, time } from '@/lib/format'
import { RULES } from '@/lib/pricing'
import type { PaymentMethod } from '@/data/types'
import { Bullets, Button, Divider, EmailLayout, EventHeader, Lines, P, Panel, QRBlock, Row, SectionTitle, Spacer, H1 } from './kit'
import { arrivalCutoff, booking, event, host, links, maskPhone, quote, tableLabel, tier, venue, voice } from './sample'

export type BookingConfirmedProps = {
  method?: PaymentMethod
  /** Show the guest list block (host has already invited people). */
  withGuests?: boolean
}

export function BookingConfirmed({ method = booking.paymentMethod, withGuests = true }: BookingConfirmedProps) {
  const brand = useBrand()
  const l = links(brand)
  const paidWith = method === 'card' ? 'Visa •••• 4417' : `${paymentLabels[method].short} ${maskPhone(host.phone)}`
  const accepted = booking.guests.filter((g) => g.status === 'accepted' || g.status === 'host').length
  return (
    <EmailLayout
      refCode={booking.ref}
      meta={{
        subject: `${voice(brand, { detty: 'You’re in! ', aurum: '', vybe: 'Locked in: ' })}${tableLabel} at ${venue.name}, ${dayLong(event.startsAt)}`,
        preheader: `Deposit ${cedis(quote.deposit)} paid. ${cedis(quote.balanceAtVenue)} balance at the venue. Arrive by ${time(arrivalCutoff)}.`,
      }}
    >
      <Row>
        <H1>{brand.copy.confirmedTitle}</H1>
        <P dim>
          {voice(brand, {
            detty: `${host.firstName}, ${tableLabel} is yours. Bring the squad, we’ll handle the rest.`,
            aurum: `${host.firstName}, your table is reserved. Everything you need for the evening is below.`,
            vybe: `${host.firstName}, ${tableLabel} is locked. Here’s the plan.`,
          })}
        </P>
      </Row>
      <Spacer h={8} />
      <Row>
        <Panel>
          <EventHeader
            iso={event.startsAt}
            title={event.title}
            lines={[`${venue.name} · ${venue.area}`, `${dayLong(event.startsAt)} · doors ${time(event.doorsAt)}`, `${tableLabel} · up to ${tier.capacity} guests`]}
          />
        </Panel>
      </Row>
      <Spacer h={20} />
      <Row>
        <Button href={l.booking}>View booking</Button>
        <Button href={l.ics} variant="secondary">
          Add to calendar
        </Button>
      </Row>
      <Spacer h={16} />
      <Row>
        <SectionTitle>Payment</SectionTitle>
        <Lines
          rows={[
            { label: 'Minimum spend', value: cedis(quote.minimum) },
            { label: 'Your pre-order', value: cedis(quote.preOrder), sub: quote.shortfall === 0 ? 'Covers the minimum' : `${cedis(quote.shortfall)} short of the minimum` },
            { label: `Deposit (${tier.depositPct}%)`, value: cedis(quote.deposit), tone: 'success', sub: 'Counts toward your spend on the night' },
            { label: `Booking fee (${RULES.tableFeePct}%)`, value: cedis(quote.fee), sub: 'Non-refundable' },
            { label: 'Paid today', value: cedis(quote.dueNow), strong: true, rule: true, sub: paidWith },
            { label: 'Balance at the venue', value: cedis(quote.balanceAtVenue), strong: true, sub: `Plus ${RULES.venueServicePct}% service (≈ ${cedis(quote.serviceAtVenue)}), paid at the table` },
          ]}
        />
      </Row>
      <Spacer h={24} />
      <Row>
        <Panel>
          <QRBlock seed={booking.ref} code={booking.ref} caption={<>Show this at the door. It also lives in the app and works offline.</>} />
        </Panel>
      </Row>
      <Spacer h={24} />
      <Row>
        <SectionTitle>On the night</SectionTitle>
        <Bullets
          items={[
            <>
              <strong style={{ color: 'inherit' }}>Arrive by {time(arrivalCutoff)}.</strong> We hold the table {RULES.holdMinutesAfterDoors / 60} hours after doors, then it may be released.
            </>,
            `${venue.minAge}+ with valid ID for everyone on the table. Door staff check every guest.`,
            `Dress code: ${venue.dressCode}`,
            `${venue.address}. ${venue.parking}.`,
          ]}
        />
      </Row>
      <Spacer h={16} />
      {withGuests && (
        <>
          <Row>
            <SectionTitle>Your guests</SectionTitle>
            <P dim small>
              {accepted} of {tier.capacity} confirmed. Guests get their own entry pass when they accept. <a href={`${l.booking}/guests`} style={{ color: 'inherit' }}>Manage guests</a>
            </P>
          </Row>
          <Spacer h={8} />
        </>
      )}
      <Divider />
      <Spacer h={20} />
      <Row>
        <SectionTitle>Cancellation policy</SectionTitle>
        <Lines rows={RULES.refund.map((r) => ({ label: r.label, value: r.pct === 0 ? 'No refund' : `${r.pct}% of deposit` }))} />
        <P dim small style={{ marginTop: 10 }}>
          Refunds go back to the way you paid. The booking fee isn’t refundable. If the venue cancels, you get everything back.
        </P>
      </Row>
    </EmailLayout>
  )
}
