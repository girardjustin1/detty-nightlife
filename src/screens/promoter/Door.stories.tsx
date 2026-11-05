import type { Meta, StoryObj } from '@storybook/react-vite'
import { Door } from './Door'

const meta = {
  title: 'Promoter/Door',
  component: Door,
  parameters: {
    docs: {
      description: {
        component:
          'Door check-in, signed in as door staff (no money shown). **List | Scan** toggle (Luma / Meetup). Scanner mock with a framing reticle; result cards for valid (with "Party 4 of 6 in"), already scanned (Posh-style "Scanned at 10:01pm by Kofi") and invalid / wrong night. List mode: search and manual check-in with an undo toast and an undo confirm (Partiful). Offline: scans are saved on the phone and sync later.',
      },
    },
  },
} satisfies Meta<typeof Door>
export default meta
type Story = StoryObj<typeof meta>

export const Scanning: Story = {}
export const ValidTable: Story = { name: 'Valid · party 4 of 6', args: { result: 'valid' } }
export const ValidTicket: Story = { args: { result: 'validTicket' } }
export const AlreadyScanned: Story = { args: { result: 'already' } }
export const WrongNight: Story = { args: { result: 'wrongNight' } }
export const NotRecognised: Story = { args: { result: 'notFound' } }
export const OfflineScan: Story = { name: 'Offline · scans saved', args: { offline: true, result: 'valid' } }
export const List: Story = { args: { mode: 'list' } }
export const ListCheckedInUndo: Story = { name: 'List · checked in (undo toast)', args: { mode: 'list', justCheckedIn: 'gl7' } }
export const ListUndoConfirm: Story = { name: 'List · undo confirm', args: { mode: 'list', justCheckedIn: 'gl7', confirmUndo: true } }
export const ListSearch: Story = { args: { mode: 'list', query: 'ko' } }
export const ListOffline: Story = { args: { mode: 'list', offline: true } }
