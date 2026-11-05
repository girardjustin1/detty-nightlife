import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaymentMethods } from './PaymentMethods'

const meta = {
  title: 'Consumer/10 Profile/Payment methods',
  component: PaymentMethods,
  parameters: {
    docs: {
      description: {
        component: 'Saved Mobile Money numbers first (MTN MoMo, Telecel Cash), then cards, then Bitcoin Lightning marked **Beta** with plain-language finality copy.',
      },
    },
  },
} satisfies Meta<typeof PaymentMethods>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Empty: Story = { args: { empty: true, lightning: false } }
export const AddMobileMoney: Story = { args: { addSheet: true } }
