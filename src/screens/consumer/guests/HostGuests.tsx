import { Check, Crown, Ellipsis, MessageCircle, Repeat, UserMinus, UserPlus, X } from 'lucide-react'
import { AppBar, BottomBar, Screen, Sheet } from '@/components/app/chrome'
import { Avatar, Badge, Button, Card, IconButton, ProgressBar } from '@/components/ui/primitives'
import { cedis, cx, dayShort } from '@/lib/format'
import type { HostGuestRow } from '../bookings/bookingData'
import { hostGuestRows, inviteBooking, inviteEvent, inviteSplit, inviteTier, plusOneRequests } from './guestData'

export type HostSheet = 'none' | 'menu' | 'remove' | 'swap'

function StateTag({ g }: { g: HostGuestRow }) {
  switch (g.state) {
    case 'host':
      return (
        <Badge tone="accent">
          <Crown className="size-3" /> Host
        </Badge>
      )
    case 'paid':
      return (
        <Badge tone="success">
          <Check className="size-3" /> Paid {cedis(g.paid ?? 0)}
        </Badge>
      )
    case 'covered':
      return <Badge tone="neutral">Covered by you</Badge>
    case 'pending':
      return <Badge tone="warning">Pending</Badge>
    case 'invited':
      return <Badge tone="neutral">Invited</Badge>
    case 'declined':
      return <Badge tone="danger">Declined</Badge>
  }
}

