import { useBrand } from '@/brands/BrandContext'
import { cedis, dayLong, dayShort, time } from '@/lib/format'
import { RULES } from '@/lib/pricing'
import { Bullets, Button, EmailLayout, H1, Lines, P, Panel, Row, SectionTitle, Spacer, useEmailTheme } from './kit'
import { booking, event, host, links, maskPhone, quote, tableLabel, venue } from './sample'

export type FailureKind = 'momo-timeout' | 'card-declined' | 'split-due'

/** Split-deposit state (v2): what each guest has paid so far, from the guest fixtures. */
export const splitPaid = booking.guests.reduce((s, g) => s + (g.paidShare ?? 0), 0)
export const splitDeadline = '2026-12-17T18:00:00Z'

export function PaymentFailed({ kind = 'momo-timeout' }: { kind?: FailureKind }) {
  const brand = useBrand()
  const t = useEmailTheme()
  const l = links(brand)
  const split = kind === 'split-due'
  const left = quote.deposit - splitPaid
  const unpaid = booking.guests.filter((g) => g.status === 'accepted' && !g.paidShare)
  return (
    <EmailLayout
      refCode={split ? booking.ref : undefined}
      meta={{
        subject: split ? `${cedis(left)} still needed by ${dayShort(splitDeadline)}, ${time(splitDeadline)} to keep ${tableLabel}` : `Payment didn’t go through: ${tableLabel} held for ${RULES.checkoutHoldMinutes} minutes`,
        preheader: split ? `${cedis(splitPaid)} of ${cedis(quote.deposit)} deposit paid. Pay the rest or nudge your guests.` : `Try again to keep ${tableLabel} at ${venue.name}. Nothing was charged.`,
      }}
    >
      <Row>
        <H1>{split ? 'Deposit not covered yet' : 'Your payment didn’t go through'}</H1>
        <P dim>
          {kind === 'momo-timeout' && `${host.firstName}, the MoMo approval prompt on ${maskPhone(host.phone)} timed out, so nothing was charged.`}
          {kind === 'card-declined' && `${host.firstName}, your bank declined the card payment, so nothing was charged.`}
          {split && `${host.firstName}, the split deposit for ${tableLabel} at ${venue.name} isn’t fully paid. If it isn’t covered by the deadline, the table is released.`}
        </P>
      </Row>
      <Spacer h={8} />
      <Row>
        <Panel tone="danger">
          {split ? (
            <Lines
              rows={[
                { label: 'Deposit', value: cedis(quote.deposit) },
                { label: 'Paid so far', value: cedis(splitPaid), tone: 'success' },
                { label: 'Still needed', value: cedis(left), strong: true, rule: true, sub: `By ${dayLong(splitDeadline)}, ${time(splitDeadline)}` },
              ]}
            />
          ) : (
            <>
              <div style={{ fontSize: 13, color: t.faint }}>Table held for</div>
              <div style={{ fontSize: 32, lineHeight: '38px', fontWeight: 800, color: t.text }}>{RULES.checkoutHoldMinutes} minutes</div>
              <div style={{ fontSize: 14, lineHeight: '21px', color: t.dim, marginTop: 4 }}>
                {tableLabel} · {event.title} · {dayLong(event.startsAt)}. Amount: {cedis(quote.dueNow)}.
              </div>
            </>
          )}
        </Panel>
      </Row>
      <Spacer h={20} />
      <Row>
        {split ? (
          <>
            <Button href={`${l.booking}/pay`}>Pay the rest ({cedis(left)})</Button>
            <Button href={`${l.booking}/guests`} variant="secondary">
              Nudge guests
            </Button>
          </>
        ) : (
          <>
            <Button href={`${l.booking}/pay`}>Try again</Button>
            <Button href={`${l.booking}/pay?method=card`} variant="secondary">
              {kind === 'card-declined' ? 'Use MoMo instead' : 'Pay by card instead'}
            </Button>
          </>
        )}
      </Row>
      <Spacer h={12} />
      <Row>
        <SectionTitle>{split ? 'Who hasn’t paid' : 'Common fixes'}</SectionTitle>
        <Bullets
          items={
            split
              ? unpaid.map((g) => `${g.name}: share not paid yet`)
              : kind === 'momo-timeout'
                ? ['Keep your phone unlocked and approve the prompt within about 2 minutes.', 'Check your MoMo balance covers the amount and your daily limit.', 'Ported your number? Pick the network you use now.']
                : ['Ask your bank to allow online payments, then try again.', 'Mobile money usually works first time. Try MoMo instead.']
          }
        />
      </Row>
    </EmailLayout>
  )
}
