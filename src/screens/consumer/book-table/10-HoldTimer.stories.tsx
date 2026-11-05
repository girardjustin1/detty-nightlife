import type { Meta, StoryObj } from '@storybook/react-vite'
import { HoldTimer, HOLD_DEFAULT } from './HoldTimer'

const meta = {
  title: 'Consumer/06 Book a Table/Hold timer',
  component: HoldTimer,
  parameters: {
    frame: 'none',
    docs: { description: { component: 'The table is held for `RULES.checkoutHoldMinutes` while the guest reviews and pays. `pill` sits in the app bar (bottles, guests); `bar` tops Review and Pay. Turns amber under 2 minutes, red when expired.' } },
  },
  args: { tableLabel: 'B3', seconds: HOLD_DEFAULT },
  decorators: [(S) => <div style={{ maxWidth: 360 }}><S /></div>],
} satisfies Meta<typeof HoldTimer>
export default meta
type Story = StoryObj<typeof meta>

export const Bar: Story = { args: { variant: 'bar' } }
export const Pill: Story = { args: { variant: 'pill' } }
export const RunningLow: Story = { args: { variant: 'bar', seconds: 74 } }
export const Expired: Story = { args: { variant: 'bar', seconds: 0 } }
export const Live: Story = { args: { variant: 'bar', live: true } }
