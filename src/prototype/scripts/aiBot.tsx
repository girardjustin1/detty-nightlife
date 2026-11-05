import type { Brand } from '@/brands/brands'
import { bottleById, tableTiers } from '@/data/fixtures'
import { cedis } from '@/lib/format'
import { WA } from '@/whatsapp/wa'
import type { ChatScript } from '../chat/types'
import { ConfirmCard, MapImage, arriveBy, event, guestNames, momoNumber, quote, summaryText, venue } from './shared'

const vault = tableTiers.vault
const asked = ['moet', 'hennessy-vs', 'jameson'].reduce((s, id) => s + bottleById(id).price, 0)
const topUp = quote.preOrder - asked
const AI = 'AI concierge'

function Option({ title, meta, best }: { title: string; meta: string; best?: boolean }) {
  return (
    <div className="mt-1.5 flex items-center gap-2 rounded-md px-2.5 py-2" style={{ background: '#F5F6F6' }}>
      <div className="min-w-0 flex-1 leading-tight">
        <div className="text-[14.5px] font-medium">{title}</div>
        <div className="text-[12.5px]" style={{ color: WA.sub }}>
          {meta}
        </div>
      </div>
      {best && (
        <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: '#E7F8EE', color: '#0B6B3A' }}>
          Best fit
        </span>
      )}
    </div>
  )
}

/** Option 3: an AI concierge — free text in, structured booking out. Every price comes from the booking engine. */
export const aiBot = (b: Brand): ChatScript => ({
  id: 'wa-ai',
  clock: '14:02',
  subtitle: 'AI concierge · a person can take over',
  start: 'open',
  nodes: {
    open: {
      bot: [],
      reply: { type: 'compose', draft: 'Hey! Need a table for 6 this Friday at The Vault. We want Moët, Hennessy and Jameson 🍾', go: 'offer' },
    },
    offer: {
      bot: [
        {
          tag: AI,
          text: `Ete sen! 🙌 Friday 18 Dec at ${venue.name} is *${event.title}* — Kwesi Wav b2b Ama Selecta from midnight.\n\nFor 6, these are open right now:`,
          node: (
            <div className="mb-1">
              <Option title="B3 · VIP booth, stage side" meta={`Up to 6 · min ${cedis(vault[1].minSpend)}`} best />
              <Option title="B4 · VIP booth" meta={`Up to 6 · min ${cedis(vault[1].minSpend)}`} />
              <Option title="L1 · Lounge deck" meta={`Up to 12 · min ${cedis(vault[2].minSpend)} — more room to dance`} />
            </div>
          ),
        },
        { tag: AI, node: <MapImage selected="B3" />, text: 'B3 is right by the stage 👆' },
        {
          text: 'Which one?',
          buttons: [
            { type: 'reply', label: 'B3 · stage side' },
            { type: 'reply', label: 'B4' },
            { type: 'reply', label: 'Lounge deck' },
          ],
        },
      ],
      reply: {
        type: 'buttons',
        hot: 'B3 · stage side',
        options: [
          { label: 'B3 · stage side', go: 'bottles', say: 'B3 please!' },
          { label: 'B4', go: 'bottles' },
          { label: 'Lounge deck', go: 'bottles' },
        ],
      },
    },
    bottles: {
      bot: [
        {
          tag: AI,
          text: `Good pick. Moët, Hennessy VS and Jameson come to *${cedis(asked)}* — that’s ${cedis(quote.minimum - asked)} under B3’s ${cedis(quote.minimum)} minimum.\n\nWant me to add 2 mixer buckets and the chichinga platter (${cedis(topUp)})? You’d be at *${cedis(quote.preOrder)}* ✓`,
          buttons: [
            { type: 'reply', label: 'Yes, add them' },
            { type: 'reply', label: 'Keep it as is' },
          ],
        },
      ],
      reply: {
        type: 'buttons',
        hot: 'Yes, add them',
        options: [
          { label: 'Yes, add them', go: 'guests' },
          { label: 'Keep it as is', go: 'guests' },
        ],
      },
    },
    guests: {
      bot: [{ tag: AI, text: 'Done ✅ Who’s coming? Send names, or I can make an invite link for your group chat.' }],
      reply: { type: 'compose', draft: `${guestNames.slice(0, -1).join(', ')} and ${guestNames.at(-1)}. Can we come at 11?`, go: 'review' },
    },
    review: {
      bot: [
        { tag: AI, text: `Got it — 6 on the list. 11pm works; we hold B3 until ${arriveBy}. Here’s everything:` },
        {
          tag: AI,
          header: { type: 'text', text: 'Your booking' },
          text: summaryText(b.name),
          buttons: [{ type: 'reply', label: `Pay ${cedis(quote.dueNow)} with MoMo` }],
          footer: 'Reply “person” any time to talk to our team',
        },
      ],
      reply: { type: 'momo', button: `Pay ${cedis(quote.dueNow)} with MoMo`, amount: quote.dueNow, payee: `PAYSTACK*${b.name.toUpperCase()}`, network: 'MTN MoMo', number: momoNumber, go: 'done' },
    },
    done: {
      bot: [
        { node: <ConfirmCard />, text: `*You’re booked* ✅ ${cedis(quote.dueNow)} received. I’ve sent invites to ${guestNames.join(', ')}.` },
        { tag: AI, text: 'Anything to make it special? Birthday, a cake, a sparkler moment? 🎆' },
      ],
      reply: { type: 'compose', draft: 'Yes! It’s Efua’s birthday 🎂', go: 'special' },
    },
    special: {
      bot: [
        { tag: AI, text: 'Love that 🥳 I’ve told the host — sparkler moment for Efua at midnight, no extra charge. See you Friday!' },
      ],
      reply: { type: 'end' },
    },
  },
})
