import type { ReactNode } from 'react'
import { CalendarPlus, Check, Hourglass, MapPin, MessageCircle, Navigation, Share2, Ticket, WifiOff, X } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { BottomBar, Screen, StatusBar } from '@/components/app/chrome'
import { FakeQR, PolicyBlock, PriceLines } from '@/components/app/domain'
import { Avatar, Badge, Button, Chip, IconButton, Img } from '@/components/ui/primitives'
import { me, venueById } from '@/data/fixtures'
import { cedis, cx, dayShort, time } from '@/lib/format'
import { canonicalTable, RULES, tableQuote, ticketQuote } from '@/lib/pricing'
import { Steps } from './PayParts'
import { canonicalEvent, canonicalTier, canonicalVenue, defaultTicketSelection, depositPolicy, loungeTier, otherGuests, ticketEvent, ticketLines } from './payData'

const occasions = ['Birthday', 'December in Accra', 'Anniversary', 'Corporate', 'Just because']

function Hero({ photo, title, kicker, sub, tone = 'success' }: { photo: string; title: ReactNode; kicker: ReactNode; sub: ReactNode; tone?: 'success' | 'warning' }) {
  return (
    <div className="relative">
      <Img src={photo} alt="" rounded={false} className="aspect-[4/3] w-full" />
      <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
      <div className="absolute inset-x-0 bottom-0 px-5 pb-4 text-white">
        <Badge tone="glass" className="mb-2">
          {tone === 'success' ? <Check className="size-3.5 text-success" strokeWidth={3} /> : <Hourglass className="size-3.5 text-warning" />}
          {kicker}
        </Badge>
        <h1 className="display text-[32px] leading-tight">{title}</h1>
        <div className="mt-1 text-sm text-white/85">{sub}</div>
      </div>
    </div>
  )
}

/** Status bar + close over the hero photo (AppBar's transparent mode puts the button under the clock). */
function OverlayHeader() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/70 via-black/30 to-transparent pb-6">
      <StatusBar tone="overlay" />
      <div className="pointer-events-auto w-fit px-3 pt-11">
        <IconButton label="Close" tone="glass">
          <X className="size-5" />
        </IconButton>
      </div>
    </div>
  )
}

function Fact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] font-semibold tracking-wide text-dim uppercase">{label}</div>
      <div className="truncate font-semibold">{value}</div>
    </div>
  )
}

function QuickActions({ share }: { share?: boolean }) {
  const items = [
    { icon: <CalendarPlus className="size-5" />, label: 'Add to calendar' },
    { icon: <Navigation className="size-5" />, label: 'Directions' },
    ...(share ? [{ icon: <Share2 className="size-5" />, label: 'Share' }] : []),
  ]
  return (
    <div className={cx('grid gap-2', share ? 'grid-cols-3' : 'grid-cols-2')}>
      {items.map((a) => (
        <button key={a.label} className="flex flex-col items-center gap-1.5 rounded-card border border-line bg-surface py-3 text-xs font-semibold">
          <span className="text-accent">{a.icon}</span>
          {a.label}
        </button>
      ))}
    </div>
  )
}

function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="display text-lg">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

