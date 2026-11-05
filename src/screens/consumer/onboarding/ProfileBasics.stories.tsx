import type { Meta, StoryObj } from '@storybook/react-vite'
import { me } from '@/data/fixtures'
import { ProfileBasics } from './ProfileBasics'

const meta = {
  title: 'Consumer/01 Onboarding/Profile basics',
  component: ProfileBasics,
  parameters: {
    docs: {
      description: {
        component:
          'Name (as on ID), date of birth with an age-gate explainer (most venues 21+, beach events 18+), optional email for receipts. Age is checked against the prototype’s “now” (18 Dec 2026).',
      },
    },
  },
} satisfies Meta<typeof ProfileBasics>
export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}
export const Filled21Plus: Story = { name: 'Filled · 21+', args: { name: me.name, dob: { day: '14', month: '03', year: '1998' }, email: me.email } }
export const Age18To20: Story = { name: 'Age 18–20', args: { name: 'Esi Mensah', dob: { day: '02', month: '07', year: '2006' } } }
export const Under18: Story = { name: 'Under 18 (blocked)', args: { name: 'Kofi Asare', dob: { day: '30', month: '01', year: '2010' } } }
export const InvalidEmail: Story = { args: { name: me.name, dob: { day: '14', month: '03', year: '1998' }, email: 'ama.owusu@', emailError: 'That email looks incomplete. Leave it empty if you’d rather not add one.' } }
