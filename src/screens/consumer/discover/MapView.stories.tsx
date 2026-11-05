import type { Meta, StoryObj } from '@storybook/react-vite'
import { MapView } from './MapView'

const meta = {
  title: 'Consumer/02 Discover/Map',
  component: MapView,
  parameters: {
    docs: {
      description: {
        component:
          'Map view, toggled from Discover (Resy map search; OpenTable map + bottom card). **The map is a stylised SVG of Accra drawn from brand tokens — no map tiles.** A tiled map costs roughly 0.5–2 MB per session and fails on a dropped connection; this one is ~2 KB, ships with the app, renders instantly on 3G and still works offline. Directions hand off to the phone’s own maps app. Pins show tonight’s cheapest way in (ticket, else table minimum); the venue carousel at the bottom stays in sync with the selected pin.',
      },
    },
  },
} satisfies Meta<typeof MapView>
export default meta
type Story = StoryObj<typeof meta>

export const Tonight: Story = {}
export const SelectedRooftop: Story = { args: { selectedId: 'skyline' } }
export const TablesTonight: Story = { args: { tablesOnly: true, selectedId: 'koko' } }
export const EmptyArea: Story = { args: { tablesOnly: true, area: 'Labadi' } }
export const Offline: Story = { args: { network: 'offline' }, globals: { dataSaver: 'on' } }
