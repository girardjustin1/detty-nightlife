import { Check, Copy, Link, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useBrand } from '@/brands/BrandContext'
import { AppBar, BottomBar, Screen } from '@/components/app/chrome'
import { Avatar, Badge, Button, Card } from '@/components/ui/primitives'
import { cedis, cx, dayShort, time } from '@/lib/format'
import { contacts } from '../bookings/bookingData'
import { SearchField, waButtonClass, waShare } from '../bookings/parts'
import { hostGuestRows, inviteBooking, inviteEvent, inviteLink, inviteSplit, inviteTier, inviteVenue } from './guestData'

export function InviteMore({ selected: initial = [], query = '', copied }: { selected?: string[]; query?: string; copied?: boolean }) {
  const brand = useBrand()
  const [sel, setSel] = useState<string[]>(initial)
  const onList = new Set(hostGuestRows.filter((g) => g.state !== 'declined').map((g) => g.name))
  const seats = inviteBooking.partySize - onList.size
  const list = contacts.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => Number(onList.has(a.name)) - Number(onList.has(b.name)))
  const message = `Pull up! ${inviteTier.name} ${inviteBooking.tableId} at ${inviteVenue.name}, ${dayShort(inviteEvent.startsAt)} ${time(inviteEvent.startsAt)}. Your share is ${cedis(inviteSplit.share)} 🥂`
  const toggle = (n: string) => setSel((s) => (s.includes(n) ? s.filter((x) => x !== n) : s.length < seats ? [...s, n] : s))

  return (
    <Screen
      header={<AppBar title="Invite friends" subtitle={`${seats} seat${seats === 1 ? '' : 's'} open at ${inviteTier.name} ${inviteBooking.tableId}`} />}
      footer={
        <BottomBar>
          <Button variant="whatsapp" block size="lg" disabled={sel.length === 0} icon={<MessageCircle className="size-5" />}>
            {sel.length ? `Invite ${sel.length} on WhatsApp` : 'Pick who to invite'}
          </Button>
        </BottomBar>
      }
    >
      <div className="px-5 pt-2 pb-6">
        {/* Invite by link */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-surface-2 text-accent">
              <Link className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold">Invite by link</div>
              <div className="truncate text-sm text-dim">{inviteLink(brand.name)}</div>
            </div>
            <button className={cx('flex items-center gap-1 text-sm font-semibold', copied ? 'text-success' : 'text-accent')}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="mt-3 rounded-control bg-surface-2 p-3 text-sm text-dim">“{message}”</div>
          <a href={waShare(`${message} https://${inviteLink(brand.name)}`)} target="_blank" rel="noreferrer" className={`${waButtonClass} mt-3 h-11 text-[15px]`}>
            <MessageCircle className="size-5" /> Share on WhatsApp
          </a>
          <p className="mt-2 text-xs text-faint">Anyone with the link can ask to join. You approve each one, and the table can’t go over {inviteBooking.partySize}.</p>
        </Card>

        <div className="mt-6 mb-2 flex items-end justify-between">
          <h2 className="display text-lg">Contacts</h2>
          <span className="text-sm text-dim">
            {sel.length}/{seats} selected
          </span>
        </div>
        <SearchField placeholder="Search name or number" defaultValue={query} />
        <ul className="mt-2 divide-y divide-line">
          {list.map((c) => {
            const already = onList.has(c.name)
            const on = sel.includes(c.name)
            const full = !on && sel.length >= seats
            return (
              <li key={c.name}>
                <button disabled={already || full} onClick={() => toggle(c.name)} className="flex w-full items-center gap-3 py-3 text-left disabled:opacity-50">
                  <Avatar name={c.name} size={40} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{c.name}</span>
                    <span className="block truncate text-sm text-dim">{already ? 'Already on the list' : c.phone}</span>
                  </span>
                  {c.onApp && !already && <Badge tone="neutral">On {brand.name}</Badge>}
                  {!already && (
                    <span className={cx('flex size-6 shrink-0 items-center justify-center rounded-full border-2', on ? 'border-accent bg-accent text-on-accent' : 'border-line')}>
                      {on && <Check className="size-3.5" />}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
          {list.length === 0 && <li className="py-8 text-center text-sm text-dim">No one called “{query}”. Share the link instead.</li>}
        </ul>
      </div>
    </Screen>
  )
}
