import type { Meta, StoryObj } from '@storybook/react-vite'
import { PickTable } from './PickTable'

/** The sheet is shown over step 2, as it appears in the flow. */
const meta = {
  title: 'Consumer/06 Book a Table/Table detail',
  component: PickTable,
  parameters: {
    docs: {
      description: {
        component:
          'SeatGeek-style listing sheet: view-from-table photo (`Img`, data-saver aware), mini plan, seats, minimum, what is due now (deposit + fee from `tableQuote`), perks, arrival cut-off (`RULES.holdMinutesAfterDoors`), dress code, age, and **Select**.',
      },
    },
  },
  args: { venue: 'vault', selectedId: 'B3', detailOpen: true },
} satisfies Meta<typeof PickTable>
export default meta
type Story = StoryObj<typeof meta>

export const BoothB3: Story = {}
export const LoungeDeckL1: Story = { args: { selectedId: 'L1' } }
export const SkylineCabana: Story = { args: { venue: 'skyline', selectedId: 'C2' } }
export const KokoPrivateRoom: Story = { args: { venue: 'koko', selectedId: 'V1' } }
export const DataSaver: Story = { globals: { dataSaver: 'on' } }
