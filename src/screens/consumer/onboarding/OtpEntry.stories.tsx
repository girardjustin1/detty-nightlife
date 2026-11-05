import type { Meta, StoryObj } from '@storybook/react-vite'
import { OtpEntry } from './OtpEntry'

const meta = {
  title: 'Consumer/01 Onboarding/OTP entry',
  component: OtpEntry,
  parameters: {
    docs: {
      description: {
        component:
          'Six boxes. The keyboard offers the code from WhatsApp or Messages; an inline error says how many tries are left; resend unlocks after a countdown; you can switch channel at any time.',
      },
    },
  },
} satisfies Meta<typeof OtpEntry>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Autofilled: Story = { args: { state: 'autofilled' } }
export const Verifying: Story = { args: { state: 'verifying' } }
export const WrongCode: Story = { args: { state: 'wrong' } }
export const ResendCountdown: Story = { name: 'Typing · resend countdown', args: { code: '482', resendIn: 24 } }
export const ResendAvailable: Story = { args: { resendIn: 0 } }
export const OpenWhatsAppHelper: Story = { args: { whatsAppHelper: true, resendIn: 52 }, name: 'Sent to WhatsApp — open WhatsApp' }
export const ViaSms: Story = { args: { channel: 'sms', resendIn: 30 } }
