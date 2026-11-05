import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Accessibility, Ban, Bell, CalendarDays, Car, Check, ChevronRight, Clock, Flame, Heart, Images, AtSign, Map as MapIcon, MapPin, Pencil, Share2, Shirt, Sparkles, Users, Wallet } from 'lucide-react'
import { bottles, events, NOW, tableTiers, venueById } from '@/data/fixtures'
import { floorPlans } from '@/data/floorplans'
import { ticketQuote } from '@/lib/pricing'
import { cedis, cx, dayShort } from '@/lib/format'
import { BottomBar, Screen } from '@/components/app/chrome'
import { EventCard, PaymentMark, paymentLabels, priceLevel, Rating } from '@/components/app/domain'
import { FloorLegend, FloorPlan } from '@/components/app/FloorPlan'
import { Badge, Button, Card, IconButton, Img, Skeleton } from '@/components/ui/primitives'
import { DetailHeader, HEADER_H, useScrollParent } from '../event/DetailHeader'
import { InfoRow, LocationCard, WhatsAppRow } from '../event/parts'
import { RatingSummary, ReviewCard } from './parts'
import { extrasForVenue, reviewTotal } from './venueData'

export type VenueSection = 'tables' | 'events' | 'bottles' | 'reviews' | 'details'
const TABS_H = 49

/**
 * Venue detail, OpenTable-structured: hero → identity → sticky anchor tabs
 * (Tables · Events · Bottles · Reviews · Details). Tabs are scroll anchors,
 * not pages, and highlight as you scroll.
 */
