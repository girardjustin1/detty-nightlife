import { useState } from 'react'
import { Bell, CalendarDays, ChevronDown, Map, SlidersHorizontal } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { events, tableTiers, venues } from '@/data/fixtures'
import type { Genre } from '@/data/types'
import { Screen, StatusBar, TabBar, Logo, NetworkBanner } from '@/components/app/chrome'
import { EventCard, VenueCard } from '@/components/app/domain'
import { Chip, IconButton, SectionHeader, Segmented, Skeleton } from '@/components/ui/primitives'

export type DiscoverView = 'events' | 'venues'

const genreFilters: ('All' | Genre)[] = ['All', 'Afrobeats', 'Amapiano', 'Afro House', 'Highlife', 'Hiplife', 'Dancehall']

export function Discover({
  view: initialView = 'events',
  genre: initialGenre = 'All',
  loading,
  network,
}: {
  view?: DiscoverView
  genre?: 'All' | Genre
  loading?: boolean
  network?: 'offline' | 'slow'
}) {
  const brand = useBrand()
  const [view, setView] = useState<DiscoverView>(initialView)
  const [genre, setGenre] = useState(initialGenre)
  const list = genre === 'All' ? events : events.filter((e) => e.genres.includes(genre))
  const tonight = list.filter((e) => e.startsAt.startsWith('2026-12-18'))
  const weekend = list.filter((e) => e.startsAt >= '2026-12-19' && e.startsAt < '2026-12-21')
  const later = list.filter((e) => e.startsAt >= '2026-12-21')
  const featured = list.find((e) => e.hot) ?? list[0]

  return (
    <Screen
      header={
        <div className="shrink-0 bg-bg">
          <StatusBar />
          {network && <NetworkBanner state={network} />}
          <div className="flex items-center justify-between px-5 pt-1 pb-3">
            <Logo className="h-7 w-auto" />
            <div className="flex gap-2">
              <IconButton label="Map">
                <Map className="size-5" />
              </IconButton>
              <IconButton label="Notifications">
                <Bell className="size-5" />
              </IconButton>
            </div>
          </div>
          <div className="px-5 pb-3">
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: 'events', label: 'Events' },
                { value: 'venues', label: 'Clubs & lounges' },
              ]}
            />
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-3">
            <Chip icon={<CalendarDays className="size-4" />}>
              Accra · This week <ChevronDown className="size-4" />
            </Chip>
            <Chip icon={<SlidersHorizontal className="size-4" />}>Filters</Chip>
            {genreFilters.map((g) => (
              <Chip key={g} selected={genre === g} onClick={() => setGenre(g)}>
                {g}
              </Chip>
            ))}
          </div>
        </div>
      }
      tabBar={<TabBar active="discover" bookingsBadge={1} />}
    >
      <div className="px-5 pt-1 pb-2 text-sm text-dim">{brand.copy.homeGreeting}</div>

      {loading ? (
        <div className="space-y-4 px-5">
          <Skeleton className="aspect-[4/5] w-full" />
          <Skeleton className="h-6 w-40" />
          <div className="flex gap-3">
            <Skeleton className="h-40 w-56" />
            <Skeleton className="h-40 w-56" />
          </div>
        </div>
      ) : view === 'events' ? (
        <div className="pb-6">
          {featured && (
            <div className="px-5 pb-6">
              <EventCard event={featured} variant="hero" />
            </div>
          )}
          {tonight.length > 0 && (
            <section className="pb-6">
              <SectionHeader title="Tonight" action="See all" />
              <div className="no-scrollbar flex gap-3 overflow-x-auto px-5">
                {tonight.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </section>
          )}
          {weekend.length > 0 && (
            <section className="pb-6">
              <SectionHeader title="This weekend" action="See all" />
              <div className="no-scrollbar flex gap-3 overflow-x-auto px-5">
                {weekend.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </section>
          )}
          {later.length > 0 && (
            <section>
              <SectionHeader title="Detty December" />
              <div className="divide-y divide-line px-5">
                {later.map((e) => (
                  <EventCard key={e.id} event={e} variant="row" />
                ))}
              </div>
            </section>
          )}
          {list.length === 0 && <div className="px-5 py-16 text-center text-dim">No {genre} nights this week. Turn on alerts and we’ll ping you on WhatsApp.</div>}
        </div>
      ) : (
        <div className="divide-y divide-line px-5 pb-6">
          {venues
            .filter((v) => genre === 'All' || v.genres.includes(genre))
            .map((v, i) => {
              const tonightAt = events.find((e) => e.venueId === v.id && e.startsAt.startsWith('2026-12-18'))
              return (
                <VenueCard
                  key={v.id}
                  venue={v}
                  tonight={tonightAt?.title}
                  tiers={tableTiers[v.id]?.map((t, j) => ({ ...t, left: (i + j) % 3 === 2 ? 0 : 3 - j }))}
                />
              )
            })}
        </div>
      )}
    </Screen>
  )
}
