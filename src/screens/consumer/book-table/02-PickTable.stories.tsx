import type { Meta, StoryObj } from '@storybook/react-vite'
import { PickTable } from './PickTable'

const meta = {
  title: 'Consumer/06 Book a Table/Pick your table',
  component: PickTable,
  parameters: {
    docs: {
      description: {
        component:
          'Step 2 of 5. The interactive `FloorPlan` sits in a fixed-height viewport (zoom buttons; pinch on device) with a tier filter and legend; the list of free tables below stays in sync with the map. Sticky bar shows the pick, its minimum and what is due now (`tableQuote` on the minimum).',
      },
    },
  },
  args: { venue: 'vault' },
  argTypes: { venue: { control: 'inline-radio', options: ['vault', 'skyline', 'koko'] } },
} satisfies Meta<typeof PickTable>
export default meta
type Story = StoryObj<typeof meta>

export const NoSelection: Story = {}
export const Selected: Story = { args: { selectedId: 'B3' } }
export const OnlyOneLeft: Story = { args: { selectedId: 'B3', statuses: { B4: 'booked' } } }
export const Zoomed: Story = { args: { selectedId: 'B3', zoom: 2.5 } }
export const TheVault: Story = { args: { selectedId: 'B4' } }
export const Skyline14: Story = { args: { venue: 'skyline', selectedId: 'C2' } }
export const KokoSupperClub: Story = { args: { venue: 'koko', selectedId: 'S3' } }
