import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConfirmedPendingApproval, ConfirmedTable, ConfirmedTickets } from './Confirmed'

const meta = {
  title: 'Consumer/07 Pay/Confirmed',
  component: ConfirmedTable,
  parameters: {
    docs: {
      description: {
        component:
          'Resy-style confirmation (synthesis #29). Table: brand `confirmedTitle`, table facts, host QR, deposit paid vs balance at venue, guests to invite on WhatsApp, calendar / directions, policy and an optional occasion prompt. Tickets: in Bookings and offline, send to friends. Large parties: pending venue approval.',
      },
    },
  },
} satisfies Meta<typeof ConfirmedTable>
export default meta
type Story = StoryObj<typeof meta>

export const Table: Story = {}
export const TableOccasionAdded: Story = { args: { occasion: 'Birthday' } }
export const Tickets: Story = { render: () => <ConfirmedTickets /> }
export const TicketsSentToFriends: Story = { render: () => <ConfirmedTickets selection={{ ga: 2, vip: 1 }} sentTo={['Kojo Mensah']} /> }
export const PendingVenueApproval: Story = { render: () => <ConfirmedPendingApproval /> }
