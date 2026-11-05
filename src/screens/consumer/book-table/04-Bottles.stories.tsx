import type { Meta, StoryObj } from '@storybook/react-vite'
import { canonicalTable } from '@/lib/pricing'
import { Bottles } from './Bottles'
import { overLines } from './data'

const meta = {
  title: 'Consumer/06 Book a Table/Bottles',
  component: Bottles,
  parameters: {
    docs: {
      description: {
        component:
          'Step 3 of 5. Packages row, category tabs that jump through one list, – n + steppers, showpiece badges. The `MinSpendMeter` sits above the CTA so it is always in thumb reach. "Decide later at the venue" is allowed: the deposit is still taken on the minimum.',
      },
    },
  },
} satisfies Meta<typeof Bottles>
export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}
export const Partway: Story = { args: { lines: canonicalTable.shortLines } }
export const MinimumMet: Story = { args: { lines: canonicalTable.lines } }
export const OverTheMinimum: Story = { args: { lines: overLines } }
export const DecideLaterAtTheVenue: Story = { args: { decideLater: true } }
