import { events, tableTiers, venueById } from '@/data/fixtures'
import { cedis, dayShort } from '@/lib/format'
import type { Brand } from '@/brands/brands'
import type { ChatScript } from '../chat/types'
import { ConfirmCard, MapImage, event, guestNames, momoNumber, quote, ref, summaryText } from './shared'

const nights = events.slice(0, 6).map((e) => ({
  id: e.id,
  title: `${dayShort(e.startsAt)} · ${e.title}`,
  description: `${venueById(e.venueId).name} · ${e.tablesFrom ? `tables from ${cedis(e.tablesFrom)}` : 'tickets only'}`,
}))

const vault = tableTiers.vault

/** Option 1: a scripted menu bot — reply buttons and list messages only. */
export const menuBot = (b: Brand): ChatScript => ({
  id: 'wa-menu',
  clock: '14:02',
  subtitle: 'Bookings · usually replies instantly',
  start: 'open',
  nodes: {
    open: { bot: [], reply: { type: 'compose', draft: 'Hi', go: 'menu' } },
    menu: {
      bot: [
        {
          text: `Akwaaba to *${b.name}* 👋\nI can book VIP tables and tickets at Accra’s best rooms. What would you like to do?`,
          buttons: [
            { type: 'reply', label: 'Book a table' },
            { type: 'reply', label: 'Buy tickets' },
            { type: 'reply', label: 'My bookings' },
          ],
        },
      ],
      reply: {
        type: 'buttons',
        hot: 'Book a table',
        options: [
          { label: 'Book a table', go: 'night' },
          { label: 'Buy tickets', go: 'night' },
          { label: 'My bookings', go: 'night' },
        ],
      },
    },
    night: {
      bot: [{ text: 'Which night? 🗓️', buttons: [{ type: 'list', label: 'See nights' }] }],
      reply: { type: 'list', button: 'See nights', title: 'This week in Accra', sections: [{ title: 'Pick a night', rows: nights }], pick: event.id, go: 'party' },
    },
    party: {
      bot: [
        {
          text: `*${event.title}* at The Vault — great choice 🎉\nHow many people (including you)?`,
          buttons: [
            { type: 'reply', label: '2–4' },
            { type: 'reply', label: '5–6' },
            { type: 'reply', label: '7–12' },
          ],
        },
      ],
      reply: {
        type: 'buttons',
        hot: '5–6',
        options: [
          { label: '2–4', go: 'table' },
          { label: '5–6', go: 'table', say: '6 of us' },
          { label: '7–12', go: 'table' },
        ],
      },
    },
    table: {
      bot: [
        { node: <MapImage selected="B3" />, text: 'Here’s The Vault tonight. Tables for 6 are open on the right wall, by the stage.' },
        { text: 'Pick your table 👇', buttons: [{ type: 'list', label: 'Choose a table' }] },
      ],
      reply: {
        type: 'list',
        button: 'Choose a table',
        title: 'Tables for 6',
        sections: [
          {
            title: vault[1].name,
            rows: [
              { id: 'B3', title: 'B3 · VIP booth, stage side', description: `Up to 6 · min ${cedis(vault[1].minSpend)} · ${vault[1].depositPct}% deposit` },
              { id: 'B4', title: 'B4 · VIP booth', description: `Up to 6 · min ${cedis(vault[1].minSpend)} · ${vault[1].depositPct}% deposit` },
            ],
          },
          {
            title: vault[2].name,
            rows: [
              { id: 'L1', title: 'L1 · Lounge deck', description: `Up to 12 · min ${cedis(vault[2].minSpend)} · ${vault[2].depositPct}% deposit` },
              { id: 'L3', title: 'L3 · Lounge deck', description: `Up to 12 · min ${cedis(vault[2].minSpend)} · ${vault[2].depositPct}% deposit` },
            ],
          },
        ],
        pick: 'B3',
        go: 'bottles',
      },
    },
    bottles: {
      bot: [
        {
          text: `Booth B3 has a *${cedis(quote.minimum)} minimum*. Pre-order a package now, or decide at the venue (your deposit is taken on the minimum).`,
          buttons: [{ type: 'list', label: 'Bottle packages' }],
          footer: '21+ · ID checked at the door',
        },
      ],
      reply: {
        type: 'list',
        button: 'Bottle packages',
        title: 'Bottle packages',
        sections: [
          {
            title: 'Covers the minimum',
            rows: [
              { id: 'starter', title: `${b.name} starter · ${cedis(quote.preOrder)}`, description: 'Moët, Hennessy VS, Jameson, 2 mixer buckets, chichinga platter' },
              { id: 'champ', title: 'Champagne parade · ₵7,200', description: '3× Moët with sparklers, mixers' },
            ],
          },
          {
            title: 'Other',
            rows: [
              { id: 'bday', title: 'Birthday package · ₵5,350', description: '₵650 short of the minimum — top up on the night' },
              { id: 'later', title: 'Decide at the venue', description: `Deposit on the ${cedis(quote.minimum)} minimum` },
            ],
          },
        ],
        pick: 'starter',
        go: 'guests',
      },
    },
    guests: {
      bot: [
        {
          text: `Who’s coming? Share this link in your group chat — your ${guestNames.length} guests tap it to join the table.\n\n${b.name.toLowerCase()}.app/i/${ref.slice(4).toLowerCase()}`,
          buttons: [
            { type: 'reply', label: 'Shared it ✅' },
            { type: 'reply', label: 'Later' },
          ],
        },
      ],
      reply: {
        type: 'buttons',
        hot: 'Shared it ✅',
        options: [
          { label: 'Shared it ✅', go: 'review' },
          { label: 'Later', go: 'review' },
        ],
      },
    },
    review: {
      bot: [
        {
          header: { type: 'text', text: 'Review your booking' },
          text: summaryText(b.name),
          buttons: [{ type: 'reply', label: `Pay ${cedis(quote.dueNow)} with MoMo` }],
        },
      ],
      reply: { type: 'momo', button: `Pay ${cedis(quote.dueNow)} with MoMo`, amount: quote.dueNow, payee: `PAYSTACK*${b.name.toUpperCase()}`, network: 'MTN MoMo', number: momoNumber, go: 'done' },
    },
    done: {
      bot: [
        { text: `Payment received ✅ ${cedis(quote.dueNow)} from MTN MoMo ${momoNumber}.` },
        {
          node: <ConfirmCard />,
          text: `*You’re booked.* Your pass is above — it also works offline in the ${b.name} app.\nNeed anything? Reply *menu* any time.`,
          buttons: [
            { type: 'url', label: 'View booking' },
            { type: 'url', label: 'Get directions' },
          ],
        },
      ],
      reply: { type: 'end' },
    },
  },
})
