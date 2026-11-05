import type { Meta, StoryObj } from '@storybook/react-vite'
import { GuestPass } from './GuestPass'

const meta = {
  title: 'Consumer/09 Guests/Guest Pass',
  component: GuestPass,
  parameters: {
    docs: {
      description: {
        component: 'After accepting: the guest’s own rotating QR (saved for offline, still on the web page), the table on a cropped floor plan, arrival info and the host’s contact. The app is an optional upsell.',
      },
    },
  },
} satisfies Meta<typeof GuestPass>
export default meta
type Story = StoryObj<typeof meta>

export const SharePaid: Story = {}
export const HostCovered: Story = { args: { paid: false } }
