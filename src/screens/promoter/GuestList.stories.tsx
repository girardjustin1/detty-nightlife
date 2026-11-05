import type { Meta, StoryObj } from '@storybook/react-vite'
import { GuestList } from './GuestList'

const meta = {
  title: 'Promoter/Guest List',
  component: GuestList,
  parameters: {
    docs: {
      description: {
        component:
          'Tonight’s guest list: Attending / Pending / No-show tabs with head counts (including +1s), promoter comp allowances, manual add with plus-ones and a WhatsApp QR. The promoter view shows only that promoter’s own list and comps.',
      },
    },
  },
} satisfies Meta<typeof GuestList>
export default meta
type Story = StoryObj<typeof meta>

export const Attending: Story = {}
export const Pending: Story = { args: { tab: 'pending' } }
export const NoShow: Story = { args: { tab: 'no-show' } }
export const AddGuest: Story = { args: { adding: true } }
export const PromoterView: Story = { name: 'Promoter view (own comps)', args: { asPromoter: true } }
