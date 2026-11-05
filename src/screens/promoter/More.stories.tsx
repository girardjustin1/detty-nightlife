import type { Meta, StoryObj } from '@storybook/react-vite'
import { More } from './More'

const meta = {
  title: 'Promoter/More',
  component: More,
  parameters: {
    docs: {
      description: {
        component: 'The More tab: everything that isn’t Tonight, Bookings, Door or Events. Items are filtered by role, so a promoter or door staff member sees a shorter menu.',
      },
    },
  },
  argTypes: { role: { control: 'inline-radio', options: ['owner', 'manager', 'promoter', 'door'] } },
} satisfies Meta<typeof More>
export default meta
type Story = StoryObj<typeof meta>

export const Manager: Story = {}
export const Promoter: Story = { args: { role: 'promoter' } }
export const DoorStaff: Story = { args: { role: 'door' } }
