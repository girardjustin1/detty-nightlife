import type { Meta, StoryObj } from '@storybook/react-vite'
import { HostGuests } from './HostGuests'

const meta = {
  title: 'Consumer/09 Guests/Host Guest List',
  component: HostGuests,
  parameters: {
    docs: {
      description: {
        component:
          'The host’s guest list and collection status. Wise-style “₵X of ₵Y collected” bar (equal split of `tableQuote` commitment + fee), rows Paid ✓ / Pending / Invited / Declined, **Nudge on WhatsApp**, +1 requests to approve (Apple Invites), remove a guest, and swap the host.',
      },
    },
  },
} satisfies Meta<typeof HostGuests>
export default meta
type Story = StoryObj<typeof meta>

export const Collecting: Story = {}
export const Nudged: Story = { args: { nudged: true } }
export const GuestActions: Story = { args: { sheet: 'menu', target: 'g3' } }
export const RemoveGuest: Story = { args: { sheet: 'remove', target: 'g4' } }
export const RemovePaidGuest: Story = { args: { sheet: 'remove', target: 'g1' } }
export const SwapHost: Story = { args: { sheet: 'swap' } }
export const AllPaid: Story = { args: { allPaid: true } }
