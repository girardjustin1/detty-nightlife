import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotifyList } from './NotifyList'

const meta = {
  title: 'Consumer/08 My Bookings/Notify List',
  component: NotifyList,
  parameters: {
    docs: {
      description: {
        component:
          'Notify list / waitlist (Resy Notify). Each request has a night, a time window and a party size. When a table opens, it is held for you alone for 15 minutes with a live countdown, then offered to the next person.',
      },
    },
  },
} satisfies Meta<typeof NotifyList>
export default meta
type Story = StoryObj<typeof meta>

export const TableOpened: Story = {}
export const HoldExpired: Story = { args: { secondsLeft: 0 } }
export const Empty: Story = { args: { empty: true } }
