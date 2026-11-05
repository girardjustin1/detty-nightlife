import type { Meta, StoryObj } from '@storybook/react-vite'
import { GuestInvite } from './GuestInvite'

const meta = {
  title: 'Emails/Guest Invite',
  component: GuestInvite,
  parameters: {
    frame: 'email',
    docs: {
      description: {
        component:
          'Email #5, the fallback for guests who gave an email. The primary invite is the host’s own `wa.me` share (see WhatsApp/Guest Invite). One email only: the guest never opted in, so we don’t send again unless they confirm. RSVP links carry a per-guest token (`/i/{token}`).',
      },
    },
  },
} satisfies Meta<typeof GuestInvite>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithHostNote: Story = { args: { note: 'Birthday energy only. Wear something gold! 💛' } }
