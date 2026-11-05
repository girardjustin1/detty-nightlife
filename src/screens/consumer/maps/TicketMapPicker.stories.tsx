import type { Meta, StoryObj } from '@storybook/react-vite'
import { MapPicker } from '@/components/app/venue-map/MapPicker'
import { arenaEvent, venueMaps } from '@/data/venueMaps'
import { eventById } from '@/data/fixtures'
import { dayShort, time } from '@/lib/format'

const tidal = eventById('tidal-beach-rave')

const meta = {
  title: 'Consumer/05 Book Tickets/Map picker (SeatGeek style)',
  component: MapPicker,
  parameters: {
    docs: { description: { component: 'Ticket version of the map picker: arena sections and GA zones priced per ticket incl. fees, with 🔥 and price-rise tooltips.' } },
  },
  args: { map: venueMaps.arena, event: { ...arenaEvent, photo: eventById('afrobeats-til-dawn').photo }, qty: 2 },
} satisfies Meta<typeof MapPicker>
export default meta
type Story = StoryObj<typeof meta>

export const Arena: Story = {}
export const ArenaFloorSelected: Story = { args: { selectedId: 'F3' } }
export const ArenaAllTooltips: Story = { args: { callouts: 'all' } }
export const ArenaListingSheet: Story = { args: { selectedId: 'F3', sheetOpen: true } }
export const TidalBeachGA: Story = { args: { map: venueMaps.tidal, event: { title: tidal.title, when: `${dayShort(tidal.startsAt)} · ${time(tidal.startsAt)}`, venue: 'Tidal Beach Club', photo: tidal.photo }, selectedId: 'ga-sand', qty: 3 } }
