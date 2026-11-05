import type { Meta, StoryObj } from '@storybook/react-vite'
import { Maintenance } from './Maintenance'

const meta = {
  title: 'Consumer/States/Maintenance',
  component: Maintenance,
  parameters: {
    docs: { description: { component: 'Planned downtime: a concrete back-by time, what is and isn’t affected, and a WhatsApp ping when booking reopens.' } },
  },
} satisfies Meta<typeof Maintenance>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
