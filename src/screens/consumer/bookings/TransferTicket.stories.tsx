import type { Meta, StoryObj } from '@storybook/react-vite'
import { TransferTicket } from './TransferTicket'

const meta = {
  title: 'Consumer/08 My Bookings/Transfer Ticket',
  component: TransferTicket,
  parameters: {
    docs: {
      description: {
        component:
          'Transfer one ticket (Posh has the entry row; the flow is ours). Type a number or pick a contact, confirm in a sheet that says what happens to both QRs, then a transferred state: “Kojo now has this ticket”. The recipient can open it on the web without the app.',
      },
    },
  },
} satisfies Meta<typeof TransferTicket>
export default meta
type Story = StoryObj<typeof meta>

export const PickContact: Story = {}
export const ContactSelected: Story = { args: { to: 'Kojo Mensah' } }
export const SearchNoMatch: Story = { args: { query: 'Selorm' } }
export const Confirm: Story = { args: { step: 'confirm', to: 'Kojo Mensah' } }
export const Transferred: Story = { args: { step: 'done', to: 'Kojo Mensah' } }
