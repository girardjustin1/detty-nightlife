import type { Meta, StoryObj } from '@storybook/react-vite'
import { Armchair } from 'lucide-react'
import { Kpi, PartnerLogo, PromoterTabBar, StatusPill } from './PromoterChrome'

function Chrome() {
  return (
    <div style={{ maxWidth: 390 }} className="space-y-6">
      <PartnerLogo />
      <div className="grid grid-cols-2 gap-2">
        <Kpi icon={<Armchair className="size-3.5" />} label="Tables" value="8/13" sub="2 held · 3 free" progress={{ value: 8, max: 13 }} />
        <Kpi label="Collected online" value="₵32,039" sub="Table deposits + prepaid" />
      </div>
      <div className="flex flex-wrap gap-2">
        {(['arrived', 'booked', 'late', 'held', 'cancelled', 'no-show'] as const).map((s) => (
          <StatusPill key={s} status={s} />
        ))}
      </div>
      <PromoterTabBar active="tonight" badges={{ bookings: 3 }} />
    </div>
  )
}

const meta = {
  title: 'Promoter/Partner Chrome',
  component: Chrome,
  parameters: { frame: 'none', docs: { description: { component: 'Partner-app building blocks: logo + Partner tag, the five-tab `PromoterTabBar` (Tonight · Bookings · Door · Events · More), dense KPI tile and booking status pills.' } } },
} satisfies Meta<typeof Chrome>
export default meta
export const Default: StoryObj<typeof meta> = {}
