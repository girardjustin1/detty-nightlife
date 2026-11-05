import { useBrand } from '@/brands/BrandContext'
import { paymentLabels } from '@/components/app/domain'
import { floorPlans } from '@/data/floorplans'
import { tableTiers } from '@/data/fixtures'
import type { PaymentMethod } from '@/data/types'
import { cedis, dayLong, time } from '@/lib/format'
import { canonicalTable, RULES, tableQuote, type Line } from '@/lib/pricing'
import { Button, EmailLayout, H1, Lines, P, Panel, Row, SectionTitle, Spacer, Table, useEmailTheme } from './kit'
import { arrivalCutoff, booking, event, host, links, venue } from './sample'

type Res = { table: string; tierId: string; host: string; party: number; lines: Line[]; method: PaymentMethod; status: 'confirmed' | 'held'; note?: string }

/** Tonight at The Vault (sample). B3 is the canonical booking; the rest are fictional. */
export const tonight: Res[] = [
  { table: 'B3', tierId: 'booth', host: host.name, party: booking.partySize, lines: canonicalTable.lines, method: booking.paymentMethod, status: 'confirmed', note: 'Birthday' },
  { table: 'L2', tierId: 'lounge', host: 'Kofi Asamoah', party: 12, lines: [{ bottleId: 'ace', qty: 1 }, { bottleId: 'dj-1942', qty: 1 }, { bottleId: 'mixers', qty: 2 }], method: 'card', status: 'confirmed', note: 'Bottle parade at 1am' },
  { table: 'B1', tierId: 'booth', host: 'Abena Ofori', party: 6, lines: [{ bottleId: 'dj-1942', qty: 1 }], method: 'mtn-momo', status: 'confirmed' },
  { table: 'B2', tierId: 'booth', host: 'Nana Yeboah', party: 5, lines: canonicalTable.shortLines, method: 'telecel-cash', status: 'confirmed' },
  { table: 'B6', tierId: 'booth', host: 'Selorm Agbeko', party: 6, lines: [{ bottleId: 'veuve', qty: 2 }, { bottleId: 'mixers', qty: 1 }], method: 'mtn-momo', status: 'confirmed' },
  { table: 'H1', tierId: 'hightop', host: 'Kwabena Addo', party: 4, lines: [{ bottleId: 'hennessy-vs', qty: 1 }, { bottleId: 'mixers', qty: 1 }], method: 'at-money', status: 'confirmed' },
  { table: 'B5', tierId: 'booth', host: 'Adjoa Quaye', party: 6, lines: [{ bottleId: 'moet', qty: 2 }], method: 'mtn-momo', status: 'held' },
]

