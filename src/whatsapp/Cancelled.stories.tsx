import type { Meta, StoryObj } from '@storybook/react-vite'
import { CancelledThread } from './threads'

const meta = {
  title: 'WhatsApp/Cancelled & Refund',
  component: CancelledThread,
  parameters: {
    docs: {
      description: { component: '`booking_cancelled` then `refund_processed` (Paystack `refund.processed`), both **utility**. Refund = deposit × `RULES.refund` pct (more than 48h notice → 100%). MoMo refund timing is unverified, so we promise a message when it lands rather than a date.' },
    },
  },
} satisfies Meta<typeof CancelledThread>
export default meta
type Story = StoryObj<typeof meta>

export const RefundProcessed: Story = {}
export const JustCancelled: Story = { args: { stage: 'cancelled' } }
