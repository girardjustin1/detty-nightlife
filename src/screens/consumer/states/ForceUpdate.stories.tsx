import type { Meta, StoryObj } from '@storybook/react-vite'
import { ForceUpdate } from './ForceUpdate'

const meta = {
  title: 'Consumer/States/Update prompt',
  component: ForceUpdate,
  parameters: {
    docs: {
      description: {
        component: '`required` blocks booking (but tickets still open); `optional` can be dismissed. Download size is shown for people on mobile data.',
      },
    },
  },
} satisfies Meta<typeof ForceUpdate>
export default meta
type Story = StoryObj<typeof meta>

export const Required: Story = {}
export const Optional: Story = { args: { mode: 'optional' } }
