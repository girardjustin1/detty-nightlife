import type { Meta, StoryObj } from '@storybook/react-vite'
import { Offline } from './Offline'

const meta = {
  title: 'Consumer/States/Offline',
  component: Offline,
  parameters: {
    docs: {
      description: {
        component: 'No connection. Leads with **“Your tickets still work”** and lists the bookings cached on the phone; each opens an offline QR.',
      },
    },
  },
} satisfies Meta<typeof Offline>
export default meta
type Story = StoryObj<typeof meta>

export const WithSavedTickets: Story = {}
export const TicketOpen: Story = { args: { openTicket: 'b1' } }
export const Reconnecting: Story = { args: { retrying: true } }
export const NothingSaved: Story = { args: { noTickets: true } }
