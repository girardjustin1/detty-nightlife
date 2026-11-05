import type { Meta, StoryObj } from '@storybook/react-vite'
import { LiveFloor } from './LiveFloor'

const meta = {
  title: 'Promoter/Live Floor',
  component: LiveFloor,
  parameters: {
    docs: {
      description: {
        component:
          'The consumer `FloorPlan` in `mode="promoter"` with per-table statuses (arrived / booked / late / held / free) from tonight’s reservations. Tap a table to open its booking: host, party arrived count, bottles to prep, deposit and balance, notes, and actions.',
      },
    },
  },
} satisfies Meta<typeof LiveFloor>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const ArrivedTable: Story = { name: 'Arrived table (B3)', args: { selected: 'B3' } }
export const LateTable: Story = { name: 'Late table (B2)', args: { selected: 'B2' } }
export const HeldMoMoFailed: Story = { name: 'Held, MoMo failed (B5)', args: { selected: 'B5' } }
export const FreeTable: Story = { name: 'Free table (B4)', args: { selected: 'B4' } }
export const BoothsOnly: Story = { args: { tier: 'booth' } }
