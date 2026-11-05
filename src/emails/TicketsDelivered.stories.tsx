import type { Meta, StoryObj } from '@storybook/react-vite'
import { TicketsDelivered } from './TicketsDelivered'

const meta = {
  title: 'Emails/Tickets Delivered',
  component: TicketsDelivered,
  parameters: {
    frame: 'email',
    docs: {
      description: {
        component:
          'Email #4 (ticket delivery). One QR and text code per ticket, "works offline in the app". Uses fixture booking DTY-2M8P (3 × GA, Tidal: Beach Rave) and `ticketQuote`. Pairs with the `ticket_ready` WhatsApp utility template. Open question: is the "screenshots may be refused" line true for our signed, rotating passes?',
      },
    },
  },
} satisfies Meta<typeof TicketsDelivered>
export default meta
type Story = StoryObj<typeof meta>

export const ThreeTickets: Story = {}
export const SingleTicket: Story = { args: { count: 1 } }
