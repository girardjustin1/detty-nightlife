import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProfileHome } from './ProfileHome'

const meta = {
  title: 'Consumer/10 Profile/Profile home',
  component: ProfileHome,
  parameters: {
    docs: {
      description: {
        component: 'Profile tab (Resy Account pattern): avatar and verified phone, the next booking with a one-tap QR, saved nights and venues, the Notify list, and the way into settings.',
      },
    },
  },
} satisfies Meta<typeof ProfileHome>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const NewUser: Story = { args: { newUser: true } }
export const DataSaver: Story = { globals: { dataSaver: 'on' } }
