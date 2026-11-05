import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhotoGallery } from './PhotoGallery'

const meta = {
  title: 'Consumer/04 Venue/Photo gallery',
  component: PhotoGallery,
  parameters: {
    docs: {
      description: {
        component:
          '"See all photos" from the venue hero (OpenTable photo viewer). Category chips with counts (empty categories disabled), a two-column grid, and a full-screen viewer with "3 of 12", caption, venue-or-guest attribution and a thumbnail strip. With data saver on, every tile is a gradient until tapped.',
      },
    },
  },
} satisfies Meta<typeof PhotoGallery>
export default meta
type Story = StoryObj<typeof meta>

export const Grid: Story = {}
export const FilteredCrowd: Story = { args: { category: 'Crowd' } }
export const Viewer: Story = { args: { viewer: 2 } }
export const SkylineGrid: Story = { name: 'Skyline 14', args: { venueId: 'skyline' } }
export const DataSaver: Story = { globals: { dataSaver: 'on' } }
