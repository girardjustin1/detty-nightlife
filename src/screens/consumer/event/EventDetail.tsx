import type { ReactNode } from 'react'
import { Ban, CalendarPlus, Car, ChevronRight, Clock, Heart, Info, QrCode, RotateCcw, Share2, Shirt, Ticket, Users, Wine } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { eventById, venueById } from '@/data/fixtures'
import type { TicketTier } from '@/data/types'
import { RULES, ticketQuote } from '@/lib/pricing'
import { cedis, cx, dayLong, dayShort, time } from '@/lib/format'
import { BottomBar, Screen } from '@/components/app/chrome'
import { DateBadge, GenreTags } from '@/components/app/domain'
import { AvatarStack, Avatar, Badge, Button, Card, IconButton, Img, SectionHeader, Skeleton } from '@/components/ui/primitives'
import { DetailHeader, useScrollParent } from './DetailHeader'
import { extrasFor } from './eventData'
import { EnergyMeter, InfoRow, LocationCard, TrackPreview, WhatsAppRow } from './parts'

export type EventState = 'on-sale' | 'sold-out' | 'past'

const roleTone = { Headliner: 'accent', Live: 'live', Support: 'neutral', DJ: 'neutral', Host: 'neutral' } as const

/**
 * Event detail (DICE event page + SeatGeek GA hero + OpenTable "Notes for
 * tonight"). Bottom bar adapts to what the night sells: tickets, tables, both,
 * sold out (waitlist) or past.
 */
