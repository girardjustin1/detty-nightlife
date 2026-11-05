import type { Meta, StoryObj } from '@storybook/react-vite'
import { OccasionRequests } from './Occasion'

const meta = {
  title: 'Consumer/06 Book a Table/Occasion & requests',
  component: OccasionRequests,
  parameters: {
    docs: { description: { component: 'Optional step between Guests and Review. Occasion chips and a note for the host; skippable, and also available after booking (commit first, enrich later).' } },
  },
} satisfies Meta<typeof OccasionRequests>
export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}
export const Birthday: Story = { args: { occasion: 'Birthday', note: 'Kojo’s 30th! Please bring the Moët out with sparklers at midnight.' } }
export const Proposal: Story = { args: { occasion: 'Proposal' } }
