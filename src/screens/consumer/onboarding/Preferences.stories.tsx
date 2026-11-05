import type { Meta, StoryObj } from '@storybook/react-vite'
import { Preferences } from './Preferences'

const meta = {
  title: 'Consumer/01 Onboarding/Preferences',
  component: Preferences,
  parameters: {
    docs: {
      description: {
        component: 'Skippable. Genres and areas order Discover; the two toggles (WhatsApp booking updates, data saver) are the same ones in Account & privacy.',
      },
    },
  },
} satisfies Meta<typeof Preferences>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Picked: Story = { args: { genres: ['Afrobeats', 'Amapiano', 'Highlife'], areas: ['Osu', 'East Legon'], dataSaver: true } }
