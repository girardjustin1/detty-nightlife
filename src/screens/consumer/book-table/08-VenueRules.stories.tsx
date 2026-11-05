import type { Meta, StoryObj } from '@storybook/react-vite'
import { Review } from './Review'

/** Shown over Review, after "Confirm & pay". */
const meta = {
  title: 'Consumer/06 Book a Table/Venue rules',
  component: Review,
  parameters: {
    docs: { description: { component: 'Resy "Are you sure?" sheet, only for venues with hard rules: age, ID, dress code, arrival cut-off. **I understand · pay** continues to Pay; **Go back** returns to Review.' } },
  },
  args: { rulesOpen: true },
} satisfies Meta<typeof Review>
export default meta
type Story = StoryObj<typeof meta>

export const TheVault: Story = {}
export const KokoSupperClub: Story = { args: { venue: 'koko', tableId: 'S3', lines: [] } }
