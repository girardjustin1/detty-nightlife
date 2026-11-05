import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaymentFailed } from './PaymentFailed'

const meta = {
  title: 'Emails/Payment Failed',
  component: PaymentFailed,
  parameters: {
    frame: 'email',
    docs: {
      description: {
        component:
          'Payment failed / action needed. **MoMo timeout** and **card declined** hold the table for `RULES.checkoutHoldMinutes`. In practice the user is still on the checkout screen, so this email is a backstop if they leave. **Split due** is email #9 (v2 split deposits): what is left of the deposit, by the deadline, from the guests’ `paidShare` fixtures.',
      },
    },
  },
} satisfies Meta<typeof PaymentFailed>
export default meta
type Story = StoryObj<typeof meta>

export const MoMoTimedOut: Story = {}
export const CardDeclined: Story = { args: { kind: 'card-declined' } }
export const SplitDepositDue: Story = { args: { kind: 'split-due' } }
