import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotificationOptIn } from './NotificationOptIn'

const meta = {
  title: 'Consumer/01 Onboarding/Notifications',
  component: NotificationOptIn,
  parameters: {
    docs: {
      description: {
        component:
          'Pre-permission explainer shown **before** the OS dialog. Honest split: WhatsApp carries your bookings (confirmations, receipts, guest RSVPs); push carries what’s on (Notify-list openings, new nights), capped at one promo a week.',
      },
    },
  },
} satisfies Meta<typeof NotificationOptIn>
export default meta
type Story = StoryObj<typeof meta>

export const Explainer: Story = {}
export const SystemPrompt: Story = { name: 'OS permission prompt', args: { systemPrompt: true } }
