import type { Meta, StoryObj } from '@storybook/react-vite'
import { MomoConfirm } from './MethodPicker'
import { MomoPending } from './MomoPending'
import { tablePay } from './payData'

const meta = {
  title: 'Consumer/07 Pay/MoMo',
  component: MomoPending,
  parameters: {
    docs: {
      description: {
        component:
          'Mobile Money flow (synthesis #28, new pattern): confirm number → "Approve on your phone" (live steps, draining countdown, missed-prompt help with the USSD code, resend, change method) → received. Timeouts and declines return to the picker with an inline row error. USSD paths are draft copy; confirm with each network.',
      },
    },
  },
} satisfies Meta<typeof MomoPending>
export default meta
type Story = StoryObj<typeof meta>

export const ConfirmNumber: Story = { render: () => <MomoConfirm /> }
export const ConfirmNumberTable: Story = { render: () => <MomoConfirm pay={tablePay()} /> }
export const PromptSent: Story = { args: { stage: 'sent', elapsed: 4 } }
export const EnterPin: Story = { args: { stage: 'pin', elapsed: 24 } }
export const DidntGetPrompt: Story = { args: { stage: 'pin', elapsed: 75, helpOpen: true } }
export const TelecelPending: Story = { args: { stage: 'pin', methodId: 'momo-2', pay: tablePay(), elapsed: 40, helpOpen: true } }
export const AlmostTimedOut: Story = { args: { stage: 'pin', elapsed: 165 } }
export const Approved: Story = { args: { stage: 'approved' } }
