import type { Meta, StoryObj } from '@storybook/react-vite'
import { Guests } from './Guests'
import { guestSets } from './data'

const meta = {
  title: 'Consumer/06 Book a Table/Guests',
  component: Guests,
  parameters: {
    docs: {
      description: {
        component:
          'Step 4 of 5. Host plus open spots up to the table capacity; add from contacts, by phone, or **Share invite link on WhatsApp** (wa.me intent). Statuses: invited / accepted / declined. "Split the deposit" previews each share (deposit from `tableQuote`, host absorbs rounding).',
      },
    },
  },
} satisfies Meta<typeof Guests>
export default meta
type Story = StoryObj<typeof meta>

export const JustMe: Story = {}
export const PartiallyFilled: Story = { args: { guests: guestSets.partial } }
export const Full: Story = { args: { guests: guestSets.full } }
export const SplitOn: Story = { args: { guests: guestSets.partial, split: true } }
export const AddByPhone: Story = { args: { guests: guestSets.partial, addingPhone: true } }
