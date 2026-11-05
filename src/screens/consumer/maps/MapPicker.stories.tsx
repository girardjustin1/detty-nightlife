import type { Meta, StoryObj } from '@storybook/react-vite'
import { MapPicker } from '@/components/app/venue-map/MapPicker'
import { venueMaps } from '@/data/venueMaps'
import { eventById, venueById } from '@/data/fixtures'
import { dayShort, time } from '@/lib/format'

const ev = (id: string) => {
  const e = eventById(id)
  return { title: e.title, when: `${dayShort(e.startsAt)} · ${time(e.startsAt)}`, venue: venueById(e.venueId).name, photo: e.photo }
}

const meta = {
  title: 'Consumer/06 Book a Table/Map picker (SeatGeek style)',
  component: MapPicker,
  parameters: {
    docs: {
      description: {
        component:
          'New map direction: pick a table on a flat, SeatGeek-style map with price pins, 🔥 going-fast and price-rise tooltips, a synced list sorted by value, and a listing sheet (overview, value score, due now, best deal, similar tables).',
      },
    },
  },
  args: { map: venueMaps.vault, event: ev('afrobeats-til-dawn'), qty: 6 },
} satisfies Meta<typeof MapPicker>
export default meta
type Story = StoryObj<typeof meta>

export const TheVault: Story = {}
export const B3SelectedGoingFast: Story = { args: { selectedId: 'B3' } }
export const ZoomedOnB3: Story = { args: { selectedId: 'B3', initialZoom: 2 } }
export const AllTooltips: Story = { args: { callouts: 'all' } }
export const ListingSheetB3: Story = { args: { selectedId: 'B3', sheetOpen: true } }
export const ListingSheetPriceRise: Story = { args: { selectedId: 'H4', sheetOpen: true } }
export const Skyline14: Story = { args: { map: venueMaps.skyline, event: ev('sunset-sessions'), selectedId: 'C2' } }
export const KokoSupperClub: Story = { args: { map: venueMaps.koko, event: ev('highlife-champagne'), selectedId: 'S4', depositPct: 40 } }
