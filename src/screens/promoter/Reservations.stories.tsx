import type { Meta, StoryObj } from '@storybook/react-vite'
import { Reservations } from './Reservations'
import { BookingDetail } from './BookingDetail'

const meta = {
  title: 'Promoter/Reservations',
  component: Reservations,
  parameters: {
    docs: {
      description: {
        component:
          'Bookings tab: filter by night and status, search by host, DTY reference or table. Rows show table, host, party, committed spend and payment state. The detail stories open booth B3 (Ama Owusu, the canonical consumer booking): timeline, bar prep checklist, guests and balance collection at the venue (MoMo / card / cash).',
      },
    },
  },
} satisfies Meta<typeof Reservations>
export default meta
type Story = StoryObj<typeof meta>

export const List: Story = {}
export const LateOnly: Story = { args: { filter: 'late' } }
export const Search: Story = { args: { query: 'owusu' } }
export const NoResults: Story = { args: { query: 'Mireku' } }
export const OtherNightEmpty: Story = { args: { night: 'hiplife-throwback' } }
export const Loading: Story = { args: { loading: true } }

export const Detail: Story = { render: () => <BookingDetail /> }
export const DetailRecordMoMo: Story = { name: 'Detail · record payment (MoMo)', render: () => <BookingDetail collect /> }
export const DetailRecordCash: Story = { name: 'Detail · record payment (cash)', render: () => <BookingDetail collect method="cash" /> }
export const DetailSettled: Story = { name: 'Detail · settled', render: () => <BookingDetail settled prepped={['moet', 'hennessy-vs', 'jameson', 'mixers', 'chichinga']} /> }
