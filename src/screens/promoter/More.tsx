import type { ReactNode } from 'react'
import { ArrowRightLeft, ChartColumn, ChevronRight, CircleHelp, Inbox, ListChecks, LogOut, Megaphone, Store, Users, Wallet, Wine } from 'lucide-react'
import { Screen } from '@/components/app/chrome'
import { Avatar } from '@/components/ui/primitives'
import { BOOKING_WHATSAPP } from '@/config/contact'
import { useBrand } from '@/brands/BrandContext'
import { cx } from '@/lib/format'
import { Label, PromoterHeader, PromoterTabBar } from './PromoterChrome'
import type { Role } from './promoterData'
import { approvals, roles, signedInAs, staff, venue } from './promoterData'
import { RoleBadge } from './SignIn'

type Item = { icon: ReactNode; label: string; sub?: string; badge?: number; roles: Role[] }

const groups: { title: string; items: Item[] }[] = [
  {
    title: 'Tonight',
    items: [
      { icon: <ListChecks className="size-5" />, label: 'Guest list', sub: 'Attending, pending, comps', roles: ['owner', 'manager', 'promoter', 'door'] },
      { icon: <Inbox className="size-5" />, label: 'Approvals', sub: 'Large parties & concierge', badge: approvals.length, roles: ['owner', 'manager'] },
    ],
  },
  {
    title: 'Venue',
    items: [
      { icon: <Wine className="size-5" />, label: 'Inventory & pricing', sub: 'Table tiers, bottle menu', roles: ['owner', 'manager'] },
      { icon: <Wallet className="size-5" />, label: 'Payouts & reports', sub: 'Settled, pending, commission', roles: ['owner', 'manager'] },
      { icon: <ChartColumn className="size-5" />, label: 'My commission', sub: 'Tables and tickets from your link', roles: ['promoter'] },
      { icon: <Megaphone className="size-5" />, label: 'Broadcast', sub: 'WhatsApp to opted-in guests', roles: ['owner', 'manager', 'promoter'] },
      { icon: <Users className="size-5" />, label: 'Staff & roles', sub: `${staff.length} people`, roles: ['owner', 'manager'] },
      { icon: <Store className="size-5" />, label: 'Venue profile', sub: 'Photos, hours, floor plan', roles: ['owner', 'manager'] },
    ],
  },
  {
    title: 'Account',
    items: [
      { icon: <ArrowRightLeft className="size-5" />, label: 'Switch venue', roles: ['owner', 'manager', 'promoter', 'door'] },
      { icon: <CircleHelp className="size-5" />, label: 'Partner support on WhatsApp', sub: 'BRAND_WHATSAPP', roles: ['owner', 'manager', 'promoter', 'door'] },
    ],
  },
]

export function More({ role = 'manager' }: { role?: Role }) {
  const person = role === 'manager' ? signedInAs : staff.find((s) => s.role === role)!
  const brand = useBrand()
  return (
    <Screen header={<PromoterHeader title="More" night={false} />} tabBar={<PromoterTabBar active="more" badges={{ bookings: role === 'door' ? 0 : approvals.length }} />}>
      <div className="mx-4 mt-3 flex items-center gap-3 rounded-card border border-line bg-surface p-3">
        <Avatar name={person.name} size={44} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{person.name}</div>
          <div className="truncate text-xs text-dim">
            {venue.name}
            {person.company && ` · ${person.company}`}
          </div>
        </div>
        <RoleBadge role={role} />
      </div>
      {role === 'door' && <p className="mx-4 mt-2 text-xs text-faint">Door staff see check-in and the guest list only. {roles.find((r) => r.id === 'door')!.cannot?.join(', ')} are hidden.</p>}
      {groups.map((g) => {
        const items = g.items.filter((i) => i.roles.includes(role))
        if (!items.length) return null
        return (
          <div key={g.title}>
            <Label>{g.title}</Label>
            <ul className="mx-4 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
              {items.map((i) => (
                <li key={i.label}>
                  <button className="flex w-full items-center gap-3 px-3 py-2.5 text-left">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-dim">{i.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{i.label}</span>
                      {i.sub && <span className="block truncate text-xs text-dim">{i.sub === 'BRAND_WHATSAPP' ? `${brand.name} · ${BOOKING_WHATSAPP.display}` : i.sub}</span>}
                    </span>
                    {!!i.badge && <span className="rounded-full bg-accent-3 px-1.5 text-[11px] font-bold text-white">{i.badge}</span>}
                    <ChevronRight className="size-4 text-faint" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
      <button className={cx('mx-4 mt-5 mb-8 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-control border border-line py-3 text-sm font-semibold text-danger')}>
        <LogOut className="size-4" /> Sign out
      </button>
    </Screen>
  )
}
