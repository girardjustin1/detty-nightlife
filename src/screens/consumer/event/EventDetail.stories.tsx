import type { Meta, StoryObj } from '@storybook/react-vite'
import { EventDetail } from './EventDetail'

const meta = {
  title: 'Consumer/03 Event/Event detail',
  component: EventDetail,
  parameters: {
    docs: {
      description: {
        component:
          'Event detail (DICE event page, SeatGeek GA hero, OpenTable "Notes for tonight"). Poster hero, date/doors, venue link, friends going, **Who’s playing** with role badges and a tap-to-load 30s preview (never autoloads; with data saver on the button shows the size first), **Music & vibe**, ticket tiers with fees included, fact rows (dress code, age, offline QR entry, refund/transfer from `RULES`, notes for tonight), and an in-app SVG location map. The sticky bar adapts: tickets + tables, tables only, tickets only, sold out (waitlist) or past.',
      },
    },
  },
} satisfies Meta<typeof EventDetail>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const PreviewPlaying: Story = { args: { playingTrack: 'Kwesi Wav', saved: true } }
export const TablesOnly: Story = { name: 'Tables only (Highlife & Champagne)', args: { eventId: 'highlife-champagne' } }
export const TicketsOnly: Story = { name: 'Tickets only (Tidal: Beach Rave)', args: { eventId: 'tidal-beach-rave' } }
export const SoldOut: Story = { name: 'Sold out · Join waitlist', args: { state: 'sold-out' } }
export const SoldOutTicketsOnly: Story = { name: 'Sold out · tickets-only night', args: { eventId: 'tidal-beach-rave', state: 'sold-out' } }
export const Past: Story = { name: 'Past event', args: { eventId: 'highlife-champagne', state: 'past' } }
export const DataSaver: Story = { args: { network: 'slow' }, globals: { dataSaver: 'on' } }
export const Loading: Story = { args: { loading: true } }
