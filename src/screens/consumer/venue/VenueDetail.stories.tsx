import type { Meta, StoryObj } from '@storybook/react-vite'
import { VenueDetail } from './VenueDetail'

const meta = {
  title: 'Consumer/04 Venue/Venue detail',
  component: VenueDetail,
  parameters: {
    docs: {
      description: {
        component:
          'Club detail, structured like OpenTable: photo hero with **See all photos**, identity (rating, kind, area, price level, vibe tags), "Booked N times today" social proof, then **sticky anchor tabs — Tables · Events · Bottles · Reviews · Details** that scroll the page and highlight as you go. Tables shows the party/date pill, tier cards (min spend, capacity, deposit, perks, tables left, Notify when full) and a non-interactive floor-plan preview. Tidal Beach Club has no tables: the tab disappears, the bar menu replaces bottle pre-orders and the CTA becomes See events. The `section` stories open scrolled to each anchor.',
      },
    },
  },
} satisfies Meta<typeof VenueDetail>
export default meta
type Story = StoryObj<typeof meta>

export const TheVault: Story = { name: 'The Vault' }
export const Skyline14: Story = { name: 'Skyline 14', args: { venueId: 'skyline' } }
export const KokoSupperClub: Story = { name: 'Kòkò Supper Club', args: { venueId: 'koko' } }
export const TidalBeachClub: Story = { name: 'Tidal Beach Club (no tables)', args: { venueId: 'tidal' } }
export const SectionTables: Story = { name: 'Section · Tables', args: { section: 'tables' } }
export const SectionEvents: Story = { name: 'Section · Events', args: { section: 'events' } }
export const SectionBottles: Story = { name: 'Section · Bottles', args: { section: 'bottles' } }
export const SectionReviews: Story = { name: 'Section · Reviews', args: { section: 'reviews' } }
export const SectionDetails: Story = { name: 'Section · Details', args: { section: 'details' } }
export const LargeParty: Story = { name: 'Party of 10 (small tiers greyed)', args: { party: 10, section: 'tables' } }
export const NoUpcomingEvents: Story = { name: 'Kòkò · no events announced', args: { venueId: 'koko', section: 'events' } }
export const TidalSectionBar: Story = { name: 'Tidal · Bar menu', args: { venueId: 'tidal', section: 'bottles' } }
export const Loading: Story = { args: { loading: true } }
export const DataSaver: Story = { args: { network: 'slow' }, globals: { dataSaver: 'on' } }
