import type { Meta, StoryObj } from '@storybook/react-vite'
import { PartyTime } from './PartyTime'

const meta = {
  title: 'Consumer/06 Book a Table/Party & time',
  component: PartyTime,
  parameters: {
    docs: {
      description: {
        component:
          'Step 1 of 5. Party-size stepper, Resy-style arrival chips (doors → cut-off from `RULES.holdMinutesAfterDoors`; closed windows show **Notify**), and table-type cards filtered by party size with live "only 1 left" counts from the floor plan.',
      },
    },
  },
  args: { venue: 'vault' },
  argTypes: { venue: { control: 'inline-radio', options: ['vault', 'skyline', 'koko'] } },
} satisfies Meta<typeof PartyTime>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const CoupleOfTwo: Story = { args: { partySize: 2, tierId: 'hightop' } }
export const BigGroupOf12: Story = { args: { partySize: 12 } }
export const NotifyOnClosedSlot: Story = { args: { notified: ['2026-12-18T23:00:00.000Z'] } }
export const Skyline14: Story = { args: { venue: 'skyline', partySize: 8 } }
