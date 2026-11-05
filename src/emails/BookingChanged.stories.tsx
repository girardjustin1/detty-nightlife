import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookingChanged } from './BookingChanged'

const meta = {
  title: 'Emails/Booking Changed',
  component: BookingChanged,
  parameters: {
    frame: 'email',
    docs: {
      description: {
        component:
          'Email #8. A diff of old → new and any price difference, both quotes from `tableQuote`. **Upgrade**: the host adds a Veuve Clicquot, so the deposit and fee rise and the difference is due. **Venue moved**: same tier, no price change. Open question: should a venue-initiated move always offer a full refund (assumed here)?',
      },
    },
  },
} satisfies Meta<typeof BookingChanged>
export default meta
type Story = StoryObj<typeof meta>

export const UpgradePayDifference: Story = {}
export const VenueMovedTable: Story = { args: { change: 'venue-moved' } }
