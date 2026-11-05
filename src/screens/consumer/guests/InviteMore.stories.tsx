import type { Meta, StoryObj } from '@storybook/react-vite'
import { InviteMore } from './InviteMore'

const meta = {
  title: 'Consumer/09 Guests/Invite More',
  component: InviteMore,
  parameters: {
    docs: {
      description: {
        component:
          'Host: invite more. An “invite by link” card with a WhatsApp share and a pre-written message (WhatsApp first), then contacts with search. Selection is capped at the open seats; people already on the list are greyed out.',
      },
    },
  },
} satisfies Meta<typeof InviteMore>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const OneSelected: Story = { args: { selected: ['Abena Ofori'], copied: true } }
export const SearchNoMatch: Story = { args: { query: 'Selorm' } }
