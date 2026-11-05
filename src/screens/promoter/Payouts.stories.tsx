import type { Meta, StoryObj } from '@storybook/react-vite'
import { Payouts } from './Payouts'

const meta = {
  title: 'Promoter/Payouts',
  component: Payouts,
  parameters: {
    docs: {
      description: {
        component:
          'Settled vs pending payouts, by night, with tonight’s breakdown (gross online sales, platform fee, promoter commission, net) and per-promoter commission. Payout to MTN MoMo or bank. **The venue-side fee and commission rates are SAMPLE values** in `VENUE_TERMS` (promoterData.ts) until the commercial model is decided.',
      },
    },
  },
} satisfies Meta<typeof Payouts>
export default meta
type Story = StoryObj<typeof meta>

export const Owner: Story = {}
export const ManagerView: Story = { name: 'Manager (account locked)', args: { role: 'manager' } }
export const PayoutAccount: Story = { args: { withdrawing: true } }
