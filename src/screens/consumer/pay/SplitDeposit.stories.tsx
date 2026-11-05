import type { Meta, StoryObj } from '@storybook/react-vite'
import { SplitDeposit } from './SplitDeposit'
import { splitPay } from './payData'

const meta = {
  title: 'Consumer/07 Pay/Split Deposit',
  component: SplitDeposit,
  parameters: {
    docs: { description: { component: 'When the host chose "split the deposit": you pay your share (plus the booking fee) now; guests pay theirs by WhatsApp link. Reuses the method picker.' } },
  },
} satisfies Meta<typeof SplitDeposit>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const FourWaySplit: Story = { args: { pay: splitPay(4) } }
export const Declined: Story = { args: { error: 'declined' } }
