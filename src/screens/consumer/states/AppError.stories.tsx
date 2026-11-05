import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppError } from './AppError'

const meta = {
  title: 'Consumer/States/App error',
  component: AppError,
  parameters: {
    docs: {
      description: {
        component: 'App-wide error with retry. Says whose fault it is, reassures about double charges, gives a support reference and a WhatsApp way out.',
      },
    },
  },
} satisfies Meta<typeof AppError>
export default meta
type Story = StoryObj<typeof meta>

export const ServerError: Story = {}
export const Retrying: Story = { args: { retrying: true } }
export const Timeout: Story = { args: { kind: 'timeout' } }
