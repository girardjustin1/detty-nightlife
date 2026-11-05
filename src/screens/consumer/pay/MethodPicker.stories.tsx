import type { Meta, StoryObj } from '@storybook/react-vite'
import { MethodPicker } from './MethodPicker'
import { tablePay } from './payData'

const meta = {
  title: 'Consumer/07 Pay/Method Picker',
  component: MethodPicker,
  parameters: {
    docs: {
      description: {
        component:
          'Shared pay step for tickets and tables (synthesis #27). Methods grouped as Mobile Money (saved numbers + add number), Card (3-D Secure note) and Bitcoin · Lightning (Beta). Amount due now is prominent; tables split it into "now" vs "at the venue". Failures show inline on the payment row (SeatGeek), never a modal.',
      },
    },
  },
} satisfies Meta<typeof MethodPicker>
export default meta
type Story = StoryObj<typeof meta>

export const Tickets: Story = {}
export const TableDeposit: Story = { args: { pay: tablePay(), showDetails: true } }
export const AddNumber: Story = { args: { addingNumber: true, newNumber: '+233 27 555 0199' } }
export const CardSelected: Story = { args: { pay: tablePay(), selected: 'card-1' } }
export const LightningSelected: Story = { args: { pay: tablePay(), selected: 'lightning' } }
export const ErrorDeclined: Story = { args: { error: 'declined' } }
export const ErrorInsufficientFunds: Story = { args: { pay: tablePay(), error: 'insufficient' } }
export const ErrorTimedOut: Story = { args: { error: 'timeout' } }
export const ErrorWrongPin: Story = { args: { error: 'wrong-pin' } }
export const ErrorCardDeclined: Story = { args: { pay: tablePay(), selected: 'card-1', error: 'card-declined' } }
