import { useState } from 'react'
import { Armchair, Check, Gift, MessageCircle, Plus, Search, Ticket, UserPlus } from 'lucide-react'
import { AppBar, Screen, Sheet } from '@/components/app/chrome'
import { Avatar, Button, Chip, ProgressBar, Segmented, Stepper, TextField, Toggle } from '@/components/ui/primitives'
import { cx, time } from '@/lib/format'
import { Label, PromoterTabBar, tight } from './PromoterChrome'
import type { ListGuest } from './promoterData'
import { compLists, guestList, staffById } from './promoterData'

export type GuestTab = 'attending' | 'pending' | 'no-show'

const inTab = (t: GuestTab, g: ListGuest) => (t === 'attending' ? g.status === 'attending' || g.status === 'checked-in' : g.status === t)

export function GuestList({ tab: initial = 'attending', adding, asPromoter }: { tab?: GuestTab; adding?: boolean; asPromoter?: boolean }) {
  const [tab, setTab] = useState<GuestTab>(initial)
  const me = staffById('p1')
  const all = asPromoter ? guestList.filter((g) => g.addedBy === me.name) : guestList
  const rows = all.filter((g) => inTab(tab, g))
  const n = (t: GuestTab) => all.filter((g) => inTab(t, g)).reduce((s, g) => s + 1 + g.plusOnes, 0)
  const comps = asPromoter ? compLists.filter((c) => c.promoterId === me.id) : compLists

  return (
    <Screen
      header={
        <div className="shrink-0 border-b border-line bg-bg">
          <AppBar
            title={asPromoter ? 'My guest list' : 'Guest list'}
            subtitle="Afrobeats Til Dawn · list closes 11pm"
            trailing={
              <button aria-label="Add guest" className="flex size-9 items-center justify-center rounded-full bg-accent text-on-accent">
                <Plus className="size-5" />
              </button>
            }
          />
          <div className="px-4 pb-2.5">
            <Segmented
              value={tab}
              onChange={setTab}
              options={(['attending', 'pending', 'no-show'] as GuestTab[]).map((t) => ({
                value: t,
                label: (
                  <>
                    {t === 'attending' ? 'Attending' : t === 'pending' ? 'Pending' : 'No-show'}
                    <span className="text-faint tabular-nums">{n(t)}</span>
                  </>
                ),
              }))}
            />
          </div>
          <div className="px-4 pb-2.5">
            <label className="flex h-10 items-center gap-2 rounded-control border border-line bg-surface px-3">
              <Search className="size-4 text-faint" />
              <input placeholder="Search guests" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-faint" />
            </label>
          </div>
        </div>
      }
      tabBar={<PromoterTabBar active={asPromoter ? 'more' : 'door'} />}
    >
      <Label action={!asPromoter && 'Manage'}>{asPromoter ? `Your comps · ${me.company}` : 'Promoter comp lists'}</Label>
      <div className="mx-4 divide-y divide-line rounded-card border border-line bg-surface">
        {comps.map((c) => {
          const p = staffById(c.promoterId)
          const full = c.used >= c.allowance
          return (
            <div key={c.promoterId} className="px-3 py-2.5">
              <div className="flex items-center gap-2 text-sm">
                <Avatar name={p.name} size={24} />
                <span className="min-w-0 flex-1 truncate">
                  <b>{p.name}</b> <span className="text-dim">· {p.company}</span>
                </span>
                <span className={cx('text-xs font-semibold tabular-nums', full ? 'text-warning' : 'text-dim')}>
                  {c.used}/{c.allowance} {full && '· full'}
                </span>
              </div>
              <ProgressBar value={c.used} max={c.allowance} tone={full ? 'warning' : 'accent'} className="mt-1.5 h-1.5" />
              <div className="mt-1 text-[11px] text-faint">{c.checkedIn} checked in so far</div>
            </div>
          )
        })}
      </div>

      <Label>{tab === 'attending' ? 'Attending' : tab === 'pending' ? 'Waiting on RSVP' : 'Didn’t show by close of list'}</Label>
      {rows.length === 0 ? (
        <div className="mx-4 rounded-card border border-line bg-surface p-6 text-center text-sm text-dim">Nobody here yet.</div>
      ) : (
        <ul className="mx-4 mb-6 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
          {rows.map((g) => (
            <li key={g.id} className="flex items-center gap-3 px-3 py-2.5">
              <Avatar name={g.name} size={34} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {g.name}
                  {g.plusOnes > 0 && <span className="text-dim"> +{g.plusOnes}</span>}
                </span>
                <span className="flex items-center gap-1 truncate text-xs text-dim">
                  {g.list === 'Table' ? <Armchair className="size-3" /> : g.list === 'Comp' ? <Gift className="size-3" /> : <Ticket className="size-3" />}
                  {g.list}
                  {g.table && ` ${g.table}`} · added by {g.addedBy.split(' ')[0]}
                </span>
              </span>
              {g.status === 'checked-in' ? (
                <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-success">
                  <Check className="size-4" />
                  In {g.at && time(g.at)}
                </span>
              ) : g.status === 'attending' ? (
                <span className="shrink-0 text-xs text-dim">Not in yet</span>
              ) : g.status === 'pending' ? (
                <Button size="sm" variant="secondary" className={cx(tight, 'shrink-0')} icon={<MessageCircle className="size-4" />}>
                  Nudge
                </Button>
              ) : (
                <span className="shrink-0 text-xs text-danger">No-show</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {adding && (
        <Sheet
          title="Add a guest"
          footer={
            <Button block size="lg" icon={<UserPlus className="size-5" />}>
              Add & send QR
            </Button>
          }
        >
          <div className="space-y-4 pb-2">
            <TextField label="Name" defaultValue="Kekeli Amedzro" />
            <TextField label="WhatsApp number" prefix="+233" defaultValue="24 555 0172" inputMode="tel" />
            <div>
              <span className="mb-1.5 block text-sm font-medium text-dim">List</span>
              <div className="flex gap-2">
                <Chip selected className="h-8 px-3 text-[13px]">
                  Comp (free entry)
                </Chip>
                <Chip className="h-8 px-3 text-[13px]">Door list (pays)</Chip>
              </div>
              <p className="mt-1.5 text-xs text-faint">Uses 1 of your 6 comps left tonight.</p>
            </div>
            <div className="flex items-center justify-between">
              <span>
                <span className="block text-sm font-medium">Plus-ones</span>
                <span className="block text-xs text-faint">Each +1 uses a comp</span>
              </span>
              <Stepper value={1} max={3} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span>
                <span className="block text-sm font-medium">Send QR on WhatsApp</span>
                <span className="block text-xs text-faint">Guest skips the list check at the door</span>
              </span>
              <Toggle checked label="Send QR on WhatsApp" />
            </div>
          </div>
        </Sheet>
      )}
    </Screen>
  )
}
