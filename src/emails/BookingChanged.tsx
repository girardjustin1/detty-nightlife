import type { ReactNode } from 'react'
import { useBrand } from '@/brands/BrandContext'
import { cedis, dayLong, time } from '@/lib/format'
import { canonicalTable, tableQuote } from '@/lib/pricing'
import { Button, EmailLayout, Gap, H1, Lines, P, Panel, Row, SectionTitle, Spacer, useEmailTheme } from './kit'
import { booking, event, itemise, links, quote, tier, venue } from './sample'

/** Upgrade path: the host adds one bottle of Veuve Clicquot to the canonical pre-order. */
export const upgradeLines = [...canonicalTable.lines, { bottleId: 'veuve', qty: 1 }]
export const upgradeQuote = tableQuote(tier, upgradeLines)

export type ChangeKind = 'upgrade' | 'venue-moved'

export function BookingChanged({ change = 'upgrade' }: { change?: ChangeKind }) {
  const brand = useBrand()
  const t = useEmailTheme()
  const l = links(brand)
  const Was = ({ children }: { children: ReactNode }) => <span style={{ color: t.faint, textDecoration: 'line-through', fontWeight: 400 }}>{children}</span>
  const diff = (a: string, b: string) => (
    <>
      <Was>{a}</Was> <span style={{ color: t.faint }}>→</span> <span style={{ color: t.accent2 }}>{b}</span>
    </>
  )
  const upgrade = change === 'upgrade'
  const added = itemise([{ bottleId: 'veuve', qty: 1 }])[0]
  const toPay = upgradeQuote.dueNow - quote.dueNow
  return (
    <EmailLayout
      refCode={booking.ref}
      meta={{
        subject: upgrade ? `Pre-order updated: ${cedis(toPay)} to pay for ${booking.ref}` : `${venue.name} moved you to VIP booth B4 (same price)`,
        preheader: upgrade
          ? `Added ${added.qty} × ${added.name}. New deposit ${cedis(upgradeQuote.deposit)}. Pay the difference to keep the bottle.`
          : `Same booth tier, same night, same price. Your pass still works.`,
      }}
    >
      <Row>
        <H1>{upgrade ? 'Your pre-order changed' : 'Your table changed'}</H1>
        <P dim>
          {upgrade
            ? `You added ${added.qty} × ${added.name} to your table for ${event.title}. Here’s what changed.`
            : `${venue.name} has moved your group to a different booth for ${event.title}, ${dayLong(event.startsAt)}. Nothing else changes.`}
        </P>
      </Row>
      <Spacer h={8} />
      <Row>
        <SectionTitle>What changed</SectionTitle>
        <Panel>
          <Lines
            rows={
              upgrade
                ? [
                    { label: 'Pre-order', value: diff(cedis(quote.preOrder), cedis(upgradeQuote.preOrder)), sub: `+ ${added.qty} × ${added.name} (${cedis(added.total)})` },
                    { label: 'Commitment', value: diff(cedis(quote.commitment), cedis(upgradeQuote.commitment)) },
                    { label: `Deposit (${tier.depositPct}%)`, value: diff(cedis(quote.deposit), cedis(upgradeQuote.deposit)) },
                    { label: 'Booking fee', value: diff(cedis(quote.fee), cedis(upgradeQuote.fee)) },
                    { label: 'Balance at venue', value: diff(cedis(quote.balanceAtVenue), cedis(upgradeQuote.balanceAtVenue)) },
                  ]
                : [
                    { label: 'Table', value: diff('VIP booth B3', 'VIP booth B4'), sub: 'Next booth along, same side of the stage' },
                    { label: 'Date & time', value: `${dayLong(event.startsAt)}, ${time(event.startsAt)}`, tone: 'dim' },
                    { label: 'Price', value: 'No change', tone: 'dim' },
                  ]
            }
          />
        </Panel>
      </Row>
      <Spacer h={20} />
      {upgrade ? (
        <Row>
          <Panel tone="accent">
            <Lines rows={[{ label: 'To pay now', value: cedis(toPay), strong: true, sub: `Deposit difference ${cedis(upgradeQuote.deposit - quote.deposit)} + fee difference ${cedis(upgradeQuote.fee - quote.fee)}` }]} />
          </Panel>
          <Gap h={16} />
          <Button href={`${l.booking}/pay`}>Pay {cedis(toPay)}</Button>
          <Button href={l.booking} variant="secondary">
            Undo change
          </Button>
          <P dim small>
            If you don’t pay, we’ll keep your original pre-order ({cedis(quote.preOrder)}) and nothing else changes.
          </P>
        </Row>
      ) : (
        <Row>
          <Button href={l.booking}>View booking</Button>
          <P dim small>
            Your entry pass and your guests’ passes update automatically. Not happy with the move? Reply on WhatsApp and we’ll sort it with the venue, or cancel for a full refund.
          </P>
        </Row>
      )}
    </EmailLayout>
  )
}
