import type { Meta, StoryObj } from '@storybook/react-vite'
import { Broadcast } from './Broadcast'

const meta = {
  title: 'Promoter/Broadcast',
  component: Broadcast,
  parameters: {
    docs: {
      description: {
        component:
          'WhatsApp template broadcast to past guests who opted in to marketing. Pick a segment, fill the approved template’s variables, see a WhatsApp preview bubble, the audience size and an estimated cost (sample per-message rate in `VENUE_TERMS`).',
      },
    },
  },
} satisfies Meta<typeof Broadcast>
export default meta
type Story = StoryObj<typeof meta>

export const Compose: Story = {}
export const AllOptIns: Story = { args: { segment: 'all' } }
export const Sent: Story = { args: { state: 'sent' } }
