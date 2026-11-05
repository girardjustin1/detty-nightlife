import type { Meta, StoryObj } from '@storybook/react-vite'
import { CodeChannel } from './CodeChannel'

const meta = {
  title: 'Consumer/01 Onboarding/Code channel',
  component: CodeChannel,
  parameters: {
    docs: {
      description: {
        component:
          'Choose where the code goes. **WhatsApp first** (authentication template from the verified business account: arrives on Wi-Fi, no SIM signal needed), **SMS as the fallback**. If the number has no WhatsApp account, SMS becomes the primary button.',
      },
    },
  },
} satisfies Meta<typeof CodeChannel>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const SendingWhatsApp: Story = { args: { sending: 'whatsapp' } }
export const NotOnWhatsApp: Story = { args: { notOnWhatsApp: true } }
