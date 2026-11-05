import type { Meta, StoryObj } from '@storybook/react-vite'
import { TableUnavailable } from './TableUnavailable'

const meta = {
  title: 'Consumer/06 Book a Table/Table unavailable',
  component: TableUnavailable,
  parameters: {
    docs: { description: { component: 'Race condition: the table was paid for by someone else between pick and pay. Nothing charged; bottles and guests kept; closest free tables first (same tier, then smallest price change), with a Notify fallback.' } },
  },
} satisfies Meta<typeof TableUnavailable>
export default meta
type Story = StoryObj<typeof meta>

export const WithAlternatives: Story = {}
export const NoAlternatives: Story = { args: { statuses: { B4: 'booked', L1: 'booked', L3: 'booked' } } }
