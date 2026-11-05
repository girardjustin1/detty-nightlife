import type { Meta, StoryObj } from '@storybook/react-vite'
import { Receipts } from './Receipts'

const meta = {
  title: 'Consumer/08 My Bookings/Receipts',
  component: Receipts,
  parameters: {
    docs: {
      description: {
        component:
          'Payments and refunds as one timeline (SeatGeek ticket history + price breakdown). Tap an entry for the itemised breakdown and **Download receipt**. Pending MoMo refunds show as their own entry until they land.',
      },
    },
  },
} satisfies Meta<typeof Receipts>
export default meta
type Story = StoryObj<typeof meta>

export const TableDeposit: Story = {}
export const PendingRefund: Story = { args: { openId: 'r3' } }
export const TicketRefund: Story = { args: { openId: 'r2' } }
export const Tickets: Story = { args: { openId: 'r4' } }
