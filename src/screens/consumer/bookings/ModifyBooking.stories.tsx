import type { Meta, StoryObj } from '@storybook/react-vite'
import { canonicalTable } from '@/lib/pricing'
import { ModifyBooking } from './ModifyBooking'

const meta = {
  title: 'Consumer/08 My Bookings/Modify Booking',
  component: ModifyBooking,
  parameters: {
    docs: {
      description: {
        component:
          'Modify in place (OpenTable). Party size, arrival time and bottles. **Save changes** stays disabled until something changes, and the bottom bar previews the price difference before saving: “You’ll pay ₵X more now” or “₵X will be refunded” (refunds follow `RULES.refund` for the time left; the booking fee never refunds).',
      },
    },
  },
} satisfies Meta<typeof ModifyBooking>
export default meta
type Story = StoryObj<typeof meta>

export const Unchanged: Story = {}
export const AddBottle: Story = { args: { lines: [...canonicalTable.lines, { bottleId: 'veuve', qty: 1 }] } }
export const RemoveBottle: Story = { args: { lines: canonicalTable.lines.filter((l) => l.bottleId !== 'jameson') } }
export const RemoveBottleEarly: Story = { name: 'Remove bottle (>48h out)', args: { lines: canonicalTable.lines.filter((l) => l.bottleId !== 'jameson'), now: '2026-12-15T20:00:00Z' } }
export const PartyAndTimeOnly: Story = { args: { party: 5, arriveAt: '2026-12-18T22:30:00Z' } }
