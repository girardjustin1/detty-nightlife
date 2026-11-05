import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookingChangedThread } from './threads'

const meta = {
  title: 'WhatsApp/Booking Changed',
  component: BookingChangedThread,
  parameters: {
    docs: {
      description: { component: '`booking_changed` **utility** template: old value struck through → new value. **Venue moved** has no price change. **Upgrade** asks for the difference (from two `tableQuote`s); the URL button label differs, so it would be a second approved template (`booking_changed_payment`).' },
    },
  },
} satisfies Meta<typeof BookingChangedThread>
export default meta
type Story = StoryObj<typeof meta>

export const VenueMovedTable: Story = {}
export const UpgradeNeedsPayment: Story = { args: { change: 'upgrade' } }
