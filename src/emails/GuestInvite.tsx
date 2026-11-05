import { useBrand } from '@/brands/BrandContext'
import { dayLong, time } from '@/lib/format'
import { Bullets, Button, EmailLayout, EventHeader, H1, P, Panel, Row, SectionTitle, Spacer, useEmailTheme } from './kit'
import { arrivalCutoff, booking, event, host, links, tableLabel, tier, venue, voice } from './sample'

export function GuestInvite({ note, guestName = 'Efua' }: { note?: string; guestName?: string }) {
  const brand = useBrand()
  const t = useEmailTheme()
  const l = links(brand)
  const confirmed = booking.guests.filter((g) => g.status === 'accepted' || g.status === 'host').length
  return (
    <EmailLayout
      meta={{
        subject: `${host.firstName} added you to a table at ${venue.name}, ${dayLong(event.startsAt)}`,
        preheader: `${event.title} · ${tableLabel}. Tap to confirm your spot. It takes 10 seconds.`,
      }}
      footerNote={`You’re getting this one email because ${host.name} added your address as a guest. We won’t email you again unless you confirm.`}
    >
      <Row>
        <H1>
          {voice(brand, {
            detty: `${guestName}, you’re on ${host.firstName}’s table 🍾`,
            aurum: `${guestName}, ${host.firstName} has reserved you a seat`,
            vybe: `${guestName}, you’re on the list.`,
          })}
        </H1>
        <P dim>
          {host.name} booked {tableLabel} at {venue.name} and added you. {confirmed} of {tier.capacity} spots are confirmed.
        </P>
      </Row>
      {note && (
        <Row pad="0 32px 16px">
          <Panel tone="accent">
            <P style={{ margin: 0, fontStyle: 'italic' }}>“{note}”</P>
            <P dim small style={{ margin: '6px 0 0' }}>
              {host.firstName}
            </P>
          </Panel>
        </Row>
      )}
      <Spacer h={8} />
      <Row>
        <Panel>
          <EventHeader iso={event.startsAt} title={event.title} lines={[`${venue.name} · ${venue.area}`, `${dayLong(event.startsAt)} · doors ${time(event.doorsAt)}`, tableLabel]} />
        </Panel>
      </Row>
      <Spacer h={20} />
      <Row>
        <Button href={l.invite}>I’m coming</Button>
        <Button href={`${l.invite}?no=1`} variant="secondary">
          Can’t make it
        </Button>
        <P dim small>
          No app or payment needed to say yes. You’ll get your own entry pass once you confirm.
        </P>
      </Row>
      <Spacer h={12} />
      <Row>
        <SectionTitle>Before you go</SectionTitle>
        <Bullets
          items={[
            <>
              <strong style={{ color: t.text }}>{venue.minAge}+ only.</strong> Bring a valid ID; the door checks everyone.
            </>,
            `Arrive by ${time(arrivalCutoff)} with the group.`,
            `Dress code: ${venue.dressCode}`,
            venue.address,
          ]}
        />
      </Row>
    </EmailLayout>
  )
}
