import type { Meta, StoryObj } from '@storybook/react-vite'
import { TicketWallet } from './TicketWallet'

const meta = {
  title: 'Consumer/08 My Bookings/Ticket Wallet',
  component: TicketWallet,
  args: { rotate: false },
  parameters: {
    docs: {
      description: {
        component:
          'Ticket wallet. Eventbrite-style stub, Live Nation rotating code (“screenshots won’t get you in”), Posh action row (Transfer / Add to Wallet / Directions). Codes are cached on the phone, so it works with no signal at the door.',
      },
    },
  },
} satisfies Meta<typeof TicketWallet>
export default meta
type Story = StoryObj<typeof meta>

export const FirstTicket: Story = {}
export const SecondTicket: Story = { args: { index: 1 } }
export const TransferredTicket: Story = { args: { index: 1, transferredTo: 'Kojo Mensah' } }
export const Offline: Story = { args: { network: 'offline' }, globals: { dataSaver: 'on' } }
export const Rotating: Story = { args: { rotate: true } }
