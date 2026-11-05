import type { Meta, StoryObj } from '@storybook/react-vite'
import { LiteHome } from './LiteHome'

const meta = {
  title: 'Consumer/States/Lite home',
  component: LiteHome,
  parameters: {
    docs: {
      description: {
        component: 'Low-data “lite” home with data saver forced on: no images at all, a compact text list grouped by night, one line per event with the from-price.',
      },
    },
  },
} satisfies Meta<typeof LiteHome>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const SlowConnection: Story = { args: { slow: true } }
