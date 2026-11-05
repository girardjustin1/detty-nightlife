import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inventory } from './Inventory'

const meta = {
  title: 'Promoter/Inventory & Pricing',
  component: Inventory,
  parameters: {
    docs: {
      description: {
        component:
          'Table tiers (minimum spend, deposit %, capacity, which tables) with the booking rules from `RULES` in `src/lib/pricing.ts`, and the bottle menu with price, an in-stock toggle for tonight and a showpiece flag (arrives with sparklers / parade).',
      },
    },
  },
} satisfies Meta<typeof Inventory>
export default meta
type Story = StoryObj<typeof meta>

export const TableTiers: Story = {}
export const EditTier: Story = { args: { editing: 'booth' } }
export const BottleMenu: Story = { args: { tab: 'bottles' } }
export const BottleMenuChampagne: Story = { args: { tab: 'bottles', category: 'Champagne' } }
