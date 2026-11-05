import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { venueMaps } from '@/data/venueMaps'
import { VenueMap } from './VenueMap'

type Args = { venue: keyof typeof venueMaps; selected?: string; callouts?: 'selected' | 'all' | 'none'; zoom?: number; theme?: 'light' | 'night' }

function Demo({ venue, selected, callouts = 'selected', zoom = 1, theme = 'light' }: Args) {
  const [sel, setSel] = useState(selected)
  const map = venueMaps[venue]
  return (
    <div style={{ width: 390 }} className="space-y-2">
      <VenueMap map={map} selectedId={sel} onSelect={(s) => setSel(s.id)} callouts={callouts} initialZoom={zoom} theme={theme} className="aspect-[4/5] rounded-card" />
      <div className="text-sm text-dim">Tap a pin or a shape · selected: {sel ?? '—'}</div>
    </div>
  )
}

const meta = {
  title: 'Components/Venue Map (SeatGeek style)',
  component: Demo,
  parameters: {
    frame: 'none',
    docs: {
      description: {
        component:
          'Flat, light venue map with price pins. Dot = value (green great value → red premium), 🔥 = going fast, black pill = selected, 💵 = general admission. Tooltips show "Going fast · N left" and coming price rises. Shapes are coloured by availability (sage open, grey sold, dashed held, blue selected). + / − zoom keeps pins the same size. Art: inline SVG with an id per table/section (~4–9 KB).',
      },
    },
  },
  args: { venue: 'vault', selected: 'B3' },
  argTypes: { venue: { control: 'inline-radio', options: Object.keys(venueMaps) }, theme: { control: 'inline-radio', options: ['light', 'night'] } },
} satisfies Meta<typeof Demo>
export default meta
type Story = StoryObj<typeof meta>

export const TheVault: Story = {}
export const AllTooltips: Story = { args: { callouts: 'all', selected: undefined } }
export const Zoomed: Story = { args: { zoom: 2 } }
export const Skyline14: Story = { args: { venue: 'skyline', selected: 'C2' } }
export const KokoSupperClub: Story = { args: { venue: 'koko', selected: 'S4' } }
export const TidalBeachGA: Story = { args: { venue: 'tidal', selected: 'ga-sand' } }
export const ArenaConcert: Story = { args: { venue: 'arena', selected: 'F3' } }
export const ArenaAllTooltips: Story = { args: { venue: 'arena', selected: undefined, callouts: 'all' } }
export const NightTheme: Story = { args: { theme: 'night' } }
export const Thumbnails: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-3" style={{ width: 390 }}>
      {['B3', 'H2', 'L1', 'C2', 'S4', 'F3'].map((id, i) => {
        const map = [venueMaps.vault, venueMaps.vault, venueMaps.vault, venueMaps.skyline, venueMaps.koko, venueMaps.arena][i]
        return <VenueMap key={id + i} map={map} focusId={id} pins={false} zoomable={false} className="aspect-[4/3] rounded-control" />
      })}
    </div>
  ),
}