export function VenueDetail({
  venueId = 'vault',
  section,
  party = 6,
  saved,
  loading,
  network,
}: {
  venueId?: string
  /** Open scrolled to this section. */
  section?: VenueSection
  party?: number
  saved?: boolean
  loading?: boolean
  network?: 'offline' | 'slow'
}) {
  const venue = venueById(venueId)
  const x = extrasForVenue(venueId)
  const tiers = tableTiers[venueId] ?? []
  const hasTables = tiers.length > 0
  const upcoming = events.filter((e) => e.venueId === venueId && e.endsAt > NOW).sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  const headerH = HEADER_H + (network ? 28 : 0)
  const { ref, scrollEl, y, scrolled } = useScrollParent<HTMLDivElement>(200)
  const secRefs = useRef<Partial<Record<VenueSection, HTMLElement | null>>>({})
  const tabs: { id: VenueSection; label: string }[] = [
    ...(hasTables ? [{ id: 'tables' as const, label: 'Tables' }] : []),
    { id: 'events', label: 'Events' },
    { id: 'bottles', label: hasTables ? 'Bottles' : 'Bar' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'details', label: 'Details' },
  ]
  const offset = headerH + TABS_H - 12
  const active = [...tabs].reverse().find((t) => (secRefs.current[t.id]?.offsetTop ?? Infinity) - offset <= y + 1)?.id ?? tabs[0].id

  const jump = (id: VenueSection, smooth = true) => {
    const el = secRefs.current[id]
    if (el && scrollEl) scrollEl.scrollTo({ top: el.offsetTop - offset, behavior: smooth ? 'smooth' : 'auto' })
  }
  useEffect(() => {
    if (section && scrollEl && !loading) jump(section, false)
  }, [section, scrollEl, loading])

  const minTable = hasTables ? Math.min(...tiers.map((t) => t.minSpend)) : null
  const nextTicketed = upcoming.find((e) => e.ticketTiers.some((t) => t.status === 'on-sale'))
  const cheapestTicket = nextTicketed?.ticketTiers.filter((t) => t.status === 'on-sale').sort((a, b) => a.price - b.price)[0]
  const tq = cheapestTicket && ticketQuote([{ tier: cheapestTicket, qty: 1 }])
  const menu = [...bottles].sort((a, b) => Number(!!b.popular) - Number(!!a.popular)).slice(0, 5)
  const plan = venue.floorPlanId && floorPlans[venue.floorPlanId]

  const sec = (id: VenueSection) => (el: HTMLElement | null) => {
    secRefs.current[id] = el
  }

  return (
    <Screen
      header={
        <DetailHeader
          title={venue.name}
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
        loading ? undefined : hasTables ? (
          <BottomBar
            summary={
              <div className="leading-tight">
                <div className="text-sm text-dim">
                  Tables from <b className="text-lg text-text">{cedis(minTable!)}</b>
                </div>
                <div className="text-xs text-faint">minimum spend · {party} guests</div>
              </div>
            }
          >
            <Button onClick={() => jump('tables')}>Book a table</Button>
          </BottomBar>
        ) : (
          <BottomBar
            summary={
              tq ? (
                <div className="leading-tight">
                  <div className="text-sm text-dim">
                    Tickets from <b className="text-lg text-text">{cedis(tq.total)}</b>
                  </div>
                  <div className="text-xs text-faint">incl. fees · general admission</div>
                </div>
              ) : (
                <div className="text-sm text-dim">No nights on sale yet</div>
              )
            }
          >
            <Button onClick={() => jump('events')}>See events</Button>
          </BottomBar>
        )
      }
    >
      <div ref={ref} className="relative pb-10">
        {/* Hero */}
        <div className="relative">
          <Img src={venue.photo} alt={venue.name} rounded={false} className="aspect-[4/3] w-full" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
          <button className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <Images className="size-4" /> See all {x.photos.length} photos
          </button>
          <span className="absolute bottom-4 left-4 flex gap-1">
            {x.photos.slice(0, 5).map((_, i) => (
              <span key={i} className={cx('h-1.5 rounded-full', i === 0 ? 'w-4 bg-white' : 'w-1.5 bg-white/50')} />
            ))}
          </span>
        </div>

        {/* Identity */}
        <div className="px-5 pt-4 pb-4">
          <h1 className="display text-[32px]">{venue.name}</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-dim">
            <Rating value={venue.rating} count={reviewTotal(x)} />
            <span>·</span>
            <span>{venue.kind}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="size-3.5" />
              {venue.area}
            </span>
            <span>·</span>
            <span className="text-text" aria-label={`Price level ${venue.priceLevel} of 4`}>
              {priceLevel(venue.priceLevel)}
              <span className="text-faint">{'₵'.repeat(4 - venue.priceLevel)}</span>
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {venue.vibe.map((v) => (
              <span key={v} className="rounded-full bg-surface-2 px-3 py-1 text-xs">
                {v}
              </span>
            ))}
            {venue.genres.map((g) => (
              <span key={g} className="rounded-full border border-line px-3 py-1 text-xs text-dim">
                {g}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm font-medium text-accent-2">
            <Flame className="size-4" />
            {x.socialProof}
          </div>
        </div>

        {/* Sticky anchor tabs */}
        <nav className="sticky z-20 flex border-b border-line bg-bg/95 px-2 backdrop-blur" style={{ top: headerH, height: TABS_H }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => jump(t.id)}
              aria-current={active === t.id ? 'true' : undefined}
              className={cx('relative flex-1 text-sm font-semibold transition', active === t.id ? 'text-text' : 'text-faint')}
            >
              {t.label}
              {active === t.id && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent" />}
            </button>
          ))}
        </nav>

        {loading ? (
          <div className="space-y-4 px-5 pt-5">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            {/* Tables */}
            {hasTables && (
              <section ref={sec('tables')} className="px-5 pt-6">
                <Heading>Tables</Heading>
                <button className="mb-4 flex w-full items-center gap-2 rounded-control border border-line bg-surface px-4 py-2.5 text-left text-sm">
                  <Users className="size-4 text-dim" />
                  <b>{party} guests</b>
                  <span className="text-faint">·</span>
                  <CalendarDays className="size-4 text-dim" />
                  <span className="min-w-0 flex-1 truncate">
                    Tonight <span className="text-dim">· {dayShort(NOW)}</span>
                  </span>
                  <Pencil className="size-4 text-accent" />
                </button>
                {x.noteForTonight && (
                  <div className="mb-4 flex gap-2 rounded-card bg-surface-2 p-3 text-sm">
                    <Clock className="mt-0.5 size-4 shrink-0 text-accent-2" />
                    <span>
                      <b>Notes for tonight.</b> <span className="text-dim">{x.noteForTonight}</span>
                    </span>
                  </div>
                )}
                <div className="space-y-3">
                  {tiers.map((t) => {
                    const left = x.tablesLeft[t.id] ?? 0
                    const fits = t.capacity >= party
                    return (
                      <Card key={t.id} className={cx('p-4', !fits && 'opacity-70')}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold">{t.name}</div>
                            <div className="text-sm text-dim">
                              Up to {t.capacity} guests · {t.depositPct}% deposit
                            </div>
                          </div>
                          {left === 0 ? <Badge tone="danger">Full tonight</Badge> : left === 1 ? <Badge tone="warning">1 left</Badge> : <Badge tone="success">{left} left</Badge>}
                        </div>
                        <ul className="mt-2.5 space-y-1 text-sm">
                          {t.perks.map((p) => (
                            <li key={p} className="flex items-center gap-2 text-dim">
                              <Check className="size-3.5 shrink-0 text-success" /> {p}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
                          <div className="text-sm">
                            <span className="text-dim">Min spend </span>
                            <b className="text-base tabular-nums">{cedis(t.minSpend)}</b>
                          </div>
                          {left === 0 ? (
                            <Button size="sm" variant="secondary" icon={<Bell className="size-4" />}>
                              Notify me
                            </Button>
                          ) : !fits ? (
                            <span className="text-xs text-faint">Too small for {party}</span>
                          ) : (
                            <Button size="sm">Choose</Button>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
                {plan && (
                  <div className="mt-4">
                    <div className="relative h-56 overflow-hidden rounded-card">
                      <div className="pointer-events-none" aria-hidden>
                        <FloorPlan plan={plan} tiers={tiers} showZones />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 flex h-24 items-end justify-center bg-gradient-to-t from-bg to-transparent pb-3">
                        <Button size="sm" variant="secondary" icon={<MapIcon className="size-4" />}>
                          Open floor plan
                        </Button>
                      </div>
                    </div>
                    <FloorLegend className="mt-2" />
                  </div>
                )}
                <button className="mt-4 flex items-center gap-1 text-sm font-semibold text-accent">
                  Find another night <ChevronRight className="size-4" />
                </button>
              </section>
            )}

            {/* Events */}
            <section ref={sec('events')} className="pt-8">
              <div className="px-5">
                <Heading>Upcoming events</Heading>
              </div>
              {upcoming.length ? (
                <div className="no-scrollbar flex gap-3 overflow-x-auto px-5">
                  {upcoming.map((e) => (
                    <EventCard key={e.id} event={e} />
                  ))}
                </div>
              ) : (
                <div className="mx-5 rounded-card border border-dashed border-line p-5 text-center">
                  <div className="font-semibold">No events announced yet</div>
                  <p className="mt-1 text-sm text-dim">Tables are bookable {venue.hours.split(' · ')[0]} anyway. Get a WhatsApp ping when the next night drops.</p>
                  <Button size="sm" variant="secondary" className="mt-3" icon={<Bell className="size-4" />}>
                    Notify me
                  </Button>
                </div>
              )}
              {!hasTables && (
                <p className="mt-3 px-5 text-sm text-dim">
                  {venue.name} is general admission only — no tables to book. Buy tickets for a night above.
                </p>
              )}
            </section>

            {/* Bottles */}
            <section ref={sec('bottles')} className="px-5 pt-8">
              <Heading>{hasTables ? 'Bottle menu' : 'Bar menu'}</Heading>
              <p className="-mt-1 mb-3 text-sm text-dim">
                {hasTables ? 'Pre-order with your table — it counts toward your minimum spend.' : 'Order at the bar on the night. Cashless: MoMo and card.'}
              </p>
              <Card className="divide-y divide-line">
                {menu.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-medium">{b.name}</span>
                        {b.showpiece && <Sparkles className="size-3.5 shrink-0 text-accent-2" aria-label="Showpiece" />}
                      </div>
                      <div className="text-xs text-dim">
                        {b.category} · {b.size}
                        {b.popular && <span className="text-accent"> · Popular</span>}
                      </div>
                    </div>
                    <div className="font-semibold tabular-nums">{cedis(b.price)}</div>
                  </div>
                ))}
              </Card>
              <Button variant="secondary" block className="mt-3">
                See full menu · {bottles.length} items
              </Button>
            </section>

            {/* Reviews */}
            <section ref={sec('reviews')} className="px-5 pt-8">
              <Heading>Reviews</Heading>
              <RatingSummary rating={venue.rating} distribution={x.distribution} sub={x.sub} />
              <div className="mt-2 divide-y divide-line">
                {x.reviews.slice(0, 2).map((r) => (
                  <ReviewCard key={r.id} review={r} compact venueName={venue.name} />
                ))}
              </div>
              <Button variant="secondary" block>
                See all {reviewTotal(x).toLocaleString()} reviews
              </Button>
            </section>

            {/* Details */}
            <section ref={sec('details')} className="px-5 pt-8">
              <Heading>Details</Heading>
              <p className="text-[15px] leading-relaxed text-dim">{venue.about}</p>
              <div className="mt-2 divide-y divide-line">
                <InfoRow icon={<Clock className="size-5" />} label="Hours">
                  {venue.hours}
                </InfoRow>
                <InfoRow icon={<Shirt className="size-5" />} label="Dress code">
                  {venue.dressCode}
                </InfoRow>
                <InfoRow icon={<Ban className="size-5" />} label="Age">
                  {venue.minAge}+ <span className="text-dim">· Ghana Card or passport at the door</span>
                </InfoRow>
                <InfoRow icon={<Car className="size-5" />} label="Parking">
                  {venue.parking}
                </InfoRow>
                <InfoRow icon={<Wallet className="size-5" />} label="Payments accepted">
                  <div className="mt-1 flex flex-wrap gap-2">
                    {x.payments.map((p) => (
                      <span key={p} className="inline-flex items-center gap-1.5 rounded-control border border-line py-1 pr-2.5 pl-1 text-xs">
                        <PaymentMark method={p} size={22} />
                        {paymentLabels[p].short}
                      </span>
                    ))}
                  </div>
                </InfoRow>
                <InfoRow icon={<Accessibility className="size-5" />} label="Accessibility">
                  {x.accessibility}
                </InfoRow>
              </div>
              <div className="mt-3">
                <LocationCard venue={venue} />
              </div>
              <WhatsAppRow className="mt-2" message={`Hi! I'd like to book a table at ${venue.name} on ${dayShort(NOW)}`} />
              <Button variant="secondary" size="sm" block icon={<AtSign className="size-4" />}>
                {x.instagram}
              </Button>
            </section>
          </>
        )}
      </div>
    </Screen>
  )
}

function Heading({ children }: { children: ReactNode }) {
  return <h2 className="display mb-3 text-2xl">{children}</h2>
}

