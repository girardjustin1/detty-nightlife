import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReminderThread } from './threads'

const meta = {
  title: 'WhatsApp/Day-of Reminder',
  component: ReminderThread,
  parameters: {
    docs: {
      description: { component: '`booking_reminder` **utility** template at 2pm on the day, with quick replies *I’m on my way* / *Running late* / *Cancel*. A tap opens the 24h customer-service window, so the business replies are free-form **service** messages (charged after 1,000 free per number per month since 2026-10-01). The cancel reply quotes the refund from `RULES.refund` (8h notice → 50%).' },
    },
  },
} satisfies Meta<typeof ReminderThread>
export default meta
type Story = StoryObj<typeof meta>

export const RunningLate: Story = {}
export const JustSent: Story = { args: { state: 'sent' } }
export const CancelTapped: Story = { args: { state: 'cancel-tapped' } }
