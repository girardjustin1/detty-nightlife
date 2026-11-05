import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookingsTab } from './BookingsTab'

const meta = {
  title: 'Consumer/08 My Bookings/Bookings Tab',
  component: BookingsTab,
  parameters: {
    docs: {
      description: {
        component:
          'Bookings tab. Upcoming / Past (Posh, Resy). Tonight’s booking is pinned on top with **Show QR** and a “Saved for offline” note. Cards carry a status chip: Confirmed, Awaiting payment, Guests pending, Completed, Cancelled, Refunded. The Notify list sits above the cards (Resy keeps notifies beside bookings).',
      },
    },
  },
} satisfies Meta<typeof BookingsTab>
export default meta
type Story = StoryObj<typeof meta>

export const Upcoming: Story = {}
export const Past: Story = { args: { segment: 'past' } }
export const Empty: Story = { args: { empty: true } }
export const Loading: Story = { args: { loading: true } }
export const Offline: Story = { args: { network: 'offline' }, globals: { dataSaver: 'on' } }
