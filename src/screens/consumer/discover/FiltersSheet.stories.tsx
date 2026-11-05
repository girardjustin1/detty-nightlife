import type { Meta, StoryObj } from '@storybook/react-vite'
import { FiltersSheet } from './FiltersSheet'

const meta = {
  title: 'Consumer/02 Discover/Filters',
  component: FiltersSheet,
  parameters: {
    docs: {
      description: {
        component:
          'Filters sheet over Discover (Resy availability sheet + SeatGeek filters). Date chips, party size 2/4/6/8/10+, genres, areas, a **price histogram** built from every ticket tier and table minimum in the fixtures (tap a bar to move the nearest handle), and three toggles. **Prices incl. fees** is on by default (fees shown up front). The CTA always shows the real match count, and turns into "No nights match" with a hint rather than an empty results page.',
      },
    },
  },
} satisfies Meta<typeof FiltersSheet>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Applied: Story = {
  args: { initial: { date: 'weekend', party: 6, genres: ['Amapiano', 'Afro House'], tablesAvailable: true } },
}
export const PickDates: Story = { args: { initial: { date: 'pick', range: ['2026-12-23', '2026-12-27'] } } }
export const PriceRange: Story = { args: { initial: { price: [0, 2], ticketsAvailable: true } } }
export const NoMatches: Story = { args: { initial: { date: 'tonight', areas: ['Labadi'], tablesAvailable: true } } }
