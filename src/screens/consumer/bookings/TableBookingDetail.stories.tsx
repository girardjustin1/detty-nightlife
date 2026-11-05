import type { Meta, StoryObj } from '@storybook/react-vite'
import { bGuestsPending } from './bookingData'
import { TableBookingDetail } from './TableBookingDetail'

const meta = {
  title: 'Consumer/08 My Bookings/Table Booking Detail',
  component: TableBookingDetail,
  parameters: {
    docs: {
      description: {
        component:
          'Table booking detail (Resy / OpenTable booking page). Host QR (saved for offline), booth B3 on a cropped floor plan, bottles with the minimum-spend meter, deposit paid vs balance at the venue, guest collection progress, and the **policy repeated** with this booking’s exact refund amounts. The band that applies right now is marked. All amounts come from `tableQuote`.',
      },
    },
  },
} satisfies Meta<typeof TableBookingDetail>
export default meta
type Story = StoryObj<typeof meta>

/** Fri 18 Dec, 2pm: 8 hours to go, so the 50% band applies. */
export const Confirmed: Story = {}
/** Tue 15 Dec: more than 48 hours out, full deposit back. */
export const FullRefundWindow: Story = { args: { now: '2026-12-15T20:00:00Z' } }
/** Fri 18 Dec, 7pm: under 6 hours, no refund. */
export const NoRefundWindow: Story = { args: { now: '2026-12-18T19:00:00Z' } }
export const GuestsPending: Story = { args: { booking: bGuestsPending, status: 'guests-pending', now: '2026-12-18T14:00:00Z' } }
export const Offline: Story = { args: { network: 'offline' }, globals: { dataSaver: 'on' } }
