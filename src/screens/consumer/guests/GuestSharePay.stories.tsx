import type { Meta, StoryObj } from '@storybook/react-vite'
import { GuestSharePay } from './GuestSharePay'

const meta = {
  title: 'Consumer/09 Guests/Share Payment',
  component: GuestSharePay,
  parameters: {
    docs: {
      description: {
        component:
          'The guest pays their share (PayPal split / Wise link). Simplified here: the amount, how it was worked out, and one MoMo method row. In the build this re-uses the Pay screens from the booking flow (another group), so methods, MoMo prompt and failure states match.',
      },
    },
  },
} satisfies Meta<typeof GuestSharePay>
export default meta
type Story = StoryObj<typeof meta>

export const Review: Story = {}
export const ApproveOnPhone: Story = { args: { state: 'approve' } }
export const Paid: Story = { args: { state: 'paid' } }
