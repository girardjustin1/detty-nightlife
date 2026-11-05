import type { Meta, StoryObj } from '@storybook/react-vite'
import { GenreLanding } from './GenreLanding'

const meta = {
  title: 'Consumer/02 Discover/Genre landing',
  component: GenreLanding,
  parameters: {
    docs: {
      description: {
        component:
          'One genre in one city ("Amapiano in Accra"). Reached from genre chips on Discover and Search. Upcoming nights, DJs playing them, the rooms that play the genre (with tonight’s price), and a **WhatsApp alerts** CTA that doubles as the empty state when nothing is listed.',
      },
    },
  },
} satisfies Meta<typeof GenreLanding>
export default meta
type Story = StoryObj<typeof meta>

export const Amapiano: Story = {}
export const Highlife: Story = { args: { genre: 'Highlife' } }
export const AlertsOn: Story = { args: { alertsOn: true } }
export const NoNightsListed: Story = { args: { genre: 'R&B' } }
export const Loading: Story = { args: { loading: true } }
