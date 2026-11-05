import { useState } from 'react'
import { ArrowUpRight, Clock, Flame, MapPin, Music2, Search as SearchIcon, X } from 'lucide-react'
import { venues } from '@/data/fixtures'
import { cedis, dayShort } from '@/lib/format'
import { NetworkBanner, Screen, StatusBar, TabBar } from '@/components/app/chrome'
import { EventCard, priceLevel, Rating } from '@/components/app/domain'
import { Avatar, Badge, Chip, Img, ListRow, SectionHeader, Skeleton } from '@/components/ui/primitives'
import { areas, recentSearches, search, tonightPrice, trendingArtists, trendingGenres, upcoming } from './discoverData'

export type SearchScope = 'all' | 'events' | 'venues' | 'artists'

/**
 * Search tab. Empty query = recent searches + trending (genres, DJs, venues).
 * Typing = results grouped Events / Venues / Artists, with a scope filter.
 */
export function Search({
  query: initialQuery = '',
  scope: initialScope = 'all',
  recent = recentSearches,
  loading,
  network,
}: {
  query?: string
  scope?: SearchScope
  recent?: string[]
  loading?: boolean
  network?: 'offline' | 'slow'
}) {
  const [query, setQuery] = useState(initialQuery)
  const [scope, setScope] = useState<SearchScope>(initialScope)
  const [recents, setRecents] = useState(recent)
  const r = search(query)
  const total = r.events.length + r.venues.length + r.artists.length
  const show = (s: SearchScope) => scope === 'all' || scope === s

  return (
    <Screen
      header={
        <div className="shrink-0 bg-bg">
          <StatusBar />
          {network && <NetworkBanner state={network} />}
          <div className="flex items-center gap-3 px-5 pt-1 pb-3">
            <label className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-control border border-line bg-surface px-4 focus-within:border-accent">
              <SearchIcon className="size-5 shrink-0 text-dim" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Events, clubs, DJs, areas"
                aria-label="Search"
                className="h-full min-w-0 flex-1 bg-transparent text-base text-text outline-none placeholder:text-faint"
              />
              {query && (
                <button aria-label="Clear search" onClick={() => setQuery('')} className="text-dim">
                  <X className="size-4" />
                </button>
              )}
            </label>
            {query && (
              <button onClick={() => setQuery('')} className="text-sm font-semibold text-accent">
                Cancel
              </button>
            )}
          </div>
          {query && !loading && (
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-3">
              {(
                [
                  ['all', `All ${total}`],
                  ['events', `Events ${r.events.length}`],
                  ['venues', `Venues ${r.venues.length}`],
                  ['artists', `Artists ${r.artists.length}`],
                ] as [SearchScope, string][]
              ).map(([s, label]) => (
                <Chip key={s} selected={scope === s} onClick={() => setScope(s)} disabled={s !== 'all' && label.endsWith(' 0')} className="disabled:opacity-40">
                  {label}
                </Chip>
              ))}
            </div>
          )}
        </div>
      }
      tabBar={<TabBar active="search" bookingsBadge={1} />}
    >
      {loading ? (
        <div className="space-y-3 px-5 pt-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-16 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !query ? (
        <div className="pb-8">
          {recents.length > 0 && (
            <section className="pb-4">
              <div className="flex items-end justify-between px-5 pb-1">
                <h2 className="display text-xl">Recent</h2>
                <button onClick={() => setRecents([])} className="text-sm font-semibold text-accent">
                  Clear
                </button>
              </div>
              <div className="px-5">
                {recents.map((s) => (
                  <ListRow
                    key={s}
                    className="py-2"
                    icon={<Clock className="size-4" />}
                    title={<span className="font-normal">{s}</span>}
                    onClick={() => setQuery(s)}
                    trailing={
                      <span
                        role="button"
                        aria-label={`Remove ${s}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setRecents(recents.filter((x) => x !== s))
                        }}
                        className="p-2 text-faint"
                      >
                        <X className="size-4" />
                      </span>
                    }
                  />
                ))}
              </div>
            </section>
          )}

          <section className="pb-6">
            <SectionHeader title="Trending in Accra" />
            <div className="flex flex-wrap gap-2 px-5">
              {trendingGenres.map((g, i) => (
                <Chip key={g} onClick={() => setQuery(g)} icon={i < 2 ? <Flame className="size-4 text-accent-3" /> : <Music2 className="size-4 text-dim" />}>
                  {g}
                </Chip>
              ))}
            </div>
          </section>

          <section className="pb-6">
            <SectionHeader title="DJs people are searching" />
            <div className="no-scrollbar flex gap-4 overflow-x-auto px-5">
              {trendingArtists.map((a) => (
                <button key={a.name} onClick={() => setQuery(a.name)} className="flex w-20 shrink-0 flex-col items-center gap-1.5 text-center">
                  <Avatar name={a.name} size={64} />
                  <span className="line-clamp-2 text-xs leading-tight font-medium">{a.name}</span>
                  <span className="text-[11px] text-faint">{a.events.length} {a.events.length === 1 ? 'night' : 'nights'}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="pb-6">
            <SectionHeader title="Popular venues" />
            <div className="divide-y divide-line px-5">
              {venues.slice(0, 3).map((v) => (
                <VenueRow key={v.id} id={v.id} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Browse by area" />
            <div className="flex flex-wrap gap-2 px-5">
              {areas.map((a) => (
                <Chip key={a} onClick={() => setQuery(a)} icon={<MapPin className="size-4 text-dim" />}>
                  {a}
                </Chip>
              ))}
            </div>
          </section>
        </div>
      ) : total === 0 ? (
        <div className="px-8 py-16 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-surface-2 text-dim">
            <SearchIcon className="size-6" />
          </div>
          <div className="display text-xl">Nothing for “{query}”</div>
          <p className="mt-2 text-sm text-dim">Check the spelling, or try a genre, a DJ or an area like Osu or East Legon.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {trendingGenres.slice(0, 3).map((g) => (
              <Chip key={g} onClick={() => setQuery(g)}>
                {g}
              </Chip>
            ))}
          </div>
        </div>
      ) : (
        <div className="pb-8">
          {show('artists') && r.artists.length > 0 && (
            <section className="pb-5">
              <SectionHeader title="Artists" className="pb-1" />
              <div className="px-5">
                {r.artists.map((a) => {
                  const next = upcoming(a.events)[0]
                  return (
                    <ListRow
                      key={a.name}
                      icon={<Avatar name={a.name} size={40} />}
                      title={a.name}
                      subtitle={`${next ? `Next ${dayShort(next.startsAt)} · ` : ''}${a.events.length} ${a.events.length === 1 ? 'night' : 'nights'}`}
                      trailing={<Badge>{a.role}</Badge>}
                      onClick={() => {}}
                    />
                  )
                })}
              </div>
            </section>
          )}
          {show('events') && r.events.length > 0 && (
            <section className="pb-5">
              <SectionHeader title="Events" className="pb-1" />
              <div className="divide-y divide-line px-5">
                {r.events.map((e) => (
                  <EventCard key={e.id} event={e} variant="row" />
                ))}
              </div>
            </section>
          )}
          {show('venues') && r.venues.length > 0 && (
            <section className="pb-5">
              <SectionHeader title="Venues" className="pb-1" />
              <div className="divide-y divide-line px-5">
                {r.venues.map((v) => (
                  <VenueRow key={v.id} id={v.id} />
                ))}
              </div>
            </section>
          )}
          <button className="mx-5 flex items-center gap-1 text-sm font-semibold text-accent">
            See “{query}” on the map <ArrowUpRight className="size-4" />
          </button>
        </div>
      )}
    </Screen>
  )
}

function VenueRow({ id }: { id: string }) {
  const v = venues.find((x) => x.id === id)!
  const p = tonightPrice(v)
  return (
    <button className="flex w-full items-center gap-3 py-2.5 text-left">
      <Img src={v.photo} alt={v.name} className="size-16 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{v.name}</div>
        <div className="truncate text-sm text-dim">
          {v.kind} · {v.area} · {priceLevel(v.priceLevel)}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-sm">
          <Rating value={v.rating} />
          {p.amount != null && (
            <span className="text-dim">
              · Tonight {p.label.toLowerCase()} from <b className="text-text">{cedis(p.amount)}</b>
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
