import type { Meta, StoryObj } from '@storybook/react-vite'
import { CardForm, CardThreeDS } from './CardPay'
import { ticketPay } from './payData'

const meta = {
  title: 'Consumer/07 Pay/Card',
  component: CardForm,
  parameters: {
    docs: { description: { component: 'Minimal card form (number, expiry, CVC, name — no billing address) and the 3-D Secure pending state while the bank confirms.' } },
  },
} satisfies Meta<typeof CardForm>
export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}
export const Filled: Story = { args: { filled: true } }
export const Declined: Story = { args: { filled: true, declined: true } }
export const Tickets: Story = { args: { pay: ticketPay(), filled: true } }
export const ThreeDSecurePending: Story = { render: () => <CardThreeDS /> }
