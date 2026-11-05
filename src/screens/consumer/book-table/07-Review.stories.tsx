import type { Meta, StoryObj } from '@storybook/react-vite'
import { canonicalTable } from '@/lib/pricing'
import { Review } from './Review'

const meta = {
  title: 'Consumer/06 Book a Table/Review & commit',
  component: Review,
  parameters: {
    docs: {
      description: {
        component:
          'Step 5 of 5. **Policy first** with concrete dates, times and cedi amounts from `RULES.refund` against Fri 18 Dec 2026, 10pm (the 48-hour window has already passed at the prototype’s "now", so it is struck through). Then table, bottles, guests and the itemised `PriceLines`. The CTA opens the venue-rules sheet, then Pay.',
      },
    },
  },
} satisfies Meta<typeof Review>
export default meta
type Story = StoryObj<typeof meta>

export const Standard: Story = {}
export const MinimumNotMet: Story = { args: { lines: canonicalTable.shortLines } }
export const DecidingAtVenue: Story = { args: { lines: [] } }
export const PriceChangedSinceSelection: Story = { args: { priceChanged: true } }
export const HoldRunningLow: Story = { args: { holdSeconds: 74 } }
