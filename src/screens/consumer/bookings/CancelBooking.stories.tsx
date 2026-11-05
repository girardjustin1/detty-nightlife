import type { Meta, StoryObj } from '@storybook/react-vite'
import { CancelledBooking, CancelSheet } from './CancelBooking'

const meta = {
  title: 'Consumer/08 My Bookings/Cancel Booking',
  component: CancelSheet,
  parameters: {
    docs: {
      description: {
        component:
          'Cancel sheet (Resy). Booking summary, the exact refund for *this* booking right now, the policy restated with dates and cedi amounts (`RULES.refund`: >48h full deposit, 6–48h 50%, <6h none; booking fee never refunds), optional reason chips. Then the Cancelled screen with a MoMo refund timeline (1–3 days).',
      },
    },
  },
} satisfies Meta<typeof CancelSheet>
export default meta
type Story = StoryObj<typeof meta>

/** Fri 2pm, 8 hours out: 50% of the deposit back. */
export const HalfRefund: Story = { args: { reason: 'Plans changed' } }
export const FullRefund: Story = { args: { now: '2026-12-15T20:00:00Z' } }
export const NoRefund: Story = { args: { now: '2026-12-18T19:00:00Z' } }

export const CancelledRefundOnItsWay: Story = { render: () => <CancelledBooking /> }
export const CancelledRefundReceived: Story = { render: () => <CancelledBooking stage="received" /> }
export const CancelledNoRefund: Story = { render: () => <CancelledBooking now="2026-12-18T19:00:00Z" /> }
