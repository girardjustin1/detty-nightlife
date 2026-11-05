import type { Meta, StoryObj } from '@storybook/react-vite'
import { SignIn } from './SignIn'

const meta = {
  title: 'Promoter/Sign-in',
  component: SignIn,
  parameters: {
    docs: {
      description: {
        component:
          'Partner app sign-in: phone number + one-time code on WhatsApp (SMS fallback), then a venue picker. Roles (Owner, Manager, Promoter, Door staff) are set by the venue owner and change what the app shows.',
      },
    },
  },
} satisfies Meta<typeof SignIn>
export default meta
type Story = StoryObj<typeof meta>

export const Phone: Story = {}
export const Sending: Story = { args: { sending: true } }
export const Code: Story = { args: { step: 'otp' } }
export const WrongCode: Story = { args: { step: 'otp', error: true } }
export const PickVenueAndRole: Story = { args: { step: 'venue' } }
