import type { Meta, StoryObj } from '@storybook/react-vite'
import { Help } from './Help'

const meta = {
  title: 'Consumer/10 Profile/Help',
  component: Help,
  parameters: {
    docs: {
      description: {
        component: 'Search, “Chat with us on WhatsApp” (plus the venue host for tonight’s booking), an FAQ accordion, and Report an issue linked to a booking.',
      },
    },
  },
} satisfies Meta<typeof Help>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const FaqOpen: Story = { args: { openFaq: 2 } }
export const ReportIssue: Story = { args: { report: true } }
export const ReportSent: Story = { args: { reportSent: true } }
