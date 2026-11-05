import type { Meta, StoryObj } from '@storybook/react-vite'
import { DepositReceiptThread } from './threads'

const meta = {
  title: 'WhatsApp/Deposit Receipt',
  component: DepositReceiptThread,
  parameters: {
    docs: {
      description: { component: '`deposit_receipt` **utility** template with a **document header** (the PDF receipt). Can be merged into `booking_confirmed` to save ~25% of utility spend per booking.' },
    },
  },
} satisfies Meta<typeof DepositReceiptThread>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
