import type { Meta, StoryObj } from '@storybook/react-vite'
import { TemplateCatalogue } from './TemplateCatalogue'

const meta = {
  title: 'WhatsApp/Template Catalogue',
  component: TemplateCatalogue,
  parameters: {
    frame: 'none',
    docs: {
      description: {
        component:
          'Every WhatsApp message: name, category, language, variables, buttons, trigger and approximate Ghana cost. Costs come from the third-party copy of Meta’s rate card in whatsapp.md and are **unverified** until checked against Meta’s CSV.',
      },
    },
  },
} satisfies Meta<typeof TemplateCatalogue>
export default meta
type Story = StoryObj<typeof meta>

export const AllTemplates: Story = {}
