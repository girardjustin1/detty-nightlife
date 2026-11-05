import { useBrand } from '@/brands/BrandContext'
import { dayLong } from '@/lib/format'
import { Button, EmailLayout, H1, P, Row, Spacer, Table, useEmailTheme } from './kit'
import { booking, event, host, links, tableLabel, venue, voice } from './sample'

export function ReviewRequest() {
  const brand = useBrand()
  const t = useEmailTheme()
  const l = links(brand)
  return (
    <EmailLayout
      refCode={booking.ref}
      meta={{
        subject: voice(brand, { detty: `How was ${venue.name}, ${host.firstName}? 🌟`, aurum: `How was your evening at ${venue.name}?`, vybe: `Rate the night: ${event.title}` }),
        preheader: 'One tap to rate. Takes 10 seconds and helps the next group pick their night.',
      }}
      footerNote={
        <>
          Review requests come once per booking.{' '}
          <a href={l.prefs} style={{ color: t.dim }}>
            Turn them off
          </a>
          .
        </>
      }
    >
      <Row>
        <H1>{voice(brand, { detty: 'So… how far? How was it?', aurum: 'How was your evening?', vybe: 'How was the night?' })}</H1>
        <P dim>
          {event.title} at {venue.name}, {dayLong(event.startsAt)}, {tableLabel}. One tap below.
        </P>
      </Row>
      <Spacer h={12} />
      <Row>
        <Table>
          <tr>
            {[1, 2, 3, 4, 5].map((n) => (
              <td key={n} align="center" style={{ padding: '0 3px' }}>
                <a
                  href={`${l.review}?stars=${n}`}
                  style={{ display: 'block', background: t.surface, border: `1px solid ${t.line}`, borderRadius: t.radius, padding: '12px 0 8px', textDecoration: 'none', color: t.accent2 }}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                >
                  <div style={{ fontSize: 24, lineHeight: '26px' }}>{'★'}</div>
                  <div style={{ fontSize: 13, color: t.dim, marginTop: 2 }}>{n}</div>
                </a>
              </td>
            ))}
          </tr>
        </Table>
        <Table style={{ marginTop: 6 }}>
          <tr>
            <td style={{ fontSize: 12, color: t.faint }}>Not great</td>
            <td align="right" style={{ fontSize: 12, color: t.faint }}>
              Loved it
            </td>
          </tr>
        </Table>
      </Row>
      <Spacer h={24} />
      <Row>
        <P dim small>
          Want to say more? Rate the music, the service and the door separately, and add a photo if you like.
        </P>
        <Button href={l.review} variant="secondary">
          Write a short review
        </Button>
      </Row>
    </EmailLayout>
  )
}
