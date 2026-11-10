import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookingConfirmed } from './BookingConfirmed'
import { AtWidth } from './kit'

const meta = {
  title: 'Emails/Booking Confirmed',
  component: BookingConfirmed,
  parameters: {
    frame: 'email',
    docs: {
      description: {
        component:
          'Sent on Paystack `charge.success` for a table deposit (email #2 in docs/integrations/email.md). The record of the booking: table, date, deposit paid, balance at the venue, policy summary, calendar link and the entry QR with a text code. Amounts come from `tableQuote` for the canonical booking (The Vault · booth B3 · ACC-7Q4K). Paired with the `booking_confirmed` WhatsApp utility template.',
      },
    },
  },
} satisfies Meta<typeof BookingConfirmed>
export default meta
type Story = StoryObj<typeof meta>

export const PaidWithMoMo: Story = {}
export const PaidByCard: Story = { args: { method: 'card' } }
export const NoGuestsYet: Story = { args: { withGuests: false } }
export const MobileWidth375: Story = {
  name: 'Mobile width (375px)',
  render: (args) => (
    <AtWidth width={375}>
      <BookingConfirmed {...args} />
    </AtWidth>
  ),
}
