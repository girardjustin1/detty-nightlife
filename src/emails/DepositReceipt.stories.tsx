import type { Meta, StoryObj } from '@storybook/react-vite'
import { DepositReceipt } from './DepositReceipt'

const meta = {
  title: 'Emails/Deposit Receipt',
  component: DepositReceipt,
  parameters: {
    frame: 'email',
    docs: {
      description: {
        component:
          'Email #3. Itemised pre-order, commitment (higher of pre-order and minimum), deposit and booking fee from `tableQuote`, Paystack reference, masked MoMo number. Can be merged into "Booking confirmed" (the doc allows either). Business registration details are placeholders until the legal entity exists.',
      },
    },
  },
} satisfies Meta<typeof DepositReceipt>
export default meta
type Story = StoryObj<typeof meta>

export const MTNMoMo: Story = {}
export const TelecelCash: Story = { args: { method: 'telecel-cash' } }
export const Card: Story = { args: { method: 'card' } }
