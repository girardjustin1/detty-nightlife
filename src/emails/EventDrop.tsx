import { useBrand } from '@/brands/BrandContext'
import { eventById, tableTiers, venueById } from '@/data/fixtures'
import { cedis, dayLong, time } from '@/lib/format'
import { Button, EmailLayout, Eyebrow, H1, Lines, P, Row, SectionTitle, Spacer, useEmailTheme } from './kit'
import { domainFor, voice } from './sample'

export function EventDrop({ eventId = 'nye-countdown', images = true }: { eventId?: string; images?: boolean }) {
  const brand = useBrand()
  const t = useEmailTheme()
  const ev = eventById(eventId)
  const v = venueById(ev.venueId)
  const tiers = tableTiers[v.id] ?? []
  const url = `https://${domainFor(brand)}/e/${ev.id}`
  return (
    <EmailLayout
      meta={{
        kind: 'marketing',
        subject: voice(brand, { detty: `Just dropped: ${ev.title} at ${v.name} 🎆`, aurum: `${ev.title} at ${v.name}: tables now open`, vybe: `DROP: ${ev.title}` }),
        preheader: `${dayLong(ev.startsAt)} · ${ev.lineup.map((a) => a.name).join(', ')}. Tickets from ${cedis(ev.ticketsFrom ?? 0)}, tables from ${cedis(ev.tablesFrom ?? 0)}.`,
      }}
    >
      {/* Single 600×300 image, ~25 KB as JPEG when sent. Copy below still works with images off. */}
      <tr>
        <td style={{ padding: '0 32px 20px' }}>
          {images ? (
            <img src={ev.photo} alt={`${ev.title} at ${v.name}`} width={536} style={{ width: '100%', maxWidth: 536, height: 'auto', display: 'block', borderRadius: t.radius, border: 0, color: t.dim, fontSize: 14 }} />
          ) : (
            <div style={{ border: `1px dashed ${t.line}`, borderRadius: t.radius, padding: 18, color: t.dim, fontSize: 14 }}>
              [image: {ev.title} at {v.name}]
            </div>
          )}
        </td>
      </tr>
      <Row>
        <Eyebrow>Just dropped</Eyebrow>
        <H1>{ev.title}</H1>
        <P dim>
          {v.name} · {v.area} · {dayLong(ev.startsAt)}, {time(ev.startsAt)} till late
        </P>
        <P>{ev.description}</P>
      </Row>
      <Spacer h={4} />
      <Row>
        <SectionTitle>Line-up</SectionTitle>
        <Lines rows={ev.lineup.map((a) => ({ label: a.name, value: a.role, tone: 'dim' as const }))} />
      </Row>
      <Spacer h={20} />
      <Row>
        <SectionTitle>Tables</SectionTitle>
        {ev.tablesFrom !== null && <P style={{ margin: '0 0 8px' }}>From {cedis(ev.tablesFrom)} minimum spend, with a deposit to book.</P>}
        <Lines rows={tiers.map((tr) => ({ label: tr.name, sub: tr.perks.join(' · '), value: `up to ${tr.capacity}`, tone: 'dim' as const }))} />
        <P dim small style={{ marginTop: 8 }}>
          Dress code: {ev.dressCode}. {ev.minAge}+ with ID.
        </P>
      </Row>
      <Spacer h={16} />
      <Row>
        {ev.ticketsFrom !== null && <Button href={`${url}/tickets`}>Tickets from {cedis(ev.ticketsFrom)}</Button>}
        {ev.tablesFrom !== null && (
          <Button href={`${url}/tables`} variant="secondary">
            Reserve a table
          </Button>
        )}
      </Row>
    </EmailLayout>
  )
}