/** Resy-style confirmed screen for a table booking. */
export function ConfirmedTable({ occasion, partySize = canonicalTier.capacity }: { occasion?: string; partySize?: number }) {
  const brand = useBrand()
  const q = tableQuote(canonicalTier, canonicalTable.lines)
  const ev = canonicalEvent
  const ref = 'ACC-7Q4K'
  const invite = otherGuests.slice(0, partySize - 1)
  const arriveBy = new Date(new Date(ev.doorsAt).getTime() + RULES.holdMinutesAfterDoors * 60_000).toISOString()
  return (
    <Screen
      header={<OverlayHeader />}
      footer={
        <BottomBar>
          <Button block size="lg" variant="whatsapp" icon={<MessageCircle className="size-5" />}>
            Invite guests on WhatsApp
          </Button>
        </BottomBar>
      }
    >
      <Hero photo={ev.photo} kicker="Deposit paid" title={brand.copy.confirmedTitle} sub={`${ev.title} · ${canonicalVenue.name}`} />
      <div className="space-y-6 px-5 pt-4 pb-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-card border border-line bg-surface p-4">
          <Fact label="Table" value={`${canonicalTier.name} ${canonicalTable.tableId}`} />
          <Fact label="Guests" value={`${partySize} people`} />
          <Fact label="Date" value={`${dayShort(ev.startsAt)} · ${time(ev.startsAt)}`} />
          <Fact label="Arrive by" value={time(arriveBy)} />
        </div>

        <div className="flex items-center gap-4 rounded-card border border-line bg-surface p-4">
          <FakeQR seed={ref} size={112} />
          <div className="min-w-0">
            <div className="font-semibold">Host QR · show at the door</div>
            <div className="mt-0.5 text-sm text-dim">Booking {ref}</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-faint">
              <WifiOff className="size-3.5" /> Works offline. Also in Bookings.
            </div>
          </div>
        </div>

        <QuickActions share />

        <Section title="Money">
          <div className="rounded-card border border-line bg-surface p-4">
            <PriceLines
              lines={[
                { label: 'Deposit', value: q.deposit },
                { label: 'Booking fee', value: q.fee, muted: true },
              ]}
              total={q.dueNow}
              totalLabel="Paid today · MTN MoMo"
            />
            <div className="mt-3 flex items-baseline justify-between rounded-control bg-surface-2 px-3 py-2.5 text-sm">
              <span className="text-dim">Balance at the venue</span>
              <b className="tabular-nums">{cedis(q.balanceAtVenue)}</b>
            </div>
            <p className="mt-2 text-xs text-faint">Settled at the table on the night, plus the venue’s {RULES.venueServicePct}% service charge.</p>
          </div>
        </Section>

        <Section title="Your guests" action={<span className="text-sm text-dim">{invite.length} to invite</span>}>
          <ul className="divide-y divide-line rounded-card border border-line bg-surface px-4">
            {invite.map((g) => (
              <li key={g.id} className="flex items-center gap-3 py-2.5">
                <Avatar name={g.name} size={34} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{g.name}</span>
                <span className="text-xs text-faint">Not sent</span>
              </li>
            ))}
          </ul>
        </Section>

        <div className="rounded-card border border-dashed border-line p-4">
          <div className="font-semibold">{occasion ? `Celebrating: ${occasion}` : 'Celebrating something?'}</div>
          <div className="text-sm text-dim">{occasion ? 'The venue has been told. Add a note any time from Bookings.' : 'Optional. Tell the venue and they can plan a surprise.'}</div>
          <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
            {occasions.map((o) => (
              <Chip key={o} selected={occasion === o}>
                {o}
              </Chip>
            ))}
          </div>
        </div>

        <Section title="Policy">
          <PolicyBlock items={depositPolicy(ev.startsAt, q.deposit, q.fee, ev.doorsAt)} />
        </Section>
      </div>
    </Screen>
  )
}

