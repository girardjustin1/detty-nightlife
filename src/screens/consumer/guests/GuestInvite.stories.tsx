import type { Meta, StoryObj } from '@storybook/react-vite'
import { GuestInvite } from './GuestInvite'

const meta = {
  title: 'Consumer/09 Guests/Invite Landing',
  component: GuestInvite,
  parameters: {
    docs: {
      description: {
        component:
          'What a guest sees after tapping the host’s WhatsApp link: a web page, no app needed (Wise payment link for non-users). “Ama invited you to Booth B3 at The Vault”, the guest’s share (equal split of `tableQuote` commitment + fee), **Accept & pay** / **Accept · Ama covers my share** / Decline, and “Get the app” as a secondary. Accepting asks for phone + OTP, not a login.',
      },
    },
  },
} satisfies Meta<typeof GuestInvite>
export default meta
type Story = StoryObj<typeof meta>

export const Landing: Story = {}
export const HostCoversTable: Story = { args: { hostCovers: true } }
export const SplitRequired: Story = { name: 'Split required (no host cover)', args: { allowHostCover: false } }
export const ConfirmPhone: Story = { args: { step: 'phone' } }
export const EnterCode: Story = { args: { step: 'otp' } }
export const Declined: Story = { args: { step: 'declined' } }
