import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkout } from './Checkout'

const meta = {
  title: 'Consumer/05 Book Tickets/Checkout',
  component: Checkout,
  parameters: {
    docs: {
      description: {
        component:
          'SeatGeek-style single checkout sheet (synthesis #19): event summary, contact (phone from profile), ticket holders (assign names, send to friends on WhatsApp), payment row, promo code, and a sticky "Total · View details" expander with the breakdown from `ticketQuote`. Pay continues to 07 Pay.',
      },
    },
  },
} satisfies Meta<typeof Checkout>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const MultipleTiers: Story = { args: { selection: { ga: 2, vip: 1 }, holdersAssigned: true } }
export const BreakdownOpen: Story = { args: { breakdownOpen: true } }
export const PromoEntering: Story = { args: { promo: 'entering' } }
export const PromoInvalid: Story = { args: { promo: 'invalid' } }
export const PromoApplied: Story = { args: { promo: 'applied', breakdownOpen: true } }
