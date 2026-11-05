import type { Meta, StoryObj } from '@storybook/react-vite'
import { DayOfMode } from './DayOfMode'

const meta = {
  title: 'Consumer/08 My Bookings/Day-of Mode',
  component: DayOfMode,
  parameters: {
    docs: {
      description: {
        component:
          'A lightweight booking screen for the night itself: QR first (saved for offline), the arrival cut-off countdown, Directions, Call host, and “Running late? Tell the venue” on WhatsApp. Turns amber under 30 minutes and red after the cut-off.',
      },
    },
  },
} satisfies Meta<typeof DayOfMode>
export default meta
type Story = StoryObj<typeof meta>

export const EarlyEvening: Story = { args: { now: '2026-12-18T21:05:00Z' } }
export const UnderThirtyMinutes: Story = {}
export const RunningLate: Story = { args: { now: '2026-12-18T23:20:00Z', lateSheet: true } }
export const PastCutOff: Story = { args: { now: '2026-12-18T23:41:00Z' } }
export const Offline: Story = { args: { network: 'offline' } }
