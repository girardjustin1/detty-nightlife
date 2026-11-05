import type { Meta, StoryObj } from '@storybook/react-vite'
import { OtpThread } from './threads'

const meta = {
  title: 'WhatsApp/OTP Login',
  component: OtpThread,
  parameters: {
    docs: {
      description: { component: '`otp_login` **authentication** template. Body text is fixed by Meta; the only button a PWA can use is **Copy code** (one-tap and zero-tap autofill need a native Android app). SMS fallback after ~20 s or on a failed status. ~$0.0046 per message (Rest of Africa, unverified).' },
    },
  },
} satisfies Meta<typeof OtpThread>
export default meta
type Story = StoryObj<typeof meta>

export const CodeReceived: Story = {}
export const CodeCopied: Story = { args: { copied: true } }
