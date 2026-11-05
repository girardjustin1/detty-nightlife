import type { Meta, StoryObj } from '@storybook/react-vite'
import { AccountPrivacy } from './AccountPrivacy'

const meta = {
  title: 'Consumer/10 Profile/Account & privacy',
  component: AccountPrivacy,
  parameters: {
    docs: {
      description: {
        component:
          'Verified phone, email, notification channels (WhatsApp updates vs app notifications vs promos), data saver, language (Twi placeholder), and account deletion with honest copy: **deleting does not cancel upcoming bookings**.',
      },
    },
  },
} satisfies Meta<typeof AccountPrivacy>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const NoEmail: Story = { args: { email: '' } }
export const DataSaverOn: Story = { args: { dataSaver: true }, globals: { dataSaver: 'on' } }
export const LanguageSheet: Story = { args: { sheet: 'language' } }
export const DeleteAccount: Story = { args: { sheet: 'delete' } }
