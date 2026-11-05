import { useState } from 'react'
import { Contact, Info, Phone, UserPlus } from 'lucide-react'
import type { FloorPlanId, Guest } from '@/data/types'
import { BottomBar, Screen } from '@/components/app/chrome'
import { Avatar, Badge, Button, TextField, Toggle } from '@/components/ui/primitives'
import { canonicalTable, tableQuote, type Line } from '@/lib/pricing'
import { cedis, cx, dayShort, time } from '@/lib/format'
import { BookingHeader, ContextPill } from './shared'
import { HoldTimer } from './HoldTimer'
import { arrivalSlots, bookingCtx, guestSets, splitDeposit } from './data'

const statusBadge: Record<Guest['status'], { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' | 'accent' }> = {
  host: { label: 'Host', tone: 'accent' },
  accepted: { label: 'Accepted', tone: 'success' },
  invited: { label: 'Invited', tone: 'warning' },
  declined: { label: 'Declined', tone: 'danger' },
  'checked-in': { label: 'Checked in', tone: 'success' },
}

/** WhatsApp click-to-chat intent with a prefilled invite. Link domain is a placeholder. */
export const inviteLink = (venueName: string, eventTitle: string, when: string, table: string) =>
  `https://wa.me/?text=${encodeURIComponent(`Join my table at ${venueName} 🍾 ${eventTitle}, ${when}, table ${table}. Tap to accept: https://detty.example/i/hold-${table.toLowerCase()}`)}`

/**
 * Step 4 — host plus open slots up to capacity. Add from contacts, by phone, or
 * share a WhatsApp invite link. Optional deposit split with a per-guest preview.
 */
export function Guests({
  venue: planId = 'vault',
  tierId = 'booth',
  tableLabel = 'B3',
  guests: initialGuests = guestSets.justMe,
  split: initialSplit = false,
  lines = canonicalTable.lines,
  addingPhone = false,
  partySize = 6,
}: {
  venue?: FloorPlanId
  tierId?: string
  tableLabel?: string
  guests?: Guest[]
  split?: boolean
  lines?: Line[]
  addingPhone?: boolean
  partySize?: number
}) {
  const { venue, event, tiers } = bookingCtx(planId)
  const tier = tiers.find((t) => t.id === tierId)!
  const q = tableQuote(tier, lines)
  const [split, setSplit] = useState(initialSplit)
  const [phone, setPhone] = useState(addingPhone)
  const coming = initialGuests.filter((g) => g.status !== 'declined')
  const declined = initialGuests.filter((g) => g.status === 'declined')
  const open = Math.max(0, tier.capacity - coming.length)
  const share = splitDeposit(q.deposit, coming.length)
  const full = open === 0
  const wa = inviteLink(venue.name, event.title, `${dayShort(event.startsAt)} ${time(event.startsAt)}`, tableLabel)

  const row = (g: Guest) => {
    const b = statusBadge[g.status]
    const isHost = g.status === 'host'
    return (
      <li key={g.id} className={cx('flex items-center gap-3 py-2.5', g.status === 'declined' && 'opacity-60')}>
        <Avatar name={g.name} size={40} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">
            {g.name}
            {isHost && <span className="text-dim"> (you)</span>}
          </div>
          <div className="truncate text-xs text-dim">{g.phone}</div>
        </div>
        {split && g.status !== 'declined' && <span className="text-sm font-semibold tabular-nums">{cedis(isHost ? share.host : share.each)}</span>}
        <Badge tone={b.tone}>{b.label}</Badge>
      </li>
    )
  }

  return (
    <Screen
      header={
        <BookingHeader
          step={4}
          title="Guests"
          trailing={<HoldTimer />}
          context={<ContextPill event={event} partySize={partySize} arrival={arrivalSlots(event.doorsAt)[1]} />}
        />
      }
      footer={
        <BottomBar
          summary={
            <div>
              <div className="text-xs text-dim">
                Table {tableLabel} · {coming.length} of {tier.capacity}
              </div>
              <div className="truncate font-semibold">{split ? `${cedis(share.each)} each` : 'You pay the deposit'}</div>
            </div>
          }
        >
          <Button size="lg">{coming.length === 1 ? 'Skip for now' : 'Continue'}</Button>
        </BottomBar>
      }
    >
      <div className="px-5 pt-3">
        <div>
          <h2 className="display text-2xl">Who’s coming?</h2>
          <p className="text-sm text-dim">{full ? 'Table full — nice.' : `${open} open ${open === 1 ? 'spot' : 'spots'}. You can add guests after booking too.`}</p>
        </div>
      </div>

      <ul className="mt-2 divide-y divide-line px-5">
        {coming.map(row)}
        {Array.from({ length: open }, (_, i) => (
          <li key={`open-${i}`} className="flex items-center gap-3 py-2.5">
            <span className="flex size-10 items-center justify-center rounded-full border-2 border-dashed border-line text-faint">
              <UserPlus className="size-4" />
            </span>
            <span className="flex-1 text-sm text-faint">Open spot</span>
            {split && <span className="text-sm text-faint tabular-nums">—</span>}
          </li>
        ))}
        {declined.map(row)}
      </ul>

      {!full && (
        <div className="space-y-2.5 px-5 pt-4">
          <Button variant="whatsapp" block size="lg" onClick={() => window.open(wa, '_blank', 'noopener')} icon={<WhatsAppGlyph />}>
            Share invite link on WhatsApp
          </Button>
          <div className="grid grid-cols-2 gap-2.5">
            <Button variant="secondary" icon={<Contact className="size-4" />}>
              From contacts
            </Button>
            <Button variant="secondary" icon={<Phone className="size-4" />} onClick={() => setPhone((p) => !p)}>
              By phone
            </Button>
          </div>
          {phone && (
            <div className="flex items-end gap-2 pt-1">
              <TextField className="flex-1" label="Guest’s number" prefix="🇬🇭 +233" inputMode="tel" placeholder="24 555 0000" autoFocus />
              <Button className="h-13">Invite</Button>
            </div>
          )}
        </div>
      )}

      <div className="mx-5 mt-5 rounded-card border border-line bg-surface p-4">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="font-semibold">Split the deposit</div>
            <div className="text-sm text-dim">
              You pay {cedis(q.deposit)} now to lock the table. Each guest gets a link to pay their share back to you.
            </div>
          </div>
          <Toggle checked={split} onChange={setSplit} label="Split the deposit" />
        </div>
        {split && (
          <div className="mt-3 rounded-control bg-surface-2 px-3 py-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-dim">
                {cedis(q.deposit)} ÷ {coming.length} {coming.length === 1 ? 'person' : 'people'}
              </span>
              <b className="tabular-nums">{cedis(share.each)} each</b>
            </div>
            {share.host !== share.each && <div className="mt-0.5 text-xs text-faint">You cover the rounding: {cedis(share.host)}.</div>}
            <div className="mt-1 text-xs text-faint">The booking fee stays with you. Shares update as guests accept or decline.</div>
          </div>
        )}
      </div>

      <p className="mx-5 mt-4 mb-6 flex gap-2 text-xs text-dim">
        <Info className="size-4 shrink-0" />
        <span>
          <b className="text-text">+1 policy:</b> table {tableLabel} seats {tier.capacity}, and the door counts heads. Extra friends need their own ticket
          {event.ticketsFrom != null && <> (from {cedis(event.ticketsFrom)})</>}.
        </span>
      </p>
    </Screen>
  )
}

/** WhatsApp glyph (partner mark, inline so it costs no request). */
function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  )
}
