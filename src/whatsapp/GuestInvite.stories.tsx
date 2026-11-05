import type { Meta, StoryObj } from '@storybook/react-vite'
import { GuestInviteThread } from './threads'

const meta = {
  title: 'WhatsApp/Guest Invite',
  component: GuestInviteThread,
  parameters: {
    docs: {
      description: { component: 'Guest invites are **not** sent through the API. The host taps *Invite on WhatsApp*, which opens `wa.me/?text=…` and sends the message from **Ama’s own WhatsApp** to Kojo, with a link preview of the invite page. Free, no template approval, no opt-in problem; we only learn it worked when the per-guest link `/i/{token}` is opened. **Forwarded** shows the risk: a per-guest token forwarded on (Efua → Yaw) lets someone else claim the spot.' },
    },
  },
} satisfies Meta<typeof GuestInviteThread>
export default meta
type Story = StoryObj<typeof meta>

export const HostView: Story = { args: { view: 'host' } }
export const GuestView: Story = { args: { view: 'guest' } }
export const ForwardedOn: Story = { args: { view: 'forwarded' } }