export function EventDetail({
  eventId = 'afrobeats-til-dawn',
  state = 'on-sale',
  saved,
  playingTrack,
  loading,
  network,
}: {
  eventId?: string
  state?: EventState
  saved?: boolean
  /** Act name whose preview is shown playing (stories only). */
  playingTrack?: string
  loading?: boolean
  network?: 'offline' | 'slow'
}) {
  const event = eventById(eventId)
  const venue = venueById(event.venueId)
  const x = extrasFor(eventId)
  const brand = useBrand()
  const { ref, scrolled } = useScrollParent<HTMLDivElement>(380)

  const tiers: TicketTier[] = state === 'sold-out' ? event.ticketTiers.map((t) => ({ ...t, status: 'sold-out', remaining: 0 })) : event.ticketTiers
  const cheapest = tiers.filter((t) => t.status === 'on-sale').sort((a, b) => a.price - b.price)[0]
  const q = cheapest && ticketQuote([{ tier: cheapest, qty: 1 }])
  const hasTickets = event.ticketTiers.length > 0
  const hasTables = event.tablesFrom != null
  const past = state === 'past'
  const soldOut = state === 'sold-out'
  const holdUntil = time(new Date(Date.parse(event.doorsAt) + RULES.holdMinutesAfterDoors * 60e3).toISOString())

  const refundLines = RULES.refund.map((r) => `${r.pct}% ${r.label.toLowerCase()}`).join('; ')

  return (
    <Screen
      header={
        <DetailHeader
          title={event.title}
          solid={scrolled}
          network={network}
          trailing={(tone) => (
            <>
              <IconButton label="Share" tone={tone}>
                <Share2 className="size-5" />
              </IconButton>
              <IconButton label={saved ? 'Saved' : 'Save'} tone={tone}>
                <Heart className={cx('size-5', saved && 'fill-accent text-accent')} />
              </IconButton>
            </>
          )}
        />
      }
      footer={
        loading ? undefined : past ? (
          <BottomBar summary={<Summary top="This night has ended" bottom={dayShort(event.startsAt)} />}>
            <Button variant="secondary">More at {venue.name.replace(' Supper Club', '')}</Button>
          </BottomBar>
        ) : soldOut ? (
          <BottomBar>
            <div className="mb-2.5 flex items-baseline justify-between gap-3 text-sm">
              <b className="text-danger">Tickets sold out</b>
              <span className="truncate text-xs text-dim">{x.waitlist ? `${x.waitlist} people on the waitlist` : 'Returns go to the waitlist'}</span>
            </div>
            <div className={cx('grid gap-2', hasTables ? 'grid-cols-2' : 'grid-cols-1')}>
              {hasTables && <Button variant="secondary">Book a table</Button>}
              <Button>Join waitlist</Button>
            </div>
          </BottomBar>
        ) : (
          <BottomBar
            summary={
              hasTickets && q ? (
                <Summary top={<>from <b className="text-lg text-text">{cedis(q.total)}</b></>} bottom={`incl. ${cedis(q.fee)} fee`} />
              ) : (
                <Summary top={<>Tables <b className="text-lg text-text">{cedis(event.tablesFrom!)}</b></>} bottom="minimum spend" />
              )
            }
          >
            <div className="flex gap-2">
              {hasTables && (
                <Button variant={hasTickets ? 'secondary' : 'primary'} className="px-4">
                  Book a table
                </Button>
              )}
              {hasTickets && <Button className="px-4">Get tickets</Button>}
            </div>
          </BottomBar>
        )
      }
    >
      <div ref={ref} className="pb-8">
        {/* Hero */}
        <div className="relative">
          <Img src={event.photo} alt={event.title} rounded={false} className={cx('aspect-[4/5] w-full', past && 'grayscale-[60%]')} />
          <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-5 text-white">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {past ? (
                <Badge tone="glass">Past event</Badge>
              ) : soldOut ? (
                <Badge tone="live">Sold out</Badge>
              ) : (
                event.tags.map((t) => (
                  <Badge key={t} tone={t === 'Selling fast' || t === 'Almost gone' ? 'live' : 'glass'}>
                    {t}
                  </Badge>
                ))
              )}
              <Badge tone="glass">{event.minAge}+</Badge>
            </div>
            <h1 className="display text-[34px]">{event.title}</h1>
            <div className="mt-1.5 text-sm text-white/85">{event.lineup.filter((a) => a.role !== 'Host').map((a) => a.name).join(' · ')}</div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 px-5 pt-5">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            {/* When + where */}
            <div className="px-5 pt-5">
              <div className="flex items-center gap-3">
                <DateBadge iso={event.startsAt} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{dayLong(event.startsAt)}</div>
                  <div className="text-sm text-dim">
                    {time(event.startsAt)} – {time(event.endsAt)} · Doors {time(event.doorsAt)}
                  </div>
                </div>
                {!past && (
                  <IconButton label="Add to calendar">
                    <CalendarPlus className="size-5" />
                  </IconButton>
                )}
              </div>
              <button className="mt-3 flex w-full items-center gap-3 rounded-card border border-line bg-surface p-2.5 text-left">
                <Img src={venue.photo} alt={venue.name} className="size-12 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{venue.name}</div>
                  <div className="truncate text-sm text-dim">
                    {venue.kind} · {venue.area} · ★ {venue.rating.toFixed(1)}
                  </div>
                </div>
                <ChevronRight className="size-5 text-faint" />
              </button>
            </div>

            {/* State callouts */}
            {soldOut && (
              <div className="mx-5 mt-4 flex gap-3 rounded-card border border-warning/40 bg-warning/5 p-4 text-sm">
                <Info className="mt-0.5 size-4 shrink-0 text-warning" />
                <div>
                  <b>Tickets are gone.</b> <span className="text-dim">Join the waitlist and we’ll WhatsApp you if anyone returns a ticket — first come, first served, 15 minutes to pay.</span>
                  {hasTables && <div className="mt-1 text-dim">Tables can still be booked — entry is included for your whole party.</div>}
                </div>
              </div>
            )}
            {past && (
              <div className="mx-5 mt-4 rounded-card border border-line bg-surface p-4 text-sm">
                <b>You missed this one</b> <span className="text-dim">— or did you? Booked guests can find their receipt in Bookings → Past.</span>
              </div>
            )}

            {/* Friends */}
            {x.friendsGoing.length > 0 && (
              <div className="mx-5 mt-4 flex items-center gap-3 rounded-card bg-surface-2 p-3">
                <AvatarStack names={x.friendsGoing} max={3} size={32} />
                <div className="min-w-0 flex-1 text-sm">
                  <b>{x.friendsGoing[0].split(' ')[0]}</b>
                  {x.friendsGoing.length > 1 && <> and {x.friendsGoing.length - 1} {x.friendsGoing.length === 2 ? 'friend' : 'friends'}</>}{' '}
                  <span className="text-dim">{past ? 'went' : 'are going'}</span>
                </div>
                {!past && (
                  <Button variant="whatsapp" size="sm">
                    Invite
                  </Button>
                )}
              </div>
            )}

            {/* About */}
            <section className="px-5 pt-6">
              <h2 className="display mb-2 text-xl">About</h2>
              <p className="text-[15px] leading-relaxed text-dim">{event.description}</p>
            </section>

            {/* Lineup */}
            <section className="pt-6">
              <SectionHeader title="Who’s playing" />
              <div className="space-y-3 px-5">
                {event.lineup.map((a) => {
                  const tr = x.tracks[a.name]
                  return (
                    <div key={a.name} className="flex gap-3">
                      <Avatar name={a.name} size={48} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-semibold">{a.name}</span>
                          <Badge tone={roleTone[a.role]}>{a.role}</Badge>
                        </div>
                        {tr ? (
                          <div className="mt-1.5">
                            <TrackPreview title={tr.title} kb={tr.kb} playing={playingTrack === a.name} />
                          </div>
                        ) : (
                          <div className="text-sm text-dim">{a.role === 'Host' ? 'On the mic all night' : 'No preview yet'}</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="mt-2 px-5 text-xs text-faint">Previews load only when you tap play.</p>
            </section>

            {/* Music & vibe */}
            <section className="px-5 pt-6">
              <h2 className="display mb-3 text-xl">Music & vibe</h2>
              <Card className="divide-y divide-line">
                <div className="p-4">
                  <div className="mb-2 text-xs font-semibold tracking-wide text-faint uppercase">Genres</div>
                  <GenreTags genres={event.genres} />
                </div>
                <div className="p-4">
                  <div className="mb-2 text-xs font-semibold tracking-wide text-faint uppercase">Energy</div>
                  <EnergyMeter value={x.energy} label={x.energyLabel} />
                </div>
                <div className="p-4">
                  <div className="mb-1 text-xs font-semibold tracking-wide text-faint uppercase">Crowd</div>
                  <div className="text-sm">{x.crowd}</div>
                </div>
                {x.soundsLike.length > 0 && (
                  <div className="p-4">
                    <div className="mb-2 text-xs font-semibold tracking-wide text-faint uppercase">Sounds like</div>
                    <div className="flex flex-wrap gap-1.5">
                      {x.soundsLike.map((s) => (
                        <span key={s} className="rounded-full bg-surface-2 px-3 py-1 text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </section>

            {/* Tickets preview */}
            {hasTickets && !past && (
              <section className="px-5 pt-6">
                <h2 className="display mb-3 text-xl">Tickets</h2>
                <Card className="divide-y divide-line">
                  {tiers.map((t) => {
                    const tq = ticketQuote([{ tier: t, qty: 1 }])
                    const off = t.status !== 'on-sale'
                    return (
                      <div key={t.id} className={cx('flex items-center gap-3 p-4', off && 'opacity-60')}>
                        <Ticket className="size-5 shrink-0 text-dim" />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold">{t.name}</div>
                          <div className="truncate text-sm text-dim">{t.description}</div>
                        </div>
                        <div className="text-right">
                          {off ? (
                            <Badge tone="danger">Sold out</Badge>
                          ) : (
                            <>
                              <div className="font-semibold tabular-nums">{cedis(tq.total)}</div>
                              <div className="text-xs text-dim">incl. {cedis(tq.fee)} fee</div>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </Card>
              </section>
            )}

            {/* Good to know */}
            <section className="px-5 pt-6">
              <h2 className="display mb-1 text-xl">Good to know</h2>
              <div className="divide-y divide-line">
                <InfoRow icon={<Shirt className="size-5" />} label="Dress code">
                  {venue.dressCode.startsWith(event.dressCode) ? venue.dressCode : <>{event.dressCode}. <span className="text-dim">{venue.dressCode}</span></>}
                </InfoRow>
                <InfoRow icon={<Ban className="size-5" />} label="Age">
                  {event.minAge}+ only. <span className="text-dim">Bring your Ghana Card or passport — ID is checked at the door.</span>
                </InfoRow>
                <InfoRow icon={<QrCode className="size-5" />} label="How entry works">
                  Your QR code is in the app and <b>works offline</b>. <span className="text-dim">It refreshes every few seconds, so screenshots won’t scan.</span>
                </InfoRow>
                <InfoRow icon={<RotateCcw className="size-5" />} label="Refunds & transfers">
                  {hasTickets && (
                    <>
                      Transfer tickets free to a friend until doors. <span className="text-dim">Ticket refunds only if the night is cancelled or moved.</span>{' '}
                    </>
                  )}
                  {hasTables && <span className="text-dim">Table deposits: {refundLines}.</span>}
                </InfoRow>
                {hasTables && (
                  <InfoRow icon={<Wine className="size-5" />} label="Tables">
                    From {cedis(event.tablesFrom!)} minimum spend. <span className="text-dim">Bottles you pre-order count toward it.</span>
                  </InfoRow>
                )}
                {!past && x.notesForTonight.length > 0 && (
                  <InfoRow icon={<Clock className="size-5" />} label="Notes for tonight">
                    <ul className="space-y-1">
                      {hasTables && <li>Tables are held until {holdUntil}, then released.</li>}
                      {x.notesForTonight.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </InfoRow>
                )}
                <InfoRow icon={<Users className="size-5" />} label="Sold by">
                  {venue.name} <span className="text-dim">via {brand.name}. Pay by MoMo, card or Lightning.</span>
                </InfoRow>
                {!past && (
                  <WhatsAppRow
                    message={
                      hasTables
                        ? `Hi! I'd like to book a table at ${venue.name} on ${dayShort(event.startsAt)}`
                        : `Hi! I'd like tickets for ${event.title} at ${venue.name} on ${dayShort(event.startsAt)}`
                    }
                  />
                )}
              </div>
            </section>

            {/* Location */}
            <section className="px-5 pt-6">
              <h2 className="display mb-3 text-xl">Location</h2>
              <LocationCard venue={venue} note={<><Car className="inline size-3.5" /> {venue.parking}</>} />
            </section>
          </>
        )}
      </div>
    </Screen>
  )
}

function Summary({ top, bottom }: { top: ReactNode; bottom: ReactNode }) {
  return (
    <div className="leading-tight">
      <div className="text-sm text-dim">{top}</div>
      <div className="truncate text-xs text-faint">{bottom}</div>
    </div>
  )
}
