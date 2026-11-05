import type { Meta, StoryObj } from '@storybook/react-vite'
import { EventDrop } from './EventDrop'

const meta = {
  title: 'Emails/Event Drop (Marketing)',
  component: EventDrop,
  parameters: {
    frame: 'email',
    docs: {
      description: {
        component:
          'Marketing email, **opt-in only** ("Event drops & offers" is unticked by default at signup). Sent from the marketing subdomain (`news.`), with the one-click unsubscribe footer (RFC 8058 `List-Unsubscribe` headers when sent). One image only, and it reads fine with images off. Table minimums use the event’s `tablesFrom` floor.',
      },
    },
  },
} satisfies Meta<typeof EventDrop>
export default meta
type Story = StoryObj<typeof meta>

export const NYECountdown: Story = {}
export const SunsetSessions: Story = { args: { eventId: 'sunset-sessions' } }
export const ImagesOff: Story = { args: { images: false } }