export function PromoterDailySummary() {
  const brand = useBrand()
  const t = useEmailTheme()
  const l = links(brand)
  const tiers = tableTiers[venue.id]
  const rows = tonight.map((r) => ({ ...r, tier: tiers.find((x) => x.id === r.tierId)!, q: tableQuote(tiers.find((x) => x.id === r.tierId)!, r.lines) }))
  const confirmed = rows.filter((r) => r.status === 'confirmed')
  const totalTables = floorPlans.vault.tables.length
  const deposits = confirmed.reduce((s, r) => s + r.q.deposit, 0)
  const committed = confirmed.reduce((s, r) => s + r.q.commitment, 0)
  const guestsExpected = confirmed.reduce((s, r) => s + r.party, 0)
  const short = confirmed.filter((r) => r.q.shortfall > 0)
  return (
    <EmailLayout
      meta={{
        kind: 'staff',
        subject: `Tonight at ${venue.name}: ${confirmed.length} tables, ${guestsExpected} guests, ${cedis(deposits)} in deposits`,
        preheader: `${event.title} · doors ${time(event.doorsAt)} · table cut-off ${time(arrivalCutoff)}. ${short.length} table${short.length === 1 ? '' : 's'} under minimum.`,
      }}
    >
      <Row>
        <H1>Tonight at {venue.name}</H1>
        <P dim>
          {event.title} · {dayLong(event.startsAt)} · doors {time(event.doorsAt)} · tables released at {time(arrivalCutoff)} ({RULES.holdMinutesAfterDoors / 60}h after doors)
        </P>
      </Row>
      <Spacer h={8} />
      <Row>
        <Table>
          <tr>
            {[
              { k: 'Tables booked', v: `${confirmed.length} / ${totalTables}` },
              { k: 'Guests expected', v: String(guestsExpected) },
              { k: 'Deposits paid', v: cedis(deposits) },
            ].map((s, i) => (
              <td key={s.k} width="33%" style={{ width: '33%', paddingLeft: i ? 8 : 0, verticalAlign: 'top' }}>
                <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: t.radius, padding: '12px 12px' }}>
                  <div style={{ fontSize: 20, lineHeight: '24px', fontWeight: 800, color: t.text, whiteSpace: 'nowrap' }}>{s.v}</div>
                  <div style={{ fontSize: 12, lineHeight: '16px', color: t.faint, marginTop: 2 }}>{s.k}</div>
                </div>
              </td>
            ))}
          </tr>
        </Table>
        <P dim small style={{ marginTop: 10 }}>
          Committed table spend {cedis(committed)} (pre-orders or minimums, whichever is higher), before {RULES.venueServicePct}% service.
        </P>
      </Row>
      <Spacer h={12} />
      {(short.length > 0 || rows.some((r) => r.status === 'held')) && (
        <Row pad="0 32px 20px">
          <Panel tone="accent">
            <SectionTitle>Needs attention</SectionTitle>
            {short.map((r) => (
              <P key={r.table} small style={{ margin: '0 0 6px' }}>
                <strong>{r.table}</strong> {r.host}: pre-order {cedis(r.q.preOrder)}, {cedis(r.q.shortfall)} under the {cedis(r.q.minimum)} minimum. Server to offer bottles.
              </P>
            ))}
            {rows
              .filter((r) => r.status === 'held')
              .map((r) => (
                <P key={r.table} small style={{ margin: 0 }}>
                  <strong>{r.table}</strong> {r.host}: held, waiting for MoMo approval. Released in {RULES.checkoutHoldMinutes} min if unpaid.
                </P>
              ))}
          </Panel>
        </Row>
      )}
      <Row>
        <SectionTitle>Reservations</SectionTitle>
      </Row>
      {rows.map((r) => (
        <Row key={r.table} pad="0 32px 10px">
          <Table style={{ borderBottom: `1px solid ${t.line}` }}>
            <tr>
              <td style={{ padding: '6px 0 2px', fontSize: 15, fontWeight: 700, color: t.text }}>
                <span style={{ fontFamily: t.mono, color: t.accent2 }}>{r.table}</span> · {r.host}
                {r.note && <span style={{ fontWeight: 400, color: t.dim }}> · {r.note}</span>}
              </td>
              <td align="right" style={{ padding: '6px 0 2px', fontSize: 13, color: r.status === 'held' ? t.danger : t.success, fontWeight: 700, whiteSpace: 'nowrap' }}>
                {r.status === 'held' ? 'Held' : 'Paid'}
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ padding: '0 0 8px', fontSize: 13, lineHeight: '19px', color: t.dim }}>
                {r.tier.name} · {r.party} guests · pre-order {cedis(r.q.preOrder)} · deposit {cedis(r.q.deposit)} · {paymentLabels[r.method].short}
              </td>
            </tr>
          </Table>
        </Row>
      ))}
      <Spacer h={12} />
      <Row>
        <Lines
          rows={[
            { label: 'Deposits collected (confirmed tables)', value: cedis(deposits), strong: true },
            { label: 'Balance to collect at tables', value: cedis(committed - deposits), sub: `Plus ${RULES.venueServicePct}% service` },
          ]}
        />
      </Row>
      <Spacer h={16} />
      <Row>
        <Button href={`https://${l.domain}/promoter/tonight`}>Open door list</Button>
        <Button href={`https://${l.domain}/promoter/tonight.csv`} variant="secondary">
          Download CSV
        </Button>
        <P dim small>
          Guest names and phone numbers are in the door app only, not in this email.
        </P>
      </Row>
    </EmailLayout>
  )
}
