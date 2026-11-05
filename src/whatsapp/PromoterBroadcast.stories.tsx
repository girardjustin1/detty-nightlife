import type { Meta, StoryObj } from '@storybook/react-vite'
import { PromoterBroadcastThread } from './threads'

const meta = {
  title: 'WhatsApp/Promoter Broadcast',
  component: PromoterBroadcastThread,
  parameters: {
    docs: {
      description: { component: 'A promoter broadcast as **received by a guest** (Efua): a `promoter_broadcast` **marketing** template sent from our number on The Vault’s behalf, only to past guests who opted in to offers. *Stop promotions* turns off promotions from that venue; booking updates continue.' },
    },
  },
} satisfies Meta<typeof PromoterBroadcastThread>
export default meta
type Story = StoryObj<typeof meta>

export const Received: Story = {}
export const StoppedPromotions: Story = { args: { stopped: true } }
