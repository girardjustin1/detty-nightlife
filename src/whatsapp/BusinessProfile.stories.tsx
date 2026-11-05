import type { Meta, StoryObj } from '@storybook/react-vite'
import { BusinessProfile } from './threads'

const meta = {
  title: 'WhatsApp/Business Profile',
  component: BusinessProfile,
  parameters: {
    docs: {
      description: {
        component:
          'Contact info for the business: the only WhatsApp screen that shows the booking number (`BOOKING_WHATSAPP` from `src/config/contact.ts`). Chat headers and template senders show the **brand name** with the verified badge (the badge needs an Official Business Account, which is a later step in whatsapp.md).',
      },
    },
  },
} satisfies Meta<typeof BusinessProfile>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
