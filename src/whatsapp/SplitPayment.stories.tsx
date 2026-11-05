import type { Meta, StoryObj } from '@storybook/react-vite'
import { SplitPaymentThread } from './threads'

const meta = {
  title: 'WhatsApp/Split Payment Request',
  component: SplitPaymentThread,
  parameters: {
    docs: {
      description: { component: 'v2 split deposits. **Template**: `split_payment_request` (utility) to a guest who ticked WhatsApp updates when they RSVP’d, with a URL button to a Paystack payment link. **Host group**: the zero-cost alternative, where Ama pastes the split link into her own group chat. Share = deposit ÷ party size from `tableQuote`.' },
    },
  },
} satisfies Meta<typeof SplitPaymentThread>
export default meta
type Story = StoryObj<typeof meta>

export const TemplateToGuest: Story = {}
export const HostSharesInGroup: Story = { args: { view: 'host-group' } }
