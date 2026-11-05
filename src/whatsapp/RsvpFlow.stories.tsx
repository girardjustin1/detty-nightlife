import type { Meta, StoryObj } from '@storybook/react-vite'
import { RsvpFlowThread } from './threads'

const meta = {
  title: 'WhatsApp/Flow RSVP to Paystack',
  component: RsvpFlowThread,
  parameters: {
    docs: {
      description: { component: 'A **WhatsApp Flow** mock (v2). Kojo taps *RSVP on WhatsApp* on the invite page, which opens `whatsappLink(\'RSVP K9QPZ\')` (booking number from `src/config/contact.ts`) and opens the 24h window; we reply with an interactive Flow message. The Flow collects RSVP, party size and arrival time (plus 21+ and a WhatsApp-updates opt-in), then **hands off to a Paystack payment link** in a CTA-URL message. **WhatsApp Pay isn’t available in Ghana** (only India, Brazil and Singapore), so payment can never complete inside the chat.' },
    },
  },
} satisfies Meta<typeof RsvpFlowThread>
export default meta
type Story = StoryObj<typeof meta>

export const Step1Invite: Story = { name: '1. Invite', args: { step: 'invite' } }
export const Step2FormSheet: Story = { name: '2. Form sheet', args: { step: 'form' } }
export const Step3Summary: Story = { name: '3. Summary', args: { step: 'summary' } }
export const Step4HandoffToPaystack: Story = { name: '4. Handoff to Paystack', args: { step: 'handoff' } }
