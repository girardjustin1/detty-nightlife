import type { Meta, StoryObj } from '@storybook/react-vite'
import { AllReviews } from './AllReviews'

const meta = {
  title: 'Consumer/04 Venue/All reviews',
  component: AllReviews,
  parameters: {
    docs: {
      description: {
        component:
          'Full reviews page (OpenTable reviews). Overall score, 5-bar distribution and nightlife sub-ratings (**Music / Crowd / Service / Value**), sticky filter chips (With photos / Tables / Tickets) and a sort sheet (Most recent / Highest / Lowest). Cards show what the guest booked, per-review sub-ratings, photos, a helpful count and the venue’s reply.',
      },
    },
  },
} satisfies Meta<typeof AllReviews>
export default meta
type Story = StoryObj<typeof meta>

export const MostRecent: Story = {}
export const LowestFirst: Story = { args: { sort: 'lowest' } }
export const SortSheet: Story = { args: { sortSheet: true } }
export const WithPhotos: Story = { args: { filter: 'photos' } }
export const Skyline14: Story = { name: 'Skyline 14', args: { venueId: 'skyline' } }
export const NoMatches: Story = { name: 'Filter with no reviews', args: { venueId: 'tidal', filter: 'photos' } }
