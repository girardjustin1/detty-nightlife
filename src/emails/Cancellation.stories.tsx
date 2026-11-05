import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cancellation } from './Cancellation'

const meta = {
  title: 'Emails/Cancellation & Refund',
  component: Cancellation,
  parameters: {
    frame: 'email',
    docs: {
      description: {
        component:
          'Emails #10 (cancellation confirmed) and #11 (refund processed, Paystack `refund.processed`). The refund is the deposit × `RULES.refund` pct for the notice given; the booking fee is non-refundable. **Assumption to confirm:** when the venue cancels, the booking fee is refunded too (payments.md says "automatic full refund if the venue cancels"). MoMo refund timing is **unverified** in payments.md, so the copy promises a WhatsApp when it lands rather than a date; card uses Paystack’s "up to 10 business days".',
      },
    },
  },
} satisfies Meta<typeof Cancellation>
export default meta
type Story = StoryObj<typeof meta>

export const MoreThan48hFullRefund: Story = { name: 'More than 48h (100%)' }
export const Between6And48hHalfRefund: Story = { name: '6–48h (50%)', args: { scenario: 'mid' } }
export const LessThan6hNoRefund: Story = { name: 'Under 6h (no refund)', args: { scenario: 'late' } }
export const VenueCancelled: Story = { args: { scenario: 'venue' } }
export const CardRefund: Story = { args: { method: 'card' } }
export const RefundProcessed: Story = { args: { stage: 'refunded' } }
