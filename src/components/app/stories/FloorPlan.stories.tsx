import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { FloorLegend, FloorPlan } from '../FloorPlan'
import { floorPlans } from '@/data/floorplans'
import { tableTiers } from '@/data/fixtures'
import type { FloorPlanId } from '@/data/types'

function Demo({ venue, mode }: { venue: FloorPlanId; mode?: 'consumer' | 'promoter' }) {
  const [sel, setSel] = useState<string>()
  return (
    <div style={{ maxWidth: 380 }} className="space-y-3">
      <FloorPlan plan={floorPlans[venue]} tiers={tableTiers[venue]} selectedId={sel} onSelect={(t) => setSel(t.id)} mode={mode} />
      <FloorLegend mode={mode} />
      <div className="text-sm text-dim">Selected: {sel ?? '—'} (tap an available table)</div>
    </div>
  )
}

const meta = {
  title: 'Components/Floor Plan',
  component: Demo,
  parameters: {
    frame: 'none',
    docs: {
      description: {
        component:
          'Interactive table map. Artwork: Higgsfield-generated SVG (10–20 KB) as a single background image. Tables: vector hit targets in code (status, selection, tier filter, keyboard support). Promoter mode reuses it with arrival statuses.',
      },
    },
  },
  args: { venue: 'vault' },
  argTypes: { venue: { control: 'inline-radio', options: ['vault', 'skyline', 'koko'] } },
} satisfies Meta<typeof Demo>
export default meta
type Story = StoryObj<typeof meta>

export const TheVaultNightclub: Story = {}
export const Skyline14Rooftop: Story = { args: { venue: 'skyline' } }
export const KokoSupperClub: Story = { args: { venue: 'koko' } }
