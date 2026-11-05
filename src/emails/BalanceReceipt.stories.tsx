import type { Meta, StoryObj } from '@storybook/react-vite'
import { BalanceReceipt } from './BalanceReceipt'

const meta = {
  title: 'Emails/Balance-at-Venue Receipt',
  component: BalanceReceipt,
  parameters: {
    frame: 'email',
    docs: {
      description: {
        component:
          'Email #12 (v2): the post-event itemised bar tab. Minimum vs actual spend, deposit applied, service at `RULES.venueServicePct`, balance paid at the venue. Needs a venue POS export or manual entry, so it can’t ship before a venue integration. Line prices come from the bottle fixtures via `tableQuote`. **Assumption to confirm:** the unspent minimum is charged and service applies to the billed amount.',
      },
    },
  },
} satisfies Meta<typeof BalanceReceipt>
export default meta
type Story = StoryObj<typeof meta>

export const MinimumMet: Story = {}
export const UnderMinimum: Story = { args: { variant: 'short' } }