export function HostGuests({ sheet = 'none', target = 'g4', allPaid, nudged }: { sheet?: HostSheet; target?: string; allPaid?: boolean; nudged?: boolean }) {
  const s = inviteSplit
  const rows: HostGuestRow[] = allPaid
    ? hostGuestRows.map((g) => (g.state === 'host' ? g : { ...g, state: 'paid', paid: s.share, note: 'Paid by MoMo' }))
    : hostGuestRows
  const target$ = s.guestsTarget
  const putDown = s.quote.dueNow - s.hostShare
  const newHost = rows.find((g) => g.state === 'paid')!.name.split(' ')[0]
  const collected = rows.reduce((sum, g) => sum + (g.state === 'paid' ? (g.paid ?? 0) : 0), 0)
  const count = (st: HostGuestRow['state']) => rows.filter((g) => g.state === st).length
  const toNudge = rows.filter((g) => g.state === 'invited' || g.state === 'pending')
  const freeSeats = inviteBooking.partySize - rows.filter((g) => g.state !== 'declined').length
  const t = rows.find((g) => g.id === target)!
  const first = t.name.split(' ')[0]

  return (
    <Screen
      header={
        <AppBar
          title="Guests"
          subtitle={`${inviteTier.name} ${inviteBooking.tableId} · ${dayShort(inviteEvent.startsAt)}`}
          trailing={
            <IconButton label="Invite more">
              <UserPlus className="size-5" />
            </IconButton>
          }
        />
      }
      footer={
        toNudge.length > 0 && !allPaid ? (
          <BottomBar>
            <Button variant="whatsapp" block size="lg" icon={<MessageCircle className="size-5" />}>
              {nudged ? 'Nudged · send again in 2h' : `Nudge ${toNudge.length} on WhatsApp`}
            </Button>
          </BottomBar>
        ) : undefined
      }
    >
      <div className="px-5 pt-2 pb-8">
        {/* Collection (Wise-style) */}
        <Card className="p-4">
          <div className="text-sm text-dim">{allPaid ? 'Everyone’s paid' : 'Shares collected'}</div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="display text-3xl tabular-nums">{cedis(collected)}</span>
            <span className="text-dim">of {cedis(target$)}</span>
          </div>
          <ProgressBar value={collected} max={target$} tone="success" className="mt-3 h-2.5" />
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-dim">
            <span>
              <b className="text-success">{count('paid')}</b> paid
            </span>
            <span>
              <b className="text-warning">{count('pending')}</b> pending
            </span>
            <span>
              <b className="text-text">{count('invited')}</b> invited
            </span>
            <span>
              <b className="text-danger">{count('declined')}</b> declined
            </span>
          </div>
          <div className="mt-3 border-t border-line pt-3 text-xs text-dim">
            {cedis(s.share)} each · {cedis(s.total)} split {inviteBooking.partySize} ways. Shares pay off the {cedis(s.quote.balanceAtVenue)} balance, then pay you back the extra {cedis(putDown)} you put down.{' '}
            <button className="font-semibold text-accent">Change split</button>
          </div>
        </Card>

        {/* +1 requests */}
        {!allPaid &&
          plusOneRequests.map((p) => (
            <div key={p.id} className="mt-3 flex items-center gap-3 rounded-card border border-accent/50 bg-surface p-3.5">
              <Avatar name={p.name} size={40} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">
                  {p.via.split(' ')[0]} wants to bring {p.name.split(' ')[0]}
                </div>
                <div className="text-xs text-dim">
                  +1 request · {freeSeats > 0 ? `${freeSeats} seat free` : 'table is full'}
                </div>
              </div>
              <IconButton label={`Decline ${p.name}`}>
                <X className="size-5" />
              </IconButton>
              <IconButton label={`Approve ${p.name}`} className="bg-success text-bg">
                <Check className="size-5" />
              </IconButton>
            </div>
          ))}

        {/* Guest rows */}
        <ul className="mt-4 divide-y divide-line">
          {rows.map((g) => (
            <li key={g.id} className={cx('flex items-center gap-3 py-3', g.state === 'declined' && 'opacity-60')}>
              <Avatar name={g.name} size={40} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">
                  {g.name}
                  {g.state === 'host' && <span className="text-dim"> (you)</span>}
                </div>
                <div className="truncate text-xs text-dim">{g.note}</div>
                <div className="mt-1">
                  <StateTag g={g} />
                </div>
              </div>
              {(g.state === 'invited' || g.state === 'pending') && (
                <Button variant="secondary" size="sm" icon={<MessageCircle className="size-4" />}>
                  Nudge
                </Button>
              )}
              {g.state !== 'host' && (
                <IconButton label={`More for ${g.name}`} tone="plain" className="-mr-2">
                  <Ellipsis className="size-5 text-dim" />
                </IconButton>
              )}
            </li>
          ))}
        </ul>

        <button className="mt-2 flex w-full items-center gap-3 rounded-card border border-line p-3.5 text-left">
          <Repeat className="size-5 text-dim" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Swap the host</span>
            <span className="block text-xs text-dim">Can’t make it? Hand the table and host QR to a friend.</span>
          </span>
        </button>
      </div>

      {sheet === 'menu' && (
        <Sheet title={t.name} onClose={() => {}}>
          <div className="divide-y divide-line">
            {[
              { icon: <MessageCircle className="size-5" />, label: 'Nudge on WhatsApp', sub: 'Sends the link again with a friendly reminder' },
              { icon: <Check className="size-5" />, label: 'I’ll cover their share', sub: `They come free; ${cedis(s.share)} is added to your balance at the venue` },
              { icon: <Crown className="size-5" />, label: 'Make them the host', sub: 'They get the host QR' },
            ].map((a) => (
              <button key={a.label} className="flex w-full items-center gap-3 py-3.5 text-left">
                <span className="flex size-10 items-center justify-center rounded-full bg-surface-2 text-dim">{a.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{a.label}</span>
                  <span className="block text-sm text-dim">{a.sub}</span>
                </span>
              </button>
            ))}
            <button className="flex w-full items-center gap-3 py-3.5 text-left text-danger">
              <span className="flex size-10 items-center justify-center rounded-full bg-danger/10">
                <UserMinus className="size-5" />
              </span>
              <span className="font-medium">Remove from table</span>
            </button>
          </div>
        </Sheet>
      )}

      {sheet === 'remove' && (
        <Sheet
          title={`Remove ${first}?`}
          onClose={() => {}}
          footer={
            <div className="space-y-2">
              <Button variant="danger" block size="lg">
                Remove {first}
              </Button>
              <Button variant="ghost" block>
                Keep {first}
              </Button>
            </div>
          }
        >
          <div className="flex items-center gap-3 rounded-card bg-surface-2 p-3">
            <Avatar name={t.name} size={44} />
            <div>
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-dim">{t.note}</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-dim">
            Their invite link and pass stop working, and the seat opens up for someone else.{' '}
            {t.state === 'paid' ? `Their ${cedis(t.paid ?? 0)} share is refunded to them in 1–3 days.` : 'They haven’t paid, so there’s nothing to refund.'} We don’t message them unless you choose to.
          </p>
        </Sheet>
      )}

      {sheet === 'swap' && (
        <Sheet
          title="Swap the host"
          onClose={() => {}}
          footer={
            <Button block size="lg">
              Make {newHost} the host
            </Button>
          }
        >
          <p className="text-sm text-dim">The new host gets the host QR and manages guests. You stay on the list as a guest. Your deposit and the booking stay in your name, so refunds still come to you.</p>
          <ul className="mt-3 divide-y divide-line">
            {rows
              .filter((g) => g.state === 'paid' || g.state === 'pending')
              .map((g, i) => (
                <li key={g.id} className="flex items-center gap-3 py-3">
                  <Avatar name={g.name} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{g.name}</div>
                    <div className="text-xs text-dim">{g.state === 'paid' ? 'Paid their share' : 'Accepted'}</div>
                  </div>
                  <span className={cx('flex size-6 items-center justify-center rounded-full border-2', i === 0 ? 'border-accent bg-accent text-on-accent' : 'border-line')}>
                    {i === 0 && <Check className="size-3.5" />}
                  </span>
                </li>
              ))}
          </ul>
          <p className="mt-2 text-xs text-faint">Only guests who accepted can become host. {newHost} gets a WhatsApp message to confirm.</p>
        </Sheet>
      )}
    </Screen>
  )
}
