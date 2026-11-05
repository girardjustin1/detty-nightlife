import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneEntry } from './PhoneEntry'

const meta = {
  title: 'Consumer/01 Onboarding/Phone entry',
  component: PhoneEntry,
  parameters: {
    docs: {
      description: {
        component:
          'One field for log-in **and** sign-up, defaulting to 🇬🇭 +233. Phone is primary (door check-in and Mobile Money both hang off it); Apple / Google are secondary buttons and still ask for a number afterwards.',
      },
    },
  },
} satisfies Meta<typeof PhoneEntry>
export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}
export const Filled: Story = { args: { number: '24 555 0142' } }
export const InvalidNumber: Story = { args: { number: '24 555', error: 'That’s too short — Ghana numbers have 9 digits after +233.' } }
export const Checking: Story = { args: { number: '24 555 0142', loading: true } }
export const CountryPicker: Story = { args: { pickerOpen: true } }
export const CountryPickerSearch: Story = { args: { pickerOpen: true, pickerQuery: 'united' } }
export const DiasporaNumber: Story = { args: { country: 'GB', number: '7700 900412' } }
