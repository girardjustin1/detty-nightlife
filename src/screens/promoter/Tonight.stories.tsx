import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tonight } from './Tonight'

const meta = {
  title: 'Promoter/Tonight',
  component: Tonight,
  parameters: {
    docs: {
      description: {
        component:
          'Tonight dashboard for The Vault · Afrobeats Til Dawn at 11:15pm. KPIs are computed from the promoter fixtures and `tableQuote()`, so they match the consumer booking screens. Alerts: a late table near its release time (doors + `RULES.holdMinutesAfterDoors`), a pending large-party approval and a failed MoMo deposit.',
      },
    },
  },
} satisfies Meta<typeof Tonight>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const AllClear: Story = { args: { noAlerts: true } }
export const Loading: Story = { args: { loading: true } }
export const Offline: Story = { args: { offline: true } }
