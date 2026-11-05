import type { Brand } from '@/brands/brands'
import { bottleById, tableTiers } from '@/data/fixtures'
import { cedis } from '@/lib/format'
import { canonicalTable } from '@/lib/pricing'
import { FlowDropdown, FlowLabel, FlowOptIn, FlowRadio, WA } from '@/whatsapp/wa'
import type { ChatScript } from '../chat/types'
import { ConfirmCard, MapImage, arriveBy, event, guestNames, momoNumber, quote, refundCutoff, refundNow, tier, venue, when } from './shared'

const vault = tableTiers.vault

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between py-1 text-[14.5px] ${strong ? 'font-semibold' : ''}`}>
      <span style={{ color: strong ? WA.ink : WA.sub }}>{label}</span>
      <span>{value}</span>
    </div>
  )
}

/** Option 2: WhatsApp Flows — one native form inside the chat, then the MoMo prompt. */
export const flowsBot = (b: Brand): ChatScript => ({
  id: 'wa-flows',
  clock: '14:02',
  subtitle: 'Bookings · usually replies instantly',
  start: 'open',
  nodes: {
    open: { bot: [], reply: { type: 'compose', draft: 'Hi, I want to book a table for Friday', go: 'invite' } },
    invite: {
      bot: [
        {
          header: { type: 'image', src: event.photo, alt: event.title },
          text: `Akwaaba 👋 *${event.title}* is on Friday at ${venue.name}, and VIP tables are open.\n\nBook in one go below — night, table, bottles and guests. Takes about a minute.`,
          footer: `${b.name} · 21+`,
          buttons: [{ type: 'flow', label: 'Book a table' }],
        },
      ],
      reply: {
        type: 'flow',
        button: 'Book a table',
        responseTitle: 'Table booking',
        go: 'pay',
        screens: [
          {
            title: 'Your night',
            cta: 'Continue',
            body: (
              <>
                <FlowLabel>Night</FlowLabel>
                <FlowDropdown label="Event" value={`Fri 18 Dec · ${event.title}`} />
                <FlowLabel>Venue</FlowLabel>
                <FlowDropdown label="Venue" value={`${venue.name} · Osu`} />
                <FlowLabel>How many people?</FlowLabel>
                <FlowDropdown label="Party size" value="6 people (including you)" />
                <FlowLabel hint={`Tables are held until ${arriveBy}`}>Arrival time</FlowLabel>
                <FlowRadio options={[{ label: '10:30pm' }, { label: '11:00pm' }, { label: '11:30pm' }]} value="11:00pm" />
              </>
            ),
          },
          {
            title: 'Choose a table',
            cta: 'Continue',
            body: (
              <>
                <div className="pointer-events-none overflow-hidden rounded-lg">
                  <MapImage selected="B3" />
                </div>
                <FlowLabel hint="Open tables for 6 tonight">Table</FlowLabel>
                <FlowRadio
                  options={[
                    { label: 'B3 · VIP booth, stage side', hint: `Min ${cedis(vault[1].minSpend)} · ${vault[1].depositPct}% deposit` },
                    { label: 'B4 · VIP booth', hint: `Min ${cedis(vault[1].minSpend)} · ${vault[1].depositPct}% deposit` },
                    { label: 'L1 · Lounge deck (up to 12)', hint: `Min ${cedis(vault[2].minSpend)} · ${vault[2].depositPct}% deposit` },
                  ]}
                  value="B3 · VIP booth, stage side"
                />
              </>
            ),
          },
          {
            title: 'Bottles',
            cta: 'Continue',
            body: (
              <>
                <FlowLabel hint={`Booth B3 minimum: ${cedis(quote.minimum)}. Anything extra goes on your tab.`}>Pre-order</FlowLabel>
                {canonicalTable.lines.map((l) => {
                  const bt = bottleById(l.bottleId)
                  return (
                    <FlowOptIn
                      key={l.bottleId}
                      label={
                        <span className="flex w-full justify-between gap-3">
                          <span>
                            {l.qty > 1 ? `${l.qty}× ` : ''}
                            {bt.name}
                          </span>
                          <span style={{ color: WA.sub }}>{cedis(bt.price * l.qty)}</span>
                        </span>
                      }
                    />
                  )
                })}
                <FlowOptIn checked={false} label="Don Julio 1942 · ₵7,500" />
                <div className="mt-4 rounded-lg p-3 text-[14px]" style={{ background: '#E7F8EE', color: '#0B6B3A' }}>
                  ✓ {cedis(quote.preOrder)} covers the {cedis(quote.minimum)} minimum
                </div>
              </>
            ),
          },
          {
            title: 'Guests',
            cta: 'Continue',
            body: (
              <>
                <FlowLabel hint="We’ll send each guest their own pass">Who’s coming?</FlowLabel>
                {guestNames.map((n) => (
                  <div key={n} className="relative mt-3 rounded-md border px-3 pt-4 pb-2 text-[15px]" style={{ borderColor: '#8696A0' }}>
                    <span className="absolute -top-2 left-2 bg-white px-1 text-[12px]" style={{ color: WA.sub }}>
                      Guest name
                    </span>
                    {n}
                  </div>
                ))}
                <FlowOptIn label="Send my guests the invite link on WhatsApp" />
                <FlowOptIn label="It’s a birthday 🎂 (sparkler moment at midnight)" checked={false} />
              </>
            ),
          },
          {
            title: 'Review & pay',
            cta: `Pay ${cedis(quote.dueNow)} with MoMo`,
            body: (
              <>
                <div className="text-[16px] font-semibold">
                  {tier.name} B3 · {venue.name}
                </div>
                <div className="text-[14px]" style={{ color: WA.sub }}>
                  {when} · 6 guests · arrive by {arriveBy}
                </div>
                <div className="mt-3">
                  <Line label="Pre-order" value={cedis(quote.preOrder)} />
                  <Line label={`Deposit (${tier.depositPct}%)`} value={cedis(quote.deposit)} />
                  <Line label="Booking fee" value={cedis(quote.fee)} />
                  <Line label="Pay now" value={cedis(quote.dueNow)} strong />
                  <Line label="Balance at the venue" value={cedis(quote.balanceAtVenue)} />
                </div>
                <div className="mt-3 rounded-lg p-3 text-[13px] leading-snug" style={{ background: '#FFF6E0', color: '#6B4E00' }}>
                  Cancel before {refundCutoff} today: {cedis(refundNow)} back. After that, no refund. The booking fee isn’t refundable.
                </div>
                <FlowLabel>Pay with</FlowLabel>
                <FlowDropdown label="Mobile money" value={`MTN MoMo · ${momoNumber}`} />
              </>
            ),
          },
        ],
      },
    },
    pay: {
      bot: [
        {
          text: `Almost done 📲 We’ve sent a MoMo prompt for *${cedis(quote.dueNow)}* to ${momoNumber}. Approve it on your phone.`,
          buttons: [{ type: 'reply', label: 'Approve on my phone' }],
        },
      ],
      reply: { type: 'momo', button: 'Approve on my phone', amount: quote.dueNow, payee: `PAYSTACK*${b.name.toUpperCase()}`, network: 'MTN MoMo', number: momoNumber, go: 'done' },
    },
    done: {
      bot: [
        {
          node: <ConfirmCard />,
          text: `*You’re booked* ✅ ${cedis(quote.dueNow)} received.\nYour guests just got their invite links. We’ll remind you at 6pm.`,
          buttons: [
            { type: 'flow', label: 'Manage booking' },
            { type: 'url', label: 'Get directions' },
          ],
        },
      ],
      reply: { type: 'end' },
    },
  },
})
