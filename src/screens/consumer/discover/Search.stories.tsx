import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from './Search'

const meta = {
  title: 'Consumer/02 Discover/Search',
  component: Search,
  parameters: {
    docs: {
      description: {
        component:
          'Search tab. Empty query shows **recent searches** and **trending** genres, DJs and venues. Typing groups results into **Artists / Events / Venues** with a scope chip row (counts per group). Venue rows carry tonight’s entry price so the list is decision-ready.',
      },
    },
  },
} satisfies Meta<typeof Search>
export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {}
export const ResultsArtist: Story = { args: { query: 'Kwesi' } }
export const ResultsArea: Story = { args: { query: 'Osu' } }
export const ResultsGenre: Story = { args: { query: 'Amapiano' } }
export const EventsOnly: Story = { args: { query: 'Amapiano', scope: 'events' } }
export const NoResults: Story = { args: { query: 'Jazz brunch' } }
export const NoRecentSearches: Story = { args: { recent: [] } }
export const Loading: Story = { args: { query: 'Nana', loading: true } }
export const SlowConnection: Story = { args: { query: 'Osu', network: 'slow' }, globals: { dataSaver: 'on' } }
