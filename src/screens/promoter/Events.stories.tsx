import type { Meta, StoryObj } from '@storybook/react-vite'
import { Events } from './Events'
import { CreateEvent } from './CreateEvent'

const meta = {
  title: 'Promoter/Events',
  component: Events,
  parameters: {
    docs: {
      description: {
        component:
          'The venue’s nights with ticket and table sales progress, a draft in progress, and a "Promote on WhatsApp" card (Status / Channel / link with promoter code). **Create event** is a five-step flow: basics, lineup & genres, ticket tiers, table inventory per tier (minimum + deposit, per-night overrides), publish.',
      },
    },
  },
} satisfies Meta<typeof Events>
export default meta
type Story = StoryObj<typeof meta>

export const List: Story = {}
export const Create1Basics: Story = { name: 'Create · 1 Basics', render: () => <CreateEvent step="basics" /> }
export const Create2Lineup: Story = { name: 'Create · 2 Lineup & genres', render: () => <CreateEvent step="lineup" /> }
export const Create3Tickets: Story = { name: 'Create · 3 Ticket tiers', render: () => <CreateEvent step="tickets" /> }
export const Create4Tables: Story = { name: 'Create · 4 Table inventory', render: () => <CreateEvent step="tables" /> }
export const Create5Publish: Story = { name: 'Create · 5 Publish', render: () => <CreateEvent step="publish" /> }
export const CreatePublished: Story = { name: 'Create · Published + share', render: () => <CreateEvent step="publish" published /> }
