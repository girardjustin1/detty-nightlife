import type { Meta, StoryObj } from '@storybook/react-vite'
import { Reminder } from './Reminder'

const meta = {
  title: 'Emails/Reminder',
  component: Reminder,
  parameters: {
    frame: 'email',
    docs: {
      description: {
        component:
          'Email #7. Day-of reminder (sent 2pm, 8h before 10pm start) with the arrival cut-off (doors + `RULES.holdMinutesAfterDoors`), dress code, directions, guests confirmed and the refund you would get if you cancelled now (`RULES.refund`). WhatsApp `booking_reminder` is the primary channel; email is optional at T-3h.',
      },
    },
  },
} satisfies Meta<typeof Reminder>
export default meta
type Story = StoryObj<typeof meta>

export const DayOf: Story = {}
export const DayBefore: Story = { args: { when: 'tomorrow' } }
