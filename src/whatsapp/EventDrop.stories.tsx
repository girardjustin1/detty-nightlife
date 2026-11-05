import type { Meta, StoryObj } from '@storybook/react-vite'
import { EventDropThread } from './threads'

const meta = {
  title: 'WhatsApp/Event Drop (Marketing)',
  component: EventDropThread,
  parameters: {
    docs: {
      description: { component: '`event_drop` **marketing** template with an **image header**, opt-in only ("Event drops & offers" is unticked by default). Opt-out footer plus a *Stop promotions* quick reply that only turns off marketing. ~$0.0259 per message (unverified); subject to Meta’s per-user marketing caps (error 131049).' },
    },
  },
} satisfies Meta<typeof EventDropThread>
export default meta
type Story = StoryObj<typeof meta>

export const Received: Story = {}
export const StoppedPromotions: Story = { args: { stopped: true } }
