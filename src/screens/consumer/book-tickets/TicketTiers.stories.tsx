import type { Meta, StoryObj } from '@storybook/react-vite'
import { TicketTiers } from './TicketTiers'
import { sampleEvent, soldOut } from './ticketRules'

const meta = {
  title: 'Consumer/05 Book Tickets/Ticket Tiers',
  component: TicketTiers,
  parameters: {
    docs: {
      description: {
        component:
          'Ticket tiers (synthesis #18). Quantity chips 1 / 2 / 3 / 4+ (SeatGeek GA), tier cards with steppers, "incl. fees" prices from `ticketQuote`, remaining counts, sales-end note and a sticky total + Continue. Max per order is a sample rule in `ticketRules.ts`.',
      },
    },
  },
} satisfies Meta<typeof TicketTiers>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const OneTierSelected: Story = { args: { selection: { ga: 2 } } }
export const MultipleTiersSelected: Story = { args: { selection: { ga: 2, vip: 1 } } }
export const MaxPerOrderReached: Story = { args: { selection: { ga: 4, vip: 2 } } }
export const SoldOutWaitlist: Story = { args: { event: soldOut(sampleEvent) } }
export const SoldOutWaitlistJoined: Story = { args: { event: soldOut(sampleEvent), waitlistJoined: true } }
