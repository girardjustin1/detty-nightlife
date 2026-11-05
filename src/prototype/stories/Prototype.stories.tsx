import type { Meta, StoryObj } from '@storybook/react-vite'
import { Prototype } from '../Prototype'

const meta = {
  title: 'Prototype/Click-through',
  component: Prototype,
  parameters: {
    docs: {
      description: {
        component:
          'Clickable prototype: a menu of four ways to book the same night — **WhatsApp menu bot**, **WhatsApp Flows**, **WhatsApp AI concierge** and the **consumer app** — all prefilled; tap what glows. For the full-screen version with the tap counter and "Jump to" panel, run `pnpm dev` and open http://localhost:5330 (or the same URL on your phone over Wi-Fi).',
      },
    },
  },
  args: { embedded: true },
} satisfies Meta<typeof Prototype>
export default meta
type Story = StoryObj<typeof meta>

export const Menu: Story = {}
export const MenuDettyGold: Story = { args: { initialBrand: 'gold' } }
