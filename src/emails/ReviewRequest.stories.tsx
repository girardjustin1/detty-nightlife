import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReviewRequest } from './ReviewRequest'

const meta = {
  title: 'Emails/Review Request',
  component: ReviewRequest,
  parameters: {
    frame: 'email',
    docs: {
      description: {
        component:
          'Email #13, sent T+12h to 24h. One-tap 1–5 rating links (each opens the review page with the score pre-filled). Not sent on WhatsApp: it’s marketing-adjacent and would be billed and categorised as marketing.',
      },
    },
  },
} satisfies Meta<typeof ReviewRequest>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
