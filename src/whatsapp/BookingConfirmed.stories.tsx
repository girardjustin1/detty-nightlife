import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookingConfirmedThread } from './threads'

const meta = {
  title: 'WhatsApp/Booking Confirmed',
  component: BookingConfirmedThread,
  parameters: {
    docs: {
      description: { component: '`booking_confirmed` **utility** template, sent on Paystack `charge.success`, right after the login code. Buttons: View booking / Get directions (URL). Amounts from `tableQuote` for DTY-7Q4K.' },
    },
  },
} satisfies Meta<typeof BookingConfirmedThread>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
