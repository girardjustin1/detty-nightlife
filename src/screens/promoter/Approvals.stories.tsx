import type { Meta, StoryObj } from '@storybook/react-vite'
import { Approvals } from './Approvals'

const meta = {
  title: 'Promoter/Approvals',
  component: Approvals,
  parameters: {
    docs: {
      description: {
        component:
          'Large-party, over-capacity and concierge requests. Each shows the guest’s message, budget, history and a suggested free table (with the tier minimum and deposit). Approve holds the table and sends a deposit link on WhatsApp; decline sends a templated reply, ideally with an alternative.',
      },
    },
  },
} satisfies Meta<typeof Approvals>
export default meta
type Story = StoryObj<typeof meta>

export const Pending: Story = {}
export const Approved: Story = { args: { approved: true } }
export const DeclineWithAlternative: Story = { args: { declining: true } }
export const Empty: Story = { args: { empty: true } }
