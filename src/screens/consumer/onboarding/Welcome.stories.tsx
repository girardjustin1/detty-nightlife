import type { Meta, StoryObj } from '@storybook/react-vite'
import { Welcome } from './Welcome'

const meta = {
  title: 'Consumer/01 Onboarding/Welcome',
  component: Welcome,
  parameters: {
    docs: {
      description: {
        component:
          'First launch. **Stack** (default): headline first, key art as a dim crowd backdrop, and a fanned stack of real upcoming nights in the middle. **Poster**: the earlier full-bleed key art. Brand key art (via `Img`, so data saver shows the brand gradient instead), the logo, and `brand.copy.welcomeTitle` / `welcomeBody`. One way in: your phone number — the same flow logs you in or signs you up.',
      },
    },
  },
} satisfies Meta<typeof Welcome>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const DataSaver: Story = { globals: { dataSaver: 'on' } }
export const PosterOriginal: Story = { args: { variant: 'poster' } }