/** Confirmed screen for tickets: they live in Bookings and work offline. */
export function ConfirmedTickets({ selection = defaultTicketSelection, sentTo }: { selection?: Record<string, number>; sentTo?: string[] }) {
  const brand = useBrand()
  const ev = ticketEvent
  const venue = venueById(ev.venueId)
  const lines = ticketLines(ev.id, selection)
  const q = ticketQuote(lines)
  const tickets = lines.flatMap((l) => Array.from({ length: l.qty }, () => l.tier.name))
  return (
    <Screen
      header={<OverlayHeader />}
      footer={
        <BottomBar>
          <Button block size="lg" icon={<Ticket className="size-5" />}>
            View tickets
          </Button>
        </BottomBar>
      }
    >
      <Hero photo={ev.photo} kicker={`${q.count} ticket${q.count === 1 ? '' : 's'} · paid`} title={brand.copy.confirmedTitle} sub={`${ev.title} · ${dayShort(ev.startsAt)} · ${venue.name}`} />
      <div className="space-y-6 px-5 pt-4 pb-8">
        <div className="flex items-center gap-4 rounded-card border border-line bg-surface p-4">
          <FakeQR seed={`${ev.id}-1`} size={96} />
          <div className="min-w-0">
            <div className="font-semibold">Your tickets are in Bookings</div>
            <div className="mt-0.5 text-sm text-dim">They work offline — no signal needed at the door.</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-faint">
              <WifiOff className="size-3.5" /> Doors {time(ev.doorsAt)} · {ev.minAge}+ · ID required
            </div>
          </div>
        </div>

        <QuickActions />

        <Section title="Send tickets to friends" action={<span className="text-sm text-dim">{tickets.length} tickets</span>}>
          <ul className="divide-y divide-line rounded-card border border-line bg-surface px-4">
            {tickets.map((tier, i) => {
              const holder = i === 0 ? me.name : sentTo?.[i - 1]
              return (
                <li key={i} className="flex items-center gap-3 py-2.5">
                  {holder ? <Avatar name={holder} size={34} /> : <span className="flex size-[34px] items-center justify-center rounded-full border border-dashed border-line text-xs text-faint">{i + 1}</span>}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{holder ?? `Ticket ${i + 1}`}</span>
                    <span className="block truncate text-xs text-dim">
                      {tier} · {i === 0 ? 'You' : holder ? 'Sent on WhatsApp' : 'Not sent'}
                    </span>
                  </span>
                  {i > 0 &&
                    (holder ? (
                      <Badge tone="success">Sent</Badge>
                    ) : (
                      <Button size="sm" variant="whatsapp" icon={<MessageCircle className="size-4" />}>
                        Send
                      </Button>
                    ))}
                </li>
              )
            })}
          </ul>
          <p className="text-xs text-faint">Each friend gets their own QR, which moves to their Bookings once sent.</p>
        </Section>

        <Section title="Paid">
          <div className="rounded-card border border-line bg-surface p-4">
            <PriceLines
              lines={[...lines.map((l) => ({ label: `${l.qty} × ${l.tier.name}`, value: l.tier.price * l.qty })), { label: 'Booking fee', value: q.fee, muted: true }]}
              total={q.total}
              totalLabel="Total · MTN MoMo"
            />
          </div>
        </Section>

        <button className="flex w-full items-center gap-3 rounded-card border border-line bg-surface p-4 text-left">
          <MapPin className="size-5 shrink-0 text-accent" />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">Make it a table?</span>
            <span className="block text-sm text-dim">Tables at {venue.name} tonight from {cedis(ev.tablesFrom ?? 0)} minimum spend.</span>
          </span>
        </button>
      </div>
    </Screen>
  )
}

/** Large parties: deposit paid, the venue still has to approve. */
export function ConfirmedPendingApproval({ partySize = loungeTier.capacity }: { partySize?: number }) {
  const q = tableQuote(loungeTier, canonicalTable.lines)
  const ev = canonicalEvent
  return (
    <Screen
      header={<OverlayHeader />}
      footer={
        <BottomBar>
          <Button block size="lg" variant="whatsapp" icon={<MessageCircle className="size-5" />}>
            Tell your guests it’s pending
          </Button>
        </BottomBar>
      }
    >
      <Hero photo={canonicalVenue.photo} tone="warning" kicker="Waiting for the venue" title="Booking pending venue approval" sub={`${loungeTier.name} L1 · ${partySize} guests · ${dayShort(ev.startsAt)}`} />
      <div className="space-y-6 px-5 pt-4 pb-8">
        <div className="rounded-card border border-warning/40 bg-warning/5 p-4">
          <div className="font-semibold">Parties of {partySize} need {canonicalVenue.name}’s OK</div>
          <p className="mt-1 text-sm text-dim">
            Your table is held while they review it. We’ll message you on WhatsApp the moment they reply. If they say no, your full {cedis(q.dueNow)} comes back to the same MoMo number automatically.
          </p>
        </div>

        <div className="rounded-card border border-line bg-surface p-4">
          <Steps
            steps={[
              { title: `Deposit paid · ${cedis(q.dueNow)}`, body: 'MTN MoMo · 024 555 0142', state: 'done' },
              { title: 'Venue reviewing your request', body: 'They check the guest list and the lounge deck for that night.', state: 'active' },
              { title: 'Confirmed — your host QR appears', body: 'Then invite guests and pre-order more bottles.', state: 'todo' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-card border border-line bg-surface p-4">
          <Fact label="Minimum spend" value={cedis(q.minimum)} />
          <Fact label="Deposit" value={`${cedis(q.deposit)} (${loungeTier.depositPct}%)`} />
          <Fact label="Booking fee" value={cedis(q.fee)} />
          <Fact label="Balance at venue" value={cedis(q.balanceAtVenue)} />
        </div>

        <Section title="Policy">
          <PolicyBlock
            items={[
              { title: 'If the venue declines', body: `Full refund of ${cedis(q.dueNow)}, including the booking fee.` },
              ...depositPolicy(ev.startsAt, q.deposit, q.fee, ev.doorsAt),
            ]}
          />
        </Section>
        <Button block variant="ghost">
          Cancel request
        </Button>
      </div>
    </Screen>
  )
}
