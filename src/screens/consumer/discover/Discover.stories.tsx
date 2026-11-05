import type { Meta, StoryObj } from '@storybook/react-vite'
import { Discover } from './Discover'

const meta = {
  title: 'Consumer/02 Discover/Home',
  component: Discover,
  parameters: {
    docs: {
      description: {
        component:
          'Discover tab. Two views of the same nights: **Events** (SeatGeek-style posters, grouped by when) and **Clubs & lounges** (Resy-style venue cards with bookable table-tier chips; "Notify me" when a tier is full).',
      },
    },
  },
} satisfies Meta<typeof Discover>
export default meta
type Story = StoryObj<typeof meta>

export const Events: Story = {}
export const ClubsAndLounges: Story = { args: { view: 'venues' } }
export const FilteredAmapiano: Story = { args: { genre: 'Amapiano' } }
export const EmptyGenre: Story = { args: { genre: 'Gqom' } }
export const Loading: Story = { args: { loading: true } }
export const SlowConnection: Story = { args: { network: 'slow' }, globals: { dataSaver: 'on' } }
