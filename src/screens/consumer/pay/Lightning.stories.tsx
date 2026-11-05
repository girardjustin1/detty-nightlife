import type { Meta, StoryObj } from '@storybook/react-vite'
import { LightningInvoice } from './LightningInvoice'
import { ticketPay } from './payData'

const meta = {
  title: 'Consumer/07 Pay/Lightning (Beta)',
  component: LightningInvoice,
  parameters: {
    docs: {
      description: {
        component:
          'Bitcoin Lightning invoice (Beta; see docs/integrations/bitcoin-and-bitchat.md — v2 only, behind a legal opinion). Priced in cedis, quoted in sats with a rate lock equal to the checkout hold; QR via `FakeQR`; copy invoice; Open in wallet; waiting → paid. Refunds go back as the cedi value by MoMo or a claimable Lightning payment. The sats rate is a SAMPLE.',
      },
    },
  },
} satisfies Meta<typeof LightningInvoice>
export default meta
type Story = StoryObj<typeof meta>

export const Waiting: Story = {}
export const Copied: Story = { args: { copied: true, elapsed: 95 } }
export const Tickets: Story = { args: { pay: ticketPay() } }
export const Paid: Story = { args: { status: 'paid' } }
export const RateExpired: Story = { args: { status: 'expired' } }
