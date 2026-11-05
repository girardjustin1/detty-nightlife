import { useBrand } from '@/brands/BrandContext'
import { NOW } from '@/data/fixtures'
import { cedis, dayLong, time } from '@/lib/format'
import { RULES } from '@/lib/pricing'
import { Button, EmailLayout, H1, Lines, P, Panel, QRBlock, Row, SectionTitle, Spacer, useEmailTheme } from './kit'
import { arrivalCutoff, booking, event, host, links, quote, refundFor, tableLabel, tier, venue, voice } from './sample'

export function Reminder({ when = 'today' }: { when?: 'today' | 'tomorrow' }) {
  const brand = useBrand()
  const t = useEmailTheme()
  const l = links(brand)
  const confirmed = booking.guests.filter((g) => g.status === 'accepted' || g.status === 'host').length
  const pending = booking.guests.filter((g) => g.status === 'invited').length
  const day = when === 'today' ? 'Tonight' : 'Tomorrow'
  // Notice left if they cancel at send time: the day-of reminder goes at NOW (2pm), T-24h the night before.
  const hoursLeft = when === 'today' ? (new Date(event.startsAt).getTime() - new Date(NOW).getTime()) / 3_600_000 : 24
  const refund = refundFor(hoursLeft)
  return (
    <EmailLayout
      refCode={booking.ref}
      meta={{
        subject: `${day}: ${tableLabel} at ${venue.name}. Arrive by ${time(arrivalCutoff)}`,
        preheader: `Doors ${time(event.doorsAt)}. Dress code: ${venue.dressCode} ${confirmed}/${tier.capacity} guests confirmed.`,
      }}
    >
      <Row>
        <H1>
          {voice(brand, {
            detty: when === 'today' ? `Tonight’s the night, ${host.firstName} 🔥` : `Tomorrow, ${host.firstName}. Get ready 🔥`,
            aurum: when === 'today' ? `This evening at ${venue.name}` : `Tomorrow evening at ${venue.name}`,
            vybe: when === 'today' ? 'Tonight. Pull up.' : 'Tomorrow. Get set.',
          })}
        </H1>
        <P dim>
          {event.title} · {dayLong(event.startsAt)} · doors {time(event.doorsAt)}
        </P>
      </Row>
      <Spacer h={8} />
      <Row>
        <Panel tone="accent">
          <div style={{ fontSize: 13, color: t.faint }}>Arrive by</div>
          <div style={{ fontSize: 32, lineHeight: '38px', fontWeight: 800, color: t.text }}>{time(arrivalCutoff)}</div>
          <div style={{ fontSize: 14, lineHeight: '21px', color: t.dim, marginTop: 4 }}>
            {tableLabel} is held until {RULES.holdMinutesAfterDoors / 60} hours after doors. If you’re running late, reply on WhatsApp and the venue will know.
          </div>
        </Panel>
      </Row>
      <Spacer h={24} />
      <Row>
        <SectionTitle>Getting there</SectionTitle>
        <P style={{ margin: '0 0 4px' }}>
          <strong>{venue.name}</strong>
        </P>
        <P dim small style={{ margin: '0 0 12px' }}>
          {venue.address}
          <br />
          {venue.parking}
        </P>
        <Button href={l.directions}>Get directions</Button>
        <Button href={l.pass} variant="secondary">
          Open entry pass
        </Button>
      </Row>
      <Spacer h={16} />
      <Row>
        <SectionTitle>At the door</SectionTitle>
        <Lines
          rows={[
            { label: 'Dress code', value: venue.dressCode.split('.')[0] },
            { label: 'Age', value: `${venue.minAge}+, ID for everyone` },
            { label: 'Guests confirmed', value: `${confirmed} of ${tier.capacity}`, sub: pending ? `${pending} haven’t replied yet` : undefined },
            { label: 'Balance at the venue', value: cedis(quote.balanceAtVenue), sub: `Plus ${RULES.venueServicePct}% service` },
          ]}
        />
      </Row>
      <Spacer h={20} />
      <Row>
        <Panel>
          <QRBlock seed={booking.ref} code={booking.ref} size={132} caption="Your pass. Guests have their own." />
        </Panel>
      </Row>
      <Spacer h={16} />
      <Row>
        <P dim small>
          Can’t make it? Cancelling now refunds {refund.rule.pct}% of your deposit ({cedis(refund.amount)}). <a href={`${l.booking}/cancel`} style={{ color: t.dim }}>Manage booking</a>
        </P>
      </Row>
    </EmailLayout>
  )
}
