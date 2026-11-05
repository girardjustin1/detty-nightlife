import type { Meta, StoryObj } from '@storybook/react-vite'
import { PromoterDailySummary } from './PromoterDailySummary'

const meta = {
  title: 'Emails/Promoter Daily Summary',
  component: PromoterDailySummary,
  parameters: {
    frame: 'email',
    docs: {
      description: {
        component:
          'For venue staff and promoters, sent at 4pm on event days. Tables booked out of the floor plan, guests expected, deposits paid, tables under minimum, held tables, and every reservation. Each row is priced with `tableQuote`. B3 is the canonical booking; the other hosts are fictional. Hosts’ names only; guest phone numbers stay in the door app.',
      },
    },
  },
} satisfies Meta<typeof PromoterDailySummary>
export default meta
type Story = StoryObj<typeof meta>

export const Tonight: Story = {}
