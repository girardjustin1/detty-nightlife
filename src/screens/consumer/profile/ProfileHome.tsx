import { BellRing, CircleHelp, CreditCard, Heart, QrCode, Settings, ShieldCheck, Ticket } from 'lucide-react'
import { bookings, eventById, events, me, tableTiers, venueById, venues } from '@/data/fixtures'
import { useBrand } from '@/brands/BrandContext'
import { Screen, StatusBar, TabBar } from '@/components/app/chrome'
import { EventCard, Rating } from '@/components/app/domain'
import { Avatar, Badge, Button, Card, IconButton, Img, SectionHeader } from '@/components/ui/primitives'
import { cedis, dayShort, time } from '@/lib/format'
import { Group, Row } from './parts'

/** Things the user asked to be pinged about when they free up. */
export const notifyList = [
  { id: 'n1', what: 'Pool cabana', venueId: 'skyline', when: 'Sat 19 Dec · 4pm–8pm', party: 8 },
  { id: 'n2', what: 'Lounge deck', venueId: 'vault', when: 'Thu 31 Dec · NYE', party: 10 },
]

/** Profile tab: who you are, what's next, what you saved, and the way into settings. */
export function ProfileHome({ newUser }: { /** Fresh account: nothing booked or saved yet. */ newUser?: boolean }) {
  const brand = useBrand()
  const next = bookings[0]
  const ev = eventById(next.eventId)
  const venue = venueById(next.venueId)
  const tier = tableTiers[next.venueId]?.find((t) => t.id === next.tierId)
  const savedEvents = events.filter((e) => ['sunset-sessions', 'nye-countdown', 'log-drum-sundays'].includes(e.id))
  const savedVenues = venues.filter((v) => ['koko', 'skyline'].includes(v.id))

  return (
    <Screen
      header={
        <div className="shrink-0 bg-bg">
          <StatusBar />
          <div className="flex items-center justify-between px-5 pt-1 pb-2">
            <h1 className="display text-3xl">Profile</h1>
            <IconButton label="Account & privacy">
              <Settings className="size-5" />
            </IconButton>
          </div>
        </div>
      }
      tabBar={<TabBar active="profile" bookingsBadge={newUser ? undefined : 1} />}
    >
      <div className="flex items-center gap-4 px-5 pt-2 pb-6">
        <Avatar name={me.name} size={64} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-xl font-semibold">{me.name}</div>
          <div className="flex items-center gap-1.5 text-sm text-dim tabular-nums">
            {me.phone} <ShieldCheck className="size-4 text-success" aria-label="Verified" />
          </div>
        </div>
        <Button variant="secondary" size="sm">
          Edit
        </Button>
      </div>

      {newUser ? (
        <div className="px-5 pb-6">
          <Card className="p-5 text-center">
            <Ticket className="mx-auto size-8 text-accent" />
            <div className="mt-2 font-semibold">{brand.copy.emptyBookings}</div>
            <p className="mt-1 text-sm text-dim">Tap the heart on any night or venue to save it here.</p>
            <Button className="mt-4" size="sm">
              Find tonight’s nights
            </Button>
          </Card>
        </div>
      ) : (
        <>
          <section className="px-5 pb-6">
            <h2 className="mb-2 px-1 text-xs font-semibold tracking-wider text-faint uppercase">Next up</h2>
            <Card className="overflow-hidden">
              <div className="flex gap-3 p-3">
                <Img src={ev.photo} alt={ev.title} className="size-20 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge tone="live">Tonight</Badge>
                    <Badge tone="success">Confirmed</Badge>
                  </div>
                  <div className="mt-1 truncate font-semibold">{ev.title}</div>
                  <div className="truncate text-sm text-dim">
                    {venue.name} · {dayShort(ev.startsAt)} · {time(ev.startsAt)}
                  </div>
                  <div className="truncate text-sm text-dim">
                    {tier?.name} · {next.partySize} guests
                  </div>
                  <div className="truncate text-xs text-faint">
                    {cedis(next.balanceDue)} due at the venue
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-line p-3">
                <Button size="sm" icon={<QrCode className="size-4" />}>
                  Show QR
                </Button>
                <Button size="sm" variant="secondary">
                  Booking details
                </Button>
              </div>
            </Card>
          </section>

          <section className="pb-6">
            <SectionHeader title="Saved nights" action="See all" />
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-5">
              {savedEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>

          <section className="pb-6">
            <SectionHeader title="Saved venues" />
            <div className="divide-y divide-line px-5">
              {savedVenues.map((v) => (
                <div key={v.id} className="flex items-center gap-3 py-2.5">
                  <Img src={v.photo} alt={v.name} className="size-14 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{v.name}</div>
                    <div className="truncate text-sm text-dim">
                      {v.kind} · {v.area}
                    </div>
                  </div>
                  <Rating value={v.rating} />
                  <Heart className="size-5 fill-accent text-accent" aria-label="Saved" />
                </div>
              ))}
            </div>
          </section>

          <Group title="Notify list" footer="We’ll message you on WhatsApp the moment one opens up. First to pay gets it.">
            {notifyList.map((n) => (
              <Row
                key={n.id}
                icon={<BellRing className="size-4" />}
                title={`${n.what} · ${venueById(n.venueId).name}`}
                subtitle={`${n.when} · ${n.party} guests`}
                trailing={<Badge tone="warning">Watching</Badge>}
              />
            ))}
          </Group>
        </>
      )}

      <Group title="Settings">
        <Row icon={<CreditCard className="size-4" />} title="Payment methods" value={newUser ? 'None yet' : 'MTN MoMo'} chevron />
        <Row icon={<ShieldCheck className="size-4" />} title="Account & privacy" chevron />
        <Row icon={<CircleHelp className="size-4" />} title="Help" subtitle="FAQ, WhatsApp chat, report an issue" chevron />
      </Group>
      <p className="px-5 pb-8 text-center text-xs text-faint">
        {brand.name} · v0.1 draft · Sample data
      </p>
    </Screen>
  )
}
